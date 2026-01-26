import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { v4 as uuidv4 } from 'uuid'

// POST /api/upload - Public file upload for filmmaker applications
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = formData.get('bucket') as string | null

    if (!file || !bucket) {
      return NextResponse.json(
        { error: 'File and bucket are required' },
        { status: 400 }
      )
    }

    // Validate file size (max 100MB for video files)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 100MB' },
        { status: 400 }
      )
    }

    // Use admin client to upload (bypasses RLS)
    const supabase = createAdminClient()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = `${bucket}/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      console.error('Error uploading file:', error)
      return NextResponse.json(
        { error: 'Failed to upload file: ' + error.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ publicUrl: urlData.publicUrl })
  } catch (error) {
    console.error('Error in upload API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

