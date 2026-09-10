"""Original mock-only lab. Stdlib Python 3.11+. Never connect customer services.

SQLite is used for a runnable local exercise, not as proof of Postgres concurrency.
The tiny MVT fixture has one synthetic point, not any real geographic dataset.
"""
import argparse
import gzip
import hashlib
import json
import math
import sqlite3
import subprocess
import time
from contextlib import contextmanager, closing
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.error import HTTPError
from urllib.parse import urlparse
from urllib.request import urlopen


def varint(value):
    result = bytearray()
    while value > 127:
        result.append((value & 127) | 128)
        value >>= 7
    result.append(value)
    return bytes(result)


def blob(field, payload):
    return varint((field << 3) | 2) + varint(len(payload)) + payload


# MVT Tile.layers(3), Layer.name(1), features(2), extent(5), version(15).
# Feature id=1, type=POINT(1), geometry MoveTo(1,1).
FEATURE = b'\x08\x01\x18\x01' + blob(4, b'\x09\x02\x02')
MVT = blob(3, blob(1, b'mock_points') + blob(2, FEATURE) + b'\x28\x80\x20\x78\x02')
PAYLOAD = gzip.compress(MVT, mtime=0)
TILES = [(0, 0, 0), (1, 0, 0), (1, 1, 0), (1, 0, 1), (1, 1, 1)]


@contextmanager
def mock_server(fault='none'):
    """Only synthetic routes; ephemeral loopback listener. No external data."""
    counts = {}
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def do_GET(self):
            counts[self.path] = counts.get(self.path, 0) + 1
            if self.path not in {f'/{z}/{x}/{y}.pbf' for z, x, y in TILES}:
                self.send_error(404)
                return
            if self.path == '/1/1/0.pbf' and fault == 'retry' and counts[self.path] == 1:
                self.send_error(503)
                return
            content = b'<html>not a tile</html>' if fault == 'html' and self.path == '/1/1/0.pbf' else PAYLOAD
            self.send_response(200)
            self.send_header('Content-Type', 'text/html' if content != PAYLOAD else 'application/vnd.mapbox-vector-tile')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f'http://127.0.0.1:{server.server_port}', counts
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def connect(path):
    con = sqlite3.connect(path, timeout=10)
    con.execute('PRAGMA journal_mode=WAL')
    return con


def initialize(path):
    with closing(connect(path)) as con, con:
        con.execute('CREATE TABLE IF NOT EXISTS metadata (name TEXT PRIMARY KEY, value TEXT NOT NULL)')
        con.execute('CREATE TABLE IF NOT EXISTS tiles (zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB NOT NULL, PRIMARY KEY(zoom_level,tile_column,tile_row))')
        con.execute('CREATE TABLE IF NOT EXISTS checkpoint (z INTEGER,x INTEGER,y INTEGER,sha256 TEXT NOT NULL,PRIMARY KEY(z,x,y))')
        meta = {'name': 'Synthetic MockAtlas', 'format': 'pbf', 'minzoom': '0', 'maxzoom': '1',
                'bounds': '-180,-85,180,85', 'description': 'Five synthetic tiles, not real world data',
                'json': json.dumps({'vector_layers': [{'id': 'mock_points', 'fields': {}, 'minzoom': 0, 'maxzoom': 1}]}),
                'mock_fixture': hashlib.sha256(MVT).hexdigest()}
        old = dict(con.execute('SELECT name,value FROM metadata'))
        if old and any(old.get(key) != value for key, value in meta.items()):
            raise ValueError('Different snapshot/metadata: use a fresh archive')
        con.executemany('INSERT OR IGNORE INTO metadata VALUES (?,?)', meta.items())


def validate_payload(data):
    # This validator deliberately accepts ONLY our known synthetic MVT fixture.
    # It is not a general-purpose protobuf / geometry validation implementation.
    if len(data) > 100_000 or gzip.decompress(data) != MVT:
        raise ValueError('Not the expected synthetic MVT')
    return hashlib.sha256(data).hexdigest()


