"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveLoop } from "@/shared/hooks/use-active-loop";
import { Spotlight } from "@/shared/components/fx/spotlight";
import { cn } from "@/shared/lib/utils";
import { Bot, Gauge, Globe2, Layers3, ServerCog } from "lucide-react";
import { TechIcon } from "@/shared/components/brand/tech-icon";
import { useLoopActive } from "@/shared/hooks/use-loop-active";

// Illustrative, generic content — not metrics from any client project.
const DEPLOY_LINES = [
  { text: "$ git push origin main", tone: "cmd" },
  { text: "✓ lint e tipos", tone: "ok" },
  { text: "✓ testes unitários e de integração", tone: "ok" },
  { text: "✓ e2e com Playwright", tone: "ok" },
  { text: "→ build e deploy em produção", tone: "info" },
  { text: "● serviço saudável", tone: "live" },
] as const;

const AGENT_STEPS = ["Entende a pergunta do cliente", "Consulta o estoque", "Calcula frete e prazo", "Responde no WhatsApp"];

const KEYS = ["Node.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Redis", "LangChain", "AWS"];

// Order the keycaps get "typed" in during the loop.
const KEY_SEQUENCE = [0, 3, 1, 6, 4, 2, 7, 5];

function DeployTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<number>(DEPLOY_LINES.length);
  const tick = useCallback(() => setShown((count) => (count >= DEPLOY_LINES.length + 2 ? 1 : count + 1)), []);
  const active = useActiveLoop(ref, tick, 700);
  const visible = active ? Math.min(shown, DEPLOY_LINES.length) : DEPLOY_LINES.length;
  return (
    <div ref={ref} className="terminal window" aria-hidden="true">
      <div className="window__bar"><span className="window__dots"><i /><i /><i /></span><span>deploy</span></div>
      <ol className="terminal__lines mono">
        {DEPLOY_LINES.map((line, index) => (
          <li key={line.text} className={cn(`is-${line.tone}`, index >= visible && "is-hidden", active && index === visible - 1 && "is-last")}>{line.text}</li>
        ))}
      </ol>
      <div className="terminal__progress"><span style={{ transform: `scaleX(${visible / DEPLOY_LINES.length})` }} /></div>
    </div>
  );
}

function AgentTrace() {
  const ref = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(0);
  const tick = useCallback(() => setStep((current) => (current >= AGENT_STEPS.length + 2 ? 0 : current + 1)), []);
  const active = useActiveLoop(ref, tick, 750);
  const reached = active ? step : AGENT_STEPS.length;
  return (
    <ol ref={ref} className="agent-trace" aria-hidden="true">
      {AGENT_STEPS.map((label, index) => (
        <li key={label} className={cn(index < reached && "is-done", active && index === reached && "is-running")}>
          <span className="agent-trace__check" />
          {label}
        </li>
      ))}
    </ol>
  );
}

function StackKeys() {
  const ref = useRef<HTMLUListElement>(null);
  const [cursor, setCursor] = useState(-1);
  const tick = useCallback(() => setCursor((current) => (current + 1) % KEY_SEQUENCE.length), []);
  const active = useActiveLoop(ref, tick, 650);
  const pressed = active && cursor >= 0 ? KEY_SEQUENCE[cursor] : -1;
  return (
    <ul ref={ref} className="keys" aria-label="Tecnologias principais">
      {KEYS.map((key, index) => (
        <li key={key} className="key">
          <span className={cn("key__cap mono", index === pressed && "is-pressed")}><TechIcon name={key} className="key__icon" /><span>{key}</span></span>
        </li>
      ))}
    </ul>
  );
}

// One period of the curve; starts and ends flat at the same height so two copies tile seamlessly.
const WAVE = "M0 58 C25 58 40 30 70 34 S115 66 150 50 S205 20 235 32 S275 58 300 58";

function LatencyLine() {
  const ref = useLoopActive<HTMLDivElement>();
  return (
    <div ref={ref} className="latency" aria-hidden="true">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="latency-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#ffd43b" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ffd43b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="latency__grid">
          <line x1="0" x2="300" y1="22.5" y2="22.5" />
          <line x1="0" x2="300" y1="45" y2="45" />
          <line x1="0" x2="300" y1="67.5" y2="67.5" />
        </g>
        <g className="latency__track">
          {[0, 300].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <path className="latency__area" d={`${WAVE} V90 H0 Z`} fill="url(#latency-fill)" />
              <path className="latency__line" d={WAVE} />
            </g>
          ))}
        </g>
      </svg>
      <span className="latency__scan" />
    </div>
  );
}

function LocalClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = () => new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/Bahia" }).format(new Date());
    const first = window.setTimeout(() => setTime(format()), 0);
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return (
    <div className="clock-wrap">
      <span className="clock__live"><i />Horário de Salvador, UTC−3</span>
      <p className="clock mono tabular" aria-label="Horário em Salvador">{time ?? "--:--:--"}</p>
    </div>
  );
}

export function Capabilities() {
  const bentoRef = useLoopActive<HTMLDivElement>();
  return (
    <section className="capabilities rail-cell" aria-labelledby="capabilities-title">
      <h2 id="capabilities-title" className="section-title">
        O que eu entrego.
        <span className="muted">Sistemas que aguentam tráfego, dinheiro de verdade e mudança.</span>
      </h2>

      <div ref={bentoRef} className="bento">
        <Spotlight className="bento__cell bento__cell--wide glow-border">
          <div className="bento__text">
            <span className="bento__icon" aria-hidden="true"><ServerCog /></span>
            <h3>Backend e APIs</h3>
            <p>Contratos claros, regras de negócio testadas e integrações de pagamento e frete que não quebram na sexta à noite.</p>
          </div>
          <DeployTerminal />
        </Spotlight>

        <Spotlight className="bento__cell">
          <div className="bento__text">
            <span className="bento__icon" aria-hidden="true"><Bot /></span>
            <h3>IA aplicada</h3>
            <p>Agentes que consultam dados reais e agem: estoque, atendimento e automação.</p>
          </div>
          <AgentTrace />
        </Spotlight>

        <Spotlight className="bento__cell bento__cell--chart">
          <div className="bento__text">
            <span className="bento__icon" aria-hidden="true"><Gauge /></span>
            <h3>Desempenho</h3>
            <p>Cache, filas e consultas medidas antes de otimizar.</p>
          </div>
          <LatencyLine />
        </Spotlight>

        <Spotlight className="bento__cell bento__cell--wide">
          <div className="bento__text">
            <span className="bento__icon" aria-hidden="true"><Layers3 /></span>
            <h3>Stack do dia a dia</h3>
            <p>Ferramentas que uso em produção, escolhidas pelo problema e não pela moda.</p>
          </div>
          <StackKeys />
        </Spotlight>

        <Spotlight className="bento__cell bento__cell--clock">
          <div className="bento__text">
            <span className="bento__icon" aria-hidden="true"><Globe2 /></span>
            <h3>Trabalho remoto</h3>
            <p>De Salvador para projetos no Brasil e fora.</p>
          </div>
          <LocalClock />
        </Spotlight>
      </div>
    </section>
  );
}
