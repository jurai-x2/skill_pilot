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
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          console.warn('Supabase not configured. Running in demo mode.');
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              error: null,
              isConfigured: false
            });
          }
          return;
        }

        // Get initial session with increased timeout
        const sessionPromise = auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (!mounted) return;

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
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          // Handle timeout specifically - fall back to demo mode
          if (error instanceof Error && error.message === 'Session check timeout') {
            console.warn('Session check timeout - falling back to demo mode');
            setAuthState({
              user: null,
              session: null,
              loading: false,
              error: null,
              isConfigured: false
            });
          } else {
            setAuthState(prev => ({ 
              ...prev, 
              error: error instanceof Error ? error.message : 'Authentication failed', 
              loading: false 
            }));
          }
        }
      }
    };

    initializeAuth();

    // Listen for auth changes only if Supabase is configured
    let subscription: any = null;
    if (isSupabaseConfigured()) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;
          
          try {
            if (event === 'SIGNED_IN' && session?.user) {
              await loadUserProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
              setAuthState({
                user: null,
                session: null,
                loading: false,
                error: null,
                isConfigured: authState.isConfigured
              });
            }
          } catch (error) {
            console.error('Auth state change error:', error);
            if (mounted) {
              setAuthState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Auth state change failed',
                loading: false
              }));
            }
          }
        }
      );
      subscription = authSubscription;
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: userProfile, error } = await db.getUser(supabaseUser.id);
      
      if (error) {
        console.error('Error loading user profile:', error);
        // If user profile doesn't exist, create a mock user for now
        const mockUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          level: 1,
          xp: 0,
          totalXp: 0,
          streak: 0,
          completedLessons: 0,
          certificates: [],
          joinedAt: new Date(),
          language: 'en',
          studyHours: 0,
          weeklyGoal: 10,
          followers: 0,
          following: 0
        };

        setAuthState({
          user: mockUser,
          session: { user: supabaseUser } as Session,
          loading: false,
          error: null,
          isConfigured: authState.isConfigured
        });
        return;
      }

      if (userProfile) {
        // Convert database user to app User type
        const user: User = {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          avatar: userProfile.avatar_url || undefined,
          careerPath: userProfile.career_path || undefined,
          level: userProfile.level,
          xp: userProfile.xp,
          totalXp: userProfile.total_xp,
          streak: userProfile.streak,
          completedLessons: userProfile.completed_lessons,
          certificates: [], // Will be loaded separately
          joinedAt: new Date(userProfile.joined_at),
          country: userProfile.country || undefined,
          language: userProfile.language,
          learningStyle: userProfile.learning_style || undefined,
          timeCommitment: userProfile.time_commitment || undefined,
          githubUrl: userProfile.github_url || undefined,
          portfolioUrl: userProfile.portfolio_url || undefined,
          personalityType: userProfile.personality_type || undefined,
          studyHours: userProfile.study_hours,
          weeklyGoal: userProfile.weekly_goal,
          squad: userProfile.squad || undefined,
          followers: userProfile.followers,
          following: userProfile.following
        };

        setAuthState({
          user,
          session: { user: supabaseUser } as Session,
          loading: false,
          error: null,
          isConfigured: authState.isConfigured
        });
      } else {
        // User profile doesn't exist, create a mock user
        const mockUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          level: 1,
          xp: 0,
          totalXp: 0,
          streak: 0,
          completedLessons: 0,
          certificates: [],
          joinedAt: new Date(),
          language: 'en',
          studyHours: 0,
          weeklyGoal: 10,
          followers: 0,
          following: 0
        };

        setAuthState({
          user: mockUser,
          session: { user: supabaseUser } as Session,
          loading: false,
          error: null,
          isConfigured: authState.isConfigured
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load user profile', 
        loading: false 
      }));
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await auth.signUp(email, password, userData);
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await auth.signOut();
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return { success: false, error: 'No user logged in' };

    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      // Convert User updates to database format
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
      if (updates.careerPath) dbUpdates.career_path = updates.careerPath;
      if (updates.country) dbUpdates.country = updates.country;
      if (updates.language) dbUpdates.language = updates.language;
      if (updates.learningStyle) dbUpdates.learning_style = updates.learningStyle;
      if (updates.timeCommitment) dbUpdates.time_commitment = updates.timeCommitment;
      if (updates.githubUrl) dbUpdates.github_url = updates.githubUrl;
      if (updates.portfolioUrl) dbUpdates.portfolio_url = updates.portfolioUrl;
      if (updates.personalityType) dbUpdates.personality_type = updates.personalityType;
      if (updates.weeklyGoal !== undefined) dbUpdates.weekly_goal = updates.weeklyGoal;

      const { data, error } = await db.updateUser(authState.user.id, dbUpdates);

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }

      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
        loading: false
      }));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isConfigured: authState.isConfigured
  };
};