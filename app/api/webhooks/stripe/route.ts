import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { sendPurchaseConfirmationEmail } from '@/lib/email/send'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const stripe = getStripeServer()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Create ticket in database
    const supabase = createAdminClient()
    
    // Get premiereId from metadata (set by Payment Links) or client_reference_id (set by our checkout)
    const premiereId = session.metadata?.premiereId || session.client_reference_id
    
    if (!premiereId) {
      console.error('Missing premiereId in session metadata or client_reference_id')
      return NextResponse.json({ error: 'Invalid session data' }, { status: 400 })
    }

    // Get userId from metadata (if set by our checkout) or look up by customer email
    let userId = session.metadata?.userId
    
    if (!userId && session.customer_email) {
      // Try to find user by email (for Payment Link purchases)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', session.customer_email.toLowerCase())
        .single()
      
      if (profile) {
        userId = profile.id
      }
    }

    if (!userId) {
      console.error('Missing userId - cannot create ticket without user association')
      // For Payment Links, we might need to handle this on the success page
      // For now, log and continue - the success page can handle ticket creation
      console.warn('Payment completed but no user found. Premiere ID:', premiereId)
      return NextResponse.json({ 
        received: true,
        warning: 'Payment completed but ticket creation deferred to success page'
      })
    }

    // Create ticket
    const { error: ticketError } = await supabase.from('tickets').insert({
      user_id: userId,
      premiere_id: premiereId,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'active',
    })

    if (ticketError) {
      console.error('Error creating ticket:', ticketError)
      return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
    }

    // Increment tickets_sold
    const { error: updateError } = await supabase.rpc('increment_tickets_sold', {
      premiere_id: premiereId,
    })

    // If RPC doesn't exist, do manual update
    if (updateError) {
      const { data: premiere } = await supabase
        .from('premieres')
        .select('tickets_sold')
        .eq('id', premiereId)
        .single()

      if (premiere) {
        await supabase
          .from('premieres')
          .update({ tickets_sold: premiere.tickets_sold + 1 })
          .eq('id', premiereId)
      }
    }

    // Send purchase confirmation email
    try {
      // Get user email and profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      // Get premiere and film info
      const { data: premiereData } = await supabase
        .from('premieres')
        .select(`
          *,
          film:films(*)
        `)
        .eq('id', premiereId)
        .single()

      if (profile && premiereData) {
        const film = premiereData.film as any
        const userName = profile.full_name || profile.email.split('@')[0]

        await sendPurchaseConfirmationEmail({
          to: profile.email,
          userName,
          filmTitle: film?.title || 'Premiere',
          premiereDate: new Date(premiereData.premiere_date),
          ticketPrice: premiereData.ticket_price,
          premiereId,
        })
      }
    } catch (emailError) {
      // Log error but don't fail the webhook
      console.error('Error sending purchase confirmation email:', emailError)
    }
  }

  return NextResponse.json({ received: true })
}

