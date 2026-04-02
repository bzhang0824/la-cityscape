from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.config import settings
from backend.api.database import get_pool, close_pool
from backend.api.routes import permits, planning, places, search, property


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    yield
    await close_pool()


app = FastAPI(
    title="LA Cityscape API",
    description="Construction intelligence platform for Los Angeles",
    version="1.0.0",
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
    return {"status": "ok"}
