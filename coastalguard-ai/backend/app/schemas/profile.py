from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class ProfilePlaceholderResponse(BaseModel):
    """
    Documented placeholder response for user profile endpoint.
    Returned while Supabase Auth and database tables are being planned for Phase 2.
    """
    status: str = "placeholder"
    authenticated: bool = False
    message: str = (
        "User profile service is in Phase 1 placeholder mode. "
        "Authentication will be handled via Supabase Auth (JWT bearer token) in Phase 2."
    )
    auth_provider: str = "Supabase Auth (Planned)"
    database_provider: str = "Supabase PostgreSQL (Planned)"
    required_setup: Dict[str, str] = Field(
        default_factory=lambda: {
            "SUPABASE_URL": "Required for verifying Supabase JWT tokens",
            "SUPABASE_ANON_KEY": "Public client key for frontend auth requests",
            "database_schema": "PostgreSQL 'profiles' table with Row-Level Security (RLS) policies",
            "authorization_header": "Bearer <access_token> in HTTP Authorization header"
        }
    )
    user: Optional[Dict[str, Any]] = None
    is_demo: bool = True

    model_config = ConfigDict(populate_by_name=True)
