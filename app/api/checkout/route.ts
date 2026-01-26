import { getStripeServer } from '@/lib/stripe/server'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { premiereId, amount } = await request.json()

    if (!premiereId || !amount) {
      return NextResponse.json({ error: 'Missing premiereId or amount' }, { status: 400 })
    }

    // Verify premiere exists and is available
    const supabase = await createClient()
    const { data: premiere, error: premiereError } = await supabase
      .from('premieres')
      .select(`
        *,
        film:films(*)
      `)
      .eq('id', premiereId)
      .single()

    if (premiereError || !premiere) {
      return NextResponse.json({ error: 'Premiere not found' }, { status: 404 })
    }

    // Check if user already has a ticket
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', user.id)
      .eq('premiere_id', premiereId)
      .eq('status', 'active')
      .single()

    if (existingTicket) {
      return NextResponse.json({ error: 'You already have a ticket' }, { status: 400 })
    }

    // Check availability
    if (premiere.tickets_sold >= premiere.capacity) {
      return NextResponse.json({ error: 'Sold out' }, { status: 400 })
    }

    // Create Stripe Checkout Session
    const stripe = getStripeServer()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const film = premiere.film as any

    // If premiere has a Stripe product ID, use it; otherwise create price_data dynamically
    let lineItems: any[]
    
    if (premiere.stripe_product_id) {
      // Use existing Stripe product - need to get the default price
      try {
        const product = await stripe.products.retrieve(premiere.stripe_product_id)
        const prices = await stripe.prices.list({
          product: premiere.stripe_product_id,
          active: true,
          limit: 1,
        })
        
        if (prices.data.length > 0) {
          // Use the first active price for this product
          lineItems = [
            {
              price: prices.data[0].id,
              quantity: 1,
            },
          ]
        } else {
          // Fallback to price_data if no price found
          lineItems = [
            {
              price_data: {
                currency: 'usd',
                product: premiere.stripe_product_id,
                unit_amount: amount,
              },
              quantity: 1,
            },
          ]
        }
      } catch (error) {
        console.error('Error retrieving Stripe product:', error)
        // Fallback to price_data if product retrieval fails
        lineItems = [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Ticket: ${film?.title || 'Premiere'}`,
                description: `One-night-only premiere ticket`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ]
      }
    } else {
      // No Stripe product ID, create price_data dynamically
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Ticket: ${film?.title || 'Premiere'}`,
              description: `One-night-only premiere ticket`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ]
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/${premiereId}?canceled=true`,
      client_reference_id: premiereId,
      metadata: {
        userId: user.id,
        premiereId: premiereId,
      },
    })

    // Return both session ID and URL for the new Stripe.js API
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

