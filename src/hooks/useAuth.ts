import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, auth, db } from '../lib/supabase';
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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await auth.getSession();
        
        if (error) {
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setAuthState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error', 
          loading: false 
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: userProfile, error } = await db.getUser(supabaseUser.id);
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
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
          error: null
        });
      }
    } catch (error) {
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
    updateProfile
  };
};