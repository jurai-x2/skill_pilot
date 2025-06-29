/*
  # Initial SkillPilot Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `avatar_url` (text, optional)
      - `career_path` (text, optional)
      - `level` (integer, default 1)
      - `xp` (integer, default 0)
      - `total_xp` (integer, default 0)
      - `streak` (integer, default 0)
      - `completed_lessons` (integer, default 0)
      - `joined_at` (timestamptz, default now())
      - `country` (text, optional)
      - `language` (text, default 'en')
      - `learning_style` (text, optional)
      - `time_commitment` (text, optional)
      - `github_url` (text, optional)
      - `portfolio_url` (text, optional)
      - `personality_type` (text, optional)
      - `study_hours` (integer, default 0)
      - `weekly_goal` (integer, default 10)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `career_path` (text)
      - `confidence` (integer)
      - `description` (text)
      - `skills` (text array)
      - `next_steps` (text array)
      - `personality_type` (text)
      - `learning_style` (text)
      - `alternative_paths` (text array)
      - `riasec_profile` (text)
      - `big_five_traits` (jsonb)
      - `quiz_answers` (jsonb)
      - `created_at` (timestamptz, default now())

    - `certificates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text)
      - `career_track` (text)
      - `issued_at` (timestamptz, default now())
      - `project_url` (text, optional)
      - `unique_id` (text, unique)
      - `verified` (boolean, default false)
      - `skills` (text array)
      - `grade` (text, optional)
      - `created_at` (timestamptz, default now())

    - `roadmap_stages`
      - `id` (uuid, primary key)
      - `career_path` (text)
      - `title` (text)
      - `description` (text)
      - `stage_order` (integer)
      - `estimated_weeks` (integer)
      - `xp_required` (integer)
      - `created_at` (timestamptz, default now())

    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `stage_id` (uuid, references roadmap_stages)
      - `completed` (boolean, default false)
      - `started_at` (timestamptz, optional)
      - `completed_at` (timestamptz, optional)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  career_path text NOT NULL,
  confidence integer NOT NULL,
  description text NOT NULL,
  skills text[] NOT NULL,
  next_steps text[] NOT NULL,
  personality_type text NOT NULL,
  learning_style text NOT NULL,
  alternative_paths text[] NOT NULL,
  riasec_profile text NOT NULL,
  big_five_traits jsonb NOT NULL,
  quiz_answers jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  career_track text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  project_url text,
  unique_id text UNIQUE NOT NULL,
  verified boolean DEFAULT false,
  skills text[] NOT NULL,
  grade text,
  created_at timestamptz DEFAULT now()
);

-- Create roadmap_stages table
CREATE TABLE IF NOT EXISTS roadmap_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_path text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  stage_order integer NOT NULL,
  estimated_weeks integer NOT NULL,
  xp_required integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stage_id uuid REFERENCES roadmap_stages(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, stage_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for quiz_results table
CREATE POLICY "Users can read own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz results"
  ON quiz_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for certificates table
CREATE POLICY "Users can read own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for roadmap_stages table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read roadmap stages"
  ON roadmap_stages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_progress table
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample roadmap stages for Frontend Developer
INSERT INTO roadmap_stages (career_path, title, description, stage_order, estimated_weeks, xp_required) VALUES
('Frontend Developer', 'Foundations', 'Master the basics of web development', 1, 4, 0),
('Frontend Developer', 'Frontend Frameworks', 'Learn modern frontend development with React', 2, 6, 500),
('Frontend Developer', 'Advanced Concepts', 'Master advanced frontend patterns and tools', 3, 8, 1000);

-- Insert sample roadmap stages for Backend Developer
INSERT INTO roadmap_stages (career_path, title, description, stage_order, estimated_weeks, xp_required) VALUES
('Backend Developer', 'Programming Fundamentals', 'Learn core programming concepts', 1, 4, 0),
('Backend Developer', 'Server Development', 'Build APIs and server-side applications', 2, 6, 500),
('Backend Developer', 'Database & Deployment', 'Master databases and cloud deployment', 3, 8, 1000);

-- Insert sample roadmap stages for Data Scientist
INSERT INTO roadmap_stages (career_path, title, description, stage_order, estimated_weeks, xp_required) VALUES
('Data Scientist', 'Python & Statistics', 'Learn Python programming and statistical analysis', 1, 6, 0),
('Data Scientist', 'Machine Learning', 'Master machine learning algorithms and techniques', 2, 8, 600),
('Data Scientist', 'Advanced Analytics', 'Deep learning and advanced data science projects', 3, 10, 1200);

-- Insert sample roadmap stages for UX/UI Designer
INSERT INTO roadmap_stages (career_path, title, description, stage_order, estimated_weeks, xp_required) VALUES
('UX/UI Designer', 'Design Fundamentals', 'Learn design principles and user psychology', 1, 4, 0),
('UX/UI Designer', 'Design Tools', 'Master Figma, Sketch, and prototyping tools', 2, 5, 400),
('UX/UI Designer', 'Advanced UX', 'User research, testing, and design systems', 3, 7, 800);