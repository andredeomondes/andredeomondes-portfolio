"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveLoop } from "@/shared/hooks/use-active-loop";
import { Spotlight } from "@/shared/components/fx/spotlight";
import { cn } from "@/shared/lib/utils";

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

function useInViewOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, seen };
}

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
          <li key={line.text} className={cn(`is-${line.tone}`, index >= visible && "is-hidden")}>{line.text}</li>
        ))}
      </ol>
    </div>
  );
}

function AgentTrace() {
  const { ref, seen } = useInViewOnce<HTMLOListElement>();
  return (
    <ol ref={ref} className={cn("agent-trace", seen && "is-playing")} aria-hidden="true">
      {AGENT_STEPS.map((step, index) => (
        <li key={step} style={{ transitionDelay: `${index * 420}ms` }}>
          <span className="agent-trace__check" />
          {step}
        </li>
      ))}
    </ol>
  );
}

function StackKeys() {
  const { ref, seen } = useInViewOnce<HTMLUListElement>();
  return (
    <ul ref={ref} className={cn("keys", seen && "is-playing")} aria-label="Tecnologias principais">
      {KEYS.map((key, index) => (
        <li key={key} className="key" style={{ animationDelay: `${index * 90}ms` }}>
          <span className="key__cap mono">{key}</span>
        </li>
      ))}
    </ul>
  );
}

function LatencyLine() {
  const { ref, seen } = useInViewOnce<SVGSVGElement>();
  return (
    <svg ref={ref} className={cn("latency", seen && "is-drawn")} viewBox="0 0 300 90" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="latency-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffd43b" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffd43b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="latency__area" d="M0 70 C30 62 45 30 75 38 S120 70 150 48 S205 18 230 30 S275 52 300 22 V90 H0 Z" fill="url(#latency-fill)" />
      <path className="latency__line" d="M0 70 C30 62 45 30 75 38 S120 70 150 48 S205 18 230 30 S275 52 300 22" pathLength={1} />
    </svg>
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
  return <p className="clock mono tabular" aria-label="Horário em Salvador">{time ?? "--:--:--"}</p>;
}

export function Capabilities() {
  return (
    <section className="capabilities rail-cell" aria-labelledby="capabilities-title">
      <h2 id="capabilities-title" className="section-title">
        O que eu entrego.
        <span className="muted">Sistemas que aguentam tráfego, dinheiro de verdade e mudança.</span>
      </h2>

      <div className="bento">
        <Spotlight className="bento__cell bento__cell--wide">
          <div className="bento__text">
            <h3>Backend e APIs</h3>
            <p>Contratos claros, regras de negócio testadas e integrações de pagamento e frete que não quebram na sexta à noite.</p>
          </div>
          <DeployTerminal />
        </Spotlight>

        <Spotlight className="bento__cell">
          <div className="bento__text">
            <h3>IA aplicada</h3>
            <p>Agentes que consultam dados reais e agem: estoque, atendimento e automação.</p>
          </div>
          <AgentTrace />
        </Spotlight>

        <Spotlight className="bento__cell">
          <div className="bento__text">
            <h3>Desempenho</h3>
            <p>Cache, filas e consultas medidas antes de otimizar.</p>
          </div>
          <LatencyLine />
        </Spotlight>

        <Spotlight className="bento__cell bento__cell--wide">
          <div className="bento__text">
            <h3>Stack do dia a dia</h3>
            <p>Ferramentas que uso em produção, escolhidas pelo problema e não pela moda.</p>
          </div>
          <StackKeys />
        </Spotlight>

        <Spotlight className="bento__cell bento__cell--clock">
          <div className="bento__text">
            <h3>Trabalho remoto</h3>
            <p>De Salvador para projetos no Brasil e fora.</p>
          </div>
          <LocalClock />
        </Spotlight>
      </div>
    </section>
  );
}
