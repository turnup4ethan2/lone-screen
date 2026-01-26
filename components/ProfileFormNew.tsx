'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/database'
import ChangePasswordModal from './ChangePasswordModal'
import DeleteAccountModal from './DeleteAccountModal'

interface ProfileFormNewProps {
  profile: User | null
  email: string
}

export default function ProfileFormNew({ profile, email }: ProfileFormNewProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName.trim() || null,
          username: username.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/delete', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      // Redirect to home page after account deletion
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* INFO Section */}
        <div>
          <h3
            className="text-[12px] text-[#000000] uppercase mb-4 font-bold"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            INFO
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-[12px] text-[#000000] uppercase mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-0 py-2 border-0 border-b-2 border-[#DCDCDC] bg-transparent text-[#000000] focus:outline-none focus:border-[#002498]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-[12px] text-[#000000] uppercase mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                User Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-0 py-2 border-0 border-b-2 border-[#DCDCDC] bg-transparent text-[#000000] focus:outline-none focus:border-[#002498]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
            </div>

            {error && (
              <p className="text-[12px] text-[#FF383C]" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}>
                {error}
              </p>
            )}

            {success && (
              <p className="text-[12px] text-[#10b981]" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}>
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md border-2 border-[#DCDCDC] bg-white px-6 py-3 text-[#000000] hover:border-[#002498] hover:text-[#002498] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
            >
              Save →
            </button>
          </form>
        </div>

        {/* SECURITY Section */}
        <div className="pt-8 border-t border-dashed border-[#DCDCDC]">
          <h3
            className="text-[12px] text-[#000000] uppercase mb-4 font-bold"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            SECURITY
          </h3>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-[12px] text-[#000000] uppercase mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Email
              </label>
              <div className="flex items-center justify-between">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="flex-1 px-0 py-2 border-0 border-b-2 border-[#DCDCDC] bg-transparent text-[#000000] cursor-not-allowed"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                />
                <button
                  type="button"
                  className="ml-4 text-[12px] text-[#002498] uppercase hover:text-[#001876]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                  disabled
                >
                  CHANGE
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[12px] text-[#000000] uppercase mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Password
              </label>
              <div className="flex items-center justify-between">
                <input
                  type="password"
                  value="***********"
                  disabled
                  className="flex-1 px-0 py-2 border-0 border-b-2 border-[#DCDCDC] bg-transparent text-[#000000] cursor-not-allowed"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="ml-4 text-[12px] text-[#002498] uppercase hover:text-[#001876]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  CHANGE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          setShowPasswordModal(false)
          router.refresh()
        }}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </>
  )
}

