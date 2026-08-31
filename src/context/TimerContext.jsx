import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playMilestoneChime, playWarningBeep, playCompletionAlarm, playButtonSound } from '../utils/audioSynth';

import { pushStateToCloud, subscribeToCloudState, fetchInitialCloudState } from '../utils/cloudSync';

const TimerContext = createContext(null);

const SYNC_CHANNEL_NAME = 'hackatronics_display_sync_channel';
const STORAGE_KEY = 'hackatronics_display_state_v1';

const DEFAULT_EVENT_INFO = {
  title: 'HACKTRONICS',
  edition: '2ND EDITION',
  subtitle: '24-HOURS HACKATHON',
  venue: 'KAMARAJ AUDITORIUM, VIT CHENNAI',
  date: '01.09.2026',
  timeRange: '8 AM - 8 AM',
  pillars: ['BUILD', 'INNOVATE', 'CREATE', 'DEPLOY']
};

const DEFAULT_QR_CODES = [
  {
    id: 'qr-1',
    title: 'PROJECT SUBMISSION LINK',
    url: 'https://hacktronics2026.devpost.com',
    description: 'Scan to submit your final GitHub repo, project pitch, and demo video.',
    active: false
  },
  {
    id: 'qr-2',
    title: 'HACKER DISCORD COMMUNITY',
    url: 'https://discord.gg/hacktronics',
    description: 'Scan to join the official Hacker Helpdesk & Mentor Support Channel.',
    active: false
  },
  {
    id: 'qr-3',
    title: 'AUDITORIUM WI-FI & SCHEDULE',
    url: 'https://vit.ac.in/hacktronics-schedule',
    description: 'Scan to view the detailed 24-hour itinerary, meal timings, and Wi-Fi info.',
    active: false
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'WELCOME HACKERS!',
    message: 'HACKTRONICS 2nd Edition has officially commenced at Kamaraj Auditorium. Good luck!',
    priority: 'info',
    active: false,
    createdAt: Date.now()
  }
];

const DEFAULT_STATE = {
  timer: {
    durationSeconds: 86400, // 24 Hours default
    remainingSeconds: 86400,
    status: 'stopped', // 'stopped' | 'running' | 'paused' | 'completed'
    targetEndTime: null,
    overtimeSeconds: 0
  },
  eventInfo: DEFAULT_EVENT_INFO,
  announcements: DEFAULT_ANNOUNCEMENTS,
  qrCodes: DEFAULT_QR_CODES,
  settings: {
    bgMode: 'galaxy-animated', // 'galaxy-animated' | 'galaxy-static'
    animationSpeed: 1.0, // 0.1 to 3.0 speed multiplier
    audioEnabled: true,
    showProgressRing: false,
    showMilestones: true
  }
};

