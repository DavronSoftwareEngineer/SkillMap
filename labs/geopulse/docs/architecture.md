# GeoPulse architecture

## Baseline decision

The baseline uses a modular monolith for the API and a separate browser client.
This is the smallest architecture that still exposes the important boundaries:
HTTP contract, spatial database, browser map lifecycle, and reverse proxy.

```text
                       trust boundary
                            |
Browser --HTTPS--> Gateway -+--> FastAPI --> PostGIS
                  |         |
                  `-----------> static frontend
```

## Data contract

- Stored geometry: `geometry(Point, 4326)`.
- API coordinate order: longitude, latitude.
- Bbox order: west, south, east, north.
- Output: GeoJSON FeatureCollection.
- The API enforces a hard result limit.
- Exact distance and area operations must document their projected/geodesic
  calculation strategy before they are added.

## Evolution boundaries

- Heavy processing moves to a Redis + Celery queue worker, not into the request handler;
  retry and idempotency are part of its contract.
- FastAPI remains a modular monolith until an ADR demonstrates a boundary that
  needs independent scaling or ownership. Kafka, Kubernetes, and microservices
  are not baseline requirements.
- Public read-only tiles may move to PMTiles/object storage.
- Frequently changing or protected layers remain dynamic.
- Raster assets use COG + STAC rather than database blobs.
- Authentication and audit are completed before write endpoints are exposed.

Record each meaningful change in an ADR. Do not redraw this document to hide a
trade-off; explain why the trade-off changed.
