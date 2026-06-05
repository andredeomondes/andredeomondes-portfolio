import { adminDb } from "../lib/supabase.js";
import type { Resume, ATSResult } from "../types/index.js";

const TABLE = "resume";

export async function getResume(): Promise<Resume | null> {
  const { data, error } = await adminDb
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data as Resume;
}

export async function saveResume(content: string): Promise<Resume> {
  const existing = await getResume();
  if (existing) {
    const { data, error } = await adminDb
      .from(TABLE)
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Resume;
  }
  const { data, error } = await adminDb
    .from(TABLE)
    .insert({ content })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Resume;
}

export async function saveATSResult(id: string, result: ATSResult): Promise<void> {
  await adminDb
    .from(TABLE)
    .update({ ats_score: result.score, ats_feedback: result, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export function analyzeATS(content: string): ATSResult {
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

  return { score: total, grade, sections: {
    contact: { present: hasContact, score: scores.contact },
    summary: { present: hasSummary, score: scores.summary },
    experience: { present: hasExperience, score: scores.experience, bulletCount: bulletLines.length },
    skills: { present: hasSkills, score: scores.skills, count: uniqueSkills.length },
    education: { present: hasEducation, score: scores.education },
    keywords: { found: foundKeywords, score: scores.keywords },
  }, suggestions, strengths };
}
