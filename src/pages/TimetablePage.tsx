import React, { useState } from 'react';
import { Task, StudySession } from '../types/task';
import { TimetableGrid } from '../components/timetable/TimetableGrid';
import { ScheduleSessionModal } from '../components/timetable/ScheduleSessionModal';
import { Info } from 'lucide-react';

interface TimetablePageProps {
  tasks: Task[];
  sessions: StudySession[];
  onSessionAdded: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
}

export const TimetablePage: React.FC<TimetablePageProps> = ({
  tasks,
  sessions,
  onSessionAdded,
  onDeleteSession,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Timetable Overview Callout */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 dark:text-indigo-200">
          <span className="font-semibold">CSCI 310 Collision Detection Logic:</span>
          <p className="mt-0.5 text-indigo-900/80 dark:text-indigo-300">
            StudyFlow enforces encapsulated scheduling rules in the <code className="font-mono font-bold">TaskManager.detectSessionConflict()</code> method. Attempting to schedule an overlapping time slot on the same day will automatically flag a collision warning.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <TimetableGrid
        sessions={sessions}
        onDeleteSession={onDeleteSession}
        onOpenScheduleModal={() => setIsModalOpen(true)}
      />

      {/* Schedule Modal */}
      <ScheduleSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tasks={tasks}
        onSessionAdded={(newSess) => {
          onSessionAdded(newSess);
        }}
      />
    </div>
  );
};
