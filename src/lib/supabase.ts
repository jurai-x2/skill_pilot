import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  urlType: typeof supabaseUrl,
  keyType: typeof supabaseAnonKey,
  fullUrl: supabaseUrl // Show full URL for debugging
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

// Test Supabase connectivity
const testSupabaseConnectivity = async () => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Skipping connectivity test - Supabase not configured');
    return false;
  }

  try {
    console.log('🔍 Testing Supabase connectivity...');
    const testUrl = `${supabaseUrl}/auth/v1/settings`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('✅ Supabase connectivity test passed');
      return true;
    } else {
      console.error('❌ Supabase connectivity test failed:', response.status, response.statusText);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Supabase connectivity test error:', error.message);
    if (error.name === 'AbortError') {
      console.error('❌ Supabase server is not responding (timeout)');
    }
    return false;
  }
};

// Create Supabase client - only if configured
let supabase: any = null;
let connectivityTested = false;

if (isSupabaseConfigured()) {
  try {
    console.log('✅ Creating Supabase client...');
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'x-client-info': 'skillpilot-web'
        }
      },
      // Add realtime configuration to prevent connection issues
      realtime: {
        params: {
          eventsPerSecond: 2
        }
      }
    });
    console.log('✅ Supabase client created successfully');
    
    // Test connectivity in background
    testSupabaseConnectivity().then(isConnected => {
      connectivityTested = true;
      if (!isConnected) {
        console.error('❌ Supabase server is not reachable. Please check:');
        console.error('1. Your internet connection');
        console.error('2. Supabase project status at https://supabase.com/dashboard');
        console.error('3. Environment variables in .env file');
        console.error('4. Restart your development server after changing .env');
      }
    });
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
  }
} else {
  console.warn('⚠️ Supabase not configured - running in demo mode');
  console.warn('Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly');
}

export { supabase };

// Helper function to create timeout promise
const createTimeoutPromise = (ms: number, operation: string) => {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
  );
};

