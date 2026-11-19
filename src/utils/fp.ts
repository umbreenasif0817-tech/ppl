import {
  Task,
  StudySession,
  TaskFilterCriteria,
  SubjectAnalytics,
  ProductivitySummary,
  Subject,
} from '../types/task';

/**
 * ============================================================================
 * FUNCTIONAL PROGRAMMING (FP) PARADIGM SHOWCASE: Pure Analytic Functions
 * ============================================================================
 * Key FP Principles Demonstrated:
 * 1. Pure Functions: Deterministic; given the same inputs, they produce identical outputs
 *    with ZERO side-effects (no state mutation, no DOM changes, no localStorage calls).
 * 2. Immutability: Inputs are treated as read-only. Returns fresh objects/arrays via spread
 *    syntax and array operators.
 * 3. Higher-Order Functions: Heavy reliance on map(), filter(), reduce(), and custom predicates.
 * 4. Declarative Style: Code states WHAT data transformation to perform, not HOW step-by-step.
 */

// Subject color map for consistent visual theming
export const SUBJECT_COLORS: Record<Subject, string> = {
  'CSCI 310: Programming Languages': '#6366f1', // Indigo
  'CSCI 220: Data Structures': '#3b82f6',        // Blue
  'CSCI 340: Database Systems': '#06b6d4',       // Cyan
  'CSCI 370: Web Technologies': '#10b981',       // Emerald
  'MATH 201: Discrete Mathematics': '#f59e0b',   // Amber
  'General Study': '#8b5cf6',                    // Purple
};

/**
 * FP Function 1: Pure Filter & Search Pipeline
 * Uses array.filter() with composed pure boolean predicates.
 */
export const filterTasks = (
  tasks: readonly Task[],
  criteria: TaskFilterCriteria
): readonly Task[] => {
  const query = criteria.searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    // Predicate 1: Text search match in title, description, or subject
    const matchesSearch =
      query === '' ||
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      task.subject.toLowerCase().includes(query);

    // Predicate 2: Subject matching
    const matchesSubject =
      criteria.subject === 'all' || task.subject === criteria.subject;

    // Predicate 3: Priority matching
    const matchesPriority =
      criteria.priority === 'all' || task.priority === criteria.priority;

    // Predicate 4: Status matching
    const matchesStatus =
      criteria.status === 'all' ||
      (criteria.status === 'completed' && task.completed) ||
      (criteria.status === 'pending' && !task.completed);

    return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
  });
};

/**
 * FP Function 2: Pure Sorting with High-Order Comparators
 * Returns a new sorted array without mutating the original input.
 */
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
      default:
        diff = 0;
    }
    return sortOrder === 'asc' ? diff : -diff;
  };

  // Pure immutability: copy array first, then sort
  return [...tasks].sort(comparator);
};

/**
 * FP Function 3: Productivity Analytics via Array.reduce()
 * Aggregates task collections into comprehensive productivity metrics in a single pass.
 */
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

  // Single-pass pure fold/reduce
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

  // Productivity score calculation: weighted combination of completion rate & pending load
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

/**
 * FP Function 4: Subject Analytics Aggregation (Group-By & Map Pattern)
 * Calculates completion rates and study minutes per academic subject.
 */
export const calculateSubjectAnalytics = (
  tasks: readonly Task[]
): readonly SubjectAnalytics[] => {
  const subjects: Subject[] = [
    'CSCI 310: Programming Languages',
    'CSCI 220: Data Structures',
    'CSCI 340: Database Systems',
    'CSCI 370: Web Technologies',
    'MATH 201: Discrete Mathematics',
    'General Study',
  ];

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

/**
 * FP Function 5: Weekly Timetable Hour Distribution
 * Pure map & reduce to aggregate scheduled study hours for all 7 days of the week.
 */
export const calculateWeeklyStudyDistribution = (
  sessions: readonly StudySession[]
): { day: string; dayIndex: number; hours: number; sessionCount: number }[] => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return [1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
    const daySessions = sessions.filter((s) => s.dayOfWeek === dayIdx);
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const hours = parseFloat((totalMinutes / 60).toFixed(1));

    return {
      day: dayNames[dayIdx],
      dayIndex: dayIdx,
      hours,
      sessionCount: daySessions.length,
    };
  });
};

/**
 * FP Function 6: Urgency Extractor
 * Pure declarative pipeline to fetch pending tasks sorted by closest deadline.
 */
export const getUpcomingTasks = (
  tasks: readonly Task[],
  limit: number = 4
): readonly Task[] => {
  return tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, limit);
};
