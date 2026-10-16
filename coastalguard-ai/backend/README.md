# CoastalGuard AI — Backend Service

This directory provides the backend API service for the **CoastalGuard AI** marine safety platform.

## 📌 Architecture & Endpoints

The backend is built as a zero-dependency in-memory HTTP API designed to serve marine telemetries, regional fleet reports, risk advisories, and fisherman directories without connecting to an external database.

### Implemented REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and real-time capabilities |
| `GET` | `/api/vessels` | Full fleet transponder reports and telemetry |
| `GET` | `/api/vessels/:id` | Detailed telemetry for a specific vessel |
| `GET` | `/api/marine-conditions` | Multi-sector oceanographic conditions |
| `GET` | `/api/marine-conditions/:regionId` | Specific sector oceanographic telemetry |
| `GET` | `/api/alerts` | Active marine safety bulletins and danger notices |
| `POST` | `/api/alerts` | Publish a new safety bulletin to in-memory store |
| `GET` | `/api/users` | Directory of registered fishermen profiles |
| `PATCH` | `/api/users/:id/status` | Toggle or update user account status |

## 🚀 Running the Backend

```bash
cd backend
npm start
```
Default port: `5000` (`http://localhost:5000/api`)

## ⚠️ Real-Time & Database Limitations

- **Database Restriction**: In compliance with security and architectural rules, no direct connection to Supabase or external SQL databases is configured. All records persist in-memory during server runtime.
- **Real-Time Data Feeds**: Actual live satellite AIS feeds (e.g., MarineTraffic or Spire) and VHF shore coastal radar receivers are not connected. The API serves clearly labelled telemetry reports for demonstration and architectural validation.
