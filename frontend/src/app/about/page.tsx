import Image from "next/image";
import {
  BriefcaseBusiness,
  Calendar,
  Code2,
  GraduationCap,
  MapPin,
  NotebookPen,
  Mail,
} from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { getPublicSettings } from "@/lib/frontend-api";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { ProgressiveBlur } from "@/shared/components/ui/progressive-blur";
import { normalizeSiteContent } from "@/lib/site-content";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={className} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
        <Icon className="size-4 text-violet-600 dark:text-violet-400" />
      </div>
      <span className="text-sm font-semibold tracking-[-0.02em] text-[#0b1020] dark:text-white">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
    </div>
  );
}

export default async function AboutPage() {
  const settings = await getPublicSettings().catch(() => ({}));
  const site = normalizeSiteContent(settings);
  const { profile, about } = site;
  const socialLinks = [
    { href: profile.social.github, label: "GitHub", icon: FaGithub },
    { href: profile.social.linkedin, label: "LinkedIn", icon: FaLinkedin },
    { href: profile.social.instagram, label: "Instagram", icon: FaInstagram },
    { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
    { href: `https://wa.me/${profile.whatsapp}`, label: "WhatsApp", icon: FaWhatsapp },
  ];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f6f2ea] text-[#0b1020] dark:bg-[#080912] dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,143,255,0.12),transparent_32%),linear-gradient(145deg,#f6f2ea_0%,#ede7dd_52%,#e8e2f5_100%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(120,80,255,0.1),transparent_32%),linear-gradient(145deg,#080912_0%,#0a0d1f_52%,#10091e_100%)]" />
      <NoiseTexture noiseOpacity={0.1} frequency={0.6} octaves={3} slope={0.7} className="opacity-30 mix-blend-soft-light" />
      <ProgressiveBlur position="top" className="opacity-50" blurLevels={[0.5, 1, 2, 4, 8, 12, 18, 24]} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start xl:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/72 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
              <div className="relative bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent p-5 pb-0 dark:from-violet-500/20">
                <div className="flex flex-col items-center pb-5 text-center">
                  <div className="relative">
                    <Image
                      src="/andre.jpg"
                      alt={profile.name}
                      width={80}
                      height={80}
                      priority
                      className="size-20 rounded-full border-2 border-white/80 object-cover shadow-lg dark:border-white/20"
                    />
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-green-500 dark:border-[#080912]">
                      <span className="size-2 animate-pulse rounded-full bg-white" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <h1 className="text-base font-semibold tracking-[-0.03em]">{profile.name}</h1>
                    <p className="mt-0.5 text-xs text-violet-600 dark:text-violet-400">{profile.role}</p>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:text-green-400">
                    {profile.availability}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-black/8 to-transparent dark:via-white/8" />
              <div className="divide-y divide-black/6 dark:divide-white/6">
                {[
                  { icon: Calendar, text: `${profile.birthdate} · ${profile.age} anos` },
                  { icon: MapPin, text: profile.location },
                  { icon: BriefcaseBusiness, text: profile.company },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 px-4 py-2.5">
                    <Icon className="size-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs text-[#0b1020]/66 dark:text-white/54">{text}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-black/8 to-transparent dark:via-white/8" />
              <p className="px-4 py-4 text-xs leading-6 text-[#0b1020]/58 dark:text-white/48">
                {profile.shortBio}
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-black/8 to-transparent dark:via-white/8" />
              <div className="flex items-center justify-center gap-1 px-4 py-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    title={item.label}
                    className="flex size-8 items-center justify-center rounded-full border border-black/8 bg-white/60 text-[#0b1020]/52 transition-all hover:-translate-y-0.5 hover:border-violet-500/30 hover:text-violet-600 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/40 dark:hover:text-violet-400"
                  >
                    <item.icon className="size-3" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/72 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex items-center gap-2 border-b border-black/6 px-4 py-3 dark:border-white/6">
                <GraduationCap className="size-3.5 text-violet-600 dark:text-violet-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                  Formacao
                </span>
              </div>
              <div className="divide-y divide-black/6 dark:divide-white/6">
                {about.education.map((item) => (
                  <div key={`${item.institution}-${item.degree}`} className="px-4 py-3">
                    <p className="text-sm font-medium">{item.institution}</p>
                    <p className="mt-0.5 text-xs leading-5 text-[#0b1020]/46 dark:text-white/38">{item.degree}</p>
                    <p className="mt-0.5 text-[11px] text-[#0b1020]/36 dark:text-white/28">{item.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="min-w-0 space-y-10">
            <FadeUp>
              <SectionHeader icon={BriefcaseBusiness} label="Experiencia Profissional" />
              <div className="space-y-4">
                {about.experiences.map((item, i) => (
                  <FadeUp key={`${item.company}-${item.role}`} delay={i * 0.07}>
                    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white/62 backdrop-blur-md dark:border-white/8 dark:bg-white/[0.04]">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/6 bg-white/40 px-5 py-4 dark:border-white/6 dark:bg-white/[0.03]">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold tracking-[-0.03em]">{item.company}</h3>
                            {item.active && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/12 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400">
                                <span className="size-1.5 rounded-full bg-green-500" />
                                Ativo
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-violet-600 dark:text-violet-300">{item.role}</p>
                        </div>
                        <span className="shrink-0 text-xs text-[#0b1020]/40 dark:text-white/36">{item.period}</span>
                      </div>
                      <ul className="space-y-2 px-5 py-4">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-sm leading-6 text-[#0b1020]/62 dark:text-white/56">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-500/60 dark:bg-violet-400/60" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>

            <FadeUp>
              <SectionHeader icon={Code2} label="Expertise Tecnica" />
              <div className="overflow-hidden rounded-2xl border border-black/8 bg-white/62 backdrop-blur-md dark:border-white/8 dark:bg-white/[0.04]">
                {about.techStack.map((section, i) => (
                  <div
                    key={section.label}
                    className={`flex flex-wrap items-start gap-4 px-5 py-4 ${i !== 0 ? "border-t border-black/6 dark:border-white/6" : ""}`}
                  >
                    <span className="mt-0.5 w-28 shrink-0 text-xs font-medium text-[#0b1020]/42 dark:text-white/36">
                      {section.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-black/8 bg-white/72 px-3 py-1 text-xs font-medium text-[#0b1020]/72 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/68"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp>
              <SectionHeader icon={NotebookPen} label="Sobre" />
              <div className="rounded-2xl border border-black/8 bg-white/62 px-5 py-5 backdrop-blur-md dark:border-white/8 dark:bg-white/[0.04]">
                <p className="text-sm leading-8 text-[#0b1020]/66 dark:text-white/60">
                  {profile.longBio}
                </p>
              </div>
            </FadeUp>
          </main>
        </div>
      </div>
    </div>
  );
}
