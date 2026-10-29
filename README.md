# AI Inclusive Assessment System - Frontend

An inclusive, accessible, and responsive educational assessment platform designed to support students with diverse learning needs, empower confident practice, and make academic progress intuitive and transparent.

---

## 1. Project Overview

The **AI Inclusive Assessment System** is an educational technology interface tailored for accessibility, cognitive pacing, and adaptive assessment. It supports four dedicated learner categories with sensory, visual, and pacing accommodations:

1. **No Special Need (`none`)**: Standard educational interface with all customization tools accessible on demand.
2. **Low Vision (`low_vision`)**: Ultra high-contrast theme, scalable typography (up to 22px), high-visibility borders, zoom-friendly layouts, and text-to-speech (TTS) read-aloud support.
3. **ADHD (`adhd`)**: One-question-at-a-time focused canvas, minimal visual clutter, reduced motion animations, gentle break reminders, and milestone tracking.
4. **Dyslexia (`dyslexia`)**: Specialized readable typography, increased line height (1.9x), relaxed letter and word spacing, left-aligned text, and distinct question/answer separation.

> **CRITICAL SCOPE & DEMO NOTICE:**  
> This repository contains **exclusively the frontend implementation** (HTML5, CSS3, Vanilla JavaScript). It runs standalone in any modern browser without requiring a backend server, Flask process, or database. Client-side authentication and learning history are maintained using non-sensitive browser `localStorage`. Real security and machine-learning predictions will be handled by the future backend server.

---

## 2. Technology Stack

* **Markup & Structure:** Semantic HTML5 (ARIA landmarks, accessible dialogs, accessible tables)
* **Styling & Layout:** Modern CSS3 (CSS Custom Properties, Flexbox, CSS Grid, high-contrast dark theme, reduced-motion queries, responsive media queries)
* **Scripting:** Modular Vanilla JavaScript (ES6+ Classes, Event-driven architecture, Zero framework lock-in)
* **Audio & Accessibility:** Web Speech API (`window.speechSynthesis`) for read-aloud support
* **Data Visualization:** Chart.js (with zero-dependency HTML5 2D Canvas / SVG fallback for offline or air-gapped environments)
* **Storage:** Browser `localStorage` for client-side demo state and persistent preferences

---

## 3. Directory & Folder Structure

```text
AI project/
├── index.html                   # Landing page with hero, features, and how it works
├── login.html                   # Interactive sign in with 1-click role presets
├── register.html                # Interactive registration with 4 category cards
├── forgot-password.html         # Simulated password recovery screen
├── dashboard.html               # Student dashboard (KPIs, streak, daily goal, charts)
├── subjects.html                # Subject catalog with search and filters
├── topic-selection.html         # Topic explorer for selected subject
├── assessment-setup.html        # Assessment configuration (timer, count, difficulty)
├── assessment.html              # Distraction-reduced assessment interface
├── results.html                 # Comprehensive score breakdown & explanations
├── progress.html                # Analytics dashboard with timeframe filters
├── history.html                 # Searchable/sortable assessment history + CSV export
├── achievements.html            # Dynamic gamification milestone badges
├── accessibility.html           # Universal design center & real-time preview
├── profile.html                 # Student profile & daily goal manager
├── help.html                    # System guide, keyboard shortcuts & AI specs
├── serve.ps1                    # Zero-dependency local PowerShell web server
├── css/
│   ├── styles.css               # Design system, CSS variables & theme overrides
│   ├── components.css           # Buttons, cards, modals, alerts, tables, toasts
│   ├── auth.css                 # Auth forms, landing hero & category choice cards
│   ├── dashboard.css            # Dashboard metrics, streak flames & widgets
│   ├── assessment.css           # Question cards, option choices, timer, palette
│   └── responsive.css           # Mobile drawers, responsive breakpoints (<=640px)
├── js/
│   ├── storage.js               # Local storage manager & realistic demo seeder
│   ├── accessibility.js         # Theme switcher, font scaler, Web Speech API
│   ├── auth.js                  # Client authentication manager & route protection
│   ├── api.js                   # Unified API interface for future backend connection
│   ├── subjects.js              # Educational curriculum catalog & question banks
│   ├── assessment.js            # Assessment session engine, timer & submission
│   ├── progress.js              # Analytics aggregator, chart renderer & CSV exporter
│   ├── achievements.js          # Achievement progress evaluator
│   ├── profile.js               # Profile and daily goal manager
│   └── app.js                   # App shell controller (drawer, toasts, shortcuts)
└── assets/
    ├── icons/                   # UI icons
    └── images/
        └── triangle.svg         # Accessible diagram for geometry assessment
```

---

## 4. How to Run the Frontend Locally

### Option A: Using the Included PowerShell Server (Recommended on Windows)

Open a PowerShell terminal in this folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

* The script automatically starts a local HTTP listener on `http://localhost:8000/`.
* Your default web browser (Edge or Chrome) will open automatically.
* To terminate the server at any time, press `Ctrl + C` in the PowerShell window.

### Option B: Direct Browser Opening

You can also double-click `index.html` or run:

```powershell
Start-Process "msedge.exe" "$PWD\index.html"
# or
Start-Process "chrome.exe" "$PWD\index.html"
```

All HTML pages, CSS stylesheets, and JavaScript modules use relative paths, enabling complete functionality directly from local storage.

---

## 5. Demo Mode & Quick Exploration

