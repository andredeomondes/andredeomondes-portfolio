"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Pencil, Trash2, Star, StarOff, Eye, EyeOff, ExternalLink, GripVertical, Search, X } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/supabase";

function ProjectField({
  label,
  name,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-white/40">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60"
        />
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [savingFeatured, setSavingFeatured] = useState(false);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"all" | "published" | "drafts">("all");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        throw queryError;
      }

      const loadedProjects = Array.isArray(data) ? (data as Project[]) : [];
      const orderedFeaturedIds = loadedProjects
        .filter((project) => project.featured)
        .sort((left, right) => (left.featured_order ?? 999) - (right.featured_order ?? 999))
        .map((project) => project.id);

      setProjects(loadedProjects);
      setFeaturedIds(orderedFeaturedIds);
    } catch (loadError) {
      setProjects([]);
      setFeaturedIds([]);
      setError("Nao foi possivel carregar os projetos existentes. Verifique o login no Supabase e as policies RLS.");
      console.error(loadError);
    }

    setLoading(false);
  }

  useEffect(() => {
    async function initialLoad() {
      await load();
    }

    void initialLoad();
  }, []);

  async function togglePublish(p: Project) {
    setStatus("");
    const response = await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });

    if (!response.ok) {
      setError("Nao foi possivel alterar a publicacao do projeto.");
      return;
    }

    setStatus(p.published ? "Projeto movido para rascunho." : "Projeto publicado.");
    load();
  }

  async function saveFeaturedOrder(next: string[]) {
    setSavingFeatured(true);
    setError("");
    const response = await fetch("/api/featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next }),
    });

    if (!response.ok) {
      setSavingFeatured(false);
      setError("Nao foi possivel salvar a ordem dos destaques.");
      return false;
    }

    setFeaturedIds(next);
    setSavingFeatured(false);
    await load();
    return true;
  }

  async function toggleFeatured(id: string) {
    const next = featuredIds.includes(id)
      ? featuredIds.filter((f) => f !== id)
      : featuredIds.length < 3 ? [...featuredIds, id] : featuredIds;

    if (next.length === featuredIds.length && !featuredIds.includes(id)) {
      setError("Voce pode destacar ate 3 projetos.");
      return;
    }

    const saved = await saveFeaturedOrder(next);
    if (!saved) return;

    setStatus(featuredIds.includes(id) ? "Projeto removido dos destaques." : "Projeto adicionado aos destaques.");
  }

  async function deleteProject(id: string) {
    if (!confirm("Deletar projeto?")) return;
    setStatus("");
    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Nao foi possivel deletar o projeto.");
      return;
    }
    setStatus("Projeto deletado.");
    load();
  }

  function handleProjectDrop(targetIndex: number) {
    if (!draggedProjectId) return;

    const sourceFeaturedIndex = featuredIds.indexOf(draggedProjectId);
    if (sourceFeaturedIndex === -1) {
      if (featuredIds.length >= 3) {
        setError("Remova um destaque antes de adicionar outro por drag and drop.");
        return;
      }
      const next = [...featuredIds];
      next.splice(targetIndex, 0, draggedProjectId);
      void saveFeaturedOrder(next).then((saved) => {
        if (!saved) return;
        setStatus("Destaque atualizado por arrastar e soltar.");
      });
      return;
    }

    const next = [...featuredIds];
    next.splice(sourceFeaturedIndex, 1);
    next.splice(targetIndex, 0, draggedProjectId);
    void saveFeaturedOrder(next).then((saved) => {
      if (!saved) return;
      setStatus("Ordem dos destaques atualizada.");
    });
  }

  const featuredProjects = featuredIds
    .map((featuredId) => projects.find((project) => project.id === featuredId))
    .filter(Boolean) as Project[];

  const draftCount = projects.filter((project) => !project.published).length;
  const publishedCount = projects.filter((project) => project.published).length;
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesView =
        view === "all" ? true : view === "published" ? project.published : !project.published;
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.slug.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);

      return matchesView && matchesSearch;
    });
  }, [projects, search, view]);

  return (
    <div className="min-h-screen bg-[#080912] px-6 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-white/46 transition-colors hover:text-violet-400">
            <ArrowLeft className="size-4" /> Dashboard
          </Link>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.05em]">Projetos</h1>
              <p className="mt-1 text-sm text-white/46">
                {featuredIds.length}/3 em destaque na home. Arraste para ordenar.
              </p>
            </div>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              <Plus className="size-4" /> Novo projeto
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="mt-12 text-center text-sm text-white/40">Carregando...</div>
        ) : (
          <div className="mt-8 space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}
            {status && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                {status}
              </div>
            )}

            <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: `Todos (${projects.length})` },
                    { id: "published", label: `Publicados (${publishedCount})` },
                    { id: "drafts", label: `Rascunhos (${draftCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setView(tab.id as "all" | "published" | "drafts")}
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${
                        view === tab.id
                          ? "bg-violet-600 text-white"
                          : "border border-white/10 text-white/54 hover:border-violet-500/30 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <label className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-black/10 px-4 py-2.5 lg:w-80">
                  <Search className="size-4 shrink-0 text-white/34" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por titulo, slug ou descricao"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/42">
                <span>Rascunhos ficam visiveis apenas aqui no admin.</span>
                <span>Use os filtros para ver so publicados ou so rascunhos.</span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Destaques da Home</h2>
                  <p className="mt-1 text-sm text-white/46">Arraste qualquer projeto para os slots abaixo ou reordene os destaques entre si.</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                  {savingFeatured ? "Salvando ordem..." : "Drag & Drop ativo"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[0, 1, 2].map((slotIndex) => {
                  const project = featuredProjects[slotIndex];

                  return (
                    <div
                      key={slotIndex}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleProjectDrop(slotIndex)}
                      className="min-h-32 rounded-3xl border border-dashed border-violet-400/20 bg-violet-500/[0.04] p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                        Destaque {slotIndex + 1}
                      </p>

                      {project ? (
                        <div
                          draggable
                          onDragStart={() => setDraggedProjectId(project.id)}
                          onDragEnd={() => setDraggedProjectId(null)}
                          className="mt-4 rounded-2xl border border-white/10 bg-[#0d1124] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-medium">{project.title}</p>
                              <p className="mt-1 text-sm text-white/44">{project.slug}</p>
                            </div>
                            <button
                              onClick={() => void toggleFeatured(project.id)}
                              className="rounded-full p-1.5 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-300"
                              title="Remover dos destaques"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-xs text-white/36">
                            <GripVertical className="size-4" />
                            Arraste para reordenar
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 flex min-h-20 items-center justify-center rounded-2xl border border-white/8 bg-black/10 text-center text-sm text-white/36">
                          Solte um projeto aqui
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {filteredProjects.length === 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-12 text-center">
                <p className="text-sm text-white/40">
                  {projects.length === 0 ? "Nenhum projeto. Crie o primeiro!" : "Nenhum projeto encontrado nesse filtro."}
                </p>
              </div>
            )}
            {filteredProjects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                draggable
                onDragStart={() => setDraggedProjectId(p.id)}
                onDragEnd={() => setDraggedProjectId(null)}
                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 backdrop-blur-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <GripVertical className="size-4 shrink-0 text-white/24" />
                    <span className="font-medium">{p.title}</span>
                    {!p.published && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400">Rascunho</span>
                    )}
                    {featuredIds.includes(p.id) && (
                      <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs text-violet-400">
                        Destaque #{featuredIds.indexOf(p.id) + 1}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-white/40">/{p.slug}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/8"
                    title="Abrir pagina do projeto"
                  >
                    <ExternalLink className="size-4 text-white/40" />
                  </a>
                  <button
                    onClick={() => toggleFeatured(p.id)}
                    title={featuredIds.includes(p.id) ? "Remover destaque" : "Destacar na home"}
                    className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/8"
                  >
                    {featuredIds.includes(p.id)
                      ? <Star className="size-4 fill-violet-400 text-violet-400" />
                      : <StarOff className="size-4 text-white/30" />
                    }
                  </button>
                  <button
                    onClick={() => togglePublish(p)}
                    title={p.published ? "Despublicar" : "Publicar"}
                    className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/8"
                  >
                    {p.published
                      ? <Eye className="size-4 text-green-400" />
                      : <EyeOff className="size-4 text-white/30" />
                    }
                  </button>
                  <button
                    onClick={() => { setEditing(p); setShowForm(true); }}
                    className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/8"
                  >
                    <Pencil className="size-4 text-white/50" />
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-red-500/15"
                  >
                    <Trash2 className="size-4 text-red-400/60 hover:text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showForm && (
          <ProjectForm
            project={editing}
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSaved={() => { setShowForm(false); setEditing(null); load(); }}
          />
        )}
      </div>
    </div>
  );
}

function ProjectForm({ project, onClose, onSaved }: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    description: project?.description ?? "",
    long_description: project?.long_description ?? "",
    tags: (project?.tags ?? []).join(", "),
    tech_stack: (project?.tech_stack ?? []).join(", "),
    architecture: (project?.architecture ?? []).join(", "),
    meta: (project?.meta ?? []).join(", "),
    overview_problema: project?.overview_problema ?? "",
    overview_solucao: project?.overview_solucao ?? "",
    overview_resultado: project?.overview_resultado ?? "",
    aprendizados: (project?.aprendizados ?? []).join("\n"),
    next_steps: (project?.next_steps ?? []).join("\n"),
    github_url: project?.github_url ?? "",
    live_url: project?.live_url ?? "",
    image_url: project?.image_url ?? "",
    published: project?.published ?? false,
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setError("");

    if (!form.slug.trim() || !form.title.trim() || !form.description.trim()) {
      setError("Slug, titulo e descricao curta sao obrigatorios.");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
      architecture: form.architecture.split(",").map((s) => s.trim()).filter(Boolean),
      meta: form.meta.split(",").map((s) => s.trim()).filter(Boolean),
      aprendizados: form.aprendizados.split("\n").map((s) => s.trim()).filter(Boolean),
      next_steps: form.next_steps.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    const url = project ? `/api/projects/${project.id}` : "/api/projects";
    const method = project ? "PUT" : "POST";
    const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Nao foi possivel salvar o projeto.");
      return;
    }

    onSaved();
  }

  const previewTags = form.tags.split(",").map((item) => item.trim()).filter(Boolean);
  const previewStack = form.tech_stack.split(",").map((item) => item.trim()).filter(Boolean);
  const previewMeta = form.meta.split(",").map((item) => item.trim()).filter(Boolean);
  const previewLearn = form.aprendizados.split("\n").map((item) => item.trim()).filter(Boolean);
  const previewNext = form.next_steps.split("\n").map((item) => item.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-12 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl rounded-[1.5rem] border border-white/10 bg-[#0a0d1f] p-8"
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{project ? "Editar" : "Novo"} Projeto</h2>
          <button onClick={onClose} className="text-sm text-white/40 hover:text-white">Fechar</button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <ProjectField label="Slug (URL)" name="slug" value={form.slug} onChange={set} />
              <ProjectField label="Título" name="title" value={form.title} onChange={set} />
            </div>
            <ProjectField label="Descrição curta" name="description" value={form.description} onChange={set} multiline />
            <ProjectField label="Descrição longa / narrativa" name="long_description" value={form.long_description} onChange={set} multiline />
            <ProjectField label="Tags (separadas por vírgula)" name="tags" value={form.tags} onChange={set} />
            <ProjectField label="Tech Stack (separadas por vírgula)" name="tech_stack" value={form.tech_stack} onChange={set} />
            <ProjectField label="Arquitetura (separadas por vírgula)" name="architecture" value={form.architecture} onChange={set} />
            <ProjectField label="Meta: período, status (separados por vírgula)" name="meta" value={form.meta} onChange={set} />
            <ProjectField label="Problema" name="overview_problema" value={form.overview_problema} onChange={set} multiline />
            <ProjectField label="Solução" name="overview_solucao" value={form.overview_solucao} onChange={set} multiline />
            <ProjectField label="Resultado" name="overview_resultado" value={form.overview_resultado} onChange={set} multiline />
            <ProjectField label="Aprendizados (um por linha)" name="aprendizados" value={form.aprendizados} onChange={set} multiline />
            <ProjectField label="Próximos passos (um por linha)" name="next_steps" value={form.next_steps} onChange={set} multiline />
            <div className="grid gap-4 sm:grid-cols-2">
              <ProjectField label="GitHub URL" name="github_url" value={form.github_url} onChange={set} />
              <ProjectField label="Live URL" name="live_url" value={form.live_url} onChange={set} />
            </div>
            <ProjectField label="Imagem do projeto (URL)" name="image_url" value={form.image_url} onChange={set} />
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
                className="accent-violet-500"
              />
              <span className="text-sm text-white/72">Publicar imediatamente</span>
            </label>
          </div>

          <div className="xl:sticky xl:top-8 xl:h-fit">
            <div className="rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_34%),rgba(255,255,255,0.03)] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/70">Preview</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{form.title || "Titulo do projeto"}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${form.published ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                  {form.published ? "Publicado" : "Rascunho"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/62">
                {form.long_description || form.description || "A descricao do projeto aparece aqui enquanto voce edita."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {previewTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                    {tag}
                  </span>
                ))}
              </div>

              {form.image_url && (
                <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image_url}
                    alt={form.title || "Preview do projeto"}
                    className="h-52 w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Meta</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {previewMeta.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/64">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {previewStack.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/68">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Narrativa</p>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-white/62">
                    <p><span className="font-medium text-white">Problema:</span> {form.overview_problema || "Descreva o problema."}</p>
                    <p><span className="font-medium text-white">Solucao:</span> {form.overview_solucao || "Descreva a solucao."}</p>
                    <p><span className="font-medium text-white">Resultado:</span> {form.overview_resultado || "Descreva o resultado."}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Aprendizados</p>
                    <ul className="mt-3 space-y-2">
                      {previewLearn.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-white/62">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-400/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Proximos passos</p>
                    <ul className="mt-3 space-y-2">
                      {previewNext.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-white/62">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-400/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full px-5 py-2.5 text-sm text-white/50 transition-colors hover:text-white">
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