export const TimerProvider = ({ children }) => {
  // Load initial state from localStorage if available
  const [appState, setAppState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure defaults exist
        return {
          ...DEFAULT_STATE,
          ...parsed,
          timer: { ...DEFAULT_STATE.timer, ...parsed.timer },
          settings: { ...DEFAULT_STATE.settings, ...parsed.settings }
        };
      }
    } catch (e) {
      console.warn('Error reading saved state:', e);
    }
    return DEFAULT_STATE;
  });

  const broadcastChannelRef = useRef(null);
  const milestoneSoundPlayedRef = useRef({});

  // Broadcast state changes, save to localStorage & push to Realtime Cloud
  const updateAndSyncState = (updater) => {
    setAppState((prev) => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'STATE_UPDATE',
            payload: nextState,
            senderId: window.name || 'window_' + Math.random().toString(36).substring(7)
          });
        }
      } catch (err) {
        console.warn('Sync dispatch failed:', err);
      }

      // Push to Realtime Cloud DB for cross-device sync
      pushStateToCloud(nextState);

      return nextState;
    });
  };

  // Setup Cloud Realtime Sync, BroadcastChannel and localStorage listeners for cross-device sync
  useEffect(() => {
    // 1. Initial Cloud Sync Fetch on Mount
    fetchInitialCloudState().then((cloudState) => {
      if (cloudState) {
        setAppState((prev) => {
          // Keep structure defaults intact
          const merged = {
            ...DEFAULT_STATE,
            ...cloudState,
            timer: { ...DEFAULT_STATE.timer, ...(cloudState.timer || {}) },
            settings: { ...DEFAULT_STATE.settings, ...(cloudState.settings || {}) }
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    });

    // 2. Subscribe to Realtime Cloud State Updates across devices
    const unsubCloud = subscribeToCloudState((cloudState) => {
      if (cloudState) {
        setAppState((prev) => {
          const mergedTimer = { ...cloudState.timer };
          if (mergedTimer.status === 'running' && mergedTimer.targetEndTime) {
            const calcSec = Math.max(0, Math.ceil((mergedTimer.targetEndTime - Date.now()) / 1000));
            mergedTimer.remainingSeconds = calcSec;
          }

          const merged = {
            ...DEFAULT_STATE,
            ...cloudState,
            timer: { ...DEFAULT_STATE.timer, ...mergedTimer },
            settings: { ...DEFAULT_STATE.settings, ...(cloudState.settings || {}) }
          };

          // Maintain smooth local countdown if targetEndTime is identical
          if (prev.timer.status === 'running' && merged.timer.status === 'running' && prev.timer.targetEndTime === merged.timer.targetEndTime) {
            merged.timer.remainingSeconds = prev.timer.remainingSeconds;
          }

          // Compare core structural data (excluding volatile tick seconds) to prevent UI glitching
          const currentStr = JSON.stringify({
            timerStatus: prev.timer.status,
            targetEndTime: prev.timer.targetEndTime,
            durationSeconds: prev.timer.durationSeconds,
            eventInfo: prev.eventInfo,
            announcements: prev.announcements,
            qrCodes: prev.qrCodes,
            settings: prev.settings
          });

          const incomingStr = JSON.stringify({
            timerStatus: merged.timer.status,
            targetEndTime: merged.timer.targetEndTime,
            durationSeconds: merged.timer.durationSeconds,
            eventInfo: merged.eventInfo,
            announcements: merged.announcements,
            qrCodes: merged.qrCodes,
            settings: merged.settings
          });

          if (currentStr === incomingStr) return prev;

          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    });

    // 3. Local BroadcastChannel setup for tab sync on same device
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(SYNC_CHANNEL_NAME);
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'STATE_UPDATE') {
          setAppState(event.data.payload);
        }
      };
    }

    // 4. LocalStorage event listener
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          setAppState(newState);
        } catch (err) {
          console.warn('Storage sync parse failed:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (unsubCloud) unsubCloud();
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Timer Tick Engine: Calculates high-precision countdown based on targetEndTime
  useEffect(() => {
    if (appState.timer.status !== 'running') return;

    const interval = setInterval(() => {
      setAppState((prev) => {
        if (prev.timer.status !== 'running' || !prev.timer.targetEndTime) return prev;

        const now = Date.now();
        const diffMs = prev.timer.targetEndTime - now;
        const diffSec = Math.max(0, Math.ceil(diffMs / 1000));

        // Optimization: Only update state when remainingSeconds integer changes
        if (prev.timer.remainingSeconds === diffSec && diffSec > 0) {
          return prev;
        }

        if (diffSec <= 0) {
          // Timer finished! Trigger completion
          const overtimeSec = Math.abs(diffSec);
          
          if (prev.settings.audioEnabled) {
            playCompletionAlarm();
          }

          // Trigger confetti on auditorium screen
          try {
            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.6 }
            });
          } catch (e) {}

          const next = {
            ...prev,
            timer: {
              ...prev.timer,
              remainingSeconds: 0,
              status: 'completed',
              overtimeSeconds: overtimeSec
            }
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        }

        // Check Milestone Sounds (e.g. 1 hour, 30 mins, 15 mins, 5 mins remaining)
        if (prev.settings.audioEnabled) {
          const milestones = [3600, 1800, 900, 300, 60];
          if (milestones.includes(diffSec) && !milestoneSoundPlayedRef.current[diffSec]) {
            milestoneSoundPlayedRef.current[diffSec] = true;
            if (diffSec <= 300) {
              playWarningBeep();
            } else {
              playMilestoneChime();
            }
          }
        }

        const next = {
          ...prev,
          timer: {
            ...prev.timer,
            remainingSeconds: diffSec
          }
        };

        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [appState.timer.status, appState.timer.targetEndTime, appState.settings.audioEnabled]);

  // Timer Control Handler Functions
  const startTimer = () => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => {
      const remaining = prev.timer.remainingSeconds > 0 ? prev.timer.remainingSeconds : prev.timer.durationSeconds;
      const targetEndTime = Date.now() + remaining * 1000;
      
      milestoneSoundPlayedRef.current = {};

      return {
        ...prev,
        timer: {
          ...prev.timer,
          remainingSeconds: remaining,
          status: 'running',
          targetEndTime,
          overtimeSeconds: 0
        }
      };
    });
  };

  const pauseTimer = () => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => {
      if (prev.timer.status !== 'running') return prev;

      const now = Date.now();
      const remainingMs = prev.timer.targetEndTime ? Math.max(0, prev.timer.targetEndTime - now) : prev.timer.remainingSeconds * 1000;
      const remainingSec = Math.ceil(remainingMs / 1000);

      return {
        ...prev,
        timer: {
          ...prev.timer,
          remainingSeconds: remainingSec,
          status: 'paused',
          targetEndTime: null
        }
      };
    });
  };

  const resumeTimer = () => {
    startTimer();
  };

  const resetTimer = () => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        remainingSeconds: prev.timer.durationSeconds,
        status: 'stopped',
        targetEndTime: null,
        overtimeSeconds: 0
      }
    }));
  };

  const stopTimer = () => {
    resetTimer();
  };

  const setTimerValue = (totalSeconds) => {
    if (appState.settings.audioEnabled) playButtonSound();

    const sec = Math.max(0, parseInt(totalSeconds, 10) || 0);
    updateAndSyncState((prev) => {
      const isRunning = prev.timer.status === 'running';
      const targetEndTime = isRunning ? Date.now() + sec * 1000 : null;

      return {
        ...prev,
        timer: {
          ...prev.timer,
          durationSeconds: sec,
          remainingSeconds: sec,
          targetEndTime,
          overtimeSeconds: 0
        }
      };
    });
  };

  const addTimeSeconds = (additionalSeconds) => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => {
      const newRemaining = Math.max(0, prev.timer.remainingSeconds + additionalSeconds);
      const isRunning = prev.timer.status === 'running';
      const targetEndTime = isRunning ? Date.now() + newRemaining * 1000 : null;

      return {
        ...prev,
        timer: {
          ...prev.timer,
          durationSeconds: Math.max(prev.timer.durationSeconds, newRemaining),
          remainingSeconds: newRemaining,
          targetEndTime
        }
      };
    });
  };

  // Event Info Customizer
  const updateEventInfo = (newInfo) => {
    updateAndSyncState((prev) => ({
      ...prev,
      eventInfo: { ...prev.eventInfo, ...newInfo }
    }));
  };

  // Announcement Handlers
  const addAnnouncement = (title, message, priority = 'info') => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => {
      const newAnn = {
        id: 'ann-' + Date.now(),
        title,
        message,
        priority,
        active: true,
        createdAt: Date.now()
      };
      return {
        ...prev,
        announcements: [newAnn, ...prev.announcements]
      };
    });
  };

  const toggleAnnouncementActive = (id) => {
    updateAndSyncState((prev) => ({
      ...prev,
      announcements: prev.announcements.map((ann) =>
        ann.id === id ? { ...ann, active: !ann.active } : ann
      )
    }));
  };

  const deleteAnnouncement = (id) => {
    updateAndSyncState((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((ann) => ann.id !== id)
    }));
  };

  // QR Code Handlers
  const addOrUpdateQRCode = (qrCodeData) => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => {
      const exists = prev.qrCodes.some((q) => q.id === qrCodeData.id);
      let updatedQRs;
      if (exists) {
        updatedQRs = prev.qrCodes.map((q) => (q.id === qrCodeData.id ? { ...q, ...qrCodeData } : q));
      } else {
        const newQR = { ...qrCodeData, id: 'qr-' + Date.now(), active: false };
        updatedQRs = [...prev.qrCodes, newQR];
      }
      return {
        ...prev,
        qrCodes: updatedQRs
      };
    });
  };

  const toggleQRCodeActive = (id) => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => ({
      ...prev,
      qrCodes: prev.qrCodes.map((qr) => ({
        ...qr,
        active: qr.id === id ? !qr.active : false // Only 1 active QR overlay at a time
      }))
    }));
  };

  const deleteQRCode = (id) => {
    updateAndSyncState((prev) => ({
      ...prev,
      qrCodes: prev.qrCodes.filter((qr) => qr.id !== id)
    }));
  };

  // Settings Handlers
  const updateSettings = (newSettings) => {
    if (appState.settings.audioEnabled) playButtonSound();

    updateAndSyncState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  return (
    <TimerContext.Provider
      value={{
        ...appState,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        stopTimer,
        setTimerValue,
        addTimeSeconds,
        updateEventInfo,
        addAnnouncement,
        toggleAnnouncementActive,
        deleteAnnouncement,
        addOrUpdateQRCode,
        toggleQRCodeActive,
        deleteQRCode,
        updateSettings,
        syncStateNow: () => pushStateToCloud(appState)
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
