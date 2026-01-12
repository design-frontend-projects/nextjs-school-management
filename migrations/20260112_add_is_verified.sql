-- Add is_verified verification status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Optional: Update existing users to verified if needed
-- UPDATE public.profiles SET is_verified = TRUE;
