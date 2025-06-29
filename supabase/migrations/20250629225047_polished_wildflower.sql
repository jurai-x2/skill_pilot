/*
  # Fix user creation error

  1. Updates
    - Fix handle_new_user function to properly handle user creation
    - Ensure all required fields have proper defaults
    - Fix any constraint issues

  2. Security
    - Maintain existing RLS policies
    - Ensure proper user isolation
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    language,
    level,
    xp,
    total_xp,
    streak,
    completed_lessons,
    study_hours,
    weekly_goal,
    followers,
    following,
    joined_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
    1,
    0,
    0,
    0,
    0,
    0,
    10,
    0,
    0,
    NOW(),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure the users table has proper defaults for all required fields
ALTER TABLE users ALTER COLUMN level SET DEFAULT 1;
ALTER TABLE users ALTER COLUMN xp SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN total_xp SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN streak SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN completed_lessons SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN study_hours SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN weekly_goal SET DEFAULT 10;
ALTER TABLE users ALTER COLUMN followers SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN following SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN language SET DEFAULT 'en';
ALTER TABLE users ALTER COLUMN joined_at SET DEFAULT NOW();
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();

-- Make sure the users table id column properly references auth.users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users ADD CONSTRAINT users_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;