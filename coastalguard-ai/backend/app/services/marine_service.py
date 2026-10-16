from typing import Optional, List
from app.schemas.marine import (
    MarineConditionSchema,
    MarineConditionsResponse,
    CoastalRegionSchema,
    CoastalRegionsResponse,
)

# Configured demo coastal regions for Tamil Nadu coastline
DEMO_COASTAL_REGIONS: List[dict] = [
    {
        "id": "gulf-of-mannar",
        "name": "Gulf of Mannar",
        "tamilName": "மன்னார் வளைகுடா",
        "coastalZone": "South-East Zone (Sector 4)",
        "coordinates": [9.05, 79.15],
        "description": "Biologically sensitive marine national park waters and deep-sea pearl banks stretching between Rameswaram and Tuticorin.",
        "isDemo": True,
    },
    {
        "id": "palk-strait",
        "name": "Palk Strait / Rameswaram",
        "tamilName": "பாக் நீரிணை / இராமேஸ்வரம்",
        "coastalZone": "Mid-East Zone (Sector 3)",
        "coordinates": [9.32, 79.35],
        "description": "Shallow maritime strait between Tamil Nadu and Jaffna peninsula; high density of small-scale artisanal fishing craft.",
        "isDemo": True,
    },
    {
        "id": "chennai-coromandel",
        "name": "Chennai & Coromandel Coast",
        "tamilName": "சென்னை மற்றும் கோரமண்டல் கடற்கரை",
        "coastalZone": "North-East Zone (Sector 1)",
        "coordinates": [13.12, 80.32],
        "description": "Major commercial shipping corridor and mechanized harbour zone extending from Pulicat Lake down to Mamallapuram.",
        "isDemo": True,
    },
    {
        "id": "kanyakumari-cape",
        "name": "Kanyakumari & Cape Sea",
        "tamilName": "கன்னியாகுமரி முக்கடல் பகுதி",
        "coastalZone": "Southern Confluence (Sector 5)",
        "coordinates": [8.05, 77.58],
        "description": "High-energy confluence of the Bay of Bengal, Arabian Sea, and Indian Ocean, prone to severe monsoon swells.",
        "isDemo": True,
    },
    {
        "id": "nagapattinam-delta",
        "name": "Nagapattinam & Cauvery Delta",
        "tamilName": "நாகப்பட்டினம் மற்றும் காவிரி டெல்டா",
        "coastalZone": "Mid-East Zone (Sector 2)",
        "coordinates": [10.76, 79.88],
        "description": "Cauvery river estuary coast with extensive sand bars, vulnerable to seasonal depression storms and coastal erosion.",
        "isDemo": True,
    },
]

