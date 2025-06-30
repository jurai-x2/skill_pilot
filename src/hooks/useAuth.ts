import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, auth, db, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('👤 Loading user profile for:', supabaseUser.email);
      
      if (!isSupabaseConfigured() || !supabase) {
        console.log('⚠️ Supabase not configured, creating mock user');
        // Create a mock user for demo purposes
        const mockUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || 'Demo User',
          email: supabaseUser.email || 'demo@example.com',
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          careerPath: null,
          level: 1,
          xp: 0,
          total_xp: 0,
          streak: 0,
          completed_lessons: 0,
          certificates: [],
          joined_at: new Date().toISOString(),
          country: null,
          language: 'en',
          learning_style: null,
          time_commitment: null,
          github_url: null,
          portfolio_url: null,
          personality_type: null,
          study_hours: 0,
          weekly_goal: 10,
          squad: null,
          followers: 0,
          following: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setAuthState(prev => ({
          ...prev,
          user: mockUser,
          session: { user: supabaseUser } as Session,
          loading: false,
          error: null
        }));
        return;
      }

      // Set loading to false immediately for better UX, then load profile in background
      setAuthState(prev => ({
        ...prev,
        session: { user: supabaseUser } as Session,
        loading: false,
        error: null
      }));

      // Load profile with timeout to prevent hanging
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 3000)
      );

      try {
        const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

        if (error && error.code !== 'PGRST116') {
          console.error('❌ Profile fetch error:', error);
          // Don't throw error, create a basic user instead
        }

        // If no profile exists or error occurred, create a basic user
        if (!profile || error) {
          console.log('📝 Creating basic user profile...');
          const basicUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || 'User',
            email: supabaseUser.email || '',
            avatar_url: supabaseUser.user_metadata?.avatar_url || null,
            careerPath: null,
            level: 1,
            xp: 0,
            total_xp: 0,
            streak: 0,
            completed_lessons: 0,
            certificates: [],
            joined_at: new Date().toISOString(),
            country: null,
            language: 'en',
            learning_style: null,
            time_commitment: null,
            github_url: null,
            portfolio_url: null,
            personality_type: null,
            study_hours: 0,
            weekly_goal: 10,
            squad: null,
            followers: 0,
            following: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          setAuthState(prev => ({
            ...prev,
            user: basicUser
          }));

          // Try to create profile in background (non-blocking)
          supabase
            .from('users')
            .insert({
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              name: basicUser.name,
              avatar_url: basicUser.avatar_url,
              language: 'en',
              level: 1,
              xp: 0,
              total_xp: 0,
              streak: 0,
              completed_lessons: 0,
              study_hours: 0,
              weekly_goal: 10,
              followers: 0,
              following: 0,
              joined_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .then(({ error: createError }) => {
              if (createError) {
                console.log('⚠️ Background profile creation failed:', createError.message);
              } else {
                console.log('✅ Background profile creation successful');
              }
            });

          return;
        }

        const user: User = {
          ...profile,
          certificates: []
        };

        console.log('✅ User profile loaded successfully');
        setAuthState(prev => ({
          ...prev,
          user
        }));
      } catch (timeoutError) {
        console.log('⏰ Profile load timeout, using basic user');
        // Create basic user on timeout
        const basicUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || 'User',
          email: supabaseUser.email || '',
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          careerPath: null,
          level: 1,
          xp: 0,
          total_xp: 0,
          streak: 0,
          completed_lessons: 0,
          certificates: [],
          joined_at: new Date().toISOString(),
          country: null,
          language: 'en',
          learning_style: null,
          time_commitment: null,
          github_url: null,
          portfolio_url: null,
          personality_type: null,
          study_hours: 0,
          weekly_goal: 10,
          squad: null,
          followers: 0,
          following: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setAuthState(prev => ({
          ...prev,
          user: basicUser
        }));
      }
    } catch (error: any) {
      console.error('❌ Load profile error:', error);
      // Don't set error state, just use basic user
      const basicUser: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || 'User',
        email: supabaseUser.email || '',
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        careerPath: null,
        level: 1,
        xp: 0,
        total_xp: 0,
        streak: 0,
        completed_lessons: 0,
        certificates: [],
        joined_at: new Date().toISOString(),
        country: null,
        language: 'en',
        learning_style: null,
        time_commitment: null,
        github_url: null,
        portfolio_url: null,
        personality_type: null,
        study_hours: 0,
        weekly_goal: 10,
        squad: null,
        followers: 0,
        following: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setAuthState(prev => ({
        ...prev,
        user: basicUser,
        loading: false
      }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing authentication...');
        
        // Shorter timeout for better UX
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Auth initialization timeout - setting loading to false');
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        }, 2000); // Reduced from 5000ms to 2000ms

        if (!isSupabaseConfigured()) {
          console.log('⚠️ Supabase not configured - running in demo mode');
          clearTimeout(timeoutId);
          if (mounted) {
            setAuthState(prev => ({ ...prev, loading: false, error: null }));
          }
          return;
        }

        console.log('🔑 Getting current session...');
        
        // Add timeout to session check
        const sessionPromise = auth.getSession();
        const sessionTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 2000)
        );

        const { data: { session }, error } = await Promise.race([sessionPromise, sessionTimeoutPromise]) as any;

        clearTimeout(timeoutId);
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Session error:', error);
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email);
          await loadUserProfile(session.user);
        } else {
          console.log('ℹ️ No existing session found');
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error: any) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            loading: false,
          }));
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    let subscription: any = null;
    
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');

          if (event === 'SIGNED_IN' && session?.user) {
            await loadUserProfile(session.user);
          } else if (event === 'SIGNED_OUT') {
            setAuthState(prev => ({
              ...prev,
              user: null,
              session: null,
              loading: false,
              error: null
            }));
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            // Don't reload profile on token refresh to avoid unnecessary delays
            setAuthState(prev => ({
              ...prev,
              session: session as Session
            }));
          }
        });
        
        subscription = authSubscription;
      } catch (error: any) {
        console.error('❌ Auth state change listener error:', error);
      }
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Authentication service not available');
    }

    console.log('🔐 Attempting to sign in:', email);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Add timeout to sign in
      const signInPromise = auth.signIn(email, password);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in timeout')), 10000)
      );

      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;

      if (error) throw error;

      // Don't wait for profile loading, let it happen in background
      if (data.user) {
        // Set user immediately for better UX
        setAuthState(prev => ({
          ...prev,
          session: data.session,
          loading: false
        }));
        
        // Load profile in background
        loadUserProfile(data.user);
      }

      return { success: true, data, error: null };
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      return { success: false, data: null, error };
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Authentication service not available');
    }

    console.log('📝 Attempting to sign up:', email);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Add timeout to sign up
      const signUpPromise = auth.signUp(email, password, userData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign up timeout')), 10000)
      );

      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any;

      if (error) throw error;

      // For signup, we don't automatically load profile since email verification might be required
      setAuthState(prev => ({ ...prev, loading: false }));

      return { success: true, data, error: null };
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      return { success: false, data: null, error };
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    
    // Immediately update UI
    setAuthState(prev => ({
      ...prev,
      user: null,
      session: null,
      loading: false,
      error: null
    }));
    
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
        // Don't revert state on sign out error
      }
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      // Don't revert state on sign out error
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) {
      throw new Error('User not authenticated');
    }

    if (!isSupabaseConfigured()) {
      // For demo mode, just update local state
      setAuthState(prev => ({
        ...prev,
        user: { ...prev.user!, ...updates }
      }));
      return { success: true, data: { ...authState.user, ...updates }, error: null };
    }

    try {
      const { data, error } = await db.updateUser(authState.user.id, updates);
      
      if (error) throw error;

      if (data) {
        setAuthState(prev => ({
          ...prev,
          user: { ...prev.user!, ...data }
        }));
      }

      return { success: true, data, error: null };
    } catch (error: any) {
      return { success: false, data: null, error };
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isConfigured: isSupabaseConfigured()
  };
};