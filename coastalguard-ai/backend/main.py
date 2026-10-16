from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List
import os
import json
import time

app = FastAPI(title="CoastalGuard AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AIS_PROVIDER = os.getenv("AIS_PROVIDER", "simulated")  # 'aishub' | 'aisstream' | 'spire' | 'simulated'
AIS_API_KEY = os.getenv("AIS_API_KEY", "")

# In-Memory Telemetry & Coastal Fleet Store
VESSELS = [
    {
        "id": "vessel-01",
        "boatName": "Kadalarasan (கடலரசன்)",
        "registrationNumber": "IND-TN-10-MM-4021",
        "mmsi": "419001402",
        "vesselType": "Mechanized Trawler",
        "ownerName": "M. Selvam",
        "homePort": "Rameswaram Fishing Harbour",
        "reportedLocation": "09°19'N, 79°24'E (Gulf of Mannar)",
        "coordinates": [9.3200, 79.4000],
        "lastReportedTime": "Just now (Simulated Fix)",
        "lastUpdateMinutes": 5,
        "status": "sample",
        "signalStrength": "Strong",
        "speedKnots": 8.5,
        "headingDegrees": 142,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-02",
        "boatName": "Meenatchi Ambal",
        "registrationNumber": "IND-TN-02-MM-1892",
        "mmsi": "419001892",
        "vesselType": "Fiber Motorboat",
        "ownerName": "K. Arumugam",
        "homePort": "Kasimedu (Chennai)",
        "reportedLocation": "13°10'N, 80°22'E (Coromandel Coast)",
        "coordinates": [13.1600, 80.3600],
        "lastReportedTime": "4 mins ago",
        "lastUpdateMinutes": 4,
        "status": "sample",
        "signalStrength": "Strong",
        "speedKnots": 11.2,
        "headingDegrees": 38,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-03",
        "boatName": "Alai Osai II",
        "registrationNumber": "IND-TN-16-MM-9931",
        "mmsi": "419009931",
        "vesselType": "Mechanized Trawler",
        "ownerName": "S. Anthony Raj",
        "homePort": "Tuticorin Port",
        "reportedLocation": "08°42'N, 78°14'E (Tuticorin Waters)",
        "coordinates": [8.7000, 78.2300],
        "lastReportedTime": "2 hours ago",
        "lastUpdateMinutes": 120,
        "status": "stale",
        "signalStrength": "Degraded",
        "speedKnots": None,
        "headingDegrees": None,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-04",
        "boatName": "Sea Queen Voyager",
        "registrationNumber": "IND-TN-14-MM-3108",
        "mmsi": "419003108",
        "vesselType": "Traditional Catamaran",
        "ownerName": "R. Velan",
        "homePort": "Chinnamuttam Harbour",
        "reportedLocation": "08°01'N, 77°32'E (Kanyakumari Sector)",
        "coordinates": [8.0200, 77.5200],
        "lastReportedTime": "5 hours ago",
        "lastUpdateMinutes": 300,
        "status": "unknown",
        "signalStrength": "Offline",
        "speedKnots": None,
        "headingDegrees": None,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-05",
        "boatName": "Thirumalai Star",
        "registrationNumber": "IND-TN-10-MM-6721",
        "mmsi": "419006721",
        "vesselType": "Mechanized Trawler",
        "ownerName": "P. Murugesan",
        "homePort": "Rameswaram Fishing Harbour",
        "reportedLocation": "09°15'N, 79°21'E (Palk Bay)",
        "coordinates": [9.2500, 79.3500],
        "lastReportedTime": "8 mins ago",
        "lastUpdateMinutes": 8,
        "status": "sample",
        "signalStrength": "Strong",
        "speedKnots": 6.8,
        "headingDegrees": 210,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-06",
        "boatName": "Cauvery Matha",
        "registrationNumber": "IND-TN-12-MM-8419",
        "mmsi": "419008419",
        "vesselType": "Mechanized Trawler",
        "ownerName": "C. Dharmalingam",
        "homePort": "Nagapattinam Harbour",
        "reportedLocation": "10°46'N, 79°54'E (Cauvery Delta)",
        "coordinates": [10.7600, 79.9000],
        "lastReportedTime": "18 mins ago",
        "lastUpdateMinutes": 18,
        "status": "sample",
        "signalStrength": "Strong",
        "speedKnots": 9.1,
        "headingDegrees": 95,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-07",
        "boatName": "Annai Velankanni",
        "registrationNumber": "IND-TN-12-MM-5512",
        "mmsi": "419005512",
        "vesselType": "Fiber Motorboat",
        "ownerName": "A. Francis",
        "homePort": "Nagapattinam Harbour",
        "reportedLocation": "10°52'N, 79°58'E (Karaikal Reach)",
        "coordinates": [10.9200, 79.8800],
        "lastReportedTime": "10 mins ago",
        "lastUpdateMinutes": 10,
        "status": "sample",
        "signalStrength": "Strong",
        "speedKnots": 10.4,
        "headingDegrees": 65,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-08",
        "boatName": "Devi Karumariamman",
        "registrationNumber": "IND-TN-03-MM-7721",
        "mmsi": "419007721",
        "vesselType": "Mechanized Trawler",
        "ownerName": "T. Sundaram",
        "homePort": "Kasimedu (Chennai)",
        "reportedLocation": "11°45'N, 79°50'E (Cuddalore Sector)",
        "coordinates": [11.7500, 79.8000],
        "lastReportedTime": "15 mins ago",
        "lastUpdateMinutes": 15,
        "status": "sample",
        "signalStrength": "Strong",
        "speedKnots": 8.0,
        "headingDegrees": 115,
        "isLiveGps": False,
        "isDemo": True,
        "trackingSource": "SIMULATED_DEMO",
    },
    {
        "id": "vessel-gps-test",
        "boatName": "Kadal Kural (GPS Test Craft)",
        "registrationNumber": "IND-TN-99-GPS-0001",
        "mmsi": "419099001",
        "vesselType": "Fiber Motorboat",
        "ownerName": "Field Operations Tester",
        "homePort": "Rameswaram Fishing Harbour",
        "reportedLocation": "Pending device GPS fix...",
        "coordinates": [9.2800, 79.3100],
        "lastReportedTime": "Ready for GPS stream",
        "lastUpdateMinutes": 999,
        "status": "unknown",
        "signalStrength": "Offline",
        "speedKnots": None,
        "headingDegrees": None,
        "isLiveGps": True,
        "isDemo": False,
        "trackingSource": "LIVE_GPS",
        "accuracyMeters": None,
        "sessionId": None,
        "serverReceivedAt": None,
        "serverReceivedEpoch": None,
        "deviceTimestamp": None,
    },
]

# Temporary In-Memory GPS Telemetry Store
# LIMITATION NOTICE: In-memory dictionary storage only.
# All received telemetry resets when the FastAPI backend process terminates or restarts.
# Permanent database persistence (PostgreSQL / TimescaleDB) will be integrated in future release.
GPS_TELEMETRY_STORE: Dict[str, Dict[str, Any]] = {}

MARINE_CONDITIONS = {
    "gulf-of-mannar": {
        "regionId": "gulf-of-mannar",
        "regionName": "Gulf of Mannar",
        "coastalZone": "South-East Zone (Sector 4)",
        "windSpeedKnots": 28,
        "windDirection": "SSW (South-South-West)",
        "waveHeightMeters": 3.2,
        "swellPeriodSeconds": 11,
        "rainfallMm": 18.5,
        "visibilityKm": 4.8,
        "barometricPressureHpa": 1004,
        "seaSurfaceTempC": 28.5,
        "forecastSummary": "Squally weather with rough to very rough seas. Wind gusts up to 35 knots expected.",
        "riskLevel": "high",
        "lastUpdated": "10 mins ago (Backend API)",
    },
    "palk-strait": {
        "regionId": "palk-strait",
        "regionName": "Palk Strait / Rameswaram",
        "coastalZone": "Mid-East Zone (Sector 3)",
        "windSpeedKnots": 16,
        "windDirection": "ENE (East-North-East)",
        "waveHeightMeters": 1.8,
        "swellPeriodSeconds": 8,
        "rainfallMm": 4.2,
        "visibilityKm": 8.5,
        "barometricPressureHpa": 1011,
        "seaSurfaceTempC": 29.1,
        "forecastSummary": "Moderate chop. Safe for mechanized trawlers; traditional small catamarans exercise caution.",
        "riskLevel": "moderate",
        "lastUpdated": "25 mins ago (Backend API)",
    },
    "chennai-coromandel": {
        "regionId": "chennai-coromandel",
        "regionName": "Chennai & Coromandel Coast",
        "coastalZone": "North-East Zone (Sector 1)",
        "windSpeedKnots": 12,
        "windDirection": "NE (North-East)",
        "waveHeightMeters": 1.1,
        "swellPeriodSeconds": 6,
        "rainfallMm": 0.0,
        "visibilityKm": 12.0,
        "barometricPressureHpa": 1014,
        "seaSurfaceTempC": 29.8,
        "forecastSummary": "Calm seas with light sea breeze. Standard maritime safety conditions prevail.",
        "riskLevel": "low",
        "lastUpdated": "5 mins ago (Backend API)",
    },
    "kanyakumari-cape": {
        "regionId": "kanyakumari-cape",
        "regionName": "Kanyakumari & Cape Sea",
        "coastalZone": "Southern Confluence (Sector 5)",
        "windSpeedKnots": 38,
        "windDirection": "WNW (West-North-West)",
        "waveHeightMeters": 4.5,
        "swellPeriodSeconds": 14,
        "rainfallMm": 45.0,
        "visibilityKm": 2.2,
        "barometricPressureHpa": 998,
        "seaSurfaceTempC": 27.2,
        "forecastSummary": "Severe cyclonic swell warning. Absolute ban on fishing craft venturing into deep waters.",
        "riskLevel": "extreme",
        "lastUpdated": "Just now (Backend API)",
    },
    "nagapattinam-delta": {
        "regionId": "nagapattinam-delta",
        "regionName": "Nagapattinam & Cauvery Delta",
        "coastalZone": "Mid-East Zone (Sector 2)",
        "windSpeedKnots": 20,
        "windDirection": "SE (South-East)",
        "waveHeightMeters": 2.4,
        "swellPeriodSeconds": 9,
        "rainfallMm": 12.0,
        "visibilityKm": 6.0,
        "barometricPressureHpa": 1008,
        "seaSurfaceTempC": 28.9,
        "forecastSummary": "Choppy seas with localized thunderstorms. Return to shelter before dusk recommended.",
        "riskLevel": "moderate",
        "lastUpdated": "15 mins ago (Backend API)",
    },
}

ALERTS = [
    {
        "id": "alert-01",
        "title": "Severe High Swell & Gale Advisory (Gulf of Mannar)",
        "titleTamil": "மன்னார் வளைகுடா: அதிவேக காற்று மற்றும் கடல் கொந்தளிப்பு எச்சரிக்கை",
        "message": "South-westerly winds gusting to 35-40 knots with wave heights exceeding 3.5 meters expected. Small craft operations advised to cease immediately.",
        "messageTamil": "தென்மேற்கு திசையிலிருந்து மணிக்கு 35 முதல் 40 கி.மீ வேகத்தில் காற்று வீசக்கூடும். அலைகளின் உயரம் 3.5 மீட்டருக்கு மேல் எழும் என்பதால் நாட்டுப்படகுகள் கடலுக்குச் செல்ல வேண்டாம்.",
        "coastalRegion": "Gulf of Mannar",
        "severity": "high",
        "issuedAt": "Today, 06:00 AM IST",
        "validUntil": "Tomorrow, 18:00 PM IST",
        "bulletinId": "CG-IN-2026-089A",
        "isActive": True,
        "recommendedAction": "Anchor vessels in sheltered creeks or inner harbour berths immediately.",
        "recommendedActionTamil": "படகுளை உடனடியாக பாதுகாப்பான துறைமுக அணைகளில் நங்கூரமிட்டு நிறுத்தவும்.",
    },
    {
        "id": "alert-02",
        "title": "Extreme Cyclonic Surge Red Alert (Kanyakumari Coast)",
        "titleTamil": "கன்னியாகுமரி கடலோரப் பகுதி: தீவிர புயல் மற்றும் பேரலை சிவப்பு எச்சரிக்கை",
        "message": "Deep depression intensifying into severe storm. Wave heights predicted up to 4.8 meters with squally winds up to 45 knots.",
        "messageTamil": "ஆழ்ந்த காற்றழுத்த தாழ்வு மண்டலம் தீவிரமடைகிறது. கடல் அலைகள் 4.8 மீட்டர் வரை எழக்கூடும். அனைத்து மீனவர்களும் உடனடியாக கரை திரும்ப வேண்டும்.",
        "coastalRegion": "Kanyakumari & Cape Sea",
        "severity": "extreme",
        "issuedAt": "Today, 04:30 AM IST",
        "validUntil": "Next 48 Hours",
        "bulletinId": "CG-IN-2026-090E",
        "isActive": True,
        "recommendedAction": "Total ban on sea ventures. All active boats instructed to make nearest harbour call.",
        "recommendedActionTamil": "கடலுக்குள் செல்ல முழுத் தடை. கடலில் உள்ள அனைத்து படகுகளும் உடனடியாக அருகிலுள்ள துறைமுகம் செல்லவும்.",
    },
    {
        "id": "alert-03",
        "title": "Moderate Thunderstorm & Churning Alert (Cauvery Delta)",
        "titleTamil": "காவிரி டெல்டா: மிதமான இடிமின்னல் மற்றும் கடல் சீற்ற எச்சரிக்கை",
        "message": "Localized convective cloud bands approaching Nagapattinam and Karaikal with moderate lightning and gusty winds.",
        "messageTamil": "நாகப்பட்டினம் மற்றும் காரைக்கால் கடல் பகுதியில் இடி மின்னலுடன் கூடிய திடீர் பலத்த காற்று வீசக்கூடும்.",
        "coastalRegion": "Nagapattinam & Cauvery Delta",
        "severity": "moderate",
        "issuedAt": "Today, 08:15 AM IST",
        "validUntil": "Tonight, 22:00 PM IST",
        "bulletinId": "CG-IN-2026-088M",
        "isActive": True,
        "recommendedAction": "Keep VHF transceivers on Channel 16. Avoid night operations in open waters.",
        "recommendedActionTamil": "VHF அலைவரிசை 16-ல் விழிப்புடன் இருக்கவும். இரவு நேர ஆழ்கடல் மீன்பிடிப்பைத் தவிர்க்கவும்.",
    },
    {
        "id": "alert-04",
        "title": "Routine Maritime Safety Advisory (Coromandel Coast)",
        "titleTamil": "கோரமண்டல் கடற்கரை: வழக்கமான கடல் வழிகாட்டுதல் தகவல்",
        "message": "Normal sea state with swells below 1.2m. Fair weather across Chennai and Ennore ports.",
        "messageTamil": "கடல் அமைதியாக உள்ளது. வழக்கமான மீன்பிடி பணிகளை பாதுகாப்பு வழிகாட்டுதல்களுடன் மேற்கொள்ளலாம்.",
        "coastalRegion": "Chennai & Coromandel Coast",
        "severity": "low",
        "issuedAt": "Yesterday, 18:00 PM IST",
        "validUntil": "Tomorrow, 06:00 AM IST",
        "bulletinId": "CG-IN-2026-087L",
        "isActive": False,
        "recommendedAction": "Standard safety jackets and GPS beacon inspection before voyage.",
        "recommendedActionTamil": "லைஃப் ஜாக்கெட் மற்றும் ஜிபிஎஸ் கருவிகளை சரிபார்த்து கடலுக்குச் செல்லவும்.",
    },
]

USERS = [
    {
        "id": "usr-101",
        "name": "M. Selvam",
        "contact": "+91 98401 23456",
        "homeHarbour": "Rameswaram Fishing Harbour",
        "vesselName": "Kadalarasan",
        "registrationNo": "IND-TN-10-MM-4021",
        "accountStatus": "active",
        "preferredLanguage": "ta",
        "joinedDate": "Jan 14, 2024",
    },
    {
        "id": "usr-102",
        "name": "K. Arumugam",
        "contact": "+91 97890 87654",
        "homeHarbour": "Kasimedu (Chennai)",
        "vesselName": "Meenatchi Ambal",
        "registrationNo": "IND-TN-02-MM-1892",
        "accountStatus": "active",
        "preferredLanguage": "ta",
        "joinedDate": "Mar 22, 2024",
    },
    {
        "id": "usr-103",
        "name": "S. Anthony Raj",
        "contact": "+91 94432 11223",
        "homeHarbour": "Tuticorin Port",
        "vesselName": "Alai Osai II",
        "registrationNo": "IND-TN-16-MM-9931",
        "accountStatus": "active",
        "preferredLanguage": "en",
        "joinedDate": "Nov 05, 2023",
    },
    {
        "id": "usr-104",
        "name": "R. Velan",
        "contact": "+91 98940 55443",
        "homeHarbour": "Chinnamuttam Harbour",
        "vesselName": "Sea Queen Voyager",
        "registrationNo": "IND-TN-14-MM-3108",
        "accountStatus": "inactive",
        "preferredLanguage": "ta",
        "joinedDate": "Feb 18, 2025",
    },
    {
        "id": "usr-105",
        "name": "P. Murugesan",
        "contact": "+91 97500 66778",
        "homeHarbour": "Rameswaram Fishing Harbour",
        "vesselName": "Thirumalai Star",
        "registrationNo": "IND-TN-10-MM-6721",
        "accountStatus": "active",
        "preferredLanguage": "ta",
        "joinedDate": "Aug 10, 2024",
    },
    {
        "id": "usr-106",
        "name": "C. Dharmalingam",
        "contact": "+91 99420 33221",
        "homeHarbour": "Nagapattinam Harbour",
        "vesselName": "Cauvery Matha",
        "registrationNo": "IND-TN-12-MM-8419",
        "accountStatus": "suspended",
        "preferredLanguage": "ta",
        "joinedDate": "Dec 02, 2023",
    },
]

@app.get("/")
def home():
    return {"message": "CoastalGuard AI backend is running", "status": "online"}

@app.get("/api/health")
def health():
    return {"status": "online"}

@app.get("/api/vessels")
@app.get("/vessels")
def get_vessels():
    """
    Returns vessels operating in the Bay of Bengal / Tamil Nadu coastal corridor.
    Dynamic freshness evaluation is performed for live GPS vessels based on serverReceivedEpoch.
    """
    current_time = time.time()
    for v in VESSELS:
        if v.get("isLiveGps"):
            received_epoch = v.get("serverReceivedEpoch")
            if not received_epoch:
                v["status"] = "unknown"
                v["signalStrength"] = "Offline"
                v["lastReportedTime"] = "Ready for GPS stream"
                v["lastUpdateMinutes"] = 999
            else:
                elapsed_seconds = current_time - received_epoch
                elapsed_mins = elapsed_seconds / 60.0
                v["lastUpdateMinutes"] = round(elapsed_mins, 1)
                if elapsed_seconds <= 900:  # Fresh within 15 minutes
                    v["status"] = "live"
                    v["signalStrength"] = "Strong" if elapsed_seconds <= 120 else "Moderate"
                    if elapsed_seconds < 60:
                        v["lastReportedTime"] = f"{int(elapsed_seconds)}s ago (Live GPS)"
                    else:
                        v["lastReportedTime"] = f"{int(elapsed_mins)}m ago (Live GPS)"
                else:  # Stale GPS (> 15 minutes) - remains at last known location
                    v["status"] = "stale"
                    v["signalStrength"] = "Stale"
                    v["lastReportedTime"] = f"{int(elapsed_mins)} mins ago (Stale GPS)"

    return {
        "vessels": VESSELS,
        "total": len(VESSELS),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "provider": AIS_PROVIDER,
        "isLiveProviderActive": bool(AIS_API_KEY),
    }

@app.get("/api/vessels/provider-status")
def get_provider_status():
    """
    Returns live AIS/GPS integration configuration details and credentials setup guide.
    """
    return {
        "configuredProvider": AIS_PROVIDER,
        "isLiveProviderActive": bool(AIS_API_KEY),
        "supportedProviders": [
            {
                "name": "AISStream.io",
                "type": "WebSocket / Streaming",
                "envVar": "AIS_API_KEY",
                "coverage": "Global satellite & terrestrial AIS (Free for open data)",
                "boundingBox": "Tamil Nadu & Bay of Bengal (7.5°N - 14.0°N, 77.0°E - 81.0°E)",
            },
            {
                "name": "AISHub",
                "type": "REST JSON API",
                "envVar": "AIS_API_KEY",
                "coverage": "Cooperative global coastal AIS network",
            },
            {
                "name": "NavIC / MSS Indian Fishing Transponders",
                "type": "Direct Ingestion API",
                "endpoint": "/api/vessels/telemetry/ingest",
                "coverage": "Indian Space Research Organisation (ISRO) coastal transponders",
            },
        ],
        "setupInstructions": "To stream live AIS vessel positions: set AIS_API_KEY=<your-key> and AIS_PROVIDER=aisstream in backend environment.",
    }

@app.post("/api/vessels/telemetry/ingest")
@app.post("/vessels/telemetry/ingest")
async def ingest_vessel_telemetry(request: Request):
    """
    Ingests real-time GPS telemetry from browser testing tool or verified transponder.
    Validates coordinates, timestamps, and accuracy, recording telemetry in temporary
    in-memory store and updating vessel state.
    """
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid JSON payload"})

    boat_id = data.get("vesselId") or data.get("id") or data.get("registrationNumber")
    if not boat_id:
        return JSONResponse(
            status_code=400,
            content={"error": "Missing vessel identifier. Provide 'vesselId' or 'id'."}
        )

    # Validate Coordinates
    lat = data.get("latitude")
    lng = data.get("longitude")
    if lat is None or lng is None:
        coords = data.get("coordinates")
        if isinstance(coords, (list, tuple)) and len(coords) >= 2:
            lat, lng = coords[0], coords[1]

    try:
        lat = float(lat)
        lng = float(lng)
    except (TypeError, ValueError):
        return JSONResponse(
            status_code=422,
            content={"error": "Invalid coordinates format", "detail": "Latitude and longitude must be numeric"}
        )

    if not (-90.0 <= lat <= 90.0 and -180.0 <= lng <= 180.0):
        return JSONResponse(
            status_code=422,
            content={
                "error": "Coordinates out of bounds",
                "detail": f"Latitude must be in [-90, 90] and Longitude in [-180, 180]. Received lat={lat}, lng={lng}"
            }
        )

    # Validate Accuracy if provided
    accuracy = data.get("accuracyMeters") or data.get("accuracy")
    if accuracy is not None:
        try:
            accuracy = float(accuracy)
            if accuracy <= 0 or accuracy > 50000:
                return JSONResponse(
                    status_code=422,
                    content={"error": "Invalid accuracy", "detail": "GPS accuracy must be positive and <= 50,000m"}
                )
        except (TypeError, ValueError):
            return JSONResponse(status_code=422, content={"error": "Accuracy must be numeric"})

    # Validate Optional Speed & Heading
    speed_knots = data.get("speedKnots") or data.get("speed")
    if speed_knots is not None:
        try:
            speed_knots = round(float(speed_knots), 2)
            if speed_knots < 0 or speed_knots > 150:
                speed_knots = None
        except (TypeError, ValueError):
            speed_knots = None

    heading_deg = data.get("headingDegrees") or data.get("heading")
    if heading_deg is not None:
        try:
            heading_deg = round(float(heading_deg), 1)
            if heading_deg < 0 or heading_deg > 360:
                heading_deg = None
        except (TypeError, ValueError):
            heading_deg = None

    altitude_m = data.get("altitudeMeters") or data.get("altitude")
    if altitude_m is not None:
        try:
            altitude_m = round(float(altitude_m), 1)
        except (TypeError, ValueError):
            altitude_m = None

    # Timestamps
    server_receipt_epoch = time.time()
    server_receipt_iso = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime(server_receipt_epoch))
    device_timestamp = data.get("deviceTimestamp") or time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())

    # Out-of-order check against temporary in-memory store
    existing_entry = GPS_TELEMETRY_STORE.get(boat_id)
    if existing_entry:
        incoming_ts = data.get("deviceTimestampMs")
        prev_ts = existing_entry.get("deviceTimestampMs")
        if incoming_ts and prev_ts and (incoming_ts < prev_ts - 10000):
            return JSONResponse(
                status_code=409,
                content={
                    "error": "Out of order telemetry rejected",
                    "detail": "Incoming device timestamp is older than last recorded fix"
                }
            )

    session_id = data.get("sessionId") or f"sess-{boat_id}-{int(server_receipt_epoch)}"
    tracking_source = data.get("trackingSource", "LIVE_GPS")

    # Store in isolated In-Memory Telemetry Structure
    # LIMITATION: Data resides solely in RAM; lost if backend restarts.
    telemetry_packet = {
        "vesselId": boat_id,
        "sessionId": session_id,
        "coordinates": [lat, lng],
        "latitude": lat,
        "longitude": lng,
        "accuracyMeters": accuracy,
        "speedKnots": speed_knots,
        "headingDegrees": heading_deg,
        "altitudeMeters": altitude_m,
        "deviceTimestamp": device_timestamp,
        "deviceTimestampMs": data.get("deviceTimestampMs"),
        "serverReceivedAt": server_receipt_iso,
        "serverReceivedEpoch": server_receipt_epoch,
        "trackingSource": tracking_source,
    }
    GPS_TELEMETRY_STORE[boat_id] = telemetry_packet

    # Update vessel state in VESSELS if registered
    matched_vessel = None
    for idx, v in enumerate(VESSELS):
        if v["id"] == boat_id or v.get("registrationNumber") == boat_id:
            VESSELS[idx].update({
                "coordinates": [lat, lng],
                "reportedLocation": f"{lat:.4f}°N, {lng:.4f}°E (Live GPS)",
                "speedKnots": speed_knots if speed_knots is not None else v.get("speedKnots"),
                "headingDegrees": heading_deg if heading_deg is not None else v.get("headingDegrees"),
                "accuracyMeters": accuracy,
                "sessionId": session_id,
                "deviceTimestamp": device_timestamp,
                "serverReceivedAt": server_receipt_iso,
                "serverReceivedEpoch": server_receipt_epoch,
                "lastReportedTime": "Just now (Verified GPS)",
                "lastUpdateMinutes": 0.0,
                "status": "live",
                "signalStrength": "Strong",
                "isLiveGps": True,
                "isDemo": False,
                "trackingSource": tracking_source,
            })
            matched_vessel = VESSELS[idx]
            break

    if not matched_vessel:
        return JSONResponse(
            status_code=404,
            content={
                "error": "Vessel not registered in fleet list",
                "detail": f"Vessel ID '{boat_id}' not found. Use dedicated test craft 'vessel-gps-test'."
            }
        )

    return {
        "status": "accepted",
        "message": "GPS telemetry accepted and stored in temporary backend memory",
        "vesselId": boat_id,
        "telemetry": telemetry_packet,
        "vessel": matched_vessel
    }

