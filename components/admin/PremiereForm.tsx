'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Premiere, Film } from '@/types/database'

interface PremiereFormProps {
  premiere?: Premiere
  films: Film[]
}

export default function PremiereForm({ premiere, films }: PremiereFormProps) {
  const router = useRouter()
  const isEdit = !!premiere

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    // Convert to local time and format as YYYY-MM-DDTHH:mm
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const [formData, setFormData] = useState({
    film_id: premiere?.film_id || '',
    premiere_date: formatDateForInput(premiere?.premiere_date),
    ticket_price: premiere?.ticket_price ? (premiere.ticket_price / 100).toFixed(2) : '',
    capacity: premiere?.capacity?.toString() || '100',
    status: premiere?.status || 'upcoming',
    livestream_duration_hours: premiere?.livestream_duration_hours?.toString() || '0',
    livestream_duration_minutes: premiere?.livestream_duration_minutes?.toString() || '0',
    livestream_duration_seconds: premiere?.livestream_duration_seconds?.toString() || '0',
    lobby_background_image_url: premiere?.lobby_background_image_url || '',
    stripe_product_id: premiere?.stripe_product_id || '',
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
      // Parse datetime-local input to ISO string
      const localDate = new Date(formData.premiere_date)
      if (isNaN(localDate.getTime())) {
        throw new Error('Invalid premiere date')
      }
      
      // Convert to UTC ISO string
      const premiereDateISO = localDate.toISOString()

      // Convert ticket price from dollars to cents
      const ticketPriceCents = Math.round(parseFloat(formData.ticket_price) * 100)

      const payload = {
        film_id: formData.film_id,
        premiere_date: premiereDateISO,
        ticket_price: ticketPriceCents,
        capacity: parseInt(formData.capacity),
        status: formData.status,
        livestream_duration_hours: parseInt(formData.livestream_duration_hours) || 0,
        livestream_duration_minutes: parseInt(formData.livestream_duration_minutes) || 0,
        livestream_duration_seconds: parseInt(formData.livestream_duration_seconds) || 0,
        lobby_background_image_url: formData.lobby_background_image_url || null,
        stripe_product_id: formData.stripe_product_id.trim() || null,
      }

      const url = isEdit ? `/api/admin/premieres/${premiere.id}` : '/api/admin/premieres'
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
        throw new Error(data.error || 'Failed to save premiere')
      }

      setSuccess(isEdit ? 'Premiere updated successfully!' : 'Premiere created successfully!')
      setTimeout(() => {
        router.push('/admin/premieres')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save premiere')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <label htmlFor="film_id" className="block text-sm font-medium text-gray-700 mb-2">
          Film <span className="text-red-500">*</span>
        </label>
        <select
          id="film_id"
          required
          value={formData.film_id}
          onChange={(e) => setFormData({ ...formData, film_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a film...</option>
          {films.map((film) => (
            <option key={film.id} value={film.id}>
              {film.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="premiere_date" className="block text-sm font-medium text-gray-700 mb-2">
          Premiere Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          id="premiere_date"
          required
          value={formData.premiere_date}
          onChange={(e) => setFormData({ ...formData, premiere_date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Note: Date/time is in your local timezone and will be converted to UTC for storage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ticket_price" className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="ticket_price"
            required
            min="0"
            step="0.01"
            value={formData.ticket_price}
            onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            Capacity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="capacity"
            required
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          required
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Livestream Duration</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="livestream_duration_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Hours
            </label>
            <input
              type="number"
              id="livestream_duration_hours"
              min="0"
              value={formData.livestream_duration_hours}
              onChange={(e) => setFormData({ ...formData, livestream_duration_hours: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="livestream_duration_minutes" className="block text-sm font-medium text-gray-700 mb-2">
              Minutes
            </label>
            <input
              type="number"
              id="livestream_duration_minutes"
              min="0"
              max="59"
              value={formData.livestream_duration_minutes}
              onChange={(e) => setFormData({ ...formData, livestream_duration_minutes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="livestream_duration_seconds" className="block text-sm font-medium text-gray-700 mb-2">
              Seconds
            </label>
            <input
              type="number"
              id="livestream_duration_seconds"
              min="0"
              max="59"
              value={formData.livestream_duration_seconds}
              onChange={(e) => setFormData({ ...formData, livestream_duration_seconds: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Duration until redirect to rating page after premiere starts
        </p>
      </div>

      <div>
        <label htmlFor="lobby_background_image_url" className="block text-sm font-medium text-gray-700 mb-2">
          Lobby Background Image URL
        </label>
        <input
          type="url"
          id="lobby_background_image_url"
          value={formData.lobby_background_image_url}
          onChange={(e) => setFormData({ ...formData, lobby_background_image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Background image displayed in the lobby before the premiere starts
        </p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stripe Integration</h3>
        <div>
          <label htmlFor="stripe_product_id" className="block text-sm font-medium text-gray-700 mb-2">
            Stripe Product ID (Optional)
          </label>
          <input
            type="text"
            id="stripe_product_id"
            value={formData.stripe_product_id}
            onChange={(e) => setFormData({ ...formData, stripe_product_id: e.target.value })}
            placeholder="prod_xxxxxxxxxxxxx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            If provided, checkout will use this Stripe Product instead of creating a new one. 
            This allows you to use a pre-configured Stripe product with its own pricing and settings.
            The product should have a price that matches the ticket price above.
          </p>
        </div>
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Premiere' : 'Create Premiere'}
        </button>
      </div>
    </form>
  )
}

