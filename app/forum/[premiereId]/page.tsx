import { getCurrentUser } from '@/lib/auth'
import { getUserTicket } from '@/lib/premieres'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DacastPlayer from '@/components/DacastPlayer'
import ForumSection from '@/components/ForumSection'
import ForumPageClient from '@/components/ForumPageClient'
import TopLeftTimer from '@/components/TopLeftTimer'
import { getUpcomingPremiere } from '@/lib/premieres'
import { format } from 'date-fns'
import { Star } from 'lucide-react'

export default async function ForumPage({
  params,
}: {
  params: Promise<{ premiereId: string }>
}) {
  const { premiereId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/forum/' + premiereId)
  }

  // Get premiere and film data
  const supabase = await createClient()
  const { data: premiere, error: premiereError } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(*)
    `)
    .eq('id', premiereId)
    .single()

  if (premiereError || !premiere) {
    redirect('/')
  }

  // Check if user has a ticket (required to access forum)
  const ticket = await getUserTicket(premiereId, user.id)
  if (!ticket) {
    redirect(`/checkout/${premiereId}`)
  }

  // Check if user has rated this premiere (required to access forum)
  const { data: userRating } = await supabase
    .from('ratings')
    .select('rating')
    .eq('user_id', user.id)
    .eq('premiere_id', premiereId)
    .single()

  if (!userRating) {
    redirect(`/lobby/${premiereId}/rate`)
  }

  const film = premiere.film as any
  const premiereDate = new Date(premiere.premiere_date)

  // Get average rating for this premiere
  const { data: ratings } = await supabase
    .from('ratings')
    .select('rating')
    .eq('premiere_id', premiereId)

  const averageRating = ratings && ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length)
    : null

  const totalRatings = ratings?.length || 0
  const userRatingValue = userRating?.rating || 0

  // Get upcoming premiere for timer
  const upcomingPremiere = await getUpcomingPremiere()
  const upcomingPremiereDate = upcomingPremiere?.premiere_date
  const lobbyOpenTime = upcomingPremiereDate
    ? new Date(new Date(upcomingPremiereDate).getTime() - 15 * 60 * 1000).toISOString()
    : undefined

  // Format year, runtime, genre
  const year = premiereDate.getFullYear()
  const runtime = film.runtime ? `${film.runtime}m` : ''
  const genre = '' // Not in schema yet

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Top Left Timer */}
        {upcomingPremiereDate && (
          <div className="mb-6">
            <TopLeftTimer targetDate={upcomingPremiereDate} lobbyOpenTime={lobbyOpenTime} />
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="mb-8">
          <Link
            href="/"
            className="text-[12px] text-[#929292] hover:text-[#000000] transition-colors"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            Home
          </Link>
          <span
            className="text-[12px] text-[#929292] mx-2"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            /
          </span>
          <Link
            href="/my-screenings"
            className="text-[12px] text-[#929292] hover:text-[#000000] transition-colors"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            My Screenings
          </Link>
          <span
            className="text-[12px] text-[#929292] mx-2"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            /
          </span>
          <span
            className="text-[12px] text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            Forum
          </span>
        </nav>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Movie Details & Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Details & Video Player Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Movie Details */}
              <div className="bg-[#1E1E1E] p-6 rounded-lg">
                <p
                  className="text-[12px] text-[#929292] mb-2"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  {year}{runtime && ` / ${runtime}`}
                </p>
                <h1
                  className="text-[36px] font-bold text-[#FFFFFF] mb-4"
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
                    className="text-[14px] text-[#FFFFFF] mb-6"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                  >
                    {film.description}
                  </p>
                )}
                {film.trailer_url && (
                  <a
                    href={film.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-md bg-[#002498] px-6 py-3 text-center font-medium text-[#FFFFFF] hover:bg-[#001876] transition-colors"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
                  >
                    Watch on Streaming
                  </a>
                )}
              </div>

              {/* Video Player */}
              {film.dacast_qa_video_id && (
                <div className="relative bg-[#000000] rounded-lg overflow-hidden aspect-video">
                  <DacastPlayer 
                    videoId={film.dacast_qa_video_id} 
                    accountId={process.env.NEXT_PUBLIC_DACAST_ACCOUNT_ID}
                    className="w-full h-full"
                  />
                  {/* Director Overlay */}
                  {film.director && (
                    <div className="absolute top-4 left-4 bg-[#000000] border-2 border-dashed border-[#FFFFFF] p-3">
                      <p
                        className="text-[10px] text-[#FFFFFF] uppercase mb-1"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '12px', letterSpacing: '-4%' }}
                      >
                        Director
                      </p>
                      <p
                        className="text-[12px] text-[#FFFFFF]"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                      >
                        {film.director}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Forum Section */}
            <ForumSection 
              premiereId={premiereId} 
              userId={user.id}
              filmTitle={film.title}
              merchLinks={film.merch_links}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Promotional Banner */}
            <div className="bg-[#E8E8FF] border-2 border-dashed border-[#002498] p-6 rounded-lg">
              <h3
                className="text-[16px] font-bold text-[#002498] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                Don't miss your early-bird ticket for next week's premiere!
              </h3>
              <p
                className="text-[14px] text-[#002498] mb-4"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Get your ticket with -50% discount.
              </p>
              <Link
                href="/"
                className="block w-full rounded-md border-2 border-[#002498] bg-[#FFFFFF] px-6 py-3 text-center font-medium text-[#002498] hover:bg-[#002498] hover:text-[#FFFFFF] transition-colors"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                Buy a ticket
              </Link>
            </div>

            {/* Rating Section */}
            <div className="bg-[#FFFFFF] border-2 border-dashed border-[#000000] p-6 rounded-lg">
              <div className="mb-6">
                <p
                  className="text-[12px] text-[#585858] uppercase mb-2"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  RATING
                </p>
                {averageRating && (
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={20} className="fill-[#FFBB00] text-[#FFBB00]" />
                    <span
                      className="text-[16px] font-bold text-[#000000]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      {averageRating.toFixed(1)} ({totalRatings})
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p
                    className="text-[12px] text-[#585858]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  >
                    YOUR RATING - {userRatingValue.toFixed(1)}
                  </p>
                  <ForumPageClient
                    premiereId={premiereId}
                    filmId={film.id}
                    currentRating={userRatingValue}
                  />
                </div>
              </div>

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
                <div>
                  <p
                    className="text-[12px] text-[#585858] uppercase mb-2"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  >
                    CAST
                  </p>
                  <div className="space-y-1">
                    {film.cast_members.map((castMember: string, index: number) => (
                      <p
                        key={index}
                        className="text-[14px] text-[#000000]"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                      >
                        {castMember}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
