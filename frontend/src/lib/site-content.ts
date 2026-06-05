type UnknownRecord = Record<string, unknown>;

export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
}

export interface ProfileSettings {
  name: string;
  role: string;
  company: string;
  birthdate: string;
  age: number;
  location: string;
  email: string;
  website: string;
  whatsapp: string;
  availability: string;
  shortBio: string;
  longBio: string;
  heroTitle: string;
  heroIntro: string;
  heroDescription: string;
  resumeHeadline: string;
  social: SocialLinks;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  active: boolean;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
}

export interface TechStackSection {
  label: string;
  items: string[];
}

export interface AboutSettings {
  experiences: ExperienceItem[];
  education: EducationItem[];
  techStack: TechStackSection[];
}

export interface ResumeSettings {
  targetRole: string;
  summary: string;
  focusTopics: string[];
  softSkills: string[];
  keywords: string[];
  defaultProjectIds: string[];
  sections: ResumeSectionConfig[];
}

export type ResumeSectionId =
  | "header"
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "keywords"
  | "education";

export interface ResumeSectionConfig {
  id: ResumeSectionId;
  label: string;
  enabled: boolean;
}

export interface SiteBrandingSettings {
  siteTitle: string;
  accentColor: string;
  contactTitle: string;
  contactDescription: string;
  whatsappMessageTemplate: string;
}

export interface SiteContent {
  profile: ProfileSettings;
  about: AboutSettings;
  resume: ResumeSettings;
  branding: SiteBrandingSettings;
}

export const defaultResumeSections: ResumeSectionConfig[] = [
  { id: "header", label: "Cabecalho", enabled: true },
  { id: "summary", label: "Resumo", enabled: true },
  { id: "experience", label: "Experiencia", enabled: true },
  { id: "projects", label: "Projetos em destaque", enabled: true },
  { id: "skills", label: "Habilidades", enabled: true },
  { id: "keywords", label: "Keywords", enabled: true },
  { id: "education", label: "Formacao", enabled: true },
];

