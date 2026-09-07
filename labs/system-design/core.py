"""Small executable architecture lab. Python 3.11+, standard library only.

SQLite demonstrates invariants; it does not reproduce PostGIS or PostgreSQL locks.
Actor is supplied by a trusted adapter in production; this lab has no login server.
"""
import json
import sqlite3
from contextlib import closing
from dataclasses import dataclass


@dataclass(frozen=True)
class Actor:
    tenant: str
    user: str


class Conflict(Exception):
    pass


def connect(path):
    return sqlite3.connect(path, timeout=5, isolation_level=None)


def initialize(path):
    with closing(connect(path)) as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS booking (
          id INTEGER PRIMARY KEY, tenant TEXT NOT NULL, user TEXT NOT NULL,
          event TEXT NOT NULL, seat TEXT NOT NULL, operation TEXT NOT NULL,
          request TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
          status TEXT NOT NULL DEFAULT 'confirmed',
          UNIQUE(tenant, event, seat), UNIQUE(tenant, user, operation)
        );
        CREATE TABLE IF NOT EXISTS outbox (
          id INTEGER PRIMARY KEY, booking_id INTEGER NOT NULL UNIQUE,
          delivered INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS effect (
          event_id INTEGER PRIMARY KEY, body TEXT NOT NULL
        );
        """)


def reserve(path, actor, event, seat, operation, fail_before_commit=False):
    if not all(isinstance(v, str) and v.strip() for v in
               [actor.tenant, actor.user, event, seat, operation]):
        raise ValueError('Nonempty tenant/user/event/seat/operation required')
    request = json.dumps([event, seat], separators=(',', ':'))
    with closing(connect(path)) as db:
        db.execute('BEGIN IMMEDIATE')
        try:
            prior = db.execute(
                'SELECT id, request FROM booking WHERE tenant=? AND user=? AND operation=?',
                (actor.tenant, actor.user, operation)).fetchone()
            if prior:
                if prior[1] != request:
                    raise Conflict('Same operation, different request')
                db.commit()
                return prior[0]
            cursor = db.execute(
                'INSERT INTO booking(tenant,user,event,seat,operation,request) VALUES(?,?,?,?,?,?)',
                (actor.tenant, actor.user, event, seat, operation, request))
            booking_id = cursor.lastrowid
            db.execute('INSERT INTO outbox(booking_id) VALUES(?)', (booking_id,))
            if fail_before_commit:
                raise RuntimeError('Injected crash before commit')
            db.commit()
            return booking_id
        except sqlite3.IntegrityError as exc:
            db.rollback()
            raise Conflict('Seat unavailable') from exc
        except Exception:
            db.rollback()
            raise


def cancel(path, actor, booking_id, expected_version):
    with closing(connect(path)) as db:
        cursor = db.execute("""
            UPDATE booking SET status='cancelled', version=version+1
            WHERE id=? AND tenant=? AND user=? AND version=? AND status='confirmed'
        """, (booking_id, actor.tenant, actor.user, expected_version))
        if cursor.rowcount != 1:
            raise Conflict('Not accessible, stale version or invalid transition')
    # Teaching policy: cancelled seat remains reserved for staff reconciliation.
    # Releasing it requires a different uniqueness/state policy, not a silent change.


def deliver(path, crash_after_effect=False):
    """Simulated local effect, NOT a real email/provider exactly-once guarantee."""
    with closing(connect(path)) as db:
        rows = db.execute('SELECT id, booking_id FROM outbox WHERE delivered=0').fetchall()
        for event_id, booking_id in rows:
            db.execute('INSERT OR IGNORE INTO effect(event_id,body) VALUES(?,?)',
                       (event_id, f'booking:{booking_id}'))
            if crash_after_effect:
                raise RuntimeError('Effect committed, delivery ack lost')
            db.execute('UPDATE outbox SET delivered=1 WHERE id=?', (event_id,))


def counts(path):
    with closing(connect(path)) as db:
        return {table: db.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
                for table in ('booking', 'outbox', 'effect')}


def snapshot(source, destination):
    with closing(connect(source)) as src, closing(connect(destination)) as dest:
        src.backup(dest)


def read_booking(path, actor, booking_id):
    with closing(connect(path)) as db:
        return db.execute('SELECT event,seat,status,version FROM booking '
                          'WHERE id=? AND tenant=? AND user=?',
                          (booking_id, actor.tenant, actor.user)).fetchone()


def capacity(users, interval_seconds, peak_factor, payload_kb):
    if users < 0 or interval_seconds <= 0 or peak_factor < 1 or payload_kb < 0:
        raise ValueError('Invalid workload')
    peak = users / interval_seconds * peak_factor
    return {'average_rps': users / interval_seconds, 'peak_rps': peak,
            'payload_mb_s': peak * payload_kb / 1000}


def error_budget(eligible, bad, target):
    if not 0 <= bad <= eligible or eligible <= 0 or not 0 < target <= 1:
        raise ValueError('Invalid SLI inputs')
    allowed = eligible * (1 - target)
    return {'observed': (eligible - bad) / eligible, 'remaining': allowed - bad}
