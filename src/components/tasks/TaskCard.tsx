import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge, SubjectBadge } from '../common/Badge';
import { CheckCircle2, Circle, Clock, Edit2, Trash2, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isPastDue = !task.completed && new Date(task.deadline).getTime() < new Date().setHours(0,0,0,0);

  return (
    <div
      className={`group rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 p-5 shadow-sm hover:shadow-md ${
        task.completed
          ? 'border-slate-200/60 dark:border-slate-800/60 opacity-80 bg-slate-50/50 dark:bg-slate-900/40'
          : isPastDue
          ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox and Title */}
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 flex-shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/40" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0">
            <h4
              className={`text-base font-semibold text-slate-900 dark:text-white transition-all ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Badges & Meta info */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <SubjectBadge subject={task.subject} size="sm" />
          <PriorityBadge priority={task.priority} size="sm" />
        </div>

        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{task.estimatedMinutes} mins</span>
          </div>

          <div
            className={`flex items-center gap-1.5 font-medium ${
              isPastDue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{task.deadline}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