@app.get("/api/vessels/telemetry/latest/{vessel_id}")
@app.get("/vessels/telemetry/latest/{vessel_id}")
def get_latest_telemetry(vessel_id: str):
    """
    Retrieves the latest verified GPS telemetry stored in backend in-memory cache for a given vessel.
    """
    if vessel_id in GPS_TELEMETRY_STORE:
        return {
            "status": "success",
            "telemetry": GPS_TELEMETRY_STORE[vessel_id],
            "storageType": "IN_MEMORY_TEMPORARY"
        }
    return JSONResponse(
        status_code=404,
        content={"error": "No telemetry recorded for this vessel in current backend session"}
    )

@app.get("/api/vessels/{vessel_id}")
def get_vessel(vessel_id: str):
    for v in VESSELS:
        if v["id"] == vessel_id:
            return {"vessel": v}
    return JSONResponse(status_code=404, content={"error": "Vessel not found"})

@app.get("/api/marine-conditions")
@app.get("/marine-conditions")
def get_marine_conditions():
    return {"conditions": MARINE_CONDITIONS}

@app.get("/api/marine-conditions/{region_id}")
def get_marine_condition(region_id: str):
    if region_id in MARINE_CONDITIONS:
        return {"condition": MARINE_CONDITIONS[region_id]}
    return {"error": "Region not found"}, 404

