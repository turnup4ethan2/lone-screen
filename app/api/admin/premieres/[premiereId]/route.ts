import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

// PATCH /api/admin/premieres/[premiereId] - Update a premiere
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ premiereId: string }> }
) {
  try {
    // Check admin status
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { premiereId } = await params
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

    // Build update object, only include lobby_background_image_url if provided
    const updateData: any = {
      film_id: body.film_id,
      premiere_date: body.premiere_date,
      ticket_price: body.ticket_price,
      capacity: body.capacity,
      status: body.status || 'upcoming',
      livestream_duration_hours: body.livestream_duration_hours || 0,
      livestream_duration_minutes: body.livestream_duration_minutes || 0,
      livestream_duration_seconds: body.livestream_duration_seconds || 0,
      updated_at: new Date().toISOString(),
    }

    // Only include optional fields if provided
    if (body.lobby_background_image_url !== undefined && body.lobby_background_image_url !== null && body.lobby_background_image_url !== '') {
      updateData.lobby_background_image_url = body.lobby_background_image_url
    }
    if (body.stripe_product_id !== undefined && body.stripe_product_id !== null) {
      updateData.stripe_product_id = body.stripe_product_id.trim() || null
    }

    const { error } = await supabase
      .from('premieres')
      .update(updateData)
      .eq('id', premiereId)

    if (error) {
      console.error('Error updating premiere:', error)
      // If error is about missing column, try again without that field
      if (error.message.includes('lobby_background_image_url') && error.message.includes('column')) {
        delete updateData.lobby_background_image_url
        const { error: retryError } = await supabase
          .from('premieres')
          .update(updateData)
          .eq('id', premiereId)
        
        if (retryError) {
          return NextResponse.json(
            { error: 'Failed to update premiere: ' + retryError.message },
            { status: 500 }
          )
        }
        // Success after removing the field
        return NextResponse.json({ success: true })
      }
      return NextResponse.json(
        { error: 'Failed to update premiere: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in premieres PATCH:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/premieres/[premiereId] - Delete a premiere
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ premiereId: string }> }
) {
  try {
    // Check admin status
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { premiereId } = await params
    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('premieres')
      .delete()
      .eq('id', premiereId)

    if (error) {
      console.error('Error deleting premiere:', error)
      return NextResponse.json(
        { error: 'Failed to delete premiere' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in premieres DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

