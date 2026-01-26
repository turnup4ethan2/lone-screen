import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UsersManagementClient from '@/components/admin/UsersManagementClient'

export default async function AdminUsersPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/')
  }

  // Get all users using admin client to bypass RLS
  const supabase = createAdminClient()
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, username, is_admin, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage user accounts and assign admin privileges
        </p>
      </div>

      <UsersManagementClient users={users || []} />
    </div>
  )
}

