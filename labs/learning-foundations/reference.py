"""Small deterministic teaching fixtures, not external integration benchmarks."""
from math import isfinite


def raster_summary(values, nodata=-9999):
    """Coverage uses all input cells; invalid/nonfinite cells do not enter mean."""
    valid = [v for v in values if isinstance(v, (int, float))
             and not isinstance(v, bool) and isfinite(v) and v != nodata]
    return {
        'mean': sum(valid) / len(valid) if valid else None,
        'coverage': len(valid) / len(values) if values else 0,
        'valid_count': len(valid),
    }


def validate_point(point, bounds):
    if len(point) != 2 or any(isinstance(v, bool) or not isinstance(v, (int, float))
                              or not isfinite(v) for v in point):
        raise ValueError('Two finite numeric coordinates are required')
    lon, lat = point
    if not (-180 <= lon <= 180 and -90 <= lat <= 90):
        raise ValueError('Coordinate range')
    west, south, east, north = bounds
    if not (west <= lon <= east and south <= lat <= north):
        raise ValueError('Outside expected area')
    return lon, lat


def overlapping_groups(train, validation):
    """Group overlap check. Spatial buffers/time leakage need additional checks."""
    return set(train) & set(validation)


def cash_position(opening, invoiced, received, cost_incurred, cost_paid):
    # Synthetic one-period accounting example: no taxes, assets or other items.
    return {
        'profit': invoiced - cost_incurred,
        'cash_movement': received - cost_paid,
        'closing_cash': opening + received - cost_paid,
        'receivable': invoiced - received,
    }


def authorized_report(user, report):
    return bool(user['active'] and user['tenant'] == report['tenant']
                and user['role'] in ('reader', 'editor'))


def supported_summary(candidate, facts):
    """Check an already-generated flat summary against explicit source facts.

    This fixture does not call or evaluate a real language model.
    """
    required = {'status', 'blocker', 'owner', 'deadline'}
    return (isinstance(candidate, dict) and set(candidate) == required
            and all(candidate[field] == facts.get(field) for field in required))
