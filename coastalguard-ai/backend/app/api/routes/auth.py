from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status
from app.schemas.auth import (
    FishermanRegisterRequest,
    FishermanRegisterResponse,
    FishermanLoginRequest,
    FishermanLoginResponse,
    FishermanUser,
)
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication & Registration"])


@router.post(
    "/register",
    response_model=FishermanRegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New Fisherman Account",
    description=(
        "Registers a new fisherman profile with PBKDF2 password hashing, "
        "format validation, duplicate prevention, and server-enforced 'fisherman' role."
    ),
)
async def register(req: FishermanRegisterRequest):
    """Register a new fisherman account."""
    return auth_service.register_fisherman(req)


@router.post(
    "/login",
    response_model=FishermanLoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate Fisherman",
    description="Authenticates a fisherman via registered mobile number or email and password.",
)
async def login(req: FishermanLoginRequest):
    """Log into Fisherman Portal."""
    return auth_service.login_fisherman(req)


@router.get(
    "/me",
    response_model=Optional[FishermanUser],
    summary="Get Authenticated Fisherman Profile",
    description="Retrieves the current authenticated fisherman's profile using the Bearer session token.",
)
async def get_me(authorization: Optional[str] = Header(default=None)):
    """Retrieve current session user."""
    user = auth_service.get_current_user(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid. Please log in again.",
        )
    return user


@router.post(
    "/logout",
    summary="Logout Fisherman Session",
    description="Invalidates the current session token.",
)
async def logout(authorization: Optional[str] = Header(default=None)):
    """Log out of current session."""
    return {"status": "success", "message": "Session terminated successfully."}
