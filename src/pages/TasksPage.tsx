import React, { useState } from 'react';
import { Task, TaskFilterCriteria, Priority, Subject } from '../types/task';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskModal } from '../components/tasks/TaskModal';
import { filterTasks, sortTasks } from '../utils/fp';
import { Plus, CheckSquare, SearchX } from 'lucide-react';

interface TasksPageProps {
  tasks: Task[];
  onAddTask: (data: {
    title: string;
    subject: Subject;
    description?: string;
    deadline: string;
    priority: Priority;
    estimatedMinutes: number;
  }) => void;
  onUpdateTask: (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isAddModalOpen: boolean;
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
}

const ALL_SUBJECTS: Subject[] = [
  'CSCI 310: Programming Languages',
  'CSCI 220: Data Structures',
  'CSCI 340: Database Systems',
  'CSCI 370: Web Technologies',
  'MATH 201: Discrete Mathematics',
  'General Study',
];

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  isAddModalOpen,
  onOpenAddModal,
  onCloseAddModal,
}) => {
  const [filters, setFilters] = useState<TaskFilterCriteria>({
    searchQuery: '',
    subject: 'all',
    priority: 'all',
    status: 'all',
    sortBy: 'deadline',
    sortOrder: 'asc',
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Pure Functional Pipeline: Filter -> Sort
  const filtered = filterTasks(tasks, filters);
  const sortedAndFiltered = sortTasks(filtered, filters.sortBy, filters.sortOrder);

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Study Tasks</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              {tasks.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completedCount} completed ({tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%) • Filtered with pure FP pipelines
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Filter Pipeline Controls */}
      <TaskFilters
        filters={filters}
        onFilterChange={setFilters}
        subjects={ALL_SUBJECTS}
      />

      {/* Task List */}
      {sortedAndFiltered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white/40 dark:bg-slate-900/40">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
            {filters.searchQuery ? (
              <SearchX className="w-6 h-6" />
            ) : (
              <CheckSquare className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {filters.searchQuery ? 'No matching tasks found' : 'No tasks in this category'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {filters.searchQuery
              ? `No assignments matched "${filters.searchQuery}". Try adjusting your keywords or clearing the filter.`
              : 'Add your first task to start planning your academic goals.'}
          </p>
          {filters.searchQuery && (
            <button
              onClick={() =>
                setFilters({
                  ...filters,
                  searchQuery: '',
                  subject: 'all',
                  priority: 'all',
                  status: 'all',
                })
              }
              className="mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedAndFiltered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={(t) => setEditingTask(t)}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onSave={onAddTask}
      />

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onSave={(data) => {
            onUpdateTask(editingTask.id, data);
            setEditingTask(null);
          }}
          initialTask={editingTask}
        />
      )}
    </div>
  );
};
