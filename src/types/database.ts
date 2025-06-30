export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          career_path: string | null
          level: number
          xp: number
          total_xp: number
          streak: number
          completed_lessons: number
          joined_at: string
          country: string | null
          language: string
          learning_style: string | null
          time_commitment: string | null
          github_url: string | null
          portfolio_url: string | null
          personality_type: string | null
          study_hours: number
          weekly_goal: number
          squad: string | null
          followers: number
          following: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          career_path?: string | null
          level?: number
          xp?: number
          total_xp?: number
          streak?: number
          completed_lessons?: number
          joined_at?: string
          country?: string | null
          language?: string
          learning_style?: string | null
          time_commitment?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          personality_type?: string | null
          study_hours?: number
          weekly_goal?: number
          squad?: string | null
          followers?: number
          following?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          career_path?: string | null
          level?: number
          xp?: number
          total_xp?: number
          streak?: number
          completed_lessons?: number
          joined_at?: string
          country?: string | null
          language?: string
          learning_style?: string | null
          time_commitment?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          personality_type?: string | null
          study_hours?: number
          weekly_goal?: number
          squad?: string | null
          followers?: number
          following?: number
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          name: string
          career_track: string
          issued_at: string
          project_url: string | null
          unique_id: string
          verified: boolean
          skills: string[]
          grade: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          career_track: string
          issued_at?: string
          project_url?: string | null
          unique_id: string
          verified?: boolean
          skills: string[]
          grade?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          career_track?: string
          issued_at?: string
          project_url?: string | null
          unique_id?: string
          verified?: boolean
          skills?: string[]
          grade?: string | null
          created_at?: string
        }
      }
      quiz_results: {
        Row: {
          id: string
          user_id: string
          career_path: string
          confidence: number
          description: string
          skills: string[]
          next_steps: string[]
          personality_type: string
          learning_style: string
          alternative_paths: string[]
          riasec_profile: string
          big_five_traits: Json
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          career_path: string
          confidence: number
          description: string
          skills: string[]
          next_steps: string[]
          personality_type: string
          learning_style: string
          alternative_paths: string[]
          riasec_profile: string
          big_five_traits: Json
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          career_path?: string
          confidence?: number
          description?: string
          skills?: string[]
          next_steps?: string[]
          personality_type?: string
          learning_style?: string
          alternative_paths?: string[]
          riasec_profile?: string
          big_five_traits?: Json
          completed_at?: string
          created_at?: string
        }
      }
      roadmap_stages: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          completed: boolean
          estimated_weeks: number
          unlocked: boolean
          xp_required: number
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          completed?: boolean
          estimated_weeks: number
          unlocked?: boolean
          xp_required?: number
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          completed?: boolean
          estimated_weeks?: number
          unlocked?: boolean
          xp_required?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          stage_id: string
          title: string
          type: string
          duration: number
          completed: boolean
          xp_reward: number
          content: string | null
          video_url: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stage_id: string
          title: string
          type: string
          duration: number
          completed?: boolean
          xp_reward: number
          content?: string | null
          video_url?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stage_id?: string
          title?: string
          type?: string
          duration?: number
          completed?: boolean
          xp_reward?: number
          content?: string | null
          video_url?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          stage_id: string
          title: string
          description: string
          difficulty: string
          estimated_hours: number
          completed: boolean
          technologies: string[]
          requirements: string[]
          xp_reward: number
          approved: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stage_id: string
          title: string
          description: string
          difficulty: string
          estimated_hours: number
          completed?: boolean
          technologies: string[]
          requirements: string[]
          xp_reward: number
          approved?: boolean
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stage_id?: string
          title?: string
          description?: string
          difficulty?: string
          estimated_hours?: number
          completed?: boolean
          technologies?: string[]
          requirements?: string[]
          xp_reward?: number
          approved?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      forum_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          career_track: string
          tags: string[]
          likes: number
          views: number
          solved: boolean
          pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          career_track: string
          tags: string[]
          likes?: number
          views?: number
          solved?: boolean
          pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          career_track?: string
          tags?: string[]
          likes?: number
          views?: number
          solved?: boolean
          pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      forum_replies: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          likes: number
          is_answer: boolean
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          likes?: number
          is_answer?: boolean
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          likes?: number
          is_answer?: boolean
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          icon: string
          earned: boolean
          earned_at: string | null
          xp_reward: number
          category: string
          rarity: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          icon: string
          earned?: boolean
          earned_at?: string | null
          xp_reward: number
          category: string
          rarity: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          icon?: string
          earned?: boolean
          earned_at?: string | null
          xp_reward?: number
          category?: string
          rarity?: string
          created_at?: string
        }
      }
      live_events: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          start_time: string
          end_time: string
          max_participants: number | null
          current_participants: number
          host: string
          registration_required: boolean
          career_tracks: string[]
          meeting_url: string | null
          recording_url: string | null
          prizes: string[] | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          start_time: string
          end_time: string
          max_participants?: number | null
          current_participants?: number
          host: string
          registration_required?: boolean
          career_tracks: string[]
          meeting_url?: string | null
          recording_url?: string | null
          prizes?: string[] | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          start_time?: string
          end_time?: string
          max_participants?: number | null
          current_participants?: number
          host?: string
          registration_required?: boolean
          career_tracks?: string[]
          meeting_url?: string | null
          recording_url?: string | null
          prizes?: string[] | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}