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
      console.log('Loading user profile for:', supabaseUser.email);
      
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        throw error;
      }

      // If no profile exists, create one
      if (!profile) {
        console.log('Creating new user profile...');
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || 'User',
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          career_path: null,
          level: 1,
          xp: 0,
          total_xp: 0,
          streak: 0,
          completed_lessons: 0,
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

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Profile creation error:', createError);
          throw createError;
        }

        const user: User = {
          ...createdProfile,
          certificates: []
        };

        console.log('User profile created successfully');
        setAuthState(prev => ({
          ...prev,
          user,
          session: { user: supabaseUser } as Session,
          loading: false,
          error: null
        }));
        return;
      }

      const user: User = {
        ...profile,
        certificates: []
      };

      console.log('User profile loaded successfully');
      setAuthState(prev => ({
        ...prev,
        user,
        session: { user: supabaseUser } as Session,
        loading: false,
        error: null
      }));
    } catch (error: any) {
      console.error('Load profile error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Failed to load user profile',
        loading: false
      }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        
        if (!isSupabaseConfigured()) {
          throw new Error('Supabase not configured. Please set up your environment variables.');
        }

        console.log('Getting current session...');
        const { data: { session }, error } = await auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Session error:', error);
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }

        if (session?.user) {
          console.log('Found existing session for:', session.user.email);
          await loadUserProfile(session.user);
        } else {
          console.log('No existing session found');
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            error: error.message || 'Authentication initialization failed',
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

          console.log('Auth state change:', event, session?.user?.email);

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
            // Refresh user profile on token refresh
            await loadUserProfile(session.user);
          }
        });
        
        subscription = authSubscription;
      } catch (error: any) {
        console.error('Auth state change listener error:', error);
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
      throw new Error('Supabase not configured');
    }

    console.log('Attempting to sign in:', email);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await auth.signIn(email, password);

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user);
      }

      return { success: true, data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
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
      throw new Error('Supabase not configured');
    }

    console.log('Attempting to sign up:', email);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await auth.signUp(email, password, userData);

      if (error) throw error;

      // For signup, we don't automatically load profile since email verification might be required
      setAuthState(prev => ({ ...prev, loading: false }));

      return { success: true, data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      return { success: false, data: null, error };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    
    if (!isSupabaseConfigured()) {
      setAuthState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
        error: null
      }));
      return;
    }

    try {
      const { error } = await auth.signOut();
      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
        error: null
      }));
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user || !isSupabaseConfigured()) {
      throw new Error('User not authenticated or Supabase not configured');
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