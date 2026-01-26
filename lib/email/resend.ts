import { Resend } from 'resend'

// Only initialize Resend if API key is available
// This allows the app to work even if emails aren't configured
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Default from email - can be configured in Resend dashboard
const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const APP_NAME = 'The Lone Screen'

export { DEFAULT_FROM_EMAIL, APP_NAME }

