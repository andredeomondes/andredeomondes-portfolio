"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buildSettingsPayload, defaultSiteContent, normalizeSiteContent, type ProfileSettings, type ResumeSettings, type SiteBrandingSettings } from "@/lib/site-content";

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/40">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
        />
      )}
    </label>
  );
}

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/46">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<ProfileSettings>(defaultSiteContent.profile);
  const [branding, setBranding] = useState<SiteBrandingSettings>(defaultSiteContent.branding);
  const [resume, setResume] = useState<ResumeSettings>(defaultSiteContent.resume);
  const [focusTopicsInput, setFocusTopicsInput] = useState(defaultSiteContent.resume.focusTopics.join(", "));
  const [softSkillsInput, setSoftSkillsInput] = useState(defaultSiteContent.resume.softSkills.join(", "));
  const [keywordsInput, setKeywordsInput] = useState(defaultSiteContent.resume.keywords.join(", "));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => {
        const site = normalizeSiteContent(data ?? {});
        setProfile(site.profile);
        setBranding(site.branding);
        setResume(site.resume);
        setFocusTopicsInput(site.resume.focusTopics.join(", "));
        setSoftSkillsInput(site.resume.softSkills.join(", "));
        setKeywordsInput(site.resume.keywords.join(", "));
      })
      .finally(() => setLoading(false));
  }, []);

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
            branding,
            resume: {
              ...resume,
              focusTopics: focusTopicsInput.split(",").map((item) => item.trim()).filter(Boolean),
              softSkills: softSkillsInput.split(",").map((item) => item.trim()).filter(Boolean),
              keywords: keywordsInput.split(",").map((item) => item.trim()).filter(Boolean),
            },
            about: site.about,
          }),
        }),
      });

      setStatus(response.ok ? "Configuracoes salvas." : "Nao foi possivel salvar.");
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
              <h1 className="text-3xl font-semibold text-[#F8FAFC]">Configuracoes</h1>
              <p className="mt-2 text-sm text-[#94A3B8]">Edite dados globais do site, contatos, hero e preferencias de curriculo.</p>
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

        <div className="mt-10 grid gap-6">
          <Card title="Branding e contato" description="Ajuste titulo do site, acento visual e mensagens principais.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Titulo do site" value={branding.siteTitle} onChange={(value) => setBranding((current) => ({ ...current, siteTitle: value }))} />
              <Field label="Cor de destaque" value={branding.accentColor} onChange={(value) => setBranding((current) => ({ ...current, accentColor: value }))} />
              <Field label="WhatsApp" value={profile.whatsapp} onChange={(value) => setProfile((current) => ({ ...current, whatsapp: value }))} />
              <Field label="Email" value={profile.email} onChange={(value) => setProfile((current) => ({ ...current, email: value }))} />
              <Field label="Website" value={profile.website} onChange={(value) => setProfile((current) => ({ ...current, website: value }))} />
              <Field label="Disponibilidade" value={profile.availability} onChange={(value) => setProfile((current) => ({ ...current, availability: value }))} />
              <div className="md:col-span-2">
                <Field label="Titulo da secao de contato" value={branding.contactTitle} onChange={(value) => setBranding((current) => ({ ...current, contactTitle: value }))} multiline />
              </div>
              <div className="md:col-span-2">
                <Field label="Descricao da secao de contato" value={branding.contactDescription} onChange={(value) => setBranding((current) => ({ ...current, contactDescription: value }))} multiline />
              </div>
              <div className="md:col-span-2">
                <Field label="Mensagem padrao do WhatsApp" value={branding.whatsappMessageTemplate} onChange={(value) => setBranding((current) => ({ ...current, whatsappMessageTemplate: value }))} multiline />
              </div>
            </div>
          </Card>

          <Card title="Hero e identidade profissional" description="Textos principais da home e do curriculo.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero title" value={profile.heroTitle} onChange={(value) => setProfile((current) => ({ ...current, heroTitle: value }))} />
              <Field label="Resume headline" value={profile.resumeHeadline} onChange={(value) => setProfile((current) => ({ ...current, resumeHeadline: value }))} />
              <div className="md:col-span-2">
                <Field label="Hero intro" value={profile.heroIntro} onChange={(value) => setProfile((current) => ({ ...current, heroIntro: value }))} multiline />
              </div>
              <div className="md:col-span-2">
                <Field label="Hero description" value={profile.heroDescription} onChange={(value) => setProfile((current) => ({ ...current, heroDescription: value }))} multiline />
              </div>
            </div>
          </Card>

          <Card title="Redes sociais" description="Links usados nas paginas Sobre e Contato.">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="GitHub" value={profile.social.github} onChange={(value) => setProfile((current) => ({ ...current, social: { ...current.social, github: value } }))} />
              <Field label="LinkedIn" value={profile.social.linkedin} onChange={(value) => setProfile((current) => ({ ...current, social: { ...current.social, linkedin: value } }))} />
              <Field label="Instagram" value={profile.social.instagram} onChange={(value) => setProfile((current) => ({ ...current, social: { ...current.social, instagram: value } }))} />
            </div>
          </Card>

          <Card title="Preferencias do curriculo" description="Esses dados alimentam a geracao automatica no ADMIN.">
            <div className="grid gap-4">
              <Field label="Cargo alvo" value={resume.targetRole} onChange={(value) => setResume((current) => ({ ...current, targetRole: value }))} />
              <Field label="Resumo base" value={resume.summary} onChange={(value) => setResume((current) => ({ ...current, summary: value }))} multiline />
              <Field
                label="Topicos foco (separe por virgula)"
                value={focusTopicsInput}
                onChange={setFocusTopicsInput}
              />
              <Field
                label="Soft skills (separe por virgula)"
                value={softSkillsInput}
                onChange={setSoftSkillsInput}
              />
              <Field
                label="Keywords ATS (separe por virgula)"
                value={keywordsInput}
                onChange={setKeywordsInput}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
