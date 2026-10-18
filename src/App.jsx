import React, { useState, useRef, useEffect, useCallback } from 'react';
import HeroCanvas from './components/HeroCanvas';
import Navigation, { NAV_SECTIONS } from './components/Navigation';
import HeroContent from './components/HeroContent';
import TrackerHUD from './components/TrackerHUD';
import CustomCursor from './components/CustomCursor';
import Modals from './components/Modals';
import Sections from './components/Sections';
import { playEyeContactSound } from './utils/audio';

const RING_LENGTH = 138.2; // circumference of the back-to-top progress ring (r = 22)

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
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
  const progressRef = useRef(null);
  const ringRef = useRef(null);
  const heroRef = useRef(null);
  const heroUiRef = useRef(null);

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

  // One scroll loop drives progress, header state, scroll spy, hero parallax and the timeline
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight - vh;
      const p = docH > 0 ? Math.min(y / docH, 1) : 0;

      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_LENGTH * (1 - p));
      setIsScrolled(y > 40);
      setShowTop(y > vh * 0.6);

      // Hero parallax: avatar drifts slower than the page and zooms slightly; hero copy lifts and fades
      const hero = heroRef.current;
      if (hero && !reduce) {
        const hp = Math.min(y / hero.offsetHeight, 1);
        const avatar = hero.querySelector('.canvas-container');
        if (avatar) avatar.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(${1 + hp * 0.06})`;
        if (heroUiRef.current) {
          heroUiRef.current.style.transform = `translate3d(0, ${-hp * 80}px, 0)`;
          heroUiRef.current.style.opacity = String(Math.max(0, 1 - hp * 1.4));
        }
      }

      // Timeline line draws down as it passes the middle of the screen
      const timeline = document.getElementById('timeline');
      const fill = document.getElementById('timeline-fill');
      if (timeline && fill) {
        const r = timeline.getBoundingClientRect();
        const tp = Math.min(Math.max((vh * 0.6 - r.top) / Math.max(r.height - 30, 1), 0), 1);
        fill.style.transform = `scaleY(${tp})`;
        timeline.querySelectorAll('.tl-item').forEach((item) => {
          item.classList.toggle('on', item.getBoundingClientRect().top < vh * 0.6);
        });
      }

      // Scroll spy
      let current = 'home';
      NAV_SECTIONS.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < vh * 0.4) current = id;
      });
      if (y + vh >= document.documentElement.scrollHeight - 4) current = 'contact';
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
    <>
      {/* Scroll progress */}
      <div className="scroll-progress" ref={progressRef} />

      {/* Fixed frosted header */}
      <Navigation
        activeSection={activeSection}
        isScrolled={isScrolled}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <main>
        {/* 1. Hero: 60 FPS cursor-tracking avatar canvas */}
        <section className="hero" id="home" ref={heroRef}>
          <HeroCanvas
            mousePos={mousePosRef}
            onGazeUpdate={handleGazeUpdate}
            isLoaded={isLoaded}
            setIsLoaded={setIsLoaded}
          />
          <div className="hero-orb orb-a" aria-hidden="true" />
          <div className="hero-orb orb-b" aria-hidden="true" />
          <div className="hero-frame" aria-hidden="true" />

          {/* 2. Floating UI Layer */}
          <div className="ui-layer" ref={heroUiRef}>
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
          <div className="scroll-hint" aria-hidden="true">SCROLL ↓</div>
        </section>

        {/* 3. Scroll sections */}
        <Sections soundEnabled={soundEnabled} onOpenModal={(modal) => setActiveModal(modal)} />
      </main>

      {/* Back to top with progress ring */}
      <button
        className={`back-to-top ${showTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg width="50" height="50" viewBox="0 0 50 50" aria-hidden="true">
          <circle cx="25" cy="25" r="22" className="ring-track" />
          <circle cx="25" cy="25" r="22" className="ring-fill" ref={ringRef} strokeDasharray={RING_LENGTH} strokeDashoffset={RING_LENGTH} />
        </svg>
        <span>↑</span>
      </button>

      {/* 4. Interactive Modals */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        soundEnabled={soundEnabled}
      />

      {/* 5. Luxury Custom Magnetic Cursor */}
      <CustomCursor isEyeContact={gazeData.isEyeContact} />

      {/* 6. Sleek Preloader Overlay */}
      {!isLoaded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--blush)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: 'var(--ink)',
            transition: 'opacity 0.5s ease'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid var(--rose)',
              borderTopColor: 'var(--ink)',
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
    </>
  );
}
