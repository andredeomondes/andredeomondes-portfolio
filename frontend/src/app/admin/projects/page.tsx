"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Pencil, Trash2, Star, StarOff, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types/supabase";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  async function load() {
    setLoading(true);
    const [allRes, featRes] = await Promise.all([
      fetch("/api/projects?all=true"),
      fetch("/api/featured"),
    ]);
    const allData = await allRes.json().catch(() => []);
    const featData = await featRes.json().catch(() => []);
    setProjects(Array.isArray(allData) ? allData : []);
    setFeaturedIds(Array.isArray(featData) ? featData.map((p: Project) => p.id) : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(p: Project) {
    await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    load();
  }

  async function toggleFeatured(id: string) {
    const next = featuredIds.includes(id)
      ? featuredIds.filter((f) => f !== id)
      : featuredIds.length < 3 ? [...featuredIds, id] : featuredIds;
    await fetch("/api/featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next }),
    });
    setFeaturedIds(next);
  }

  async function deleteProject(id: string) {
    if (!confirm("Deletar projeto?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

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
                {featuredIds.length}/3 em destaque na home
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
          <div className="mt-8 space-y-3">
            {projects.length === 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-12 text-center">
                <p className="text-sm text-white/40">Nenhum projeto. Crie o primeiro!</p>
              </div>
            )}
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 backdrop-blur-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
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
  const [form, setForm] = useState({
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    description: project?.description ?? "",
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
    published: project?.published ?? false,
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
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
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    onSaved();
  }

  const Field = ({ label, name, multiline = false }: { label: string; name: string; multiline?: boolean }) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-white/40">{label}</label>
      {multiline ? (
        <textarea
          value={(form as unknown as Record<string, string>)[name]}
          onChange={(e) => set(name, e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60"
        />
      ) : (
        <input
          value={(form as unknown as Record<string, string>)[name]}
          onChange={(e) => set(name, e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-12 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[1.5rem] border border-white/10 bg-[#0a0d1f] p-8"
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{project ? "Editar" : "Novo"} Projeto</h2>
          <button onClick={onClose} className="text-sm text-white/40 hover:text-white">Fechar</button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug (URL)" name="slug" />
            <Field label="Título" name="title" />
          </div>
          <Field label="Descrição curta" name="description" multiline />
          <Field label="Tags (separadas por vírgula)" name="tags" />
          <Field label="Tech Stack (separadas por vírgula)" name="tech_stack" />
          <Field label="Arquitetura (separadas por vírgula)" name="architecture" />
          <Field label="Meta: período, status (separados por vírgula)" name="meta" />
          <Field label="Problema" name="overview_problema" multiline />
          <Field label="Solução" name="overview_solucao" multiline />
          <Field label="Resultado" name="overview_resultado" multiline />
          <Field label="Aprendizados (um por linha)" name="aprendizados" multiline />
          <Field label="Próximos passos (um por linha)" name="next_steps" multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="GitHub URL" name="github_url" />
            <Field label="Live URL" name="live_url" />
          </div>
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