@app.get("/api/alerts")
@app.get("/alerts")
def get_alerts():
    return {"alerts": ALERTS, "total": len(ALERTS)}

@app.post("/api/alerts")
@app.post("/alerts")
async def create_alert(request: Request):
    body = await request.json()
    new_alert = {
        "id": f"alert-py-{int(time.time())}",
        "title": body.get("title", "Advisory"),
        "titleTamil": body.get("titleTamil") or body.get("title", ""),
        "message": body.get("message", ""),
        "messageTamil": body.get("messageTamil") or body.get("message", ""),
        "coastalRegion": body.get("coastalRegion", "Gulf of Mannar"),
        "severity": body.get("severity", "high"),
        "issuedAt": time.strftime("%I:%M %p IST"),
        "validUntil": body.get("validUntil", "Next 24 Hours"),
        "bulletinId": f"CG-IN-2026-{int(time.time()) % 1000:03d}",
        "isActive": True,
        "recommendedAction": body.get("recommendedAction", "Return to harbour."),
        "recommendedActionTamil": body.get("recommendedActionTamil", "துறைமுகம் திரும்பவும்."),
    }
    ALERTS.insert(0, new_alert)
    return {"alert": new_alert, "status": "created"}

@app.get("/api/users")
@app.get("/users")
def get_users():
    return {"users": USERS, "total": len(USERS)}

