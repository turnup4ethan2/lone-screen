-- Function to increment tickets_sold for a premiere
-- This is used by the Stripe webhook when a ticket is purchased

CREATE OR REPLACE FUNCTION increment_tickets_sold(premiere_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.premieres
  SET tickets_sold = tickets_sold + 1
  WHERE id = premiere_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

