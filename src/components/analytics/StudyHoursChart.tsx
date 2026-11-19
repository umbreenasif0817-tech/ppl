import React, { useState } from 'react';
import { Task } from '../../types/task';
import { calculateSubjectAnalytics } from '../../utils/fp';

interface StudyHoursChartProps {
  tasks: Task[];
}

export const StudyHoursChart: React.FC<StudyHoursChartProps> = ({ tasks }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Pure functional mapping of subjects
  const analytics = calculateSubjectAnalytics(tasks);
  const maxMinutes = Math.max(120, ...analytics.map((a) => a.totalStudyMinutes));

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Study Hours by Subject
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total planned vs completed study hours (FP reduce & map)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
            <span className="text-slate-600 dark:text-slate-400">Planned Hours</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {analytics.map((item, index) => {
          const widthPercent = (item.totalStudyMinutes / maxMinutes) * 100;
          const hours = (item.totalStudyMinutes / 60).toFixed(1);
          const isHovered = hoveredIdx === index;

          return (
            <div
              key={item.subject}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                  {item.subject}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  {hours} hrs ({item.totalStudyMinutes} mins)
                </span>
              </div>

              {/* Bar track */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: isHovered ? '#4f46e5' : item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
