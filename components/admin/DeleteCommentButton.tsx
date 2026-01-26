'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteCommentButtonProps {
  commentId: string
}

export default function DeleteCommentButton({ commentId }: DeleteCommentButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete comment')
      }

      // Refresh the page to update the list
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </button>
        {error && (
          <span className="text-xs text-red-600">{error}</span>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
    >
      Delete
    </button>
  )
}

