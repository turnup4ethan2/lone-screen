-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  year_of_birth INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Films table
CREATE TABLE public.films (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  director TEXT,
  cast_members TEXT[], -- Array of cast member names
  runtime INTEGER, -- in minutes
  poster_url TEXT,
  trailer_url TEXT,
  dacast_video_id TEXT, -- Main film video ID
  dacast_qa_video_id TEXT, -- Q&A video ID
  dacast_countdown_video_id TEXT, -- Pre-movie countdown video ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Premieres table
CREATE TABLE public.premieres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  premiere_date TIMESTAMPTZ NOT NULL,
  ticket_price INTEGER NOT NULL, -- in cents
  capacity INTEGER NOT NULL DEFAULT 100,
  tickets_sold INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets table
CREATE TABLE public.tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  premiere_id UUID REFERENCES public.premieres(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id TEXT,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, premiere_id) -- One ticket per user per premiere
);

-- Ratings table
CREATE TABLE public.ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  premiere_id UUID REFERENCES public.premieres(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, premiere_id) -- One rating per user per premiere
);

-- Form submissions table
CREATE TABLE public.form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('contact_us', 'filmmaker_application')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  film_title TEXT, -- for filmmaker applications
  screener_link TEXT, -- for filmmaker applications
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_premieres_film_id ON public.premieres(film_id);
CREATE INDEX idx_premieres_premiere_date ON public.premieres(premiere_date);
CREATE INDEX idx_premieres_status ON public.premieres(status);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_premiere_id ON public.tickets(premiere_id);
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX idx_ratings_film_id ON public.ratings(film_id);
CREATE INDEX idx_ratings_premiere_id ON public.ratings(premiere_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premieres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Films: Public read access
CREATE POLICY "Films are viewable by everyone" ON public.films
  FOR SELECT USING (true);

-- Premieres: Public read access
CREATE POLICY "Premieres are viewable by everyone" ON public.premieres
  FOR SELECT USING (true);

-- Tickets: Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON public.tickets
  FOR SELECT USING (auth.uid() = user_id);

-- Ratings: Public read, users can create/update their own
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create own ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Form submissions: Public can create, but we'll handle viewing via admin
CREATE POLICY "Anyone can submit forms" ON public.form_submissions
  FOR INSERT WITH CHECK (true);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_films_updated_at BEFORE UPDATE ON public.films
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_premieres_updated_at BEFORE UPDATE ON public.premieres
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

