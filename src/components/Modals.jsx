import React, { useState } from 'react';
import { X, Send, CheckCircle2, Code2, Sparkles, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

const EMAIL = 'keerthanagandhi1104@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/keerthana-gandhi13aa64282';
const GITHUB = 'https://github.com/keerthanagandhi11';
const PHONE = '+91 70107 21178';

const projects = [
  {
    tag: 'Agentic AI · IT Operations',
    name: 'IT Operations AI Agent',
    situation: 'IT operations teams spend a lot of time on repetitive monitoring, job status checks, and first-level troubleshooting, which delays response to issues.',
    task: 'Build an AI agent that can understand operational requests and handle routine tasks with minimal manual effort.',
    action: 'Designed an agentic workflow using LangGraph and the Claude API, where the agent reasons through a request, picks the right tool, and acts. Connected tools through Model Context Protocol (MCP) for job status checks and issue triage, and used subagents for specialized tasks.',
    result: 'Delivered a working agent that automates routine operations tasks and speeds up issue handling, bringing enterprise operations experience into an AI-driven workflow.',
    tech: ['Agentic Workflow Orchestration', 'LangGraph', 'MCP', 'Subagents', 'Claude API', 'IT Operations Automation']
  },
  {
    tag: 'Generative AI · RAG',
    name: 'RAG PDF Chatbot',
    situation: "Finding answers inside long PDF documents is slow, and general chatbots can give answers that aren't grounded in the source.",
    task: 'Build a chatbot that answers questions accurately using only the content of uploaded PDFs.',
    action: 'Extracted and split PDF text into chunks, converted them into embeddings, and stored them in a vector database (Pinecone/Weaviate). Built a retrieval pipeline with LangChain that fetches the most relevant chunks and passes them to the Claude API to generate answers grounded in the document.',
    result: 'Delivered a chatbot that gives context-aware answers from PDFs instead of guesses, cutting the time spent searching manually.',
    tech: ['RAG', 'Vector Databases', 'LangChain', 'Claude API', 'Prompt Engineering', 'Python']
  },
  {
    tag: 'Automation · Job Search',
    name: 'One-Click Job Notification System',
    situation: 'Job seekers often miss openings because they have to check multiple portals manually.',
    task: 'Design a backend that delivers relevant job alerts in real time with minimal effort from the user.',
    action: 'Built a REST API with real-time alerts, filtering by role, location, and keywords, and personalized recommendations. Stored job and user data in a database.',
    result: "Reduced job hunting to a single click, with alerts matched to each user's preferences.",
    tech: ['REST API Design', 'Python (Flask/Django)', 'SQL/MongoDB', 'Backend Development']
  },
  {
    tag: 'NLP · Sentiment Analysis',
    name: 'X Sentiment Analysis',
    situation: 'Public opinion on X changes fast and is buried in large volumes of unstructured posts, which makes it hard to read manually.',
    task: 'Build a tool that automatically classifies posts as positive, negative, or neutral.',
    action: 'Connected to the X API using authenticated tokens, collected posts on a chosen topic, and cleaned the text by removing links, mentions, and noise. Applied text analysis in Python to classify each post by sentiment.',
    result: 'Delivered a working classifier that turns raw posts into clear sentiment insights.',
    tech: ['Python', 'API Integration', 'Text Analysis', 'Data Preprocessing']
  },
  {
    tag: 'Finance · Data Visualization',
    name: 'Financial Tracking & Visualization',
    situation: 'Tracking investments across scattered sources makes it hard to see performance at a glance.',
    task: 'Create an interactive tool for monitoring stocks and investments in one place.',
    action: 'Pulled real-time stock data through an API and built dynamic visualizations, along with an investment tracking feature.',
    result: 'Gave users a single dashboard to follow market movement and portfolio performance.',
    tech: ['Python', 'API Integration', 'Data Visualization', 'Real-Time Data Handling']
  },
  {
    tag: 'Web Development · Education',
    name: 'University Website',
    situation: 'Students needed one place to browse courses and access their information.',
    task: 'Develop a responsive website with dynamic content management.',
    action: 'Built the site with HTML, CSS, and Bootstrap, and added a student portal and an interactive course catalog. Designed the layout to adapt to mobile and desktop screens.',
    result: 'Delivered a mobile-friendly site where content can be updated without manually editing pages.',
    tech: ['HTML', 'CSS', 'Bootstrap', 'Responsive Design', 'Web Development']
  }
];

const skillGroups = [
  ['Programming', 'Python', 'Java', 'SQL', 'OOP', 'Data structures and algorithms'],
  ['AI and NLP', 'AI/ML fundamentals', 'NLP', 'Sentiment analysis', 'PyTorch', 'TensorFlow', 'scikit-learn'],
  ['LLMs and agents', 'Generative AI', 'Prompt engineering', 'Claude API', 'Tool calling', 'Multi-agent systems', 'MCP'],
  ['RAG and frameworks', 'RAG', 'Embeddings', 'Semantic search', 'Vector databases', 'LangChain', 'LangGraph', 'LlamaIndex', 'CrewAI', 'AutoGen'],
  ['Application development', 'REST APIs', 'FastAPI', 'Flask', 'Django', 'Streamlit', 'Gradio', 'MongoDB', 'Pinecone', 'FAISS'],
  ['Engineering', 'Testing', 'Deployment', 'Monitoring', 'Debugging', 'Docker', 'Git', 'GitHub']
];

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
  background: 'rgba(255,255,255,0.08)',
  padding: '1.2rem',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.15)'
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
      <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.9)' }}>
        I'm <strong>Keerthana Gandhirajan</strong>, a computer operations professional at Kyndryl and
        MCA student building AI applications in Python. My recent work explores agentic IT operations,
        retrieval-augmented generation, and NLP.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '8px' }}>
            <Code2 size={20} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Technical Skills</strong>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>
            <strong style={{ color: '#fff' }}>Languages:</strong> Python, Java, SQL<br />
            <strong style={{ color: '#fff' }}>AI:</strong> Generative AI, LLMs, NLP, PyTorch, TensorFlow<br />
            <strong style={{ color: '#fff' }}>Agents and RAG:</strong> LangGraph, LangChain, MCP, embeddings, vector search<br />
            <strong style={{ color: '#fff' }}>Apps:</strong> FastAPI, Flask, Django, Streamlit, Gradio<br />
            <strong style={{ color: '#fff' }}>Data:</strong> MongoDB, Pinecone, FAISS
          </p>
        </div>

        <div style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '8px' }}>
            <Sparkles size={20} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Current Learning</strong>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            Enrolled in Kyndryl's AI Agent OPS Specialist Skilling Program and pursuing IBM's
            RAG and Agentic AI Professional Certification.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>6</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Selected Projects</div>
        </div>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>MCA</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bharathidasan University</div>
        </div>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>2025</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Joined Kyndryl</div>
        </div>
      </div>
    </div>
  );
}

