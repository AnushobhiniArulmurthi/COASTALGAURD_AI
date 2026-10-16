# Services Directory (Planned Integration)

This directory will hold client-side API connectors and data fetching services once backend integration begins.

## Planned Services
- `apiClient.ts`: Base Axios/Fetch instance configured with bearer tokens and retry policies.
- `weatherService.ts`: Connector for marine weather data (INCOIS, Open-Meteo, NOAA).
- `boatTrackingService.ts`: AIS / transponder telemetry feed listener (WebSocket / SSE).
- `alertService.ts`: Push notifications and broadcast alerts management.
- `aiAssistantService.ts`: Gemini API client for prompt processing and multilingual translations.
- `authService.ts`: Supabase / JWT authentication flow.

## Current Prototype Status
Currently, mock data is served locally via typed static stores inside the components and pages. No active network requests are initiated in this frontend prototype.
