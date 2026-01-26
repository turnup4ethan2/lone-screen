import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ premiereId: string }> }
) {
  try {
    const { premiereId } = await params
    const supabase = await createClient()
    
    // Get the premiere and its film
    const { data: premiere, error: premiereError } = await supabase
      .from('premieres')
      .select(`
        *,
        film:films(*)
      `)
      .eq('id', premiereId)
      .single()

    if (premiereError || !premiere) {
      return NextResponse.json(
        { error: 'Premiere not found' },
        { status: 404 }
      )
    }

    const film = premiere.film as any
    const premiereDate = new Date(premiere.premiere_date)
    const now = new Date()
    const isPremiereTime = now >= premiereDate

    // Get video ID - use countdown before premiere, main film after
    const testVideoId = process.env.NEXT_PUBLIC_DACAST_TEST_VIDEO_ID || 'a1266caa-34d1-40f2-99f5-fa5fdc6926fa'
    const videoId = isPremiereTime
      ? (film.dacast_video_id || testVideoId)
      : (film.dacast_countdown_video_id || testVideoId)

    return NextResponse.json({ 
      videoId,
      isPremiereTime,
      filmVideoId: film.dacast_video_id
    })
  } catch (error) {
    console.error('Error fetching video ID:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

