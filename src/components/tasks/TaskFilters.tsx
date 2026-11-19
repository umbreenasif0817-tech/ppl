import React from 'react';
import { TaskFilterCriteria, Subject } from '../../types/task';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFilterCriteria;
  onFilterChange: (newFilters: TaskFilterCriteria) => void;
  subjects: Subject[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  subjects,
}) => {
  const update = (partial: Partial<TaskFilterCriteria>) => {
    onFilterChange({ ...filters, ...partial });
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => update({ searchQuery: e.target.value })}
          placeholder="Search tasks by title, description, or subject (FP pure predicate)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium">
            <button
              onClick={() => update({ status: 'all' })}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.status === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => update({ status: 'pending' })}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.status === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => update({ status: 'completed' })}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.status === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Subject Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.subject}
              onChange={(e) => update({ subject: e.target.value })}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer py-1"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s.split(':')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-xs">
            <select
              value={filters.priority}
              onChange={(e) => update({ priority: e.target.value })}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer py-1"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as TaskFilterCriteria['sortBy'] })}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer py-1"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
              <option value="estimatedMinutes">Sort by Duration</option>
              <option value="createdAt">Sort by Created</option>
            </select>
          </div>

          <button
            onClick={() => update({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
            title={`Order: ${filters.sortOrder.toUpperCase()}`}
            className="p-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>
    </div>
  );
};
