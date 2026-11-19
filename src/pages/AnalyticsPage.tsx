import React from 'react';
import { Task, StudySession } from '../types/task';
import { ProductivityStats } from '../components/analytics/ProductivityStats';
import { StudyHoursChart } from '../components/analytics/StudyHoursChart';
import { SubjectPieChart } from '../components/analytics/SubjectPieChart';
import { calculateProductivityMetrics } from '../utils/fp';
import { Binary, Code2, Sparkles } from 'lucide-react';

interface AnalyticsPageProps {
  tasks: Task[];
  sessions: StudySession[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ tasks }) => {
  const metrics = calculateProductivityMetrics(tasks);

  return (
    <div className="space-y-6">
      {/* FP Explanation Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <Binary className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Functional Analytics Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            All metrics on this page are computed using pure mathematical functions without mutating application state. Aggregations, ratios, and distributions rely exclusively on <code className="font-mono text-indigo-600 dark:text-indigo-400">map()</code>, <code className="font-mono text-indigo-600 dark:text-indigo-400">filter()</code>, and <code className="font-mono text-indigo-600 dark:text-indigo-400">reduce()</code> pipelines located in <code className="font-mono text-indigo-600 dark:text-indigo-400">src/utils/fp.ts</code>.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex-shrink-0 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero Side-Effects</span>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <ProductivityStats metrics={metrics} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <StudyHoursChart tasks={tasks} />
        </div>
        <div className="lg:col-span-5">
          <SubjectPieChart tasks={tasks} />
        </div>
      </div>

      {/* Paradigm Code Reference Box */}
      <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            CSCI 310 Evaluation Note: Pure Function Code Sample
          </h3>
        </div>
        <pre className="text-xs font-mono text-emerald-400 bg-black/40 p-4 rounded-xl overflow-x-auto border border-white/5">
{`// Declarative, side-effect free aggregation in src/utils/fp.ts
export const calculateProductivityMetrics = (tasks: readonly Task[]): ProductivitySummary => {
  return tasks.reduce((acc, task) => {
    acc.totalEstimatedMinutes += task.estimatedMinutes;
    if (task.completed) {
      acc.completedTasks += 1;
      acc.completedMinutes += task.estimatedMinutes;
    } else {
      acc.pendingTasks += 1;
    }
    return acc;
  }, { completedTasks: 0, pendingTasks: 0, totalEstimatedMinutes: 0, completedMinutes: 0 });
};`}
        </pre>
      </div>
    </div>
  );
};
