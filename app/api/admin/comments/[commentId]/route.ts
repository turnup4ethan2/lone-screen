import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

// DELETE /api/admin/comments/[commentId] - Soft delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
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

    const { commentId } = await params
    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // Soft delete by setting deleted_at timestamp
    const { error } = await supabase
      .from('comments')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', commentId)

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json(
        { error: 'Failed to delete comment: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in comments DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

