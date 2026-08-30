import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { Play, Pause, RotateCcw, Square, Plus, Minus, Clock } from 'lucide-react';

const TimerController = () => {
  const {
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer,
    addTimeSeconds
  } = useTimer();

  const isRunning = timer.status === 'running';
  const isPaused = timer.status === 'paused';

  return (
    <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 flex flex-col gap-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-orbitron font-bold text-white tracking-wider">
            TIMER CONTROLS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-400 text-purple-300 uppercase font-mono">
            {timer.status}
          </span>
        </div>
      </div>

      {/* Main Execution Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {!isRunning ? (
          <button
            onClick={isPaused ? resumeTimer : startTimer}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isPaused ? 'RESUME' : 'START'}</span>
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform active:scale-95 cursor-pointer"
          >
            <Pause className="w-5 h-5 fill-current" />
            <span>PAUSE</span>
          </button>
        )}

        <button
          onClick={resetTimer}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 font-bold text-sm tracking-wider uppercase transition-all transform active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET</span>
        </button>

        <button
          onClick={stopTimer}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-300 font-bold text-sm tracking-wider uppercase transition-all transform active:scale-95 cursor-pointer col-span-2 sm:col-span-2"
        >
          <Square className="w-4 h-4 fill-current" />
          <span>STOP TIMER</span>
        </button>
      </div>

      {/* Quick Add / Subtract Time Controls */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-wider text-purple-300/80 uppercase">
          QUICK TIME ADJUSTMENTS
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button
            onClick={() => addTimeSeconds(3600)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> 1 Hour
          </button>
          <button
            onClick={() => addTimeSeconds(1800)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> 30 Min
          </button>
          <button
            onClick={() => addTimeSeconds(900)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> 15 Min
          </button>
          <button
            onClick={() => addTimeSeconds(-300)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> 5 Min
          </button>
          <button
            onClick={() => addTimeSeconds(-900)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> 15 Min
          </button>
          <button
            onClick={() => addTimeSeconds(-3600)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> 1 Hour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerController;
