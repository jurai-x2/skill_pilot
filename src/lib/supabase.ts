import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  },

  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  getSession: () => {
    return supabase.auth.getSession();
  }
};

// Database helpers
export const db = {
  // Users
  getUser: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateUser: async (id: string, updates: any) => {
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
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        ...result
      })
      .select()
      .single();
    return { data, error };
  },

  getQuizResults: async (userId: string) => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Roadmap
  getRoadmapStages: async (userId: string) => {
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
    const { data, error } = await supabase
      .from('roadmap_stages')
      .update({ completed })
      .eq('id', stageId)
      .select()
      .single();
    return { data, error };
  },

  updateLessonProgress: async (lessonId: string, completed: boolean) => {
    const { data, error } = await supabase
      .from('lessons')
      .update({ completed })
      .eq('id', lessonId)
      .select()
      .single();
    return { data, error };
  },

  updateProjectProgress: async (projectId: string, completed: boolean) => {
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
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  awardAchievement: async (userId: string, achievement: any) => {
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
    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .order('start_time');
    return { data, error };
  }
};