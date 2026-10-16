from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.marine import MarineConditionsResponse, CoastalRegionsResponse
from app.services.marine_service import marine_service

router = APIRouter(prefix="/marine", tags=["Marine Telemetry"])


@router.get(
    "/conditions",
    response_model=MarineConditionsResponse,
    summary="Get Coastal Marine Weather & Ocean Conditions",
    description="Returns simulated oceanographic and weather conditions for coastal observation zones.",
)
async def get_marine_conditions(
    region_id: Optional[str] = Query(
        default=None,
        description="Filter by specific coastal region slug (e.g., 'gulf-of-mannar', 'palk-strait')",
    )
):
    """
    Retrieve coastal marine conditions (wind, waves, swell, pressure, SST, visibility).
    All data is clearly labelled as demo simulation.
    """
    cleaned_region = region_id if isinstance(region_id, str) and region_id.strip() else None
    return marine_service.get_conditions(region_id=cleaned_region)


@router.get(
    "/regions",
    response_model=CoastalRegionsResponse,
    summary="Get Configured Coastal Observation Regions",
    description="Returns the configured maritime observation sectors and geographic coordinates for Tamil Nadu.",
)
async def get_coastal_regions():
    """
    Retrieve configured coastal observation sectors.
    Includes regional boundaries, sectors, and coordinates.
    """
    return marine_service.get_regions()
