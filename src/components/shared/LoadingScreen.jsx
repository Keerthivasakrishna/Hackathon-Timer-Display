import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Radio, ShieldCheck } from 'lucide-react';

const CRITICAL_ASSETS = [
  '/assets/static/galaxy-background.png',
  '/assets/static/hacktronics-logo.png',
  '/assets/static/logo-vit.png',
  '/assets/static/logo-photonics.png',
  '/assets/static/logo-sscs.png',
  '/assets/static/logo-vts.png'
];

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('PRELOADING STAGE GRAPHICS...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = CRITICAL_ASSETS.length;

    const updateProgress = (loadedIndex) => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / totalAssets) * 100));
      setProgress(pct);

      if (pct < 40) {
        setStatusText('PRELOADING NEBULA & GRAPHICS...');
      } else if (pct < 75) {
        setStatusText('CONNECTING REALTIME CLOUD SYNC...');
      } else if (pct < 100) {
        setStatusText('FINALIZING AUDITORIUM STAGE DISPLAY...');
      } else {
        setStatusText('STAGE DISPLAY READY');
      }
    };

    // Preload each asset to guarantee background image is 100% in browser cache before displaying home screen
    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress;
      img.src = src;
    });

    // Fallback timer safety (max 3 seconds)
    const timeout = setTimeout(() => {
      setProgress(100);
      setStatusText('STAGE DISPLAY READY');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 500); // 500ms smooth fade-out transition
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [progress, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04020a] text-white select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Space Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[110px]"></div>
      </div>

      {/* Cyber Square Geometric Container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-10 max-w-md w-full mx-4 rounded-3xl bg-black/75 backdrop-blur-2xl border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.25)] text-center">
        {/* Corner Cyber Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-purple-400"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-purple-400"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-400"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-purple-400"></div>

        {/* Square Tech Rotating Loader Icon */}
        <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
          {/* Outer Rotating Square */}
          <div className="absolute inset-0 border-2 border-purple-500/30 rounded-xl animate-spin" style={{ animationDuration: '6s' }}></div>
          {/* Counter Rotating Inner Square */}
          <div className="absolute inset-2 border-2 border-purple-400/80 rounded-lg animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
          <Cpu className="w-6 h-6 text-purple-300 animate-pulse" />
        </div>

        {/* Hero Logo Artwork */}
        <div className="relative mb-4 flex items-center justify-center">
          <img
            src="/assets/static/hacktronics-logo.png"
            alt="HACKTRONICS 2nd Edition"
            className="w-auto h-16 sm:h-20 object-contain filter drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]"
          />
        </div>

        {/* Subtitle */}
        <div className="text-[11px] font-bold tracking-[0.25em] text-purple-300/90 uppercase mb-6 glow-purple font-mono">
          2ND EDITION • STAGE DISPLAY
        </div>

        {/* Geometric Square Progress Bar */}
        <div className="w-full bg-black/90 border border-purple-500/40 p-1 rounded-xl shadow-inner mb-3">
          <div
            className="h-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-400 to-indigo-400 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(192,132,252,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Live Status & Percentage readout */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-purple-300/80 px-1">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
            <span className="truncate text-left font-semibold">{statusText}</span>
          </div>
          <span className="font-bold text-white text-xs shrink-0 ml-2">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