def export_tiles(path, base, limit=None):
    parsed = urlparse(base)
    if parsed.scheme != 'http' or parsed.hostname != '127.0.0.1' or parsed.username or parsed.path:
        raise ValueError('Only the local synthetic server is supported')
    initialize(path)
    con = connect(path)
    written = 0
    try:
        for z, x, y in TILES:
            tms = 2 ** z - 1 - y
            row = con.execute('SELECT t.tile_data,c.sha256 FROM tiles t JOIN checkpoint c ON c.z=t.zoom_level AND c.x=t.tile_column AND c.y=? WHERE t.zoom_level=? AND t.tile_column=? AND t.tile_row=?', (y, z, x, tms)).fetchone()
            if row and validate_payload(row[0]) == row[1]:
                continue
            if limit is not None and written >= limit:
                return False
            for attempt in range(3):
                try:
                    with urlopen(f'{base}/{z}/{x}/{y}.pbf', timeout=3) as response:
                        if response.status != 200 or response.headers.get_content_type() != 'application/vnd.mapbox-vector-tile':
                            raise ValueError('Unexpected status/content type')
                        data = response.read(100_001)
                    break
                except HTTPError as error:
                    if error.code not in (429, 502, 503, 504) or attempt == 2:
                        raise
                    time.sleep(0.02 * 2 ** attempt)
            digest = validate_payload(data)
            with con:  # Tile and checkpoint commit together.
                con.execute('INSERT OR REPLACE INTO tiles VALUES (?,?,?,?)', (z, x, tms, data))
                con.execute('INSERT OR REPLACE INTO checkpoint VALUES (?,?,?,?)', (z, x, y, digest))
            written += 1
    finally:
        con.close()
    verify_archive(path)
    return True


def verify_archive(path):
    con = connect(path)
    try:
        meta = dict(con.execute('SELECT name,value FROM metadata'))
        if meta.get('mock_fixture') != hashlib.sha256(MVT).hexdigest() or meta.get('format') != 'pbf':
            raise ValueError('Metadata mismatch')
        expected_layers = [{'id': 'mock_points', 'fields': {}, 'minzoom': 0, 'maxzoom': 1}]
        if json.loads(meta.get('json', '{}')).get('vector_layers') != expected_layers or meta.get('minzoom') != '0' or meta.get('maxzoom') != '1' or meta.get('bounds') != '-180,-85,180,85':
            raise ValueError('Layer/zoom/bounds metadata mismatch')
        if con.execute('SELECT count(*) FROM tiles').fetchone()[0] != len(TILES):
            raise ValueError('Incomplete archive')
        for z, x, y in TILES:
            row = con.execute('SELECT t.tile_data,c.sha256 FROM tiles t JOIN checkpoint c ON c.z=t.zoom_level AND c.x=t.tile_column AND c.y=? WHERE t.zoom_level=? AND t.tile_column=? AND t.tile_row=?', (y,z,x,2**z-1-y)).fetchone()
            if not row or validate_payload(row[0]) != row[1]:
                raise ValueError('Missing/corrupt tile or checkpoint')
    finally:
        con.close()


def convert(path, output, binary):
    verify_archive(path)
    if Path(output).exists():
        raise ValueError('Never overwrite a previous release')
    candidate = Path(str(output) + '.candidate.pmtiles')
    if candidate.exists():
        raise ValueError('Previous candidate exists: inspect it first')
    subprocess.run([binary, 'convert', str(path), str(candidate)], check=True)
    subprocess.run([binary, 'verify', str(candidate)], check=True)
    candidate.rename(output)


def init_jobs(path):
    con = connect(path)
    with con:
        con.execute('CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY,status TEXT,owner TEXT,fence INTEGER,until REAL)')
        con.execute("INSERT OR IGNORE INTO jobs VALUES ('mock-job','pending','',0,0)")
    con.close()


def claim(path, owner, now, ttl=10):
    if not owner or not math.isfinite(now) or not math.isfinite(ttl) or ttl <= 0:
        raise ValueError('Invalid lease')
    con = connect(path)
    try:
        con.execute('BEGIN IMMEDIATE')
        row = con.execute("UPDATE jobs SET status='running',owner=?,fence=fence+1,until=? WHERE id='mock-job' AND (status='pending' OR (status='running' AND until<=?)) RETURNING fence", (owner,now+ttl,now)).fetchone()
        con.commit()
        return row[0] if row else None
    finally:
        con.close()


def finish(path, owner, fence, now):
    if not math.isfinite(now):
        return False
    con = connect(path)
    try:
        with con:
            result = con.execute("UPDATE jobs SET status='succeeded' WHERE id='mock-job' AND status='running' AND owner=? AND fence=? AND until>?", (owner,fence,now))
        return result.rowcount == 1
    finally:
        con.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True, help='New local .mbtiles path')
    parser.add_argument('--limit', type=int, help='Simulate interruption after N new tiles')
    parser.add_argument('--fault', choices=['none','retry','html'], default='none')
    parser.add_argument('--pmtiles-bin', help='Optional installed official pmtiles binary')
    args = parser.parse_args()
    with mock_server(args.fault) as (url, _):
        complete = export_tiles(args.output, url, args.limit)
    print(json.dumps({'complete': complete, 'archive': str(args.output)}))
    if args.pmtiles_bin:
        if not complete:
            raise SystemExit('Publish blocked: incomplete export')
        convert(args.output, args.output.with_suffix('.pmtiles'), args.pmtiles_bin)
