import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge, SubjectBadge } from '../common/Badge';
import { getUpcomingTasks } from '../../utils/fp';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface UpcomingDeadlinesProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onNavigateToTasks: () => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  tasks,
  onToggleComplete,
  onNavigateToTasks,
}) => {
  // Pure FP helper to get urgent upcoming tasks
  const upcoming = getUpcomingTasks(tasks, 5);

  const getDaysLeft = (dateStr: string): { text: string; isUrgent: boolean } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateStr);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.round((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, isUrgent: true };
    if (diffDays === 0) return { text: 'Due today', isUrgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', isUrgent: true };
    return { text: `Due in ${diffDays} days`, isUrgent: diffDays <= 3 };
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Upcoming Deadlines
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pending assignments requiring focus
          </p>
        </div>
        <button
          onClick={onNavigateToTasks}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all tasks →
        </button>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2 opacity-80" />
          <p className="text-sm font-medium text-slate-900 dark:text-white">All caught up!</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No pending tasks due in the immediate schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((task) => {
            const { text: dueText, isUrgent } = getDaysLeft(task.deadline);
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    title="Mark task completed"
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <SubjectBadge subject={task.subject} size="sm" />
                      <PriorityBadge priority={task.priority} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      isUrgent
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isUrgent ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{dueText}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Est. {task.estimatedMinutes}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
