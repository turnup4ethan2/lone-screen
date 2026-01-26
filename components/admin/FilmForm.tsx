'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Film } from '@/types/database'
import ImageUpload from './ImageUpload'

interface FilmFormProps {
  film?: Film
}

export default function FilmForm({ film }: FilmFormProps) {
  const router = useRouter()
  const isEdit = !!film

  const [formData, setFormData] = useState({
    title: film?.title || '',
    description: film?.description || '',
    director: film?.director || '',
    cast_members: (film?.cast_members || []).join(', '),
    runtime: film?.runtime?.toString() || '',
    poster_url: film?.poster_url || '',
    trailer_url: film?.trailer_url || '',
    dacast_video_id: film?.dacast_video_id || '',
    dacast_qa_video_id: film?.dacast_qa_video_id || '',
    dacast_countdown_video_id: film?.dacast_countdown_video_id || '',
    merch_links: film?.merch_links ? JSON.stringify(film.merch_links, null, 2) : '[]',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Parse cast members
      const castMembers = formData.cast_members
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0)

      // Parse merch links
      let merchLinks = []
      try {
        merchLinks = JSON.parse(formData.merch_links)
      } catch (e) {
        throw new Error('Invalid JSON format for merch links')
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        director: formData.director.trim() || null,
        cast_members: castMembers.length > 0 ? castMembers : null,
        runtime: formData.runtime ? parseInt(formData.runtime) : null,
        poster_url: formData.poster_url.trim() || null,
        trailer_url: formData.trailer_url.trim() || null,
        dacast_video_id: formData.dacast_video_id.trim() || null,
        dacast_qa_video_id: formData.dacast_qa_video_id.trim() || null,
        dacast_countdown_video_id: formData.dacast_countdown_video_id.trim() || null,
        merch_links: merchLinks,
      }

      const url = isEdit ? `/api/admin/films/${film.id}` : '/api/admin/films'
      const method = isEdit ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save film')
      }

      setSuccess(isEdit ? 'Film updated successfully!' : 'Film created successfully!')
      setTimeout(() => {
        router.push('/admin/films')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save film')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-2">
            Director
          </label>
          <input
            type="text"
            id="director"
            value={formData.director}
            onChange={(e) => setFormData({ ...formData, director: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="runtime" className="block text-sm font-medium text-gray-700 mb-2">
            Runtime (minutes)
          </label>
          <input
            type="number"
            id="runtime"
            min="1"
            value={formData.runtime}
            onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cast_members" className="block text-sm font-medium text-gray-700 mb-2">
          Cast Members (comma-separated)
        </label>
        <input
          type="text"
          id="cast_members"
          value={formData.cast_members}
          onChange={(e) => setFormData({ ...formData, cast_members: e.target.value })}
          placeholder="Actor 1, Actor 2, Actor 3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="poster_url" className="block text-sm font-medium text-gray-700 mb-2">
          Poster Image
        </label>
        <ImageUpload
          value={formData.poster_url}
          onChange={(url) => setFormData({ ...formData, poster_url: url })}
          bucketName="film-posters"
          folder="posters"
        />
        <input
          type="url"
          id="poster_url"
          value={formData.poster_url}
          onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
          placeholder="Or paste an image URL here"
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload an image directly or paste a URL. Recommended: 400x600px (2:3 aspect ratio), max 5MB
        </p>
      </div>

      <div>
        <label htmlFor="trailer_url" className="block text-sm font-medium text-gray-700 mb-2">
          Trailer URL
        </label>
        <input
          type="url"
          id="trailer_url"
          value={formData.trailer_url}
          onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Dacast Video IDs</h3>
        <div>
          <label htmlFor="dacast_video_id" className="block text-sm font-medium text-gray-700 mb-2">
            Main Film Video ID
          </label>
          <input
            type="text"
            id="dacast_video_id"
            value={formData.dacast_video_id}
            onChange={(e) => setFormData({ ...formData, dacast_video_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dacast_qa_video_id" className="block text-sm font-medium text-gray-700 mb-2">
            Q&A Video ID
          </label>
          <input
            type="text"
            id="dacast_qa_video_id"
            value={formData.dacast_qa_video_id}
            onChange={(e) => setFormData({ ...formData, dacast_qa_video_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dacast_countdown_video_id" className="block text-sm font-medium text-gray-700 mb-2">
            Countdown Video ID
          </label>
          <input
            type="text"
            id="dacast_countdown_video_id"
            value={formData.dacast_countdown_video_id}
            onChange={(e) => setFormData({ ...formData, dacast_countdown_video_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="merch_links" className="block text-sm font-medium text-gray-700 mb-2">
          Merch Links (JSON array)
        </label>
        <textarea
          id="merch_links"
          rows={6}
          value={formData.merch_links}
          onChange={(e) => setFormData({ ...formData, merch_links: e.target.value })}
          placeholder='[{"title": "T-Shirt", "url": "https://...", "price": "$25", "description": "..."}]'
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Format: JSON array with objects containing title, url, price (optional), description (optional)
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Film' : 'Create Film'}
        </button>
      </div>
    </form>
  )
}

