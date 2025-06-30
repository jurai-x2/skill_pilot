import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For development, we'll use a fallback to prevent the app from crashing
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

export const supabase = createClient<Database>(
  supabaseUrl || defaultUrl, 
  supabaseAnonKey || defaultKey, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== defaultUrl && 
    supabaseAnonKey !== defaultKey);
};

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please set up your environment variables.' } 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please set up your environment variables.' } 
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  resetPassword: async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please set up your environment variables.' } 
      };
    }
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  },

  updatePassword: async (password: string) => {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please set up your environment variables.' } 
      };
    }
    
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  },

  getCurrentUser: () => {
    if (!isSupabaseConfigured()) {
      return Promise.resolve({ data: { user: null }, error: null });
    }
    return supabase.auth.getUser();
  },

  getSession: () => {
    if (!isSupabaseConfigured()) {
      return Promise.resolve({ data: { session: null }, error: null });
    }
    return supabase.auth.getSession();
  }
};

// Database helpers
export const db = {
  // Users
  getUser: async (id: string) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateUser: async (id: string, updates: any) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Quiz Results
  saveQuizResult: async (userId: string, result: any) => {
    if (!isSupabaseConfigured()) {
      console.log('Quiz result saved locally (Supabase not configured):', result);
      return { data: result, error: null };
    }
    
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        career_path: result.careerPath,
        confidence: result.confidence,
        description: result.description,
        skills: result.skills,
        next_steps: result.nextSteps,
        personality_type: result.personalityType,
        learning_style: result.learningStyle,
        alternative_paths: result.alternativePaths,
        riasec_profile: result.riasecProfile,
        big_five_traits: result.bigFiveTraits
      })
      .select()
      .single();
    return { data, error };
  },

  getQuizResults: async (userId: string) => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Roadmap
  getRoadmapStages: async (userId: string) => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('roadmap_stages')
      .select(`
        *,
        lessons(*),
        projects(*)
      `)
      .eq('user_id', userId)
      .order('order_index');
    return { data, error };
  },

  updateStageProgress: async (stageId: string, completed: boolean) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('roadmap_stages')
      .update({ completed })
      .eq('id', stageId)
      .select()
      .single();
    return { data, error };
  },

  updateLessonProgress: async (lessonId: string, completed: boolean) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('lessons')
      .update({ completed })
      .eq('id', lessonId)
      .select()
      .single();
    return { data, error };
  },

  updateProjectProgress: async (projectId: string, completed: boolean) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update({ completed })
      .eq('id', projectId)
      .select()
      .single();
    return { data, error };
  },

  // Forum
  getForumPosts: async (careerTrack?: string) => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }
    
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        users(name, avatar_url, career_path),
        forum_replies(count)
      `)
      .order('created_at', { ascending: false });

    if (careerTrack && careerTrack !== 'all') {
      query = query.eq('career_track', careerTrack);
    }

    const { data, error } = await query;
    return { data, error };
  },

  createForumPost: async (userId: string, post: any) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: userId,
        ...post
      })
      .select()
      .single();
    return { data, error };
  },

  // Achievements
  getUserAchievements: async (userId: string) => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  awardAchievement: async (userId: string, achievement: any) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        ...achievement,
        earned: true,
        earned_at: new Date().toISOString()
      })
      .select()
      .single();
    return { data, error };
  },

  // Live Events
  getLiveEvents: async () => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .order('start_time');
    return { data, error };
  }
};