export const defaultSiteContent: SiteContent = {
  profile: {
    name: "Andre Deomondes",
    role: "Full Stack & Mobile Developer",
    company: "Caji Solutions",
    birthdate: "27/06/2003",
    age: 21,
    location: "Salvador, BA, Brasil",
    email: "contato@andredeomondes.dev",
    website: "andredeomondes.dev",
    whatsapp: "5571988384932",
    availability: "Disponivel para conversar",
    shortBio:
      "Construo aplicacoes web e mobile que combinam codigo limpo, escalabilidade e experiencias intuitivas.",
    longBio:
      "Construo aplicacoes web e mobile que combinam codigo limpo, escalabilidade e experiencias intuitivas. Meu foco e desenvolver produtos digitais rapidos, confiaveis e preparados para crescer, transformando ideias em solucoes que geram valor real para usuarios e empresas.",
    heroTitle: "ANDRE DEOMONDES.",
    heroIntro: "Eu sou Desenvolvedor Full Stack na Caji Solutions",
    heroDescription:
      "Desenvolvo aplicativos mobile, sistemas web e solucoes completas de software que unem design, performance e escalabilidade.",
    resumeHeadline: "Full Stack & Mobile Developer",
    social: {
      github: "https://github.com/andredeomondes",
      linkedin: "https://linkedin.com/in/andredeomondes",
      instagram: "https://instagram.com/andredeomondes.dev",
    },
  },
  about: {
    experiences: [
      {
        company: "Caji Solutions",
        role: "Full Stack Developer",
        period: "Abr 2026 - Presente",
        active: true,
        bullets: [
          "Desenvolvo sistemas web e APIs para fluxos internos e produtos digitais.",
          "Estruturo interfaces claras e integracoes prontas para crescer.",
          "Atuo em backend, front-end e organizacao tecnica da entrega.",
        ],
      },
      {
        company: "REXIS Digital",
        role: "Full Stack Developer",
        period: "Jan 2026 - Presente",
        active: true,
        bullets: [
          "Trabalho em software escalavel com foco em arquitetura backend.",
          "Integro fluxos com IA para operacoes mais rapidas e simples.",
        ],
      },
    ],
    education: [
      {
        institution: "Universidade CIMATEC",
        degree: "Bacharelado em Engenharia da Computacao",
        period: "Jan 2024 - Jan 2029",
      },
      {
        institution: "SENAI BAHIA",
        degree: "Tecnico em Desenvolvimento de Sistemas",
        period: "Ago 2025 - Ago 2027",
      },
    ],
    techStack: [
      { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
      { label: "Mobile", items: ["React Native", "Expo"] },
      { label: "Backend", items: ["Node.js", "NestJS", "Fastify", "Java", "Spring Boot"] },
      { label: "Banco de dados", items: ["PostgreSQL", "MongoDB"] },
      { label: "DevOps", items: ["Docker", "AWS", "Git", "CI/CD"] },
    ],
  },
  resume: {
    targetRole: "Full Stack Software Engineer",
    summary:
      "Desenvolvedor Full Stack e Mobile com experiencia em produtos web, aplicativos e sistemas internos orientados a performance, usabilidade e escalabilidade.",
    focusTopics: ["React", "Next.js", "TypeScript", "Node.js", "Java", "Arquitetura", "Produtos Digitais"],
    softSkills: ["Comunicacao", "Colaboracao", "Resolucao de problemas", "Pensamento analitico", "Ownership", "Adaptabilidade"],
    keywords: ["Full Stack", "Next.js", "TypeScript", "Node.js", "APIs", "Arquitetura de Software", "PostgreSQL", "AWS", "React Native"],
    defaultProjectIds: [],
    sections: defaultResumeSections,
  },
  branding: {
    siteTitle: "Andre Deomondes - Software Engineer",
    accentColor: "#8b5cf6",
    contactTitle: "Descreva o software que voce quer criar.",
    contactDescription:
      "Envie a ideia no WhatsApp e, se quiser, leve uma imagem de referencia junto.",
    whatsappMessageTemplate:
      "Ola Andre, quero criar um software e conversar sobre o projeto.",
  },
};

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeExperience(value: unknown, fallback: ExperienceItem[]): ExperienceItem[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => {
    const record = asRecord(item);
    return {
      company: asString(record?.company, ""),
      role: asString(record?.role, ""),
      period: asString(record?.period, ""),
      active: asBoolean(record?.active, false),
      bullets: asStringArray(record?.bullets, []),
    };
  }).filter((item) => item.company || item.role);
}

function normalizeEducation(value: unknown, fallback: EducationItem[]): EducationItem[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => {
    const record = asRecord(item);
    return {
      institution: asString(record?.institution, ""),
      degree: asString(record?.degree, ""),
      period: asString(record?.period, ""),
    };
  }).filter((item) => item.institution || item.degree);
}

function normalizeTechStack(value: unknown, fallback: TechStackSection[]): TechStackSection[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => {
    const record = asRecord(item);
    return {
      label: asString(record?.label, ""),
      items: asStringArray(record?.items, []),
    };
  }).filter((item) => item.label);
}

export function normalizeResumeSections(value: unknown, fallback: ResumeSectionConfig[]) {
  const defaultsById = new Map(defaultResumeSections.map((section) => [section.id, section]));
  const source = Array.isArray(value) ? value : fallback;
  const parsed = source
    .map((item) => {
      const record = asRecord(item);
      const id = record?.id;

      if (typeof id !== "string" || !defaultsById.has(id as ResumeSectionId)) {
        return null;
      }

      const defaultSection = defaultsById.get(id as ResumeSectionId)!;

      return {
        id: defaultSection.id,
        label: asString(record?.label, defaultSection.label),
        enabled: asBoolean(record?.enabled, defaultSection.enabled),
      } satisfies ResumeSectionConfig;
    })
    .filter((item): item is ResumeSectionConfig => item !== null);

  const seen = new Set(parsed.map((item) => item.id));
  const missing = defaultResumeSections.filter((item) => !seen.has(item.id));

  return [...parsed, ...missing];
}

