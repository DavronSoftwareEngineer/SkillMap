#!/usr/bin/env sh
set -eu

BASE_URL="${BASE_URL:-http://localhost:8080}"

curl -fsS "$BASE_URL/api/health/live"
curl -fsS "$BASE_URL/api/health/ready"
curl -fsS "$BASE_URL/api/features?bbox=69.1,41.2,69.4,41.4&limit=10" \
  | grep -q 'FeatureCollection'
curl -fsS "$BASE_URL" | grep -q 'GeoPulse Lab'

printf '\nGeoPulse smoke test passed: %s\n' "$BASE_URL"
