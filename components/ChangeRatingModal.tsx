'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { X } from 'lucide-react'

interface ChangeRatingModalProps {
  isOpen: boolean
  onClose: () => void
  currentRating: number
  onApply: (newRating: number) => Promise<void>
}

export default function ChangeRatingModal({
  isOpen,
  onClose,
  currentRating,
  onApply,
}: ChangeRatingModalProps) {
  const [rating, setRating] = useState(currentRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleApply = async () => {
    setIsSubmitting(true)
    try {
      await onApply(rating)
      onClose()
    } catch (error) {
      console.error('Error updating rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
        <div 
          className="relative bg-white border-2 border-dashed border-[#000000] p-8 max-w-md w-full pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#000000]" />
          </button>

          {/* Title */}
          <h2
            className="text-[36px] font-bold text-[#000000] mb-4"
            style={{
              fontFamily: 'Instrument Sans, sans-serif',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: '44px',
            }}
          >
            Change the rating
          </h2>

          {/* Old Rating */}
          <p
            className="text-[14px] text-[#585858] mb-6"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            YOUR OLD RATING - {currentRating.toFixed(1)}
          </p>

          {/* New Rating Display */}
          <p
            className="text-[48px] font-bold text-[#000000] mb-4"
            style={{
              fontFamily: 'Spline Sans Mono, monospace',
              fontWeight: 700,
              letterSpacing: '-4%',
              lineHeight: '56px',
            }}
          >
            {displayRating > 0 ? displayRating.toFixed(1) : '0.0'}
          </p>

          {/* Stars */}
          <div className="flex gap-2 justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <Star
                  size={40}
                  className={
                    star <= displayRating
                      ? 'fill-[#FFBB00] text-[#FFBB00]'
                      : 'fill-none text-[#929292] stroke-[#929292] stroke-1'
                  }
                />
              </button>
            ))}
          </div>

          {/* Add new Rating text */}
          <p
            className="text-[14px] text-[#585858] text-center mb-6"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            Add new Rating
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-md border-2 border-[#002498] bg-white px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#002498] hover:text-white transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isSubmitting || rating === 0}
              className="flex-1 rounded-md bg-[#002498] px-6 py-4 text-center font-medium text-[#FFFFFF] hover:bg-[#001876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              {isSubmitting ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

