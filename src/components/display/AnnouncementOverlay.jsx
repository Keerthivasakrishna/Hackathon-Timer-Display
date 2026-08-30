import React from 'react';
import { BellRing, AlertCircle, Info, Megaphone } from 'lucide-react';

const priorityStyles = {
  info: 'bg-purple-950/95 border-purple-500 text-purple-100 shadow-[0_0_40px_rgba(168,85,247,0.5)]',
  important: 'bg-amber-950/95 border-amber-500 text-amber-100 shadow-[0_0_40px_rgba(245,158,11,0.6)]',
  urgent: 'bg-red-950/95 border-red-500 text-red-100 animate-pulse-red shadow-[0_0_50px_rgba(239,68,68,0.8)]'
};

const priorityIcons = {
  info: Info,
  important: AlertCircle,
  urgent: BellRing
};

const AnnouncementOverlay = ({ announcement, isSpotlight = false }) => {
  if (!announcement || !announcement.active) return null;

  const IconComp = priorityIcons[announcement.priority] || Megaphone;

  return (
    <div className={`w-full flex flex-col items-center justify-center transition-all duration-500 ${
      isSpotlight ? 'h-full p-4' : 'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl'
    }`}>
      <div
        className={`bg-black/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border flex flex-col items-center text-center max-w-lg w-full animate-in fade-in zoom-in-95 duration-300 ${
          priorityStyles[announcement.priority] || priorityStyles.info
        }`}
      >
        {/* Animated Icon Badge */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/20 mb-4 shadow-lg">
          <IconComp className="w-8 h-8 md:w-10 md:h-10 animate-bounce text-purple-300" />
        </div>

        {/* Priority Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/30 text-xs font-black tracking-widest uppercase mb-3">
          <span>ANNOUNCEMENT</span>
          <span className="opacity-60">•</span>
          <span className="uppercase">{announcement.priority}</span>
        </div>

        {/* Announcement Title */}
        <h2 className="font-orbitron font-extrabold text-xl md:text-2xl tracking-wider uppercase mb-3 text-white">
          {announcement.title}
        </h2>

        {/* Message Content */}
        <p className="text-base md:text-lg font-medium text-white/95 leading-relaxed bg-black/30 p-4 rounded-2xl border border-white/10 w-full">
          {announcement.message}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementOverlay;
