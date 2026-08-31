import React from 'react';
import { useTimer } from '../../context/TimerContext';
import TimerController from './TimerController';
import TimerSetter from './TimerSetter';
import EventInfoEditor from './EventInfoEditor';
import AnnouncementManager from './AnnouncementManager';
import QRCodeManager from './QRCodeManager';
import DisplaySettings from './DisplaySettings';
import { LayoutDashboard, Radio } from 'lucide-react';

const formatTwoDigits = (num) => String(Math.max(0, num)).padStart(2, '0');

const ControlPanel = () => {
  const { timer, eventInfo, syncStateNow } = useTimer();

  // Control Panel asserts its state as the Single Source of Truth to the cloud on mount
  React.useEffect(() => {
    if (syncStateNow) syncStateNow();
  }, []);

  const hours = Math.floor(timer.remainingSeconds / 3600);
  const minutes = Math.floor((timer.remainingSeconds % 3600) / 60);
  const seconds = timer.remainingSeconds % 60;

  return (
    <div className="min-h-screen w-full bg-[#06030e] text-white p-4 md:p-8 flex flex-col gap-8 select-none">
      {/* Top Admin Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded bg-purple-900/60 text-purple-300">
                ORGANIZER CONTROL CENTER
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>REALTIME CLOUD SYNC ACTIVE</span>
              </div>
            </div>
            <h1 className="font-orbitron font-black text-2xl md:text-3xl tracking-wider text-white uppercase mt-1">
              {eventInfo?.title || 'HACKTRONICS'} CONTROL PANEL
            </h1>
          </div>
        </div>

        {/* Live Timer Preview Bar */}
        <div className="flex items-center gap-4 bg-black/60 border border-purple-500/40 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">
              LIVE TIMER READOUT
            </span>
            <span className="font-orbitron font-black text-2xl md:text-3xl text-purple-200 glow-purple">
              {formatTwoDigits(hours)}:{formatTwoDigits(minutes)}:{formatTwoDigits(seconds)}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-purple-500/30"></div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">STATUS</span>
            <span className="font-bold text-xs uppercase text-purple-400 font-mono">
              {timer.status}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout for Control Cards */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl w-full mx-auto">
        {/* Left Column: Timer Controls, Setter, and Settings */}
        <div className="flex flex-col gap-6">
          <TimerController />
          <TimerSetter />
          <DisplaySettings />
        </div>

        {/* Right Column: Event Details, Announcements, and QR Manager */}
        <div className="flex flex-col gap-6">
          <EventInfoEditor />
          <AnnouncementManager />
          <QRCodeManager />
        </div>
      </main>
    </div>
  );
};

export default ControlPanel;
