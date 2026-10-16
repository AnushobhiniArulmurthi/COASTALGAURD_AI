from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    """Request payload for marine safety AI chat assistant."""
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User's inquiry regarding marine conditions, bulletins, or maritime terms",
    )
    language: Literal["en", "ta"] = Field(
        default="en",
        description="Response language preference ('en' for English, 'ta' for Tamil)",
    )
    context_bulletin: Optional[str] = Field(
        default=None,
        max_length=1000,
        alias="contextBulletin",
        description="Optional active bulletin or alert being viewed by the user",
    )

    model_config = ConfigDict(populate_by_name=True)


class ChatResponse(BaseModel):
    """Response payload returned by the marine safety AI chat assistant."""
    status: str = "success"
    reply: str = Field(..., description="Gemini-generated explanation")
    language: str = Field(..., description="Language of generated reply ('en' or 'ta')")
    model: str = Field(..., description="Gemini model utilized")
    timestamp: str = Field(..., description="Response ISO timestamp")
    disclaimer: str = (
        "CoastalGuard AI explains marine safety information and does not replace "
        "official marine authorities or direct navigational instruments."
    )
    is_live_ai: bool = Field(default=True, alias="isLiveAi")

    model_config = ConfigDict(populate_by_name=True)


class ChatErrorResponse(BaseModel):
    """Standard error response for chat API failures."""
    status: str = "error"
    error_code: str = Field(..., alias="errorCode")
    message: str = Field(..., description="Human-readable error description")
    detail: Optional[str] = None
    suggested_action: Optional[str] = Field(None, alias="suggestedAction")

    model_config = ConfigDict(populate_by_name=True)
