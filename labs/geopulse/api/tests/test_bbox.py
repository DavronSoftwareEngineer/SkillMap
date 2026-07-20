import pytest
from fastapi import HTTPException

from app.spatial import BBox, parse_bbox


def test_parse_bbox() -> None:
    assert parse_bbox("69.1,41.2,69.4,41.4") == BBox(69.1, 41.2, 69.4, 41.4)


@pytest.mark.parametrize(
    "raw",
    [
        "69.1,41.2,69.4",
        "east,41.2,69.4,41.4",
        "69.4,41.2,69.1,41.4",
        "-181,41.2,69.4,41.4",
        "69.1,-91,69.4,41.4",
    ],
)
def test_rejects_invalid_bbox(raw: str) -> None:
    with pytest.raises(HTTPException) as error:
        parse_bbox(raw)
    assert error.value.status_code == 422