# Configured demo marine conditions telemetry
DEMO_MARINE_CONDITIONS: List[dict] = [
    {
        "regionId": "gulf-of-mannar",
        "regionName": "Gulf of Mannar",
        "coastalZone": "South-East Zone (Sector 4)",
        "windSpeedKnots": 28.0,
        "windDirection": "SSW (South-South-West)",
        "waveHeightMeters": 3.2,
        "swellPeriodSeconds": 11,
        "rainfallMm": 18.5,
        "visibilityKm": 4.8,
        "barometricPressureHpa": 1004,
        "seaSurfaceTempC": 28.5,
        "forecastSummary": "Squally weather with rough to very rough seas. Wind gusts up to 35 knots expected.",
        "riskLevel": "high",
        "lastUpdated": "10 mins ago (Backend Simulation)",
        "isDemo": True,
        "dataSource": "Configured Coastal Demo Telemetry (INCOIS/IMD Reference Prototype)",
    },
    {
        "regionId": "palk-strait",
        "regionName": "Palk Strait / Rameswaram",
        "coastalZone": "Mid-East Zone (Sector 3)",
        "windSpeedKnots": 16.0,
        "windDirection": "ENE (East-North-East)",
        "waveHeightMeters": 1.8,
        "swellPeriodSeconds": 8,
        "rainfallMm": 4.2,
        "visibilityKm": 8.5,
        "barometricPressureHpa": 1011,
        "seaSurfaceTempC": 29.1,
        "forecastSummary": "Moderate chop. Safe for mechanized trawlers; traditional small catamarans exercise caution.",
        "riskLevel": "moderate",
        "lastUpdated": "25 mins ago (Backend Simulation)",
        "isDemo": True,
        "dataSource": "Configured Coastal Demo Telemetry (INCOIS/IMD Reference Prototype)",
    },
    {
        "regionId": "chennai-coromandel",
        "regionName": "Chennai & Coromandel Coast",
        "coastalZone": "North-East Zone (Sector 1)",
        "windSpeedKnots": 12.0,
        "windDirection": "NE (North-East)",
        "waveHeightMeters": 1.1,
        "swellPeriodSeconds": 6,
        "rainfallMm": 0.0,
        "visibilityKm": 12.0,
        "barometricPressureHpa": 1014,
        "seaSurfaceTempC": 29.8,
        "forecastSummary": "Calm seas with light sea breeze. Standard maritime safety conditions prevail.",
        "riskLevel": "low",
        "lastUpdated": "5 mins ago (Backend Simulation)",
        "isDemo": True,
        "dataSource": "Configured Coastal Demo Telemetry (INCOIS/IMD Reference Prototype)",
    },
    {
        "regionId": "kanyakumari-cape",
        "regionName": "Kanyakumari & Cape Sea",
        "coastalZone": "Southern Confluence (Sector 5)",
        "windSpeedKnots": 38.0,
        "windDirection": "WNW (West-North-West)",
        "waveHeightMeters": 4.5,
        "swellPeriodSeconds": 14,
        "rainfallMm": 45.0,
        "visibilityKm": 2.2,
        "barometricPressureHpa": 998,
        "seaSurfaceTempC": 27.2,
        "forecastSummary": "Severe cyclonic swell warning. Absolute ban on fishing craft venturing into deep waters.",
        "riskLevel": "extreme",
        "lastUpdated": "Just now (Backend Simulation)",
        "isDemo": True,
        "dataSource": "Configured Coastal Demo Telemetry (INCOIS/IMD Reference Prototype)",
    },
    {
        "regionId": "nagapattinam-delta",
        "regionName": "Nagapattinam & Cauvery Delta",
        "coastalZone": "Mid-East Zone (Sector 2)",
        "windSpeedKnots": 20.0,
        "windDirection": "SE (South-East)",
        "waveHeightMeters": 2.4,
        "swellPeriodSeconds": 9,
        "rainfallMm": 12.0,
        "visibilityKm": 6.0,
        "barometricPressureHpa": 1008,
        "seaSurfaceTempC": 28.9,
        "forecastSummary": "Choppy seas with localized thunderstorms. Return to shelter before dusk recommended.",
        "riskLevel": "moderate",
        "lastUpdated": "15 mins ago (Backend Simulation)",
        "isDemo": True,
        "dataSource": "Configured Coastal Demo Telemetry (INCOIS/IMD Reference Prototype)",
    },
]


class MarineService:
    """Service layer for retrieving marine weather and coastal region datasets."""

    @staticmethod
    def get_regions() -> CoastalRegionsResponse:
        """Return configured coastal monitoring regions."""
        regions = [CoastalRegionSchema(**r) for r in DEMO_COASTAL_REGIONS]
        return CoastalRegionsResponse(
            status="success",
            is_demo=True,
            disclaimer="Configured coastal observation sectors for Tamil Nadu shoreline.",
            total=len(regions),
            regions=regions,
        )

    @staticmethod
    def get_conditions(region_id: Optional[str] = None) -> MarineConditionsResponse:
        """
        Return coastal marine conditions.
        Optionally filter by region_id (e.g. 'gulf-of-mannar').
        """
        raw_data = DEMO_MARINE_CONDITIONS
        if region_id:
            raw_data = [item for item in raw_data if item["regionId"] == region_id]

        conditions = [MarineConditionSchema(**c) for c in raw_data]
        return MarineConditionsResponse(
            status="success",
            is_demo=True,
            disclaimer="Demo / simulated coastal telemetry. Not for live maritime navigation or official safety declarations.",
            total=len(conditions),
            data=conditions,
        )


marine_service = MarineService()
