import React from 'react';
import { Interpreter } from '../../core/Interpreter';
import { Play, HelpCircle } from 'lucide-react';

interface CommandCheatSheetProps {
  onSelectCommand: (example: string) => void;
}

export const CommandCheatSheet: React.FC<CommandCheatSheetProps> = ({ onSelectCommand }) => {
  const docs = Interpreter.getCommandDocs();

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-500" />
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Mini-Language Syntax Reference
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any example to load it into the interpreter terminal
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Command</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Syntax & Description</th>
              <th className="py-2.5 px-3 text-right">Try Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {docs.map((doc) => (
              <tr
                key={doc.name}
                className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {doc.name}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    {doc.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-slate-800 dark:text-slate-200">{doc.syntax}</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">{doc.description}</div>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectCommand(doc.example)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{doc.example}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
