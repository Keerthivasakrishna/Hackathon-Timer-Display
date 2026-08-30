import React from 'react';
import { useTimer } from '../../context/TimerContext';
import DynamicBackground from './DynamicBackground';
import CountdownTimer from './CountdownTimer';
import HeaderLogos from './HeaderLogos';
import EventFooter from './EventFooter';
import AnnouncementOverlay from './AnnouncementOverlay';
import QRCodeOverlay from './QRCodeOverlay';

const AuditoriumDisplay = () => {
  const { timer, eventInfo, announcements, qrCodes, settings } = useTimer();

  // Check if any QR code or Announcement is actively broadcast
  const activeQR = qrCodes?.find((q) => q.active);
  const activeAnn = announcements?.find((a) => a.active);
  const hasSpotlight = Boolean(activeQR || activeAnn);

  return (
    <div className="relative w-screen h-screen min-h-screen overflow-hidden flex flex-col justify-between items-center select-none bg-black">
      {/* Background Layer (Animated Galaxy or Static Galaxy) */}
      <DynamicBackground
        mode={settings?.bgMode || 'galaxy-animated'}
        animationSpeed={settings?.animationSpeed ?? 1.0}
      />

      {/* Dynamic Content Layout */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between items-center p-4 md:p-6 transition-all duration-500">
        {/* Top Header Logos */}
        <HeaderLogos eventInfo={eventInfo} isCompact={hasSpotlight} />

        {/* Center Main Area: Dynamic Spotlight Split View vs Centered View */}
        {hasSpotlight ? (
          <div className="my-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-4 transition-all duration-500">
            {/* Left Side: Scaled Compact Timer & Status */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <CountdownTimer timer={timer} showProgressRing={settings?.showProgressRing} isCompact={true} />
            </div>

            {/* Right Side: High-Impact Spotlight Card (QR Code or Announcement) */}
            <div className="md:col-span-6 flex items-center justify-center h-full">
              {activeQR ? (
                <QRCodeOverlay qrCode={activeQR} isSpotlight={true} />
              ) : (
                <AnnouncementOverlay announcement={activeAnn} isSpotlight={true} />
              )}
            </div>
          </div>
        ) : (
          /* Normal Centered Layout when no QR Code or Announcement is active */
          <div className="my-auto w-full">
            <CountdownTimer timer={timer} showProgressRing={settings?.showProgressRing} isCompact={false} />
          </div>
        )}

        {/* Bottom Restored Pillars, Venue & Date Info */}
        <EventFooter eventInfo={eventInfo} isCompact={hasSpotlight} />
      </div>
    </div>
  );
};

export default AuditoriumDisplay;
