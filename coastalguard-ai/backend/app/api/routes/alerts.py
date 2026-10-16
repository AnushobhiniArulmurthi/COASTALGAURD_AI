from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.alerts import SafetyAlertsResponse
from app.services.alert_service import alert_service

router = APIRouter(prefix="/alerts", tags=["Safety Alerts"])


@router.get(
    "",
    response_model=SafetyAlertsResponse,
    summary="Get Coastal Safety Advisories and Alerts",
    description="Returns marine safety warning bulletins with bilingual English and Tamil translations.",
)
async def get_alerts(
    severity: Optional[str] = Query(
        default=None,
        description="Filter by severity level: 'low', 'moderate', 'high', or 'extreme'",
    ),
    active_only: bool = Query(
        default=False,
        description="If True, only returns currently active warnings",
    ),
    region: Optional[str] = Query(
        default=None,
        description="Filter by partial or complete coastal region name",
    ),
):
    """
    Retrieve safety alerts and maritime bulletins.
    All records are clearly marked as simulation data and contain bilingual notices.
    """
    cleaned_severity = severity if isinstance(severity, str) and severity.strip() else None
    cleaned_active_only = bool(active_only) if isinstance(active_only, bool) else False
    cleaned_region = region if isinstance(region, str) and region.strip() else None

    return alert_service.get_alerts(
        severity=cleaned_severity,
        active_only=cleaned_active_only,
        region=cleaned_region,
    )
