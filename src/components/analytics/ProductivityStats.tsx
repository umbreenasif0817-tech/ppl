import React from 'react';
import { ProductivitySummary } from '../../types/task';
import { Zap, CheckCircle2, Target, Flame } from 'lucide-react';

interface ProductivityStatsProps {
  metrics: ProductivitySummary;
}

export const ProductivityStats: React.FC<ProductivityStatsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Productivity Score',
      value: `${metrics.productivityScore}/100`,
      icon: Flame,
      color: '#f43f5e',
      desc: 'Dynamic rating balancing completed tasks and urgency load',
    },
    {
      title: 'Completion Velocity',
      value: `${metrics.completionPercentage}%`,
      icon: Target,
      color: '#10b981',
      desc: `${metrics.completedTasks} of ${metrics.totalTasks} study goals finished`,
    },
    {
      title: 'Completed Minutes',
      value: `${metrics.completedMinutes}m`,
      icon: CheckCircle2,
      color: '#3b82f6',
      desc: `${(metrics.completedMinutes / 60).toFixed(1)} hours of focused study logged`,
    },
    {
      title: 'Remaining Backlog',
      value: `${metrics.totalEstimatedMinutes - metrics.completedMinutes}m`,
      icon: Zap,
      color: '#8b5cf6',
      desc: `${metrics.pendingTasks} tasks pending in queue`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {c.title}
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${c.color}15`, color: c.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {c.value}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
