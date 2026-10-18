// Single source for portfolio content, shared by the scroll sections and the modals.

export const EMAIL = 'keerthanagandhi1104@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/keerthana-gandhi13aa64282';
export const GITHUB = 'https://github.com/keerthanagandhi11';
export const PHONE = '+91 70107 21178';
export const PHONE_HREF = 'tel:+917010721178';

// Served from public/; replace that file to update the resume.
export const RESUME_URL = `${import.meta.env.BASE_URL}Keerthana_Gandhirajan_Resume.pdf`;
export const RESUME_FILENAME = 'Keerthana_Gandhirajan_Resume.pdf';

export const ROLE = 'Gen AI Engineer';
export const ROLE_FOCUS = 'Gen AI & Agentic AI roles';

// Rotating specialisms in the hero
export const SPECIALISMS = [
  'agentic RAG systems',
  'LangGraph state machines',
  'MCP tool servers',
  'hybrid retrieval pipelines',
  'self-verifying LLM agents'
];

export const projects = [
  {
    tag: 'Agentic RAG · Tool Calling · Self-Verification',
    name: 'OpsPilot: Agentic RAG for Incident PDFs',
    featured: true,
    summary: 'An agentic RAG system that plans retrieval over incident PDFs, cites every fact to a file and page, and verifies its own answer before responding.',
    situation: 'After an incident, facts are scattered across reports, shift logs and post-mortems, and general chatbots can produce plausible but ungrounded answers.',
    task: 'Ship a free, deployable assistant that answers incident questions with page-level citations, refuses when evidence is missing, and degrades gracefully when the LLM is unavailable.',
    action: 'Wrote a custom plan → act → answer → verify tool-calling loop on gpt-oss-120b (Groq, OpenAI-compatible API) with four tools: search_documents, read_page, find_timeline and list_documents. Retrieval is hybrid: BM25 keyword search plus bge-small-en-v1.5 embeddings (fastembed / ONNX on CPU), merged with Reciprocal Rank Fusion over page-bounded 900-character chunks with 150-character overlap. Every retrieved page gets a stable source id; a separate verifier call checks each claim against the cited pages and feeds unsupported claims back for one revision. Served through FastAPI with a Gradio 6 chat that streams each agent step live.',
    result: 'A live, MIT-licensed app on Render with grounded, cited answers, an explicit NOT_FOUND refusal, a three-tier fallback (agent → single-shot RAG → quote mode), per-visitor rate limiting, in-memory PDF handling, Docker, GitHub Actions CI and 72 automated tests. On a 23-question eval set it answered 18/18 correctly with the right page cited, refused 5/5 unanswerable questions, and had a 2.2 s median response time.',
    tech: ['Agentic RAG', 'Tool calling', 'gpt-oss-120b / Groq', 'Hybrid search (BM25 + embeddings)', 'Reciprocal Rank Fusion', 'Self-verification', 'FastAPI', 'Gradio', 'Docker', 'GitHub Actions', 'pytest'],
    links: [
      ['Live demo', 'https://opspilot-7mqm.onrender.com'],
      ['Source', 'https://github.com/keerthanagandhi11/opspilot']
    ]
  },
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
  ['LLM orchestration & agents', 'Generative AI', 'Agentic AI', 'Tool calling', 'LangGraph', 'Multi-agent systems', 'Subagents', 'MCP', 'Claude API', 'OpenAI-compatible APIs', 'Groq', 'Prompt engineering'],
  ['Retrieval & RAG', 'RAG', 'Agentic RAG', 'Embeddings', 'Semantic search', 'BM25', 'Reciprocal Rank Fusion', 'Chunking strategies', 'Vector databases', 'Pinecone', 'FAISS', 'LangChain', 'LlamaIndex'],
  ['Reliability & evaluation', 'Self-verification', 'Grounded citations', 'Fallback chains', 'Rate limiting', 'Input validation', 'pytest'],
  ['Serving & data', 'FastAPI', 'Gradio', 'Streamlit', 'REST API design', 'Pydantic', 'Flask', 'Django', 'MongoDB', 'SQL'],
  ['ML & NLP', 'NLP', 'Sentiment analysis', 'fastembed / ONNX Runtime', 'PyTorch', 'TensorFlow', 'scikit-learn'],
  ['Engineering', 'Python', 'Java', 'Docker', 'GitHub Actions CI', 'Ruff', 'Git', 'Data structures and algorithms']
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
