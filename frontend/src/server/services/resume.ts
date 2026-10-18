import { createAdminClient, createClient } from "@/lib/supabase/server";
import { buildResumeContent } from "@/lib/resume-generator";
import {
  buildSettingsPayload,
  normalizeResumeSections,
  normalizeSiteContent,
} from "@/lib/site-content";
import { getSettings, upsertSettings } from "@/server/services/settings";
import { listProjects } from "@/server/services/projects";
import type { Json, Resume } from "@/types/supabase";

const TABLE = "resume";
const PUBLISHED_RESUME_CONTENT_KEY = "published_resume_content";
const PUBLISHED_RESUME_ATS_KEY = "published_resume_ats_feedback";
const PUBLISHED_RESUME_UPDATED_AT_KEY = "published_resume_updated_at";

export async function getResume(): Promise<Resume | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data as Resume;
}

export async function getResumeForSite() {
  const [resume, settings] = await Promise.all([
    getResume(),
    getSettings().catch((): Record<string, unknown> => ({})),
  ]);

  const publishedContent =
    typeof settings[PUBLISHED_RESUME_CONTENT_KEY] === "string"
      ? (settings[PUBLISHED_RESUME_CONTENT_KEY] as string)
      : "";
  const publishedAts =
    settings[PUBLISHED_RESUME_ATS_KEY] && typeof settings[PUBLISHED_RESUME_ATS_KEY] === "object"
      ? settings[PUBLISHED_RESUME_ATS_KEY]
      : null;

  return {
    content: publishedContent || resume?.content || "",
    ats_feedback: publishedAts ?? resume?.ats_feedback ?? null,
    ats_score:
      typeof (publishedAts as { score?: unknown } | null)?.score === "number"
        ? ((publishedAts as { score: number }).score)
        : resume?.ats_score ?? null,
    updated_at:
      typeof settings[PUBLISHED_RESUME_UPDATED_AT_KEY] === "string"
        ? (settings[PUBLISHED_RESUME_UPDATED_AT_KEY] as string)
        : resume?.updated_at ?? null,
    source: publishedContent ? "published" : "current",
  };
}

export async function saveResume(content: string) {
  const supabase = await createAdminClient();
  const existing = await getResume();

  if (existing) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Resume;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ content })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Resume;
}

