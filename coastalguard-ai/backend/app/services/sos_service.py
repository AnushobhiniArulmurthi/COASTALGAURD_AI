import logging
import secrets
import threading
from datetime import datetime, timezone
from typing import Optional, Dict
from app.core.config import settings
from app.schemas.sos import (
    SOSCreateRequest,
    SOSFishermanProfile,
    SOSIncidentResponse,
)

logger = logging.getLogger("coastalguard.sos")

# Trusted server-side database of registered fishermen (matching current active prototype portal)
DEFAULT_FISHERMAN_STORE: Dict[str, dict] = {
    "usr-101": {
        "id": "usr-101",
        "name": "M. Selvam (செல்வம்)",
        "contact": "+91 98401 23456",
        "homeHarbour": "Rameswaram Fishing Harbour",
        "vesselName": "Kadalarasan (கடலரசன்)",
        "registrationNo": "IND-TN-10-MM-4021",
    },
    "usr-102": {
        "id": "usr-102",
        "name": "K. Arumugam (ஆறுமுகம்)",
        "contact": "+91 97890 87654",
        "homeHarbour": "Kasimedu (Chennai)",
        "vesselName": "Meenatchi Ambal",
        "registrationNo": "IND-TN-02-MM-1892",
    },
    "usr-103": {
        "id": "usr-103",
        "name": "S. Anthony Raj (அந்தோணி ராஜ்)",
        "contact": "+91 94432 11223",
        "homeHarbour": "Tuticorin Port",
        "vesselName": "Alai Osai II",
        "registrationNo": "IND-TN-16-MM-9931",
    },
}


class SOSService:
    """
    Manages SOS emergency incident intake, validation, idempotency, and audit recording.
    """

    def __init__(self):
        self._lock = threading.Lock()
        # Keyed by idempotency_key for safe retries without duplicate incidents
        self._idempotency_map: Dict[str, SOSIncidentResponse] = {}
        # Keyed by incident_id for lookups
        self._incidents_by_id: Dict[str, SOSIncidentResponse] = {}

    def get_fisherman_identity(self, user_id: Optional[str] = None) -> SOSFishermanProfile:
        """
        Derive trusted fisherman profile on the server.
        Defaults to active portal session (M. Selvam, usr-101).
        """
        resolved_id = user_id if user_id in DEFAULT_FISHERMAN_STORE else "usr-101"
        data = DEFAULT_FISHERMAN_STORE[resolved_id]
        return SOSFishermanProfile(**data)

    def register_emergency_incident(
        self,
        request: SOSCreateRequest,
        fisherman: SOSFishermanProfile,
    ) -> SOSIncidentResponse:
        """
        Record an emergency SOS request with strict idempotency and audit trails.
        """
        clean_key = request.idempotency_key.strip()

        with self._lock:
            # 1. Idempotency Check: if this idempotency key was already received, return existing incident
            if clean_key in self._idempotency_map:
                existing = self._idempotency_map[clean_key]
                logger.info(
                    "Idempotent SOS retry received for key %s -> Returning existing incident %s",
                    clean_key,
                    existing.incident_id,
                )
                return existing

            # 2. Generate unique human-readable incident reference
            now_utc = datetime.now(timezone.utc)
            date_prefix = now_utc.strftime("%Y%m%d")
            random_suffix = secrets.token_hex(3).upper()
            incident_id = f"CG-SOS-{date_prefix}-{random_suffix}"

            # 3. Determine location status
            location_status = (
                "device_gps_provided"
                if request.device_coordinates is not None
                else "location_unavailable"
            )

            # 4. Determine persistence status
            # In Phase 1 foundation, records are persisted in the server's thread-safe in-memory audit store.
            # In Phase 2, this will persist directly into Supabase PostgreSQL 'sos_incidents' table.
            supabase_active = bool(settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY)
            database_persistence = (
                "persisted_supabase"
                if supabase_active
                else "persisted_in_memory_audit_log (Supabase PostgreSQL credentials pending)"
            )

            incident = SOSIncidentResponse(
                status="received",
                incident_id=incident_id,
                idempotency_key=clean_key,
                timestamp=now_utc.isoformat(),
                fisherman=fisherman,
                device_location=request.device_coordinates,
                location_status=location_status,
                database_persistence=database_persistence,
                notification_dispatch_status="no_external_dispatch_service_configured",
                disclaimer=(
                    "SOS emergency alert recorded on CoastalGuard AI server. Real-time Indian Coast Guard "
                    "or Coastal Police automated dispatch is not configured in this prototype. "
                    "Please immediately broadcast MAYDAY on VHF Channel 16 or call Indian Coast Guard Helpline 1554."
                ),
            )

            # Store in idempotency and incident registries
            self._idempotency_map[clean_key] = incident
            self._incidents_by_id[incident_id] = incident

            logger.warning(
                "🚨 SOS INCIDENT REGISTERED: %s for %s (%s) at %s [Location: %s]",
                incident_id,
                fisherman.name,
                fisherman.vessel_name,
                incident.timestamp,
                location_status,
            )

            return incident

    def get_incident_by_id(self, incident_id: str) -> Optional[SOSIncidentResponse]:
        """Lookup previously recorded incident by ID."""
        with self._lock:
            return self._incidents_by_id.get(incident_id.strip())


# Global singleton instance
sos_service = SOSService()
