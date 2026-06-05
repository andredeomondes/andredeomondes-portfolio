export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
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
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["site_settings"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
      resume: {
        Row: {
          id: string;
          content: string;
          ats_score: number | null;
          ats_feedback: Json | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["resume"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["resume"]["Insert"]>;
      };
    };
  };
}

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
export type Resume = Database["public"]["Tables"]["resume"]["Row"];
