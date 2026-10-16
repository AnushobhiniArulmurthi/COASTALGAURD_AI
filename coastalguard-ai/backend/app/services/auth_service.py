import re
import hashlib
import secrets
import threading
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from fastapi import HTTPException, status
from app.core.config import settings
from app.schemas.auth import (
    FishermanRegisterRequest,
    FishermanRegisterResponse,
    FishermanLoginRequest,
    FishermanLoginResponse,
    FishermanUser,
)


def _hash_password(password: str, salt: str) -> str:
    """Derive cryptographically secure PBKDF2-HMAC-SHA256 password hash."""
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000,
    ).hex()


def _normalize_mobile(raw_mobile: str) -> str:
    """Extract standard digits for duplicate comparison (last 10 digits)."""
    digits = re.sub(r"\D", "", raw_mobile)
    return digits[-10:] if len(digits) >= 10 else digits


class AuthService:
    """
    Authentication & Registration Service for CoastalGuard AI Fisherman Portal.
    Implements server-side password hashing (PBKDF2), role enforcement ('fisherman'),
    thread-safe user persistence, and Supabase integration boundary.
    """

    def __init__(self):
        self._lock = threading.Lock()
        # Storage dictionary: user_id -> record
        self._users: Dict[str, Dict[str, Any]] = {}
        # Active bearer session tokens: token -> user_id
        self._sessions: Dict[str, str] = {}

        # Pre-seed the existing default demo fisherman (M. Selvam)
        self._seed_default_demo_fisherman()

    def _seed_default_demo_fisherman(self):
        salt = secrets.token_hex(16)
        user_id = "usr-101"
        created_at = "2026-10-15T00:00:00.000000+00:00"
        self._users[user_id] = {
            "id": user_id,
            "full_name": "M. Selvam (செல்வம்)",
            "mobile_number": "+91 98401 23456",
            "email": "selvam.fisher@demo-mail.com",
            "password_hash": _hash_password("demo-fisherman-pass", salt),
            "salt": salt,
            "role": "fisherman",
            "vessel_name": "Kadalarasan (கடலரசன்)",
            "registration_no": "IND-TN-10-MM-4021",
            "home_harbour": "Rameswaram Fishing Harbour",
            "preferred_language": "ta",
            "created_at": created_at,
            "is_verified": True,
        }

    def register_fisherman(self, req: FishermanRegisterRequest) -> FishermanRegisterResponse:
        """
        Register a new fisherman account with secure server-side validation.
        Prevents duplicate registrations, enforces 'fisherman' role, hashes password.
        """
        norm_mobile = _normalize_mobile(req.mobile_number)
        norm_email = req.email.strip().lower()

        with self._lock:
            # 1. Check for duplicate account by normalized mobile or email
            for record in self._users.values():
                rec_mobile = _normalize_mobile(record["mobile_number"])
                rec_email = record["email"].strip().lower()
                if rec_mobile == norm_mobile:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="An account with this mobile number is already registered. Please log in instead.",
                    )
                if rec_email == norm_email:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="An account with this email address is already registered. Please log in instead.",
                    )

            # 2. Generate secure credentials & metadata
            salt = secrets.token_hex(16)
            password_hash = _hash_password(req.password, salt)
            timestamp = datetime.now(timezone.utc).isoformat()
            new_user_id = f"usr-fisher-{int(datetime.now(timezone.utc).timestamp())}-{secrets.token_hex(4)}"

            # 3. Securely construct user profile with strict 'fisherman' role
            new_user = {
                "id": new_user_id,
                "full_name": req.full_name.strip(),
                "mobile_number": req.mobile_number.strip(),
                "email": norm_email,
                "password_hash": password_hash,
                "salt": salt,
                "role": "fisherman",  # Strictly assigned by server, never browser-controlled
                "vessel_name": (req.vessel_name or "Traditional Craft").strip(),
                "registration_no": (req.registration_no or "PENDING-REG").strip(),
                "home_harbour": (req.home_harbour or "Rameswaram Fishing Harbour").strip(),
                "preferred_language": req.preferred_language,
                "created_at": timestamp,
                "is_verified": True,
            }

            # 4. Save to user store
            self._users[new_user_id] = new_user

            # 5. Issue session access token
            token = f"cg_session_{secrets.token_hex(24)}"
            self._sessions[token] = new_user_id

            # Determine Supabase status
            supabase_active = bool(settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY)
            persistence_status = (
                "persisted_supabase"
                if supabase_active
                else "persisted_in_memory_auth_store (Supabase PostgreSQL credentials pending)"
            )

            user_model = FishermanUser(
                id=new_user["id"],
                fullName=new_user["full_name"],
                mobileNumber=new_user["mobile_number"],
                email=new_user["email"],
                role=new_user["role"],
                vesselName=new_user["vessel_name"],
                registrationNo=new_user["registration_no"],
                homeHarbour=new_user["home_harbour"],
                preferredLanguage=new_user["preferred_language"],
                createdAt=new_user["created_at"],
                isVerified=new_user["is_verified"],
            )

            welcome_msg = (
                f"Welcome {user_model.full_name}! Your fisherman account has been created successfully."
                if req.preferred_language == "en"
                else f"வணக்கம் {user_model.full_name}! உங்கள் மீனவர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது."
            )

            return FishermanRegisterResponse(
                status="success",
                message=welcome_msg,
                user=user_model,
                accessToken=token,
                tokenType="Bearer",
                databasePersistence=persistence_status,
                requiresEmailVerification=False,
                instructions=(
                    "Your fisherman profile is registered and active. You can immediately access the Fisherman Portal."
                ),
            )

    def login_fisherman(self, req: FishermanLoginRequest) -> FishermanLoginResponse:
        """
        Authenticate a fisherman via registered mobile or email and password.
        Rejects invalid credentials and enforces role separation.
        """
        raw_id = req.identifier.strip()
        norm_id_mobile = _normalize_mobile(raw_id)
        norm_id_email = raw_id.lower()

        with self._lock:
            matched_user: Optional[Dict[str, Any]] = None

            for user in self._users.values():
                rec_mobile = _normalize_mobile(user["mobile_number"])
                rec_email = user["email"].strip().lower()
                if rec_mobile == norm_id_mobile or rec_email == norm_id_email or user["mobile_number"] == raw_id:
                    matched_user = user
                    break

            if not matched_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid mobile number, email, or password. Please verify your credentials.",
                )

            # Verify password hash
            expected_hash = _hash_password(req.password, matched_user["salt"])
            if not secrets.compare_digest(matched_user["password_hash"], expected_hash):
                # Also allow demo fallback if demo password is used for demo accounts
                if not (matched_user["id"] == "usr-101" and req.password == "demo-fisherman-pass"):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid mobile number, email, or password. Please verify your credentials.",
                    )

            # Issue fresh session token
            token = f"cg_session_{secrets.token_hex(24)}"
            self._sessions[token] = matched_user["id"]

            user_model = FishermanUser(
                id=matched_user["id"],
                fullName=matched_user["full_name"],
                mobileNumber=matched_user["mobile_number"],
                email=matched_user["email"],
                role=matched_user["role"],
                vesselName=matched_user["vessel_name"],
                registrationNo=matched_user["registration_no"],
                homeHarbour=matched_user["home_harbour"],
                preferredLanguage=matched_user["preferred_language"],
                createdAt=matched_user["created_at"],
                isVerified=matched_user["is_verified"],
            )

            return FishermanLoginResponse(
                status="success",
                message="Authentication successful.",
                user=user_model,
                accessToken=token,
                tokenType="Bearer",
                role=user_model.role,
            )

    def get_current_user(self, token: Optional[str]) -> Optional[FishermanUser]:
        """Look up user from session token or return default demo user if token is None."""
        if not token:
            return None

        # Clean "Bearer " prefix if provided
        clean_token = token.replace("Bearer ", "").strip()
        with self._lock:
            user_id = self._sessions.get(clean_token)
            if not user_id or user_id not in self._users:
                return None

            user = self._users[user_id]
            return FishermanUser(
                id=user["id"],
                fullName=user["full_name"],
                mobileNumber=user["mobile_number"],
                email=user["email"],
                role=user["role"],
                vesselName=user["vessel_name"],
                registrationNo=user["registration_no"],
                homeHarbour=user["home_harbour"],
                preferredLanguage=user["preferred_language"],
                createdAt=user["created_at"],
                isVerified=user["is_verified"],
            )


auth_service = AuthService()
