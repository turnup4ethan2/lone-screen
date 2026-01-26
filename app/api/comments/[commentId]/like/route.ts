import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/comments/[commentId]/like - Toggle like on a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user already liked this comment
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      // Unlike: delete the like
      const { error: deleteError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('Error unliking comment:', deleteError)
        return NextResponse.json(
          { error: 'Failed to unlike comment' },
          { status: 500 }
        )
      }

      return NextResponse.json({ liked: false })
    } else {
      // Like: create a new like
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
        })

      if (insertError) {
        console.error('Error liking comment:', insertError)
        return NextResponse.json(
          { error: 'Failed to like comment' },
          { status: 500 }
        )
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error in comment like API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

