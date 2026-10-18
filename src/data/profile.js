// Single source for portfolio content, shared by the scroll sections and the modals.

export const EMAIL = 'keerthanagandhi1104@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/keerthana-gandhi13aa64282';
export const GITHUB = 'https://github.com/keerthanagandhi11';
export const PHONE = '+91 70107 21178';
export const PHONE_HREF = 'tel:+917010721178';

// Served from public/; replace that file to update the resume.
export const RESUME_URL = '/Keerthana_Gandhirajan_Resume.pdf';
export const RESUME_FILENAME = 'Keerthana_Gandhirajan_Resume.pdf';

export const ROLE = 'Gen AI Engineer';

export const projects = [
  {
    tag: 'Agentic AI · LangGraph · MCP',
    name: 'IT Operations AI Agent',
    summary: 'A LangGraph agent that turns natural-language ops requests into guarded tool calls over MCP for job-status checks and incident triage.',
    situation: 'Level-1 operations work (job-status polling, log checks, first-pass triage) is repetitive and runbook-driven, and it slows the response to real incidents.',
    task: 'Build an agent that maps natural-language operations requests to deterministic tool calls and returns structured triage context.',
    action: 'Modelled the workflow as a LangGraph state graph on the Claude API. A planner node routes each request to typed tools exposed through Model Context Protocol (MCP) servers for job-status queries and issue triage, while specialised subagents handle diagnosis and summarisation with state carried across steps.',
    result: 'A working agent that resolves routine operations requests end to end and hands off structured context for escalation, bringing production runbook practice into an LLM workflow.',
    tech: ['LangGraph', 'Claude API', 'MCP', 'Tool calling', 'Subagents', 'State graphs', 'Python']
  },
  {
    tag: 'Generative AI · RAG · Vector Search',
    name: 'RAG PDF Chatbot',
    summary: 'A retrieval-augmented generation pipeline that answers questions grounded only in the passages retrieved from uploaded PDFs.',
    situation: 'Finding answers in long PDFs is slow, and general-purpose chatbots answer from model memory instead of the source document.',
    task: 'Build a question-answering system whose answers are grounded in, and limited to, the uploaded documents.',
    action: 'Built an ingestion pipeline that parses PDFs, splits text into overlapping chunks, generates embeddings and indexes them in a vector database (Pinecone / Weaviate). At query time a LangChain retriever runs top-k semantic similarity search and injects the retrieved context into a grounded prompt for the Claude API.',
    result: 'Context-aware answers traceable to source passages, which cuts manual search time and reduces ungrounded responses.',
    tech: ['RAG', 'Embeddings', 'Semantic search', 'Pinecone / Weaviate', 'LangChain', 'Claude API', 'Prompt engineering']
  },
  {
    tag: 'Backend · REST API · Automation',
    name: 'One-Click Job Notification System',
    summary: 'A REST backend that filters openings by role, location and keywords and pushes matched alerts in real time.',
    situation: 'Job seekers miss openings because they check several portals by hand.',
    task: 'Design a backend that delivers relevant job alerts in real time with minimal user effort.',
    action: 'Designed a REST API in Python (Flask / Django) with keyword, role and location filters, a preference-matching recommender and real-time alert dispatch. Modelled and persisted jobs and user profiles in SQL / MongoDB.',
    result: 'Job discovery reduced to a single click, with alerts matched to each user\'s stored preferences.',
    tech: ['REST API design', 'Flask / Django', 'SQL / MongoDB', 'Recommendation logic', 'Backend development']
  },
  {
    tag: 'NLP · Text Classification',
    name: 'X Sentiment Analysis',
    summary: 'An NLP pipeline that ingests topic-filtered posts from the X API and classifies polarity.',
    situation: 'Public opinion on X shifts quickly and is buried in large volumes of unstructured text.',
    task: 'Build a pipeline that classifies posts on a topic as positive, negative or neutral.',
    action: 'Integrated the X API with token-based authentication to ingest topic-filtered posts, built a preprocessing stage (URL and mention stripping, normalisation, tokenisation) and classified sentiment polarity in Python.',
    result: 'Raw, noisy posts turned into structured sentiment signals for a chosen topic.',
    tech: ['Python', 'NLP', 'Text preprocessing', 'Sentiment classification', 'API integration']
  },
  {
    tag: 'Data Engineering · Visualization',
    name: 'Financial Tracking & Visualization',
    summary: 'A real-time market-data dashboard with time-series charts and a portfolio tracker.',
    situation: 'Investments tracked across scattered sources make performance hard to read at a glance.',
    task: 'Build one interactive tool for monitoring stocks and investment positions.',
    action: 'Integrated a market-data API for real-time quotes, built dynamic time-series visualisations and an investment-tracking module on top of the live feed.',
    result: 'A single dashboard for market movement and portfolio performance.',
    tech: ['Python', 'REST API integration', 'Time-series visualisation', 'Real-time data handling']
  },
  {
    tag: 'Web Engineering · Responsive UI',
    name: 'University Website',
    summary: 'A responsive, content-driven site with a student portal and course catalog.',
    situation: 'Students needed one place to browse courses and reach their information.',
    task: 'Develop a responsive site with dynamic content management.',
    action: 'Built a responsive front end in HTML5, CSS3 and Bootstrap\'s grid system, with a student portal and a data-driven course catalog that adapts across mobile and desktop breakpoints.',
    result: 'A mobile-friendly site whose content updates without editing page markup.',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'Responsive design', 'Web development']
  }
];

