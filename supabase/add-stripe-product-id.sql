-- Add stripe_product_id column to premieres table
ALTER TABLE public.premieres
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_premieres_stripe_product_id ON public.premieres(stripe_product_id);

-- Add comment
COMMENT ON COLUMN public.premieres.stripe_product_id IS 'Stripe Product ID for this premiere. If set, checkout will use this product instead of creating a new one.';