function ContactLinks({ soundEnabled }) {
  const links = [
    { href: 'mailto:' + EMAIL, label: 'Email', icon: <Mail size={15} /> },
    { href: 'tel:+917010721178', label: 'Call', icon: <Phone size={15} /> },
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
        <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>Aspiring AI Engineer · Gen AI Engineer · Chennai, Tamil Nadu</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <a href={'mailto:' + EMAIL} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>{EMAIL}</a>
          <a href="tel:+917010721178" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>{PHONE}</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>LinkedIn</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>GitHub</a>
        </div>
      </div>

      <div style={panelStyle}>
        <strong>Experience</strong>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          <strong>Kyndryl · Representative computer operation</strong>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Jun 2025 – Present · Full-time, On-site</span>
        </div>
        <ul style={{ margin: '8px 0 0 1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          <li>Monitor scheduled workloads and job status in UAC using operating procedures and runbooks.</li>
          <li>Record initial checks and issue details, escalate exceptions, and update shift handovers.</li>
        </ul>
      </div>

      <div style={panelStyle}>
        <strong>Education</strong>
        <p style={{ marginTop: '10px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Master of Computer Applications</strong> · Bharathidasan University, Tiruchirappalli<br />
          Jul 2025 – Present · Expected Jul 2027
        </p>
        <p style={{ marginTop: '10px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Bachelor of Computer Applications</strong> · SASTRA, Thanjavur<br />
          Sep 2022 – Jul 2025
        </p>
      </div>

      <div style={panelStyle}>
        <strong>Certifications and Development</strong>
        <ul style={{ margin: '8px 0 0 1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          <li>Meta Back-End Developer Professional Certificate · 2024</li>
          <li>AI at Kyndryl – Mainframe Modernization · Sep 2026</li>
          <li>Kyndryl AI Agent OPS Specialist Skilling Program · Enrolled</li>
          <li>IBM RAG and Agentic AI Professional Certification · In progress</li>
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
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
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
