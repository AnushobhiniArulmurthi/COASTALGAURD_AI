# CoastalGuard AI — Backend (Phase 1: Backend Foundation & Gemini AI Integration)

Welcome to the backend service of the **CoastalGuard AI** marine safety platform.
This backend is built using **Python 3.14+** and **FastAPI**, following a modular design pattern with Pydantic request/response validation, separation of concerns (Core, Routes, Schemas, Services), security-first configuration, and native integration with the **official Google Gen AI Python SDK (`google-genai`)**.

---

## Directory Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI application entrypoint, CORS setup & router assembly
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py            # Pydantic BaseSettings, .env loader, GEMINI_MODEL & CORS handler
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── health.py        # GET /api/health — backend status, AI service & readiness
│   │       ├── marine.py        # GET /api/marine/conditions & /api/marine/regions
│   │       ├── alerts.py        # GET /api/alerts — bilingual marine safety bulletins
│   │       ├── profile.py       # GET /api/profile — documented placeholder for Supabase Auth
│   │       └── chat.py          # POST /api/chat — Google Gemini AI marine safety assistant
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── marine.py            # Schemas for oceanographic conditions & regions
│   │   ├── alerts.py            # Schemas for bilingual safety alerts
│   │   ├── profile.py           # Schemas for user profile responses
│   │   └── chat.py              # Request, response, and error schemas for Gemini AI
│   └── services/
│       ├── __init__.py
│       ├── marine_service.py    # Service logic for coastal telemetry & sectors
│       ├── alert_service.py     # Service logic for safety alerts filtering
│       ├── profile_service.py   # Service logic for user profile placeholder
│       └── gemini_service.py    # Official Google Gen AI SDK client & safety prompts
├── .env                         # Local environment settings (git-ignored)
├── .env.example                 # Configuration template with placeholders & security guidance
├── .gitignore                   # Excludes .venv, __pycache__, and .env
├── requirements.txt             # Python dependencies (includes google-genai)
└── README.md                    # Backend documentation & setup guide
```

---

## Quickstart & Local Setup

### 1. Prerequisites
- Python 3.10+ installed (Python 3.14 verified)
- Free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
cd backend
python -m venv .venv
.\.venv\Scripts\activate.bat
```

**macOS / Linux:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables (Google Gemini API Key)

Copy `.env.example` to `.env`:
```powershell
copy .env.example .env     # Windows
cp .env.example .env       # macOS / Linux
```

Open `backend/.env` in your text editor and supply your free Gemini API key:
```env
# Google Gemini API Settings (Official Google Gen AI SDK)
# Obtain your free key from https://aistudio.google.com/
GEMINI_API_KEY=AIzaSy...your-actual-api-key-here...
GEMINI_MODEL=gemini-2.5-flash
```

> [!SECURITY]
> **API Key Safety**:
> - Never commit `backend/.env` to Git. It is automatically excluded via `backend/.gitignore`.
> - Never paste your API key into frontend code, browser requests, or client storage.
> - The frontend communicates strictly with your local FastAPI server (`/api/chat`), which securely proxies requests to Google Gemini.

### 5. Run the FastAPI Development Server

With the virtual environment active:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Or directly using the virtualenv python:
```powershell
.\.venv\Scripts\python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at:
- **Base URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## Running Backend and Frontend Together

To test the complete system locally, run the backend and frontend in two separate terminals:

### Terminal 1: Backend (FastAPI)
```powershell
cd backend
.\.venv\Scripts\python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2: Frontend (Vite)
```powershell
cd frontend
npm run dev
```

