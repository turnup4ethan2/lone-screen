import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const now = new Date()

  // Get statistics
  const [filmsResult, premieresResult, ticketsResult, revenueResult] = await Promise.all([
    supabase.from('films').select('id', { count: 'exact', head: true }),
    supabase.from('premieres').select('id', { count: 'exact', head: true }),
    supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('tickets').select('premiere_id, status').eq('status', 'active'),
  ])

  const filmsCount = filmsResult.count || 0
  const premieresCount = premieresResult.count || 0
  const ticketsCount = ticketsResult.count || 0

  // Calculate total revenue
  let totalRevenue = 0
  if (revenueResult.data) {
    const premiereIds = [...new Set(revenueResult.data.map(t => t.premiere_id))]
    for (const premiereId of premiereIds) {
      const { data: premiere } = await supabase
        .from('premieres')
        .select('ticket_price')
        .eq('id', premiereId)
        .single()
      
      if (premiere) {
        const ticketCount = revenueResult.data.filter(t => t.premiere_id === premiereId).length
        totalRevenue += premiere.ticket_price * ticketCount
      }
    }
  }

  // Get upcoming premieres
  const { data: upcomingPremieres } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(*)
    `)
    .gte('premiere_date', now.toISOString())
    .order('premiere_date', { ascending: true })
    .limit(5)

  // Get recent tickets
  const { data: recentTickets } = await supabase
    .from('tickets')
    .select(`
      *,
      premiere:premieres(
        *,
        film:films(*)
      ),
      user:profiles(email, full_name)
    `)
    .order('purchase_date', { ascending: false })
    .limit(10)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Films</h3>
          <p className="text-3xl font-bold text-gray-900">{filmsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Premieres</h3>
          <p className="text-3xl font-bold text-gray-900">{premieresCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Tickets</h3>
          <p className="text-3xl font-bold text-gray-900">{ticketsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Upcoming Premieres */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Premieres</h2>
          <Link
            href="/admin/premieres"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        <div className="p-6">
          {upcomingPremieres && upcomingPremieres.length > 0 ? (
            <div className="space-y-4">
              {upcomingPremieres.map((premiere) => {
                const film = premiere.film as any
                const premiereDate = new Date(premiere.premiere_date)
                const utilization = ((premiere.tickets_sold / premiere.capacity) * 100).toFixed(1)

                return (
                  <div
                    key={premiere.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {film?.title || 'Unknown Film'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {format(premiereDate, 'EEEE, MMMM d, yyyy')} at {format(premiereDate, 'h:mm a')}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Tickets Sold: {premiere.tickets_sold} / {premiere.capacity} ({utilization}%)</span>
                          <span>Price: ${(premiere.ticket_price / 100).toFixed(2)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/admin/premieres/${premiere.id}`}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming premieres</p>
          )}
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Tickets</h2>
          <Link
            href="/admin/tickets"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        <div className="p-6">
          {recentTickets && recentTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Film
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTickets.map((ticket) => {
                    const premiere = ticket.premiere as any
                    const film = premiere?.film as any
                    const user = ticket.user as any
                    const purchaseDate = new Date(ticket.purchase_date)

                    return (
                      <tr key={ticket.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {user?.email || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {film?.title || 'Unknown Film'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {format(purchaseDate, 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ticket.status === 'active' ? 'bg-green-100 text-green-800' :
                            ticket.status === 'cancelled' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent tickets</p>
          )}
        </div>
      </div>
    </div>
  )
}

