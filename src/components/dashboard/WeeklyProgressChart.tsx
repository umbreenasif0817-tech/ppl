import React, { useState } from 'react';
import { StudySession } from '../../types/task';
import { calculateWeeklyStudyDistribution } from '../../utils/fp';

interface WeeklyProgressChartProps {
  sessions: StudySession[];
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ sessions }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Pure functional computation of 7-day metrics
  const data = calculateWeeklyStudyDistribution(sessions);
  const maxHours = Math.max(5, ...data.map((d) => d.hours));

  const chartHeight = 160;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Weekly Study Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scheduled study hours mapped across days (FP Pure Map & Reduce)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
            <span className="text-slate-600 dark:text-slate-400">Study Hours</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart with Hover Tooltips */}
      <div className="relative pt-6">
        <div className="flex items-end justify-between gap-3 h-48 px-2 border-b border-slate-100 dark:border-slate-800">
          {data.map((item, index) => {
            const heightPercent = maxHours > 0 ? (item.hours / maxHours) * 100 : 0;
            const barPixelHeight = Math.max(8, (heightPercent / 100) * chartHeight);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                    {item.hours} hrs ({item.sessionCount} session{item.sessionCount === 1 ? '' : 's'})
                  </div>
                )}

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/80 rounded-t-lg overflow-hidden flex flex-col justify-end h-40">
                  <div
                    className={`w-full transition-all duration-300 rounded-t-lg ${
                      isHovered
                        ? 'bg-indigo-500'
                        : 'bg-gradient-to-t from-indigo-600 to-indigo-500'
                    }`}
                    style={{ height: `${barPixelHeight}px` }}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`mt-3 text-xs font-medium transition-colors ${
                    isHovered
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
