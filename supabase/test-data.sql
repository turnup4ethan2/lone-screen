-- Test Data for Development
-- Run this AFTER running schema.sql and functions.sql

-- Insert a test film
INSERT INTO public.films (
  id,
  title,
  description,
  director,
  cast_members,
  runtime,
  poster_url,
  dacast_video_id,
  dacast_countdown_video_id,
  dacast_qa_video_id
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Film: The Lone Premiere',
  'An independent film about the power of storytelling and community. This is a test premiere for The Lone Screen platform.',
  'Jane Director',
  ARRAY['Actor One', 'Actor Two', 'Actor Three'],
  90,
  'https://via.placeholder.com/400x600?text=Test+Film+Poster',
  'a1266caa-34d1-40f2-99f5-fa5fdc6926fa', -- Use your test video ID
  'a1266caa-34d1-40f2-99f5-fa5fdc6926fa', -- Use your test video ID for countdown too
  'a1266caa-34d1-40f2-99f5-fa5fdc6926fa'  -- Use your test video ID for Q&A too
);

-- Insert a test premiere (scheduled for tomorrow at 8 PM)
INSERT INTO public.premieres (
  id,
  film_id,
  premiere_date,
  ticket_price,
  capacity,
  tickets_sold,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  NOW() + INTERVAL '1 day' + INTERVAL '20 hours', -- Tomorrow at 8 PM
  1000, -- $10.00 in cents
  100,
  0,
  'upcoming'
);

-- You can also create a premiere that's happening soon (for testing lobby)
-- Uncomment the following to create a premiere starting in 1 hour:

/*
INSERT INTO public.premieres (
  id,
  film_id,
  premiere_date,
  ticket_price,
  capacity,
  tickets_sold,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  NOW() + INTERVAL '1 hour',
  1000,
  100,
  0,
  'upcoming'
);
*/

