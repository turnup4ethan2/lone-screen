'use client'

import { useState } from 'react'
import type { Premiere, Film } from '@/types/database'

interface AssignTicketButtonProps {
  premieres: (Premiere & { film?: Film })[]
}

export default function AssignTicketButton({ premieres }: AssignTicketButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [premiereId, setPremiereId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (!email || !premiereId) {
        throw new Error('Email and premiere are required')
      }

      const response = await fetch('/api/admin/tickets/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          premiere_id: premiereId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to assign ticket')
      }

      setSuccess('Ticket assigned successfully!')
      setEmail('')
      setPremiereId('')
      setTimeout(() => {
        setIsOpen(false)
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        Assign Free Ticket
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Assign Free Ticket</h2>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setError(null)
                  setSuccess(null)
                  setEmail('')
                  setPremiereId('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  User Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="premiere" className="block text-sm font-medium text-gray-700 mb-2">
                  Premiere <span className="text-red-500">*</span>
                </label>
                <select
                  id="premiere"
                  required
                  value={premiereId}
                  onChange={(e) => setPremiereId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a premiere...</option>
                  {premieres.map((premiere) => {
                    const film = premiere.film as any
                    return (
                      <option key={premiere.id} value={premiere.id}>
                        {film?.title || 'Unknown Film'} - {new Date(premiere.premiere_date).toLocaleDateString()}
                      </option>
                    )
                  })}
                </select>
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

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    setError(null)
                    setSuccess(null)
                    setEmail('')
                    setPremiereId('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

