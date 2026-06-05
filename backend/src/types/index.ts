export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  tags: string[];
  tech_stack: string[];
  architecture: string[];
  meta: string[];
  overview_problema: string;
  overview_solucao: string;
  overview_resultado: string;
  aprendizados: string[];
  next_steps: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  featured_order: number | null;
  published: boolean;
}

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;

export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

export interface Resume {
  id: string;
  content: string;
  ats_score: number | null;
  ats_feedback: ATSResult | null;
  updated_at: string;
}

export interface ATSResult {
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
