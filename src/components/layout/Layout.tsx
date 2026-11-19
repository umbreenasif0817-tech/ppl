import React, { useState, ReactNode } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAddTask: () => void;
  onResetData: () => void;
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  onOpenAddTask,
  onResetData,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddTask={onOpenAddTask}
          onResetData={onResetData}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>
    </div>
  );
};
