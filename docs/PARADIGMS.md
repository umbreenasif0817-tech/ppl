# CSCI 310 Programming Paradigms Analysis
## Object-Oriented Programming vs. Functional Programming in StudyFlow

> **Course:** CSCI 310 Principles of Programming Languages  
> **Institution:** Amity University Dubai, EAID  
> **Assignment Component:** Task 4: Programming Paradigms (3 Marks)  
> **Course Learning Outcome:** CLO4 – Evaluate and communicate the principles of imperative, functional, object-oriented, or logic-oriented programming languages.

---

## 1. Executive Summary

StudyFlow demonstrates a deliberate architectural duality that showcases two foundational programming paradigms within a single TypeScript web application:

1. **Object-Oriented Programming (OOP):** Applied where persistent state, domain invariants, behavioral encapsulation, and structured compiler stages are paramount (located in `src/core/TaskManager.ts` and `src/core/Interpreter.ts`).
2. **Functional Programming (FP):** Applied where deterministic data transformations, statistical aggregations, declarative filtering, and side-effect-free calculations are paramount (located in `src/utils/fp.ts`).

---

## 2. Paradigm 1: Object-Oriented Programming (OOP)

### Core Principles Demonstrated

#### A. Encapsulation & Data Hiding
In classical OOP, data is encapsulated within classes and protected from external direct mutation. In `TaskManager` ([src/core/TaskManager.ts](file:///C:/Users/ss/OneDrive/Desktop/PPl%20project/src/core/TaskManager.ts)), state variables `tasks` and `sessions` are private fields. Outside callers cannot directly modify the underlying task arrays; all interactions must pass through validated public methods.

```typescript
// From src/core/TaskManager.ts
export class TaskManager {
  private tasks: Task[];
  private sessions: StudySession[];
  private readonly storageKeyTasks = 'studyflow_tasks_v1';
  private readonly storageKeySessions = 'studyflow_sessions_v1';
  private listeners: Set<() => void> = new Set();
  private storage: IStorage | null = null;

  public getTasks(): Task[] {
    // Defensive shallow copy to prevent external mutation
    return [...this.tasks];
  }
}
```

#### B. Domain Invariant Protection & Business Logic Bundling
An object is not just a container for data; it enforces the validity of its internal state. The `TaskManager` class enforces essential academic domain rules during task creation:
1. Rejects blank task titles.
2. Mandates positive study durations ($> 0$ minutes).
3. Requires a valid ISO deadline string.

Furthermore, `TaskManager` bundles the **Timetable Collision Detection Algorithm** directly within the entity managing the schedule:

```typescript
// From src/core/TaskManager.ts
public detectSessionConflict(
  candidate: { dayOfWeek: number; startTime: string; endTime: string },
  excludeSessionId?: string
): StudySession | null {
  const toMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const candStart = toMinutes(candidate.startTime);
  const candEnd = toMinutes(candidate.endTime);

  if (candEnd <= candStart) {
    throw new Error('Session end time must be after start time.');
  }

  for (const session of this.sessions) {
    if (excludeSessionId && session.id === excludeSessionId) continue;

    if (session.dayOfWeek === candidate.dayOfWeek) {
      const sessStart = toMinutes(session.startTime);
      const sessEnd = toMinutes(session.endTime);

      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      if (candStart < sessEnd && candEnd > sessStart) {
        return session; // Collision found!
      }
    }
  }
  return null;
}
```

#### C. Separation of Concerns & Class Hierarchy in the Mini-Interpreter
In `src/core/Interpreter.ts`, OOP structure mirrors compiler design patterns by splitting execution into dedicated, single-responsibility classes:
- **`Tokenizer` Class:** Manages cursor position and lexical scanning.
- **`Parser` Class:** Manages token streams and constructs the Abstract Syntax Tree.
- **`Evaluator` Class:** Implements semantic evaluation rules and command dispatch.
- **`Interpreter` Class:** Acts as a Facade class coordinating the pipeline and recording performance telemetry.

#### D. Custom Exception Hierarchy
OOP inheritance is utilized to build a structured diagnostic error hierarchy:

```typescript
// From src/core/Interpreter.ts
export class InterpreterError extends Error {
  constructor(message: string, public position?: number) {
    super(message);
    this.name = 'InterpreterError';
  }
}

export class LexicalError extends InterpreterError { /* ... */ }
export class SyntaxError extends InterpreterError { /* ... */ }
export class RuntimeError extends InterpreterError { /* ... */ }
```

---

## 3. Paradigm 2: Functional Programming (FP)

### Core Principles Demonstrated

#### A. Pure Functions & Zero Side-Effects
A pure function is deterministic: given the same input arguments, it will always compute the exact same return value without causing observable side-effects (no DOM manipulation, no network calls, no mutation of global variables).

In [src/utils/fp.ts](file:///C:/Users/ss/OneDrive/Desktop/PPl%20project/src/utils/fp.ts), all analytics and calculation functions are pure.

```typescript
// From src/utils/fp.ts
export const calculateProductivityMetrics = (
  tasks: readonly Task[]
): ProductivitySummary => {
  if (tasks.length === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      completionPercentage: 0,
      totalEstimatedMinutes: 0,
      completedMinutes: 0,
      upcomingDeadlinesCount: 0,
      productivityScore: 0,
    };
  }

  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  // Pure reduction fold over the task collection
  const aggregated = tasks.reduce(
    (acc, task) => {
      acc.totalEstimatedMinutes += task.estimatedMinutes;
      if (task.completed) {
        acc.completedTasks += 1;
        acc.completedMinutes += task.estimatedMinutes;
      } else {
        acc.pendingTasks += 1;
        const deadlineDate = new Date(task.deadline);
        if (deadlineDate >= now && deadlineDate <= threeDaysFromNow) {
          acc.upcomingDeadlinesCount += 1;
        }
      }
      return acc;
    },
    {
      completedTasks: 0,
      pendingTasks: 0,
      totalEstimatedMinutes: 0,
      completedMinutes: 0,
      upcomingDeadlinesCount: 0,
    }
  );

  const total = tasks.length;
  const completionPercentage = Math.round((aggregated.completedTasks / total) * 100);
  const loadPenalty = Math.min(20, aggregated.upcomingDeadlinesCount * 5);
  const productivityScore = Math.max(0, Math.min(100, completionPercentage - loadPenalty + (aggregated.completedTasks > 0 ? 10 : 0)));

  return {
    totalTasks: total,
    completedTasks: aggregated.completedTasks,
    pendingTasks: aggregated.pendingTasks,
    completionPercentage,
    totalEstimatedMinutes: aggregated.totalEstimatedMinutes,
    completedMinutes: aggregated.completedMinutes,
    upcomingDeadlinesCount: aggregated.upcomingDeadlinesCount,
    productivityScore,
  };
};
```

#### B. Immutability & Declarative Sorting
In FP, collections are never mutated in place. When sorting or filtering, new arrays are constructed using spread syntax:

```typescript
// From src/utils/fp.ts
export const sortTasks = (
  tasks: readonly Task[],
  sortBy: TaskFilterCriteria['sortBy'],
  sortOrder: TaskFilterCriteria['sortOrder']
): readonly Task[] => {
  const priorityWeight: Record<Task['priority'], number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const comparator = (a: Task, b: Task): number => {
    let diff = 0;
    switch (sortBy) {
      case 'deadline':
        diff = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case 'priority':
        diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        break;
      case 'estimatedMinutes':
        diff = a.estimatedMinutes - b.estimatedMinutes;
        break;
      case 'createdAt':
        diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }
    return sortOrder === 'asc' ? diff : -diff;
  };

  // Immutability: create shallow clone before sorting
  return [...tasks].sort(comparator);
};
```

#### C. Higher-Order Functions (`map`, `filter`, `reduce`)
The subject analytics aggregator transforms course subjects into visual percentage statistics by composing `map` and `filter`:

```typescript
// From src/utils/fp.ts
export const calculateSubjectAnalytics = (
  tasks: readonly Task[]
): readonly SubjectAnalytics[] => {
  const subjects: Subject[] = [/* predefined subjects */];

  return subjects
    .map((subj) => {
      const subjectTasks = tasks.filter((t) => t.subject === subj);
      const total = subjectTasks.length;
      if (total === 0) return null;

      const completed = subjectTasks.filter((t) => t.completed).length;
      const totalMinutes = subjectTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
      const completionRate = Math.round((completed / total) * 100);

      return {
        subject: subj,
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: total - completed,
        totalStudyMinutes: totalMinutes,
        completionRate,
        color: SUBJECT_COLORS[subj] || '#64748b',
      };
    })
    .filter((res): res is SubjectAnalytics => res !== null);
};
```

---

## 4. Synthesis & Architectural Rationale

| Dimension | Object-Oriented Programming (OOP) | Functional Programming (FP) |
| :--- | :--- | :--- |
| **Primary Location** | `src/core/TaskManager.ts`, `src/core/Interpreter.ts` | `src/utils/fp.ts` |
| **Core Entity** | Stateful classes, encapsulated methods, private state | Stateless pure functions, immutable data structures |
| **State Handling** | Mutable internal arrays protected by class invariants | Strict immutability; inputs are read-only (`readonly Task[]`) |
| **Error Handling** | Structured Exception Hierarchy (`throw new SyntaxError(...)`) | Pure return structures, predicates, and error representations |
| **Suitability for Problem** | Ideal for modeling persistent entities (tasks, calendar sessions) and multi-step stateful parsing loops | Ideal for statistical metrics, mathematical aggregations, and real-time filtering pipelines |

By integrating both paradigms, StudyFlow demonstrates that modern software engineering in languages like TypeScript thrives not on dogmatic adherence to one paradigm, but on applying each paradigm where its theoretical strengths provide the greatest clarity and robustness.
