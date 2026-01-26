'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import type { Rating } from '@/types/database'

interface RatingFormProps {
  filmId: string
  premiereId: string
  filmTitle: string
  existingRating: Rating | null
  onSuccess?: () => void
}

export default function RatingForm({
  filmId,
  premiereId,
  filmTitle,
  existingRating,
  onSuccess
}: RatingFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(existingRating?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState(existingRating?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasRated, setHasRated] = useState(false) // Always allow rating/updating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filmId,
          premiereId,
          rating,
          comment: comment.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit rating')
      }

      setHasRated(true)
      // Redirect immediately to forum page (or call onSuccess callback if provided)
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/forum/${premiereId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = rating

  return (
    <div className="w-full max-w-2xl">
      {/* Rating Heading */}
      <div className="text-center mb-8">
        <h2
          className="text-[28px] font-bold text-[#FFFFFF] mb-4"
          style={{
            fontFamily: 'Instrument Sans, sans-serif',
            fontWeight: 800,
            letterSpacing: '-1px',
            lineHeight: '36px',
          }}
        >
          Rate the film
        </h2>

        {/* Rating Value */}
        <p
          className="text-[48px] font-bold text-[#FFFFFF] mb-4"
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
        <div className="flex gap-2 justify-center mb-6">
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
                  star <= (hoveredRating || rating)
                    ? 'fill-[#FFBB00] text-[#FFBB00]'
                    : 'fill-none text-[#929292] stroke-[#929292] stroke-1'
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Message */}
        {rating === 0 && (
          <p
            className="text-[14px] text-[#929292] text-center mb-6"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            The Forum and Merch will be available after you rate the film.
          </p>
        )}

        {/* Comment Section */}
        <div>
          <label
            htmlFor="comment"
            className="block text-[14px] text-[#FFFFFF] mb-3"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            Comment (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#929292] rounded-lg text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#002498] focus:border-[#002498] resize-none"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            placeholder="Share your thoughts about this film..."
          />
          <p
            className="mt-2 text-[12px] text-[#929292]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            Your comment will be posted to the discussion forum.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-[#FF383C]/20 border border-[#FF383C] rounded-lg">
            <p
              className="text-[12px] text-[#FF383C]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              {error}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="rounded-md bg-[#002498] px-8 py-4 text-center font-medium text-[#FFFFFF] hover:bg-[#001876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating & Go to Forum'}
          </button>
        </div>
      </form>
    </div>
  )
}
