# CSCI 310 AI-Assisted Development & Prompt Engineering Record
## Prompt Log, Iterative Refinement, and Real Debugging Case Study

> **Course:** CSCI 310 Principles of Programming Languages  
> **Institution:** Amity University Dubai, EAID  
> **Assignment Component:** Task 3: AI-Assisted Development and Prompt Engineering (2 Marks)  
> **AI Assistant Used:** Google Antigravity / Gemini 3.8 Flash (High)

---

## 1. Five Important Development Prompts

Below are the five core prompts utilized during the incremental engineering of **StudyFlow**, demonstrating architectural guidance, paradigm separation, and language construction:

### Prompt 1: Initial Architecture & Paradigm Scaffolding
> *"Design the application architecture for StudyFlow, a student study planner built for CSCI 310 Principles of Programming Languages. Structure the application so that Object-Oriented Programming (OOP) and Functional Programming (FP) are distinctly separated and easy for evaluators to audit. Use OOP for stateful domain managers and FP for data transformations and analytics."*
- **Outcome:** Established the directory structure separating `src/core/` (OOP classes: `TaskManager`, `Interpreter`) from `src/utils/fp.ts` (pure functions with `map`, `filter`, `reduce`).

### Prompt 2: Handcrafted Mini-Interpreter Engine (Zero `eval()`)
> *"Implement a custom domain-specific mini-interpreter in TypeScript without using JavaScript's eval() or Function() constructor. Split the implementation into Tokenizer, Parser, and Evaluator classes. Support both prefix CLI syntax like 'ADD 10 20' and functional syntax like 'AVERAGE(80, 70, 90)', and provide custom exception classes for lexical, syntax, and runtime errors."*
- **Outcome:** Created a robust recursive-descent parser and scanner supporting arithmetic, study metrics, and academic grading logic with detailed AST generation.

### Prompt 3: Timetable Collision Detection Algorithm
> *"In the TaskManager class, write a method to detect schedule collisions when adding a study session. The method must take the day of the week, start time, and end time in HH:mm format, convert them to minute intervals, and check if any existing session on that day overlaps. Return the conflicting session if an overlap exists."*
- **Outcome:** Implemented `TaskManager.detectSessionConflict()` utilizing interval overlap logic: $(\text{Start}_A < \text{End}_B) \land (\text{End}_A > \text{Start}_B)$.

### Prompt 4: Pure Functional Analytics Pipelines
> *"Create a module of pure functions in src/utils/fp.ts to compute academic productivity metrics, subject workload distributions, and weekly hour totals. Ensure all functions are deterministic, treat inputs as readonly, use array reduce/map/filter, and avoid any mutation of state or external dependencies."*
- **Outcome:** Built `calculateProductivityMetrics`, `calculateSubjectAnalytics`, `filterTasks`, and `sortTasks` ensuring 100% immutability.

### Prompt 5: Automated Test Suite with Edge Cases
> *"Write comprehensive Vitest test suites for the Mini-Interpreter and Task Management modules. Test every command (ADD, SUB, MUL, DIV, STUDY_HOURS, PROGRESS, AVERAGE, PASS, ELIGIBLE), verify division-by-zero protection, test syntax and arity errors, and verify immutability of the FP filtering and sorting functions."*
- **Outcome:** Generated 26 automated unit test cases that verified all functional specifications.

---

## 2. Prompt Improvement Example

### Initial Prompt (Draft)
> *"Build an interpreter for commands like ADD, SUB, and AVERAGE."*

### Issues Identified with Initial Prompt
- It was underspecified: did not define whether commands should accept commas, parentheses, or variable argument counts.
- Did not prohibit unsafe evaluation methods like `eval()` or `new Function()`.
- Did not specify error handling or AST telemetry needed for visual inspection.

### Refined Prompt (Improved)
> *"Implement a handcrafted expression interpreter in TypeScript that parses study-related commands including ADD, SUB, MUL, DIV, STUDY_HOURS, PROGRESS, AVERAGE, PASS, and ELIGIBLE. Do NOT use eval() or new Function(). Support both CLI prefix syntax (e.g., 'ADD 10 20') and functional parenthesized syntax with commas (e.g., 'AVERAGE(80, 70, 90)'). Separate the code into Tokenizer, Parser, and Evaluator classes. Return structured tokens, an Abstract Syntax Tree (AST), execution time in milliseconds, and explicit error messages for division by zero, invalid characters, and incorrect argument counts."*

### Why the Refined Prompt is Better
- **Constraint Enforcement:** Explicitly forbade unsafe evaluation primitives.
- **Syntactic Flexibility:** Defined support for both prefix and parenthesized notation with commas.
- **Architectural Rigor:** Enforced the 3-stage compiler architecture (Lexer $\to$ Parser $\to$ Evaluator) aligning with CLO5.
- **Diagnostic Granularity:** Specified requirements for telemetry, AST output, and custom error types.

---

## 3. Real Problem Found in AI-Generated Code & Correction

### The Problem
During the initial implementation of `src/core/TaskManager.ts`, the class constructor directly called `localStorage.getItem()` and `localStorage.setItem()`:

```typescript
// Initial AI-generated code snippet
private loadTasks(): Task[] {
  const stored = localStorage.getItem(this.storageKeyTasks);
  // ...
}
```

When running the automated test suite in **Node.js** via Vitest, the test runner failed with four errors:
```
FAIL src/test/tasks.test.ts > Object-Oriented Layer (TaskManager Class)
ReferenceError: localStorage is not defined
    at TaskManager.loadTasks (src/core/TaskManager.ts:30:22)
```
In browser environments, `window.localStorage` is globally accessible; however, in headless Node.js test environments, `localStorage` is undefined unless polyfilled or guarded.

### How the Problem was Corrected
1. **Defined an Abstraction Interface (`IStorage`):**
   ```typescript
   export interface IStorage {
     getItem(key: string): string | null;
     setItem(key: string, value: string): void;
   }
   ```
2. **Applied Dependency Injection in `TaskManager`:**
   Modified the constructor to accept an optional `customStorage?: IStorage`. If omitted in a browser, it safely falls back to `window.localStorage`:
   ```typescript
   constructor(customStorage?: IStorage) {
     if (customStorage) {
       this.storage = customStorage;
     } else if (typeof window !== 'undefined' && window.localStorage) {
       this.storage = window.localStorage;
     }
     this.tasks = this.loadTasks();
     this.sessions = this.loadSessions();
   }
   ```
3. **Injected an In-Memory Mock Storage in `src/test/tasks.test.ts`:**
   ```typescript
   beforeEach(() => {
     mockStore = {};
     const mockStorage = {
       getItem: (k: string) => mockStore[k] || null,
       setItem: (k: string, v: string) => { mockStore[k] = v; },
     };
     manager = new TaskManager(mockStorage);
   });
   ```

### Educational Value for CSCI 310
This debugging experience illustrated the OOP principle of **Dependency Inversion** and demonstrated why decoupled storage abstractions prevent platform-specific runtime failures in headless test runners. After this fix, all 26 unit tests passed successfully.
