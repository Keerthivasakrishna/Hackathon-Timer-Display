import React from 'react';

const priorityStyles = {
  info: 'bg-purple-950/70 border-purple-500/50 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
  important: 'bg-amber-950/75 border-amber-500/60 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  urgent: 'bg-red-950/75 border-red-500/60 text-red-200 animate-pulse-soft shadow-[0_0_25px_rgba(239,68,68,0.35)]'
};

const AnnouncementOverlay = ({ announcement, isSpotlight = false }) => {
  if (!announcement || !announcement.active) return null;

  return (
    <div className={`w-full flex flex-col items-center justify-center transition-all duration-500 ${
      isSpotlight ? 'h-full p-4' : 'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl'
    }`}>
      <div
        className={`bg-black/75 backdrop-blur-xl rounded-3xl p-6 md:p-8 border flex flex-col items-center text-center max-w-lg w-full animate-in fade-in zoom-in-95 duration-300 ${
          priorityStyles[announcement.priority] || priorityStyles.info
        }`}
      >
        {/* Announcement Message Content ONLY (No icons, no priority tag, no title on auditorium screen) */}
        <p className="text-base md:text-xl font-semibold leading-relaxed tracking-wide text-white/95">
          {announcement.message}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementOverlay;
