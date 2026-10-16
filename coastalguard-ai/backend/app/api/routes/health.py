from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health Check")
async def health_check():
    """
    Returns backend service health status, environment mode, and dependency readiness.
    Provides clear status indicating that Supabase and Gemini are planned services in Phase 1.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "demo_mode": settings.DEMO_MODE,
        "database": {
            "provider": "Supabase (PostgreSQL)",
            "status": "configured" if settings.SUPABASE_URL else "pending_credentials",
            "message": "Phase 1 backend foundation running. Database connection planned for Phase 2."
        },
        "ai_service": {
            "provider": "Google Gemini API (Official SDK google-genai)",
            "status": "ready" if (settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key-placeholder") else "pending_api_key",
            "model": settings.GEMINI_MODEL,
            "message": (
                f"Live Gemini AI safety assistant active with model '{settings.GEMINI_MODEL}'."
                if (settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key-placeholder")
                else "Set GEMINI_API_KEY in backend/.env to activate live AI responses."
            ),
        },
        "cors_origins": settings.cors_origin_list,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
