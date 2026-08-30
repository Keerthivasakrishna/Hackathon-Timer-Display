import React from 'react';

const HeaderLogos = ({ eventInfo, isCompact = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full z-10 transition-all duration-500 ${
      isCompact ? 'py-1 scale-90' : 'pt-4 pb-2'
    }`}>
      {/* Top IEEE & VIT Seamlessly Blended Logos */}
      <div className="flex items-center justify-center gap-6 md:gap-12 max-w-5xl w-full px-4 mb-2">
        {/* IEEE Photonics Logo */}
        <div className="flex items-center justify-center h-10 md:h-12">
          <img
            src="/assets/static/logo-photonics.png"
            alt="IEEE Photonics Society"
            className="h-full object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] brightness-125 contrast-125"
          />
        </div>

        <div className="h-8 w-[1px] bg-purple-500/40"></div>

        {/* VIT Chennai Main Center Logo */}
        <div className="flex items-center justify-center h-10 md:h-14">
          <img
            src="/assets/static/logo-vit.png"
            alt="VIT Chennai"
            className="h-full object-contain mix-blend-screen filter drop-shadow-[0_0_14px_rgba(255,255,255,0.9)] brightness-125 contrast-125"
          />
        </div>

        <div className="h-8 w-[1px] bg-purple-500/40"></div>

        {/* IEEE SSCS Logo */}
        <div className="flex items-center justify-center h-10 md:h-12">
          <img
            src="/assets/static/logo-sscs.png"
            alt="IEEE Solid-State Circuits Society"
            className="h-full object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] brightness-125 contrast-125"
          />
        </div>

        <div className="h-8 w-[1px] bg-purple-500/40"></div>

        {/* IEEE VTS Logo */}
        <div className="flex items-center justify-center h-10 md:h-12">
          <img
            src="/assets/static/logo-vts.png"
            alt="IEEE VTS"
            className="h-full object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] brightness-125 contrast-125"
          />
        </div>
      </div>

      {/* PRESENTS Subtitle */}
      <div className="text-[10px] md:text-xs tracking-[0.3em] font-medium text-purple-300/80 uppercase my-0.5">
        PRESENTS
      </div>

      {/* 24-HOURS HACKATHON Subtitle */}
      <div className="text-xs md:text-sm tracking-[0.25em] font-bold text-purple-200 uppercase glow-purple">
        {eventInfo?.subtitle || '24-HOURS HACKATHON'}
      </div>

      {/* Main Title HACKATRONICS */}
      <h1 className={`font-orbitron font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 glow-purple-lg uppercase transition-all duration-500 ${
        isCompact ? 'text-3xl md:text-5xl my-0.5' : 'text-5xl md:text-7xl lg:text-8xl my-1'
      }`}>
        {eventInfo?.title || 'HACKATRONICS'}
      </h1>

      {/* Edition Subtitle */}
      <div className="flex items-center gap-4 text-xs md:text-sm font-bold tracking-[0.3em] text-purple-300 uppercase">
        <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-purple-400"></div>
        <span>{eventInfo?.edition || '2ND EDITION'}</span>
        <div className="w-12 md:w-20 h-[1px] bg-gradient-to-l from-transparent to-purple-400"></div>
      </div>
    </div>
  );
};

export default HeaderLogos;
