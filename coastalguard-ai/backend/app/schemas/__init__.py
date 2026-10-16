"""Pydantic schemas and data contracts."""
from app.schemas.marine import (
    MarineConditionSchema,
    MarineConditionsResponse,
    CoastalRegionSchema,
    CoastalRegionsResponse,
)
from app.schemas.alerts import SafetyAlertSchema, SafetyAlertsResponse
from app.schemas.profile import ProfilePlaceholderResponse
from app.schemas.chat import ChatRequest, ChatResponse, ChatErrorResponse
from app.schemas.sos import (
    SOSCoordinates,
    SOSCreateRequest,
    SOSFishermanProfile,
    SOSIncidentResponse,
)
from app.schemas.auth import (
    FishermanRegisterRequest,
    FishermanRegisterResponse,
    FishermanLoginRequest,
    FishermanLoginResponse,
    FishermanUser,
)

__all__ = [
    "MarineConditionSchema",
    "MarineConditionsResponse",
    "CoastalRegionSchema",
    "CoastalRegionsResponse",
    "SafetyAlertSchema",
    "SafetyAlertsResponse",
    "ProfilePlaceholderResponse",
    "ChatRequest",
    "ChatResponse",
    "ChatErrorResponse",
    "SOSCoordinates",
    "SOSCreateRequest",
    "SOSFishermanProfile",
    "SOSIncidentResponse",
    "FishermanRegisterRequest",
    "FishermanRegisterResponse",
    "FishermanLoginRequest",
    "FishermanLoginResponse",
    "FishermanUser",
]
