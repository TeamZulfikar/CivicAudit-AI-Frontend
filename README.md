# 🏛️ CivicAudit AI - Modern Next.js Frontend

> **Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Lucide Icons  
> **Architecture:** Decoupled Client-Server (Next.js on Port 3000 <-> FastAPI on Port 8000)

---

## ⚡ Quickstart

### 1. Configure the Backend API URL
By default, the frontend connects to `http://127.0.0.1:8000`. You can customize this in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 2. Install Dependencies (if not already installed)
```bash
pnpm install
```

### 3. Run the Development Server
```bash
pnpm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Architecture & Features

- **Decoupled API Client (`src/lib/api.ts`)**: Communicates with the FastAPI backend endpoints (`/api/audit`, `/api/audit_custom`, `/api/upload_tender`, `/api/settings`, `/api/save_settings`, `/api/test_ai`).
- **Live Backend Telemetry (`src/components/Header.tsx`)**: Periodically pings the FastAPI backend and provides real-time online/offline indicator pills.
- **Tribunal Deliberation Cards (`src/components/AgentDebateCard.tsx`)**: Visualizes multi-turn adversarial debates among Agent Scout (Data Investigator), Agent Advocate (Supplier Counsel), and Chief Auditor (Judicial Arbiter).
- **Forensic Anomaly Matrix (`src/components/AnomalyTable.tsx`)**: Searchable, filterable table with expandable multi-agent debate cards for every procurement line-item.
- **In-Browser Settings Modal (`src/components/SettingsModal.tsx`)**: Allows switching Council modes (`llm`, `hybrid`, `deterministic`), configuring multi-key LLM providers (Groq, OpenRouter, Gemini, etc.), and testing AI connections on the fly.
- **Universal Docket Ingestion (`src/components/TenderIngestion.tsx`)**: Drag-and-drop document upload (PDF, Excel, CSV, JSON), raw BOQ paste, and instant preloaded municipal docket auditing.
