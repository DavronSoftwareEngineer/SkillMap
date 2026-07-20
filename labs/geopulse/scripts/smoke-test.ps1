$ErrorActionPreference = "Stop"
$baseUrl = if ($env:BASE_URL) { $env:BASE_URL } else { "http://localhost:8080" }

$live = Invoke-RestMethod -Uri "$baseUrl/api/health/live"
if ($live.status -ne "ok") { throw "Liveness failed" }

$ready = Invoke-RestMethod -Uri "$baseUrl/api/health/ready"
if ($ready.status -ne "ready") { throw "Readiness failed" }

$features = Invoke-RestMethod -Uri "$baseUrl/api/features?bbox=69.1,41.2,69.4,41.4&limit=10"
if ($features.type -ne "FeatureCollection") { throw "Feature contract failed" }

$page = Invoke-WebRequest -UseBasicParsing -Uri $baseUrl
if ($page.Content -notmatch "GeoPulse Lab") { throw "Frontend smoke test failed" }

Write-Host "GeoPulse smoke test passed: $baseUrl"
