import React, { useState, useEffect } from 'react';
import { NavTab } from './components/layout/Sidebar';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { TimetablePage } from './pages/TimetablePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { InterpreterPage } from './pages/InterpreterPage';
import { TaskModal } from './components/tasks/TaskModal';
import { taskManagerInstance } from './core/TaskManager';
import { Task, StudySession } from './types/task';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('studyflow_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [tasks, setTasks] = useState<Task[]>(() => taskManagerInstance.getTasks());
  const [sessions, setSessions] = useState<StudySession[]>(() => taskManagerInstance.getSessions());
  const [isGlobalAddOpen, setIsGlobalAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize theme with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studyflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studyflow_theme', 'light');
    }
  }, [isDark]);

  // Subscribe to TaskManager updates
  useEffect(() => {
    const unsubscribe = taskManagerInstance.subscribe(() => {
      setTasks(taskManagerInstance.getTasks());
      setSessions(taskManagerInstance.getSessions());
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Handlers
  const handleAddTask = (taskData: Parameters<typeof taskManagerInstance.addTask>[0]) => {
    taskManagerInstance.addTask(taskData);
    showToast(`Task "${taskData.title}" created successfully!`);
  };

  const handleUpdateTask = (
    id: string,
    updates: Parameters<typeof taskManagerInstance.updateTask>[1]
  ) => {
    taskManagerInstance.updateTask(id, updates);
    showToast('Task updated successfully.');
  };

  const handleDeleteTask = (id: string) => {
    taskManagerInstance.deleteTask(id);
    showToast('Task deleted.');
  };

  const handleToggleComplete = (id: string) => {
    const updated = taskManagerInstance.toggleComplete(id);
    if (updated.completed) {
      showToast(`Completed: "${updated.title}"! 🎉`);
    } else {
      showToast(`Marked "${updated.title}" as pending.`);
    }
  };

  const handleSessionAdded = (session: StudySession) => {
    showToast(`Scheduled session for "${session.taskTitle}".`);
  };

  const handleDeleteSession = (id: string) => {
    taskManagerInstance.deleteSession(id);
    showToast('Scheduled session removed.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and sessions back to initial sample demo data?')) {
      taskManagerInstance.resetToSampleData();
      showToast('Database reset to initial CSCI 310 sample dataset.');
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isDark={isDark}
      onToggleTheme={() => setIsDark((prev) => !prev)}
      onOpenAddTask={() => setIsGlobalAddOpen(true)}
      onResetData={handleResetData}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Routing */}
      {activeTab === 'dashboard' && (
        <DashboardPage
          tasks={tasks}
          sessions={sessions}
          onToggleComplete={handleToggleComplete}
          onNavigateToTasks={() => setActiveTab('tasks')}
          onNavigateToTimetable={() => setActiveTab('timetable')}
          onNavigateToAnalytics={() => setActiveTab('analytics')}
          onNavigateToInterpreter={() => setActiveTab('interpreter')}
        />
      )}

      {activeTab === 'tasks' && (
        <TasksPage
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          isAddModalOpen={isGlobalAddOpen}
          onOpenAddModal={() => setIsGlobalAddOpen(true)}
          onCloseAddModal={() => setIsGlobalAddOpen(false)}
        />
      )}

      {activeTab === 'timetable' && (
        <TimetablePage
          tasks={tasks}
          sessions={sessions}
          onSessionAdded={handleSessionAdded}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsPage tasks={tasks} sessions={sessions} />
      )}

      {activeTab === 'interpreter' && <InterpreterPage />}

      {/* Global Add Task Modal */}
      <TaskModal
        isOpen={isGlobalAddOpen && activeTab !== 'tasks'}
        onClose={() => setIsGlobalAddOpen(false)}
        onSave={handleAddTask}
      />
    </Layout>
  );
};
