from typing import Optional, List
from app.schemas.alerts import SafetyAlertSchema, SafetyAlertsResponse

DEMO_ALERTS: List[dict] = [
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
        "isDemo": True,
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
        "isDemo": True,
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
        "isDemo": True,
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
        "isDemo": True,
    },
]


class AlertService:
    """Service layer for retrieving coastal safety alerts and bulletins."""

    @staticmethod
    def get_alerts(
        severity: Optional[str] = None,
        active_only: bool = False,
        region: Optional[str] = None,
    ) -> SafetyAlertsResponse:
        """
        Return coastal alerts with optional filtering by severity, active state, or region.
        """
        filtered = DEMO_ALERTS

        if active_only:
            filtered = [a for a in filtered if a["isActive"]]

        if severity:
            filtered = [a for a in filtered if a["severity"].lower() == severity.lower()]

        if region:
            filtered = [a for a in filtered if region.lower() in a["coastalRegion"].lower()]

        alert_objects = [SafetyAlertSchema(**a) for a in filtered]
        active_count = sum(1 for a in alert_objects if a.is_active)

        return SafetyAlertsResponse(
            status="success",
            is_demo=True,
            disclaimer="Demo bulletins for CoastalGuard AI safety simulation. Not for official navigation or life-safety decisions.",
            total=len(alert_objects),
            active_count=active_count,
            data=alert_objects,
        )


alert_service = AlertService()
