'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface User {
  id: string
  email: string
  full_name: string | null
  username: string | null
  is_admin: boolean
  created_at: string
}

interface UsersManagementClientProps {
  users: User[]
}

export default function UsersManagementClient({ users: initialUsers }: UsersManagementClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query)
    )
  })

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setUpdatingUsers(prev => new Set(prev).add(userId))
    setError(null)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_admin: !currentStatus,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update admin status')
      }

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, is_admin: !currentStatus }
            : user
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin status')
    } finally {
      setUpdatingUsers(prev => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email, name, or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || user.username || 'N/A'}
                    </div>
                    {user.username && (
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_admin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                      disabled={updatingUsers.has(user.id)}
                      className={`${
                        user.is_admin
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-blue-600 hover:text-blue-900'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingUsers.has(user.id)
                        ? 'Updating...'
                        : user.is_admin
                        ? 'Remove Admin'
                        : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Admins</div>
          <div className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.is_admin).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Regular Users</div>
          <div className="text-2xl font-bold text-gray-600">
            {users.filter(u => !u.is_admin).length}
          </div>
        </div>
      </div>
    </div>
  )
}

