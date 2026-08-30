import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { Settings, Sparkles, Image, Volume2, VolumeX, ExternalLink, Maximize, Gauge } from 'lucide-react';
import { playMilestoneChime, playWarningBeep, playCompletionAlarm } from '../../utils/audioSynth';

const DisplaySettings = () => {
  const { settings, updateSettings } = useTimer();

  const currentMode = settings?.bgMode || 'galaxy-animated';
  const animationSpeed = settings?.animationSpeed ?? 1.0;

  const handleBgChange = (mode) => {
    updateSettings({ bgMode: mode });
  };

  const handleSpeedChange = (speed) => {
    updateSettings({ animationSpeed: parseFloat(speed) });
  };

  const handleAudioToggle = () => {
    updateSettings({ audioEnabled: !settings.audioEnabled });
  };

  const openDisplayWindow = () => {
    window.open('/', '_blank', 'width=1920,height=1080');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 flex flex-col gap-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
        <Settings className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-orbitron font-bold text-white tracking-wider">
          DISPLAY & AUDIO CONFIG
        </h2>
      </div>

      {/* Background Mode Switcher */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold tracking-wider text-purple-300/80 uppercase">
          BACKGROUND MODE SWITCHER
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleBgChange('galaxy-animated')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-center transition-all cursor-pointer ${
              currentMode === 'galaxy-animated' || currentMode === 'video'
                ? 'bg-purple-950/80 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <Sparkles className={`w-6 h-6 ${currentMode === 'galaxy-animated' || currentMode === 'video' ? 'text-purple-400 animate-pulse' : ''}`} />
            <span className="font-bold text-xs">ANIMATED GALAXY</span>
            <span className="text-[10px] text-gray-400">Twinkling Stars & Cosmic Light Sweeps</span>
          </button>

          <button
            onClick={() => handleBgChange('galaxy-static')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-center transition-all cursor-pointer ${
              currentMode === 'galaxy-static' || currentMode === 'poster' || currentMode === 'galaxy'
                ? 'bg-purple-950/80 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <Image className={`w-6 h-6 ${currentMode === 'galaxy-static' ? 'text-purple-400' : ''}`} />
            <span className="font-bold text-xs">STATIC GALAXY</span>
            <span className="text-[10px] text-gray-400">Pure Cosmic Space Nebula Background</span>
          </button>
        </div>
      </div>

      {/* Animation Speed Control Slider (Visible when Animated Galaxy is selected) */}
      {(currentMode === 'galaxy-animated' || currentMode === 'video') && (
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-purple-300 uppercase">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span>ANIMATION SPEED MULTIPLIER</span>
            </div>
            <span className="font-mono text-sm font-bold text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/40">
              {animationSpeed.toFixed(1)}x
            </span>
          </div>

          {/* Range Slider Bar */}
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => handleSpeedChange(e.target.value)}
            className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          {/* Quick Speed Preset Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleSpeedChange(0.3)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                animationSpeed === 0.3
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-black/40 border-purple-500/20 text-purple-300 hover:bg-purple-950'
              }`}
            >
              0.3x (Slow & Ambient)
            </button>

            <button
              onClick={() => handleSpeedChange(1.0)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                animationSpeed === 1.0
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-black/40 border-purple-500/20 text-purple-300 hover:bg-purple-950'
              }`}
            >
              1.0x (Normal)
            </button>

            <button
              onClick={() => handleSpeedChange(2.0)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                animationSpeed === 2.0
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-black/40 border-purple-500/20 text-purple-300 hover:bg-purple-950'
              }`}
            >
              2.0x (Dynamic)
            </button>
          </div>
        </div>
      )}

      {/* Audio Controls */}
      <div className="flex flex-col gap-3 pt-3 border-t border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.audioEnabled ? (
              <Volume2 className="w-5 h-5 text-purple-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-500" />
            )}
            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">
              AUDIO ALERTS ({settings.audioEnabled ? 'ENABLED' : 'MUTED'})
            </span>
          </div>

          <button
            onClick={handleAudioToggle}
            className={`py-1.5 px-4 rounded-lg font-bold text-xs tracking-wider uppercase transition-all cursor-pointer border ${
              settings.audioEnabled
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400'
            }`}
          >
            {settings.audioEnabled ? 'MUTE SOUND' : 'ENABLE SOUND'}
          </button>
        </div>

        {settings.audioEnabled && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-gray-400">TEST AUDIO:</span>
            <button
              onClick={playMilestoneChime}
              className="py-1 px-3 rounded bg-purple-950 border border-purple-500/30 text-purple-300 text-[11px] hover:bg-purple-900 transition-all cursor-pointer"
            >
              Milestone Chime
            </button>
            <button
              onClick={playWarningBeep}
              className="py-1 px-3 rounded bg-amber-950 border border-amber-500/30 text-amber-300 text-[11px] hover:bg-amber-900 transition-all cursor-pointer"
            >
              Warning Beep
            </button>
            <button
              onClick={playCompletionAlarm}
              className="py-1 px-3 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[11px] hover:bg-cyan-900 transition-all cursor-pointer"
            >
              Completion Fanfare
            </button>
          </div>
        )}
      </div>

      {/* Broadcast Window Controls */}
      <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-purple-500/20">
        <button
          onClick={openDisplayWindow}
          className="flex-1 py-3 px-4 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <ExternalLink className="w-4 h-4" />
          <span>OPEN DISPLAY IN SECONDARY WINDOW</span>
        </button>

        <button
          onClick={toggleFullscreen}
          className="py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Maximize className="w-4 h-4" />
          <span>FULLSCREEN</span>
        </button>
      </div>
    </div>
  );
};

export default DisplaySettings;
