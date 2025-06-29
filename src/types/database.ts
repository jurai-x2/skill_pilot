export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          career_path?: string;
          level: number;
          xp: number;
          total_xp: number;
          streak: number;
          completed_lessons: number;
          joined_at: string;
          country?: string;
          language: string;
          learning_style?: string;
          time_commitment?: string;
          github_url?: string;
          portfolio_url?: string;
          personality_type?: string;
          study_hours?: number;
          weekly_goal?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          career_path?: string;
          level?: number;
          xp?: number;
          total_xp?: number;
          streak?: number;
          completed_lessons?: number;
          joined_at?: string;
          country?: string;
          language?: string;
          learning_style?: string;
          time_commitment?: string;
          github_url?: string;
          portfolio_url?: string;
          personality_type?: string;
          study_hours?: number;
          weekly_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          career_path?: string;
          level?: number;
          xp?: number;
          total_xp?: number;
          streak?: number;
          completed_lessons?: number;
          joined_at?: string;
          country?: string;
          language?: string;
          learning_style?: string;
          time_commitment?: string;
          github_url?: string;
          portfolio_url?: string;
          personality_type?: string;
          study_hours?: number;
          weekly_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          career_path: string;
          confidence: number;
          description: string;
          skills: string[];
          next_steps: string[];
          personality_type: string;
          learning_style: string;
          alternative_paths: string[];
          riasec_profile: string;
          big_five_traits: Record<string, number>;
          quiz_answers: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_path: string;
          confidence: number;
          description: string;
          skills: string[];
          next_steps: string[];
          personality_type: string;
          learning_style: string;
          alternative_paths: string[];
          riasec_profile: string;
          big_five_traits: Record<string, number>;
          quiz_answers: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          career_path?: string;
          confidence?: number;
          description?: string;
          skills?: string[];
          next_steps?: string[];
          personality_type?: string;
          learning_style?: string;
          alternative_paths?: string[];
          riasec_profile?: string;
          big_five_traits?: Record<string, number>;
          quiz_answers?: Record<string, any>;
          created_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          career_track: string;
          issued_at: string;
          project_url?: string;
          unique_id: string;
          verified: boolean;
          skills: string[];
          grade?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          career_track: string;
          issued_at?: string;
          project_url?: string;
          unique_id: string;
          verified?: boolean;
          skills: string[];
          grade?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          career_track?: string;
          issued_at?: string;
          project_url?: string;
          unique_id?: string;
          verified?: boolean;
          skills?: string[];
          grade?: string;
          created_at?: string;
        };
      };
      roadmap_stages: {
        Row: {
          id: string;
          career_path: string;
          title: string;
          description: string;
          stage_order: number;
          estimated_weeks: number;
          xp_required: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          career_path: string;
          title: string;
          description: string;
          stage_order: number;
          estimated_weeks: number;
          xp_required: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          career_path?: string;
          title?: string;
          description?: string;
          stage_order?: number;
          estimated_weeks?: number;
          xp_required?: number;
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          stage_id: string;
          completed: boolean;
          started_at?: string;
          completed_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stage_id: string;
          completed?: boolean;
          started_at?: string;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stage_id?: string;
          completed?: boolean;
          started_at?: string;
          completed_at?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}