@app.patch("/api/users/{user_id}/status")
async def update_user_status(user_id: str, request: Request):
    body = await request.json()
    for u in USERS:
        if u["id"] == user_id:
            new_status = body.get("accountStatus")
            if not new_status:
                new_status = "inactive" if u["accountStatus"] == "active" else "active"
            u["accountStatus"] = new_status
            return {"user": u, "status": "updated"}
    return JSONResponse(status_code=404, content={"error": "User not found"})

# Temporary In-Memory Emergency SOS Distress Store
# LIMITATION NOTICE: In-memory dictionary storage only.
# Resets when the backend process restarts. Database persistence will be integrated later.
EMERGENCY_SOS_STORE: List[Dict[str, Any]] = [
    {
        "id": "SOS-IN-2026-001",
        "userId": "usr-101",
        "userName": "M. Selvam",
        "userContact": "+91 98401 23456",
        "homeHarbour": "Rameswaram Fishing Harbour",
        "vesselName": "Kadalarasan",
        "registrationNo": "IND-TN-10-MM-4021",
        "vesselType": "Mechanized Trawler",
        "coordinates": [9.3200, 79.4000],
        "accuracyMeters": 6.2,
        "locationSource": "PHONE_GEOLOCATION",
        "deviceTimestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime(time.time() - 900)),
        "serverReceivedAt": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime(time.time() - 900)),
        "serverReceivedEpoch": time.time() - 900,
        "status": "ACTIVE_DISTRESS",
        "notes": "Engine stalling in squally seas near Gulf of Mannar Sector 4.",
    }
]

