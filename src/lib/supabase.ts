import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  urlType: typeof supabaseUrl,
  keyType: typeof supabaseAnonKey
});

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const hasUrl = !!supabaseUrl && supabaseUrl !== 'your-project-url' && supabaseUrl.length > 10;
  const hasKey = !!supabaseAnonKey && supabaseAnonKey !== 'your-anon-key' && supabaseAnonKey.length > 10;
  const urlValid = hasUrl && supabaseUrl.includes('supabase.co');
  
  const isConfigured = hasUrl && hasKey && urlValid;
  
  console.log('🔍 Supabase Configuration Status:', {
    hasUrl,
    hasKey,
    urlValid,
    isConfigured,
    actualUrl: supabaseUrl,
    actualKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'undefined'
  });
  
  return isConfigured;
};

// Create Supabase client - only if configured
let supabase: any = null;

if (isSupabaseConfigured()) {
  try {
    console.log('✅ Creating Supabase client...');
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    console.log('✅ Supabase client created successfully');
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
  }
} else {
  console.warn('⚠️ Supabase not configured - running in demo mode');
}

export { supabase };

// Auth helpers with better error handling
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    if (!supabase) {
      console.error('❌ Auth Error: Supabase not configured');
      throw new Error('Authentication service not available');
    }
    
    try {
      console.log('🔐 Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error('❌ Sign up error:', error);
      } else {
        console.log('✅ Sign up successful');
      }
      
      return { data, error };
    } catch (err) {
      console.error('❌ Sign up network error:', err);
      return { data: null, error: { message: 'Network error during sign up' } };
    }
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      console.error('❌ Auth Error: Supabase not configured');
      throw new Error('Authentication service not available');
    }
    
    try {
      console.log('🔐 Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { data, error };
    } catch (err) {
      console.error('❌ Sign in network error:', err);
      return { data: null, error: { message: 'Network error during sign in' } };
    }
  },

  signOut: async () => {
    if (!supabase) {
      console.log('⚠️ Sign out: Supabase not configured');
      return { error: null };
    }
    
    try {
      console.log('🔐 Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Sign out successful');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Sign out network error:', err);
      return { error: { message: 'Network error during sign out' } };
    }
  },

  resetPassword: async (email: string) => {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }
    
    try {
      console.log('🔐 Sending password reset for:', email);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { data, error };
    } catch (err) {
      console.error('❌ Password reset network error:', err);
      return { data: null, error: { message: 'Network error during password reset' } };
    }
  },

  getCurrentUser: async () => {
    if (!supabase) {
      console.log('⚠️ Get user: Supabase not configured');
      return { data: { user: null }, error: null };
    }
    
    try {
      console.log('👤 Getting current user...');
      const result = await supabase.auth.getUser();
      console.log('👤 Current user result:', result.data.user ? 'Found user' : 'No user');
      return result;
    } catch (err) {
      console.error('❌ Get user error:', err);
      return { data: { user: null }, error: { message: 'Failed to get current user' } };
    }
  },

  getSession: async () => {
    if (!supabase) {
      console.log('⚠️ Get session: Supabase not configured');
      return { data: { session: null }, error: null };
    }
    
    try {
      console.log('🔑 Getting current session...');
      const result = await supabase.auth.getSession();
      console.log('🔑 Session result:', result.data.session ? 'Found session' : 'No session');
      return result;
    } catch (err) {
      console.error('❌ Get session error:', err);
      return { data: { session: null }, error: { message: 'Failed to get session' } };
    }
  }
};

// Database helpers with better error handling
export const db = {
  // Users
  getUser: async (id: string) => {
    if (!supabase) {
      console.log('⚠️ DB: Supabase not configured');
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Getting user profile for:', id);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('❌ Get user error:', error);
      } else {
        console.log('✅ User profile loaded');
      }
      
      return { data, error };
    } catch (err) {
      console.error('❌ Get user network error:', err);
      return { data: null, error: { message: 'Network error fetching user' } };
    }
  },

  updateUser: async (id: string, updates: any) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Updating user:', id);
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      console.error('❌ Update user error:', err);
      return { data: null, error: { message: 'Network error updating user' } };
    }
  },

  // Quiz Results
  saveQuizResult: async (userId: string, result: any) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Saving quiz result for:', userId);
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
      console.error('❌ Save quiz result error:', err);
      return { data: null, error: { message: 'Network error saving quiz result' } };
    }
  },

  getQuizResults: async (userId: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Getting quiz results for:', userId);
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (err) {
      console.error('❌ Get quiz results error:', err);
      return { data: [], error: { message: 'Network error fetching quiz results' } };
    }
  }
};