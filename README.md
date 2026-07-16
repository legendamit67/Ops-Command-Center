# Estadio Azteca Operations Command Center (ArenaIntel) — FIFA World Cup 2026

ArenaIntel is a full-stack, production-ready Stadium Operations Command Center and Spectator Services platform engineered for the **FIFA World Cup 2026** at the historic **Estadio Azteca, Mexico City**. 

The system provides live telemetry monitoring, real-time match stats, AI-augmented incident dispatch, instant crowd density simulation, public transit/gate flow management, and interactive spectator guidance in over 100+ languages—powered by the state-of-the-art **Gemini API**.

---

## 🏗️ Technical Architecture

The platform uses a unified, full-stack architecture running **React 19 + TypeScript + Vite** on the frontend, and a high-performance **Express + tsx** server on the backend. Production builds are bundled cleanly into an optimized CommonJS bundle (`dist/server.cjs`) using **esbuild** for cold-start speed and reliability.

```mermaid
graph TD
    %% Frontend Components
    subgraph Client [Frontend SPA - React 19 / Vite]
        UI[App.tsx] --> Header[Header.tsx]
        UI --> FH[FanHub.tsx]
        UI --> CC[CommandCenter.tsx]
        UI --> SH[SustainabilityHub.tsx]
        UI --> SOS[AIAlertPopup.tsx]
        
        StyleCC[Tailwind CSS] --> UI
        Framer[motion/react] --> UI
    end

    %% Backend Server
    subgraph Server [Backend Full-Stack Server - Express / Node.js]
        API[server.ts]
        DB_Sim[In-Memory Game State Engine]
        GenAI[Google GenAI Client SDK]
    end

    %% Network and API Interactions
    FH -- GET /api/stadium/data --> API
    Header -- GET /api/stadium/match-score --> API
    CC -- POST /api/gemini/incident --> API
    SH -- POST /api/gemini/sustainability --> API
    SOS -- POST /api/gemini/sos --> API
    FH -- POST /api/gemini/chat --> API

    API --> DB_Sim
    API --> GenAI
    
    %% External Services
    subgraph External [External Services]
        Gemini[Google Gemini API]
    end
    
    GenAI -- @google/genai SDK --> Gemini
```

---

## 🔄 Core System Workflows

### 1. Live Telemetry & Score Ingestion Pipeline
This sequence diagram illustrates how live game states and stadium telemetry (gate congestion, transit delays, weather metrics) are served and updated in real-time.

```mermaid
sequenceDiagram
    autonumber
    participant Browser as React App (Client)
    participant Server as Express Server (server.ts)
    participant GameEngine as Game State Engine
    participant Gemini as Google Gemini API

    Note over Browser, Server: Matchday Ingestion (Every 10s Polling)
    Browser->>Server: GET /api/stadium/match-score
    Server->>GameEngine: updateLiveMatchState()
    alt Random Event Triggered (15% chance)
        GameEngine->>GameEngine: Generate Event (Goal, Card, Substitution, Info)
    end
    GameEngine-->>Server: Return updated match state
    Server-->>Browser: Return LiveScore JSON (200 OK)
    Browser->>Browser: Update UI state (Header score, recent events list)

    Note over Browser, Server: Stadium Infrastructure Telemetry
    Browser->>Server: GET /api/stadium/data
    Server-->>Browser: Return Sector Load, Gates Wait, Transit Status (200 OK)
```

### 2. Incident Management & GenAI Decision Loop
When an operational incident occurs (e.g., gate congestion, localized fire, medical hazard), safety personnel dispatch the incident to the CommandCenter. The system requests immediate operational tactics and public-facing announcements from the Gemini API.

```mermaid
flowchart TD
    A[Steward Reports Incident] --> B[Enter details in CommandCenter UI]
    B --> C[Submit Alert to POST /api/gemini/incident]
    
    subgraph Backend [Server-Side Processing]
        C --> D{Is GEMINI_API_KEY set?}
        D -- Yes --> E[Request structured JSON from Gemini-Flash-Latest]
        D -- No --> F[Load Simulated Local Safety Playbook]
        
        E --> G[Receive Structured Action Plan, Announcements, Safety Level]
        F --> H[Compile Default Standard Safety Rules]
        
        G --> I[Format response JSON]
        H --> I
    end
    
    I --> J[Display steward action plans in Command UI]
    I --> K[Generate PA broadcast scripts EN, ES, FR]
    I --> L[Update crowd safety operational level: INTERVENE / MONITOR / EVACUATE]
```