Visit [http://localhost:5173/fisherman/safety-alerts](http://localhost:5173/fisherman/safety-alerts) to interact with the AI assistant.

---

## API Endpoints

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Service root with API navigation links and documentation shortcuts | Live |
| `GET` | `/api/health` | Backend status, Gemini model readiness, and service flags | Live |
| `POST` | `/api/chat` | Marine safety conversational assistant powered by Google Gemini | **Live Google Gen AI** |
| `GET` | `/api/marine/conditions` | Coastal marine conditions (wind, waves, swell, pressure) | Simulation Demo |
| `GET` | `/api/marine/regions` | Configured Tamil Nadu coastal observation sectors | Simulation Demo |
| `GET` | `/api/alerts` | Active marine safety advisories with bilingual translations | Simulation Demo |
| `GET` | `/api/profile` | Documented user identity placeholder for Supabase Auth | Phase 1 Placeholder |
| `POST` | `/api/sos` | Authenticated emergency SOS alert submission with idempotency & device GPS | **Live Core Service** |
| `GET` | `/api/sos/{incident_id}` | Retrieve confirmed SOS incident status by incident reference | **Live Core Service** |

---

## `POST /api/sos` Specification

The `POST /api/sos` endpoint receives distress alerts triggered when a fisherman allows the 5-second countdown to expire.

### Safety & Integrity Architecture
1. **Server-Validated Identity**: The fisherman profile (M. Selvam, craft TN-02-MM-4491) is authenticated by the server backend. Client claims of user ID are never blindly trusted.
2. **Idempotency Guarantees**: Every submission includes a client-generated `idempotencyKey`. Repeated submissions or network retries do not create duplicate emergency records.
3. **Truthful Device Location**: Coordinates submitted from HTML5 Geolocation are logged as the *device's* GPS fix, never fabricated vessel coordinates. If location permission is denied or unavailable, the request records `locationStatus: "location_unavailable"`.
4. **Safety Disclaimers**: The API strictly reports whether the incident was received and persisted to the audit log. It explicitly states `notificationDispatchStatus: "no_external_dispatch_service_configured"` and outputs official marine emergency numbers (VHF Ch 16, 1554, 1093, 112).

### Request Body
```json
{
  "idempotencyKey": "sos-f7a39d8e-1738492019283-k92a",
  "deviceCoordinates": {
    "latitude": 13.0827,
    "longitude": 80.2707,
    "accuracyMeters": 15.4
  },
  "emergencyNotes": "Engine stall 4nm off Chennai harbour in heavy chop",
  "language": "en"
}
```

### Response (201 Created)
```json
{
  "status": "received",
  "incidentId": "CG-SOS-20261016-EAC3F4",
  "idempotencyKey": "sos-f7a39d8e-1738492019283-k92a",
  "timestamp": "2026-10-16T12:15:32.418290+00:00",
  "fisherman": {
    "id": "usr-101",
    "name": "M. Selvam",
    "contact": "+91 98401 23456",
    "homeHarbour": "Kasimedu Fishing Harbour",
    "vesselName": "Meenavan 1",
    "registrationNo": "TN-02-MM-4491"
  },
  "deviceLocation": {
    "latitude": 13.0827,
    "longitude": 80.2707,
    "accuracyMeters": 15.4
  },
  "locationStatus": "device_gps_provided",
  "databasePersistence": "persisted_to_memory_audit_log",
  "notificationDispatchStatus": "no_external_dispatch_service_configured",
  "disclaimer": "SOS request recorded by CoastalGuard AI backend. Live rescue dispatch/telecom service is not configured in this prototype. Immediately contact official emergency services via VHF Ch 16 or Indian Coast Guard Helpline 1554.",
  "emergencyContacts": {
    "vhf_channel": "VHF Marine Channel 16 (Distress & Safety)",
    "coast_guard_helpline": "1554 (Indian Coast Guard Toll-Free)",
    "marine_police": "1093 (Tamil Nadu Coastal Security Police)",
    "national_emergency": "112 (National Emergency Response System)"
  }
}
```

## `POST /api/chat` Specification

### Request Body
```json
{
  "message": "What is the difference between sea swell and normal wind waves?",
  "language": "en",
  "contextBulletin": "Official Bulletin CG-IN-2026-089A for Gulf of Mannar: High swell advisory"
}
```

### Request Headers
- `Content-Type: application/json`

### Query / Form Fields
- `message` (string, required, 1-2000 chars): User's inquiry.
- `language` (string, optional, `"en"` | `"ta"`): Language of the response. Defaults to `"en"`.
- `contextBulletin` (string, optional): Context string containing the active safety advisory being viewed.

### Response (200 OK)
```json
{
  "status": "success",
  "reply": "Normal wind waves are generated directly by local winds blowing over the water surface and are often short and choppy. Sea swell, by contrast, refers to mature waves created by distant storm systems that travel across hundreds of nautical miles. Swells carry much higher kinetic energy and can cause severe boat rocking or capsizing near shorelines.",
  "language": "en",
  "model": "gemini-2.5-flash",
  "timestamp": "2026-10-16T09:15:30.123456+00:00",
  "disclaimer": "CoastalGuard AI explains marine safety information and does not replace official marine authorities or direct navigational instruments.",
  "isLiveAi": true
}
```

### Tamil Request Example
```json
{
  "message": "அலை வீச்சு (swell) என்றால் என்ன?",
  "language": "ta"
}
```

### Error Responses

- **400 Bad Request (`EMPTY_MESSAGE`)**: Message is blank or contains only whitespace.
- **401 Unauthorized (`INVALID_API_KEY`)**: Configured `GEMINI_API_KEY` is invalid or expired.
- **404 Not Found (`MODEL_NOT_FOUND`)**: Configured `GEMINI_MODEL` is unavailable for the API key.
- **429 Too Many Requests (`RATE_LIMIT_EXCEEDED`)**: API quota or rate limit exceeded.
- **502 Bad Gateway (`UPSTREAM_API_ERROR`)**: Communication failure with Google AI services.
- **503 Service Unavailable (`GEMINI_NOT_CONFIGURED`)**: `GEMINI_API_KEY` has not been set in `backend/.env`.

---

## Marine Safety System Instructions for Gemini

The assistant is configured with domain-specific system instructions:
1. **Bilingual Fluency**: Responds exclusively in natural, fluent Tamil when `language="ta"` and clear English when `language="en"`.
2. **Explainer Role**: Strictly acts as an informational explainer; never issues legal clearances or claims official authority.
3. **No Fabricated Real-time Data**: Never invents current weather, live sea heights, port closures, or boat positions unless provided in verified context.
4. **Sea Safety Clearances**: If asked "Is it safe to go out to sea?", explicitly declares that it cannot determine real-time sea safety and instructs the user to contact local port masters and listen to VHF Channel 16.
5. **Human Safety First**: Emphasizes lifejacket usage, harbour anchorages, and adherence to official INCOIS and Fisheries Department advisories.
