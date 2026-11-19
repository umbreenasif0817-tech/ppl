import React, { useState } from 'react';
import { Interpreter } from '../../core/Interpreter';
import { InterpreterResult } from '../../types/interpreter';
import { Play, Sparkles, Terminal, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InterpreterConsoleProps {
  initialCommand?: string;
}

export const InterpreterConsole: React.FC<InterpreterConsoleProps> = ({ initialCommand }) => {
  const [input, setInput] = useState(initialCommand || 'STUDY_HOURS 120 60 30');
  const [result, setResult] = useState<InterpreterResult | null>(() => Interpreter.execute('STUDY_HOURS 120 60 30'));
  const [history, setHistory] = useState<InterpreterResult[]>(() => [
    Interpreter.execute('STUDY_HOURS 120 60 30'),
    Interpreter.execute('PROGRESS 8 10'),
    Interpreter.execute('ADD 10 20'),
  ]);
  const [activeTab, setActiveTab] = useState<'output' | 'tokens' | 'ast' | 'history'>('output');

  const executeCommand = (cmdText: string) => {
    const res = Interpreter.execute(cmdText);
    setResult(res);
    setHistory((prev) => [res, ...prev.slice(0, 19)]); // Keep last 20 entries
  };

  const handleRun = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
  };

  const sampleChips = [
    'ADD 10 20',
    'SUB 20 5',
    'MUL 4 5',
    'DIV 20 4',
    'STUDY_HOURS 120 60 30',
    'PROGRESS 8 10',
    'AVERAGE(80, 70, 90)',
    'PASS(65)',
    'ELIGIBLE(45, TRUE)',
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Console Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              CSCI 310 Mini-Language REPL
            </h3>
            <p className="text-[11px] text-slate-400">
              Manual Tokenizer & Recursive-Descent Parser Engine (Zero eval)
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('output')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'output'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Output
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'tokens'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tokens ({result?.tokens.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('ast')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ast'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AST Tree
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            History ({history.length})
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-medium flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" /> Presets:
        </span>
        {sampleChips.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setInput(chip);
              executeCommand(chip);
            }}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-200/50 dark:border-slate-700/50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Command Input Bar */}
      <form onSubmit={handleRun} className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-indigo-500 select-none">
              &gt;
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command (e.g. STUDY_HOURS 120 60 30 or PROGRESS 8 10)..."
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Evaluate</span>
          </button>
        </div>
      </form>

      {/* Tab Panels */}
      <div className="p-6 min-h-[220px]">
        {/* Output Tab */}
        {activeTab === 'output' && (
          <div>
            {result ? (
              result.success ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Evaluated Result:
                        </span>
                        <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-0.5">
                          {result.formattedOutput}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[11px] text-emerald-700 dark:text-emerald-400 space-y-0.5">
                      <div>Execution: {result.executionTimeMs} ms</div>
                      <div>Command: {result.commandName}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-400 font-medium">Input Query:</span>
                      <p className="font-mono text-slate-800 dark:text-slate-200 mt-1 font-semibold">
                        {result.input}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-400 font-medium">Raw Return Value:</span>
                      <p className="font-mono text-slate-800 dark:text-slate-200 mt-1 font-semibold">
                        {String(result.output)} ({typeof result.output})
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                      Interpreter Error
                    </span>
                    <p className="text-sm font-mono text-rose-900 dark:text-rose-200 mt-1">
                      {result.error}
                    </p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                      Check command syntax in the cheat sheet below or click one of the preset chips above.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs">
                <Terminal className="w-8 h-8 mb-2 opacity-50" />
                <span>Enter an expression to begin evaluation.</span>
              </div>
            )}
          </div>
        )}

        {/* Tokens Tab */}
        {activeTab === 'tokens' && (
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Sequential token stream generated by the lexical analyzer:
            </div>
            {result?.tokens && result.tokens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.tokens.map((token, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-mono text-xs"
                  >
                    <span className="text-[10px] text-indigo-500 font-semibold">{token.type}</span>
                    <span className="text-slate-900 dark:text-white font-bold mt-0.5">
                      "{token.value}"
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1">pos: {token.position}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No tokens recorded.</p>
            )}
          </div>
        )}

        {/* AST Tab */}
        {activeTab === 'ast' && (
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Abstract Syntax Tree generated by the parser:
            </div>
            {result?.ast ? (
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                {JSON.stringify(result.ast, null, 2)}
              </pre>
            ) : (
              <p className="text-xs text-slate-400">No AST available for invalid input.</p>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Past evaluations in this session:</span>
              <button
                onClick={() => setHistory([])}
                className="text-rose-500 hover:underline inline-flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear History
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400">History is empty.</p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setInput(h.input);
                    setResult(h);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-400 cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">&gt;</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                      {h.input}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-bold ${
                        h.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                      }`}
                    >
                      {h.success ? `→ ${h.formattedOutput}` : 'Error'}
                    </span>
                    <span className="text-[10px] text-slate-400">{h.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
