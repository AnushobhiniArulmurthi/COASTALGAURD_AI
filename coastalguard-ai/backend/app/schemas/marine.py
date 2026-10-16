from typing import List, Optional, Literal
from pydantic import BaseModel, ConfigDict, Field


SeverityLevel = Literal["low", "moderate", "high", "extreme"]


class MarineConditionSchema(BaseModel):
    """Schema representing oceanographic and atmospheric marine conditions for a coastal zone."""
    region_id: str = Field(..., alias="regionId", description="Unique identifier for the coastal region")
    region_name: str = Field(..., alias="regionName", description="Human-readable name of the region")
    coastal_zone: str = Field(..., alias="coastalZone", description="Designated coastal sector/zone")
    wind_speed_knots: float = Field(..., alias="windSpeedKnots", description="Wind velocity in knots")
    wind_direction: str = Field(..., alias="windDirection", description="Compass heading and cardinal direction")
    wave_height_meters: float = Field(..., alias="waveHeightMeters", description="Significant wave height in meters")
    swell_period_seconds: int = Field(..., alias="swellPeriodSeconds", description="Dominant wave swell period in seconds")
    rainfall_mm: float = Field(..., alias="rainfallMm", description="Recent/forecast precipitation in mm")
    visibility_km: float = Field(..., alias="visibilityKm", description="Maritime visibility in kilometers")
    barometric_pressure_hpa: int = Field(..., alias="barometricPressureHpa", description="Atmospheric pressure at sea level in hPa")
    sea_surface_temp_c: float = Field(..., alias="seaSurfaceTempC", description="Sea surface temperature in degrees Celsius")
    forecast_summary: str = Field(..., alias="forecastSummary", description="Plain-language forecast synopsis")
    risk_level: SeverityLevel = Field(..., alias="riskLevel", description="Safety risk classification")
    last_updated: str = Field(..., alias="lastUpdated", description="Timestamp of telemetry reading or sync")
    is_demo: bool = Field(default=True, alias="isDemo", description="Explicit flag indicating mock/simulated data")
    data_source: str = Field(default="Configured Coastal Demo Telemetry (INCOIS/IMD Reference Prototype)", alias="dataSource")

    model_config = ConfigDict(populate_by_name=True)


class CoastalRegionSchema(BaseModel):
    """Schema representing a configured coastal monitoring zone or sector."""
    id: str = Field(..., description="Unique slug for the region")
    name: str = Field(..., description="English regional name")
    tamil_name: Optional[str] = Field(None, alias="tamilName", description="Tamil regional designation")
    coastal_zone: str = Field(..., alias="coastalZone", description="Sector designation")
    coordinates: List[float] = Field(..., description="Latitude and Longitude [lat, lng]")
    description: str = Field(..., description="Operational summary of the coastal zone")
    is_demo: bool = Field(default=True, alias="isDemo", description="Demo flag")

    model_config = ConfigDict(populate_by_name=True)


class MarineConditionsResponse(BaseModel):
    """API envelope response for marine conditions endpoint."""
    status: str = "success"
    is_demo: bool = True
    disclaimer: str = "Demo / simulated coastal telemetry. Not for live maritime navigation or official safety declarations."
    total: int
    data: List[MarineConditionSchema]

    model_config = ConfigDict(populate_by_name=True)


class CoastalRegionsResponse(BaseModel):
    """API envelope response for coastal regions endpoint."""
    status: str = "success"
    is_demo: bool = True
    disclaimer: str = "Configured coastal observation sectors for Tamil Nadu shoreline."
    total: int
    regions: List[CoastalRegionSchema]

    model_config = ConfigDict(populate_by_name=True)
