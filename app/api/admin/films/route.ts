import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

// POST /api/admin/films - Create a new film
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

    const { error } = await supabase
      .from('films')
      .insert({
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
      })

    if (error) {
      console.error('Error creating film:', error)
      return NextResponse.json(
        { error: 'Failed to create film' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in films POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

