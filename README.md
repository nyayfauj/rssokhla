# 🛡️ NyayFauj — Okhla Community Monitor

> Community-powered counter-intelligence monitoring platform for tracking RSS activities in Okhla.

A Progressive Web App built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Appwrite** — designed for mobile-first operation with offline capabilities, end-to-end encryption, and anonymous reporting.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- **Appwrite** account ([Cloud](https://cloud.appwrite.io) or self-hosted)

### Installation

```bash
# Clone the repository
git clone https://github.com/nyayfauj/rssokhla.git
cd rssokhla

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Appwrite Setup Guide

### 1. Create Project
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project named `rssokhla`
3. Add a **Web** platform with hostname `localhost` (dev) and your production domain

### 2. Create Database
Create a database named `rssokhla_db` and set up the following collections:

#### Collections

| Collection | ID | Document Security |
|------------|-----|-------------------|
| Incidents | `incidents` | ✅ Enabled |
| Locations | `locations` | ❌ Disabled |
| Users | `users` | ✅ Enabled |
| Reports | `reports` | ✅ Enabled |
| Alerts | `alerts` | ❌ Disabled |

#### Incidents Attributes
| Attribute | Type | Required |
|-----------|------|----------|
| title | string(256) | ✅ |
| description | string(4096) | ✅ |
| locationId | string(36) | ❌ |
| reporterId | string(36) | ✅ |
| timestamp | datetime | ✅ |
| category | enum | ✅ |
| severity | enum | ✅ |
| status | enum | ✅ |
| mediaUrls | string[] | ❌ |
| isAnonymous | boolean | ✅ |
| verifiedBy | string[] | ❌ |
| verificationCount | integer | ✅ |
| coordinates | float[] | ❌ |
| tags | string[] | ❌ |

See `src/types/` for complete schema definitions for all 5 collections.

### 3. Create Teams
- `moderators` — Can manage incidents, alerts, locations
- `admins` — Full platform access

### 4. API Key
Create a server-side API key with scopes: `databases.read`, `databases.write`, `users.read`, `users.write`

### 5. Environment Variables
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=rssokhla_db
APPWRITE_API_KEY=your_api_key
```

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, Register, Anonymous
│   ├── (protected)/        # Dashboard, Incidents, Map, Alerts
│   ├── api/v1/             # REST API endpoints
│   ├── manifest.ts         # PWA manifest
│   └── layout.tsx          # Root layout with providers
├── components/
│   ├── ui/                 # Button, Input, Card, Badge, Modal, Skeleton, Toast
│   ├── auth/               # LoginForm, RegisterForm, AnonymousAccess
│   ├── incidents/          # IncidentCard, SeverityBadge
│   ├── alerts/             # AlertBanner
│   └── layout/             # Header, BottomNav
├── hooks/                  # useSwipeGesture, useMediaQuery, useOfflineSync
├── lib/
│   ├── appwrite/           # Client/Server init, collections, permissions
│   ├── crypto/             # AES-256, RSA-OAEP, Device fingerprinting
│   └── utils/              # Constants, validators, formatters, API response
├── middleware.ts            # Auth, RBAC, rate limiting, security headers
├── services/               # Auth, Incident, Report, Alert, Encryption
├── stores/                 # Zustand: auth, incidents, alerts, UI
└── types/                  # TypeScript type definitions
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|---------------|
| **Encryption** | AES-256-GCM + RSA-OAEP via Web Crypto API |
| **Auth** | Appwrite sessions with httpOnly cookies |
| **Anonymous** | Anonymous sessions with device fingerprinting |
| **2FA** | TOTP with QR code (otpauth library) |
| **RBAC** | 5 roles with granular permission matrix |
| **Rate Limiting** | 60 req/min per IP on API routes |
| **Security Headers** | CSP, HSTS, X-Frame-Options, etc. |
| **Input Sanitization** | XSS prevention on all user inputs |

### Role Hierarchy
`anonymous_user` → `registered_user` → `verified_reporter` → `moderator` → `admin`

---

## 📱 PWA Features

- **Offline mode** — Cache-first for static, network-first for API
- **Install prompt** — Add to Home Screen on mobile
- **Push notifications** — Alert-triggered notifications
- **Background sync** — Queue reports offline, sync when back online
- **Service worker** — Custom caching strategies per resource type

---

## 🎨 Design System

- **Theme**: Dark-first with red (#dc2626) accent
- **Font**: Inter (Google Fonts, swap display)
- **Mobile-first**: Bottom navigation, swipe gestures, 48px touch targets
- **Animations**: Slide-up, fade-in, reduced-motion support
- **Glassmorphism**: Backdrop-blur panels for overlays

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Set environment variables in Vercel dashboard.

### Docker (Self-hosted)
```bash
npm run build
npm start
```

### Cloudflare Pages
```bash
npm run build
npx wrangler pages publish .next
```

---

## 📝 Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npx tsc --noEmit     # Type check
```

---

## 📄 License

GPL-3.0 — See [LICENSE](LICENSE) for details.

---

Built with ❤️ for the community of Okhla.
