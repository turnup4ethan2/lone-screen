-- Add comment_likes table to track user likes on comments
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id) -- One like per user per comment
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);

-- Enable RLS on comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Comment likes: Public can read, authenticated users can create/delete their own
CREATE POLICY "Comment likes are viewable by everyone" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like comments" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

