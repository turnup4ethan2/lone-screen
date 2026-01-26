import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

// PATCH /api/admin/users/[userId] - Update user admin status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
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

    const { userId } = await params
    const body = await request.json()
    const { is_admin } = body

    if (typeof is_admin !== 'boolean') {
      return NextResponse.json(
        { error: 'is_admin must be a boolean' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('profiles')
      .update({ is_admin })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user admin status:', error)
      return NextResponse.json(
        { error: 'Failed to update user admin status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in users PATCH:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

