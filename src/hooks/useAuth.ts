import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({ ...prev, session }));
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState(prev => ({ ...prev, session }));
      
      if (session?.user) {
        if (event === 'SIGNED_IN') {
          await fetchUserProfile(session.user.id);
        }
      } else {
        setAuthState({ user: null, session: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select(`
          *,
          certificates (*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      if (userProfile) {
        const user: User = {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          avatar: userProfile.avatar_url,
          careerPath: userProfile.career_path,
          level: userProfile.level,
          xp: userProfile.xp,
          totalXp: userProfile.total_xp,
          streak: userProfile.streak,
          completedLessons: userProfile.completed_lessons,
          certificates: userProfile.certificates.map((cert: any) => ({
            id: cert.id,
            name: cert.name,
            careerTrack: cert.career_track,
            issuedAt: new Date(cert.issued_at),
            projectUrl: cert.project_url,
            uniqueId: cert.unique_id,
            verified: cert.verified,
            skills: cert.skills,
            grade: cert.grade,
          })),
          joinedAt: new Date(userProfile.joined_at),
          country: userProfile.country,
          language: userProfile.language,
          learningStyle: userProfile.learning_style,
          timeCommitment: userProfile.time_commitment,
          githubUrl: userProfile.github_url,
          portfolioUrl: userProfile.portfolio_url,
          personalityType: userProfile.personality_type,
          studyHours: userProfile.study_hours,
          weeklyGoal: userProfile.weekly_goal,
          squad: userProfile.squad,
          followers: userProfile.followers,
          following: userProfile.following,
        };

        setAuthState({ user, session: authState.session, loading: false });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name,
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
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          throw profileError;
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          career_path: updates.careerPath,
          country: updates.country,
          language: updates.language,
          learning_style: updates.learningStyle,
          time_commitment: updates.timeCommitment,
          github_url: updates.githubUrl,
          portfolio_url: updates.portfolioUrl,
          personality_type: updates.personalityType,
          weekly_goal: updates.weeklyGoal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authState.user.id);

      if (error) throw error;

      // Refresh user profile
      await fetchUserProfile(authState.user.id);
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const updateXP = async (xpGained: number) => {
    if (!authState.user) return { error: 'No user logged in' };

    try {
      const newXP = authState.user.xp + xpGained;
      const newTotalXP = authState.user.totalXp + xpGained;
      const newLevel = Math.floor(newTotalXP / 100) + 1;

      const { error } = await supabase
        .from('users')
        .update({
          xp: newXP,
          total_xp: newTotalXP,
          level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authState.user.id);

      if (error) throw error;

      // Refresh user profile
      await fetchUserProfile(authState.user.id);
      return { error: null };
    } catch (error) {
      console.error('Error updating XP:', error);
      return { error };
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateXP,
  };
};