'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Star } from 'lucide-react'
import { format } from 'date-fns'

interface FilmDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  premiere: any
  film: any
  hasTicket: boolean
  averageRating: number | null
  totalRatings: number
  topComment: any | null
}

export default function FilmDetailsModal({
  isOpen,
  onClose,
  premiere,
  film,
  hasTicket,
  averageRating,
  totalRatings,
  topComment,
}: FilmDetailsModalProps) {
  if (!isOpen) return null

  const premiereDate = new Date(premiere.premiere_date)
  const year = premiereDate.getFullYear()
  const runtime = film.runtime ? `${film.runtime}m` : ''
  const genre = '' // Genre not in schema yet

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
          className="relative bg-white border-2 border-dashed border-[#000000] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Film Info */}
            <div>
              {/* Metadata */}
              <p
                className="text-[12px] text-[#585858] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                {year}{runtime && ` / ${runtime}`}
              </p>

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
                {film.title}
              </h2>

              {/* Description */}
              {film.description && (
                <p
                  className="text-[14px] text-[#000000] mb-6"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                >
                  {film.description}
                </p>
              )}

              {/* Rating */}
              {averageRating && (
                <div className="mb-6">
                  <p
                    className="text-[12px] text-[#585858] uppercase mb-2"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  >
                    RATING
                  </p>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="fill-[#FFBB00] text-[#FFBB00]" />
                    <span
                      className="text-[16px] font-bold text-[#000000]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      {averageRating.toFixed(1)} ({totalRatings})
                    </span>
                  </div>
                </div>
              )}

              {/* Director */}
              {film.director && (
                <div className="mb-4">
                  <p
                    className="text-[12px] text-[#585858] uppercase mb-1"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  >
                    DIRECTOR
                  </p>
                  <p
                    className="text-[14px] text-[#000000]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                  >
                    {film.director}
                  </p>
                </div>
              )}

              {/* Cast */}
              {film.cast_members && film.cast_members.length > 0 && (
                <div className="mb-6">
                  <p
                    className="text-[12px] text-[#585858] uppercase mb-1"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  >
                    CAST
                  </p>
                  <p
                    className="text-[14px] text-[#000000]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                  >
                    {film.cast_members.join(', ')}
                  </p>
                </div>
              )}

              {/* Top Comment */}
              {topComment && (
                <div className="bg-[#F2F0EA] border-2 border-dashed border-[#000000] p-4 mb-6">
                  <p
                    className="text-[12px] text-[#585858] uppercase mb-2"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  >
                    TOP COMMENT
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={16} className="fill-[#00FF00] text-[#00FF00]" />
                    <span
                      className="text-[12px] font-bold text-[#000000]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                    >
                      {topComment.user?.username || topComment.user?.full_name || 'Anonymous'}
                    </span>
                    <span
                      className="text-[12px] text-[#585858]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                    >
                      {topComment.like_count || 0}
                    </span>
                  </div>
                  <p
                    className="text-[12px] text-[#000000]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  >
                    {topComment.content}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Poster */}
            <div className="relative aspect-[2/3] w-full">
              {film.poster_url && (
                <Image
                  src={film.poster_url}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border-2 border-[#002498] bg-white px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#002498] hover:text-white transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              Close
            </button>
            {hasTicket && (
              <Link
                href={`/forum/${premiere.id}`}
                onClick={onClose}
                className="flex-1 rounded-md border-2 border-[#002498] bg-white px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#002498] hover:text-white transition-colors"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
              >
                Open Forum
              </Link>
            )}
            <a
              href={film.trailer_url || '#'}
              target={film.trailer_url ? "_blank" : undefined}
              rel={film.trailer_url ? "noopener noreferrer" : undefined}
              className="flex-1 rounded-md bg-[#002498] px-6 py-4 text-center font-medium text-[#FFFFFF] hover:bg-[#001876] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              Watch on Streaming
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

