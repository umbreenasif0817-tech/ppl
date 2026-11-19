import React from 'react';
import { StudySession } from '../../types/task';
import { SUBJECT_COLORS } from '../../utils/fp';
import { Clock, Plus, Trash2, Calendar, FileText } from 'lucide-react';

interface TimetableGridProps {
  sessions: StudySession[];
  onDeleteSession: (id: string) => void;
  onOpenScheduleModal: () => void;
}

const DAYS_ORDER = [
  { index: 1, name: 'Monday', short: 'Mon' },
  { index: 2, name: 'Tuesday', short: 'Tue' },
  { index: 3, name: 'Wednesday', short: 'Wed' },
  { index: 4, name: 'Thursday', short: 'Thu' },
  { index: 5, name: 'Friday', short: 'Fri' },
  { index: 6, name: 'Saturday', short: 'Sat' },
  { index: 0, name: 'Sunday', short: 'Sun' },
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  sessions,
  onDeleteSession,
  onOpenScheduleModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Weekly Study Schedule
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Planned sessions across the week with automated collision avoidance
          </p>
        </div>

        <button
          onClick={onOpenScheduleModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* 7-Day Responsive Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_ORDER.map((day) => {
          const daySessions = sessions
            .filter((s) => s.dayOfWeek === day.index)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const totalHours = (
            daySessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60
          ).toFixed(1);

          return (
            <div
              key={day.index}
              className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm min-h-[300px]"
            >
              {/* Day Header */}
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    {day.name}
                  </span>
                  <p className="text-[10px] text-slate-400">{day.short}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold">
                  {totalHours}h
                </span>
              </div>

              {/* Sessions container */}
              <div className="p-3 flex-1 space-y-2.5">
                {daySessions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <Calendar className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1" />
                    <span className="text-[11px] text-slate-400">No sessions</span>
                  </div>
                ) : (
                  daySessions.map((session) => {
                    const color = SUBJECT_COLORS[session.subject] || '#6366f1';
                    return (
                      <div
                        key={session.id}
                        className="group relative rounded-xl p-3 border transition-all duration-150 hover:shadow-md"
                        style={{
                          backgroundColor: `${color}0d`,
                          borderColor: `${color}35`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: color }}
                            title={session.taskTitle}
                          >
                            {session.taskTitle}
                          </p>

                          <button
                            onClick={() => onDeleteSession(session.id)}
                            title="Delete Session"
                            className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subject subtitle */}
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {session.subject.split(':')[0]}
                        </p>

                        {/* Time interval */}
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {session.startTime} - {session.endTime}
                          </span>
                          <span className="text-slate-400">({session.durationMinutes}m)</span>
                        </div>

                        {session.notes && (
                          <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-start gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                            <FileText className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span className="italic line-clamp-2">{session.notes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
