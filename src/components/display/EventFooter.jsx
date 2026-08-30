import React from 'react';
import { MapPin, Calendar, Clock, Cpu, Lightbulb, FileCode, Rocket } from 'lucide-react';

const pillarIcons = {
  BUILD: Cpu,
  INNOVATE: Lightbulb,
  CREATE: FileCode,
  DEPLOY: Rocket
};

const EventFooter = ({ eventInfo, isCompact = false }) => {
  const pillars = eventInfo?.pillars || ['BUILD', 'INNOVATE', 'CREATE', 'DEPLOY'];

  return (
    <div className={`w-full flex flex-col items-center justify-center z-10 transition-all duration-500 ${
      isCompact ? 'py-1 gap-2' : 'pt-2 pb-6 gap-3'
    }`}>
      {/* Restored Core Pillars Bar (BUILD | INNOVATE | CREATE | DEPLOY) */}
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap text-xs md:text-sm font-bold tracking-widest text-purple-200 uppercase">
        {pillars.map((pillar, idx) => {
          const IconComp = pillarIcons[pillar.toUpperCase()] || Cpu;
          return (
            <React.Fragment key={pillar}>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <IconComp className="w-3.5 h-3.5 text-purple-400" />
                <span>{pillar}</span>
              </div>
              {idx < pillars.length - 1 && (
                <div className="h-4 w-[1px] bg-purple-500/40 hidden sm:block"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Location, Date, Time Information Bar */}
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap text-xs md:text-sm text-gray-200 font-medium bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-purple-900/60 text-purple-300">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-wider uppercase font-semibold text-white">
            {eventInfo?.venue || 'NETHAJI AUDITORIUM, VIT CHENNAI'}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-purple-500/40"></div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-purple-900/60 text-purple-300">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-wider font-mono text-purple-200">
            {eventInfo?.date || '01.09.2026'}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-purple-500/40"></div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-purple-900/60 text-purple-300">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-wider font-mono text-purple-200">
            {eventInfo?.timeRange || '8 AM - 8 AM'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventFooter;
