import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

// PATCH /api/admin/films/[filmId] - Update a film
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ filmId: string }> }
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

    const { filmId } = await params
    // Use admin client to bypass RLS
    const supabase = createAdminClient()
    const body = await request.json()

    const { error } = await supabase
      .from('films')
      .update({
        title: body.title,
        description: body.description || null,
        director: body.director || null,
        cast_members: body.cast_members || null,
        runtime: body.runtime || null,
        poster_url: body.poster_url || null,
        trailer_url: body.trailer_url || null,
        dacast_video_id: body.dacast_video_id || null,
        dacast_qa_video_id: body.dacast_qa_video_id || null,
        dacast_countdown_video_id: body.dacast_countdown_video_id || null,
        merch_links: body.merch_links || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', filmId)

    if (error) {
      console.error('Error updating film:', error)
      return NextResponse.json(
        { error: 'Failed to update film' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in films PATCH:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/films/[filmId] - Delete a film
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filmId: string }> }
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

    const { filmId } = await params
    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('films')
      .delete()
      .eq('id', filmId)

    if (error) {
      console.error('Error deleting film:', error)
      return NextResponse.json(
        { error: 'Failed to delete film' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in films DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

