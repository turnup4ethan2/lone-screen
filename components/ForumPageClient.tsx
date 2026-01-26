'use client'

import { useState } from 'react'
import ChangeRatingModal from './ChangeRatingModal'

interface ForumPageClientProps {
  premiereId: string
  filmId: string
  currentRating: number
}

export default function ForumPageClient({ premiereId, filmId, currentRating }: ForumPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleApply = async (newRating: number) => {
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filmId,
        premiereId,
        rating: newRating,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to update rating')
    }

    // Refresh the page to show updated rating
    window.location.reload()
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-[12px] text-[#002498] hover:text-[#001876] transition-colors uppercase"
        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
      >
        CHANGE
      </button>

      <ChangeRatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentRating={currentRating}
        onApply={handleApply}
      />
    </>
  )
}

