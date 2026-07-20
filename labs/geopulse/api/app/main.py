import logging
import time
import uuid
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from starlette.responses import Response

from .database import engine
from .logging_config import configure_logging
from .routers.features import router as features_router
from .settings import get_settings

configure_logging()
log = logging.getLogger("geopulse.api")
settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    await engine.dispose()


app = FastAPI(
    title="GeoPulse Lab API",
    version="0.1.0",
    summary="A minimal, testable spatial API for the SkillMap professional lab.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Content-Type", "X-Request-ID"],
)


@app.middleware("http")
async def request_context(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    started = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    log.info(
        "request_complete method=%s path=%s status=%s duration_ms=%.2f",
        request.method,
        request.url.path,
        response.status_code,
        (time.perf_counter() - started) * 1000,
        extra={"request_id": request_id},
    )
    return response


@app.get("/health/live", tags=["health"])
async def liveness() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/ready", tags=["health"])
async def readiness() -> dict[str, str]:
    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))
    return {"status": "ready"}


app.include_router(features_router)
