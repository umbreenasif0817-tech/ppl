import React from 'react';
import { Layers, Binary, ShieldCheck, ArrowRight } from 'lucide-react';

interface ParadigmShowcaseCardProps {
  onGoToInterpreter: () => void;
  onGoToAnalytics: () => void;
}

export const ParadigmShowcaseCard: React.FC<ParadigmShowcaseCardProps> = ({
  onGoToInterpreter,
  onGoToAnalytics,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 shadow-md border border-indigo-800/40">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-indigo-800/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            CSCI 310 Dual Programming Paradigms
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Architecture Paradigm Demonstration
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            StudyFlow demonstrates both Object-Oriented and Functional paradigms side-by-side.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Paradigm 1: OOP */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/40 transition-colors">
          <div className="flex items-center gap-2.5 text-indigo-300 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <span>1. Object-Oriented Paradigm (OOP)</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Implemented in <code className="text-indigo-300 bg-black/30 px-1 py-0.5 rounded font-mono">TaskManager</code> and <code className="text-indigo-300 bg-black/30 px-1 py-0.5 rounded font-mono">Interpreter</code> classes. Features private fields, encapsulation of timetable collision rules, custom exception hierarchy, and state synchronization.
          </p>
          <button
            onClick={onGoToInterpreter}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-white transition-colors"
          >
            Inspect Mini-Interpreter Class <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Paradigm 2: FP */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/40 transition-colors">
          <div className="flex items-center gap-2.5 text-indigo-300 font-semibold text-sm">
            <Binary className="w-4 h-4" />
            <span>2. Functional Paradigm (FP)</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Implemented in <code className="text-indigo-300 bg-black/30 px-1 py-0.5 rounded font-mono">src/utils/fp.ts</code>. Pure deterministic functions using <code className="text-indigo-300 bg-black/30 px-1 py-0.5 rounded font-mono">map()</code>, <code className="text-indigo-300 bg-black/30 px-1 py-0.5 rounded font-mono">filter()</code>, and <code className="text-indigo-300 bg-black/30 px-1 py-0.5 rounded font-mono">reduce()</code> for analytics, searching, sorting, and progress rates without side effects.
          </p>
          <button
            onClick={onGoToAnalytics}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-white transition-colors"
          >
            Inspect Functional Analytics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
