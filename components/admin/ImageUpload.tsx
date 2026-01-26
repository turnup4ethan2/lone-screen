'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucketName?: string
  folder?: string
}

export default function ImageUpload({ value, onChange, bucketName = 'film-posters', folder = 'posters' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucketName)
      formData.append('folder', folder)

      // Upload via API route
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload image')
      }

      const { url } = await response.json()
      
      if (url) {
        onChange(url)
        setPreview(url)
      } else {
        throw new Error('Failed to get image URL')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          {uploading ? (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-xs text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="mt-2 text-xs text-gray-500">Click to upload</p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>

        {(preview || value) && (
          <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={preview || value}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="text-sm text-gray-500">
        <p>Or enter a URL:</p>
      </div>
    </div>
  )
}

