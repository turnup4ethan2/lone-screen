import Stripe from 'stripe'

export const getStripeServer = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  
  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  })
}

