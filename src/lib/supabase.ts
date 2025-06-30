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
        detectSessionInUrl: true,
        flowType: 'pkce' // Use PKCE flow for better performance
      },
      global: {
        headers: {
          'x-client-info': 'skillpilot-web'
        }
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

// Auth helpers with better error handling and timeouts
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    if (!supabase) {
      console.error('❌ Auth Error: Supabase not configured');
      throw new Error('Authentication service not available');
    }
    
    try {
      console.log('🔐 Attempting sign up for:', email);
      
      // Add timeout wrapper
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign up request timed out')), 15000)
      );

      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Sign up error:', error);
      } else {
        console.log('✅ Sign up successful');
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Sign up network error:', err);
      return { 
        data: null, 
        error: { 
          message: err.message === 'Sign up request timed out' 
            ? 'Sign up is taking longer than expected. Please try again.' 
            : 'Network error during sign up. Please check your connection and try again.'
        } 
      };
    }
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      console.error('❌ Auth Error: Supabase not configured');
      throw new Error('Authentication service not available');
    }
    
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      // Add timeout wrapper
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in request timed out')), 15000)
      );

      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Sign in error:', error);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Sign in network error:', err);
      return { 
        data: null, 
        error: { 
          message: err.message === 'Sign in request timed out' 
            ? 'Sign in is taking longer than expected. Please try again.' 
            : 'Network error during sign in. Please check your connection and try again.'
        } 
      };
    }
  },

  signOut: async () => {
    if (!supabase) {
      console.log('⚠️ Sign out: Supabase not configured');
      return { error: null };
    }
    
    try {
      console.log('🔐 Signing out...');
      
      // Add timeout wrapper
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out request timed out')), 5000)
      );

      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Sign out successful');
      }
      
      return { error };
    } catch (err: any) {
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
      
      const resetPromise = supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Password reset request timed out')), 10000)
      );

      const { data, error } = await Promise.race([resetPromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Password reset network error:', err);
      return { 
        data: null, 
        error: { 
          message: err.message === 'Password reset request timed out' 
            ? 'Password reset is taking longer than expected. Please try again.' 
            : 'Network error during password reset'
        } 
      };
    }
  },

  getCurrentUser: async () => {
    if (!supabase) {
      console.log('⚠️ Get user: Supabase not configured');
      return { data: { user: null }, error: null };
    }
    
    try {
      console.log('👤 Getting current user...');
      
      const userPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Get user request timed out')), 5000)
      );

      const result = await Promise.race([userPromise, timeoutPromise]) as any;
      console.log('👤 Current user result:', result.data.user ? 'Found user' : 'No user');
      return result;
    } catch (err: any) {
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
      
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Get session request timed out')), 3000)
      );

      const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
      console.log('🔑 Session result:', result.data.session ? 'Found session' : 'No session');
      return result;
    } catch (err: any) {
      console.error('❌ Get session error:', err);
      return { data: { session: null }, error: { message: 'Failed to get session' } };
    }
  }
};

// Database helpers with better error handling and timeouts
export const db = {
  // Users
  getUser: async (id: string) => {
    if (!supabase) {
      console.log('⚠️ DB: Supabase not configured');
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Getting user profile for:', id);
      
      const userPromise = supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database request timed out')), 5000)
      );

      const { data, error } = await Promise.race([userPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Get user error:', error);
      } else {
        console.log('✅ User profile loaded');
      }
      
      return { data, error };
    } catch (err: any) {
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
      
      const updatePromise = supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database update timed out')), 5000)
      );

      const { data, error } = await Promise.race([updatePromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
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
      
      const savePromise = supabase
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

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database save timed out')), 5000)
      );

      const { data, error } = await Promise.race([savePromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
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
      
      const getPromise = supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database fetch timed out')), 5000)
      );

      const { data, error } = await Promise.race([getPromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get quiz results error:', err);
      return { data: [], error: { message: 'Network error fetching quiz results' } };
    }
  }
};