from typing import List, Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

SeverityLevel = Literal["low", "moderate", "high", "extreme"]


class SafetyAlertSchema(BaseModel):
    """Schema representing an official marine safety warning or weather advisory bulletin."""
    id: str = Field(..., description="Unique alert identifier")
    title: str = Field(..., description="Alert headline in English")
    title_tamil: Optional[str] = Field(None, alias="titleTamil", description="Alert headline in Tamil")
    message: str = Field(..., description="Detailed alert message in English")
    message_tamil: Optional[str] = Field(None, alias="messageTamil", description="Detailed alert message in Tamil")
    coastal_region: str = Field(..., alias="coastalRegion", description="Target coastal sector or bay")
    severity: SeverityLevel = Field(..., description="Severity category: low, moderate, high, or extreme")
    issued_at: str = Field(..., alias="issuedAt", description="Bulletin issuance timestamp")
    valid_until: str = Field(..., alias="validUntil", description="Validity cutoff timestamp")
    bulletin_id: str = Field(..., alias="bulletinId", description="Official bulletin tracking code")
    is_active: bool = Field(..., alias="isActive", description="Whether the advisory is currently in effect")
    recommended_action: str = Field(..., alias="recommendedAction", description="Mandatory safety guidance in English")
    recommended_action_tamil: Optional[str] = Field(None, alias="recommendedActionTamil", description="Mandatory safety guidance in Tamil")
    is_demo: bool = Field(default=True, alias="isDemo", description="Explicit indicator that this is simulated demo data")

    model_config = ConfigDict(populate_by_name=True)


class SafetyAlertsResponse(BaseModel):
    """Envelope response for the safety alerts API endpoint."""
    status: str = "success"
    is_demo: bool = True
    disclaimer: str = "Demo bulletins for CoastalGuard AI safety simulation. Not for official navigation or life-safety decisions."
    total: int
    active_count: int = Field(..., alias="activeCount")
    data: List[SafetyAlertSchema]

    model_config = ConfigDict(populate_by_name=True)
