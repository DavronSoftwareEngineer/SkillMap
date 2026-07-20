from typing import Any, Literal

from pydantic import BaseModel, Field


class PointGeometry(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: tuple[float, float]


class AssetProperties(BaseModel):
    name: str
    category: str


class AssetFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: int
    geometry: PointGeometry
    properties: AssetProperties


class FeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[AssetFeature]
    meta: dict[str, Any] = Field(default_factory=dict)
