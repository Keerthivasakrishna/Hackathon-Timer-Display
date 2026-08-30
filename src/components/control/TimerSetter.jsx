import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { Edit3, Check, Zap } from 'lucide-react';

const TimerSetter = () => {
  const { timer, setTimerValue } = useTimer();

  const currentHours = Math.floor(timer.remainingSeconds / 3600);
  const currentMinutes = Math.floor((timer.remainingSeconds % 3600) / 60);
  const currentSeconds = timer.remainingSeconds % 60;

  const [inputH, setInputH] = useState(currentHours);
  const [inputM, setInputM] = useState(currentMinutes);
  const [inputS, setInputS] = useState(currentSeconds);

  const handleApplyCustom = (e) => {
    e.preventDefault();
    const h = Math.max(0, parseInt(inputH, 10) || 0);
    const m = Math.max(0, Math.min(59, parseInt(inputM, 10) || 0));
    const s = Math.max(0, Math.min(59, parseInt(inputS, 10) || 0));

    const totalSeconds = h * 3600 + m * 60 + s;
    setTimerValue(totalSeconds);
  };

  const handlePresetSelect = (totalSeconds) => {
    setTimerValue(totalSeconds);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    setInputH(h);
    setInputM(m);
    setInputS(s);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 flex flex-col gap-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
        <Edit3 className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-orbitron font-bold text-white tracking-wider">
          EDIT TIMER VALUE
        </h2>
      </div>

      {/* Manual HH:MM:SS Form Inputs */}
      <form onSubmit={handleApplyCustom} className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-purple-300 uppercase">HOURS</label>
            <input
              type="number"
              min="0"
              max="99"
              value={inputH}
              onChange={(e) => setInputH(e.target.value)}
              className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-center font-orbitron font-bold text-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-purple-300 uppercase">MINUTES</label>
            <input
              type="number"
              min="0"
              max="59"
              value={inputM}
              onChange={(e) => setInputM(e.target.value)}
              className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-center font-orbitron font-bold text-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-purple-300 uppercase">SECONDS</label>
            <input
              type="number"
              min="0"
              max="59"
              value={inputS}
              onChange={(e) => setInputS(e.target.value)}
              className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-center font-orbitron font-bold text-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          <Check className="w-4 h-4" />
          <span>SET EXACT TIME</span>
        </button>
      </form>

      {/* Quick Preset Buttons */}
      <div className="flex flex-col gap-2 pt-2 border-t border-purple-500/20">
        <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-purple-300/80 uppercase">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>EVENT PRESETS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handlePresetSelect(86400)}
            className="py-2 px-2 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            24 Hours
          </button>
          <button
            onClick={() => handlePresetSelect(43200)}
            className="py-2 px-2 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            12 Hours
          </button>
          <button
            onClick={() => handlePresetSelect(3600)}
            className="py-2 px-2 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            1 Hour
          </button>
          <button
            onClick={() => handlePresetSelect(10)}
            className="py-2 px-2 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all cursor-pointer"
          >
            10 Sec (Test)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerSetter;
