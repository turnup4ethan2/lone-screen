import { getUpcomingPremiere, getUserTicket, checkTicketAvailability } from '@/lib/premieres'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import CountdownTimer from '@/components/CountdownTimer'
import TopLeftTimer from '@/components/TopLeftTimer'
import GetTicketButton from '@/components/GetTicketButton'
import AddToCalendar from '@/components/AddToCalendar'
import { format } from 'date-fns'
import Image from 'next/image'

export default async function HomePage() {
  const premiere = await getUpcomingPremiere()
  const user = await getCurrentUser()
  
  let userTicket = null
  let ticketAvailability = { available: false, remaining: 0 }
  
  if (premiere) {
    if (user) {
      userTicket = await getUserTicket(premiere.id, user.id)
    }
    ticketAvailability = await checkTicketAvailability(premiere.id)
  }

  if (!premiere) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F0EA]">
        <div className="text-center">
          <h1 className="text-[56px] font-bold text-[#000000] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 800, letterSpacing: '-2px' }}>The Lone Screen</h1>
          <p className="text-[16px] text-[#585858]" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}>No upcoming premieres scheduled</p>
        </div>
      </div>
    )
  }

  const film = premiere.film as any
  const premiereDate = new Date(premiere.premiere_date)
  const now = new Date()
  const lobbyOpenTime = new Date(premiereDate.getTime() - 15 * 60 * 1000) // 15 minutes before premiere
  const isLobbyOpen = now >= lobbyOpenTime
  const isSoldOut = !ticketAvailability.available
  const hasTicket = !!userTicket
  // Show yellow card only when user has ticket AND lobby is open
  const showYellowCard = hasTicket && isLobbyOpen

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F0EA]">
      {/* Timer bar (top) */}
      <div className="mx-auto w-full max-w-5xl px-6 pt-4 sm:px-8 lg:px-12">
        <div className="flex justify-start">
          <TopLeftTimer targetDate={premiere.premiere_date} isLobbyOpen={isLobbyOpen} />
        </div>
      </div>

      {/* Main grid (middle) – must fit viewport, no scroll */}
      <main className="flex-1 min-h-0">
        <div className="mx-auto w-full max-w-5xl px-6 pt-2 sm:px-8 lg:px-12">
          <div className="grid gap-5 lg:grid-cols-2 items-start pb-1">
            {/* Film Poster - Left Side Only */}
            <div className="w-full">
              {film.poster_url && (
                <div className="relative w-full overflow-hidden bg-[#DCDCDC] aspect-[2/3]">
                  <Image
                    src={film.poster_url}
                    alt={film.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 90vw"
                  />
                </div>
              )}
            </div>

            {/* Film Details & Ticket Card - Right Side */}
            <div className="flex flex-col space-y-3">
              {/* Film Details Section */}
              <div className="space-y-2">
                {/* Metadata above title (year / runtime / genre) */}
                {film.runtime && (
                  <p
                    className="text-[14px] text-[#585858] uppercase"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                  >
                    {new Date(premiereDate).getFullYear()} / {film.runtime}m
                  </p>
                )}
                
                <h1
                  className="text-[40px] font-bold text-[#000000]"
                  style={{
                    fontFamily: 'Instrument Sans, sans-serif',
                    fontWeight: 800,
                    letterSpacing: '-2px',
                    lineHeight: '44px',
                  }}
                >
                  {film.title}
          </h1>
                
                {film.description && (
                  <p
                    className="text-[14px] text-[#000000]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '22px', letterSpacing: '-4%' }}
                  >
                    {film.description}
                  </p>
                )}
              
                {/* Director and Cast sections */}
                <div className="space-y-2 pt-1">
                  {film.director && (
                    <div>
                      <p
                        className="text-[12px] text-[#000000] mb-1 uppercase font-bold"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                      >
                        DIRECTOR
                      </p>
                      <p
                        className="text-[14px] text-[#000000]"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '22px', letterSpacing: '-4%' }}
                      >
                        {film.director}
                      </p>
                    </div>
                  )}
                  {film.cast_members && film.cast_members.length > 0 && (
                    <div>
                      <p
                        className="text-[12px] text-[#000000] mb-1 uppercase font-bold"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                      >
                        CAST
                      </p>
                      <p
                        className="text-[14px] text-[#000000]"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '22px', letterSpacing: '-4%' }}
                      >
                        {film.cast_members.slice(0, 3).join(', ')}
                        {film.cast_members.length > 3 && <span className="text-[#002498] ml-2 cursor-pointer">SEE MORE</span>}
          </p>
        </div>
                  )}
                </div>
              </div>

              {/* Ticket Info & Actions */}
              <div className={`p-4 ${showYellowCard ? 'bg-[#FFBB00]' : 'bg-[#002498]'}`}>
                {/* Show success message if user has ticket */}
                {hasTicket && !showYellowCard && (
                  <div className="mb-6 text-center">
                    <h2
                      className="text-[28px] font-bold text-[#FFFFFF] mb-4"
                      style={{
                        fontFamily: 'Instrument Sans, sans-serif',
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        lineHeight: '36px',
                      }}
                    >
                      You've successfully booked your seat!
                    </h2>
                    <p
                      className="text-[14px] text-[#FFFFFF] mb-4"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                    >
                      VIRTUAL LOBBY OPENS 15 MINUTES BEFORE SHOWTIME, COME BACK ON TIME!
                    </p>
                    {/* Separator line with asterisks */}
                    <div className="text-[#FFFFFF] mb-4" style={{ fontFamily: 'Spline Sans Mono, monospace' }}>
                      {'*'.repeat(50)}
                    </div>
                  </div>
                )}

                {/* Show lobby message if user has ticket and lobby is open */}
                {showYellowCard && (
                  <div className="mb-4">
                    <p className="text-[14px] text-[#000000] mb-4 font-bold" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}>
                      THE PREMIERE WILL START IN UNDER 15 MINUTES, AND THE LOBBY IS ALREADY OPEN!
                    </p>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-[#000000] border-opacity-30">
                      <span className="text-[12px] text-[#000000] uppercase tracking-tight" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}>FILM STARTS IN</span>
                      <CountdownTimer targetDate={premiere.premiere_date} variant="dark" />
                    </div>
                  </div>
                )}

              {/* DATE row with hash symbol */}
              <div className={`flex items-center justify-between pb-3 mb-3 border-b border-dashed ${showYellowCard ? 'border-[#000000] border-opacity-30' : 'border-[#FFFFFF] border-opacity-30'}`}>
                <span className={`text-[12px] uppercase tracking-tight ${showYellowCard ? 'text-[#000000]' : 'text-[#FFFFFF]'}`} style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}>DATE</span>
                <span className={`text-[16px] uppercase tracking-tight ${showYellowCard ? 'text-[#000000]' : 'text-[#FFFFFF]'}`} style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}>
                  {format(premiereDate, 'MMMM d, yyyy').toUpperCase()} #
                </span>
              </div>

              {/* TIME row with hash symbol */}
              <div className={`flex items-center justify-between pb-3 mb-3 border-b border-dashed ${showYellowCard ? 'border-[#000000] border-opacity-30' : 'border-[#FFFFFF] border-opacity-30'}`}>
                <span className={`text-[12px] uppercase tracking-tight ${showYellowCard ? 'text-[#000000]' : 'text-[#FFFFFF]'}`} style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}>TIME</span>
                <span className={`text-[16px] tracking-tight ${showYellowCard ? 'text-[#000000]' : 'text-[#FFFFFF]'}`} style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}>
                  {format(premiereDate, 'h:mm a')} #
                </span>
              </div>

              {/* TOTAL row with hash symbol - only show if not blue card with ticket */}
              {(!hasTicket || showYellowCard) && (
                <div className={`flex items-center justify-between pb-3 mb-3 border-b border-dashed ${showYellowCard ? 'border-[#000000] border-opacity-30' : 'border-[#FFFFFF] border-opacity-30'}`}>
                  <span className={`text-[12px] uppercase tracking-tight ${showYellowCard ? 'text-[#000000]' : 'text-[#FFFFFF]'}`} style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}>TOTAL</span>
                  <span className={`text-[28px] font-bold tracking-tight ${showYellowCard ? 'text-[#000000]' : 'text-[#FFFFFF]'}`} style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700, letterSpacing: '0px', lineHeight: '28px' }}>
                    ${(premiere.ticket_price / 100).toFixed(2)} #
                  </span>
                </div>
              )}

              {!isSoldOut && !hasTicket && (
                <p className="text-[12px] text-[#FFFFFF] opacity-80 mb-6" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}>
                  {ticketAvailability.remaining} tickets remaining
                </p>
              )}

                {/* Action Buttons */}
                <div className="space-y-3">
                {!user ? (
                  <>
                    <Link
                      href="/signup"
                      className="block w-full rounded-md bg-[#FFFFFF] px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#001876] hover:text-[#FFFFFF] transition-colors"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      Get a Ticket →
                    </Link>
                    <Link
                      href="/login"
                      className="block w-full rounded-md border border-[#FFFFFF] border-opacity-30 px-6 py-4 text-center font-medium text-[#FFFFFF] hover:border-opacity-100 hover:bg-[#FFFFFF] hover:text-[#002498] transition-colors"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      Log In
                    </Link>
                  </>
                ) : hasTicket ? (
                  <>
                    {isLobbyOpen && (
                      <Link
                        href={`/lobby/${premiere.id}`}
                        className="block w-full rounded-md bg-[#000000] px-6 py-4 text-center font-medium text-[#FFFFFF] hover:bg-[#1a1a1a] transition-colors"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
                      >
                        Go to Lobby
                      </Link>
                    )}
                  </>
                ) : isSoldOut ? (
                  <button
                    disabled
                    className="w-full rounded-md bg-[#929292] px-6 py-4 font-medium text-[#FFFFFF] cursor-not-allowed opacity-50"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
                  >
                    Sold Out
                  </button>
                ) : (
                  <GetTicketButton
                    premiereId={premiere.id}
                    filmTitle={film.title}
                    premiereDate={premiere.premiere_date}
                    ticketPrice={premiere.ticket_price}
                    isLoggedIn={!!user}
                  />
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
