-- Add merch_links field to films table
ALTER TABLE public.films
ADD COLUMN IF NOT EXISTS merch_links JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the field
COMMENT ON COLUMN public.films.merch_links IS 'Array of merch links for this film. Format: [{"title": "T-Shirt", "url": "https://...", "price": "$25"}, ...]';

-- Comments table for forum discussions
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  premiere_id UUID REFERENCES public.premieres(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For nested replies
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_premiere_id ON public.comments(premiere_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments: Public can read, authenticated users can create/update/delete their own
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id); -- Soft delete by setting deleted_at

-- Trigger for updated_at timestamp
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

