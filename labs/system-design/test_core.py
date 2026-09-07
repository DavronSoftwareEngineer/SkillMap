import tempfile
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from core import (Actor, Conflict, cancel, capacity, connect, counts, deliver,
                  error_budget, initialize, read_booking, reserve, snapshot)


class ArchitectureLab(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / 'source.db'
        self.actor = Actor('tenant-a', 'user-1')
        initialize(self.path)

    def test_request_retry(self):
        first = reserve(self.path, self.actor, 'concert', 'A12', 'op-1')
        # Response lost after commit: the same command recovers the same result.
        self.assertEqual(first, reserve(self.path, self.actor, 'concert', 'A12', 'op-1'))
        self.assertEqual(counts(self.path), {'booking': 1, 'outbox': 1, 'effect': 0})

    def test_changed_payload(self):
        reserve(self.path, self.actor, 'concert', 'A12', 'op-1')
        with self.assertRaises(Conflict):
            reserve(self.path, self.actor, 'concert', 'A13', 'op-1')

    def test_parallel_seat(self):
        barrier = threading.Barrier(2)
        def attempt(user):
            barrier.wait(timeout=5)
            try:
                reserve(self.path, Actor('tenant-a', user), 'concert', 'A12', user)
                return 'created'
            except Conflict:
                return 'conflict'
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(attempt, ['alice', 'bob']))
        self.assertCountEqual(results, ['created', 'conflict'])
        self.assertEqual(counts(self.path)['booking'], 1)

    def test_atomic_rollback(self):
        with self.assertRaises(RuntimeError):
            reserve(self.path, self.actor, 'concert', 'A12', 'op-1', True)
        self.assertEqual(counts(self.path), {'booking': 0, 'outbox': 0, 'effect': 0})

    def test_outbox_replay(self):
        reserve(self.path, self.actor, 'concert', 'A12', 'op-1')
        with self.assertRaises(RuntimeError):
            deliver(self.path, crash_after_effect=True)
        deliver(self.path)
        deliver(self.path)
        self.assertEqual(counts(self.path)['effect'], 1)

    def test_tenant_boundary(self):
        booking = reserve(self.path, self.actor, 'concert', 'A12', 'op-1')
        outsider = Actor('tenant-b', 'user-1')
        self.assertIsNone(read_booking(self.path, outsider, booking))
        with self.assertRaises(Conflict):
            cancel(self.path, outsider, booking, 1)
        self.assertEqual(read_booking(self.path, self.actor, booking)[2], 'confirmed')

    def test_stale_transition(self):
        booking = reserve(self.path, self.actor, 'concert', 'A12', 'op-1')
        cancel(self.path, self.actor, booking, 1)
        with self.assertRaises(Conflict):
            cancel(self.path, self.actor, booking, 1)
        self.assertEqual(read_booking(self.path, self.actor, booking)[3], 2)

    def test_backup_restore(self):
        booking = reserve(self.path, self.actor, 'concert', 'A12', 'op-1')
        backup = Path(self.temp.name) / 'backup.db'
        restored = Path(self.temp.name) / 'restored.db'
        snapshot(self.path, backup)
        cancel(self.path, self.actor, booking, 1)  # change after backup
        snapshot(backup, restored)
        self.assertEqual(read_booking(restored, self.actor, booking)[2], 'confirmed')
        self.assertEqual(read_booking(self.path, self.actor, booking)[2], 'cancelled')
        self.assertEqual(counts(restored)['outbox'], 1)

    def test_additive_migration(self):
        booking = reserve(self.path, self.actor, 'concert', 'A12', 'op-1')
        db = connect(self.path)
        self.addCleanup(db.close)
        db.execute('ALTER TABLE booking ADD COLUMN note TEXT')
        self.assertEqual(read_booking(self.path, self.actor, booking)[0], 'concert')
        # Old explicit-column reader survives an additive migration.

    def test_capacity(self):
        self.assertEqual(capacity(200, 5, 2, 50),
                         {'average_rps': 40, 'peak_rps': 80, 'payload_mb_s': 4})
        with self.assertRaises(ValueError):
            capacity(200, 0, 2, 50)

    def test_slo(self):
        result = error_budget(10000, 70, .995)
        self.assertAlmostEqual(result['observed'], .993)
        self.assertAlmostEqual(result['remaining'], -20)
        with self.assertRaises(ValueError):
            error_budget(0, 0, .995)


if __name__ == '__main__':
    unittest.main(verbosity=2)
