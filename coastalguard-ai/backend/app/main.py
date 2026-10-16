from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.health import router as health_router
from app.api.routes.marine import router as marine_router
from app.api.routes.alerts import router as alerts_router
from app.api.routes.profile import router as profile_router
from app.api.routes.chat import router as chat_router
from app.api.routes.sos import router as sos_router
from app.api.routes.auth import router as auth_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "CoastalGuard AI Backend API — Marine safety telemetry, weather advisories, "
        "and bilingual coastal emergency alerts for fishermen and coastal authorities."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Configure Cross-Origin Resource Sharing (CORS) for Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers under /api
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(marine_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(sos_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
async def root():
    """Root entrypoint providing service navigation and status links."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "demo_mode": settings.DEMO_MODE,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "marine_conditions": f"{settings.API_V1_STR}/marine/conditions",
        "marine_regions": f"{settings.API_V1_STR}/marine/regions",
        "alerts": f"{settings.API_V1_STR}/alerts",
        "profile": f"{settings.API_V1_STR}/profile",
        "chat": f"{settings.API_V1_STR}/chat",
        "sos": f"{settings.API_V1_STR}/sos",
        "auth_register": f"{settings.API_V1_STR}/auth/register",
        "auth_login": f"{settings.API_V1_STR}/auth/login",
    }
