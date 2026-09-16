"""Small synthetic teaching contracts, NOT production GIS/IAM clients."""

import hashlib
import json
import math
import re


def merge_pages(pages):
    """Merge mock ArcGIS-style pages; require an explicit terminal page.

    This fixture contract deliberately requires exceededTransferLimit on every
    page. Real adapters must interpret their service's documented capabilities.
    CRS conversion, network retry and snapshot isolation are not implemented.
    """
    records = {}
    seen_pages = set()
    finished = False
    for page in pages:
        if finished:
            raise ValueError("Page received after terminal page")
        if not isinstance(page, dict) or "error" in page:
            raise ValueError("Source returned an error or invalid page")
        features = page.get("features")
        more = page.get("exceededTransferLimit")
        if not isinstance(features, list) or not isinstance(more, bool):
            raise ValueError("Missing fixture pagination contract")
        signature = json.dumps(features, sort_keys=True, allow_nan=False)
        if signature in seen_pages or (more and not features):
            raise ValueError("Pagination made no progress")
        seen_pages.add(signature)
        for feature in features:
            attributes = feature.get("attributes") if isinstance(feature, dict) else None
            object_id = attributes.get("OBJECTID") if isinstance(attributes, dict) else None
            if type(object_id) is not int:
                raise ValueError("Missing integer OBJECTID")
            if object_id in records and records[object_id] != feature:
                raise ValueError("Conflicting payload for OBJECTID")
            records[object_id] = feature
        finished = not more
    if not finished:
        raise ValueError("Incomplete export")
    return list(records.values())


def dense_bytes(shape, itemsize):
    """Raw dense array bytes, excluding temporaries, metadata and overhead."""
    shape = tuple(shape)
    if not shape or any(type(n) is not int or n <= 0 for n in (*shape, itemsize)):
        raise ValueError("Dimensions and itemsize must be positive integers")
    return math.prod(shape) * itemsize


def masked_mean(values):
    """None and NaN are missing; infinity and non-numbers are invalid."""
    valid = []
    for value in values:
        if value is None:
            continue
        if type(value) not in (int, float):
            raise ValueError("Expected numeric or missing value")
        if math.isnan(value):
            continue
        if not math.isfinite(value):
            raise ValueError("Infinite observation")
        valid.append(value)
    return math.fsum(valid) / len(valid) if valid else None


def snapshot_id(source_revision, pipeline, schema, params):
    """Canonical processing identity, NOT output checksum or GeoParquet writer."""
    if not all(isinstance(v, str) and v.strip() for v in (source_revision, pipeline)):
        raise ValueError("Source and pipeline revisions are required")
    if type(schema) is not int or schema <= 0 or not isinstance(params, dict):
        raise ValueError("Positive schema version and parameter dictionary required")
    manifest = dict(source_revision=source_revision, pipeline=pipeline, schema=schema, params=params)
    payload = json.dumps(manifest, sort_keys=True, separators=(",", ":"), allow_nan=False)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def scope_allows(tenant, object_key):
    """Toy exact-prefix model; NEVER use as authentication or AWS IAM policy.

    Only canonical mock object keys are accepted. No URL decoding is performed.
    """
    if not isinstance(tenant, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", tenant):
        return False
    if not isinstance(object_key, str) or any(c in object_key for c in ("\\", "%", "?", "#")):
        return False
    if any(part in ("", ".", "..") for part in object_key.split("/")):
        return False
    return object_key.startswith(f"tenants/{tenant}/")
