import React from 'react';
import { Volume2, VolumeX, Download } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';
import { RESUME_URL, RESUME_FILENAME, ROLE } from '../data/profile';

export const NAV_SECTIONS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['approach', 'Agents'],
  ['work', 'Work'],
  ['journey', 'Journey'],
  ['contact', 'Contact']
];

export default function Navigation({ activeSection, isScrolled, soundEnabled, setSoundEnabled }) {
  const handleNavClick = (event, id) => {
    event.preventDefault();
    if (soundEnabled) playClickSound();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSoundToggle = () => {
    if (!soundEnabled) playClickSound();
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className={`header-container interactive ${isScrolled ? 'scrolled' : ''}`}>
      {/* Brand / Status Pill */}
      <div className="brand-badge" title="Open to Gen AI & Agentic AI roles">
        <span className="status-dot"></span>
        <span>Keerthana<span className="brand-long"> Gandhirajan &bull; {ROLE}</span></span>
      </div>

      {/* Section navigation with scroll spy */}
      <nav className="nav-pill-center" aria-label="Main Navigation">
        {NAV_SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-btn ${activeSection === id ? 'active' : ''}`}
            aria-current={activeSection === id ? 'true' : undefined}
            onClick={(event) => handleNavClick(event, id)}
            onMouseEnter={() => soundEnabled && playHoverSound()}
          >
            [{label.toUpperCase()}]
          </a>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="header-actions">
        <a
          className="btn-download"
          data-magnetic
          href={RESUME_URL}
          download={RESUME_FILENAME}
          onClick={() => soundEnabled && playClickSound()}
          onMouseEnter={() => soundEnabled && playHoverSound()}
          aria-label="Download resume (PDF)"
        >
          <Download size={16} strokeWidth={2.4} />
          <span>Download<span className="brand-long"> Resume</span></span>
        </a>
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