export async function saveATSResult(id: string, result: unknown) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from(TABLE)
    .update({ ats_feedback: result as Json, ats_score: (result as { score?: number }).score ?? null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function publishResumeToSite(content: string, atsFeedback: unknown = null) {
  await upsertSettings({
    [PUBLISHED_RESUME_CONTENT_KEY]: content,
    [PUBLISHED_RESUME_ATS_KEY]: atsFeedback,
    [PUBLISHED_RESUME_UPDATED_AT_KEY]: new Date().toISOString(),
  });

  return { ok: true };
}

function orderProjectsByIds(projects: Awaited<ReturnType<typeof listProjects>>, ids: string[]) {
  const projectMap = new Map(projects.map((project) => [project.id, project]));

  return ids
    .map((id) => projectMap.get(id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));
}

function getAiConfig() {
  const kimiApiKey = process.env.KIMI_API_KEY ?? process.env.MOONSHOT_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  return {
    apiKey: kimiApiKey ?? openAiApiKey,
    baseUrl: kimiApiKey
      ? process.env.KIMI_BASE_URL ?? process.env.MOONSHOT_BASE_URL ?? "https://api.moonshot.ai/v1"
      : "https://api.openai.com/v1",
    model: kimiApiKey
      ? process.env.KIMI_MODEL ?? "kimi-k2.5"
      : process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  };
}

async function chatCompletion(messages: Array<{ role: "system" | "user"; content: string }>) {
  const { apiKey, baseUrl, model } = getAiConfig();

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  return data.choices?.[0]?.message?.content ?? null;
}

function analyzeATSLocally(content: string) {
  const lower = content.toLowerCase();
  const lines = content.split("\n").filter((l) => l.trim());

  const hasContact = /[\w.-]+@[\w.-]+\.\w+/.test(content) || /\+?\d[\d\s\-().]{7,}/.test(content);
  const hasSummary = /summary|objetivo|perfil|sobre|profile/i.test(content);
  const hasExperience = /experience|experiência|trabalho|cargo|empresa|company/i.test(content);
  const hasSkills = /skills|habilidades|tecnologias|stack|competências/i.test(content);
  const hasEducation = /education|formação|universidade|faculdade|degree|graduação/i.test(content);

  const bulletLines = lines.filter((l) => /^[•\-*>→]\s/.test(l.trim()));
  const skillMatches = content.match(/\b(react|next\.?js|typescript|javascript|node\.?js|java|spring|docker|aws|postgresql|mongodb|redis|nestjs|tailwind|prisma|python|golang|rust)\b/gi) ?? [];
  const uniqueSkills = [...new Set(skillMatches.map((s) => s.toLowerCase()))];

  const keyATS = ["developed", "implemented", "improved", "increased", "reduced", "managed", "led", "built", "created", "designed", "deployed", "optimized", "architected", "desenvolveu", "implementou", "aumentou", "reduziu", "liderou", "construiu", "criou", "gerenciou"];
  const foundKeywords = keyATS.filter((k) => lower.includes(k));

  const scores = {
    contact: hasContact ? 20 : 0,
    summary: hasSummary ? 15 : 0,
    experience: hasExperience ? Math.min(25, 10 + bulletLines.length * 2) : 0,
    skills: hasSkills ? Math.min(20, uniqueSkills.length * 2) : 0,
    education: hasEducation ? 10 : 0,
    keywords: Math.min(10, foundKeywords.length * 2),
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const grade = total >= 85 ? "excellent" : total >= 70 ? "good" : total >= 50 ? "fair" : "poor";

  const suggestions: string[] = [];
  const strengths: string[] = [];

  if (!hasContact) suggestions.push("Adicione email e telefone visíveis");
  else strengths.push("Contato bem estruturado");
  if (!hasSummary) suggestions.push("Adicione um resumo profissional de 2-3 linhas");
  else strengths.push("Resumo profissional presente");
  if (bulletLines.length < 5) suggestions.push("Use bullet points com verbos de ação e resultados mensuráveis");
  else strengths.push(`${bulletLines.length} bullet points com resultados específicos`);
  if (uniqueSkills.length < 6) suggestions.push("Liste mais tecnologias relevantes");
  else strengths.push(`${uniqueSkills.length} tecnologias identificadas`);
  if (!hasEducation) suggestions.push("Adicione sua formação acadêmica");
  if (foundKeywords.length < 4) suggestions.push("Use verbos de impacto: desenvolveu, implementou, aumentou, reduziu, liderou");
  else strengths.push("Verbos de ação presentes");
  if (content.length < 500) suggestions.push("Currículo muito curto — adicione mais detalhes");
  if (content.length > 5000) suggestions.push("Currículo longo — condense para 1-2 páginas");

  return {
    score: total,
    grade,
    sections: {
      contact: { present: hasContact, score: scores.contact },
      summary: { present: hasSummary, score: scores.summary },
      experience: { present: hasExperience, score: scores.experience, bulletCount: bulletLines.length },
      skills: { present: hasSkills, score: scores.skills, count: uniqueSkills.length },
      education: { present: hasEducation, score: scores.education },
      keywords: { found: foundKeywords, score: scores.keywords },
    },
    suggestions,
    strengths,
  };
}

export async function analyzeATS(content: string) {
  const fallback = analyzeATSLocally(content);

  try {
    const message = await chatCompletion([
      {
        role: "system",
        content:
          "Voce e um avaliador ATS rigoroso para curriculos de tecnologia. Responda apenas JSON valido com score, grade, sections, suggestions e strengths. grade deve ser excellent, good, fair ou poor. score de 0 a 100. sections deve conter contact, summary, experience, skills, education e keywords com score numerico e dados auxiliares. Valorize especialmente palavras-chave tecnicas, resultados mensuraveis, clareza, hard skills, soft skills e stack relevante.",
      },
      {
        role: "user",
        content: `Analise o curriculo abaixo para ATS e devolva o JSON solicitado.\n\n${content}`,
      },
    ]);

    if (!message) {
      return fallback;
    }

    const parsed = JSON.parse(message) as Record<string, unknown>;

    return {
      score: typeof parsed.score === "number" ? parsed.score : fallback.score,
      grade:
        parsed.grade === "excellent" ||
        parsed.grade === "good" ||
        parsed.grade === "fair" ||
        parsed.grade === "poor"
          ? parsed.grade
          : fallback.grade,
      sections:
        parsed.sections && typeof parsed.sections === "object"
          ? {
              contact: {
                present: Boolean((parsed.sections as Record<string, unknown>).contact && ((parsed.sections as Record<string, unknown>).contact as Record<string, unknown>).present),
                score: Number(((parsed.sections as Record<string, unknown>).contact as Record<string, unknown>)?.score ?? fallback.sections.contact.score),
              },
              summary: {
                present: Boolean((parsed.sections as Record<string, unknown>).summary && ((parsed.sections as Record<string, unknown>).summary as Record<string, unknown>).present),
                score: Number(((parsed.sections as Record<string, unknown>).summary as Record<string, unknown>)?.score ?? fallback.sections.summary.score),
              },
              experience: {
                present: Boolean((parsed.sections as Record<string, unknown>).experience && ((parsed.sections as Record<string, unknown>).experience as Record<string, unknown>).present),
                score: Number(((parsed.sections as Record<string, unknown>).experience as Record<string, unknown>)?.score ?? fallback.sections.experience.score),
                bulletCount: Number(((parsed.sections as Record<string, unknown>).experience as Record<string, unknown>)?.bulletCount ?? fallback.sections.experience.bulletCount),
              },
              skills: {
                present: Boolean((parsed.sections as Record<string, unknown>).skills && ((parsed.sections as Record<string, unknown>).skills as Record<string, unknown>).present),
                score: Number(((parsed.sections as Record<string, unknown>).skills as Record<string, unknown>)?.score ?? fallback.sections.skills.score),
                count: Number(((parsed.sections as Record<string, unknown>).skills as Record<string, unknown>)?.count ?? fallback.sections.skills.count),
              },
              education: {
                present: Boolean((parsed.sections as Record<string, unknown>).education && ((parsed.sections as Record<string, unknown>).education as Record<string, unknown>).present),
                score: Number(((parsed.sections as Record<string, unknown>).education as Record<string, unknown>)?.score ?? fallback.sections.education.score),
              },
              keywords: {
                found: Array.isArray(((parsed.sections as Record<string, unknown>).keywords as Record<string, unknown>)?.found)
                  ? (((parsed.sections as Record<string, unknown>).keywords as Record<string, unknown>).found as unknown[]).filter((item): item is string => typeof item === "string")
                  : fallback.sections.keywords.found,
                score: Number(((parsed.sections as Record<string, unknown>).keywords as Record<string, unknown>)?.score ?? fallback.sections.keywords.score),
              },
            }
          : fallback.sections,
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.filter((item): item is string => typeof item === "string")
        : fallback.suggestions,
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths.filter((item): item is string => typeof item === "string")
        : fallback.strengths,
    };
  } catch {
    return fallback;
  }
}

async function generateResumeWithAI(params: {
  fallback: string;
  site: ReturnType<typeof normalizeSiteContent>;
  selectedProjects: Awaited<ReturnType<typeof listProjects>>;
}) {
  const { fallback, site, selectedProjects } = params;

  try {
    const message = await chatCompletion([
      {
        role: "system",
        content:
          "Voce escreve curriculos ATS-ready em portugues brasileiro. Responda apenas JSON valido com a chave content. O curriculo deve ser claro, forte, profissional, sem exageros, com palavras-chave do cargo alvo, e com bullets objetivos. Preserve formato em markdown: titulo principal com '#', secoes com '##', subtitulos com '###' e listas com '-'. O curriculo precisa incluir claramente stack principal, hard skills e soft skills quando a secao de habilidades estiver ativa.",
      },
      {
        role: "user",
        content: JSON.stringify({
          instruction:
            "Gere um curriculo em markdown otimizado para ATS com base no perfil do site, nas secoes ativas e nos projetos selecionados. Use o cargo alvo e os topicos foco como palavras-chave naturais. Estruture o curriculo na ordem exata das secoes ativas. Se uma secao estiver desativada, nao inclua. Inclua resultados, stack e contexto dos projetos quando ajudarem o ATS. Na secao de habilidades, separe claramente Stack principal, Hard skills e Soft skills.",
          targetRole: site.resume.targetRole,
          summaryBase: site.resume.summary,
          focusTopics: site.resume.focusTopics,
          softSkills: site.resume.softSkills,
          keywords: site.resume.keywords,
          sectionOrder: site.resume.sections.filter((item) => item.enabled).map((item) => item.label),
          profile: {
            name: site.profile.name,
            headline: site.profile.resumeHeadline,
            location: site.profile.location,
            email: site.profile.email,
            website: site.profile.website,
            bio: site.profile.longBio,
          },
          experiences: site.about.experiences,
          education: site.about.education,
          techStack: site.about.techStack,
          projects: selectedProjects.map((project) => ({
            title: project.title,
            description: project.description,
            longDescription: project.long_description,
            techStack: project.tech_stack,
            architecture: project.architecture,
            result: project.overview_resultado,
            problem: project.overview_problema,
            solution: project.overview_solucao,
            learnings: project.aprendizados,
            nextSteps: project.next_steps,
            liveUrl: project.live_url,
            githubUrl: project.github_url,
          })),
          fallbackTemplate: fallback,
        }),
      },
    ]);

    if (!message) {
      return fallback;
    }

    const parsed = JSON.parse(message) as { content?: string };
    return typeof parsed.content === "string" && parsed.content.trim() ? parsed.content.trim() : fallback;
  } catch {
    return fallback;
  }
}

export async function generateResumeFromProjects(body: unknown) {
  const payload = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const requestedIds = Array.isArray(payload.projectIds)
    ? payload.projectIds.filter((value): value is string => typeof value === "string")
    : [];
  const save = payload.save !== false;
  const [settings, projects] = await Promise.all([
    getSettings().catch(() => ({})),
    listProjects(true),
  ]);
  const site = normalizeSiteContent(settings);

  if (Array.isArray(payload.resumeProfile)) {
    site.resume.focusTopics = payload.resumeProfile.filter(
      (value): value is string => typeof value === "string"
    );
  }

  if (typeof payload.resumeSummary === "string") {
    site.resume.summary = payload.resumeSummary.trim();
  }

  if (typeof payload.resumeTargetRole === "string") {
    site.resume.targetRole = payload.resumeTargetRole.trim();
  }

  if (Array.isArray(payload.resumeSoftSkills)) {
    site.resume.softSkills = payload.resumeSoftSkills.filter(
      (value): value is string => typeof value === "string"
    );
  }

  if (Array.isArray(payload.resumeKeywords)) {
    site.resume.keywords = payload.resumeKeywords.filter(
      (value): value is string => typeof value === "string"
    );
  }

  site.resume.sections = normalizeResumeSections(
    payload.resumeSections,
    site.resume.sections
  );

  const selectedProjects =
    requestedIds.length > 0
      ? orderProjectsByIds(projects, requestedIds)
      : orderProjectsByIds(
          projects,
          site.resume.defaultProjectIds.length > 0
            ? site.resume.defaultProjectIds
            : projects.filter((item) => item.featured).map((item) => item.id)
        );

  site.resume.defaultProjectIds = selectedProjects.map((project) => project.id);
  const fallbackContent = buildResumeContent(site, selectedProjects);
  const content = await generateResumeWithAI({
    fallback: fallbackContent,
    site,
    selectedProjects,
  });
  const atsFeedback = await analyzeATS(content);
  await upsertSettings(buildSettingsPayload(site));
  const saved = save ? await saveResume(content) : null;

  if (save && saved) {
    await saveATSResult(saved.id, atsFeedback);
  }

  return {
    content,
    saved,
    selectedIds: selectedProjects.map((project) => project.id),
    settings: buildSettingsPayload(site),
    atsFeedback,
  };
}
