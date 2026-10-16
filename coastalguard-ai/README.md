# CoastalGuard AI — Marine Safety Assistance Platform

> **"Safer Seas. Smarter Decisions."**
> A modern, responsive frontend prototype designed for fishermen and maritime authorities to monitor marine conditions, access safety warnings, and promote coastal safety.

---

## 📌 Project Overview

**CoastalGuard AI** is a conceptual marine safety assistant platform engineered to protect artisanal and deep-sea fishing communities. It provides dual-perspective operational dashboards:
1. **Fisherman Portal**: Accessible, language-inclusive interface featuring marine conditions, danger zone maps, multilingual alerts (English & Tamil), and a conversational AI safety assistant.
2. **Admin Portal**: Maritime authority overview offering sector-wide marine telemetry, boat presence monitoring, danger-level management, and broadcast alerts.

> ⚠️ **Prototype Notice**: This is a **Frontend-Only Prototype** designed for college project presentation and UI/UX validation. No real external APIs, live GPS tracking, Supabase/database, or backend services are currently connected. All metrics and vessel locations are fictional demonstration data.

---

## 🗂️ Project Directory Structure

```text
coastalguard-ai/
├── frontend/                     # React + Vite + TypeScript application
│   ├── public/                   # Static assets, SVG favicons, icons
│   │   ├── images/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/               # Images and graphics
│   │   │   └── images/
│   │   ├── components/
│   │   │   ├── common/           # Universal UI building blocks
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── ModuleCard.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── PlaceholderPanel.tsx
│   │   │   ├── layout/           # Portal layout shells with sidebars
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   └── FishermanLayout.tsx
│   │   │   └── routing/          # React Router route registry
│   │   │       └── AppRoutes.tsx
│   │   ├── pages/
│   │   │   ├── home/             # Landing page
│   │   │   │   ├── HomePage.tsx
│   │   │   │   └── HomePage.module.css
│   │   │   ├── auth/             # Login portals with demo validation
│   │   │   │   ├── AdminLogin.tsx
│   │   │   │   ├── AdminLogin.module.css
│   │   │   │   ├── FishermanLogin.tsx
│   │   │   │   └── FishermanLogin.module.css
│   │   │   ├── admin/            # Maritime authority dashboard & modules
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminDashboard.module.css
│   │   │   │   └── modules/
│   │   │   │       ├── MarineMonitoring.tsx
│   │   │   │       ├── BoatRegionalMonitoring.tsx
│   │   │   │       ├── RiskAlertManagement.tsx
│   │   │   │       └── UserManagement.tsx
│   │   │   └── fisherman/        # Fisherman safety dashboard & modules
│   │   │       ├── FishermanDashboard.tsx
│   │   │       ├── FishermanDashboard.module.css
│   │   │       └── modules/
│   │   │           ├── MarineConditionsMap.tsx
│   │   │           ├── SafetyAlertsAssistant.tsx
│   │   │           └── MyProfile.tsx
│   │   ├── services/             # API services (reserved for future backend)
│   │   │   └── README.md
│   │   ├── types/                # TypeScript interfaces and domain models
│   │   │   └── index.ts
│   │   ├── styles/               # CSS variables and styling system
│   │   │   ├── variables.css
│   │   │   ├── global.css
│   │   │   └── utilities.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                      # Reserved for Node/Python microservices
│   └── README.md
├── database/                     # Reserved for Supabase / SQL migrations
│   └── README.md
└── README.md
```

---

## 🚀 How to Run the Frontend Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Steps
1. Open a terminal in the frontend directory:
   ```bash
   cd coastalguard-ai/frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at:
   ```text
   http://localhost:5173
   ```

---

## 🧭 Navigation & Routes

| Path | Description |
|---|---|
| `/` | Landing Homepage with Hero, Features, About & Portals |
| `/admin/login` | Admin Portal Login (Demo authentication) |
| `/admin/dashboard` | Coastal Authority Overview Dashboard |
| `/admin/marine-monitoring` | Marine Weather, Wave, and Swell Monitoring |
| `/admin/boat-monitoring` | Regional Fleet Tracking & Status Map |
| `/admin/risk-alerts` | Alert Management & Warning Broadcast Modal |
| `/admin/users` | Registered Fishermen & Vessel Directory |
| `/fisherman/login` | Fisherman Portal Login |
| `/fisherman/dashboard` | Fisherman Safety Dashboard |
| `/fisherman/marine-map` | Marine Conditions, Safe Harbours & Map |
| `/fisherman/safety-assistant` | Multilingual Alerts & AI Assistant Chat |
| `/fisherman/profile` | Fisherman Profile & Vessel Credentials |

---

## 🎨 Design System
- **Theme**: Deep Marine Navy (`#0B192C`, `#1E3E62`), Sea Foam Teal (`#0D9488`, `#06B6D4`), and Oceanic Cyan accents.
- **Typography**: Inter / clean sans-serif with strong typographic hierarchy.
- **Icons**: Lucide React.
- **Responsiveness**: Fully fluid on Mobile, Tablet, and Desktop.
