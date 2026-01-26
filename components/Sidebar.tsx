'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface SidebarProps {
  user: any
}

export default function Sidebar({ user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col gap-1.5 p-2"
        aria-label="Open menu"
      >
        <div className="h-0.5 w-6 bg-black"></div>
        <div className="h-0.5 w-6 bg-black"></div>
        <div className="h-0.5 w-6 bg-black"></div>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-[#F2F0EA] z-50 shadow-xl overflow-y-auto">
            <div className="p-6">
              {/* Header with Log Out / Close */}
              <div className="flex items-center justify-between mb-8">
                {user ? (
                  <button
                    onClick={async () => {
                      await handleSignOut()
                      setIsOpen(false)
                    }}
                    className="text-[16px] text-[#000000] hover:text-[#002498] transition-colors"
                    style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                  >
                    Log Out
                  </button>
                ) : (
                  <span className="text-[16px] text-[#000000]" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}>
                    Menu
                  </span>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-[#000000]" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mb-8">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block text-[16px] text-[#000000] hover:text-[#002498] transition-colors py-2 border-b border-dashed border-[#000000]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                >
                  * Home {'>'}
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block text-[16px] text-[#000000] hover:text-[#002498] transition-colors py-2 border-b border-dashed border-[#000000]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      * My Profile {'>'}
                    </Link>
                    <Link
                      href="/my-screenings"
                      onClick={() => setIsOpen(false)}
                      className="block text-[16px] text-[#000000] hover:text-[#002498] transition-colors py-2 border-b border-dashed border-[#000000]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      * My Screenings {'>'}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block text-[16px] text-[#000000] hover:text-[#002498] transition-colors py-2 border-b border-dashed border-[#000000]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      * Log In {'>'}
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block text-[16px] text-[#000000] hover:text-[#002498] transition-colors py-2 border-b border-dashed border-[#000000]"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                    >
                      * Sign Up {'>'}
                    </Link>
                  </>
                )}
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="block text-[16px] text-[#000000] hover:text-[#002498] transition-colors py-2"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
                >
                  * About {'>'}
                </Link>
              </nav>

              {/* Filmmaker Section */}
              <div className="border-2 border-dashed border-[#000000] p-6 mb-8">
                <p className="text-[16px] text-[#000000] mb-2 font-bold" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}>
                  Are you a filmmaker?
                </p>
                <p className="text-[14px] text-[#585858] mb-4" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}>
                  Be a part of the Lone Screen. Send us a request.
                </p>
                <Link
                  href="/filmmaker-application"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-md bg-[#000000] px-6 py-3 text-center font-medium text-[#FFFFFF] hover:bg-[#1a1a1a] transition-colors"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
                >
                  Read More
                </Link>
              </div>

              {/* Footer Links */}
              <div className="space-y-2">
                <Link
                  href="/terms"
                  onClick={() => setIsOpen(false)}
                  className="block text-[12px] text-[#585858] uppercase hover:text-[#000000] transition-colors"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  TERMS OF USE ↗
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="block text-[12px] text-[#585858] uppercase hover:text-[#000000] transition-colors"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  PRIVACY POLICY ↗
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

