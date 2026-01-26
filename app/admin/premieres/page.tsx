import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import DeletePremiereButton from '@/components/admin/DeletePremiereButton'

export default async function AdminPremieresPage() {
  const supabase = await createClient()

  // Get all premieres with film info
  const { data: premieres } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(*)
    `)
    .order('premiere_date', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Premieres</h1>
        <Link
          href="/admin/premieres/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Create New Premiere
        </Link>
      </div>

      {premieres && premieres.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Film
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premiere Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {premieres.map((premiere) => {
                const film = premiere.film as any
                const premiereDate = new Date(premiere.premiere_date)
                const utilization = ((premiere.tickets_sold / premiere.capacity) * 100).toFixed(1)
                const revenue = (premiere.tickets_sold * premiere.ticket_price) / 100

                return (
                  <tr key={premiere.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {film?.title || 'Unknown Film'}
                      </div>
                      {film?.director && (
                        <div className="text-sm text-gray-500">{film.director}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(premiereDate, 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(premiereDate, 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(premiere.ticket_price / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {premiere.tickets_sold} / {premiere.capacity}
                      </div>
                      <div className="text-sm text-gray-500">{utilization}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        premiere.status === 'live' ? 'bg-green-100 text-green-800' :
                        premiere.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {premiere.status.charAt(0).toUpperCase() + premiere.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/premieres/${premiere.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <DeletePremiereButton
                          premiereId={premiere.id}
                          premiereTitle={film?.title || 'Unknown Film'}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No premieres yet</p>
          <Link
            href="/admin/premieres/new"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Create Your First Premiere
          </Link>
        </div>
      )}
    </div>
  )
}

