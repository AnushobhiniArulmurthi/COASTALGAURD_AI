import re
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class FishermanRegisterRequest(BaseModel):
    """Payload submitted during fisherman portal sign-up."""
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        alias="fullName",
        description="Full legal or community name of the fisherman",
    )
    mobile_number: str = Field(
        ...,
        min_length=10,
        max_length=20,
        alias="mobileNumber",
        description="Primary mobile contact number (10 digits or with +91 country code)",
    )
    email: str = Field(
        ...,
        min_length=5,
        max_length=120,
        description="Active email address for safety bulletins and account recovery",
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Account password (minimum 8 characters)",
    )
    confirm_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        alias="confirmPassword",
        description="Password confirmation matching password",
    )
    vessel_name: Optional[str] = Field(
        default="Traditional Craft",
        alias="vesselName",
        max_length=100,
        description="Name of the fishing boat or motorized craft",
    )
    registration_no: Optional[str] = Field(
        default="PENDING-REG",
        alias="registrationNo",
        max_length=50,
        description="Department of Fisheries vessel registration code (e.g., IND-TN-10-MM-XXXX)",
    )
    home_harbour: Optional[str] = Field(
        default="Rameswaram Fishing Harbour",
        alias="homeHarbour",
        max_length=120,
        description="Designated base fishing harbour or landing centre",
    )
    preferred_language: Literal["en", "ta"] = Field(
        default="en",
        alias="preferredLanguage",
        description="User language preference ('en' for English, 'ta' for தமிழ்)",
    )

    model_config = ConfigDict(populate_by_name=True)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        # Standard email format regex check
        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(pattern, clean):
            raise ValueError("Please provide a valid email address (e.g., fisherman@example.com).")
        return clean

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_format(cls, v: str) -> str:
        clean = v.strip()
        # Extract numeric digits
        digits = re.sub(r"\D", "", clean)
        if len(digits) < 10 or len(digits) > 13:
            raise ValueError("Mobile number must be a valid 10-digit number (e.g., 98401 23456 or +91 98401 23456).")
        return clean

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match. Please re-enter identical passwords.")
        return v


class FishermanLoginRequest(BaseModel):
    """Payload submitted when logging into the Fisherman Portal."""
    identifier: str = Field(
        ...,
        min_length=3,
        max_length=120,
        description="Registered mobile number or email address",
    )
    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
        description="Account password",
    )
    remember_me: Optional[bool] = Field(
        default=True,
        alias="rememberMe",
        description="Flag indicating long-lived session storage",
    )

    model_config = ConfigDict(populate_by_name=True)


class FishermanUser(BaseModel):
    """Authenticated fisherman profile data returned to client."""
    id: str = Field(..., description="Unique fisherman ID")
    full_name: str = Field(..., alias="fullName", description="Registered name")
    mobile_number: str = Field(..., alias="mobileNumber", description="Mobile number")
    email: str = Field(..., description="Registered email")
    role: Literal["fisherman"] = Field(
        default="fisherman",
        description="User role strictly enforced by backend (never client-selected)",
    )
    vessel_name: str = Field(..., alias="vesselName", description="Fishing craft name")
    registration_no: str = Field(..., alias="registrationNo", description="Vessel registration number")
    home_harbour: str = Field(..., alias="homeHarbour", description="Base harbour")
    preferred_language: str = Field(..., alias="preferredLanguage", description="Language preference ('en' | 'ta')")
    created_at: str = Field(..., alias="createdAt", description="UTC ISO-8601 registration timestamp")
    is_verified: bool = Field(default=True, alias="isVerified", description="Account active status")

    model_config = ConfigDict(populate_by_name=True)


class FishermanRegisterResponse(BaseModel):
    """Response returned upon successful fisherman registration."""
    status: Literal["success", "error"] = "success"
    message: str = Field(..., description="Human-readable registration confirmation message")
    user: FishermanUser = Field(..., description="Newly created fisherman profile")
    access_token: str = Field(..., alias="accessToken", description="Bearer session token for client authentication")
    token_type: str = Field(default="Bearer", alias="tokenType")
    database_persistence: str = Field(
        ...,
        alias="databasePersistence",
        description="Status of persistence in server store or Supabase database",
    )
    requires_email_verification: bool = Field(
        default=False,
        alias="requiresEmailVerification",
        description="Indicates whether email link verification is required before first login",
    )
    instructions: str = Field(
        default="Your fisherman account is registered and active. You can log into the Fisherman Portal immediately.",
        description="Helpful next-step instructions",
    )

    model_config = ConfigDict(populate_by_name=True)


class FishermanLoginResponse(BaseModel):
    """Response returned upon successful fisherman login."""
    status: Literal["success", "error"] = "success"
    message: str = Field(..., description="Login result message")
    user: FishermanUser = Field(..., description="Authenticated fisherman profile")
    access_token: str = Field(..., alias="accessToken", description="Session bearer token")
    token_type: str = Field(default="Bearer", alias="tokenType")
    role: Literal["fisherman"] = "fisherman"

    model_config = ConfigDict(populate_by_name=True)
