import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/comments?premiereId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const premiereId = searchParams.get('premiereId')

    if (!premiereId) {
      return NextResponse.json(
        { error: 'Missing premiereId parameter' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get authenticated user (if any) to check which comments they've liked
    const { data: { user } } = await supabase.auth.getUser()

    // Get all comments for this premiere (only non-deleted, with user info)
    // Note: Using manual join since Supabase doesn't automatically join profiles
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('premiere_id', premiereId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })

    if (error || !comments) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Fetch user info for each comment
    const userIds = [...new Set(comments.map(c => c.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, username, email')
      .in('id', userIds)

    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])
    
    // Get like counts for all comments
    const commentIds = comments.map(c => c.id)
    const { data: likes } = await supabase
      .from('comment_likes')
      .select('comment_id, user_id')
      .in('comment_id', commentIds)

    // Count likes per comment
    const likesCountMap = new Map<string, number>()
    const userLikedMap = new Map<string, boolean>()
    
    likes?.forEach(like => {
      const count = likesCountMap.get(like.comment_id) || 0
      likesCountMap.set(like.comment_id, count + 1)
      
      // Check if current user liked this comment
      if (user && like.user_id === user.id) {
        userLikedMap.set(like.comment_id, true)
      }
    })
    
    // Attach user info, like counts, and user's like status to comments
    const commentsWithUsers = comments.map(comment => ({
      ...comment,
      user: profilesMap.get(comment.user_id) || null,
      likes_count: likesCountMap.get(comment.id) || 0,
      isLiked: userLikedMap.get(comment.id) || false
    }))

    return NextResponse.json({ comments: commentsWithUsers || [] })
  } catch (error) {
    console.error('Error in comments GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create a new comment or reply
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
    const { premiereId, content, parentId } = body

    // Validate input
    if (!premiereId || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: premiereId and content are required' },
        { status: 400 }
      )
    }

    // Verify user has a ticket for this premiere (required to comment)
    const { data: ticket } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', user.id)
      .eq('premiere_id', premiereId)
      .eq('status', 'active')
      .single()

    if (!ticket) {
      return NextResponse.json(
        { error: 'You must have a ticket to comment on this premiere' },
        { status: 403 }
      )
    }

    // If this is a reply, verify the parent comment exists
    if (parentId) {
      const { data: parentComment } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parentId)
        .eq('premiere_id', premiereId)
        .is('deleted_at', null)
        .single()

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    // Create the comment
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({
        premiere_id: premiereId,
        user_id: user.id,
        content: content.trim(),
        parent_id: parentId || null,
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('Error creating comment:', insertError)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    // Fetch user info for the new comment
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, username, email')
      .eq('id', user.id)
      .single()

    const commentWithUser = {
      ...comment,
      user: profile || null
    }

    return NextResponse.json({ comment: commentWithUser }, { status: 201 })
  } catch (error) {
    console.error('Error in comments POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

