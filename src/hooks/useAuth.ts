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
