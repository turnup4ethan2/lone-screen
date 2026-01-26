'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeletePremiereButtonProps {
  premiereId: string
  premiereTitle: string
}

export default function DeletePremiereButton({ premiereId, premiereTitle }: DeletePremiereButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/premieres/${premiereId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete premiere')
      }

      // Redirect to premieres list page
      router.push('/admin/premieres')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete premiere')
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Premiere</h2>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the premiere for <strong>{premiereTitle}</strong>? 
                This action cannot be undone and will remove all associated tickets, ratings, and comments.
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
                  {isDeleting ? 'Deleting...' : 'Delete Premiere'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

