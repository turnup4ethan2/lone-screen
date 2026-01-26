'use client'

import { Star } from 'lucide-react'

interface AverageRatingProps {
  rating: number // Average rating (e.g., 4.5)
  totalRatings: number // Total number of ratings
}

export default function AverageRating({ rating, totalRatings }: AverageRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2 // Round to nearest 0.5
  const fullStars = Math.floor(roundedRating)
  const hasHalfStar = roundedRating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={28} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative w-7 h-7">
            <Star size={28} className="absolute fill-gray-300 text-gray-300" />
            <div className="absolute overflow-hidden w-[50%]">
              <Star size={28} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={28} className="fill-gray-300 text-gray-300" />
        ))}
      </div>
      <span className="text-2xl font-bold text-white">{rating.toFixed(1)}</span>
      <span className="text-gray-400 text-lg">
        ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
      </span>
    </div>
  )
}

