import React from 'react';
import { Priority, Subject } from '../../types/task';
import { SUBJECT_COLORS } from '../../utils/fp';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configs: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
    low: {
      label: 'Low',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      dot: 'bg-slate-400',
    },
    medium: {
      label: 'Medium',
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
    },
    high: {
      label: 'High',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    urgent: {
      label: 'Urgent',
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500',
    },
  };

  const config = configs[priority];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

interface SubjectBadgeProps {
  subject: Subject;
  size?: 'sm' | 'md';
}

export const SubjectBadge: React.FC<SubjectBadgeProps> = ({ subject, size = 'md' }) => {
  const color = SUBJECT_COLORS[subject] || '#6366f1';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {subject.split(':')[0]}
    </span>
  );
};
