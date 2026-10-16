# CoastalGuard AI — Frontend Prototype

This is the React + TypeScript frontend prototype for **CoastalGuard AI**, built with Vite, React Router, Lucide React icons, and CSS variables.

## Getting Started

### 1. Navigate to the frontend directory
```bash
cd coastalguard-ai/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

The application will run locally at:
👉 **`http://localhost:5173`**

### 4. Build for production preview (optional)
```bash
npm run build
npm run preview
```

## Features & Route Map

- **`/`**: Landing page with Hero, 4 core feature cards, About section, and portal access.
- **`/admin/login`**: Administrative authority portal login (Prototype validation).
- **`/admin/dashboard`**: Authority command overview with sample fleet counters and active danger alerts.
- **`/admin/marine-monitoring`**: Wind, swell height, rainfall, and barometric telemetry by sector.
- **`/admin/boat-monitoring`**: Regional vessel presence map with transponder freshness status.
- **`/admin/risk-alerts`**: Risk categorization and alert broadcasting modal with local state preview.
- **`/admin/users`**: Registered fishermen directory with search and active/inactive status toggle.
- **`/fisherman/login`**: Fisherman portal login (Prototype validation).
- **`/fisherman/dashboard`**: Fisherman safety cockpit with quick conditions summary and danger banner.
- **`/fisherman/marine-map`**: Interactive coastal safety map with sample safe harbour shelter details.
- **`/fisherman/safety-assistant`**: Bilingual (English & Tamil) alert breakdown and static demo AI chat assistant.
- **`/fisherman/profile`**: Fisherman profile, boat info, preferred language, and local editable details.

## Note on Integrations
This prototype runs **entirely in the browser** without external API keys, databases, or live telemetry. All information shown is realistic mock data designed for demonstration and UI/UX validation during college project reviews.
