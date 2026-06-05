"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface ATSResult {
  score: number;
  grade: "excellent" | "good" | "fair" | "poor";
  sections: {
    contact: { present: boolean; score: number };
    summary: { present: boolean; score: number };
    experience: { present: boolean; score: number; bulletCount: number };
    skills: { present: boolean; score: number; count: number };
    education: { present: boolean; score: number };
    keywords: { found: string[]; score: number };
  };
  suggestions: string[];
  strengths: string[];
}

const gradeConfig = {
  excellent: { label: "Excelente", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30", ring: "ring-green-400" },
  good: { label: "Bom", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/30", ring: "ring-cyan-400" },
  fair: { label: "Regular", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", ring: "ring-amber-400" },
  poor: { label: "Fraco", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", ring: "ring-red-400" },
};

export default function AdminResumePage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((d) => {
        if (d?.content) setContent(d.content);
        if (d?.ats_feedback) setResult(d.ats_feedback as ATSResult);
      })
      .catch(() => {});
  }, []);

  async function analyze() {
    setAnalyzing(true);
    const res = await fetch("/api/resume/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, save: true }),
    });
    const data = await res.json();
    setResult(data);
    setAnalyzing(false);
  }

  async function save() {
    setSaving(true);
    await fetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function downloadTxt() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "andre-deomondes-cv.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const grade = result ? gradeConfig[result.grade] : null;

  return (
    <div className="min-h-screen bg-[#080912] px-6 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-white/46 hover:text-violet-400">
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.05em]">Editor de Currículo</h1>
          <p className="mt-1 text-sm text-white/46">Edite, analise ATS e baixe seu currículo</p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Editor */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/60">Conteúdo</span>
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-violet-500/40 hover:text-violet-400 disabled:opacity-40"
                >
                  {saved ? "Salvo ✓" : saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={downloadTxt}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
                >
                  <Download className="size-3.5" /> .txt
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[600px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-mono text-sm leading-7 text-white/88 outline-none transition-colors focus:border-violet-500/50"
              placeholder="Cole ou escreva seu currículo aqui..."
            />
            <button
              onClick={analyze}
              disabled={analyzing || !content.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-40"
            >
              <RefreshCw className={`size-4 ${analyzing ? "animate-spin" : ""}`} />
              {analyzing ? "Analisando..." : "Analisar ATS"}
            </button>
          </div>

          {/* ATS Results */}
          <div className="space-y-4">
            {result && grade ? (
              <>
                {/* Score */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl border p-6 text-center ${grade.bg}`}
                >
                  <div className={`text-5xl font-bold ${grade.color}`}>{result.score}</div>
                  <div className="mt-1 text-xs text-white/40">de 100 pontos</div>
                  <div className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${grade.bg} ${grade.color}`}>
                    {grade.label}
                  </div>
                </motion.div>

                {/* Sections */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Seções</p>
                  <div className="space-y-2.5">
                    {Object.entries(result.sections).map(([key, val]) => {
                      const present = "present" in val ? val.present : (val as { found: string[] }).found.length > 0;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {present
                              ? <CheckCircle className="size-4 text-green-400" />
                              : <XCircle className="size-4 text-red-400/60" />
                            }
                            <span className="text-sm capitalize text-white/72">{key}</span>
                          </div>
                          <span className={`text-xs font-medium ${val.score > 0 ? "text-green-400" : "text-red-400/60"}`}>
                            +{val.score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strengths */}
                {result.strengths.length > 0 && (
                  <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-green-400/70">Pontos fortes</p>
                    <ul className="space-y-2">
                      {result.strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-white/72">
                          <CheckCircle className="mt-0.5 size-3.5 shrink-0 text-green-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400/70">Melhorias</p>
                    <ul className="space-y-2">
                      {result.suggestions.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-white/72">
                          <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords */}
                {result.sections.keywords.found.length > 0 && (
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Palavras-chave encontradas</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sections.keywords.found.map((kw) => (
                        <span key={kw} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] p-8 text-center">
                <div>
                  <p className="text-sm text-white/40">Cole seu currículo e clique em</p>
                  <p className="mt-1 text-sm font-medium text-violet-400">Analisar ATS</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
