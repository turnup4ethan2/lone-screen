import { getUpcomingPremiere, getUserTicket } from '@/lib/premieres'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LobbyVideoPlayer from '@/components/LobbyVideoPlayer'
import ShareButton from '@/components/ShareButton'
import LocalTime from '@/components/LocalTime'

export default async function LobbyPage({
  params,
}: {
  params: Promise<{ premiereId: string }>
}) {
  const { premiereId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/lobby/' + premiereId)
  }

  // Get premiere by ID directly (don't rely on upcoming filter)
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

  // Check if user has a ticket
  const ticket = await getUserTicket(premiereId, user.id)
  if (!ticket) {
    redirect(`/checkout/${premiereId}`)
  }

  const film = premiere.film as any
  const premiereDate = new Date(premiere.premiere_date)
  const now = new Date()
  const lobbyOpenTime = new Date(premiereDate.getTime() - 15 * 60 * 1000) // 15 minutes before
  const isLobbyOpen = now >= lobbyOpenTime

  // Redirect to home if lobby is not open yet (server-side gate)
  if (!isLobbyOpen) {
    redirect('/?lobbyClosed=true')
  }

  // Calculate end time
  const endTime = new Date(premiereDate.getTime() + 
    (premiere.livestream_duration_hours || 0) * 60 * 60 * 1000 +
    (premiere.livestream_duration_minutes || 0) * 60 * 1000 +
    (premiere.livestream_duration_seconds || 0) * 1000
  )
  const endTimeIso = endTime.toISOString()

  // Get video ID - use countdown before premiere, main film after
  const testVideoId = process.env.NEXT_PUBLIC_DACAST_TEST_VIDEO_ID || 'a1266caa-34d1-40f2-99f5-fa5fdc6926fa'
  // Initial video ID (may be countdown or main video). LobbyVideoPlayer
  // will fetch the latest correct ID when the premiere starts.
  const videoId = film.dacast_countdown_video_id || film.dacast_video_id || testVideoId

  return (
    <div className="min-h-screen bg-[#000000] flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#000000] border-r border-[#1E1E1E] p-6 flex flex-col">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <Image
            src="/logo.png"
            alt="THE LONE SCREEN"
            width={150}
            height={150}
            className="h-auto w-auto"
            priority
          />
        </Link>

        {/* Breadcrumbs */}
        <nav className="mb-8">
          <Link
            href="/"
            className="text-[12px] text-[#929292] hover:text-[#FFFFFF] transition-colors"
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
          <span
            className="text-[12px] text-[#FFFFFF]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            Lobby
          </span>
        </nav>

        {/* Welcome Message - Centered */}
        <div className="flex-1 flex items-center">
          <div className="border-2 border-dashed border-[#FFFFFF] p-6 w-full">
            <h2
              className="text-[16px] font-bold text-[#FFFFFF] mb-2"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: '24px',
              }}
            >
              Welcome to Lobby!
            </h2>
            <p
              className="text-[12px] text-[#929292]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              Join the forum after the film ends - meet other viewers and check out exclusive merch.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-[#000000] border-b border-[#1E1E1E] px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Film Title */}
            <h1
              className="text-[56px] font-bold text-[#FFFFFF]"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: '44px',
              }}
            >
              {film.title}
            </h1>

            {/* Film Details */}
            <div className="flex items-center gap-8">
              {/* Time */}
              <div className="text-right">
                <p
                  className="text-[12px] text-[#929292] uppercase mb-1"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  Time
                </p>
                <p
                  className="text-[16px] font-bold text-[#FFFFFF]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                >
                  <LocalTime isoString={premiere.premiere_date} formatString="h:mm a" /> -{' '}
                  <LocalTime isoString={endTimeIso} formatString="h:mm a" />
                </p>
              </div>

              {/* Info */}
              <div className="text-right">
                <p
                  className="text-[12px] text-[#929292] uppercase mb-1"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  Info
                </p>
                <p
                  className="text-[16px] font-bold text-[#FFFFFF]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                >
                  {new Date(premiereDate).getFullYear()}, Thriller/Comedy
                </p>
              </div>

              {/* Director */}
              <div className="text-right">
                <p
                  className="text-[12px] text-[#929292] uppercase mb-1"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  Director{film.director && film.director.includes(',') ? '(-s)' : ''}
                </p>
                <p
                  className="text-[16px] font-bold text-[#FFFFFF]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                >
                  {film.director || 'N/A'}
                </p>
              </div>

              {/* Share Button */}
              <ShareButton title={film.title} url={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/lobby/${premiereId}`} />
            </div>
          </div>
        </header>

        {/* Main Content Area with Background Image */}
        <div className="flex-1 relative">
          {/* Background Image */}
          {premiere.lobby_background_image_url && (
            <div className="absolute inset-0">
              <Image
                src={premiere.lobby_background_image_url}
                alt={film.title}
                fill
                className="object-cover"
                priority
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}

        {/* Video Player + internal countdown */}
        <div className="absolute inset-0">
          <LobbyVideoPlayer 
            videoId={videoId} 
            premiereDate={premiere.premiere_date}
            premiereId={premiere.id}
            filmId={film.id}
            livestreamDurationHours={premiere.livestream_duration_hours || 0}
            livestreamDurationMinutes={premiere.livestream_duration_minutes || 0}
            livestreamDurationSeconds={premiere.livestream_duration_seconds || 0}
          />
        </div>
        </div>
      </main>
    </div>
  )
}
