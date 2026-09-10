import multiprocessing as mp
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import subprocess
from pathlib import Path
from lab import claim, convert, export_tiles, finish, init_jobs, mock_server, verify_archive, TILES


def contender(path, owner, barrier, queue):
    barrier.wait(timeout=10)
    queue.put(claim(path, owner, 0))


def attempt(path, owner, now, queue):
    queue.put(claim(path, owner, now))


class LabTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / 'mock.sqlite'

    def test_resume_skips_committed_tiles_and_retries_503(self):
        with mock_server('retry') as (url, counts):
            self.assertFalse(export_tiles(self.path, url, limit=2))
            with self.assertRaises(ValueError):
                verify_archive(self.path)
            self.assertTrue(export_tiles(self.path, url))
            self.assertEqual(counts['/0/0/0.pbf'], 1)
            self.assertEqual(counts['/1/1/0.pbf'], 2)
        con = sqlite3.connect(self.path)
        self.assertEqual(con.execute('SELECT count(*) FROM tiles').fetchone()[0], len(TILES))
        con.close()

    def test_html_200_is_not_a_tile_and_blocks_release(self):
        with mock_server('html') as (url, _):
            with self.assertRaises(ValueError):
                export_tiles(self.path, url)
        with self.assertRaises(ValueError):
            verify_archive(self.path)

    def test_corruption_is_detected(self):
        with mock_server() as (url, _):
            export_tiles(self.path, url)
        con = sqlite3.connect(self.path)
        with con:
            con.execute("UPDATE checkpoint SET sha256='wrong' WHERE z=0")
        con.close()
        with self.assertRaises(ValueError):
            verify_archive(self.path)

    def test_external_endpoint_is_rejected(self):
        with self.assertRaises(ValueError):
            export_tiles(self.path, 'https://example.com')

    def test_wrong_layer_metadata_blocks_publish(self):
        with mock_server() as (url, _):
            export_tiles(self.path, url)
        con = sqlite3.connect(self.path)
        with con:
            con.execute("UPDATE metadata SET value='{}' WHERE name='json'")
        con.close()
        with self.assertRaises(ValueError):
            verify_archive(self.path)
        with mock_server() as (url, _):
            with self.assertRaisesRegex(ValueError, 'Different snapshot'):
                export_tiles(self.path, url)

    def test_converter_is_not_called_for_partial_archive(self):
        with mock_server() as (url, _):
            export_tiles(self.path, url, limit=1)
        with patch('lab.subprocess.run') as run:
            with self.assertRaises(ValueError):
                convert(self.path, self.path.with_suffix('.pmtiles'), 'unused-mock-binary')
            run.assert_not_called()

    def test_failed_conversion_does_not_publish(self):
        with mock_server() as (url, _):
            export_tiles(self.path, url)
        output = self.path.with_suffix('.pmtiles')
        with patch('lab.subprocess.run', side_effect=subprocess.CalledProcessError(1, 'mock-convert')):
            with self.assertRaises(subprocess.CalledProcessError):
                convert(self.path, output, 'unused-mock-binary')
        self.assertFalse(output.exists())

    def test_two_real_processes_cannot_claim_the_same_lease(self):
        init_jobs(self.path)
        ctx = mp.get_context('spawn')
        barrier, queue = ctx.Barrier(2), ctx.Queue()
        workers = [ctx.Process(target=contender, args=(self.path, name, barrier, queue)) for name in ['a','b']]
        for worker in workers:
            worker.start()
        results = [queue.get(timeout=15), queue.get(timeout=15)]
        for worker in workers:
            worker.join(timeout=15)
            self.assertEqual(worker.exitcode, 0)
        queue.close()
        self.assertEqual(results.count(1), 1)
        self.assertEqual(results.count(None), 1)

    def test_process_exit_recovery_and_stale_fence(self):
        init_jobs(self.path)
        ctx = mp.get_context('spawn')
        queue = ctx.Queue()
        worker = ctx.Process(target=attempt, args=(self.path,'a',0,queue))
        worker.start()
        old = queue.get(timeout=15)
        worker.join(timeout=15)
        self.assertEqual(worker.exitcode, 0)  # A exited without completion.
        worker = ctx.Process(target=attempt, args=(self.path,'b',11,queue))
        worker.start()
        new = queue.get(timeout=15)
        worker.join(timeout=15)
        self.assertEqual(worker.exitcode, 0)
        self.assertFalse(finish(self.path,'a',old,12))
        self.assertTrue(finish(self.path,'b',new,12))
        self.assertFalse(finish(self.path,'b',new,13))
        self.assertIsNone(claim(self.path,'c',100))
        queue.close()


if __name__ == '__main__':
    unittest.main()
