from app.schemas.profile import ProfilePlaceholderResponse
from app.core.config import settings


class ProfileService:
    """
    Service layer for user identity and profile management.
    In Phase 1, returns a documented placeholder ensuring no personal data
    is stored until Supabase PostgreSQL tables and Row Level Security (RLS) policies are established.
    """

    @staticmethod
    def get_profile_placeholder(authorization: str = None) -> ProfilePlaceholderResponse:
        """
        Return documented placeholder for user profile.
        Explains required Supabase Auth credentials and schema integration steps.
        """
        supabase_configured = bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY)
        auth_status = "token_received_pending_verification" if authorization else "unauthenticated"

        return ProfilePlaceholderResponse(
            status="placeholder",
            authenticated=False,
            message=(
                "User profile service is in Phase 1 placeholder mode. "
                "Supabase Auth token verification and PostgreSQL profile persistence will be configured in Phase 2."
            ),
            auth_provider="Supabase Auth (Planned)",
            database_provider="Supabase PostgreSQL (Planned)",
            required_setup={
                "supabase_url": settings.SUPABASE_URL or "Not yet configured in .env (Planned)",
                "supabase_anon_key": "Set" if settings.SUPABASE_ANON_KEY else "Not yet configured in .env (Planned)",
                "database_schema": "PostgreSQL 'profiles' table with Row-Level Security (RLS) policies",
                "auth_header_status": auth_status,
                "security_note": "Service-role keys must NEVER be exposed to frontend or client environments."
            },
            user=None,
            is_demo=True,
        )


profile_service = ProfileService()
