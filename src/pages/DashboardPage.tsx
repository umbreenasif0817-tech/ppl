import React from 'react';
import { Task, StudySession } from '../types/task';
import { StatCard } from '../components/common/StatCard';
import { WeeklyProgressChart } from '../components/dashboard/WeeklyProgressChart';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { SubjectProgressList } from '../components/dashboard/SubjectProgressList';
import { ParadigmShowcaseCard } from '../components/dashboard/ParadigmShowcaseCard';
import { calculateProductivityMetrics } from '../utils/fp';
import { CheckCircle2, Clock, Calendar, AlertTriangle } from 'lucide-react';

interface DashboardPageProps {
  tasks: Task[];
  sessions: StudySession[];
  onToggleComplete: (id: string) => void;
  onNavigateToTasks: () => void;
  onNavigateToTimetable: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToInterpreter: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  tasks,
  sessions,
  onToggleComplete,
  onNavigateToTasks,
  onNavigateToAnalytics,
  onNavigateToInterpreter,
}) => {
  // Pure Functional computation of overall metrics
  const metrics = calculateProductivityMetrics(tasks);

  return (
    <div className="space-y-6">
      {/* Paradigm Showcase Card for CSCI 310 presentation */}
      <ParadigmShowcaseCard
        onGoToInterpreter={onNavigateToInterpreter}
        onGoToAnalytics={onNavigateToAnalytics}
      />

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Study Tasks"
          value={metrics.totalTasks}
          subtitle={`${metrics.pendingTasks} tasks in queue`}
          icon={<Clock className="w-6 h-6" />}
          accentColor="#6366f1"
        />

        <StatCard
          title="Completed Tasks"
          value={metrics.completedTasks}
          subtitle={`${metrics.completedMinutes} mins completed`}
          trend={{ value: `${metrics.completionPercentage}% done`, isPositive: true }}
          icon={<CheckCircle2 className="w-6 h-6" />}
          accentColor="#10b981"
        />

        <StatCard
          title="Pending Commitments"
          value={metrics.pendingTasks}
          subtitle="Assignments & reviews"
          icon={<Calendar className="w-6 h-6" />}
          accentColor="#f59e0b"
        />

        <StatCard
          title="Upcoming Deadlines"
          value={metrics.upcomingDeadlinesCount}
          subtitle="Due within 3 days"
          trend={
            metrics.upcomingDeadlinesCount > 0
              ? { value: 'Requires attention', isPositive: false }
              : { value: 'Schedule clear', isPositive: true }
          }
          icon={<AlertTriangle className="w-6 h-6" />}
          accentColor="#f43f5e"
        />
      </div>

      {/* Middle Grid: Weekly Progress + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WeeklyProgressChart sessions={sessions} />
        </div>
        <div className="lg:col-span-5">
          <UpcomingDeadlines
            tasks={tasks}
            onToggleComplete={onToggleComplete}
            onNavigateToTasks={onNavigateToTasks}
          />
        </div>
      </div>

      {/* Bottom Grid: Course Progress Breakdown */}
      <div>
        <SubjectProgressList tasks={tasks} />
      </div>
    </div>
  );
};
