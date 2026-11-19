# CSCI 310 Project Requirements & Specification Document
## StudyFlow – Smart Student Study Planner

> **Course:** CSCI 310 Principles of Programming Languages  
> **Institution:** Amity University Dubai, EAID  
> **Assignment Component:** Task 1: Project Idea, Requirements, and Design (2 Marks)

---

## 1. Problem Statement

University students in Computer Science and STEM disciplines juggle demanding course schedules containing multiple programming projects, theoretical math assignments, database labs, and weekly quizzes. Existing task management applications (e.g., generic to-do apps) suffer from critical limitations in the academic domain:

1. **Fragmented Course Tracking:** Generalist apps fail to categorize workloads by university course codes (e.g., CSCI 310, CSCI 220, MATH 201) or capture specific academic attributes like estimated study durations and urgency.
2. **Burnout and Schedule Clashes:** Students often schedule overlapping study blocks without realizing that two high-intensity subjects have been assigned to the same time window, resulting in exhaustion and poor retention.
3. **Lack of Domain-Specific Calculation Tools:** Evaluating academic progress, determining exam eligibility, calculating weighted grade averages, or converting cumulative study minutes into planned hours requires students to switch between spreadsheets, calculators, and calendars.
4. **Opaque Code Architectures:** Commercial tools hide their architectural paradigms. For an academic principles course, students require a transparent application that clearly demonstrates how **Object-Oriented Programming (OOP)** and **Functional Programming (FP)** solve concrete software engineering problems.

**StudyFlow** solves this problem by uniting an intelligent study task manager, a collision-aware timetable scheduler, a side-effect-free performance analytics engine, and a handcrafted domain-specific textual mini-interpreter into a unified SaaS-grade web interface.

---

## 2. Target Users & User Personas

### Persona 1: The STEM Undergraduate Student
- **Profile:** Third-year Computer Science student enrolled in 5 heavy engineering courses.
- **Needs:** Needs to see imminent assignment deadlines, estimate how many hours are required for upcoming lab exercises, and ensure study time does not conflict across different subject obligations.
- **Pain Point:** Frequently double-books study periods and forgets deadlines scattered across multiple course outlines.

### Persona 2: The Academic Study Group Member
- **Profile:** Student collaborating on group deliverables (e.g., CSCI 310 group project).
- **Needs:** Needs a standardized tool to compute required study hours, calculate group task completion ratios, and evaluate whether attendance rules meet university exam criteria.
- **Pain Point:** Lack of transparent mathematical calculation tools tailored for academic benchmarks.

### Persona 3: Academic Advisor & Course Evaluator
- **Profile:** University faculty or evaluator assessing student software engineering competence.
- **Needs:** Requires an easily deployable, self-contained application with rich demonstration data, automated test verification, and clean separation between Object-Oriented and Functional paradigms.

---

## 3. Functional Requirements (FR)

StudyFlow implements six core functional requirements that exceed the minimum project mandate of five:

### FR1: Multi-Attribute Study Task Management (CRUD)
- **Description:** The system must allow students to create, read, update, delete, and mark study tasks as completed.
- **Attributes:** Each task must record:
  - Unique identifier (`id`)
  - Title (non-empty string)
  - Course Subject (selected from academic list, e.g., CSCI 310, CSCI 220, CSCI 340, CSCI 370, MATH 201)
  - Description / Detailed Requirements
  - Deadline (ISO Date format `YYYY-MM-DD`)
  - Priority Level (`low`, `medium`, `high`, `urgent`)
  - Estimated Study Duration (positive integer in minutes)
  - Completion Status (`boolean`) and completion timestamp (`completedAt`).
- **Validation:** Creation must reject empty titles, negative or zero durations, and invalid deadline dates with clear inline error messages.

### FR2: Declarative Multivariable Search & Filter Pipeline
- **Description:** The system must provide real-time search and filter capabilities executed via pure functional pipelines.
- **Capabilities:**
  - Case-insensitive substring search matching task titles, descriptions, and subject tags.
  - Filtering by individual course subject or "All Subjects".
  - Filtering by priority level or "All Priorities".
  - Filtering by status (`All`, `Pending`, `Completed`).
  - Sorting by deadline (ascending/descending), priority weight, estimated duration, or creation timestamp.
  - Preserves source data immutability throughout all filter operations.

