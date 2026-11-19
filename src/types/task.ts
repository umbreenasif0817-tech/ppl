export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Subject = 
  | 'CSCI 310: Programming Languages'
  | 'CSCI 220: Data Structures'
  | 'CSCI 340: Database Systems'
  | 'CSCI 370: Web Technologies'
  | 'MATH 201: Discrete Mathematics'
  | 'General Study';

export interface Task {
  id: string;
  title: string;
  subject: Subject;
  description?: string;
  deadline: string; // ISO string (YYYY-MM-DD)
  priority: Priority;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  taskId: string;
  taskTitle: string;
  subject: Subject;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // HH:mm format (e.g., "09:00")
  endTime: string;   // HH:mm format (e.g., "11:00")
  durationMinutes: number;
  notes?: string;
}

export interface TaskFilterCriteria {
  searchQuery: string;
  subject: string; // 'all' or specific subject
  priority: string; // 'all' or specific priority
  status: 'all' | 'completed' | 'pending';
  sortBy: 'deadline' | 'priority' | 'estimatedMinutes' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface SubjectAnalytics {
  subject: Subject;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalStudyMinutes: number;
  completionRate: number; // 0 to 100
  color: string;
}

export interface ProductivitySummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  totalEstimatedMinutes: number;
  completedMinutes: number;
  upcomingDeadlinesCount: number;
  productivityScore: number; // 0-100 rating
}
