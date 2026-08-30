import React from 'react';
import { Pause, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const formatTwoDigits = (num) => String(Math.max(0, num)).padStart(2, '0');

const CountdownTimer = ({ timer, isCompact = false }) => {
  const { remainingSeconds = 0, status = 'stopped', overtimeSeconds = 0 } = timer || {};

  // Calculate hours, minutes, seconds
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const isCritical = remainingSeconds > 0 && remainingSeconds <= 3600;
  const isCompleted = status === 'completed' || remainingSeconds === 0;

  // Status badge
  const renderStatusBadge = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          <CheckCircle2 className="w-4 h-4 animate-bounce" />
          <span>HACKATHON COMPLETED</span>
        </div>
      );
    }
    if (isCritical && status === 'running') {
      return (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/90 border border-red-500 text-red-400 font-bold text-xs tracking-widest uppercase animate-pulse-red">
          <AlertTriangle className="w-4 h-4" />
          <span>CRITICAL: FINAL HOUR</span>
        </div>
      );
    }
    if (status === 'running') {
      return (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-400 text-purple-300 font-bold text-xs tracking-widest uppercase animate-pulse-glow">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
          <span>TIME REMAINING</span>
        </div>
      );
    }
    if (status === 'paused') {
      return (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)]">
          <Pause className="w-4 h-4" />
          <span>TIMER PAUSED</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-600 text-gray-300 font-bold text-xs tracking-widest uppercase">
        <Clock className="w-4 h-4" />
        <span>STANDBY</span>
      </div>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center w-full mx-auto px-4 transition-all duration-500 ${
      isCompact ? 'max-w-xl' : 'max-w-4xl'
    }`}>
      {/* Top Status Badge */}
      <div className="mb-3 z-10">{renderStatusBadge()}</div>

      {/* Main Digital Timer Container (Progress Bar Removed per User Request) */}
      <div className={`relative w-full rounded-3xl flex flex-col items-center justify-center border transition-all duration-500 ${
        isCompact ? 'p-4 md:p-6' : 'p-6 md:p-8'
      } ${
        isCritical 
          ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]' 
          : 'bg-purple-950/30 border-purple-500/40 shadow-[0_0_45px_rgba(168,85,247,0.25)]'
      } backdrop-blur-md`}>
        
        {/* Dynamic Digital Digit Blocks */}
        <div className={`flex items-center justify-center ${isCompact ? 'gap-2 md:gap-3' : 'gap-3 md:gap-8'} my-2`}>
          {/* Hours Block */}
          <div className="flex flex-col items-center">
            <div className={`relative bg-black/70 border border-purple-500/40 rounded-2xl shadow-inner text-center flex items-center justify-center ${
              isCompact 
                ? 'px-3 py-2 md:px-5 md:py-3 min-w-[70px] md:min-w-[110px]' 
                : 'px-5 py-3 md:px-8 md:py-6 min-w-[100px] md:min-w-[170px]'
            }`}>
              <span className={`font-orbitron font-black tracking-tight leading-none ${
                isCompact ? 'text-3xl md:text-5xl' : 'text-5xl sm:text-7xl md:text-8xl'
              } ${isCritical ? 'text-red-400 glow-red' : 'text-white glow-purple'}`}>
                {formatTwoDigits(hours)}
              </span>
            </div>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-purple-300/70 mt-3 uppercase">
              HOURS
            </span>
          </div>

          {/* Separator Colon */}
          <div className="flex flex-col justify-center pb-6">
            <span className={`font-orbitron font-black ${
              isCompact ? 'text-2xl md:text-4xl' : 'text-4xl sm:text-6xl md:text-7xl'
            } ${status === 'running' ? 'animate-pulse text-purple-400' : 'text-purple-600'}`}>
              :
            </span>
          </div>

          {/* Minutes Block */}
          <div className="flex flex-col items-center">
            <div className={`relative bg-black/70 border border-purple-500/40 rounded-2xl shadow-inner text-center flex items-center justify-center ${
              isCompact 
                ? 'px-3 py-2 md:px-5 md:py-3 min-w-[70px] md:min-w-[110px]' 
                : 'px-5 py-3 md:px-8 md:py-6 min-w-[100px] md:min-w-[170px]'
            }`}>
              <span className={`font-orbitron font-black tracking-tight leading-none ${
                isCompact ? 'text-3xl md:text-5xl' : 'text-5xl sm:text-7xl md:text-8xl'
              } ${isCritical ? 'text-red-400 glow-red' : 'text-white glow-purple'}`}>
                {formatTwoDigits(minutes)}
              </span>
            </div>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-purple-300/70 mt-3 uppercase">
              MINUTES
            </span>
          </div>

          {/* Separator Colon */}
          <div className="flex flex-col justify-center pb-6">
            <span className={`font-orbitron font-black ${
              isCompact ? 'text-2xl md:text-4xl' : 'text-4xl sm:text-6xl md:text-7xl'
            } ${status === 'running' ? 'animate-pulse text-purple-400' : 'text-purple-600'}`}>
              :
            </span>
          </div>

          {/* Seconds Block */}
          <div className="flex flex-col items-center">
            <div className={`relative bg-black/70 border border-purple-500/40 rounded-2xl shadow-inner text-center flex items-center justify-center ${
              isCompact 
                ? 'px-3 py-2 md:px-5 md:py-3 min-w-[70px] md:min-w-[110px]' 
                : 'px-5 py-3 md:px-8 md:py-6 min-w-[100px] md:min-w-[170px]'
            }`}>
              <span className={`font-orbitron font-black tracking-tight leading-none ${
                isCompact ? 'text-3xl md:text-5xl' : 'text-5xl sm:text-7xl md:text-8xl'
              } ${isCritical ? 'text-red-400 glow-red' : 'text-purple-200 glow-purple'}`}>
                {formatTwoDigits(seconds)}
              </span>
            </div>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-purple-300/70 mt-3 uppercase">
              SECONDS
            </span>
          </div>
        </div>

        {/* Overtime Notice */}
        {status === 'completed' && overtimeSeconds > 0 && (
          <div className="mt-2 text-xs md:text-sm font-mono text-cyan-300 tracking-wider">
            OVERTIME ELAPSED: +{formatTwoDigits(Math.floor(overtimeSeconds / 60))}:{formatTwoDigits(overtimeSeconds % 60)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
