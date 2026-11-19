import React from 'react';
import { Menu, Plus, RotateCcw } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onOpenSidebar: () => void;
  onOpenAddTask: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenSidebar,
  onOpenAddTask,
  onResetData,
}) => {
  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Study Dashboard',
      subtitle: 'Overview of academic progress, upcoming deadlines, and study statistics.',
    },
    tasks: {
      title: 'Task Manager',
      subtitle: 'Manage assignments, set priorities, and track task completion.',
    },
    timetable: {
      title: 'Study Timetable',
      subtitle: 'Weekly calendar view with automated collision and conflict detection.',
    },
    analytics: {
      title: 'Performance Analytics',
      subtitle: 'Productivity metrics calculated via pure Functional Programming pipelines.',
    },
    interpreter: {
      title: 'Mini-Interpreter',
      subtitle: 'Domain-specific language evaluator built with manual Tokenizer and Parser.',
    },
  };

  const { title, subtitle } = titles[activeTab];

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Reset to initial seed data button */}
        <button
          onClick={onResetData}
          title="Reset tasks and sessions to initial demo state"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenAddTask}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
