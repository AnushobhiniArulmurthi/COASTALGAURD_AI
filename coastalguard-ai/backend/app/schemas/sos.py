from typing import Optional, Literal, Dict
from pydantic import BaseModel, ConfigDict, Field


class SOSCoordinates(BaseModel):
    """Device GPS coordinates provided by browser geolocation API."""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    accuracy_meters: Optional[float] = Field(None, alias="accuracyMeters", description="Estimated GPS accuracy in meters")

    model_config = ConfigDict(populate_by_name=True)


class SOSFishermanProfile(BaseModel):
    """Authenticated fisherman profile details derived from server identity store."""
    id: str = Field(..., description="Unique fisherman user identifier")
    name: str = Field(..., description="Registered fisherman full name")
    contact: str = Field(..., description="Registered emergency mobile contact")
    home_harbour: str = Field(..., alias="homeHarbour", description="Designated base harbour")
    vessel_name: str = Field(..., alias="vesselName", description="Registered fishing craft name")
    registration_no: str = Field(..., alias="registrationNo", description="Official marine registration number")

    model_config = ConfigDict(populate_by_name=True)


class SOSCreateRequest(BaseModel):
    """Payload submitted when the 5-second emergency countdown completes."""
    idempotency_key: str = Field(
        ...,
        min_length=8,
        max_length=128,
        alias="idempotencyKey",
        description="Unique client-generated token ensuring idempotent transmission without duplicate incidents",
    )
    device_coordinates: Optional[SOSCoordinates] = Field(
        None,
        alias="deviceCoordinates",
        description="Current device GPS position if browser permission was granted",
    )
    emergency_notes: Optional[str] = Field(
        None,
        max_length=500,
        alias="emergencyNotes",
        description="Optional distress message or situation description",
    )
    language: Literal["en", "ta"] = Field(
        default="en",
        description="Language preference of the fisherman ('en' or 'ta')",
    )

    model_config = ConfigDict(populate_by_name=True)


class SOSIncidentResponse(BaseModel):
    """Structured response confirming server registration of an SOS emergency incident."""
    status: Literal["received", "duplicate_recorded", "error"] = "received"
    incident_id: str = Field(..., alias="incidentId", description="Unique emergency incident tracking reference")
    idempotency_key: str = Field(..., alias="idempotencyKey", description="Echoed client idempotency key")
    timestamp: str = Field(..., description="Confirmed UTC ISO-8601 server registration timestamp")
    fisherman: SOSFishermanProfile = Field(..., description="Server-validated registered fisherman details")
    device_location: Optional[SOSCoordinates] = Field(None, alias="deviceLocation", description="Recorded device coordinates")
    location_status: str = Field(
        ...,
        alias="locationStatus",
        description="'device_gps_provided' or 'location_unavailable'",
    )
    database_persistence: str = Field(
        ...,
        alias="databasePersistence",
        description="Status of persistence in server audit log or database",
    )
    notification_dispatch_status: str = Field(
        default="no_external_dispatch_service_configured",
        alias="notificationDispatchStatus",
        description="Truthful indicator showing whether real emergency SMS/radios are connected",
    )
    disclaimer: str = Field(
        default=(
            "SOS request recorded by CoastalGuard AI backend. Live rescue dispatch/telecom service "
            "is not configured in this prototype. Immediately contact official emergency services "
            "via VHF Ch 16 or Indian Coast Guard Helpline 1554."
        ),
        description="Mandatory disclaimer for prototype emergency transmissions",
    )
    emergency_contacts: Dict[str, str] = Field(
        default_factory=lambda: {
            "vhf_channel": "VHF Marine Channel 16 (Distress & Safety)",
            "coast_guard_helpline": "1554 (Indian Coast Guard Toll-Free)",
            "marine_police": "1093 (Tamil Nadu Coastal Security Police)",
            "national_emergency": "112 (National Emergency Response System)",
        },
        alias="emergencyContacts",
        description="Direct official marine emergency phone numbers and radio channels",
    )

    model_config = ConfigDict(populate_by_name=True)