export function normalizeSiteContent(settings: Record<string, unknown>): SiteContent {
  const profileInput = asRecord(settings.profile);
  const aboutInput = asRecord(settings.about_page ?? settings.about);
  const resumeInput = asRecord(settings.resume_profile ?? settings.resume);
  const brandingInput = asRecord(settings.branding);
  const socialInput = asRecord(profileInput?.social);

  return {
    profile: {
      ...defaultSiteContent.profile,
      name: asString(profileInput?.name, defaultSiteContent.profile.name),
      role: asString(profileInput?.role, defaultSiteContent.profile.role),
      company: asString(profileInput?.company, defaultSiteContent.profile.company),
      birthdate: asString(profileInput?.birthdate, defaultSiteContent.profile.birthdate),
      age: asNumber(profileInput?.age, defaultSiteContent.profile.age),
      location: asString(profileInput?.location, defaultSiteContent.profile.location),
      email: asString(profileInput?.email, defaultSiteContent.profile.email),
      website: asString(profileInput?.website, defaultSiteContent.profile.website),
      whatsapp: asString(
        profileInput?.whatsapp ?? settings.whatsapp,
        defaultSiteContent.profile.whatsapp
      ),
      availability: asString(profileInput?.availability, defaultSiteContent.profile.availability),
      shortBio: asString(profileInput?.shortBio, defaultSiteContent.profile.shortBio),
      longBio: asString(profileInput?.longBio, defaultSiteContent.profile.longBio),
      heroTitle: asString(profileInput?.heroTitle, defaultSiteContent.profile.heroTitle),
      heroIntro: asString(profileInput?.heroIntro, defaultSiteContent.profile.heroIntro),
      heroDescription: asString(
        profileInput?.heroDescription,
        defaultSiteContent.profile.heroDescription
      ),
      resumeHeadline: asString(
        profileInput?.resumeHeadline,
        defaultSiteContent.profile.resumeHeadline
      ),
      social: {
        github: asString(socialInput?.github, defaultSiteContent.profile.social.github),
        linkedin: asString(socialInput?.linkedin, defaultSiteContent.profile.social.linkedin),
        instagram: asString(socialInput?.instagram, defaultSiteContent.profile.social.instagram),
      },
    },
    about: {
      experiences: normalizeExperience(
        aboutInput?.experiences,
        defaultSiteContent.about.experiences
      ),
      education: normalizeEducation(aboutInput?.education, defaultSiteContent.about.education),
      techStack: normalizeTechStack(aboutInput?.techStack, defaultSiteContent.about.techStack),
    },
    resume: {
      targetRole: asString(resumeInput?.targetRole, defaultSiteContent.resume.targetRole),
      summary: asString(resumeInput?.summary, defaultSiteContent.resume.summary),
      focusTopics: asStringArray(resumeInput?.focusTopics, defaultSiteContent.resume.focusTopics),
      softSkills: asStringArray(resumeInput?.softSkills, defaultSiteContent.resume.softSkills),
      keywords: asStringArray(resumeInput?.keywords, defaultSiteContent.resume.keywords),
      defaultProjectIds: asStringArray(
        resumeInput?.defaultProjectIds,
        defaultSiteContent.resume.defaultProjectIds
      ),
      sections: normalizeResumeSections(
        resumeInput?.sections,
        defaultSiteContent.resume.sections
      ),
    },
    branding: {
      siteTitle: asString(
        brandingInput?.siteTitle ?? settings.site_title,
        defaultSiteContent.branding.siteTitle
      ),
      accentColor: asString(
        brandingInput?.accentColor ?? settings.accent_color,
        defaultSiteContent.branding.accentColor
      ),
      contactTitle: asString(
        brandingInput?.contactTitle,
        defaultSiteContent.branding.contactTitle
      ),
      contactDescription: asString(
        brandingInput?.contactDescription,
        defaultSiteContent.branding.contactDescription
      ),
      whatsappMessageTemplate: asString(
        brandingInput?.whatsappMessageTemplate,
        defaultSiteContent.branding.whatsappMessageTemplate
      ),
    },
  };
}

export function buildSettingsPayload(content: SiteContent) {
  return {
    site_title: content.branding.siteTitle,
    accent_color: content.branding.accentColor,
    whatsapp: content.profile.whatsapp,
    profile: content.profile,
    about_page: content.about,
    resume_profile: content.resume,
    branding: content.branding,
  };
}
