from dataclasses import dataclass

from fastapi import HTTPException, status


@dataclass(frozen=True, slots=True)
class BBox:
    west: float
    south: float
    east: float
    north: float

    @property
    def as_params(self) -> dict[str, float]:
        return {
            "west": self.west,
            "south": self.south,
            "east": self.east,
            "north": self.north,
        }


def parse_bbox(raw: str) -> BBox:
    try:
        values = [float(value.strip()) for value in raw.split(",")]
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="bbox faqat sonlardan iborat bo'lishi kerak",
        ) from exc

    if len(values) != 4:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="bbox tartibi west,south,east,north va 4 qiymat bo'lishi kerak",
        )

    west, south, east, north = values
    if not (-180 <= west < east <= 180 and -90 <= south < north <= 90):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="bbox diapazoni yoki tartibi noto'g'ri",
        )
    return BBox(west=west, south=south, east=east, north=north)
