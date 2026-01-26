'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { X, Eye, EyeOff } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [agreeToEmails, setAgreeToEmails] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Force a full page reload to ensure server components see the updated auth state
      window.location.href = '/'
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate passwords match
    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate age (18+)
    if (dateOfBirth) {
      // Parse MM/DD/YYYY format
      const parts = dateOfBirth.split('/')
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1 // Month is 0-indexed
        const day = parseInt(parts[1])
        const year = parseInt(parts[2])
        const birthDate = new Date(year, month, day)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        const dayDiff = today.getDate() - birthDate.getDate()
        if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
          setError('You must be 18 or older to sign up')
          setLoading(false)
          return
        }
      }
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          nickname: nickname,
          date_of_birth: dateOfBirth,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      // Update profile
      if (data.user) {
        let birthYear = null
        if (dateOfBirth) {
          const parts = dateOfBirth.split('/')
          if (parts.length === 3) {
            birthYear = parseInt(parts[2])
          }
        }
        await supabase
          .from('profiles')
          .update({ 
            full_name: fullName,
            username: nickname || null,
            year_of_birth: birthYear,
          })
          .eq('id', data.user.id)
      }
      // Force a full page reload to ensure server components see the updated auth state
      window.location.href = '/'
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setError(null)
    setLoading(true)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
    } else {
      setError(null)
      alert('Password reset email sent! Check your inbox.')
      setLoading(false)
    }
  }

  if (!isOpen) return null

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
          className="relative bg-white border-2 border-dashed border-[#000000] p-8 max-w-md w-full mx-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#000000]" />
          </button>

          {/* Title */}
          <div className="mb-4">
            {mode === 'login' ? (
              <h2
                className="text-[36px] font-bold text-[#000000]"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-2px',
                  lineHeight: '44px',
                }}
              >
                Log in <span className="text-[#002498]">or join</span>
              </h2>
            ) : (
              <h2
                className="text-[36px] font-bold text-[#000000]"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-2px',
                  lineHeight: '44px',
                }}
              >
                <span className="text-[#000000]">Join</span> or log in
              </h2>
            )}
          </div>

          {/* Description */}
          <p
            className="text-[14px] text-[#585858] mb-6"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            Log in to The Lone Screen to buy tickets and participate in our premiere events.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#FF383C]/20 border border-[#FF383C] rounded-lg">
              <p
                className="text-[12px] text-[#FF383C]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#000000] text-[#000000] focus:outline-none focus:border-[#002498] placeholder:text-[#929292]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                  />
                </div>

                {/* Nickname */}
                <div>
                  <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#000000] text-[#000000] focus:outline-none focus:border-[#002498] placeholder:text-[#929292]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <input
                    type="text"
                    placeholder="Date of birth / /"
                    value={dateOfBirth}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '') // Remove non-digits
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2)
                      }
                      if (value.length >= 5) {
                        value = value.slice(0, 5) + '/' + value.slice(5, 9)
                      }
                      setDateOfBirth(value)
                    }}
                    required
                    maxLength={10}
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#000000] text-[#000000] focus:outline-none focus:border-[#002498] placeholder:text-[#929292]"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#000000] text-[#000000] focus:outline-none focus:border-[#002498] placeholder:text-[#929292]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-0 py-2 pr-8 bg-transparent border-0 border-b border-[#000000] text-[#000000] focus:outline-none focus:border-[#002498] placeholder:text-[#929292]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 p-1 text-[#929292] hover:text-[#000000]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Repeat Password (Signup only) */}
            {mode === 'signup' && (
              <div className="relative">
                <input
                  type={showRepeatPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                  className="w-full px-0 py-2 pr-8 bg-transparent border-0 border-b border-[#000000] text-[#000000] focus:outline-none focus:border-[#002498] placeholder:text-[#929292]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute right-0 top-2 p-1 text-[#929292] hover:text-[#000000]"
                >
                  {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {mode === 'login' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading || !email}
                  className="text-[12px] text-[#002498] hover:text-[#001876] disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  FORGOT PASSWORD
                </button>
              </div>
            )}

            {/* Email Consent Checkbox (Signup only) */}
            {mode === 'signup' && (
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agreeToEmails"
                  checked={agreeToEmails}
                  onChange={(e) => setAgreeToEmails(e.target.checked)}
                  className="mt-1 w-4 h-4 border-[#000000] rounded"
                />
                <label
                  htmlFor="agreeToEmails"
                  className="text-[12px] text-[#000000]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  I agree to receive emails from The Lone Screen
                </label>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || (mode === 'signup' && !agreeToEmails)}
                className="w-full rounded-md bg-[#1E1E1E] px-6 py-4 text-center font-medium text-[#FFFFFF] hover:bg-[#000000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
              >
                {loading ? (mode === 'login' ? 'Logging in...' : 'Creating account...') : (mode === 'login' ? 'Log In' : 'Join')}
              </button>
            </div>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError(null)
              }}
              className="text-[12px] text-[#002498] hover:text-[#001876] uppercase"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              {mode === 'login' ? 'Join instead' : 'Log in instead'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

