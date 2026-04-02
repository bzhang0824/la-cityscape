"""LA Cityscape — FastAPI Backend."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import get_pool, close_pool
from .routes import permits, planning, places, search, property

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting LA Cityscape API")
    await get_pool()
    yield
    await close_pool()
    logger.info("Shutting down LA Cityscape API")


app = FastAPI(
    title="LA Cityscape API",
    description="Construction intelligence for Los Angeles — permits, planning cases, zoning, and property data.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(permits.router, prefix="/api/permits", tags=["permits"])
app.include_router(planning.router, prefix="/api/planning", tags=["planning"])
app.include_router(places.router, prefix="/api/places", tags=["places"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(property.router, prefix="/api/property", tags=["property"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "la-cityscape"}
