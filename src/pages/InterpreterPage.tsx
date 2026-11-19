import React, { useState } from 'react';
import { InterpreterConsole } from '../components/interpreter/InterpreterConsole';
import { CommandCheatSheet } from '../components/interpreter/CommandCheatSheet';
import { Terminal, ShieldCheck, Layers } from 'lucide-react';

export const InterpreterPage: React.FC = () => {
  const [selectedCommand, setSelectedCommand] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Terminal className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              CSCI 310 Mini-Interpreter Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            This interpreter executes study and grading expressions using a custom, handcrafted lexer, parser, and semantic evaluator written in TypeScript OOP classes. It does not use <code className="font-mono text-rose-500">eval()</code> or <code className="font-mono text-rose-500">Function()</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero eval()</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>OOP Architecture</span>
          </span>
        </div>
      </div>

      {/* REPL Console */}
      <InterpreterConsole key={selectedCommand} initialCommand={selectedCommand} />

      {/* Syntax Cheat Sheet */}
      <CommandCheatSheet onSelectCommand={(cmd) => setSelectedCommand(cmd)} />
    </div>
  );
};
