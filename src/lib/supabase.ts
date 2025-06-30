import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project-ref.supabase.co' && 
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseUrl.includes('supabase.co'));
};

// Create Supabase client only if configured
let supabase: any = null;

if (isSupabaseConfigured()) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase };

// Auth helpers with fallback for unconfigured Supabase
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error during sign up' } };
    }
  },

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error during sign in' } };
    }
  },

  signOut: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      return { error: { message: 'Network error during sign out' } };
    }
  },

  resetPassword: async (email: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error during password reset' } };
    }
  },

  updatePassword: async (password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error during password update' } };
    }
  },

  getCurrentUser: () => {
    if (!isSupabaseConfigured() || !supabase) {
      return Promise.resolve({ data: { user: null }, error: null });
    }
    
    try {
      return supabase.auth.getUser();
    } catch (err) {
      return Promise.resolve({ data: { user: null }, error: { message: 'Failed to get current user' } });
    }
  },

  getSession: () => {
    if (!isSupabaseConfigured() || !supabase) {
      return Promise.resolve({ data: { session: null }, error: null });
    }
    
    try {
      return supabase.auth.getSession();
    } catch (err) {
      return Promise.resolve({ data: { session: null }, error: { message: 'Failed to get session' } });
    }
  }
};

// Database helpers with fallback for unconfigured Supabase
export const db = {
  // Users
  getUser: async (id: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error fetching user' } };
    }
  },

  updateUser: async (id: string, updates: any) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error updating user' } };
    }
  },

  // Quiz Results
  saveQuizResult: async (userId: string, result: any) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
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
    } catch (err) {
      return { data: null, error: { message: 'Network error saving quiz result' } };
    }
  },

  getQuizResults: async (userId: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (err) {
      return { data: [], error: { message: 'Network error fetching quiz results' } };
    }
  },

  // Roadmap
  getRoadmapStages: async (userId: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: null };
    }
    
    try {
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
    } catch (err) {
      return { data: [], error: { message: 'Network error fetching roadmap' } };
    }
  },

  updateStageProgress: async (stageId: string, completed: boolean) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('roadmap_stages')
        .update({ completed })
        .eq('id', stageId)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error updating stage' } };
    }
  },

  updateLessonProgress: async (lessonId: string, completed: boolean) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update({ completed })
        .eq('id', lessonId)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error updating lesson' } };
    }
  },

  updateProjectProgress: async (projectId: string, completed: boolean) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ completed })
        .eq('id', projectId)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error updating project' } };
    }
  },

  // Forum
  getForumPosts: async (careerTrack?: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: null };
    }
    
    try {
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
    } catch (err) {
      return { data: [], error: { message: 'Network error fetching forum posts' } };
    }
  },

  createForumPost: async (userId: string, post: any) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: userId,
          ...post
        })
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Network error creating forum post' } };
    }
  },

  // Achievements
  getUserAchievements: async (userId: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (err) {
      return { data: [], error: { message: 'Network error fetching achievements' } };
    }
  },

  awardAchievement: async (userId: string, achievement: any) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
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
    } catch (err) {
      return { data: null, error: { message: 'Network error awarding achievement' } };
    }
  },

  // Live Events
  getLiveEvents: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('live_events')
        .select('*')
        .order('start_time');
      return { data, error };
    } catch (err) {
      return { data: [], error: { message: 'Network error fetching live events' } };
    }
  }
};