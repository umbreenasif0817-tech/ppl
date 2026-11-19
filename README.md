# StudyFlow – Smart Student Study Planner
> **Course:** CSCI 310 Principles of Programming Languages  
> **Institution:** Amity University Dubai, School of Engineering, Architecture and Interior Design  
> **Project Type:** Group Project – Build and Publish a Website or Mobile Application Using AI  
> **Paradigms Demonstrated:** Object-Oriented Programming (OOP) & Functional Programming (FP)

---

## 📖 1. Project Overview

**StudyFlow** is an AI-assisted, modern web application designed specifically for university students to eliminate study burnout, coordinate assignment deadlines, prevent timetable schedule collisions, and evaluate academic metrics using an integrated domain-specific textual mini-interpreter.

The application satisfies all requirements of the CSCI 310 assessment remit, illustrating how contrasting programming paradigms solve real-world problems with high maintainability, type safety, and test coverage.

### Key Highlights
- **5 Fully Functional Screens:** Dashboard, Task Manager, Study Timetable, Performance Analytics, and Mini-Interpreter REPL.
- **Dual Programming Paradigms:**
  - **OOP Layer:** Stateful encapsulation, domain invariant validation, and collision detection inside `TaskManager` and `Interpreter` classes.
  - **FP Layer:** Pure, side-effect free transformations using `map()`, `filter()`, `reduce()`, and immutable updates in `src/utils/fp.ts`.
- **Custom Mini-Interpreter:** Handcrafted Lexer, Parser, and AST Evaluator supporting prefix and functional syntax (`ADD`, `SUB`, `MUL`, `DIV`, `STUDY_HOURS`, `PROGRESS`, `AVERAGE`, `PASS`, `ELIGIBLE`) without `eval()` or `Function()`.
- **Local Persistence & Zero Bloat:** Resilient browser `localStorage` synchronization with initial demo seed data.
- **Rigorous Automated Testing:** 26 automated unit tests passing 100% via Vitest.

---

## 🛠️ 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | Component-based reactive UI with strict static typing |
| **Build & Dev Tooling** | Vite 5 | Fast HMR development and optimized production bundling |
| **Styling & Theming** | Tailwind CSS 3 | Modern SaaS design system with dark/light mode toggle |
| **Icons** | Lucide React | Lightweight, consistent interface iconography |
| **Automated Testing** | Vitest 2 | Fast unit test execution for interpreter and FP analytics |
| **Persistence** | LocalStorage API | Client-side persistent state with initial demonstration fallback |

---

## 🚀 3. Quickstart & Installation Instructions

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended; built with v20.18.0 LTS)
- **npm** (v9.0.0 or higher)

### Setup Steps