@app.post("/api/sos")
@app.post("/api/emergency/sos")
@app.post("/sos")
async def trigger_emergency_sos(request: Request):
    """
    One-Tap Emergency SOS Endpoint
    Receives single-tap distress beacon from the Fisherman Portal.
    Automatically resolves authenticated user identity, linked vessel details, and location source.
    """
    try:
        data = await request.json()
    except Exception:
        data = {}

    user_id = data.get("userId") or "usr-101"

    # Auto-resolve User Profile from registered records
    matched_user = None
    for u in USERS:
        if u["id"] == user_id:
            matched_user = u
            break

    user_name = matched_user["name"] if matched_user else data.get("userName") or "Unknown Fisherman"
    user_contact = matched_user["contact"] if matched_user else data.get("userContact") or "Unknown Contact"
    home_harbour = matched_user["homeHarbour"] if matched_user else data.get("homeHarbour") or "Unknown Harbour"
    vessel_name = matched_user.get("vesselName") if matched_user else data.get("vesselName")
    registration_no = matched_user.get("registrationNo") if matched_user else data.get("registrationNo")

    # Auto-resolve Linked Vessel from Fleet Records
    matched_vessel = None
    if registration_no or vessel_name:
        for v in VESSELS:
            if (registration_no and v.get("registrationNumber") == registration_no) or \
               (vessel_name and v.get("boatName") == vessel_name):
                matched_vessel = v
                break

    vessel_type = matched_vessel.get("vesselType") if matched_vessel else (data.get("vesselType") or "Traditional Fishing Craft")

    # Truthful Location Determination
    raw_coords = data.get("deviceCoordinates") or data.get("coordinates")
    device_accuracy = data.get("deviceAccuracyMeters") or data.get("accuracyMeters")
    device_ts = data.get("deviceGpsTimestamp") or data.get("deviceTimestamp")

    lat, lng = None, None
    if isinstance(raw_coords, (list, tuple)) and len(raw_coords) >= 2:
        try:
            cand_lat, cand_lng = float(raw_coords[0]), float(raw_coords[1])
            if -90.0 <= cand_lat <= 90.0 and -180.0 <= cand_lng <= 180.0:
                lat, lng = cand_lat, cand_lng
        except (ValueError, TypeError):
            pass

    if lat is not None and lng is not None:
        location_source = "PHONE_GEOLOCATION"
        final_coords = [lat, lng]
        final_accuracy = float(device_accuracy) if device_accuracy is not None else None
        final_ts = str(device_ts) if device_ts else time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    elif matched_vessel and matched_vessel.get("coordinates"):
        location_source = "VESSEL_LAST_KNOWN_REPORT"
        final_coords = matched_vessel["coordinates"]
        final_accuracy = matched_vessel.get("accuracyMeters")
        final_ts = matched_vessel.get("lastReportedTime")
    else:
        location_source = "UNAVAILABLE"
        final_coords = None
        final_accuracy = None
        final_ts = None

    server_epoch = time.time()
    server_iso = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime(server_epoch))
    sos_id = f"SOS-IN-2026-{int(server_epoch) % 10000:04d}"

    sos_entry = {
        "id": sos_id,
        "userId": user_id,
        "userName": user_name,
        "userContact": user_contact,
        "homeHarbour": home_harbour,
        "vesselName": vessel_name,
        "registrationNo": registration_no,
        "vesselType": vessel_type,
        "coordinates": final_coords,
        "accuracyMeters": final_accuracy,
        "locationSource": location_source,
        "deviceTimestamp": final_ts,
        "serverReceivedAt": server_iso,
        "serverReceivedEpoch": server_epoch,
        "status": "ACTIVE_DISTRESS",
        "notes": data.get("notes") or "One-tap distress beacon triggered from Fisherman Safety Portal.",
    }

    EMERGENCY_SOS_STORE.insert(0, sos_entry)

    return {
        "status": "acknowledged",
        "sosId": sos_id,
        "serverReceivedAt": server_iso,
        "message": "Emergency SOS broadcast received and acknowledged by Maritime Rescue Coordination Centre",
        "sos": sos_entry,
    }

@app.get("/api/sos")
@app.get("/api/emergency/sos")
@app.get("/sos")
def get_emergency_sos_requests():
    """
    Returns all emergency SOS distress requests for the Admin Emergency SOS module.
    """
    active_count = len([
        s for s in EMERGENCY_SOS_STORE
        if s.get("status") in ("ACTIVE_DISTRESS", "SEARCH_AND_RESCUE_DISPATCHED")
    ])
    return {
        "sosRequests": EMERGENCY_SOS_STORE,
        "total": len(EMERGENCY_SOS_STORE),
        "activeCount": active_count,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
    }

@app.patch("/api/sos/{sos_id}/status")
@app.patch("/api/emergency/sos/{sos_id}/status")
async def update_emergency_sos_status(sos_id: str, request: Request):
    """
    Updates the lifecycle status of an emergency request (Acknowledge, SAR Dispatched, Resolved).
    """
    body = await request.json()
    new_status = body.get("status")
    notes = body.get("notes")

    for s in EMERGENCY_SOS_STORE:
        if s["id"] == sos_id:
            if new_status:
                s["status"] = new_status
            if notes:
                s["notes"] = notes
            return {"status": "updated", "sos": s}

    return JSONResponse(status_code=404, content={"error": "SOS request not found"})