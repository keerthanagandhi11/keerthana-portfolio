import React, { useEffect, useState } from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';
import { ROLE_FOCUS, SPECIALISMS } from '../data/profile';

// Types each specialism, holds it, deletes it, then moves to the next
function Typewriter({ words }) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let word = 0;
    let chars = words[0].length;
    let deleting = true;
    let timer;
    const tick = () => {
      const current = words[word];
      if (deleting) {
        chars -= 1;
        if (chars <= 0) { deleting = false; word = (word + 1) % words.length; }
      } else {
        chars += 1;
      }
      setText(words[word].slice(0, Math.max(chars, 0)));
      let delay = deleting ? 28 : 55;
      if (!deleting && chars >= words[word].length) { deleting = true; delay = 1800; }
      if (current !== words[word]) delay = 250;
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [words]);

  return <span className="typewriter">{text}<span className="type-caret" aria-hidden="true" /></span>;
}

export default function HeroContent({ onOpenModal, soundEnabled }) {
  return (
    <div className="hero-typography interactive">
      <span className="role-chip"><span className="status-dot" /> Open to {ROLE_FOCUS}</span>

      {/* Greeting */}
      <span className="hero-greeting">Hi, I'm</span>

      {/* Name */}
      <h1 className="hero-name">Keerthana</h1>

      <p className="hero-rotator" aria-label={`Gen AI engineer building ${SPECIALISMS.join(', ')}`}>
        <span aria-hidden="true">Building <Typewriter words={SPECIALISMS} /></span>
      </p>

      {/* Compact technical bio */}
      <p className="hero-bio">
        Gen AI engineer shipping <strong>tool-calling LLM agents and agentic RAG</strong> in Python: LangGraph
        and custom agent loops, MCP tools, hybrid BM25 + embedding retrieval and claim-level self-verification.
      </p>

      {/* Two Stylish Pill Buttons */}
      <div className="hero-cta-group">
        <button
          className="btn-primary-white"
          data-magnetic
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
          data-magnetic
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
