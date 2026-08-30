import React from 'react';
import { Tv, LayoutDashboard, Maximize, Radio, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';

const Navbar = ({ currentView, setCurrentView }) => {
  const { settings, updateSettings } = useTimer();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const toggleAudio = () => {
    updateSettings({ audioEnabled: !settings.audioEnabled });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-purple-500/20 px-4 py-2 flex items-center justify-between transition-all duration-300 opacity-90 hover:opacity-100">
      {/* Brand & Sync Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></div>
          <span className="font-orbitron font-bold text-sm tracking-wider text-white">
            HACKATRONICS <span className="text-purple-400 text-xs font-semibold">2ND EDITION</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-300 font-mono">
          <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
          <span>CROSS-WINDOW SYNC ACTIVE</span>
        </div>
      </div>

      {/* Center View Selector Buttons */}
      <div className="flex items-center gap-1 bg-purple-950/60 p-1 rounded-xl border border-purple-500/30">
        <button
          onClick={() => setCurrentView('display')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentView === 'display'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>AUDITORIUM DISPLAY</span>
        </button>

        <button
          onClick={() => setCurrentView('control')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentView === 'control'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>ORGANIZER PANEL</span>
        </button>
      </div>

      {/* Right Quick Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Audio Toggle */}
        <button
          onClick={toggleAudio}
          title={settings.audioEnabled ? 'Mute Audio Chimes' : 'Enable Audio Chimes'}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            settings.audioEnabled
              ? 'bg-purple-950 border-purple-500/40 text-purple-300 hover:bg-purple-900'
              : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-300'
          }`}
        >
          {settings.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-900 transition-all cursor-pointer"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
