import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Copy, Check, Download, Mail } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';
import AgentPipeline from './AgentPipeline';
import {
  EMAIL, LINKEDIN, GITHUB, RESUME_URL, RESUME_FILENAME, ROLE_FOCUS,
  projects, skillGroups, experience, education, certifications
} from '../data/profile';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sections rest fully visible; ones that start below the fold slide in once as they enter.
function useReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('rv-pre');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.rv').forEach((el) => {
      [...el.children].forEach((child, i) => child.style.setProperty('--i', i));
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('rv-pre');
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);
}

// Section title whose words rise in one after another when the section reveals
function SplitTitle({ children }) {
  return (
    <h2 className="block-title split-title">
      {children.split(' ').map((word, i) => (
        <span className="word" key={i}><span style={{ '--w': i }}>{word}</span></span>
      ))}
    </h2>
  );
}

// 3D tilt with a moving glare, mouse only
function tilt(e) {
  if (e.pointerType !== 'mouse') return;
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  card.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
  card.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
  card.style.setProperty('--gx', `${px * 100}%`);
  card.style.setProperty('--gy', `${py * 100}%`);
}
function untilt(e) {
  const card = e.currentTarget;
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
}

function CountUp({ value }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const start = value > 100 ? value - 25 : 0;
    setShown(start);
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / 1000, 1);
        setShown(Math.round(start + (value - start) * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <b ref={ref}>{shown}</b>;
}

// Two rows of skills that drift continuously; scrolling speeds them up and scrolling up reverses them.
function SkillMarquee() {
  const rowA = useRef(null);
  const rowB = useRef(null);
  const all = skillGroups.flatMap((group) => group.slice(1));
  const half = Math.ceil(all.length / 2);
  const lists = [all.slice(0, half), all.slice(half)];

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let x = 0;
    let velocity = 0;
    let lastY = window.scrollY;
    let frame;
    const onScroll = () => {
      velocity = Math.max(-40, Math.min(40, velocity + (window.scrollY - lastY) * 0.15));
      lastY = window.scrollY;
    };
    const tick = () => {
      velocity *= 0.92;
      x += (0.35 + Math.abs(velocity) * 0.25) * (velocity < -0.5 ? -1 : 1);
      [[rowA.current, 1], [rowB.current, -1]].forEach(([row, dir]) => {
        if (!row) return;
        const w = row.scrollWidth / 3;
        const offset = ((x % w) + w) % w;
        row.style.transform = `translate3d(${dir > 0 ? -offset : offset - w}px,0,0)`;
      });
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <div className="marquee" aria-label="Skills">
      {lists.map((list, r) => (
        <div className="marquee-row" ref={r === 0 ? rowA : rowB} key={r}>
          {[0, 1, 2].flatMap((copy) => list.map((skill, i) => (
            <span
              className={`marquee-chip ${(i + r) % 3 === 0 ? 'alt' : ''}`}
              key={`${copy}-${skill}`}
              aria-hidden={copy > 0 ? 'true' : undefined}
            >
              {skill}
            </span>
          )))}
        </div>
      ))}
    </div>
  );
}

function ProjectSlider({ soundEnabled, onOpenModal }) {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [openCard, setOpenCard] = useState(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const total = projects.length;

  const metrics = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return { step: 1, max: 0 };
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return { step: card.offsetWidth + gap, max: track.scrollWidth - track.clientWidth };
  }, []);

  const goTo = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const { step, max } = metrics();
    const target = ((i % total) + total) % total;
    track.scrollTo({ left: Math.min(target * step, max), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [metrics, total]);

  const step = (dir) => {
    if (soundEnabled) playClickSound();
    const { max } = metrics();
    const atEnd = trackRef.current.scrollLeft >= max - 4;
    if (dir > 0 && atEnd) goTo(0);
    else if (dir < 0 && trackRef.current.scrollLeft <= 4) goTo(total - 1);
    else goTo(index + dir);
  };

  const onScroll = () => {
    const track = trackRef.current;
    const { step: s, max } = metrics();
    const left = track.scrollLeft;
    setIndex(left >= max - 4 ? total - 1 : Math.round(left / s));
    setProgress(max > 0 ? left / max : 0);
  };

  // Mouse drag (touch and trackpads scroll natively)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const track = trackRef.current;
    drag.current = { active: true, moved: false, startX: e.clientX, startLeft: track.scrollLeft };
    track.classList.add('dragging');
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    trackRef.current.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    const track = trackRef.current;
    track.classList.remove('dragging');
    const { step: s } = metrics();
    goTo(Math.round(track.scrollLeft / s));
  };
  const onClickCapture = (e) => {
    if (drag.current.moved) { e.stopPropagation(); e.preventDefault(); drag.current.moved = false; }
  };

  // Autoplay only while visible and not being interacted with
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (paused || !inView || openCard !== null || prefersReducedMotion()) return;
    const id = setInterval(() => {
      const track = trackRef.current;
      const { max } = metrics();
      if (track.scrollLeft >= max - 4) goTo(0); else goTo(index + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, inView, openCard, index, goTo, metrics]);

  return (
    <div
      className="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); endDrag(); }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="slider-head">
        <div className="slider-counter" aria-live="polite">
          <b>{String(index + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
        </div>
        <div className="slider-arrows">
          <button className="slider-arrow" data-magnetic onClick={() => step(-1)} onMouseEnter={() => soundEnabled && playHoverSound()} aria-label="Previous project">
            <ArrowLeft size={18} />
          </button>
          <button className="slider-arrow" data-magnetic onClick={() => step(1)} onMouseEnter={() => soundEnabled && playHoverSound()} aria-label="Next project">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div className="slider-bar"><i style={{ transform: `scaleX(${Math.max(progress, 1 / total)})` }} /></div>

      <div
        className="slider-track"
        ref={trackRef}
        tabIndex={0}
        aria-label="Projects"
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        }}
      >
        {projects.map((project, i) => (
          <article
            className={`slide-card ${openCard === i ? 'open' : ''} ${index === i ? 'current' : ''} ${project.featured ? 'featured' : ''}`}
            key={project.name}
            onPointerMove={tilt}
            onPointerLeave={untilt}
          >
            <div className="slide-top">
              <div className="slide-num">{String(i + 1).padStart(2, '0')}</div>
              {project.featured && <span className="featured-pill">Featured · Live</span>}
            </div>
            <span className="project-tag">{project.tag}</span>
            <h3 className="slide-name">{project.name}</h3>
            <p className="slide-summary">{project.summary}</p>
            <dl className="slide-star">
              {[['Situation', project.situation], ['Task', project.task], ['Action', project.action], ['Result', project.result]].map(([label, text]) => (
                <div key={label}><dt>{label}</dt><dd>{text}</dd></div>
              ))}
            </dl>
            <div className="project-tech">
              {project.tech.map((tech) => <span className="tech-badge" key={tech}>{tech}</span>)}
            </div>
            {project.links && (
              <div className="slide-links">
                {project.links.map(([label, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={13} /></a>
                ))}
              </div>
            )}
            <button
              className="slide-toggle"
              onClick={() => { if (soundEnabled) playClickSound(); setOpenCard(openCard === i ? null : i); }}
              aria-expanded={openCard === i}
            >
              {openCard === i ? 'Hide case study −' : 'Read case study +'}
            </button>
          </article>
        ))}
      </div>

      <div className="slider-foot">
        <div className="slider-dots">
          {projects.map((project, i) => (
            <button
              key={project.name}
              className={`slider-dot ${index === i ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Show project ${i + 1}: ${project.name}`}
            />
          ))}
        </div>
        <button className="btn-outline" onClick={() => { if (soundEnabled) playClickSound(); onOpenModal('work'); }}>
          View all case studies <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);
  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    navigator.clipboard?.writeText(EMAIL).then(done, () => {
      window.getSelection()?.selectAllChildren(textRef.current);
    });
  };
  return (
    <div className="copy-row">
      <code ref={textRef}>{EMAIL}</code>
      <button className="btn-outline" onClick={copy}>
        {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy email'}
      </button>
    </div>
  );
}

function Sections({ soundEnabled, onOpenModal }) {
  useReveal();
  const click = () => soundEnabled && playClickSound();
  const hover = () => soundEnabled && playHoverSound();

  return (
    <>
      <section className="block" id="about">
        <div className="wrap rv">
          <div className="eyebrow">At a glance · open to {ROLE_FOCUS}</div>
          <SplitTitle>Gen AI engineer building agents that cite, verify and fail safe</SplitTitle>
          <p className="lede">
            I design LLM systems around the failure modes that matter in production: tool-calling agents that plan their own
            retrieval, hybrid BM25 + embedding search fused with Reciprocal Rank Fusion, claim-level self-verification,
            explicit refusal when evidence is missing, and graceful fallbacks when the model or rate limit fails. Running
            enterprise batch workloads at Kyndryl taught me to build for observability, runbooks and clean hand-offs.
          </p>
          <div className="stats">
            <div className="stat"><CountUp value={projects.length} /><span>Shipped projects</span></div>
            <div className="stat"><CountUp value={2} /><span>Agentic AI systems</span></div>
            <div className="stat"><CountUp value={4} /><span>Certifications &amp; programs</span></div>
            <div className="stat"><CountUp value={2027} /><span>MCA completion</span></div>
          </div>
          <button className="btn-outline" onClick={() => { click(); onOpenModal('about'); }} onMouseEnter={hover}>
            More about me <ArrowUpRight size={15} />
          </button>
        </div>
      </section>

      <section className="block block-flush" id="skills">
        <div className="wrap rv">
          <div className="eyebrow">Stack</div>
          <SplitTitle>Models, retrieval, orchestration and serving</SplitTitle>
        </div>
        <SkillMarquee />
        <div className="wrap">
          <div className="skill-groups rv">
            {skillGroups.map(([title, ...items]) => (
              <div className="skill-group" key={title}>
                <h3>{title}</h3>
                <p>{items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="approach">
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">How I build agents</div>
            <SplitTitle>Plan, act, cite, verify</SplitTitle>
            <p className="lede">
              Classic RAG retrieves once and hopes. My agents control their own retrieval: they decide what to look up,
              call tools until they have evidence, cite stable source ids and pass a separate verifier before answering.
            </p>
          </div>
          <AgentPipeline />
        </div>
      </section>

      <section className="block" id="work">
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">Projects</div>
            <SplitTitle>Selected work</SplitTitle>
            <p className="lede">Agentic RAG, tool-calling agents, retrieval pipelines and the backends behind them. Use the arrows, drag or swipe; each card opens a full Situation, Task, Action, Result case study.</p>
          </div>
          <ProjectSlider soundEnabled={soundEnabled} onOpenModal={onOpenModal} />
        </div>
      </section>

      <section className="block" id="journey">
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">Journey</div>
            <SplitTitle>Experience and education</SplitTitle>
          </div>
          <div className="timeline" id="timeline">
            <div className="timeline-fill" id="timeline-fill" />
            <div className="tl-item">
              <div className="tl-when">{experience.dates}</div>
              <h3>{experience.company} · {experience.title}</h3>
              <ul>{experience.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
            {education.map((item) => (
              <div className="tl-item" key={item.degree}>
                <div className="tl-when">{item.dates}</div>
                <h3>{item.degree}</h3>
                <p>{item.school}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">Certifications</div>
            <SplitTitle>Credentials and programs</SplitTitle>
          </div>
          <div className="certs rv">
            {certifications.map((cert) => (
              <div className="cert" key={cert.name}>
                <strong>{cert.name}</strong>
                <span className={cert.live ? 'live' : ''}>{cert.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band" id="contact">
        <div className="wrap rv contact-grid">
          <div>
            <div className="eyebrow">Contact</div>
            <SplitTitle>Open to Gen AI and Agentic AI engineering roles</SplitTitle>
            <p className="lede">LLM agents, RAG systems, tool integrations over MCP and the evaluation and guardrails around them.</p>
            <CopyEmail />
          </div>
          <div className="contact-actions">
            <a className="btn-solid" data-magnetic href={RESUME_URL} download={RESUME_FILENAME} onClick={click} onMouseEnter={hover}>
              <Download size={16} /> Download Resume
            </a>
            <button className="btn-outline" onClick={() => { click(); onOpenModal('contact'); }} onMouseEnter={hover}>
              <Mail size={15} /> Write a message
            </button>
            <a className="btn-outline" href={LINKEDIN} target="_blank" rel="noopener noreferrer" onClick={click} onMouseEnter={hover}>LinkedIn <ArrowUpRight size={15} /></a>
            <a className="btn-outline" href={GITHUB} target="_blank" rel="noopener noreferrer" onClick={click} onMouseEnter={hover}>GitHub <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      <footer className="site-footer">© {new Date().getFullYear()} Keerthana Gandhirajan · React 19, Vite and a 63-frame canvas gaze tracker</footer>
    </>
  );
}

// Memoised so scroll-state changes in App (header, scroll spy) don't re-render every section
export default React.memo(Sections);
