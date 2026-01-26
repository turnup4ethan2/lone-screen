'use client'

import AuthModal from '@/components/AuthModal'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setIsOpen(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      <AuthModal isOpen={isOpen} onClose={handleClose} initialMode="signup" />
    </div>
  )
}

