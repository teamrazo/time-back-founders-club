# RazoRSharp Networks — Client Intake Form

**TimeBACK System · New Client Onboarding**

> One System. One Flow. One Outcome. FREEDOM

A beautiful, production-quality multi-step intake form for RazoRSharp Networks. Collects everything needed to build a client's AI Freedom Plan.

---

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- Custom UI components (no external component library dependencies)
- Local JSON file storage (upgrade path to any DB)

## Form Sections

1. Company Snapshot
2. Owner Profile
3. Five Pillars Assessment (interactive button ratings)
4. Business Goals
5. Pain Points & Friction
6. Customer Lifecycle
7. Operator → Engineer Score
8. Brand & Communication
9. FREEDOM Scorecard (interactive 1-10 sliders)
10. Quick Wins & Priorities
11. Review & Submit

## Features

- Multi-step wizard with progress bar
- Auto-save to localStorage (resume where you left off)
- Smooth step transitions
- Mobile-responsive
- Form validation
- Save progress indicator
- Final review step before submit
- Thank you page with "What Happens Next"

## Backend

- `POST /api/submit` — saves JSON to `./data/` directory
- Also fires a configurable webhook (for GHL, Airtable, Make.com)
- Returns `{ success: true, id }` on success

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
WEBHOOK_URL=https://your-webhook-url.com   # Optional
DATA_DIR=/custom/path/to/data              # Optional, defaults to ./data
```

## Deployment (Vercel)

```bash
vercel deploy --prod
```

Set `WEBHOOK_URL` in Vercel environment variables to connect to GHL, Airtable, or Make.com.

---

_RazoRSharp Networks — Systems Architecture & AI Growth Engineering_
