# ⚡ SiteIQ — AI-Powered Website Analyzer

A full-stack Next.js 14 application that analyzes any website using Claude AI and returns
detailed scores + improvement recommendations across 7 dimensions.

---

## 🗂 Folder Structure

```
siteiq/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts          # POST /api/analyze — main AI analysis
│   │   ├── history/
│   │   │   ├── route.ts          # GET/DELETE /api/history
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET/DELETE /api/history/:id
│   │   └── export/
│   │       └── route.ts          # POST /api/export — PDF & JSON download
│   ├── globals.css               # Global styles + CSS variables
│   ├── layout.tsx                # Root layout with fonts + metadata
│   └── page.tsx                  # Main client page (all state lives here)
│
├── components/
│   ├── analysis/
│   │   ├── CircularScore.tsx     # Animated circular progress ring
│   │   ├── ScoreBar.tsx          # Animated horizontal score bar
│   │   ├── SuggestionCard.tsx    # AI recommendation card
│   │   ├── LoadingScreen.tsx     # Step-by-step loading animation
│   │   ├── ResultsDashboard.tsx  # Full results layout
│   │   └── HistoryPanel.tsx      # Past reports modal
│   └── ui/
│       ├── Navbar.tsx            # Top navigation bar
│       └── HeroSection.tsx       # Landing hero with input
│
├── lib/
│   ├── analyzer.ts               # Anthropic API call + prompt engineering
│   ├── pdfExport.ts              # jsPDF report generation
│   ├── store.ts                  # In-memory report store (swap for DB)
│   └── utils.ts                  # scoreColor, triggerDownload, etc.
│
├── types/
│   └── index.ts                  # All TypeScript interfaces
│
├── .env.local.example            # Environment variables template
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json
```

---

## 🚀 Setup & Run (VS Code)

### 1. Clone / create the project

```bash
# If you have the files, navigate to the folder:
cd siteiq

# OR create fresh with Next.js and replace files:
npx create-next-app@latest siteiq --app --typescript --tailwind --eslint
```

### 2. Install dependencies

```bash
npm install
```

This installs:
- `next`, `react`, `react-dom` — framework
- `@anthropic-ai/sdk` — Claude AI client
- `framer-motion` — animations
- `jspdf` + `jspdf-autotable` — PDF export
- `uuid` — unique report IDs
- `clsx` — conditional class names

### 3. Set your API key

```bash
# Copy the example file:
cp .env.local.example .env.local

# Then open .env.local and replace the placeholder:
ANTHROPIC_API_KEY=sk-ant-YOUR_ACTUAL_KEY_HERE
```

Get your key at: https://console.anthropic.com

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. ✅

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🔌 API Reference

### `POST /api/analyze`
Analyze a website and save the report.

**Request:**
```json
{ "url": "https://stripe.com" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://stripe.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "overallScore": 91,
    "categories": [...],
    "suggestions": [...],
    "verdict": "..."
  }
}
```

---

### `GET /api/history`
Returns all stored reports (sorted newest first).

### `DELETE /api/history`
Clears all history.

### `GET /api/history/:id`
Returns a single report by ID.

### `DELETE /api/history/:id`
Deletes a single report.

---

### `POST /api/export`
Download a report as PDF or JSON.

**Request:**
```json
{ "reportId": "uuid", "format": "pdf" }
```
or
```json
{ "reportId": "uuid", "format": "json" }
```

**Response:** Binary PDF or JSON file attachment.

---

## 🗄 Swapping to a Real Database

The current `lib/store.ts` uses an in-memory Map — data resets on server restart.

To persist data, replace `lib/store.ts` with any of:

**Supabase (PostgreSQL):**
```bash
npm install @supabase/supabase-js
```

**MongoDB:**
```bash
npm install mongoose
```

**Prisma + PostgreSQL:**
```bash
npm install prisma @prisma/client
```

---

## 🎨 Customization

- **Theme colors**: Edit `app/globals.css` `:root` variables
- **AI prompt**: Edit `lib/analyzer.ts` → `buildPrompt()`
- **Categories**: Add/remove items in the prompt JSON schema
- **Loading steps**: Edit `components/analysis/LoadingScreen.tsx` → `STEPS` array

---

## 📦 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router)           |
| Language    | TypeScript                        |
| Styling     | Tailwind CSS + CSS Variables      |
| Animations  | Framer Motion                     |
| AI          | Anthropic Claude (claude-sonnet)  |
| PDF Export  | jsPDF + jsPDF-AutoTable           |
| IDs         | uuid                              |
| Storage     | In-memory Map (swap for DB)       |
