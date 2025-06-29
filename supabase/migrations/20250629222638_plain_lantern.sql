/*
  # SkillPilot Database Schema

  1. New Tables
    - `users` - User profiles and progress data
    - `certificates` - User certificates and achievements
    - `quiz_results` - Career quiz results and AI analysis
    - `roadmap_stages` - Learning path stages for each user
    - `lessons` - Individual lessons within stages
    - `projects` - Projects within stages
    - `forum_posts` - Community forum posts
    - `forum_replies` - Replies to forum posts
    - `achievements` - User achievements and badges
    - `live_events` - Live events and workshops

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate

  3. Functions and Triggers
    - Auto-update timestamps
    - User profile creation on auth signup
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  career_path text,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  streak integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  country text,
  language text DEFAULT 'en',
  learning_style text,
  time_commitment text,
  github_url text,
  portfolio_url text,
  personality_type text,
  study_hours integer DEFAULT 0,
  weekly_goal integer DEFAULT 10,
  squad text,
  followers integer DEFAULT 0,
  following integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  career_track text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  project_url text,
  unique_id text UNIQUE NOT NULL,
  verified boolean DEFAULT false,
  skills text[] DEFAULT '{}',
  grade text,
  created_at timestamptz DEFAULT now()
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  career_path text NOT NULL,
  confidence integer NOT NULL,
  description text NOT NULL,
  skills text[] DEFAULT '{}',
  next_steps text[] DEFAULT '{}',
  personality_type text NOT NULL,
  learning_style text NOT NULL,
  alternative_paths text[] DEFAULT '{}',
  riasec_profile text NOT NULL,
  big_five_traits jsonb DEFAULT '{}',
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Roadmap stages table
CREATE TABLE IF NOT EXISTS roadmap_stages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  completed boolean DEFAULT false,
  estimated_weeks integer NOT NULL,
  unlocked boolean DEFAULT false,
  xp_required integer DEFAULT 0,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_id uuid REFERENCES roadmap_stages(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('video', 'article', 'interactive', 'quiz')),
  duration integer NOT NULL,
  completed boolean DEFAULT false,
  xp_reward integer NOT NULL,
  content text,
  video_url text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_id uuid REFERENCES roadmap_stages(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours integer NOT NULL,
  completed boolean DEFAULT false,
  technologies text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  xp_reward integer NOT NULL,
  approved boolean DEFAULT false,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  career_track text NOT NULL,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  solved boolean DEFAULT false,
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes integer DEFAULT 0,
  is_answer boolean DEFAULT false,
  parent_id uuid REFERENCES forum_replies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  earned boolean DEFAULT false,
  earned_at timestamptz,
  xp_reward integer NOT NULL,
  category text NOT NULL CHECK (category IN ('learning', 'project', 'streak', 'social', 'milestone')),
  rarity text NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at timestamptz DEFAULT now()
);

-- Live events table
CREATE TABLE IF NOT EXISTS live_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('hackathon', 'ama', 'workshop', 'career-talk', 'project-showcase')),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  max_participants integer,
  current_participants integer DEFAULT 0,
  host text NOT NULL,
  registration_required boolean DEFAULT true,
  career_tracks text[] DEFAULT '{}',
  meeting_url text,
  recording_url text,
  prizes text[],
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Certificates policies
CREATE POLICY "Users can read own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Quiz results policies
CREATE POLICY "Users can read own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Roadmap stages policies
CREATE POLICY "Users can read own roadmap stages"
  ON roadmap_stages
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own roadmap stages"
  ON roadmap_stages
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own roadmap stages"
  ON roadmap_stages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Lessons policies
CREATE POLICY "Users can read lessons for their stages"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    stage_id IN (
      SELECT id FROM roadmap_stages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update lessons for their stages"
  ON lessons
  FOR UPDATE
  TO authenticated
  USING (
    stage_id IN (
      SELECT id FROM roadmap_stages WHERE user_id = auth.uid()
    )
  );

-- Projects policies
CREATE POLICY "Users can read projects for their stages"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    stage_id IN (
      SELECT id FROM roadmap_stages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update projects for their stages"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    stage_id IN (
      SELECT id FROM roadmap_stages WHERE user_id = auth.uid()
    )
  );

-- Forum posts policies
CREATE POLICY "Anyone can read forum posts"
  ON forum_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own forum posts"
  ON forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own forum posts"
  ON forum_posts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Forum replies policies
CREATE POLICY "Anyone can read forum replies"
  ON forum_replies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own forum replies"
  ON forum_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own forum replies"
  ON forum_replies
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Achievements policies
CREATE POLICY "Users can read own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own achievements"
  ON achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Live events policies
CREATE POLICY "Anyone can read live events"
  ON live_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roadmap_stages_updated_at
  BEFORE UPDATE ON roadmap_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_events_updated_at
  BEFORE UPDATE ON live_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'en'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for automatic user profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_stages_user_id ON roadmap_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_stages_order ON roadmap_stages(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_stage_id ON lessons(stage_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(stage_id, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_stage_id ON projects(stage_id);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(stage_id, order_index);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id ON forum_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_live_events_start_time ON live_events(start_time);
CREATE INDEX IF NOT EXISTS idx_live_events_featured ON live_events(featured, start_time);