import React, { useState, useEffect } from 'react';
import { Task, StudySession } from '../../types/task';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';
import { taskManagerInstance } from '../../core/TaskManager';

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSessionAdded: (session: StudySession) => void;
}

const DAYS = [
  { index: 1, name: 'Monday' },
  { index: 2, name: 'Tuesday' },
  { index: 3, name: 'Wednesday' },
  { index: 4, name: 'Thursday' },
  { index: 5, name: 'Friday' },
  { index: 6, name: 'Saturday' },
  { index: 0, name: 'Sunday' },
];

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onSessionAdded,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [collision, setCollision] = useState<StudySession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set default task when modal opens
  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks, selectedTaskId]);

  // Real-time OOP collision detection when day, start, or end changes
  useEffect(() => {
    try {
      const conflict = taskManagerInstance.detectSessionConflict({
        dayOfWeek,
        startTime,
        endTime,
      });
      setCollision(conflict);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setCollision(null);
    }
  }, [dayOfWeek, startTime, endTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTaskId) {
      setError('Please select a study task to schedule.');
      return;
    }

    try {
      const result = taskManagerInstance.addSession({
        taskId: selectedTaskId,
        dayOfWeek,
        startTime,
        endTime,
        notes,
      });

      onSessionAdded(result.session);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Study Session">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Callout */}
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        {/* Real-time Collision Warning Callout */}
        {collision && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Schedule Conflict Detected:</span>
              <p className="mt-0.5 text-amber-700 dark:text-amber-400">
                This slot overlaps with <strong>"{collision.taskTitle}"</strong> ({collision.startTime} - {collision.endTime}). The TaskManager collision engine alerts you to avoid schedule burnout.
              </p>
            </div>
          </div>
        )}

        {/* Select Task */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Select Study Task <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.subject.split(':')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Day of Week */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Day of the Week <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {DAYS.map((d) => (
              <button
                type="button"
                key={d.index}
                onClick={() => setDayOfWeek(d.index)}
                className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                  dayOfWeek === d.index
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {d.name.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Start Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              End Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Session Goal / Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Solve 3 textbook problems; review lecture 4 slides"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
          >
            Schedule Session
          </button>
        </div>
      </form>
    </Modal>
  );
};
