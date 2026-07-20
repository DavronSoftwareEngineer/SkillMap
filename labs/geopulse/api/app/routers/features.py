import json
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from ..schemas import AssetFeature, AssetProperties, FeatureCollection, PointGeometry
from ..spatial import parse_bbox

router = APIRouter(prefix="/features", tags=["features"])

FEATURES_SQL = text(
    """
    SELECT id, name, category, ST_AsGeoJSON(geom)::text AS geometry
    FROM assets
    WHERE geom && ST_MakeEnvelope(:west, :south, :east, :north, 4326)
    ORDER BY id
    LIMIT :limit
    """
)


@router.get("", response_model=FeatureCollection)
async def list_features(
    bbox: Annotated[str, Query(description="west,south,east,north")],
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: Annotated[int, Query(ge=1, le=1000)] = 500,
) -> FeatureCollection:
    parsed = parse_bbox(bbox)
    rows = (
        await session.execute(FEATURES_SQL, {**parsed.as_params, "limit": limit})
    ).mappings()

    features = [
        AssetFeature(
            id=row["id"],
            geometry=PointGeometry.model_validate(json.loads(row["geometry"])),
            properties=AssetProperties(name=row["name"], category=row["category"]),
        )
        for row in rows
    ]
    return FeatureCollection(
        features=features,
        meta={"returned": len(features), "limit": limit, "bbox": list(parsed.as_params.values())},
    )
