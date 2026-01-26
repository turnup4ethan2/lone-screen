import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/profile - Update profile information
export async function PATCH(request: NextRequest) {
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
    const { full_name, username, year_of_birth } = body

    // Check username uniqueness if username is being changed
    if (username) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single()

      if (existingProfile) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    // Validate year of birth if provided
    if (year_of_birth !== null && year_of_birth !== undefined) {
      const currentYear = new Date().getFullYear()
      if (year_of_birth < 1900 || year_of_birth > currentYear) {
        return NextResponse.json(
          { error: 'Invalid year of birth' },
          { status: 400 }
        )
      }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: full_name || null,
        username: username || null,
        year_of_birth: year_of_birth || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in profile PATCH:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

