import React, { useState, useEffect } from 'react';
import { TimerProvider } from './context/TimerContext';
import AuditoriumDisplay from './components/display/AuditoriumDisplay';
import ControlPanel from './components/control/ControlPanel';
import PanelLoginForm from './components/control/PanelLoginForm';
import Navbar from './components/shared/Navbar';
import { checkAuthStatus, logoutUser } from './utils/auth';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthStatus());

  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.includes('panel') || path.includes('admin') || path.includes('control') || search.includes('view=control')) {
      return 'control';
    }
    return 'display';
  });

  // Keep state in sync with URL location
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path.includes('panel') || path.includes('admin') || path.includes('control') || search.includes('view=control')) {
        setCurrentView('control');
      } else {
        setCurrentView('display');
      }
      setIsAuthenticated(checkAuthStatus());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // View navigation helper that updates address bar cleanly
  const navigateToView = (targetView) => {
    if (targetView === 'control') {
      if (window.location.pathname !== '/panel') {
        window.history.pushState(null, '', '/panel');
      }
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    }
    setCurrentView(targetView);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  // Emergency keyboard shortcut for organizers: Ctrl + Shift + A switches between Display and Control Panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        const nextView = currentView === 'display' ? 'control' : 'display';
        navigateToView(nextView);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-black text-white select-none">
      {/* Navbar is shown when on Control Panel view and authenticated */}
      {currentView === 'control' && isAuthenticated && (
        <Navbar
          currentView={currentView}
          setCurrentView={navigateToView}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Area */}
      <main className="w-full h-full">
        {currentView === 'display' ? (
          <AuditoriumDisplay />
        ) : isAuthenticated ? (
          <div className="pt-14">
            <ControlPanel />
          </div>
        ) : (
          <PanelLoginForm
            onLoginSuccess={handleLoginSuccess}
            onReturnToDisplay={() => navigateToView('display')}
          />
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
