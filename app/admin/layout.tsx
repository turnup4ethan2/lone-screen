import { getCurrentUserProfile, isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUserProfile()
  const admin = await isAdmin()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  if (!admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/films"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Films
                </Link>
                <Link
                  href="/admin/premieres"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Premieres
                </Link>
                <Link
                  href="/admin/tickets"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Tickets
                </Link>
                <Link
                  href="/admin/comments"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Comments
                </Link>
                <Link
                  href="/admin/submissions"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Submissions
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Users
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

