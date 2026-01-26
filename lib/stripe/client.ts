import { loadStripe } from '@stripe/stripe-js'

export const getStripeClient = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    console.warn('Stripe publishable key not found')
    return null
  }
  
  return loadStripe(publishableKey)
}

