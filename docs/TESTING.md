# CSCI 310 Quality Assurance & Testing Report
## Comprehensive Test Plan and Verification Matrix

> **Course:** CSCI 310 Principles of Programming Languages  
> **Institution:** Amity University Dubai, EAID  
> **Assignment Component:** Task 6: GitHub, Publication, and Project Report (Testing Documentation)  
> **Test Framework:** Vitest v2.1.9 (Node.js v20.18.0)

---

## 1. Testing Strategy Overview

The testing strategy for **StudyFlow** adheres to rigorous academic and industry software quality standards:

1. **Automated Unit Testing:** Verifies domain logic, mathematical expressions, tokenization, AST generation, error throwing, immutability, and OOP encapsulation using the automated **Vitest** runner.
2. **Manual Integration & UI Verification:** Verifies responsive component rendering, user interactions, theme transitions, collision warning popups, and browser `localStorage` persistence.

---

## 2. Automated Test Suite Results

The automated test suite runs against all core engine modules with zero mocking of the business rules.

```bash
npm test
```

### Actual Verified Terminal Execution Output
```
 RUN  v2.1.9 C:/Users/ss/OneDrive/Desktop/PPl project

 ✓ src/test/interpreter.test.ts (18 tests) 51ms
 ✓ src/test/tasks.test.ts (8 tests) 18ms

 Test Files  2 passed (2)
      Tests  26 passed (26)
   Start at  22:32:02
   Duration  1.72s (transform 313ms, setup 0ms, collect 596ms, tests 69ms, environment 1ms, prepare 1.44s)
```

### Automated Unit Test Breakdown

| Test Suite | Test Case Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Interpreter** | `ADD 10 20` | Output = 30, formatted = "30" | 30 | **PASS** |
| **Interpreter** | `SUB 20 5` | Output = 15, formatted = "15" | 15 | **PASS** |
| **Interpreter** | `MUL 4 5` | Output = 20, formatted = "20" | 20 | **PASS** |
| **Interpreter** | `DIV 20 4` | Output = 5, formatted = "5" | 5 | **PASS** |
| **Interpreter** | `DIV 20 0` (Zero Div) | Throws `Division by zero` error | Caught & Flagged | **PASS** |
| **Interpreter** | `STUDY_HOURS 120 60 30` | Output = 3.5, formatted = "3.5 hours" | 3.5 hours | **PASS** |
| **Interpreter** | `PROGRESS 8 10` | Output = 80, formatted = "80%" | 80% | **PASS** |
| **Interpreter** | `AVERAGE(80, 70, 90)` | Output = 80, formatted = "80" | 80 | **PASS** |
| **Interpreter** | `PASS(65)` | Output = true, formatted = "True" | True | **PASS** |
| **Interpreter** | `PASS 45 50` | Output = false, formatted = "False" | False | **PASS** |
| **Interpreter** | `ELIGIBLE(45, TRUE)` | Output = true, formatted = "True" | True | **PASS** |
| **Interpreter** | `ELIGIBLE 30 TRUE` | Output = false, formatted = "False" | False | **PASS** |
| **Interpreter** | `SUM 10 20 30 40` | Output = 100, formatted = "100" | 100 | **PASS** |
| **Interpreter** | Empty input `""` | Returns error message | Handled cleanly | **PASS** |
| **Interpreter** | Unknown command `FOOBAR` | Returns syntax error | Handled cleanly | **PASS** |
| **Interpreter** | Arity mismatch `ADD 10` | Returns arity error | Handled cleanly | **PASS** |
| **Interpreter** | Lexical error `ADD 10 @#$` | Throws `LexicalError` | Handled cleanly | **PASS** |
| **Interpreter** | AST & Token Generation | Creates valid AST & tokens | Tokens & AST verified | **PASS** |
| **Tasks / FP** | `calculateProductivityMetrics` | Pure reduction of 3 sample tasks | 33% completion, 360m total | **PASS** |
| **Tasks / FP** | `calculateSubjectAnalytics` | Group-by and map per subject | CSCI 310 has 1 task (100%) | **PASS** |
| **Tasks / FP** | `filterTasks` Search Matching | Filters "Tree" without mutating source | Returns 1 task; source intact | **PASS** |
| **Tasks / FP** | `sortTasks` Immutability | Sorts by duration without mutating original | Original array unchanged | **PASS** |
| **Tasks / OOP** | `TaskManager.addTask` | Adds task with unique ID & invariants | Task added & queryable | **PASS** |
| **Tasks / OOP** | Empty Title Invariant | Rejects blank task title | Throws validation error | **PASS** |
| **Tasks / OOP** | `toggleComplete` | Toggles state & sets completion date | State updated & persisted | **PASS** |
| **Tasks / OOP** | `detectSessionConflict` | Detects overlap (10:00-12:00 vs 11:00-13:00) | Conflict detected & returned | **PASS** |

