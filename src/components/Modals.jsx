import React, { useState } from 'react';
import { X, Send, CheckCircle2, Code2, Sparkles, Mail, Phone, ArrowUpRight, Download } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

import {
  EMAIL, LINKEDIN, GITHUB, PHONE, PHONE_HREF, RESUME_URL, RESUME_FILENAME, ROLE,
  projects, skillGroups, experience, education, certifications
} from '../data/profile';

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const panelStyle = {
  background: 'var(--panel)',
  padding: '1.2rem',
  borderRadius: '16px',
  border: '1px solid var(--line)'
};

function ProjectGrid() {
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <div className="project-card" key={project.name}>
          <span className="project-tag">{project.tag}</span>
          <h3 className="project-name">{project.name}</h3>
          <div className="project-star">
            {[
              ['Situation', project.situation],
              ['Task', project.task],
              ['Action', project.action],
              ['Result', project.result]
            ].map(([label, detail]) => (
              <p className="project-desc" key={label}><strong>{label}:</strong> {detail}</p>
            ))}
          </div>
          <div className="project-tech">
            {project.tech.map((tech) => <span className="tech-badge" key={tech}>{tech}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--text-body)' }}>
        I'm <strong>Keerthana Gandhirajan</strong>, a Python developer building LLM-powered systems:
        LangGraph agents that call tools over MCP, retrieval-augmented generation pipelines on vector
        databases, and NLP classifiers. I run enterprise batch workload operations at Kyndryl and am
        completing an MCA, so I design for how AI behaves in production, not just in a notebook.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-deep)', marginBottom: '8px' }}>
            <Code2 size={20} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Technical Skills</strong>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--ink)' }}>Languages:</strong> Python, Java, SQL<br />
            <strong style={{ color: 'var(--ink)' }}>LLM engineering:</strong> Claude API, tool calling, prompt engineering, multi-agent orchestration<br />
            <strong style={{ color: 'var(--ink)' }}>Agents and RAG:</strong> LangGraph, LangChain, MCP, embeddings, semantic search<br />
            <strong style={{ color: 'var(--ink)' }}>ML / NLP:</strong> PyTorch, TensorFlow, scikit-learn<br />
            <strong style={{ color: 'var(--ink)' }}>Serving and data:</strong> FastAPI, Flask, Django, Streamlit, Gradio, MongoDB, Pinecone, FAISS
          </p>
        </div>

        <div style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-deep)', marginBottom: '8px' }}>
            <Sparkles size={20} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Current Learning</strong>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Nominated by management to Kyndryl's AI Agent OPS Specialist Skilling Program (agent
            operations in production) and pursuing IBM's RAG and Agentic AI Professional Certification.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>6</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Selected Projects</div>
        </div>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>MCA</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bharathidasan University</div>
        </div>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>2025</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Joined Kyndryl</div>
        </div>
      </div>
    </div>
  );
}

function ContactLinks({ soundEnabled }) {
  const links = [
    { href: 'mailto:' + EMAIL, label: 'Email', icon: <Mail size={15} /> },
    { href: PHONE_HREF, label: 'Call', icon: <Phone size={15} /> },
    { href: LINKEDIN, label: 'LinkedIn', icon: <LinkedinIcon />, external: true },
    { href: GITHUB, label: 'GitHub', icon: <GithubIcon />, external: true }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className="btn-secondary-glass"
          style={{ justifyContent: 'center', padding: '10px 14px', fontSize: '0.85rem' }}
          onMouseEnter={() => soundEnabled && playHoverSound()}
          onClick={() => soundEnabled && playClickSound()}
        >
          {link.icon}<span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}

function ResumeContent({ soundEnabled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={panelStyle}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Keerthana Gandhirajan</h3>
        <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>{ROLE} · LLM agents, RAG, NLP · Chennai, Tamil Nadu</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <a href={'mailto:' + EMAIL} style={{ color: 'var(--text-body)', textDecoration: 'underline' }}>{EMAIL}</a>
          <a href={PHONE_HREF} style={{ color: 'var(--text-body)', textDecoration: 'underline' }}>{PHONE}</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-body)', textDecoration: 'underline' }}>LinkedIn</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-body)', textDecoration: 'underline' }}>GitHub</a>
        </div>
      </div>

      <div style={panelStyle}>
        <strong>Experience</strong>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          <strong>{experience.company} · {experience.title}</strong>
          <span style={{ color: 'var(--text-dim)' }}>{experience.dates}</span>
        </div>
        <ul style={{ margin: '8px 0 0 1.1rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
          {experience.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </div>

      <div style={panelStyle}>
        <strong>Education</strong>
        {education.map((item) => (
          <p key={item.degree} style={{ marginTop: '10px', color: 'var(--text-body)' }}>
            <strong>{item.degree}</strong> · {item.school}<br />
            {item.dates}
          </p>
        ))}
      </div>

      <div style={panelStyle}>
        <strong>Certifications and Development</strong>
        <ul style={{ margin: '8px 0 0 1.1rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
          {certifications.map((cert) => <li key={cert.name}>{cert.name} · {cert.status}</li>)}
        </ul>
      </div>

      <div style={panelStyle}>
        <strong style={{ display: 'block', marginBottom: '10px' }}>Technical Skills</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {skillGroups.flatMap((group) => group.slice(1)).map((skill) => (
            <span key={skill} className="tech-badge">{skill}</span>
          ))}
        </div>
      </div>

      <ContactLinks soundEnabled={soundEnabled} />
      <a href={RESUME_URL} download={RESUME_FILENAME} className="btn-primary-white" style={{ alignSelf: 'flex-start' }}>
        <Download size={16} /><span>Download Resume (PDF)</span>
      </a>
      <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn-secondary-glass" style={{ alignSelf: 'flex-start' }}>
        <ArrowUpRight size={16} /><span>Open LinkedIn Profile</span>
      </a>
    </div>
  );
}

export default function Modals({ activeModal, onClose, soundEnabled }) {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  if (!activeModal) return null;

  const handleClose = () => {
    if (soundEnabled) playClickSound();
    onClose();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (soundEnabled) playClickSound();
    const subject = encodeURIComponent('Portfolio message from ' + formData.name);
    const body = encodeURIComponent(formData.message + '\n\n---\nSender: ' + formData.name + '\nEmail: ' + formData.email);
    window.location.href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content interactive" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {activeModal === 'work' && 'Projects'}
            {activeModal === 'about' && 'About Me'}
            {activeModal === 'contact' && "Let's Connect"}
            {activeModal === 'resume' && 'Resume'}
          </h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            onMouseEnter={() => soundEnabled && playHoverSound()}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {activeModal === 'work' && <ProjectGrid />}
        {activeModal === 'about' && <AboutContent />}

        {activeModal === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <ContactLinks soundEnabled={soundEnabled} />
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Opening Email Client...</h3>
                <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>
                  Preparing your email to <strong>{EMAIL}</strong>.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your Name"
                    className="form-input"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    required
                    placeholder={'Write a message to ' + EMAIL + '...'}
                    className="form-textarea"
                    value={formData.message}
                    onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary-white"
                  style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                  onMouseEnter={() => soundEnabled && playHoverSound()}
                >
                  <Send size={16} /><span>Send Mail to Keerthana</span>
                </button>
              </form>
            )}
          </div>
        )}

        {activeModal === 'resume' && <ResumeContent soundEnabled={soundEnabled} />}
      </div>
    </div>
  );
}
