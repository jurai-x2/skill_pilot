import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Fetch certificates
        const { data: certificates } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', userId);

        const userProfile: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar_url,
          careerPath: data.career_path,
          level: data.level,
          xp: data.xp,
          totalXp: data.total_xp,
          streak: data.streak,
          completedLessons: data.completed_lessons,
          certificates: certificates?.map(cert => ({
            id: cert.id,
            name: cert.name,
            careerTrack: cert.career_track,
            issuedAt: new Date(cert.issued_at),
            projectUrl: cert.project_url,
            uniqueId: cert.unique_id,
            verified: cert.verified,
            skills: cert.skills,
            grade: cert.grade
          })) || [],
          joinedAt: new Date(data.joined_at),
          country: data.country,
          language: data.language,
          learningStyle: data.learning_style,
          timeCommitment: data.time_commitment,
          githubUrl: data.github_url,
          portfolioUrl: data.portfolio_url,
          personalityType: data.personality_type,
          studyHours: data.study_hours,
          weeklyGoal: data.weekly_goal
        };

        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Create or update user profile using upsert to handle duplicate keys
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            name: userData.name || '',
            language: userData.language || 'en',
            level: 1,
            xp: 0,
            total_xp: 0,
            streak: 0,
            completed_lessons: 0,
            joined_at: new Date().toISOString(),
            country: userData.country,
            learning_style: userData.learningStyle,
            time_commitment: userData.timeCommitment,
            github_url: userData.githubUrl,
            portfolio_url: userData.portfolioUrl,
            personality_type: userData.personalityType,
            study_hours: userData.studyHours || 0,
            weekly_goal: userData.weeklyGoal || 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          return { error: profileError.message };
        }
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          avatar_url: updates.avatar,
          career_path: updates.careerPath,
          country: updates.country,
          language: updates.language,
          learning_style: updates.learningStyle,
          time_commitment: updates.timeCommitment,
          github_url: updates.githubUrl,
          portfolio_url: updates.portfolioUrl,
          personality_type: updates.personalityType,
          study_hours: updates.studyHours,
          weekly_goal: updates.weeklyGoal,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };
};