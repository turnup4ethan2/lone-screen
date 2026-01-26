import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import AssignTicketButton from '@/components/admin/AssignTicketButton'

export default async function AdminTicketsPage() {
  const supabase = await createClient()

  // Get all tickets with user and premiere info
  const { data: tickets } = await supabase
    .from('tickets')
    .select(`
      *,
      user:profiles(id, email, full_name),
      premiere:premieres(
        *,
        film:films(*)
      )
    `)
    .order('purchase_date', { ascending: false })

  // Get all premieres for the assign ticket form
  const { data: premieres } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(title)
    `)
    .order('premiere_date', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tickets Management</h1>
        <AssignTicketButton premieres={premieres || []} />
      </div>

      {tickets && tickets.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Film / Premiere
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Intent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const user = ticket.user as any
                  const premiere = ticket.premiere as any
                  const film = premiere?.film as any
                  const purchaseDate = new Date(ticket.purchase_date)

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.full_name || user?.email || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {film?.title || 'Unknown Film'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {premiere?.premiere_date ? format(new Date(premiere.premiere_date), 'MMM d, yyyy h:mm a') : 'No date'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(purchaseDate, 'MMM d, yyyy')}
                        <div className="text-gray-500">{format(purchaseDate, 'h:mm a')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.stripe_payment_intent_id ? (
                          <span className="text-xs text-gray-600 font-mono">
                            {ticket.stripe_payment_intent_id.substring(0, 20)}...
                          </span>
                        ) : (
                          <span className="text-xs text-green-600 font-medium">Free Ticket</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ticket.status === 'active' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'cancelled' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/tickets/${ticket.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No tickets found</p>
        </div>
      )}
    </div>
  )
}