1. **Clone or Navigate to the Project Root:**
   ```bash
   cd "PPl project"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Run the Automated Test Suite:**
   ```bash
   npm test
   ```
   *(Executes all 26 test suites covering arithmetic, domain commands, syntax error handling, collision logic, and FP transformations).*

5. **Build for Production:**
   ```bash
   npm run build
   ```
   Creates an optimized, minified production distribution bundle in the `dist/` directory.

6. **Preview Production Build Locally:**
   ```bash
   npm run preview
   ```

---

## 📁 4. Project Directory Structure

```
PPl project/
├── docs/                             # CSCI 310 Academic Documentation Deliverables
│   ├── REQUIREMENTS.md               # Problem definition, target personas, 5+ functional specs
│   ├── PARADIGMS.md                  # Comprehensive OOP vs. FP analysis with code references
│   ├── INTERPRETER.md                # Grammar, Lexer, Parser, AST evaluation guide
│   ├── TESTING.md                    # Verification matrix, unit tests, actual test outputs
│   ├── PROMPT_LOG.md                 # 5 AI prompts, refinement example, and debugging history
│   └── DEPLOYMENT.md                 # Step-by-step GitHub repository and Vercel hosting guide
├── public/
│   └── favicon.svg                   # Custom StudyFlow SVG favicon
├── src/
│   ├── components/                   # Reusable UI component library
│   │   ├── analytics/                # SVG Bar and Donut productivity charts
│   │   ├── common/                   # Modals, Badges, KPI StatCards, Toast notifications
│   │   ├── dashboard/                # Progress charts, urgency widgets, paradigm banner
│   │   ├── interpreter/              # REPL console, token visualizer, AST inspector, cheat sheet
│   │   ├── layout/                   # Collapsible sidebar, header, navigation shell
│   │   ├── tasks/                    # Task cards, filter pipeline, task modal form
│   │   └── timetable/                # 7-day schedule grid, conflict alert modal
│   ├── core/                         # OBJECT-ORIENTED PROGRAMMING LAYER
│   │   ├── Interpreter.ts            # Tokenizer, Parser, Evaluator classes (Zero eval)
│   │   └── TaskManager.ts            # Encapsulated state, validation, collision detection
│   ├── pages/                        # 5 Top-Level Functional Pages
│   │   ├── DashboardPage.tsx         # Overview, KPI metrics, weekly chart
│   │   ├── TasksPage.tsx             # Full CRUD, search, priority & subject filtering
│   │   ├── TimetablePage.tsx         # Weekly calendar, conflict detection
│   │   ├── AnalyticsPage.tsx         # Pure FP productivity calculations & visual charts
│   │   └── InterpreterPage.tsx       # Interactive mini-interpreter testing playground
│   ├── test/                         # AUTOMATED TESTING SUITE (VITEST)
│   │   ├── interpreter.test.ts       # 18 unit tests for tokenizer, parser, and commands
│   │   └── tasks.test.ts             # 8 unit tests for FP analytics and OOP TaskManager
│   ├── types/                        # Strict TypeScript interfaces & discriminated unions
│   │   ├── interpreter.ts            # Token, ASTNode, InterpreterResult, CommandDoc
│   │   └── task.ts                   # Task, StudySession, SubjectAnalytics, Priority
│   ├── utils/                        # FUNCTIONAL PROGRAMMING LAYER
│   │   ├── fp.ts                     # Pure functions: map, filter, reduce pipelines
│   │   └── seedData.ts               # Realistic university course seed dataset
│   ├── App.tsx                       # Top-level state management, routing, theme sync
│   ├── index.css                     # Tailwind directives, theme variables, custom scrollbars
│   └── main.tsx                      # Application entry point
├── index.html                        # HTML5 template with Inter and JetBrains Mono fonts
├── package.json                      # Project metadata, dependencies, build scripts
├── postcss.config.js                 # PostCSS configuration for Tailwind
├── tailwind.config.js                # Tailwind CSS configuration with dark mode support
├── tsconfig.json                     # Strict TypeScript compiler options
└── vite.config.ts                    # Vite build configuration
```

---

## 🖥️ 5. Main Application Pages

1. **Dashboard:**
   - Displays real-time counts for Total Tasks, Completed Tasks, Pending Commitments, and Upcoming Deadlines.
   - Interactive SVG Weekly Progress Chart showing planned hours mapped across days.
   - Imminent deadlines widget with visual urgency tags.
   - Subject completion breakdown with progress bars.
   - Dual Paradigm architecture banner.

2. **Task Manager:**
   - Create, edit, delete, search, filter, and mark study tasks as completed.
   - Filter pipeline supporting text search, course subject, priority level, and completion status.
   - Multi-criteria sorting (by deadline, priority, estimated duration, or creation date).
   - Form validation ensuring title, deadline, and positive study durations.

3. **Study Timetable:**
   - 7-Day interactive schedule (Monday through Sunday) organizing sessions by subject.
   - Schedule session modal allowing start and end time definition.
   - **Real-Time Collision Avoidance Engine:** Automatically detects overlapping study intervals on the same day and issues an immediate conflict warning to avoid burnout.

4. **Performance Analytics:**
   - Pure FP productivity engine computing Productivity Score, Completion Velocity, and Study Minutes.
   - Interactive SVG Workload Allocation Donut chart with hover segments.
   - Interactive SVG Study Hours by Subject bar chart.
   - Educational code callout showcasing pure reduction algorithms.

5. **Mini-Interpreter Console:**
   - Custom REPL supporting mathematical (`ADD`, `SUB`, `MUL`, `DIV`, `SUM`), study metrics (`STUDY_HOURS`, `PROGRESS`), and academic grading logic (`AVERAGE`, `PASS`, `ELIGIBLE`).
   - Multi-tab inspection view:
     - **Output:** Formatted result, raw type, and execution time in milliseconds.
     - **Tokens:** Visualizes token stream with types (`COMMAND`, `NUMBER`, `COMMA`, etc.) and positions.
     - **AST Tree:** Displays full abstract syntax tree in JSON.
     - **History:** Past evaluation log with instant recall.
   - Quick preset chips and syntax cheat sheet with "Try" buttons.

---

## 🧪 6. Automated Testing

All tests are implemented using **Vitest** and verify both the OOP and FP layers:
```bash
npm test
```
**Test Results Summary:**
- `src/test/interpreter.test.ts`: **18 passed** (arithmetic, division by zero, STUDY_HOURS, PROGRESS, AVERAGE, PASS, ELIGIBLE, syntax errors, lexical errors).
- `src/test/tasks.test.ts`: **8 passed** (pure reduce calculations, map/filter aggregations, immutable sorting, OOP TaskManager invariants, and timetable collision detection).
- **Total: 26 passed, 0 failed.**

---

## 👥 7. Academic Integrity & Course Declaration
This project is built for **CSCI 310 Principles of Programming Languages** under the instruction of **Dr. Maher Alrahhal** at Amity University Dubai. All code adheres to university academic honesty policies, with clear documentation of AI-assisted engineering and prompt logs.
