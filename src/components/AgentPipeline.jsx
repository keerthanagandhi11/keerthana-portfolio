import React, { useEffect, useRef, useState } from 'react';

// Animated diagram of the agent loop used in OpsPilot, plus a terminal that types a simplified version of it.
const NODES = [
  { id: 'query', x: 70, y: 70, label: 'Query', sub: 'user question' },
  { id: 'plan', x: 250, y: 70, label: 'Plan', sub: 'LLM decides next action' },
  { id: 'tools', x: 430, y: 70, label: 'Tool calls', sub: 'search · read_page · MCP' },
  { id: 'draft', x: 430, y: 210, label: 'Draft + cite', sub: 'answer with [S1] ids' },
  { id: 'verify', x: 250, y: 210, label: 'Verify', sub: 'claim-level self-check' },
  { id: 'answer', x: 70, y: 210, label: 'Answer', sub: 'or NOT_FOUND' }
];

const EDGES = [
  ['flow-1', 'M 125 70 L 195 70'],
  ['flow-2', 'M 305 70 L 375 70'],
  ['flow-3', 'M 430 98 L 430 182'],
  ['flow-4', 'M 375 210 L 305 210'],
  ['flow-5', 'M 195 210 L 125 210'],
  ['loop-tools', 'M 400 42 C 400 0, 280 0, 280 42'],
  ['loop-revise', 'M 250 182 C 250 150, 250 130, 250 98']
];

const CODE = `async def run_agent(question, session, llm, settings):
    reg, tools = SourceRegistry(), Toolbox(session, reg, settings)
    messages = [system(AGENT_SYSTEM), user(question)]
    retried = False
    for turn in range(settings.agent_max_steps + 3):
        msg = await llm.complete(messages, tools=TOOL_SPECS)
        if calls := msg.get("tool_calls"):
            for call in calls:
                step, result = tools.run(call.name, call.arguments)
                yield step                    # streamed live to the chat
                messages.append(tool_reply(call, result))
            continue
        text = msg["content"]
        if "NOT_FOUND" in text:
            yield Answer(NOT_FOUND_TEXT)
            return
        ids = cited_ids(text, reg)            # only pages the agent really read
        ok, problem = await verify(text, ids, reg, llm)
        if not ok and not retried:
            retried = True
            messages += revise_with(problem)  # one revision round
            continue
        yield Answer(text, sources=[reg.source(i) for i in ids])
        return`;

function TypingCode() {
  const ref = useRef(null);
  const [shown, setShown] = useState(CODE);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let i = 0;
      setShown('');
      const tick = () => {
        i = Math.min(CODE.length, i + 3);
        setShown(CODE.slice(0, i));
        if (i < CODE.length) timer = setTimeout(tick, 16);
      };
      tick();
    }, { threshold: 0.35 });
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <div className="terminal" ref={ref}>
      <div className="terminal-bar">
        <i /><i /><i />
        <span>opspilot/agent.py · simplified</span>
      </div>
      <pre aria-label="Simplified agent loop in Python"><code>{shown}<span className="caret">▌</span></code></pre>
    </div>
  );
}

export default function AgentPipeline() {
  return (
    <div className="pipeline-grid">
      <figure className="pipeline">
        <svg viewBox="0 0 500 270" role="img" aria-label="Agent loop: query, plan, tool calls, draft with citations, verify, answer">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="pipe-arrow" />
            </marker>
          </defs>
          {EDGES.map(([id, d]) => (
            <path key={id} id={id} d={d} className={`pipe-edge ${id.startsWith('loop') ? 'loop' : ''}`} markerEnd="url(#arrow)" />
          ))}
          {EDGES.map(([id], i) => (
            <circle key={`p-${id}`} r="4" className={`pipe-pulse ${id.startsWith('loop') ? 'loop' : ''}`}>
              <animateMotion dur={id.startsWith('loop') ? '2.6s' : '1.8s'} begin={`${i * 0.3}s`} repeatCount="indefinite">
                <mpath href={`#${id}`} />
              </animateMotion>
            </circle>
          ))}
          {NODES.map((n) => (
            <g key={n.id} className={`pipe-node node-${n.id}`} transform={`translate(${n.x} ${n.y})`}>
              <rect x="-55" y="-28" width="110" height="56" rx="10" />
              <text y="-3" className="pipe-label">{n.label}</text>
              <text y="15" className="pipe-sub">{n.sub}</text>
            </g>
          ))}
          <text x="340" y="12" className="pipe-note">re-query</text>
          <text x="258" y="142" className="pipe-note">revise</text>
        </svg>
        <figcaption>
          The loop behind OpsPilot: the model plans, calls tools as often as it needs, cites stable source ids,
          then a separate verifier checks every claim and sends unsupported ones back for revision.
        </figcaption>
      </figure>
      <TypingCode />
    </div>
  );
}
