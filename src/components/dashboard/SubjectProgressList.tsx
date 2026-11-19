import React from 'react';
import { Task } from '../../types/task';
import { calculateSubjectAnalytics } from '../../utils/fp';

interface SubjectProgressListProps {
  tasks: Task[];
}

export const SubjectProgressList: React.FC<SubjectProgressListProps> = ({ tasks }) => {
  // Pure functional mapping
  const subjectStats = calculateSubjectAnalytics(tasks);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Course Progress Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Completion rates computed per university subject (FP Group-By & Map)
        </p>
      </div>

      <div className="space-y-4">
        {subjectStats.map((item) => (
          <div key={item.subject} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {item.subject}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">
                  {item.completedTasks}/{item.totalTasks} tasks
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {item.completionRate}%
                </span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.completionRate}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
