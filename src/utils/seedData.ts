import { Task, StudySession } from '../types/task';

// Generate dynamic dates relative to today for realistic demonstration
const now = new Date();
const formatDate = (offsetDays: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialSeedTasks: Task[] = [
  {
    id: 'seed-task-1',
    title: 'CSCI 310 Mini-Interpreter Implementation',
    subject: 'CSCI 310: Programming Languages',
    description: 'Implement manual tokenizer, parser, and evaluator supporting ADD, SUB, MUL, DIV, STUDY_HOURS, and PROGRESS without eval().',
    deadline: formatDate(1),
    priority: 'urgent',
    estimatedMinutes: 180,
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'seed-task-2',
    title: 'Binary Search Tree & AVL Balancing Quiz Prep',
    subject: 'CSCI 220: Data Structures',
    description: 'Review AVL tree rotations, left-right double rotations, and time complexity derivations.',
    deadline: formatDate(2),
    priority: 'high',
    estimatedMinutes: 120,
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'seed-task-3',
    title: 'SQL Normalization (1NF to BCNF) Exercise',
    subject: 'CSCI 340: Database Systems',
    description: 'Complete decomposition problems, verify dependency preservation and lossless joins.',
    deadline: formatDate(4),
    priority: 'medium',
    estimatedMinutes: 90,
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'seed-task-4',
    title: 'Responsive CSS Grid & Flexbox Portfolio Draft',
    subject: 'CSCI 370: Web Technologies',
    description: 'Develop personal developer showcase featuring accessible semantic HTML and mobile-first CSS.',
    deadline: formatDate(6),
    priority: 'medium',
    estimatedMinutes: 150,
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'seed-task-5',
    title: 'Predicate Logic & Mathematical Induction Proofs',
    subject: 'MATH 201: Discrete Mathematics',
    description: 'Prove statements using strong induction and well-ordering principle for Chapter 5 assignment.',
    deadline: formatDate(3),
    priority: 'high',
    estimatedMinutes: 110,
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'seed-task-6',
    title: 'Prepare CSCI 310 Presentation Slides',
    subject: 'CSCI 310: Programming Languages',
    description: 'Structure 10-12 min demo slides covering OOP vs FP paradigms, mini-interpreter demo, and test results.',
    deadline: formatDate(5),
    priority: 'high',
    estimatedMinutes: 90,
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'seed-task-7',
    title: 'Read Dijkstra Shortest Path Algorithm in Graph Theory',
    subject: 'CSCI 220: Data Structures',
    description: 'Understand priority queue optimization for Dijkstra implementation with adjacency lists.',
    deadline: formatDate(7),
    priority: 'low',
    estimatedMinutes: 60,
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const initialSeedSessions: StudySession[] = [
  {
    id: 'seed-session-1',
    taskId: 'seed-task-1',
    taskTitle: 'CSCI 310 Mini-Interpreter Implementation',
    subject: 'CSCI 310: Programming Languages',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '11:00',
    durationMinutes: 120,
    notes: 'Focus on recursive parser and error messages.',
  },
  {
    id: 'seed-session-2',
    taskId: 'seed-task-2',
    taskTitle: 'Binary Search Tree & AVL Balancing Quiz Prep',
    subject: 'CSCI 220: Data Structures',
    dayOfWeek: 2, // Tuesday
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    notes: 'Solve 3 practice AVL rotation questions.',
  },
  {
    id: 'seed-session-3',
    taskId: 'seed-task-5',
    taskTitle: 'Predicate Logic & Mathematical Induction Proofs',
    subject: 'MATH 201: Discrete Mathematics',
    dayOfWeek: 3, // Wednesday
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    notes: 'Complete inductive step proofs.',
  },
  {
    id: 'seed-session-4',
    taskId: 'seed-task-3',
    taskTitle: 'SQL Normalization (1NF to BCNF) Exercise',
    subject: 'CSCI 340: Database Systems',
    dayOfWeek: 4, // Thursday
    startTime: '13:00',
    endTime: '14:30',
    durationMinutes: 90,
    notes: 'Database lab practice.',
  },
  {
    id: 'seed-session-5',
    taskId: 'seed-task-6',
    taskTitle: 'Prepare CSCI 310 Presentation Slides',
    subject: 'CSCI 310: Programming Languages',
    dayOfWeek: 5, // Friday
    startTime: '15:00',
    endTime: '16:30',
    durationMinutes: 90,
    notes: 'Coordinate slide talking points with group members.',
  },
];