// Auth helpers with better error handling and more reasonable timeouts
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    if (!supabase) {
      console.error('❌ Auth Error: Supabase not configured');
      throw new Error('Authentication service not available. Please check your Supabase configuration.');
    }
    
    try {
      console.log('🔐 Attempting sign up for:', email);
      
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      const timeoutPromise = createTimeoutPromise(10000, 'Sign up');
      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Sign up error:', error);
      } else {
        console.log('✅ Sign up successful');
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Sign up error:', err);
      
      let errorMessage = 'Network error during sign up. Please try again.';
      if (err.message.includes('timed out')) {
        errorMessage = 'Sign up is taking longer than expected. Please check your internet connection and try again.';
      }
      
      return { 
        data: null, 
        error: { message: errorMessage }
      };
    }
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      console.error('❌ Auth Error: Supabase not configured');
      throw new Error('Authentication service not available. Please check your Supabase configuration.');
    }
    
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password
      });

      const timeoutPromise = createTimeoutPromise(8000, 'Sign in');
      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Sign in error:', error);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Sign in error:', err);
      
      let errorMessage = 'Network error during sign in. Please try again.';
      if (err.message.includes('timed out')) {
        errorMessage = 'Sign in is taking longer than expected. Please check your internet connection and try again.';
      }
      
      return { 
        data: null, 
        error: { message: errorMessage }
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
      
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = createTimeoutPromise(3000, 'Sign out');
      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Sign out successful');
      }
      
      return { error };
    } catch (err: any) {
      console.error('❌ Sign out error:', err);
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

      const timeoutPromise = createTimeoutPromise(8000, 'Password reset');
      const { data, error } = await Promise.race([resetPromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Password reset error:', err);
      
      let errorMessage = 'Network error during password reset';
      if (err.message.includes('timed out')) {
        errorMessage = 'Password reset is taking longer than expected. Please try again.';
      }
      
      return { 
        data: null, 
        error: { message: errorMessage }
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
      const timeoutPromise = createTimeoutPromise(3000, 'Get user');
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
      const timeoutPromise = createTimeoutPromise(2000, 'Get session');
      const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
      
      console.log('🔑 Session result:', result.data.session ? 'Found session' : 'No session');
      return result;
    } catch (err: any) {
      console.error('❌ Get session error:', err);
      
      // Don't treat session timeout as a critical error
      if (err.message.includes('timed out')) {
        console.log('⏰ Session check timed out - continuing without session');
        return { data: { session: null }, error: null };
      }
      
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

      const timeoutPromise = createTimeoutPromise(8000, 'Get user');
      const { data, error } = await Promise.race([userPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Get user error:', error);
      } else {
        console.log('✅ User profile loaded');
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get user error:', err);
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

      const timeoutPromise = createTimeoutPromise(4000, 'Update user');
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

      const timeoutPromise = createTimeoutPromise(4000, 'Save quiz result');
      const { data, error } = await Promise.race([savePromise, timeoutPromise]) as any;
      
      // Also update user's career path
      if (!error && data) {
        await db.updateUser(userId, { career_path: result.careerPath });
      }
      
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

      const timeoutPromise = createTimeoutPromise(4000, 'Get quiz results');
      const { data, error } = await Promise.race([getPromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get quiz results error:', err);
      return { data: [], error: { message: 'Network error fetching quiz results' } };
    }
  },

  // Roadmap Stages
  getRoadmapStages: async (userId: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Getting roadmap stages for:', userId);
      
      const getPromise = supabase
        .from('roadmap_stages')
        .select(`
          *,
          lessons(*),
          projects(*)
        `)
        .eq('user_id', userId)
        .order('order_index', { ascending: true });

      const timeoutPromise = createTimeoutPromise(8000, 'Get roadmap stages');
      const { data, error } = await Promise.race([getPromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get roadmap stages error:', err);
      return { data: [], error: { message: 'Network error fetching roadmap stages' } };
    }
  },

  createRoadmapStages: async (userId: string, careerPath: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Creating roadmap stages for:', userId, careerPath);
      
      // Define stages based on career path
      const stageTemplates = {
        'Frontend Developer': [
          {
            title: 'Foundations',
            description: 'Master the basics of web development',
            estimated_weeks: 4,
            unlocked: true,
            xp_required: 0,
            order_index: 1
          },
          {
            title: 'Frontend Frameworks',
            description: 'Learn modern frontend development with React',
            estimated_weeks: 6,
            unlocked: false,
            xp_required: 500,
            order_index: 2
          },
          {
            title: 'Advanced Concepts',
            description: 'Master advanced frontend patterns and tools',
            estimated_weeks: 8,
            unlocked: false,
            xp_required: 1000,
            order_index: 3
          }
        ],
        'Backend Developer': [
          {
            title: 'Programming Fundamentals',
            description: 'Learn core programming concepts',
            estimated_weeks: 4,
            unlocked: true,
            xp_required: 0,
            order_index: 1
          },
          {
            title: 'Server Development',
            description: 'Build APIs and server-side applications',
            estimated_weeks: 6,
            unlocked: false,
            xp_required: 500,
            order_index: 2
          },
          {
            title: 'Database & Deployment',
            description: 'Master databases and cloud deployment',
            estimated_weeks: 8,
            unlocked: false,
            xp_required: 1000,
            order_index: 3
          }
        ],
        'Data Scientist': [
          {
            title: 'Python & Statistics',
            description: 'Learn Python programming and statistics',
            estimated_weeks: 6,
            unlocked: true,
            xp_required: 0,
            order_index: 1
          },
          {
            title: 'Data Analysis',
            description: 'Master data manipulation and visualization',
            estimated_weeks: 8,
            unlocked: false,
            xp_required: 600,
            order_index: 2
          },
          {
            title: 'Machine Learning',
            description: 'Build and deploy ML models',
            estimated_weeks: 10,
            unlocked: false,
            xp_required: 1200,
            order_index: 3
          }
        ]
      };

      const stages = stageTemplates[careerPath as keyof typeof stageTemplates] || stageTemplates['Frontend Developer'];
      
      const stagesToInsert = stages.map(stage => ({
        ...stage,
        user_id: userId
      }));

      const insertPromise = supabase
        .from('roadmap_stages')
        .insert(stagesToInsert)
        .select();

      const timeoutPromise = createTimeoutPromise(4000, 'Create roadmap stages');
      const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Create roadmap stages error:', err);
      return { data: null, error: { message: 'Network error creating roadmap stages' } };
    }
  },

  deleteUserRoadmap: async (userId: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      console.log('📊 Deleting roadmap stages for:', userId);
      
      const deletePromise = supabase
        .from('roadmap_stages')
        .delete()
        .eq('user_id', userId);

      const timeoutPromise = createTimeoutPromise(4000, 'Delete roadmap stages');
      const { data, error } = await Promise.race([deletePromise, timeoutPromise]) as any;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Delete roadmap stages error:', err);
      return { data: null, error: { message: 'Network error deleting roadmap stages' } };
    }
  },

  updateStageProgress: async (stageId: string, completed: boolean) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('roadmap_stages')
        .update({ completed })
        .eq('id', stageId)
        .select()
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Update stage progress error:', err);
      return { data: null, error: { message: 'Network error updating stage progress' } };
    }
  },

  // Lessons
  updateLessonProgress: async (lessonId: string, completed: boolean, xpEarned?: number) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update({ completed })
        .eq('id', lessonId)
        .select()
        .single();
      
      // Update user XP if lesson completed
      if (!error && completed && xpEarned) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.rpc('increment_user_xp', {
            user_id: userData.user.id,
            xp_amount: xpEarned
          });
        }
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Update lesson progress error:', err);
      return { data: null, error: { message: 'Network error updating lesson progress' } };
    }
  },

  // Projects
  updateProjectProgress: async (projectId: string, completed: boolean, approved?: boolean) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      const updates: any = { completed };
      if (approved !== undefined) updates.approved = approved;
      
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Update project progress error:', err);
      return { data: null, error: { message: 'Network error updating project progress' } };
    }
  },

  // Forum Posts
  getForumPosts: async (careerTrack?: string, limit = 20) => {
    if (!supabase) {
      return { data: [], error: { message: 'Database not available' } };
    }
    
    try {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          users!forum_posts_user_id_fkey(name, avatar_url, career_path)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (careerTrack && careerTrack !== 'all') {
        query = query.eq('career_track', careerTrack);
      }

      const { data, error } = await query;
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get forum posts error:', err);
      return { data: [], error: { message: 'Network error fetching forum posts' } };
    }
  },

  createForumPost: async (userId: string, post: any) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: userId,
          title: post.title,
          content: post.content,
          career_track: post.careerTrack,
          tags: post.tags || []
        })
        .select()
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Create forum post error:', err);
      return { data: null, error: { message: 'Network error creating forum post' } };
    }
  },

  likeForumPost: async (postId: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase.rpc('increment_post_likes', {
        post_id: postId
      });
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Like forum post error:', err);
      return { data: null, error: { message: 'Network error liking post' } };
    }
  },

  // Achievements
  getUserAchievements: async (userId: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get user achievements error:', err);
      return { data: [], error: { message: 'Network error fetching achievements' } };
    }
  },

  unlockAchievement: async (userId: string, achievementData: any) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          name: achievementData.name,
          description: achievementData.description,
          icon: achievementData.icon,
          earned: true,
          earned_at: new Date().toISOString(),
          xp_reward: achievementData.xpReward,
          category: achievementData.category,
          rarity: achievementData.rarity
        })
        .select()
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Unlock achievement error:', err);
      return { data: null, error: { message: 'Network error unlocking achievement' } };
    }
  },

  // Live Events
  getLiveEvents: async (limit = 20) => {
    if (!supabase) {
      return { data: [], error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('live_events')
        .select('*')
        .gte('end_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(limit);
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get live events error:', err);
      return { data: [], error: { message: 'Network error fetching live events' } };
    }
  },

  // Certificates
  getUserCertificates: async (userId: string) => {
    if (!supabase) {
      return { data: [], error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Get user certificates error:', err);
      return { data: [], error: { message: 'Network error fetching certificates' } };
    }
  },

  issueCertificate: async (userId: string, certificateData: any) => {
    if (!supabase) {
      return { data: null, error: { message: 'Database not available' } };
    }
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          name: certificateData.name,
          career_track: certificateData.careerTrack,
          project_url: certificateData.projectUrl,
          unique_id: certificateData.uniqueId,
          verified: true,
          skills: certificateData.skills || [],
          grade: certificateData.grade
        })
        .select()
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Issue certificate error:', err);
      return { data: null, error: { message: 'Network error issuing certificate' } };
    }
  }
};