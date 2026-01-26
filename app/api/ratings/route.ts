import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const premiereId = searchParams.get('premiereId')

    if (!premiereId) {
      return NextResponse.json(
        { error: 'Missing premiereId parameter' },
        { status: 400 }
      )
    }

    // Check if user has already rated this premiere
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id')
      .eq('user_id', user.id)
      .eq('premiere_id', premiereId)
      .single()

    return NextResponse.json({ 
      hasRated: !!existingRating,
      ratingId: existingRating?.id || null
    })
  } catch (error) {
    console.error('Error checking rating:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { filmId, premiereId, rating, comment } = body

    // Validate input
    if (!filmId || !premiereId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: filmId, premiereId, and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already rated this premiere
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id')
      .eq('user_id', user.id)
      .eq('premiere_id', premiereId)
      .single()

    if (existingRating) {
      // Update existing rating
      const { error: updateError } = await supabase
        .from('ratings')
        .update({
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRating.id)

      if (updateError) {
        console.error('Error updating rating:', updateError)
        return NextResponse.json(
          { error: 'Failed to update rating' },
          { status: 500 }
        )
      }

      // If updating with a comment, also post it to the discussion forum (if not already posted)
      if (comment && comment.trim()) {
        // Check if user already has a top-level comment for this premiere
        // We check the most recent one to see if it matches
        const { data: existingComments } = await supabase
          .from('comments')
          .select('id, content')
          .eq('user_id', user.id)
          .eq('premiere_id', premiereId)
          .eq('parent_id', null) // Only top-level comments (not replies)
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(1)

        // Only create a new comment if they don't have one already or it's different
        if (!existingComments || existingComments.length === 0) {
          await supabase
            .from('comments')
            .insert({
              premiere_id: premiereId,
              user_id: user.id,
              content: comment.trim(),
              parent_id: null,
            })
        }
      }

      return NextResponse.json({ success: true, updated: true })
    } else {
      // Create new rating
      const { error: insertError } = await supabase
        .from('ratings')
        .insert({
          user_id: user.id,
          film_id: filmId,
          premiere_id: premiereId,
          rating,
          comment: comment || null,
        })

      if (insertError) {
        console.error('Error creating rating:', insertError)
        return NextResponse.json(
          { error: 'Failed to create rating' },
          { status: 500 }
        )
      }

      // If rating includes a comment, also post it to the discussion forum
      if (comment && comment.trim()) {
        await supabase
          .from('comments')
          .insert({
            premiere_id: premiereId,
            user_id: user.id,
            content: comment.trim(),
            parent_id: null,
          })
      }

      return NextResponse.json({ success: true, updated: false })
    }
  } catch (error) {
    console.error('Error in ratings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

