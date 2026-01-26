import { createAdminClient } from '@/lib/supabase/admin'
import { format } from 'date-fns'
import DeleteCommentButton from '@/components/admin/DeleteCommentButton'

export default async function AdminCommentsPage() {
  // Use admin client to bypass RLS and see all comments including deleted ones
  const supabase = createAdminClient()

  // Get all comments (including deleted ones for moderation)
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100) // Limit to most recent 100 for performance

  // Get user info for all comments
  const userIds = [...new Set((comments || []).map(c => c.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, email')
    .in('id', userIds)

  // Get premiere info for all comments
  const premiereIds = [...new Set((comments || []).map(c => c.premiere_id))]
  const { data: premieres } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(title)
    `)
    .in('id', premiereIds)

  const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])
  const premieresMap = new Map(premieres?.map(p => [p.id, p]) || [])

  // Attach user and premiere info to comments
  const commentsWithUsers = (comments || []).map(comment => ({
    ...comment,
    user: profilesMap.get(comment.user_id) || null,
    premiere: premieresMap.get(comment.premiere_id) || null,
  }))

  // Separate active and deleted comments
  const activeComments = commentsWithUsers.filter(c => !c.deleted_at)
  const deletedComments = commentsWithUsers.filter(c => c.deleted_at)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Comments Moderation</h1>

      {/* Active Comments */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Comments ({activeComments.length})</h2>
        {activeComments.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {activeComments.map((comment) => {
                const premiere = comment.premiere as any
                const film = premiere?.film as any
                const user = comment.user as any
                const createdDate = new Date(comment.created_at)

                return (
                  <div
                    key={comment.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${comment.deleted_at ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user?.full_name || user?.username || user?.email || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          <div className="text-xs text-gray-400">•</div>
                          <div className="text-xs text-gray-500">
                            {format(createdDate, 'MMM d, yyyy h:mm a')}
                          </div>
                          <div className="text-xs text-gray-400">•</div>
                          <div className="text-xs text-blue-600">
                            {film?.title || 'Unknown Film'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        {comment.parent_id && (
                          <p className="text-xs text-gray-400 mt-2">Reply to comment {comment.parent_id.substring(0, 8)}...</p>
                        )}
                      </div>
                      <div className="ml-4">
                        {!comment.deleted_at && (
                          <DeleteCommentButton commentId={comment.id} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No active comments</p>
          </div>
        )}
      </div>

      {/* Deleted Comments */}
      {deletedComments.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Deleted Comments ({deletedComments.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {deletedComments.map((comment) => {
                const premiere = comment.premiere as any
                const film = premiere?.film as any
                const user = comment.user as any
                const createdDate = new Date(comment.created_at)
                const deletedDate = comment.deleted_at ? new Date(comment.deleted_at) : null

                return (
                  <div
                    key={comment.id}
                    className="p-6 opacity-50 hover:opacity-75 transition-opacity"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user?.full_name || user?.username || user?.email || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          <div className="text-xs text-gray-400">•</div>
                          <div className="text-xs text-gray-500">
                            {format(createdDate, 'MMM d, yyyy h:mm a')}
                          </div>
                          {deletedDate && (
                            <>
                              <div className="text-xs text-gray-400">•</div>
                              <div className="text-xs text-red-500">
                                Deleted: {format(deletedDate, 'MMM d, yyyy h:mm a')}
                              </div>
                            </>
                          )}
                          <div className="text-xs text-gray-400">•</div>
                          <div className="text-xs text-blue-600">
                            {film?.title || 'Unknown Film'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 line-through whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      <div className="ml-4">
                        <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                          Deleted
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
