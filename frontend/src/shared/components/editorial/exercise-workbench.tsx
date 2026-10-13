"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { gsap } from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Lightbulb,
} from "lucide-react";
import type { ExerciseContent } from "@/lib/exercise-content";

function CodePanel({ code, label }: { code: string; label: string }) {
  return (
    <div className="group border border-line bg-ink transition-colors hover:border-signal">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 transition-colors group-hover:border-signal/50">
        <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-dim">{label}</span>
        <Code2 className="size-4 text-signal transition-transform group-hover:-translate-y-0.5 group-hover:rotate-6" aria-hidden="true" />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-paper sm:p-6"><code>{code}</code></pre>
    </div>
  );
}

function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className="inline-flex min-h-10 items-center gap-2 border border-line px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-dim transition-colors hover:border-signal hover:bg-signal hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      aria-label={copied ? "Copiado" : label}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copiado" : label}
    </button>
  );
}

export function ExerciseWorkbench({ content, unit }: { content: ExerciseContent; unit: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const exercisePanelRef = useRef<HTMLDivElement>(null);
  const exercise = content.exercises[activeIndex];
  const categories = useMemo(
    () => Array.from(new Set(content.exercises.map((item) => item.category))),
    [content.exercises],
  );

  useLayoutEffect(() => {
    if (!exercisePanelRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        exercisePanelRef.current,
        { autoAlpha: 0.35, x: 10 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.32,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
        },
      );
    }, exercisePanelRef);

    return () => context.revert();
  }, [activeIndex]);

  if (!exercise) return null;

  function selectExercise(index: number) {
    setActiveIndex(index);
  }

  const progress = ((activeIndex + 1) / content.exercises.length) * 100;

  return (
    <section className="mt-20 border border-line bg-panel" aria-labelledby="exercise-workbench-title">
      <header className="border-b border-line">
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="label text-signal">Prática guiada / unidade {String(unit).padStart(2, "0")}</p>
            <h2 id="exercise-workbench-title" className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-paper sm:text-5xl">
              Um problema de cada vez.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-dim">
            Leia o contrato, escreva sua tentativa e confira os casos esperados. A resolução de referência permanece visível ao final de cada exercício.
          </p>
        </div>
        <div className="h-1 bg-line" aria-hidden="true">
          <div className="h-full bg-signal transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
        <nav className="border-b border-line lg:border-b-0 lg:border-r" aria-label="Exercícios da unidade">
          <div className="border-b border-line p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{content.title}</p>
            <p className="mt-2 text-sm leading-6 text-paper">{content.exercises.length} exercícios organizados por dificuldade.</p>
          </div>

          <div className="max-h-[360px] overflow-y-auto p-2 sm:p-3 lg:max-h-[760px]">
            {categories.map((category) => (
              <div key={category} className="mb-4 last:mb-0">
                <p className="px-3 pb-2 pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">{category}</p>
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
                  {content.exercises.map((item, index) => {
                    if (item.category !== category) return null;
                    const selected = index === activeIndex;
                    return (
                      <button
                        key={item.number}
                        type="button"
                        onClick={() => selectExercise(index)}
                        aria-current={selected ? "step" : undefined}
                        className={`grid min-h-14 grid-cols-[28px_minmax(0,1fr)] items-center gap-2 border px-3 text-left transition-[color,background-color,border-color,transform] ${selected ? "border-signal bg-signal text-ink" : "border-transparent text-dim hover:translate-x-1 hover:border-line hover:bg-ink hover:text-paper"}`}
                      >
                        <span className="font-mono text-[10px] tabular-nums">{String(item.number).padStart(2, "0")}</span>
                        <span className="truncate font-mono text-[10px] tracking-[-0.01em]">{item.identifier}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div ref={exercisePanelRef} className="min-w-0">
          <div className="border-b border-line p-5 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-signal">{exercise.category}</span>
              <span className="font-mono text-[10px] uppercase tabular-nums tracking-[0.12em] text-dim">
                exercício {String(activeIndex + 1).padStart(2, "0")} / {String(content.exercises.length).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-7 break-words font-mono text-2xl font-medium tracking-[-0.04em] text-paper sm:text-4xl">{exercise.title}</h3>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <section aria-labelledby="exercise-statement-title">
              <div className="grid gap-6 xl:grid-cols-[150px_minmax(0,1fr)]">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">01 / Entenda</p>
                  <h4 id="exercise-statement-title" className="mt-2 text-lg font-semibold text-paper">Enunciado</h4>
                </div>
                <div className="exercise-markdown max-w-3xl text-base leading-8 text-paper">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{exercise.statement}</ReactMarkdown>
                </div>
              </div>
            </section>

            <section className="mt-12 border-t border-line pt-10" aria-labelledby="exercise-attempt-title">
              <div className="grid gap-6 xl:grid-cols-[150px_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">02 / Implemente</p>
                  <h4 id="exercise-attempt-title" className="mt-2 text-lg font-semibold text-paper">Sua tentativa</h4>
                  <p className="mt-3 text-xs leading-6 text-dim">Comece pela assinatura e resolva sem olhar a resposta.</p>
                </div>
                <CodePanel code={exercise.starter} label="ponto de partida" />
              </div>
            </section>

            <section className="mt-12 border-t border-line pt-10" aria-labelledby="exercise-examples-title">
              <div className="grid gap-6 xl:grid-cols-[150px_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">03 / Preveja</p>
                  <h4 id="exercise-examples-title" className="mt-2 text-lg font-semibold text-paper">Entrada e saída</h4>
                  <p className="mt-3 text-xs leading-6 text-dim">Use estes exemplos para entender o contrato antes de programar.</p>
                </div>
                {exercise.examples.length ? (
                  <div className="divide-y divide-line border-y border-line">
                    {exercise.examples.map((example, index) => (
                      <div key={`${example.input}-${index}`} className="grid gap-4 px-3 py-5 transition-colors hover:bg-ink/70 sm:grid-cols-[1fr_1fr]">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">Entrada / chamada</p>
                          <code className="mt-2 block overflow-x-auto font-mono text-[12px] leading-6 text-paper">{example.input}</code>
                        </div>
                        <div className="border-t border-line pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">{example.kind === "error" ? "Erro esperado" : "Retorno esperado"}</p>
                          <code className={`mt-2 block overflow-x-auto font-mono text-[12px] leading-6 ${example.kind === "error" ? "text-paper" : "text-signal"}`}>{example.output}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-line p-5">
                    <p className="text-sm leading-7 text-dim">Este exercício monta uma estrutura em várias etapas. Use os cenários do teste abaixo como exemplos de entrada e comportamento esperado.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="mt-12 border-t border-line pt-10" aria-labelledby="exercise-tests-title">
              <div className="grid gap-6 xl:grid-cols-[150px_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">04 / Teste</p>
                  <h4 id="exercise-tests-title" className="mt-2 text-lg font-semibold text-paper">Prove que funciona</h4>
                  <p className="mt-3 text-xs leading-6 text-dim">O teste chama sua função e compara o resultado real com o esperado.</p>
                </div>
                <div className="min-w-0">
                  <div className="min-w-0 border border-line">
                    <div className="border-b border-line bg-paper p-5 text-ink">
                      <p className="text-sm font-semibold">Como utilizar este teste</p>
                      <ol className="mt-4 space-y-3 text-sm leading-6">
                        <li className="grid grid-cols-[24px_1fr] gap-2"><span className="font-mono text-xs">01</span><span>Implemente a função usando exatamente o nome e os parâmetros do enunciado.</span></li>
                        <li className="grid grid-cols-[24px_1fr] gap-2"><span className="font-mono text-xs">02</span><span>Salve sua implementação em <code className="font-mono text-xs">exercises.js</code>, na mesma pasta do teste.</span></li>
                        <li className="grid grid-cols-[24px_1fr] gap-2"><span className="font-mono text-xs">03</span><span>Abra o terminal nessa pasta e execute o comando abaixo.</span></li>
                        <li className="grid grid-cols-[24px_1fr] gap-2"><span className="font-mono text-xs">04</span><span>Se falhar, compare “esperado” com “recebido”; essa diferença mostra o caso que precisa ser corrigido.</span></li>
                      </ol>
                    </div>
                    <div className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <code className="block min-w-0 max-w-full overflow-x-auto whitespace-nowrap font-mono text-[11px] leading-6 text-paper">{exercise.testCommand}</code>
                      <CopyButton value={exercise.testCommand} label="Copiar comando" />
                    </div>
                  </div>

                  {exercise.checks.length > 0 && (
                    <div className="mt-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">Comportamentos cobertos</p>
                      <ul className="mt-3 divide-y divide-line border-y border-line">
                        {exercise.checks.map((check) => (
                          <li key={check} className="grid grid-cols-[24px_1fr] gap-3 px-3 py-4 text-sm leading-6 text-paper transition-colors hover:bg-ink/70 hover:text-signal">
                            <Check className="mt-1 size-4 text-signal" aria-hidden="true" />
                            <span>{check}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exercise.testCode && (
                    <details className="group mt-6 border border-line">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-medium text-paper transition-colors hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">
                        <span>Ver código completo do teste</span>
                        <ChevronDown className="size-4 text-dim transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="border-t border-line">
                        <div className="flex justify-end border-b border-line p-3"><CopyButton value={exercise.testCode} label="Copiar teste" /></div>
                        <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-paper sm:p-6"><code>{exercise.testCode}</code></pre>
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </section>

            {exercise.hints.length > 0 && (
              <section className="mt-12 border-t border-line pt-10" aria-labelledby="exercise-hints-title">
                <div className="grid gap-6 xl:grid-cols-[150px_minmax(0,1fr)]">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">Ainda travou?</p>
                    <h4 id="exercise-hints-title" className="mt-2 text-lg font-semibold text-paper">Dicas graduais</h4>
                  </div>
                  <div className="divide-y divide-line border-y border-line">
                    {exercise.hints.map((hint) => (
                      <details key={`${hint.level}-${hint.content}`} className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-3 py-4 text-sm font-medium text-paper transition-colors hover:bg-ink/70 hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">
                          <span className="flex items-center gap-3"><Lightbulb className="size-4 text-signal" /> {hint.level}</span>
                          <ChevronDown className="size-4 text-dim transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="exercise-markdown max-w-3xl pb-5 text-sm leading-7 text-dim">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint.content}</ReactMarkdown>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section className="mt-12 border-t border-line pt-10" aria-labelledby="exercise-solution-title">
              <div className="grid gap-6 xl:grid-cols-[150px_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">05 / Compare</p>
                  <h4 id="exercise-solution-title" className="mt-2 text-lg font-semibold text-paper">Resolução</h4>
                </div>
                <div>
                  <div>
                    <div className="mb-4 border border-line bg-paper p-4 text-sm leading-7 text-ink transition-colors hover:border-signal">
                      Esta área permanece livre em todos os exercícios. O código atual da unidade aparece abaixo para comparação com os testes e casos esperados.
                    </div>
                    <CodePanel code={exercise.solution || exercise.starter} label="código disponível" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <footer className="grid grid-cols-2 border-t border-line">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => selectExercise(activeIndex - 1)}
              className="flex min-h-16 items-center gap-3 border-r border-line px-5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper hover:text-signal disabled:cursor-not-allowed disabled:text-dim disabled:opacity-40"
            >
              <ArrowLeft className="size-4" /> Anterior
            </button>
            <button
              type="button"
              disabled={activeIndex === content.exercises.length - 1}
              onClick={() => selectExercise(activeIndex + 1)}
              className="flex min-h-16 items-center justify-end gap-3 px-5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper hover:text-signal disabled:cursor-not-allowed disabled:text-dim disabled:opacity-40"
            >
              Próximo <ArrowRight className="size-4" />
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}
