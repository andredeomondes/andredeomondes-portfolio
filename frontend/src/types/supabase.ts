export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ProjectRow = {
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
};

type SiteSettingRow = {
  id: string;
  key: string;
  value: Json;
  updated_at: string;
};

type ResumeRow = {
  id: string;
  content: string;
  ats_score: number | null;
  ats_feedback: Json | null;
  updated_at: string;
};

// Shape follows `supabase gen types` output so postgrest-js can infer table types.
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<ProjectRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<ProjectRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: Omit<SiteSettingRow, "id" | "updated_at"> &
          Partial<Pick<SiteSettingRow, "id" | "updated_at">>;
        Update: Partial<SiteSettingRow>;
        Relationships: [];
      };
      resume: {
        Row: ResumeRow;
        Insert: Pick<ResumeRow, "content"> & Partial<Omit<ResumeRow, "content">>;
        Update: Partial<ResumeRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
export type Resume = Database["public"]["Tables"]["resume"]["Row"];
