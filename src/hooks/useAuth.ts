import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, auth, db, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isConfigured: isSupabaseConfigured()
  });

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      if (!isSupabaseConfigured()) {
        setAuthState(prev => ({
          ...prev,
          user: null,
          session: null,
          loading: false
        }));
        return;
      }

      const { data: profile, error } = await db
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
        return;
      }

      const user: User = profile || {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || '',
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
        // Dev mode fallback: skip auth if running in Bolt or localhost
        if (import.meta.env.MODE === 'development') {
          console.warn('Running in development mode — skipping Supabase auth.');
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            isConfigured: false,
          });
          return;
        }

        if (!isSupabaseConfigured()) {
          console.warn('Supabase not configured. Running in demo mode.');
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            isConfigured: false,
          });
          return;
        }

        // Add session fetch timeout
        const sessionPromise = auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session check timeout')), 8000)
        );

        const sessionResult = await Promise.race([sessionPromise, timeoutPromise]) as any;

        if (!mounted) return;

        const { data: { session }, error } = sessionResult;

        if (error) {
          console.error('Session error:', error);
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (error.message === 'Session check timeout') {
          console.warn('Timeout. Running in demo mode.');
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            isConfigured: false,
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            error: error.message || 'Unknown auth error',
            loading: false,
          }));
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

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
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user);
      }

      return { data, error: null };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await db
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        await loadUserProfile(data.user);
      }

      return { data, error: null };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      return { data: null, error };
    }
  };

  const signOut = async () => {
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

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
};