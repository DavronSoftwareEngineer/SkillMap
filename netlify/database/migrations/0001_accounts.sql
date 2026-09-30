CREATE TABLE skillmap_users (
  id uuid PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE skillmap_sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES skillmap_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE INDEX skillmap_sessions_expiry ON skillmap_sessions(expires_at);
CREATE TABLE skillmap_progress (
  user_id uuid PRIMARY KEY REFERENCES skillmap_users(id) ON DELETE CASCADE,
  revision integer NOT NULL DEFAULT 0 CHECK (revision >= 0),
  ciphertext text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE skillmap_auth_limits (
  bucket text PRIMARY KEY,
  attempts integer NOT NULL,
  expires_at timestamptz NOT NULL
);