### FR3: Weekly Study Timetable with Real-Time Collision Avoidance
- **Description:** The system must display a 7-day weekly schedule (Monday through Sunday) organizing planned study sessions with automated collision detection.
- **Capabilities:**
  - Visual placement of sessions into day columns.
  - Interactive modal to schedule a new study session linked to an existing task.
  - Selection of day of week, start time, and end time.
  - **Automated Collision Engine:** Encapsulated in the `TaskManager` class, the system mathematically tests candidate session intervals against existing sessions on that day:
    $$\text{Overlap} \iff (\text{Start}_{\text{new}} < \text{End}_{\text{existing}}) \land (\text{End}_{\text{new}} > \text{Start}_{\text{existing}})$$
  - Immediately displays an explicit visual conflict warning alert banner if a collision is detected, preventing study double-booking.

### FR4: Pure Functional Performance Analytics & Visual Reporting
- **Description:** The system must aggregate study metrics into productivity statistics and visual reports using pure higher-order functions (`map`, `filter`, `reduce`).
- **Capabilities:**
  - Calculation of Productivity Score (0–100) combining completion velocity and impending deadline load.
  - Total planned study minutes vs. completed study minutes.
  - Interactive SVG Donut Chart showing percentage workload distribution across subjects.
  - Interactive SVG Bar Chart showing study hours logged per subject.
  - 7-day weekly study distribution summarizing hours planned per calendar day.

### FR5: Handcrafted Custom Mini-Interpreter (Zero `eval()`)
- **Description:** The system must provide an interactive, text-based interpreter for evaluating study-related and grading expressions.
- **Language Grammar & Commands:**
  - Arithmetic operations: `ADD a b`, `SUB a b`, `MUL a b`, `DIV a b`, `SUM n1 n2 ...`
  - Study metrics: `STUDY_HOURS m1 m2 ...` (converts minutes to formatted hours), `PROGRESS completed total` (computes percentage)
  - Academic grading logic: `AVERAGE(n1, n2, ...)` (computes arithmetic mean), `PASS score [threshold]` (evaluates pass/fail), `ELIGIBLE attendance status` (evaluates university exam eligibility).
- **Execution Pipeline:** Must execute strictly via a 3-stage manual pipeline (**Tokenizer $\to$ Parser $\to$ Evaluator**) without using `eval()` or `new Function()`.
- **Error Handling:** Must return explicit, user-friendly diagnostics for `LexicalError`, `SyntaxError`, `DivisionByZeroError`, and `ArityMismatchError`.

### FR6: State Persistence & Demo Seed Reset
- **Description:** The system must synchronize all task and session modifications into browser `localStorage`.
- **Capabilities:**
  - Transparent persistence across page refreshes and browser restarts.
  - "Reset Demo" button allowing evaluators to instantly reload the standardized CSCI 310 course demo dataset.

---

## 4. Non-Functional Requirements (NFR)

1. **Usability & Aesthetic Quality:** SaaS-grade design utilizing Tailwind CSS, consistent spacing, light/dark mode support, responsive mobile drawer, and clear typography (Inter & JetBrains Mono).
2. **Type Safety & Reliability:** Built with strict TypeScript compiler rules (`strict: true`, `noUnusedLocals: true`, `noFallthroughCasesInSwitch: true`).
3. **Execution Performance:** Sub-millisecond interpreter evaluation telemetry and instant UI re-renders without blocking the main event loop.
4. **Security & Academic Integrity:** Absolute prohibition of `eval()` or dynamic string evaluation to prevent code-injection vulnerabilities. No external API keys or credentials exposed.
5. **Maintainability & Testability:** 100% decoupling between UI presentation components and domain logic (`src/core/` and `src/utils/fp.ts`), backed by automated Vitest unit tests.
