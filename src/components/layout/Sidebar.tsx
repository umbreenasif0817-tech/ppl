import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Terminal,
  Moon,
  Sun,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'tasks' | 'timetable' | 'analytics' | 'interpreter';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  isOpen,
  onClose,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'tasks' as NavTab,
      label: 'Task Manager',
      icon: CheckSquare,
      badge: 'CRUD',
    },
    {
      id: 'timetable' as NavTab,
      label: 'Study Timetable',
      icon: Calendar,
      badge: 'Conflict Alert',
    },
    {
      id: 'analytics' as NavTab,
      label: 'Performance Analytics',
      icon: BarChart3,
      badge: 'FP Charts',
    },
    {
      id: 'interpreter' as NavTab,
      label: 'Mini-Interpreter',
      icon: Terminal,
      badge: 'Custom REPL',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  StudyFlow
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart Study Planner</p>
            </div>
          </div>

          {/* Academic Context Badge */}
          <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-4 h-4" />
              <span>CSCI 310 Group Project</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Principles of Programming Languages • Dual Paradigm (OOP + FP)
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel: Theme Toggle & Paradigms Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Paradigm Summary Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Paradigms Active:
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              OOP & FP
            </span>
          </div>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <span className="text-xs text-slate-400">Toggle</span>
          </button>
        </div>
      </aside>
    </>
  );
};
