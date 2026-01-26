'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteFilmButtonProps {
  filmId: string
  filmTitle: string
  premiereCount: number
}

export default function DeleteFilmButton({ filmId, filmTitle, premiereCount }: DeleteFilmButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/films/${filmId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete film')
      }

      // Redirect to films list page
      router.push('/admin/films')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete film')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-900 flex items-center gap-1"
        disabled={isDeleting}
      >
        <Trash2 size={16} />
        <span>Delete</span>
      </button>

      {showConfirm && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setShowConfirm(false)}
          />

          {/* Confirmation Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="relative bg-white border-2 border-dashed border-[#000000] p-8 max-w-md w-full mx-4 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Film</h2>
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{filmTitle}</strong>?
              </p>

              {premiereCount > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This film has {premiereCount} premiere{premiereCount !== 1 ? 's' : ''}. 
                    Deleting this film will also permanently delete all associated premieres, tickets, ratings, and comments.
                  </p>
                </div>
              )}

              <p className="text-gray-700 mb-6">
                This action cannot be undone.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowConfirm(false)
                    setError(null)
                  }}
                  disabled={isDeleting}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Film'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

