import React from 'react';
import { Mail, Eye } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);



export default function TrackerHUD({ gazeData, soundEnabled }) {
  const { angleDeg = 0, frameIndex = 0, isEyeContact = false } = gazeData || {};

  // Direction label
  const getDirectionName = (deg) => {
    if (isEyeContact) return 'EYE CONTACT';
    const normalized = (deg % 360 + 360) % 360;
    if (normalized >= 337.5 || normalized < 22.5) return 'RIGHT';
    if (normalized >= 22.5 && normalized < 67.5) return 'DOWN-RIGHT';
    if (normalized >= 67.5 && normalized < 112.5) return 'DOWN';
    if (normalized >= 112.5 && normalized < 157.5) return 'DOWN-LEFT';
    if (normalized >= 157.5 && normalized < 202.5) return 'LEFT';
    if (normalized >= 202.5 && normalized < 247.5) return 'UP-LEFT';
    if (normalized >= 247.5 && normalized < 292.5) return 'UP';
    return 'UP-RIGHT';
  };

  return (
    <div className="hero-bottom-right interactive">
      {/* Real-time Tracking HUD */}
      <div className="tracker-hud" title="Real-time 60FPS Cursor & Head Gaze Tracker">
        <div className="hud-item">
          <div className="hud-compass-icon">
            <div
              className="hud-compass-needle"
              style={{
                transform: `rotate(${angleDeg + 90}deg)`,
                backgroundColor: isEyeContact ? '#3fae7a' : 'var(--ink)'
              }}
            />
          </div>
          <span className="hud-val">
            {isEyeContact ? (
              <span style={{ color: '#2f8f62', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} /> DIRECT
              </span>
            ) : (
              `${angleDeg}°`
            )}
          </span>
        </div>

        <div className="hud-item" style={{ borderLeft: '1px solid var(--line)', paddingLeft: '10px' }}>
          <span>POSE:</span>
          <span className="hud-val">{getDirectionName(angleDeg)}</span>
        </div>

        <div className="hud-item" style={{ borderLeft: '1px solid var(--line)', paddingLeft: '10px' }}>
          <span>FRAME:</span>
          <span className="hud-val">{isEyeContact ? 'CTR' : `${frameIndex + 1}/63`}</span>
        </div>
      </div>

      {/* Social Links — GitHub, LinkedIn, Email */}
      <div className="social-links">
        <a
          href="https://github.com/keerthanagandhi11"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
          title="GitHub (keerthanagandhi11)"
          onMouseEnter={() => soundEnabled && playHoverSound()}
          onClick={() => soundEnabled && playClickSound()}
          aria-label="GitHub Profile"
        >
          <GithubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/keerthana-gandhi13aa64282"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
          title="LinkedIn"
          onMouseEnter={() => soundEnabled && playHoverSound()}
          onClick={() => soundEnabled && playClickSound()}
          aria-label="LinkedIn Profile"
        >
          <LinkedinIcon />
        </a>
        <a
          href="mailto:keerthanagandhi1104@gmail.com"
          className="social-btn"
          title="keerthanagandhi1104@gmail.com"
          onMouseEnter={() => soundEnabled && playHoverSound()}
          onClick={() => soundEnabled && playClickSound()}
          aria-label="Send Email"
        >
          <Mail size={18} />
        </a>
      </div>
    </div>
  );
}
