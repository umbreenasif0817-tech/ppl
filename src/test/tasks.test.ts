import { describe, it, expect, beforeEach } from 'vitest';
import { TaskManager } from '../core/TaskManager';
import {
  calculateProductivityMetrics,
  calculateSubjectAnalytics,
  filterTasks,
  sortTasks,
} from '../utils/fp';
import { Task } from '../types/task';

describe('Task Management & Functional Paradigms', () => {
  const sampleTasks: Task[] = [
    {
      id: 'test-1',
      title: 'Grammar Parser Quiz Prep',
      subject: 'CSCI 310: Programming Languages',
      deadline: '2026-12-01',
      priority: 'urgent',
      estimatedMinutes: 120,
      completed: true,
      createdAt: '2026-11-01',
    },
    {
      id: 'test-2',
      title: 'Relational Algebra Homework',
      subject: 'CSCI 340: Database Systems',
      deadline: '2026-12-05',
      priority: 'medium',
      estimatedMinutes: 60,
      completed: false,
      createdAt: '2026-11-02',
    },
    {
      id: 'test-3',
      title: 'Red-Black Tree Visualizer',
      subject: 'CSCI 220: Data Structures',
      deadline: '2026-12-10',
      priority: 'high',
      estimatedMinutes: 180,
      completed: false,
      createdAt: '2026-11-03',
    },
  ];

  describe('Functional Programming Layer (Pure Functions)', () => {
    it('calculates productivity metrics purely via reduce', () => {
      const metrics = calculateProductivityMetrics(sampleTasks);
      expect(metrics.totalTasks).toBe(3);
      expect(metrics.completedTasks).toBe(1);
      expect(metrics.pendingTasks).toBe(2);
      expect(metrics.completionPercentage).toBe(33);
      expect(metrics.totalEstimatedMinutes).toBe(360);
      expect(metrics.completedMinutes).toBe(120);
    });

    it('calculates subject-wise analytics with map and filter', () => {
      const subjectStats = calculateSubjectAnalytics(sampleTasks);
      const csci310 = subjectStats.find((s) => s.subject === 'CSCI 310: Programming Languages');
      expect(csci310).toBeDefined();
      expect(csci310?.totalTasks).toBe(1);
      expect(csci310?.completedTasks).toBe(1);
      expect(csci310?.completionRate).toBe(100);
    });

    it('filters tasks by search query without mutating source', () => {
      const filtered = filterTasks(sampleTasks, {
        searchQuery: 'Tree',
        subject: 'all',
        priority: 'all',
        status: 'all',
        sortBy: 'deadline',
        sortOrder: 'asc',
      });
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toContain('Red-Black Tree');
      expect(sampleTasks.length).toBe(3); // Immutability preserved!
    });

    it('sorts tasks immutably by estimated duration', () => {
      const sorted = sortTasks(sampleTasks, 'estimatedMinutes', 'asc');
      expect(sorted[0].estimatedMinutes).toBe(60);
      expect(sorted[2].estimatedMinutes).toBe(180);
      expect(sampleTasks[0].estimatedMinutes).toBe(120); // Original order untampered!
    });
  });

  describe('Object-Oriented Layer (TaskManager Class)', () => {
    let manager: TaskManager;
    let mockStore: Record<string, string>;

    beforeEach(() => {
      mockStore = {};
      const mockStorage = {
        getItem: (k: string) => mockStore[k] || null,
        setItem: (k: string, v: string) => {
          mockStore[k] = v;
        },
      };
      manager = new TaskManager(mockStorage);
    });

    it('encapsulates task addition and validation', () => {
      const task = manager.addTask({
        title: 'New OOP Assignment',
        subject: 'CSCI 310: Programming Languages',
        deadline: '2026-12-15',
        priority: 'high',
        estimatedMinutes: 90,
      });

      expect(task.id).toBeDefined();
      expect(task.title).toBe('New OOP Assignment');
      expect(task.completed).toBe(false);

      const found = manager.getTaskById(task.id);
      expect(found).toBeDefined();
    });

    it('throws validation error when task title is empty', () => {
      expect(() => {
        manager.addTask({
          title: '   ',
          subject: 'CSCI 310: Programming Languages',
          deadline: '2026-12-15',
          priority: 'low',
          estimatedMinutes: 60,
        });
      }).toThrow('Task title cannot be empty.');
    });

    it('toggles task completion status', () => {
      const task = manager.addTask({
        title: 'Task to complete',
        subject: 'General Study',
        deadline: '2026-12-20',
        priority: 'low',
        estimatedMinutes: 30,
      });

      expect(task.completed).toBe(false);
      const updated = manager.toggleComplete(task.id);
      expect(updated.completed).toBe(true);
      expect(updated.completedAt).toBeDefined();
    });

    it('detects timetable session conflicts between overlapping intervals', () => {
      const task = manager.addTask({
        title: 'Lab Session',
        subject: 'CSCI 310: Programming Languages',
        deadline: '2026-12-20',
        priority: 'high',
        estimatedMinutes: 120,
      });

      // Add a session from 10:00 to 12:00 on Monday (dayOfWeek = 1)
      manager.addSession({
        taskId: task.id,
        dayOfWeek: 1,
        startTime: '10:00',
        endTime: '12:00',
      });

      // Candidate 1: Overlaps (11:00 to 13:00)
      const conflict1 = manager.detectSessionConflict({
        dayOfWeek: 1,
        startTime: '11:00',
        endTime: '13:00',
      });
      expect(conflict1).not.toBeNull();
      expect(conflict1?.startTime).toBe('10:00');

      // Candidate 2: Distinct non-overlapping slot (14:00 to 16:00)
      const conflict2 = manager.detectSessionConflict({
        dayOfWeek: 1,
        startTime: '14:00',
        endTime: '16:00',
      });
      expect(conflict2).toBeNull();
    });
  });
});
