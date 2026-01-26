'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { format } from 'date-fns'
import FilmDetailsModal from './FilmDetailsModal'

interface MyScreeningsClientProps {
  upcomingPremieres: any[]
  pastPremieres: any[]
  ticketPremiereIds: Set<string>
  ratingsByPremiere: Record<string, { average: number; count: number }>
  topCommentsByPremiere: Record<string, any>
}

export default function MyScreeningsClient({
  upcomingPremieres,
  pastPremieres,
  ticketPremiereIds,
  ratingsByPremiere,
  topCommentsByPremiere,
}: MyScreeningsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPremiere, setSelectedPremiere] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Combine all premieres for display
  const allPremieres = useMemo(() => {
    const combined = [
      ...upcomingPremieres.map(p => ({ ...p, isUpcoming: true })),
      ...pastPremieres.map(p => ({ ...p, isUpcoming: false })),
    ]

    // Filter by search query
    if (!searchQuery.trim()) {
      return combined
    }

    const query = searchQuery.toLowerCase()
    return combined.filter(p => {
      const film = p.film as any
      return (
        film.title?.toLowerCase().includes(query) ||
        film.director?.toLowerCase().includes(query)
      )
    })
  }, [upcomingPremieres, pastPremieres, searchQuery])

  const handlePremiereClick = (premiere: any) => {
    if (premiere.isUpcoming) {
      // Navigate to home page for upcoming premieres
      router.push('/')
    } else {
      // Show modal for past premieres
      setSelectedPremiere(premiere)
      setIsModalOpen(true)
    }
  }

  const getPremiereDisplay = (premiere: any) => {
    const film = premiere.film as any
    const hasTicket = ticketPremiereIds.has(premiere.id)
    const isSoldOut = premiere.tickets_sold >= premiere.capacity
    const isUpcoming = premiere.isUpcoming

    if (isUpcoming) {
      // Format date as MM.DD.YY and time as H:MM AM/PM
      const premiereDate = new Date(premiere.premiere_date)
      const formattedDate = format(premiereDate, 'MM.dd.yy')
      const formattedTime = format(premiereDate, 'h:mm a')
      const premiereText = `PREMIERE ${formattedDate} ${formattedTime}`
      
      return { type: 'premiere', text: premiereText, premiereDate }
    } else {
      // Past premiere - show rating
      const rating = ratingsByPremiere[premiere.id]
      if (rating) {
        const roundedRating = Math.round(rating.average * 10) / 10
        // Show star for ratings >= 4.5, otherwise show number
        if (roundedRating >= 4.5) {
          return { type: 'star', text: null }
        } else {
          return { type: 'rating', text: Math.round(rating.average * 20).toString() } // Convert to 0-100 scale
        }
      }
      return { type: 'no-rating', text: null }
    }
  }

  const selectedFilm = selectedPremiere?.film as any
  const selectedRating = selectedPremiere
    ? ratingsByPremiere[selectedPremiere.id]
    : null
  const selectedTopComment = selectedPremiere
    ? topCommentsByPremiere[selectedPremiere.id]
    : null

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8 flex justify-end">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-0 border-b border-[#000000] text-[#000000] focus:outline-none focus:border-[#002498] placeholder:text-[#929292] px-0 py-2 w-48"
          style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
        />
      </div>

      {/* Film List */}
      {allPremieres.length === 0 ? (
        <div className="text-center py-16">
          <p
            className="text-[16px] text-[#000000] mb-4"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
          >
            No screenings found
          </p>
        </div>
      ) : (
        <>
          {/* Show empty state message if no past screenings */}
          {pastPremieres.length === 0 && (
            <div className="text-center py-8 mb-8">
              <p
                className="text-[16px] text-[#000000] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                **********************************
              </p>
              <p
                className="text-[16px] text-[#000000] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                THERE ARE NO PAST SCREENINGS YET
              </p>
              <p
                className="text-[16px] text-[#000000] mb-8"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                **********************************
              </p>
            </div>
          )}
          {/* Show all premieres */}
          <div className="space-y-0">
            {allPremieres.map((premiere) => {
            const film = premiere.film as any
            const display = getPremiereDisplay(premiere)

            return (
              <div
                key={premiere.id}
                className="border-t border-dashed border-[#000000] py-4 hover:bg-[#002498] hover:text-[#FFFFFF] transition-colors cursor-pointer group"
                onClick={() => handlePremiereClick(premiere)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3
                      className="text-[16px] font-bold text-[#000000] group-hover:text-[#FFFFFF] transition-colors"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
                    >
                      {film.title?.toUpperCase()}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {display.type === 'premiere' && (
                      <div className="bg-[#000000] text-[#FFFFFF] px-4 py-2">
                        <span
                          className="text-[12px] font-bold uppercase"
                          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                        >
                          {display.text}
                        </span>
                      </div>
                    )}
                    {display.type === 'booked' && (
                      <div className="bg-[#000000] text-[#FFFFFF] px-4 py-2">
                        <span
                          className="text-[12px] font-bold uppercase"
                          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                        >
                          {display.text}
                        </span>
                      </div>
                    )}
                    {display.type === 'soldout' && (
                      <button
                        className="bg-[#929292] text-[#FFFFFF] px-4 py-2 hover:bg-[#000000] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement waitlist functionality
                        }}
                      >
                        <span
                          className="text-[12px] font-bold uppercase"
                          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                        >
                          {display.text}
                        </span>
                      </button>
                    )}
                    {display.type === 'rating' && (
                      <span
                        className="text-[16px] font-bold text-[#000000] group-hover:text-[#FFFFFF] transition-colors"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
                      >
                        {display.text}
                      </span>
                    )}
                    {display.type === 'star' && (
                      <Star
                        size={20}
                        className="fill-[#000000] text-[#000000] group-hover:fill-[#FFFFFF] group-hover:text-[#FFFFFF] transition-colors"
                      />
                    )}
                    <span
                      className="text-[16px] text-[#000000] group-hover:text-[#FFFFFF] transition-colors"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
                    >
                      #
                    </span>
                  </div>
                </div>
              </div>
            )
            })}
          </div>
        </>
      )}

      {/* Film Details Modal */}
      {selectedPremiere && (
        <FilmDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPremiere(null)
          }}
          premiere={selectedPremiere}
          film={selectedFilm}
          hasTicket={ticketPremiereIds.has(selectedPremiere.id)}
          averageRating={selectedRating?.average || null}
          totalRatings={selectedRating?.count || 0}
          topComment={selectedTopComment || null}
        />
      )}
    </>
  )
}

