import { Task, StudySession, Priority, Subject } from '../types/task';
import { initialSeedTasks, initialSeedSessions } from '../utils/seedData';

/**
 * ============================================================================
 * OBJECT-ORIENTED PROGRAMMING (OOP) PARADIGM SHOWCASE: TaskManager Class
 * ============================================================================
 * Key OOP Principles Demonstrated:
 * 1. Encapsulation: Internal task and session storage is encapsulated in private fields.
 * 2. Invariant Protection: Validates input, prevents invalid state transitions.
 * 3. Domain Logic: Business rules like schedule collision detection and state persistence
 *    are bundled alongside data structures.
 * 4. Observer Pattern: Allows reactive UI components to subscribe to state changes.
 */
export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class TaskManager {
  private tasks: Task[];
  private sessions: StudySession[];
  private readonly storageKeyTasks = 'studyflow_tasks_v1';
  private readonly storageKeySessions = 'studyflow_sessions_v1';
  private listeners: Set<() => void> = new Set();
  private storage: IStorage | null = null;

  constructor(customStorage?: IStorage) {
    if (customStorage) {
      this.storage = customStorage;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
    }
    this.tasks = this.loadTasks();
    this.sessions = this.loadSessions();
  }

  // --- Persistence Methods (Encapsulated Storage) ---
  private loadTasks(): Task[] {
    try {
      if (this.storage) {
        const stored = this.storage.getItem(this.storageKeyTasks);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load tasks from storage, falling back to seed data:', e);
    }
    // Default seed data
    return [...initialSeedTasks];
  }

  private loadSessions(): StudySession[] {
    try {
      if (this.storage) {
        const stored = this.storage.getItem(this.storageKeySessions);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load sessions from storage:', e);
    }
    return [...initialSeedSessions];
  }

  private saveToStorage(): void {
    try {
      if (this.storage) {
        this.storage.setItem(this.storageKeyTasks, JSON.stringify(this.tasks));
        this.storage.setItem(this.storageKeySessions, JSON.stringify(this.sessions));
      }
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
    this.notifyListeners();
  }

  // --- Observer Pattern Support ---
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in TaskManager listener:', err);
      }
    });
  }

  // --- Task Operations ---
  public getTasks(): Task[] {
    // Return a shallow defensive copy to preserve encapsulation
    return [...this.tasks];
  }

  public getTaskById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  public addTask(taskData: {
    title: string;
    subject: Subject;
    description?: string;
    deadline: string;
    priority: Priority;
    estimatedMinutes: number;
  }): Task {
    // Validate domain invariants
    if (!taskData.title.trim()) {
      throw new Error('Task title cannot be empty.');
    }
    if (taskData.estimatedMinutes <= 0) {
      throw new Error('Estimated study duration must be greater than 0 minutes.');
    }
    if (!taskData.deadline) {
      throw new Error('Task deadline must be specified.');
    }

    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: taskData.title.trim(),
      subject: taskData.subject,
      description: taskData.description?.trim() || '',
      deadline: taskData.deadline,
      priority: taskData.priority,
      estimatedMinutes: Math.round(taskData.estimatedMinutes),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    this.saveToStorage();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found.`);
    }

    const existing = this.tasks[index];
    const updated: Task = {
      ...existing,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      estimatedMinutes: updates.estimatedMinutes !== undefined 
        ? Math.max(1, Math.round(updates.estimatedMinutes)) 
        : existing.estimatedMinutes,
    };

    if (!updated.title) {
      throw new Error('Task title cannot be empty.');
    }

    this.tasks[index] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteTask(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    // Also remove associated study sessions for this task
    this.sessions = this.sessions.filter((s) => s.taskId !== id);
    const deleted = this.tasks.length < initialLength;
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  public toggleComplete(id: string): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }

    const newCompleted = !task.completed;
    return this.updateTask(id, {
      completed: newCompleted,
      completedAt: newCompleted ? new Date().toISOString() : undefined,
    });
  }

  // --- Study Session & Timetable Operations ---
  public getSessions(): StudySession[] {
    return [...this.sessions];
  }

  /**
   * Domain Logic: Collision Detection to avoid overlapping study sessions.
   * Compares day of week and converted minute intervals.
   */
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
      if (excludeSessionId && session.id === excludeSessionId) {
        continue;
      }

      if (session.dayOfWeek === candidate.dayOfWeek) {
        const sessStart = toMinutes(session.startTime);
        const sessEnd = toMinutes(session.endTime);

        // Check for interval overlap: (StartA < EndB) and (EndA > StartB)
        if (candStart < sessEnd && candEnd > sessStart) {
          return session; // Collision found!
        }
      }
    }

    return null; // No conflict
  }

  public addSession(sessionData: {
    taskId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    notes?: string;
  }): { session: StudySession; conflictWarning?: string } {
    const task = this.getTaskById(sessionData.taskId);
    if (!task) {
      throw new Error(`Task with ID ${sessionData.taskId} does not exist.`);
    }

    // Check collision
    const conflict = this.detectSessionConflict({
      dayOfWeek: sessionData.dayOfWeek,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
    });

    const toMinutes = (timeStr: string): number => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const duration = toMinutes(sessionData.endTime) - toMinutes(sessionData.startTime);

    const newSession: StudySession = {
      id: 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      taskId: task.id,
      taskTitle: task.title,
      subject: task.subject,
      dayOfWeek: sessionData.dayOfWeek,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      durationMinutes: duration,
      notes: sessionData.notes?.trim() || '',
    };

    this.sessions.push(newSession);
    this.saveToStorage();

    return {
      session: newSession,
      conflictWarning: conflict 
        ? `Warning: This session overlaps with "${conflict.taskTitle}" (${conflict.startTime} - ${conflict.endTime}).` 
        : undefined,
    };
  }

  public deleteSession(id: string): boolean {
    const initialLength = this.sessions.length;
    this.sessions = this.sessions.filter((s) => s.id !== id);
    const deleted = this.sessions.length < initialLength;
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  // --- Reset to Sample Data ---
  public resetToSampleData(): void {
    this.tasks = [...initialSeedTasks];
    this.sessions = [...initialSeedSessions];
    this.saveToStorage();
  }
}

// Global Singleton Instance
export const taskManagerInstance = new TaskManager();
