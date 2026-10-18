import React from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

export default function HeroContent({ onOpenModal, soundEnabled }) {
  return (
    <div className="hero-typography interactive">
      {/* Greeting */}
      <span className="hero-greeting">Hi, I'm</span>

      {/* Name */}
      <h1 className="hero-name">Keerthana</h1>

      {/* Compact 3-line technical bio */}
      <p className="hero-bio">
        I engineer <strong>LLM agents and RAG pipelines</strong> in Python: LangGraph state graphs,
        tool calling over MCP, and vector search. Production ops background at Kyndryl.
      </p>

      {/* Two Stylish White Pill Buttons */}
      <div className="hero-cta-group">
        <button
          className="btn-primary-white"
          onClick={() => {
            if (soundEnabled) playClickSound();
            onOpenModal('resume');
          }}
          onMouseEnter={() => soundEnabled && playHoverSound()}
          aria-label="View Resume"
        >
          <span>Resume</span>
          <ArrowUpRight size={18} strokeWidth={2.4} />
        </button>

        <button
          className="btn-secondary-glass"
          onClick={() => {
            if (soundEnabled) playClickSound();
            onOpenModal('contact');
          }}
          onMouseEnter={() => soundEnabled && playHoverSound()}
          aria-label="Let's Talk"
        >
          <MessageSquare size={16} strokeWidth={2} />
          <span>Let's Talk</span>
        </button>
      </div>
    </div>
  );
}
