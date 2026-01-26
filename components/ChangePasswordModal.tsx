'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Eye, EyeOff } from 'lucide-react'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update password')
      }

      onSuccess()
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div 
          className="relative bg-white border-2 border-dashed border-black p-8 max-w-md w-full mx-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-black" />
          </button>

          {/* Title */}
          <h2
            className="text-[36px] font-bold text-[#000000] mb-4"
            style={{
              fontFamily: 'Instrument Sans, sans-serif',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: '44px',
            }}
          >
            Change Password
          </h2>

          {/* Instructions */}
          <p
            className="text-[14px] text-[#000000] mb-6"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            YOU WANT TO CHANGE YOUR PASSWORD, FILL THE INPUTS AND CONFIRM IT.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-[12px] text-[#000000] uppercase mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-0 py-2 border-0 border-b-2 border-[#DCDCDC] bg-transparent text-[#000000] focus:outline-none focus:border-[#002498]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-0 top-2 text-[#585858] hover:text-[#000000]"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Link
                href="/login?forgot=true"
                className="text-[12px] text-[#002498] mt-1 block"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                FORGOT PASSWORD
              </Link>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-[12px] text-[#000000] uppercase mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-0 py-2 border-0 border-b-2 border-[#DCDCDC] bg-transparent text-[#000000] focus:outline-none focus:border-[#002498]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-0 top-2 text-[#585858] hover:text-[#000000]"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[12px] text-[#000000] uppercase mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-0 py-2 border-0 border-b-2 border-[#DCDCDC] bg-transparent text-[#000000] focus:outline-none focus:border-[#002498]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-2 text-[#585858] hover:text-[#000000]"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[12px] text-[#FF383C]" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}>
                {error}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border-2 border-[#002498] bg-white px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#002498] hover:text-white transition-colors"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-md bg-[#002498] px-6 py-4 text-center font-medium text-white hover:bg-[#001876] transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
              >
                {isSubmitting ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