To make evaluation rapid and convenient, the frontend includes **One-Click Demo Profiles** on the [login screen](file:///C:/Users/SIMRAN/Desktop/B.%20Tech/3rd%20Sem/CSE276/AI%20project/login.html):

* **👤 Standard:** Standard font size (16px), default contrast, standard layout.
* **👁️ Low Vision:** High-contrast dark theme, yellow focus borders, 20px typography, and speech synthesis ready.
* **⚡ ADHD:** Single-question focus canvas, suppressed animations, 5-question break reminders.
* **📖 Dyslexia:** Dyslexia typography stack, 1.9x line spacing, relaxed word spacing, and left-aligned text.

Clicking any button instantly applies the accommodations across all 17 application views!

### Demo Data Persistence (`localStorage`)
The demo initializes realistic mock records on first launch:
* `ai_inclusive_user`: Current student profile (name, email, selected category).
* `ai_inclusive_preferences`: Sizing, contrast, dyslexia typography, speech rate, break intervals.
* `ai_inclusive_history`: Previous practice sessions across Math, Science, and English.
* `ai_inclusive_streak`: Active practice days and continuous streaks.
* `ai_inclusive_daily_goal`: Daily target (e.g. 10 questions) and questions answered today.

> You can restore initial default data at any time via the **"Reset All Demo Data"** button on the Profile Page.

---

## 6. Testing Guide & Verification Checklist

| Area | Test Steps | Expected Result |
| :--- | :--- | :--- |
| **Navigation** | Click through sidebar links (Dashboard, Subjects, Setup, Progress, History, Achievements, Accessibility, Profile, Help). | Every page renders correctly without console errors; active page is highlighted in sidebar. |
| **Mobile Drawer** | Shrink browser width to `< 991px` and click the `☰` hamburger button. | Sidebar opens smoothly as a mobile drawer; clicking backdrop closes drawer. |
| **Registration** | Fill out `register.html` with invalid email or mismatched passwords, then select a category and submit. | Displays inline error messages for invalid input; redirects to dashboard on successful submission. |
| **One-Click Roles** | On `login.html`, click "⚡ ADHD" or "👁️ Low Vision". | Instantly logs in and applies the theme and layout rules immediately to the dashboard. |
| **Subject Browsing** | On `subjects.html`, type "Algebra" in search bar or filter by "STEM". | Catalog filters dynamically; selecting "View Topics" opens topic explorer. |
| **Assessment Setup**| Select subject, topic, 3 or 5 questions, timer toggle, and click "Start Assessment". | Configures module and launches distraction-reduced assessment interface. |
| **Question Flow** | Answer questions using mouse clicks or keyboard keys `1`, `2`, `3`, `4`. | Selected option highlights; question navigator updates color to "Answered". |
| **Read-Aloud** | On `assessment.html`, click "▶ Speak Question". | Browser speech synthesis reads question text and answer choices clearly. |
| **Submission** | Click "Submit" and confirm on the review modal. | Computes score and redirects to `results.html` with question-by-question explanations. |
| **CSV Export** | On `history.html` or `progress.html`, click "📥 Export CSV". | Downloads a valid `.csv` spreadsheet containing all practice attempts. |
| **Accessibility** | On `accessibility.html`, change font scale to "22px" and toggle "High Contrast". | Entire UI scales text and updates color theme immediately without reloading. |
| **Log Out** | Click user avatar in topbar &rarr; "Log Out" &rarr; Confirm. | Displays confirmation dialog; returns to `login.html` with logout banner. |

---

## 7. Future Backend Integration

The frontend architecture isolates all network communication within [`js/api.js`](file:///C:/Users/SIMRAN/Desktop/B.%20Tech/3rd%20Sem/CSE276/AI%20project/js/api.js).

When ready to connect a real backend (e.g. Node.js/Express, Python/FastAPI, or Django):
1. In `js/api.js`, set `BACKEND_CONNECTED = true`.
2. Configure `API_BASE_URL = 'http://your-server-ip:5000/api'`.
3. The following endpoint contracts are pre-wired:

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/subjects
GET  /api/subjects/:id/topics
GET  /api/questions?subject=math&topic=algebra&count=5
POST /api/assessments/submit
GET  /api/progress?timeframe=7d
GET  /api/history
POST /api/profile
```

---

## 8. Future AI Model Integration

The project has an existing trained model trained on **ASSISTments 2012–2013** data (preserved in `final_model_2012.joblib` and `model_package_2012.joblib`).

### Previously Reported Experimental Metrics:
* **Test AUC:** ~`0.7258`
* **Test Accuracy:** ~`0.7300` (guessing baseline: 0.6934)
* **Fairness across speed groups:** 
  * Slow-paced group (top 25% duration): `AUC = 0.709`
  * Standard-paced group: `AUC = 0.730`

### Input Features Evaluated by the Model:
`d_problem`, `d_skill`, `stu_acc`, `stu_exp`, `skill_acc`, `skill_exp`, `recent5`, `speed`, `last1`, `last2`, `last3`, `gap`, `ewm_acc`, `last10`.

### Planned Model Inference Workflow:
1. When the student attempts assessments, performance features (`stu_acc`, `speed`, `recent5`) are accumulated.
2. The frontend calls `api.getAiPredictiveAssistance(studentId, skillCode)`.
3. The future backend loads `final_model_2012.joblib`, computes the correctness probability $P(\text{correct})$, and returns:
   * Predicted likelihood of answering correctly.
   * Adaptive recommendation for the next topic.
   * Whether scaffolding hints are recommended.

---

## 9. Security & Limitations Disclaimer

* **No Server Authentication:** Frontend-only authentication is for demonstration and UX evaluation. It does not provide cryptographic passwords or server-side session tokens.
* **Storage Limits:** Non-sensitive student data is stored in the browser's `localStorage` (typically up to 5MB capacity).
* **Browser Speech Synthesis:** The Read-Aloud feature requires browser support for the Web Speech API (available in all modern versions of Edge, Chrome, Firefox, and Safari).
