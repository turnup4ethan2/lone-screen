import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MyScreeningsClient from '@/components/MyScreeningsClient'
import TopLeftTimer from '@/components/TopLeftTimer'
import { getUpcomingPremiere } from '@/lib/premieres'

export default async function MyScreeningsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/my-screenings')
  }

  const supabase = await createClient()
  const now = new Date()

  // Get all premieres with their films, ordered by date (newest first for past, oldest first for upcoming)
  const { data: allPremieres } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(*)
    `)
    .order('premiere_date', { ascending: false })

  // Get user's tickets
  const { data: userTickets } = await supabase
    .from('tickets')
    .select('premiere_id, status')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const ticketPremiereIds = new Set(userTickets?.map(t => t.premiere_id) || [])

  // Separate premieres into upcoming and past
  const upcomingPremieres = (allPremieres || []).filter(
    p => new Date(p.premiere_date) > now
  ).reverse() // Reverse to show oldest upcoming first
  
  const pastPremieres = (allPremieres || []).filter(
    p => new Date(p.premiere_date) <= now
  )

  // Get ratings for all past premieres to calculate averages
  const pastPremiereIds = pastPremieres.map(p => p.id)
  const { data: allRatings } = pastPremiereIds.length > 0
    ? await supabase
        .from('ratings')
        .select('premiere_id, rating')
        .in('premiere_id', pastPremiereIds)
    : { data: null }

  // Calculate average ratings per premiere
  const ratingsByPremiere: Record<string, { average: number; count: number }> = {}
  if (allRatings) {
    pastPremiereIds.forEach(premiereId => {
      const premiereRatings = allRatings.filter(r => r.premiere_id === premiereId)
      if (premiereRatings.length > 0) {
        const sum = premiereRatings.reduce((acc, r) => acc + r.rating, 0)
        ratingsByPremiere[premiereId] = {
          average: sum / premiereRatings.length,
          count: premiereRatings.length,
        }
      }
    })
  }

  // Get top comment for each past premiere
  const topCommentsByPremiere: Record<string, any> = {}
  for (const premiereId of pastPremiereIds) {
    const { data: comments } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(id, username, full_name)
      `)
      .eq('premiere_id', premiereId)
      .is('deleted_at', null)
      .order('like_count', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (comments) {
      topCommentsByPremiere[premiereId] = comments
    }
  }

  // Get upcoming premiere for timer
  const upcomingPremiere = await getUpcomingPremiere()
  const premiereDate = upcomingPremiere?.premiere_date
  const lobbyOpenTime = premiereDate
    ? new Date(new Date(premiereDate).getTime() - 15 * 60 * 1000).toISOString()
    : undefined

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Top Left Timer */}
        {premiereDate && (
          <div className="mb-6">
            <TopLeftTimer targetDate={premiereDate} lobbyOpenTime={lobbyOpenTime} />
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
          <span
            className="text-[12px] text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            My Screenings
          </span>
        </nav>

        {/* Client Component for Interactive List */}
        <MyScreeningsClient
          upcomingPremieres={upcomingPremieres}
          pastPremieres={pastPremieres}
          ticketPremiereIds={ticketPremiereIds}
          ratingsByPremiere={ratingsByPremiere}
          topCommentsByPremiere={topCommentsByPremiere}
        />
      </div>
    </div>
  )
}
