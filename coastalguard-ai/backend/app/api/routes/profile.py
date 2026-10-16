from typing import Optional
from fastapi import APIRouter, Header
from app.schemas.profile import ProfilePlaceholderResponse
from app.services.profile_service import profile_service

router = APIRouter(prefix="/profile", tags=["User Profile"])


@router.get(
    "",
    response_model=ProfilePlaceholderResponse,
    summary="Get User Profile (Phase 1 Placeholder)",
    description=(
        "Documented placeholder for user identity and profile. "
        "Supabase Auth token verification and PostgreSQL database models are scheduled for Phase 2."
    ),
)
async def get_profile(
    authorization: Optional[str] = Header(
        default=None,
        description="Bearer token header (planned for Supabase Auth in Phase 2)",
    )
):
    """
    Returns placeholder guidance regarding the user profile endpoint.
    No personal data is collected or persisted until Supabase Auth RLS policies are finalized.
    """
    cleaned_auth = authorization if isinstance(authorization, str) else None
    return profile_service.get_profile_placeholder(authorization=cleaned_auth)
