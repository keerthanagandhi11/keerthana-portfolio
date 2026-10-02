import React, { useState, useRef, useEffect, useCallback } from 'react';
import HeroCanvas from './components/HeroCanvas';
import Navigation from './components/Navigation';
import HeroContent from './components/HeroContent';
import TrackerHUD from './components/TrackerHUD';
import CustomCursor from './components/CustomCursor';
import Modals from './components/Modals';
import { playEyeContactSound } from './utils/audio';

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gazeData, setGazeData] = useState({
    angleDeg: 0,
    frameIndex: 0,
    isEyeContact: false,
    dist: 0
  });

  const mousePosRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 500
  });

  const prevEyeContactRef = useRef(false);

  // Global mouse / pointer tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Handle gaze updates from 60fps canvas loop
  const handleGazeUpdate = useCallback((data) => {
    setGazeData(data);

    // Audio cue on entering eye contact deadzone
    if (data.isEyeContact && !prevEyeContactRef.current && soundEnabled) {
      playEyeContactSound();
    }
    prevEyeContactRef.current = data.isEyeContact;
  }, [soundEnabled]);

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 1. Seamless Background 60 FPS Canvas */}
      <HeroCanvas
        mousePos={mousePosRef}
        onGazeUpdate={handleGazeUpdate}
        isLoaded={isLoaded}
        setIsLoaded={setIsLoaded}
      />

      {/* 2. Floating UI Layer */}
      <div className="ui-layer">
        {/* Top Centered Frosted-Glass Header */}
        <Navigation
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />

        {/* Bottom Hero Layout (Bottom-Left Typography & Bottom-Right HUD) */}
        <div className="hero-bottom-container">
          <HeroContent
            onOpenModal={(modal) => setActiveModal(modal)}
            soundEnabled={soundEnabled}
          />
          <TrackerHUD
            gazeData={gazeData}
            soundEnabled={soundEnabled}
          />
        </div>
      </div>

      {/* 3. Interactive Modals */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        soundEnabled={soundEnabled}
      />

      {/* 4. Luxury Custom Magnetic Cursor */}
      <CustomCursor isEyeContact={gazeData.isEyeContact} />

      {/* 5. Sleek Preloader Overlay */}
      {!isLoaded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#df0b08',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: '#ffffff',
            transition: 'opacity 0.5s ease'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Calibrating Neural Head Tracker...
          </div>
        </div>
      )}
    </main>
  );
}
