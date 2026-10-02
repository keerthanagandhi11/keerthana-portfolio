import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

export default function Navigation({ activeModal, setActiveModal, soundEnabled, setSoundEnabled }) {
  const handleNavClick = (modalName) => {
    if (soundEnabled) playClickSound();
    setActiveModal(activeModal === modalName ? null : modalName);
  };

  const handleSoundToggle = () => {
    if (!soundEnabled) playClickSound();
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className="header-container interactive">
      {/* Brand / Status Pill */}
      <div className="brand-badge" title="Open to Internships & Projects">
        <span className="status-dot"></span>
        <span>Keerthana Gandhirajan &bull; Aspiring AI Engineer</span>
      </div>

      {/* Floating Frosted-Glass Navigation Pill Centered */}
      <nav className="nav-pill-center" aria-label="Main Navigation">
        <button
          className={`nav-btn ${activeModal === 'work' ? 'active' : ''}`}
          onClick={() => handleNavClick('work')}
          onMouseEnter={() => soundEnabled && playHoverSound()}
        >
          [WORK]
        </button>
        <button
          className={`nav-btn ${activeModal === 'about' ? 'active' : ''}`}
          onClick={() => handleNavClick('about')}
          onMouseEnter={() => soundEnabled && playHoverSound()}
        >
          [ABOUT]
        </button>
        <button
          className={`nav-btn ${activeModal === 'contact' ? 'active' : ''}`}
          onClick={() => handleNavClick('contact')}
          onMouseEnter={() => soundEnabled && playHoverSound()}
        >
          [CONTACT]
        </button>
      </nav>

      {/* Header Actions */}
      <div className="header-actions">
        <button
          className="icon-pill-btn"
          onClick={handleSoundToggle}
          onMouseEnter={() => soundEnabled && playHoverSound()}
          title={soundEnabled ? 'Mute Interactive Sound' : 'Enable Interactive Sound'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </header>
  );
}