export const skillGroups = [
  ['Programming', 'Python', 'Java', 'SQL', 'OOP', 'Data structures and algorithms'],
  ['ML and NLP', 'Machine learning', 'NLP', 'Sentiment analysis', 'PyTorch', 'TensorFlow', 'scikit-learn'],
  ['LLMs and agents', 'Generative AI', 'Prompt engineering', 'Claude API', 'Tool calling', 'Multi-agent systems', 'MCP'],
  ['RAG and frameworks', 'RAG', 'Embeddings', 'Semantic search', 'Vector databases', 'LangChain', 'LangGraph', 'LlamaIndex', 'CrewAI', 'AutoGen'],
  ['Application stack', 'REST APIs', 'FastAPI', 'Flask', 'Django', 'Streamlit', 'Gradio', 'MongoDB', 'Pinecone', 'FAISS'],
  ['Engineering practice', 'Testing', 'Deployment', 'Monitoring', 'Debugging', 'Docker', 'Git', 'GitHub']
];

export const experience = {
  company: 'Kyndryl',
  title: 'Representative, Computer Operations',
  dates: 'Jun 2025 – Present · Full-time, On-site',
  points: [
    'Operate and monitor enterprise batch workloads and job schedules in Universal Automation Center (UAC), following SOPs and runbooks for delayed jobs.',
    'Run first-level incident triage: capture diagnostics, escalate exceptions to resolver teams and maintain shift handover records.'
  ]
};

export const education = [
  { degree: 'Master of Computer Applications', school: 'Bharathidasan University, Tiruchirappalli', dates: 'Jul 2025 – Present · Expected Jul 2027' },
  { degree: 'Bachelor of Computer Applications', school: 'SASTRA, Thanjavur', dates: 'Sep 2022 – Jul 2025' }
];

export const certifications = [
  { name: 'Meta Back-End Developer Professional Certificate', status: '2024' },
  { name: 'AI at Kyndryl – Mainframe Modernization', status: 'Sep 2026' },
  { name: 'Kyndryl AI Agent OPS Specialist Skilling Program (manager-nominated)', status: 'In progress', live: true },
  { name: 'IBM RAG and Agentic AI Professional Certification', status: 'In progress', live: true }
];
