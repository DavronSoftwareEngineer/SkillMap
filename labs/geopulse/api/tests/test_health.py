import httpx
import pytest

from app.main import app


@pytest.mark.asyncio
async def test_liveness_and_request_id() -> None:
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/health/live",
            headers={"X-Request-ID": "test-request"},
        )

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert response.headers["X-Request-ID"] == "test-request"
