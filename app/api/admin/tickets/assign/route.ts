import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

// POST /api/admin/tickets/assign - Assign a free ticket to a user
export async function POST(request: NextRequest) {
  try {
    // Check admin status
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use admin client to bypass RLS
    const supabase = createAdminClient()
    const body = await request.json()
    const { email, premiere_id } = body

    if (!email || !premiere_id) {
      return NextResponse.json(
        { error: 'Email and premiere_id are required' },
        { status: 400 }
      )
    }

    // Find user by email in profiles table (which references auth.users)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single()
    
    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found with that email address. Make sure the user has signed up first.' },
        { status: 404 }
      )
    }

    const userId = profile.id

    // Check if user already has a ticket for this premiere
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', userId)
      .eq('premiere_id', premiere_id)
      .eq('status', 'active')
      .single()

    if (existingTicket) {
      return NextResponse.json(
        { error: 'User already has an active ticket for this premiere' },
        { status: 400 }
      )
    }

    // Check premiere capacity
    const { data: premiere, error: premiereError } = await supabase
      .from('premieres')
      .select('capacity, tickets_sold')
      .eq('id', premiere_id)
      .single()

    if (premiereError || !premiere) {
      return NextResponse.json(
        { error: 'Premiere not found' },
        { status: 404 }
      )
    }

    if (premiere.tickets_sold >= premiere.capacity) {
      return NextResponse.json(
        { error: 'Premiere is at capacity' },
        { status: 400 }
      )
    }

    // Create ticket (no stripe_payment_intent_id since it's free)
    const { error: ticketError } = await supabase
      .from('tickets')
      .insert({
        user_id: userId,
        premiere_id: premiere_id,
        status: 'active',
        // No stripe_payment_intent_id for free tickets
      })

    if (ticketError) {
      console.error('Error creating ticket:', ticketError)
      return NextResponse.json(
        { error: 'Failed to create ticket: ' + ticketError.message },
        { status: 500 }
      )
    }

    // Increment tickets_sold
    const { error: updateError } = await supabase.rpc('increment_tickets_sold', {
      premiere_id: premiere_id,
    })

    // If RPC doesn't exist, do manual update
    if (updateError) {
      await supabase
        .from('premieres')
        .update({ tickets_sold: premiere.tickets_sold + 1 })
        .eq('id', premiere_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in assign ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