---

## 3. Manual Functional Verification Matrix

| # | Feature / Test Scenario | Verification Procedure | Expected Outcome | Actual Result | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **1** | **Initial State & Demo Seeding** | Load app on clean browser profile | App loads with realistic university tasks (CSCI 310, CSCI 220, etc.) | Preloaded cleanly from seed dataset | **VERIFIED** |
| **2** | **Dark / Light Mode Toggle** | Click theme button in sidebar | Entire UI smoothly toggles background, borders, and text contrasts | Instant theme transition | **VERIFIED** |
| **3** | **Task Creation Validation** | Submit modal with blank title | Inline error prompt: "Please provide a task title" | Form rejects blank submission | **VERIFIED** |
| **4** | **Task Status Toggle** | Click checkmark circle on task card | Task title is struck through; completion KPI updates | Instant reactivity & toast feedback | **VERIFIED** |
| **5** | **Filter & Search Pipeline** | Type "Interpreter" into search box | Only the CSCI 310 interpreter task remains visible | Instant FP filter execution | **VERIFIED** |
| **6** | **Subject & Priority Filter** | Select "CSCI 220" and "High" | Only high-priority CSCI 220 tasks appear | Exact intersection matching | **VERIFIED** |
| **7** | **Timetable Scheduling** | Schedule a session on Monday 09:00 - 11:00 | Session block appears in Monday column | Rendered in correct column | **VERIFIED** |
| **8** | **Collision Avoidance Warning** | Attempt to schedule Monday 10:00 - 12:00 | Real-time warning alert flags conflict with existing session | Banner clearly highlights collision | **VERIFIED** |
| **9** | **Productivity Analytics Donut** | Hover over subject slices on Analytics page | Donut slices expand; percentage and minutes highlight | Smooth SVG hover animations | **VERIFIED** |
| **10** | **Mini-Interpreter Functional Syntax** | Enter `AVERAGE(80, 70, 90)` into console | Evaluator displays `80`; execution time `< 1 ms` | Accurate mean calculated | **VERIFIED** |
| **11** | **Mini-Interpreter CLI Syntax** | Enter `STUDY_HOURS 120 60 30` | Evaluator displays `3.5 hours` | Formatted hours returned | **VERIFIED** |
| **12** | **Interpreter Token & AST View** | Switch to "Tokens" and "AST" tabs | Displays token types and tree JSON structure | Full AST tree and tokens visible | **VERIFIED** |
| **13** | **Interpreter Division by Zero** | Enter `DIV 50 0` | Displays custom `RuntimeError` callout | Error caught without app crash | **VERIFIED** |
| **14** | **Demo Reset Button** | Click "Reset Demo" in top header | Restores all seed tasks and sessions | Database reset to initial state | **VERIFIED** |
| **15** | **Browser Refresh Persistence** | Add a new task, refresh the page | New task remains present in task list | Retained in localStorage | **VERIFIED** |

---

## 4. Production Build Verification

The application was compiled using Vite's production bundler:
```bash
npm run build
```

**Build Output:**
- `dist/index.html`: 1.15 kB
- `dist/assets/index-*.css`: 37.13 kB
- `dist/assets/index-*.js`: 252.50 kB
- **Compilation Result:** 0 errors, 0 warnings, fully optimized for static web hosting.
