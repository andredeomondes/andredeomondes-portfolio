"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BriefcaseBusiness, GraduationCap, NotebookPen, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { buildSettingsPayload, defaultSiteContent, normalizeSiteContent, type AboutSettings, type ProfileSettings } from "@/lib/site-content";

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/46">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/40">{label}</span>
      {multiline ? (
        <textarea
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
        />
      ) : (
        <input
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
        />
      )}
    </label>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/70">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminAboutPage() {
  const [profile, setProfile] = useState<ProfileSettings>(defaultSiteContent.profile);
  const [about, setAbout] = useState<AboutSettings>(defaultSiteContent.about);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => {
        const site = normalizeSiteContent(data ?? {});
        setProfile(site.profile);
        setAbout(site.about);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateExperience(index: number, key: "company" | "role" | "period", value: string) {
    setAbout((current) => ({
      ...current,
      experiences: current.experiences.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function updateExperienceBullets(index: number, value: string) {
    setAbout((current) => ({
      ...current,
      experiences: current.experiences.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, bullets: value.split("\n").map((bullet) => bullet.trim()).filter(Boolean) }
          : item
      ),
    }));
  }

  function updateEducation(index: number, key: "institution" | "degree" | "period", value: string) {
    setAbout((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function updateTech(index: number, key: "label" | "items", value: string) {
    setAbout((current) => ({
      ...current,
      techStack: current.techStack.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [key]: key === "items" ? value.split(",").map((entry) => entry.trim()).filter(Boolean) : value }
          : item
      ),
    }));
  }

  async function save() {
    setSaving(true);
    setStatus("");

    try {
      const existing = await fetch("/api/settings").then((response) => response.json());
      const site = normalizeSiteContent(existing ?? {});
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...existing,
          ...buildSettingsPayload({
            profile,
            about,
            resume: site.resume,
            branding: site.branding,
          }),
        }),
      });

      setStatus(response.ok ? "Alteracoes salvas." : "Nao foi possivel salvar.");
    } catch {
      setStatus("Nao foi possivel salvar.");
    }

    setSaving(false);
  }

  if (loading) {
    return <div className="min-h-screen bg-[#080912] px-6 py-32 text-center text-sm text-white/46">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#080912] px-6 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-[#94A3B8] transition-colors hover:text-[#8B5CF6]">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-[#F8FAFC]">Editar About</h1>
              <p className="mt-2 text-sm text-[#94A3B8]">Atualize bio, experiencias, formacao e stack sem mexer no codigo.</p>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar tudo"}
            </button>
          </div>
          {status && <p className="mt-3 text-sm text-violet-300">{status}</p>}
        </motion.div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="grid gap-6">
            <SectionCard title="Perfil" description="Informacoes principais exibidas na pagina Sobre e usadas no curriculo.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome" value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
                <Field label="Cargo" value={profile.role} onChange={(value) => setProfile((current) => ({ ...current, role: value }))} />
                <Field label="Empresa" value={profile.company} onChange={(value) => setProfile((current) => ({ ...current, company: value }))} />
                <Field label="Localizacao" value={profile.location} onChange={(value) => setProfile((current) => ({ ...current, location: value }))} />
                <Field label="Data de nascimento" value={profile.birthdate} onChange={(value) => setProfile((current) => ({ ...current, birthdate: value }))} />
                <Field label="Idade" value={profile.age} onChange={(value) => setProfile((current) => ({ ...current, age: Number(value) || 0 }))} />
                <div className="md:col-span-2">
                  <Field label="Bio curta" value={profile.shortBio} onChange={(value) => setProfile((current) => ({ ...current, shortBio: value }))} multiline />
                </div>
                <div className="md:col-span-2">
                  <Field label="Bio longa" value={profile.longBio} onChange={(value) => setProfile((current) => ({ ...current, longBio: value }))} multiline />
                </div>
                {profile.attributes.map((attribute, index) => (
                  <div key={index} className="grid grid-cols-[1fr_6rem] gap-3">
                    <Field
                      label={`Atributo ${index + 1}`}
                      value={attribute.label}
                      onChange={(value) => setProfile((current) => ({ ...current, attributes: current.attributes.map((item, i) => (i === index ? { ...item, label: value } : item)) }))}
                    />
                    <Field
                      label="0–100"
                      value={attribute.value}
                      onChange={(value) => setProfile((current) => ({ ...current, attributes: current.attributes.map((item, i) => (i === index ? { ...item, value: Math.max(0, Math.min(100, Math.round(Number(value) || 0))) } : item)) }))}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Experiencias" description="Cada card vira uma experiencia na pagina Sobre e tambem ajuda na geracao do curriculo.">
              <div className="space-y-4">
                {about.experiences.map((item, index) => (
                  <div key={`${item.company}-${index}`} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-white/72">Experiencia {index + 1}</p>
                      <button
                        onClick={() => setAbout((current) => ({ ...current, experiences: current.experiences.filter((_, itemIndex) => itemIndex !== index) }))}
                        className="inline-flex items-center gap-2 text-sm text-red-300"
                      >
                        <Trash2 className="size-4" />
                        Remover
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Empresa" value={item.company} onChange={(value) => updateExperience(index, "company", value)} />
                      <Field label="Cargo" value={item.role} onChange={(value) => updateExperience(index, "role", value)} />
                      <Field label="Periodo" value={item.period} onChange={(value) => updateExperience(index, "period", value)} />
                      <label className="inline-flex items-center gap-2 text-sm text-white/66">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={(event) =>
                            setAbout((current) => ({
                              ...current,
                              experiences: current.experiences.map((experience, itemIndex) =>
                                itemIndex === index ? { ...experience, active: event.target.checked } : experience
                              ),
                            }))
                          }
                        />
                        Esta experiencia esta ativa
                      </label>
                    </div>
                    <div className="mt-4">
                      <Field
                        label="Bullets (uma linha por item)"
                        value={item.bullets.join("\n")}
                        onChange={(value) => updateExperienceBullets(index, value)}
                        multiline
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setAbout((current) => ({
                      ...current,
                      experiences: [...current.experiences, { company: "", role: "", period: "", active: false, bullets: [] }],
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/74 hover:border-violet-500/40 hover:text-violet-300"
                >
                  <Plus className="size-4" />
                  Adicionar experiencia
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Formacao" description="Gerencie cursos, faculdade e certificacoes importantes.">
              <div className="space-y-4">
                {about.education.map((item, index) => (
                  <div key={`${item.institution}-${index}`} className="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 md:grid-cols-3">
                    <Field label="Instituicao" value={item.institution} onChange={(value) => updateEducation(index, "institution", value)} />
                    <Field label="Curso" value={item.degree} onChange={(value) => updateEducation(index, "degree", value)} />
                    <Field label="Periodo" value={item.period} onChange={(value) => updateEducation(index, "period", value)} />
                  </div>
                ))}
                <button
                  onClick={() =>
                    setAbout((current) => ({
                      ...current,
                      education: [...current.education, { institution: "", degree: "", period: "" }],
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/74 hover:border-violet-500/40 hover:text-violet-300"
                >
                  <Plus className="size-4" />
                  Adicionar formacao
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Stack por grupo" description="Esses grupos aparecem na About page. Separe tecnologias por virgula.">
              <div className="space-y-4">
                {about.techStack.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 md:grid-cols-[220px_1fr]">
                    <Field label="Titulo do grupo" value={item.label} onChange={(value) => updateTech(index, "label", value)} />
                    <Field label="Itens" value={item.items.join(", ")} onChange={(value) => updateTech(index, "items", value)} />
                  </div>
                ))}
                <button
                  onClick={() =>
                    setAbout((current) => ({
                      ...current,
                      techStack: [...current.techStack, { label: "", items: [] }],
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/74 hover:border-violet-500/40 hover:text-violet-300"
                >
                  <Plus className="size-4" />
                  Adicionar grupo
                </button>
              </div>
            </SectionCard>
          </div>

          <div className="xl:sticky xl:top-8 xl:h-fit">
            <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_35%),rgba(255,255,255,0.03)] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/70">Preview</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Metade da tela para referencia</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/50">
                  Sobre
                </div>
              </div>

              <div className="space-y-4">
                <PreviewCard title="Perfil">
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{profile.name || "Seu nome"}</p>
                      <p className="text-sm text-violet-300">{profile.role || "Seu cargo"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-white/50">
                      <span className="rounded-full border border-white/10 px-2.5 py-1">{profile.company || "Empresa"}</span>
                      <span className="rounded-full border border-white/10 px-2.5 py-1">{profile.location || "Localizacao"}</span>
                    </div>
                    <p className="text-sm leading-7 text-white/62">{profile.shortBio || "A bio curta aparece aqui no preview."}</p>
                  </div>
                </PreviewCard>

                <PreviewCard title="Sobre">
                  <div className="flex items-start gap-3">
                    <NotebookPen className="mt-0.5 size-4 shrink-0 text-violet-300" />
                    <p className="text-sm leading-7 text-white/62">{profile.longBio || "A bio longa aparece aqui para voce validar o bloco principal."}</p>
                  </div>
                </PreviewCard>

                <PreviewCard title="Experiencias">
                  <div className="space-y-4">
                    {about.experiences.slice(0, 3).map((item, index) => (
                      <div key={`${item.company}-${index}`} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-violet-300" />
                            <div>
                              <p className="font-medium text-white">{item.company || "Empresa"}</p>
                              <p className="text-sm text-violet-200/80">{item.role || "Cargo"}</p>
                            </div>
                          </div>
                          <span className="text-[11px] text-white/40">{item.period || "Periodo"}</span>
                        </div>
                        <ul className="mt-3 space-y-2">
                          {item.bullets.slice(0, 2).map((bullet) => (
                            <li key={bullet} className="flex gap-2 text-sm leading-6 text-white/58">
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-400/70" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </PreviewCard>

                <PreviewCard title="Formacao e Stack">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {about.education.slice(0, 2).map((item, index) => (
                        <div key={`${item.institution}-${index}`} className="flex items-start gap-3 text-sm text-white/62">
                          <GraduationCap className="mt-0.5 size-4 shrink-0 text-violet-300" />
                          <div>
                            <p className="font-medium text-white">{item.institution || "Instituicao"}</p>
                            <p>{item.degree || "Curso"}</p>
                            <p className="text-xs text-white/40">{item.period || "Periodo"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {about.techStack.flatMap((group) => group.items).slice(0, 10).map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/68">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </PreviewCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
