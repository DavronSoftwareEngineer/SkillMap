CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS assets (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL CHECK (length(trim(name)) > 0),
  category text NOT NULL CHECK (category IN ('hospital', 'school', 'station', 'park')),
  geom geometry(Point, 4326) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assets_geom_gix ON assets USING GIST (geom);
CREATE INDEX IF NOT EXISTS assets_category_idx ON assets (category);

INSERT INTO assets (name, category, geom)
SELECT seed.name, seed.category, ST_SetSRID(ST_MakePoint(seed.lon, seed.lat), 4326)
FROM (
  VALUES
    ('Central demo hospital', 'hospital', 69.2689, 41.3111),
    ('Yunusabad demo school', 'school', 69.2850, 41.3650),
    ('Metro demo station', 'station', 69.2797, 41.3145),
    ('City demo park', 'park', 69.2550, 41.3200)
) AS seed(name, category, lon, lat)
WHERE NOT EXISTS (SELECT 1 FROM assets);

COMMENT ON TABLE assets IS 'Synthetic training data only; coordinates are for a public demo.';
