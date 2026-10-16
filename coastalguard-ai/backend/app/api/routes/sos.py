from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status
from app.schemas.sos import (
    SOSCreateRequest,
    SOSIncidentResponse,
)
from app.services.sos_service import sos_service

router = APIRouter(prefix="/sos", tags=["SOS Emergency"])


@router.post(
    "",
    response_model=SOSIncidentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Emergency SOS Distress Alert",
    description=(
        "Registers an emergency SOS distress alert for the authenticated fisherman. "
        "Strictly idempotent via client-provided idempotencyKey."
    ),
)
async def submit_sos_emergency(
    request: SOSCreateRequest,
    authorization: Optional[str] = Header(
        None,
        description="Bearer token for authenticated fisherman identity",
    ),
):
    """
    Register an emergency SOS alert triggered after the 5-second countdown finishes.
    Derives fisherman identity on the server and applies idempotency protection against duplicate submissions.
    """
    clean_key = request.idempotency_key.strip()
    if not clean_key or len(clean_key) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "errorCode": "INVALID_IDEMPOTENCY_KEY",
                "message": "A valid idempotency key of at least 8 characters is required to prevent duplicate alerts.",
            },
        )

    # Server validates authenticated identity (does not trust client-supplied user ID)
    fisherman = sos_service.get_fisherman_identity()

    incident = sos_service.register_emergency_incident(
        request=request,
        fisherman=fisherman,
    )
    return incident


@router.get(
    "/{incident_id}",
    response_model=SOSIncidentResponse,
    summary="Retrieve Emergency Incident Status",
    description="Look up confirmed status and details of an existing SOS incident reference.",
)
async def get_sos_incident(incident_id: str):
    """Retrieve recorded status for an existing emergency incident ID."""
    incident = sos_service.get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "status": "error",
                "errorCode": "INCIDENT_NOT_FOUND",
                "message": f"Emergency incident '{incident_id}' was not found in the server registry.",
            },
        )
    return incident
