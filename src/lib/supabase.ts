import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const isConfigured = !!(supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your-project-url' && 
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.includes('supabase.co'));
  
  console.log('Supabase configuration check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlValid: supabaseUrl?.includes('supabase.co'),
    isConfigured
  });
  
  return isConfigured;
};

// Create Supabase client - only if configured
let supabase: any = null;

if (isSupabaseConfigured()) {
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    console.log('Supabase client created successfully');
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
  }
} else {
  console.warn('Supabase not configured - client not created');
}

export { supabase };

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
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
      console.error('Sign up network error:', err);
      return { data: null, error: { message: 'Network error during sign up' } };
    }
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (err) {
      console.error('Sign in network error:', err);
      return { data: null, error: { message: 'Network error during sign in' } };
    }
  },

  signOut: async () => {
    if (!supabase) {
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('Sign out network error:', err);
      return { error: { message: 'Network error during sign out' } };
    }
  },

  resetPassword: async (email: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { data, error };
    } catch (err) {
      console.error('Password reset network error:', err);
      return { data: null, error: { message: 'Network error during password reset' } };
    }
  },

  updatePassword: async (password: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      });
      return { data, error };
    } catch (err) {
      console.error('Password update network error:', err);
      return { data: null, error: { message: 'Network error during password update' } };
    }
  },

  getCurrentUser: () => {
    if (!supabase) {
      return Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } });
    }
    
    try {
      return supabase.auth.getUser();
    } catch (err) {
      console.error('Get user error:', err);
      return Promise.resolve({ data: { user: null }, error: { message: 'Failed to get current user' } });
    }
  },

  getSession: () => {
    if (!supabase) {
      return Promise.resolve({ data: { session: null }, error: { message: 'Supabase not configured' } });
    }
    
    try {
      return supabase.auth.getSession();
    } catch (err) {
      console.error('Get session error:', err);
      return Promise.resolve({ data: { session: null }, error: { message: 'Failed to get session' } });
    }
  }
};

// Database helpers
export const db = {
  // Users
  getUser: async (id: string) => {
    if (!supabase) {
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
      console.error('Get user error:', err);
      return { data: null, error: { message: 'Network error fetching user' } };
    }
  },

  updateUser: async (id: string, updates: any) => {
    if (!supabase) {
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
      console.error('Update user error:', err);
      return { data: null, error: { message: 'Network error updating user' } };
    }
  },

  // Quiz Results
  saveQuizResult: async (userId: string, result: any) => {
    if (!supabase) {
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
      console.error('Save quiz result error:', err);
      return { data: null, error: { message: 'Network error saving quiz result' } };
    }
  },

  getQuizResults: async (userId: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (err) {
      console.error('Get quiz results error:', err);
      return { data: [], error: { message: 'Network error fetching quiz results' } };
    }
  },

  // Roadmap
  getRoadmapStages: async (userId: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Supabase not configured' } };
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
      console.error('Get roadmap error:', err);
      return { data: [], error: { message: 'Network error fetching roadmap' } };
    }
  },

  updateStageProgress: async (stageId: string, completed: boolean) => {
    if (!supabase) {
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
      console.error('Update stage error:', err);
      return { data: null, error: { message: 'Network error updating stage' } };
    }
  },

  updateLessonProgress: async (lessonId: string, completed: boolean) => {
    if (!supabase) {
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
      console.error('Update lesson error:', err);
      return { data: null, error: { message: 'Network error updating lesson' } };
    }
  },

  updateProjectProgress: async (projectId: string, completed: boolean) => {
    if (!supabase) {
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
      console.error('Update project error:', err);
      return { data: null, error: { message: 'Network error updating project' } };
    }
  },

  // Forum
  getForumPosts: async (careerTrack?: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Supabase not configured' } };
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
      console.error('Get forum posts error:', err);
      return { data: [], error: { message: 'Network error fetching forum posts' } };
    }
  },

  createForumPost: async (userId: string, post: any) => {
    if (!supabase) {
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
      console.error('Create forum post error:', err);
      return { data: null, error: { message: 'Network error creating forum post' } };
    }
  },

  // Achievements
  getUserAchievements: async (userId: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (err) {
      console.error('Get achievements error:', err);
      return { data: [], error: { message: 'Network error fetching achievements' } };
    }
  },

  awardAchievement: async (userId: string, achievement: any) => {
    if (!supabase) {
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
      console.error('Award achievement error:', err);
      return { data: null, error: { message: 'Network error awarding achievement' } };
    }
  },

  // Live Events
  getLiveEvents: async () => {
    if (!supabase) {
      return { data: [], error: { message: 'Supabase not configured' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('live_events')
        .select('*')
        .order('start_time');
      return { data, error };
    } catch (err) {
      console.error('Get live events error:', err);
      return { data: [], error: { message: 'Network error fetching live events' } };
    }
  }
};