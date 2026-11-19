import React, { useState } from 'react';
import { Task } from '../../types/task';
import { calculateSubjectAnalytics } from '../../utils/fp';

interface SubjectPieChartProps {
  tasks: Task[];
}

export const SubjectPieChart: React.FC<SubjectPieChartProps> = ({ tasks }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const stats = calculateSubjectAnalytics(tasks);
  const totalMinutes = stats.reduce((acc, s) => acc + s.totalStudyMinutes, 0);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Workload Allocation
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Percentage distribution of planned study commitments
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {stats.map((item, index) => {
              const slicePercent = totalMinutes > 0 ? item.totalStudyMinutes / totalMinutes : 0;
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += slicePercent;

              const isHovered = hoveredIdx === index;

              return (
                <circle
                  key={item.subject}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center stats */}
          <div className="absolute text-center">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {(totalMinutes / 60).toFixed(1)}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">Total Hours</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {stats.map((item, index) => {
            const percent = totalMinutes > 0 ? Math.round((item.totalStudyMinutes / totalMinutes) * 100) : 0;
            const isHovered = hoveredIdx === index;

            return (
              <div
                key={item.subject}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                    {item.subject.split(':')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                  <span className="text-slate-400">{item.totalStudyMinutes}m</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