### 3. Emergency SOS Spectator Support Workflow
If a spectator is injured, experiences heat stroke, or detects an immediate risk, they can activate the emergency SOS button. This routes coordinates directly to the command desk and uses Gemini to issue tailored medical reassurance.

```mermaid
flowchart LR
    Fan[Fan clicks SOS button] --> Input[Enter seat details & emergency type]
    Input --> Request[POST /api/gemini/sos]
    
    subgraph Dispatch [Real-Time Processing]
        Request --> KeyCheck{Key Active?}
        KeyCheck -- Yes --> LLM[Prompt Gemini Safety Dispatch Model]
        KeyCheck -- No --> Fallback[Compile standard First-Aid instructions]
        
        LLM --> JSON[Verify schema: instruction, dispatch status, routes, nearby stewards]
        Fallback --> JSON
    end
    
    JSON --> Display[Render blinking safety panel on Fan's phone]
    JSON --> Alert[Pop alert on Staff Dashboard with exact seat location]
    JSON --> Mobilize[Dispatch nearby volunteer steward squad]
```

---

## 🔌 API Reference Document

### 1. Matchday Telemetry Data
* **Endpoint:** `GET /api/stadium/data`
* **Response Content Type:** `application/json`
* **Description:** Returns the live operational data of Estadio Azteca, including sector queues, transit statuses, and sustainability metrics.
* **Example Response:**
  ```json
  {
    "stadiumName": "Estadio Azteca, Mexico City",
    "capacity": 87523,
    "sectors": [
      { "name": "North Gate A", "currentWaitMinutes": 8, "status": "Normal", "flowRate": "120 fans/min", "currentLoadPercentage": 35 }
    ],
    "transit": [
      { "name": "Metro Line 2", "type": "Train", "frequencyMinutes": 3, "waitMinutes": 15, "status": "Crowded" }
    ],
    "sustainability": {
      "energyUsageKWh": 14200,
      "energySource": "Solar & Grid Hybrid"
    }
  }
  ```

### 2. Live Match Score & Dynamic Events
* **Endpoint:** `GET /api/stadium/match-score`
* **Response Content Type:** `application/json`
* **Description:** Returns current match scores and dynamic match events. Refreshes and updates game state on request.

### 3. Multilingual Spectator Chat Concierge
* **Endpoint:** `POST /api/gemini/chat`
* **Body:**
  ```json
  {
    "message": "Where is the nearest restroom?",
    "userType": "fan",
    "history": []
  }
  ```
* **Description:** Leverages Gemini to converse with fans or staff in over 100+ languages, providing seat layouts, bag policies, and stadium rules.

### 4. Incident Operational Intelligence
* **Endpoint:** `POST /api/gemini/incident`
* **Body:**
  ```json
  {
    "type": "Crowd Bottleneck",
    "location": "South Gate C",
    "severity": "critical",
    "description": "Mass crowds exiting Metro Station 2 converging on Gate C."
  }
  ```
* **Description:** Uses Gemini Structured JSON Output with safety-optimized schemas to compile action plans, staffing counts, and multilingual PA scripts.

### 5. Spectator Emergency SOS Dispatch
* **Endpoint:** `POST /api/gemini/sos`
* **Body:**
  ```json
  {
    "emergencyType": "Heat Exhaustion",
    "location": "Section 104 Row G Seat 42"
  }
  ```
* **Description:** Instantly logs coordinates and uses Gemini to issue personalized, high-priority safety guidance for the spectator while routing medical personnel.

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### 1. Clone & Install Dependencies
```bash
# Install the core workspace dependencies
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Start Development Server
```bash
# Starts the full-stack server with Vite integrated middleware
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
```bash
# Compiles both Vite frontend assets and bundles the Express server using esbuild
npm run build

# Start the compiled production app
npm run start
```

---

## 📂 Exporting & Pushing to GitHub

To push this repository to your own personal GitHub account, please follow these instructions:

### Method A: Direct Export via AI Studio (Recommended)
1. In Google AI Studio Build, open the **Settings Menu** (represented by the gear icon on the top right or bottom left sidebar).
2. Select **Export to GitHub** or **Export to ZIP**.
3. If exporting to GitHub, connect your account and choose a repository name (e.g., `Ops-Command-Center`).

### Method B: Manual Git Commands
If you have downloaded the ZIP or want to push the local initialized Git repository using the command line:

```bash
# 1. Add your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/Ops-Command-Center.git

# 2. Rename the branch to main
git branch -M main

# 3. Push your codes to GitHub
git push -u origin main
```

---

*FIFA World Cup 2026 Stadium Operations Command Center — Built with ❤️ for spectators and venue managers at Estadio Azteca.*
