"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  GripVertical,
  RefreshCw,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { parseResumeMarkdown } from "@/lib/resume-markdown";
import type { Project } from "@/types/supabase";
import {
  defaultResumeSections,
  normalizeSiteContent,
  type ResumeSettings,
} from "@/lib/site-content";

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
  excellent: { label: "Excelente", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  good: { label: "Bom", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/30" },
  fair: { label: "Regular", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30" },
  poor: { label: "Fraco", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
};

function PreviewBlock({ content }: { content: string }) {
  const blocks = parseResumeMarkdown(content);

  return (
    <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/70">Preview</p>
          <p className="mt-2 text-sm text-white/46">Visao rapida do curriculo gerado antes de exportar.</p>
        </div>
        <Sparkles className="size-4 text-violet-300" />
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-[#0b1020] p-5">
        {blocks.length === 0 || !content.trim() ? (
          <p className="text-sm text-white/40">Gere um curriculo para visualizar o preview aqui.</p>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => {
              if (block.type === "h1") {
                return <h3 key={`${block.type}-${index}`} className="text-2xl font-semibold tracking-[-0.04em] text-white">{block.text}</h3>;
              }

              if (block.type === "h2") {
                return (
                  <div key={`${block.type}-${index}`} className="pt-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/75">
                      {block.text}
                    </p>
                    <div className="mt-2 h-px w-20 bg-violet-400/30" />
                  </div>
                );
              }

              if (block.type === "h3") {
                return <p key={`${block.type}-${index}`} className="text-sm font-semibold text-violet-200">{block.text}</p>;
              }

              if (block.type === "ul") {
                return (
                  <div key={`${block.type}-${index}`} className="space-y-2">
                    {block.items.map((item) => (
                      <div key={item} className="flex gap-2 text-sm leading-6 text-white/68">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-400/80" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <p key={`${block.type}-${index}`} className="text-sm leading-6 text-white/70">
                  {block.text}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminResumePage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [content, setContent] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [publishedContent, setPublishedContent] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [resumeSettings, setResumeSettings] = useState<ResumeSettings | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("");
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [projectDropActive, setProjectDropActive] = useState(false);
  const [sectionDropActive, setSectionDropActive] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/resume").then((response) => response.json()),
      fetch("/api/resume?mode=site").then((response) => response.json()),
      fetch("/api/projects?all=true").then((response) => response.json()),
      fetch("/api/settings").then((response) => response.json()),
    ])
      .then(([resumeData, siteResumeData, projectsData, settingsData]) => {
        if (resumeData?.content) setContent(resumeData.content);
        if (resumeData?.ats_feedback) setResult(resumeData.ats_feedback as ATSResult);
        if (siteResumeData?.content) setPublishedContent(siteResumeData.content as string);

        const loadedProjects = Array.isArray(projectsData) ? (projectsData as Project[]) : [];
        setProjects(loadedProjects);

        const site = normalizeSiteContent(settingsData ?? {});
        const nextSelectedIds =
          site.resume.defaultProjectIds.length > 0
            ? site.resume.defaultProjectIds
            : loadedProjects.filter((project) => project.featured).map((project) => project.id);

        setResumeSettings({
          ...site.resume,
          sections: site.resume.sections.length > 0 ? site.resume.sections : defaultResumeSections,
        });
        setSelectedIds(nextSelectedIds);
      })
      .catch(() => {
        setResumeSettings((current) => current ?? {
          targetRole: "",
          summary: "",
          focusTopics: [],
          softSkills: [],
          keywords: [],
          defaultProjectIds: [],
          sections: defaultResumeSections,
        });
      });
  }, []);

  const selectedProjects = useMemo(
    () =>
      selectedIds
        .map((projectId) => projects.find((project) => project.id === projectId))
        .filter((project): project is Project => Boolean(project)),
    [projects, selectedIds]
  );

  const availableProjects = useMemo(
    () => projects.filter((project) => !selectedIds.includes(project.id)),
    [projects, selectedIds]
  );

  async function saveBuilderSettings(nextResumeSettings = resumeSettings, nextSelectedIds = selectedIds) {
    if (!nextResumeSettings) return false;

    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_profile: {
          ...nextResumeSettings,
          defaultProjectIds: nextSelectedIds,
        },
      }),
    });

    return response.ok;
  }

  async function analyze() {
    setAnalyzing(true);
    setStatus("");

    const res = await fetch("/api/resume/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, save: true }),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      setResult(data as ATSResult);
      setStatus("Analise ATS atualizada.");
    } else {
      setStatus(data?.error ?? "Nao foi possivel analisar o curriculo.");
    }

    setAnalyzing(false);
  }

  async function save() {
    if (!resumeSettings) return;

    setSaving(true);
    setStatus("");

    const [settingsSaved, resumeResponse] = await Promise.all([
      saveBuilderSettings(),
      fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }),
    ]);

    if (!settingsSaved || !resumeResponse.ok) {
      setSaving(false);
      setStatus("Nao foi possivel salvar o curriculo e a base do builder.");
      return;
    }

    setSaving(false);
    setSaved(true);
    setStatus("Conteudo e base do curriculo salvos.");
    setTimeout(() => setSaved(false), 2000);
  }

  async function publishCurrentResume() {
    if (!content.trim()) {
      setStatus("Gere ou escreva um curriculo antes de publicar no site.");
      return;
    }

    setPublishing(true);
    setStatus("");

    const response = await fetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        publish: true,
        atsFeedback: result,
      }),
    });

    if (!response.ok) {
      setPublishing(false);
      setStatus("Nao foi possivel publicar esse curriculo no site.");
      return;
    }

    setPublishedContent(content);
    setPublishing(false);
    setStatus("Curriculo atual publicado no site.");
  }

  async function generateResume() {
    if (!resumeSettings) return;

    setGenerating(true);
    setStatus("");

    const response = await fetch("/api/resume/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectIds: selectedIds,
        resumeTargetRole: resumeSettings.targetRole,
        resumeSummary: resumeSettings.summary,
        resumeProfile: resumeSettings.focusTopics,
        resumeSoftSkills: resumeSettings.softSkills,
        resumeKeywords: resumeSettings.keywords,
        resumeSections: resumeSettings.sections,
        save: true,
      }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok && data?.content) {
      setContent(data.content);
      setSelectedIds(Array.isArray(data.selectedIds) ? data.selectedIds : selectedIds);
      if (data.atsFeedback) {
        setResult(data.atsFeedback as ATSResult);
      }
      setStatus("Curriculo gerado com Kimi, base do site, projetos selecionados e foco em ATS.");
    } else {
      setStatus(data?.error ?? "Nao foi possivel gerar o curriculo.");
    }

    setGenerating(false);
  }

  async function downloadFile(format: "txt" | "docx" | "pdf") {
    if (!content.trim()) {
      setStatus("Gere ou escreva um curriculo antes de baixar.");
      return;
    }

    const response = await fetch("/api/resume/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        format,
        content,
      }),
    });

    if (!response.ok) {
      setStatus("Nao foi possivel baixar o curriculo nesse formato.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      format === "txt"
        ? "andre-deomondes-cv.txt"
        : format === "docx"
          ? "andre-deomondes-cv.docx"
          : "andre-deomondes-cv.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function toggleProject(projectId: string) {
    setSelectedIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  }

  function dropProjectToSelected(targetId?: string) {
    if (!draggedProjectId) return;

    setSelectedIds((current) => {
      const exists = current.includes(draggedProjectId);

      if (!targetId) {
        return exists ? current : [...current, draggedProjectId];
      }

      const next = exists ? [...current] : [...current, draggedProjectId];
      const from = next.indexOf(draggedProjectId);
      const to = next.indexOf(targetId);

      if (from === -1 || to === -1) return next;

      next.splice(from, 1);
      next.splice(to, 0, draggedProjectId);
      return next;
    });

    setProjectDropActive(false);
  }

  function reorderSelectedProject(targetId: string) {
    if (!draggedProjectId || draggedProjectId === targetId) return;
    dropProjectToSelected(targetId);
  }

  function dropSectionToBuilder(targetId?: string) {
    if (!draggedSectionId || !resumeSettings) return;

    setResumeSettings((current) => {
      if (!current) return current;

      const next = [...current.sections];
      const from = next.findIndex((section) => section.id === draggedSectionId);

      if (from === -1) return current;

      const [moved] = next.splice(from, 1);

      if (!targetId) {
        next.push(moved);
      } else {
        const to = next.findIndex((section) => section.id === targetId);
        if (to === -1) {
          next.push(moved);
        } else {
          next.splice(to, 0, moved);
        }
      }

      return { ...current, sections: next };
    });

    setSectionDropActive(false);
  }

  function reorderSection(targetId: string) {
    if (!draggedSectionId || !resumeSettings || draggedSectionId === targetId) return;
    dropSectionToBuilder(targetId);
  }

  const grade = result ? gradeConfig[result.grade] : null;

  return (
    <div className="min-h-screen bg-[#080912] px-6 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-white/46 hover:text-violet-400">
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.05em]">Curriculo e Geracao</h1>
          <p className="mt-1 text-sm text-white/46">
            Monte a base do curriculo com arrasta e solta, gere o texto final, analise ATS e exporte em PDF, DOCX ou TXT.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[340px_1fr_380px]">
          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Projetos no curriculo</p>
              <p className="mt-2 text-sm leading-6 text-white/52">
                Arraste projetos da lista de disponiveis e solte nesta area. Depois arraste entre os cards para mudar a ordem.
              </p>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setProjectDropActive(true);
                }}
                onDragLeave={() => setProjectDropActive(false)}
                onDrop={() => dropProjectToSelected()}
                className={`mt-4 rounded-3xl border border-dashed p-3 transition-colors ${
                  projectDropActive
                    ? "border-violet-400/60 bg-violet-500/10"
                    : "border-violet-400/20 bg-violet-500/[0.03]"
                }`}
              >
                <div className="mb-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm text-white/52">
                  Solte aqui para adicionar ao curriculo
                </div>

                <div className="space-y-2">
                  {selectedProjects.length === 0 ? (
                    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-5 text-sm text-white/42">
                      Nenhum projeto selecionado ainda. Voce pode arrastar um projeto aqui ou clicar em um item da lista abaixo.
                    </div>
                  ) : (
                    selectedProjects.map((project) => (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={() => setDraggedProjectId(project.id)}
                        onDragEnd={() => {
                          setDraggedProjectId(null);
                          setProjectDropActive(false);
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => reorderSelectedProject(project.id)}
                        className="flex items-start gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] px-3 py-3"
                      >
                        <GripVertical className="mt-0.5 size-4 shrink-0 text-violet-300/70" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white">{project.title}</p>
                          <p className="text-xs leading-5 text-white/40">{project.description}</p>
                        </div>
                        <button
                          onClick={() => toggleProject(project.id)}
                          className="rounded-full p-1.5 text-white/34 transition-colors hover:bg-red-500/10 hover:text-red-300"
                          title="Remover do curriculo"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/34">Disponiveis para adicionar</p>
                <div className="mt-3 space-y-2">
                  {availableProjects.map((project) => (
                    <div
                      key={project.id}
                      draggable
                      onDragStart={() => setDraggedProjectId(project.id)}
                      onDragEnd={() => {
                        setDraggedProjectId(null);
                        setProjectDropActive(false);
                      }}
                      className="w-full rounded-2xl border border-white/8 px-3 py-3 transition-colors hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <GripVertical className="mt-0.5 size-4 shrink-0 text-white/26" />
                        <button
                          onClick={() => toggleProject(project.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="text-sm font-medium text-white/78">{project.title}</p>
                          <p className="mt-1 text-xs leading-5 text-white/38">{project.description}</p>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Builder do curriculo</p>
              <p className="mt-2 text-sm leading-6 text-white/52">
                Arraste as secoes e solte nesta area para reordenar. Se soltar no topo, ela vai para o fim da lista.
              </p>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setSectionDropActive(true);
                }}
                onDragLeave={() => setSectionDropActive(false)}
                onDrop={() => dropSectionToBuilder()}
                className={`mt-4 rounded-3xl border border-dashed p-3 transition-colors ${
                  sectionDropActive
                    ? "border-cyan-400/60 bg-cyan-500/10"
                    : "border-cyan-400/20 bg-cyan-500/[0.03]"
                }`}
              >
                <div className="mb-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm text-white/52">
                  Solte aqui para reorganizar o builder
                </div>

                <div className="space-y-2">
                {(resumeSettings?.sections ?? defaultResumeSections).map((section) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => setDraggedSectionId(section.id)}
                    onDragEnd={() => {
                      setDraggedSectionId(null);
                      setSectionDropActive(false);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => reorderSection(section.id)}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/10 px-3 py-3"
                  >
                    <GripVertical className="size-4 shrink-0 text-white/30" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white/78">{section.label}</p>
                      <p className="text-xs text-white/38">{section.enabled ? "Incluida na geracao" : "Oculta na geracao"}</p>
                    </div>
                    <button
                      onClick={() =>
                        setResumeSettings((current) =>
                          current
                            ? {
                                ...current,
                                sections: current.sections.map((item) =>
                                  item.id === section.id ? { ...item, enabled: !item.enabled } : item
                                ),
                              }
                            : current
                        )
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        section.enabled
                          ? "bg-emerald-500/12 text-emerald-300 hover:bg-emerald-500/18"
                          : "bg-white/8 text-white/48 hover:bg-white/12 hover:text-white/76"
                      }`}
                    >
                      {section.enabled ? "Ativa" : "Oculta"}
                    </button>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {resumeSettings && (
              <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Resumo base</p>
                <div className="mt-3 space-y-3">
                  <input
                    value={resumeSettings.targetRole}
                    onChange={(event) =>
                      setResumeSettings((current) =>
                        current ? { ...current, targetRole: event.target.value } : current
                      )
                    }
                    placeholder="Cargo alvo"
                    className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                  <textarea
                    value={resumeSettings.summary}
                    onChange={(event) =>
                      setResumeSettings((current) =>
                        current ? { ...current, summary: event.target.value } : current
                      )
                    }
                    placeholder="Resumo base do curriculo"
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-violet-500/50"
                  />
                  <input
                    value={resumeSettings.focusTopics.join(", ")}
                    onChange={(event) =>
                      setResumeSettings((current) =>
                        current
                          ? {
                              ...current,
                              focusTopics: event.target.value.split(",").map((item) => item.trim()).filter(Boolean),
                            }
                          : current
                      )
                    }
                    placeholder="Topicos foco, separados por virgula"
                    className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                  <input
                    value={resumeSettings.softSkills.join(", ")}
                    onChange={(event) =>
                      setResumeSettings((current) =>
                        current
                          ? {
                              ...current,
                              softSkills: event.target.value.split(",").map((item) => item.trim()).filter(Boolean),
                            }
                          : current
                      )
                    }
                    placeholder="Soft skills, separados por virgula"
                    className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                  <input
                    value={resumeSettings.keywords.join(", ")}
                    onChange={(event) =>
                      setResumeSettings((current) =>
                        current
                          ? {
                              ...current,
                              keywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean),
                            }
                          : current
                      )
                    }
                    placeholder="Keywords ATS, separadas por virgula"
                    className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resumeSettings.focusTopics.map((item) => (
                    <span key={item} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300">
                      {item}
                    </span>
                  ))}
                  {resumeSettings.softSkills.map((item) => (
                    <span key={item} className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300">
                      {item}
                    </span>
                  ))}
                  {resumeSettings.keywords.map((item) => (
                    <span key={item} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium text-white/60">Conteudo do curriculo</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={generateResume}
                  disabled={generating}
                  className="rounded-full bg-violet-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-40"
                >
                  {generating ? "Gerando..." : "Gerar + Analisar ATS"}
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-violet-500/40 hover:text-violet-400 disabled:opacity-40"
                >
                  {saved ? "Salvo ✓" : saving ? "Salvando..." : "Salvar base"}
                </button>
                <button
                  onClick={publishCurrentResume}
                  disabled={!mounted || publishing || !content.trim()}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-200 transition-colors hover:bg-emerald-500/15 disabled:opacity-40"
                >
                  {publishing ? "Publicando..." : "Usar no site"}
                </button>
                <button
                  onClick={() => void downloadFile("txt")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
                >
                  <Download className="size-3.5" /> TXT
                </button>
                <button
                  onClick={() => void downloadFile("docx")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
                >
                  DOCX
                </button>
                <button
                  onClick={() => void downloadFile("pdf")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
                >
                  PDF
                </button>
              </div>
            </div>

            {status && <p className="text-sm text-violet-300">{status}</p>}
            {!!publishedContent && (
              <p className="text-xs text-emerald-300/80">
                Existe uma versao publicada no site. Clique em `Usar no site` para substituir pela atual.
              </p>
            )}

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[760px] w-full resize-y rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-5 py-4 font-mono text-sm leading-7 text-white/88 outline-none transition-colors focus:border-violet-500/50"
              placeholder="Gere ou escreva seu curriculo aqui..."
            />

            <button
              onClick={analyze}
              disabled={!mounted || analyzing || !content.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-40"
            >
              <RefreshCw className={`size-4 ${analyzing ? "animate-spin" : ""}`} />
              {analyzing ? "Analisando..." : "Analisar ATS"}
            </button>
          </div>

          <div className="space-y-4">
            <PreviewBlock content={content} />

            {result && grade ? (
              <>
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

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Seções</p>
                  <div className="space-y-2.5">
                    {Object.entries(result.sections).map(([key, val]) => {
                      const present = "present" in val ? val.present : val.found.length > 0;

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

                {result.strengths.length > 0 && (
                  <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-green-400/70">Pontos fortes</p>
                    <ul className="space-y-2">
                      {result.strengths.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-white/72">
                          <CheckCircle className="mt-0.5 size-3.5 shrink-0 text-green-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.suggestions.length > 0 && (
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400/70">Melhorias</p>
                    <ul className="space-y-2">
                      {result.suggestions.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-white/72">
                          <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] p-8 text-center">
                <div>
                  <p className="text-sm text-white/40">Gere ou escreva seu curriculo e clique em</p>
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
