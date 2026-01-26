import { createAdminClient } from '@/lib/supabase/admin'
import { format } from 'date-fns'

export default async function AdminSubmissionsPage() {
  // Use admin client to see all form submissions
  const supabase = createAdminClient()

  // Get all form submissions
  const { data: submissions } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  // Separate by type
  const contactSubmissions = (submissions || []).filter(s => s.type === 'contact_us')
  const filmmakerSubmissions = (submissions || []).filter(s => s.type === 'filmmaker_application')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Form Submissions</h1>

      {/* Filmmaker Applications */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Filmmaker Applications ({filmmakerSubmissions.length})
        </h2>
        {filmmakerSubmissions.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filmmakerSubmissions.map((submission) => {
                const createdDate = new Date(submission.created_at)

                return (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {submission.name}
                          </h3>
                          <span className="text-sm text-gray-500">{submission.email}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {format(createdDate, 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        {submission.film_title && (
                          <p className="text-sm font-medium text-blue-600 mb-2">
                            Film: {submission.film_title}
                          </p>
                        )}
                        {submission.screener_link && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Screener:</span>{' '}
                            <a
                              href={submission.screener_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {submission.screener_link}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {submission.message}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No filmmaker applications yet</p>
          </div>
        )}
      </div>

      {/* Contact Us Submissions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Contact Us ({contactSubmissions.length})
        </h2>
        {contactSubmissions.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {contactSubmissions.map((submission) => {
                const createdDate = new Date(submission.created_at)

                return (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {submission.name}
                          </h3>
                          <span className="text-sm text-gray-500">{submission.email}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {format(createdDate, 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {submission.message}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No contact submissions yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
