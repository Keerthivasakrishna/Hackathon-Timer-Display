import React, { useState, useEffect } from 'react';
import { TimerProvider } from './context/TimerContext';
import AuditoriumDisplay from './components/display/AuditoriumDisplay';
import ControlPanel from './components/control/ControlPanel';
import Navbar from './components/shared/Navbar';

function AppContent() {
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.includes('admin') || path.includes('control') || search.includes('view=control')) {
      return 'control';
    }
    return 'display';
  });

  // Emergency keyboard shortcut for organizers on auditorium screen: Ctrl + Shift + A switches to Control Panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        setCurrentView((prev) => (prev === 'display' ? 'control' : 'display'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-black text-white select-none">
      {/* Navbar is ONLY shown on Organizer Control Panel (/admin or /?view=control) so participants never see it */}
      {currentView === 'control' && (
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      )}

      {/* Main View Area */}
      <main className="w-full h-full">
        {currentView === 'display' ? (
          <AuditoriumDisplay />
        ) : (
          <div className="pt-14">
            <ControlPanel />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}
