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
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If user doesn't exist, create a basic profile
        if (error.code === 'PGRST116') {
          console.log('User profile not found, will be created by trigger');
          // Set a basic user object while waiting for the trigger to create the profile
          const session = await supabase.auth.getSession();
          if (session.data.session?.user) {
            const basicUser: User = {
              id: userId,
              name: session.data.session.user.email?.split('@')[0] || 'User',
              email: session.data.session.user.email || '',
              level: 1,
              xp: 0,
              totalXp: 0,
              streak: 0,
              completedLessons: 0,
              certificates: [],
              joinedAt: new Date(),
              language: 'en'
            };
            setUser(basicUser);
          }
        }
        setLoading(false);
        return;
      }

      if (data) {
        console.log('User profile found:', data);
        
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
          weeklyGoal: data.weekly_goal,
          squad: data.squad,
          followers: data.followers,
          following: data.following
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
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            language: userData.language || 'en'
          }
        }
      });

      if (error) {
        setLoading(false);
        return { error: error.message };
      }

      if (data.user && !data.session) {
        setLoading(false);
        return { error: 'Please check your email to confirm your account.' };
      }

      // The user profile will be created by the database trigger
      // and fetchUserProfile will be called by the auth state change listener
      
      return {};
    } catch (error) {
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error: error.message };
      }

      // fetchUserProfile will be called by the auth state change listener
      return {};
    } catch (error) {
      setLoading(false);
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