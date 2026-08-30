import React from 'react';
import AnimatedStarfield from './AnimatedStarfield';

const DynamicBackground = ({ mode = 'galaxy-animated', animationSpeed = 1.0 }) => {
  const isAnimated = mode === 'galaxy-animated' || mode === 'video' || !mode;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#04020a]">
      {/* Base Galaxy Background Image */}
      <img
        src="/assets/static/galaxy-background.png"
        alt="Galaxy Space Background"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Animated Canvas Starfield Layer */}
      {isAnimated && <AnimatedStarfield speedMultiplier={animationSpeed} />}

      {/* Ambient Vignette & Depth Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 z-[2]"></div>
    </div>
  );
};

export default DynamicBackground;
