# NyayFauj — Okhla Community Monitor

> Community-powered safety monitoring platform for Okhla, New Delhi.

A Progressive Web App built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Appwrite** — designed for mobile-first operation with offline capabilities, secure authentication, and community-driven reporting.

---

## Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- **Appwrite** account ([Cloud](https://cloud.appwrite.io) or self-hosted)

### Installation

```bash
git clone https://github.com/nyayfauj/rssokhla.git
cd rssokhla
npm install
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Appwrite Setup

### 1. Create Project
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project named `rssokhla`
3. Add a **Web** platform with hostname `localhost` and your production domain

### 2. Create Database
Create a database named `rssokhla_db` with the following collections:

| Collection | ID | Document Security |
|------------|-----|-------------------|
| Incidents | `incidents` | Enabled |
| Locations | `locations` | Disabled |
| Users | `users` | Enabled |
| Reports | `reports` | Enabled |
| Alerts | `alerts` | Disabled |
| Profiles | `profiles` | Enabled |

### 3. Environment Variables
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=rssokhla_db
APPWRITE_API_KEY=your_server_api_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, Register, Anonymous access
│   ├── (protected)/        # Dashboard, Admin, Alerts (auth required)
│   ├── api/v1/             # REST API endpoints
│   ├── privacy/            # Privacy Policy
│   ├── terms/              # Terms of Service
│   ├── manifest.ts         # PWA manifest
│   ├── robots.ts           # robots.txt
│   └── sitemap.ts          # sitemap.xml
├── components/
│   ├── ui/                 # Button, Card, Input, Modal, Toast, GlassCard
│   ├── layout/             # Header, BottomNav, Footer, CookieConsent
│   ├── monitor/            # Dashboard visualizations (charts, gauges)
│   ├── incidents/          # IncidentCard, FilterSheet, SearchBar
│   ├── map/                # MapView, LocationSearch, MapControls
│   └── report/             # LocationPicker, MediaCapture
├── hooks/                  # Custom React hooks
├── lib/
│   ├── appwrite/           # Client/Server SDK init, collections, permissions
│   ├── crypto/             # AES-256, RSA-OAEP encryption
│   └── utils/              # Constants, formatters, validators
├── services/               # Business logic layer
├── stores/                 # Zustand state management
└── types/                  # TypeScript type definitions
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Community Reporting** | Submit incident reports with location, media, and categories |
| **Real-Time Dashboard** | Live monitoring with charts, maps, and activity feeds |
| **Offline Support** | Queue reports offline, sync when connected |
| **Anonymous Access** | Report without creating an account |
| **Interactive Map** | Mapbox-powered map with clustering and heatmaps |
| **Role-Based Access** | 5 roles: anonymous, registered, reporter, moderator, admin |
| **PWA** | Installable, works offline, push notifications |
| **Privacy-First** | Cookie consent, privacy policy, data rights compliance |

---

## Security

| Feature | Implementation |
|---------|---------------|
| **Encryption** | AES-256-GCM + RSA-OAEP via Web Crypto API |
| **Auth** | Appwrite sessions with httpOnly cookies |
| **Anonymous** | Anonymous sessions with device fingerprinting |
| **2FA** | TOTP with QR code |
| **RBAC** | 5-tier role hierarchy with granular permissions |
| **Rate Limiting** | 60 req/min per IP on API routes |
| **Security Headers** | CSP, HSTS, X-Frame-Options, etc. |

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npx tsc --noEmit     # Type check
```

---

## License

GPL-3.0 — See [LICENSE](LICENSE) for details.

---

Built for the community of Okhla, New Delhi.
