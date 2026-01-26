import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

// POST /api/admin/premieres - Create a new premiere
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

    // Validate required fields
    if (!body.film_id || !body.premiere_date || !body.ticket_price || !body.capacity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build insert object, only include lobby_background_image_url if provided
    const insertData: any = {
      film_id: body.film_id,
      premiere_date: body.premiere_date,
      ticket_price: body.ticket_price,
      capacity: body.capacity,
      status: body.status || 'upcoming',
      livestream_duration_hours: body.livestream_duration_hours || 0,
      livestream_duration_minutes: body.livestream_duration_minutes || 0,
      livestream_duration_seconds: body.livestream_duration_seconds || 0,
      tickets_sold: 0, // New premieres start with 0 tickets sold
    }

    // Only include optional fields if provided
    if (body.lobby_background_image_url !== undefined && body.lobby_background_image_url !== null && body.lobby_background_image_url !== '') {
      insertData.lobby_background_image_url = body.lobby_background_image_url
    }
    if (body.stripe_product_id !== undefined && body.stripe_product_id !== null && body.stripe_product_id !== '') {
      insertData.stripe_product_id = body.stripe_product_id.trim()
    }

    const { error } = await supabase
      .from('premieres')
      .insert(insertData)

    if (error) {
      console.error('Error creating premiere:', error)
      return NextResponse.json(
        { error: 'Failed to create premiere: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in premieres POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

