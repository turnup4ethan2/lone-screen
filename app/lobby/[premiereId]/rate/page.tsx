import { getCurrentUser } from '@/lib/auth'
import { getUserTicket } from '@/lib/premieres'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import Image from 'next/image'
import RatingForm from '@/components/RatingForm'
import ShareButton from '@/components/ShareButton'

export default async function RatingPage({
  params,
}: {
  params: Promise<{ premiereId: string }>
}) {
  const { premiereId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/lobby/' + premiereId + '/rate')
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

  // Check if user has a ticket
  const ticket = await getUserTicket(premiereId, user.id)
  if (!ticket) {
    redirect(`/checkout/${premiereId}`)
  }

  // Check if user has already rated
  const { data: existingRating } = await supabase
    .from('ratings')
    .select('*')
    .eq('user_id', user.id)
    .eq('premiere_id', premiereId)
    .single()

  const film = premiere.film as any
  const premiereDate = new Date(premiere.premiere_date)
  
  // Calculate end time
  const endTime = new Date(premiereDate.getTime() + 
    (premiere.livestream_duration_hours || 0) * 60 * 60 * 1000 +
    (premiere.livestream_duration_minutes || 0) * 60 * 1000 +
    (premiere.livestream_duration_seconds || 0) * 1000
  )

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
                  {format(premiereDate, 'h:mm a')} - {format(endTime, 'h:mm a')}
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
              <ShareButton title={film.title} url={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/lobby/${premiereId}/rate`} />
            </div>
          </div>
        </header>

        {/* Rating Section */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <RatingForm
            filmId={film.id}
            premiereId={premiereId}
            filmTitle={film.title}
            existingRating={existingRating || null}
          />
        </div>
      </main>
    </div>
  )
}
