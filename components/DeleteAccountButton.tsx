'use client'

import { useState } from 'react'
import DeleteAccountModal from './DeleteAccountModal'

export default function DeleteAccountButton() {
  const [showModal, setShowModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

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
      console.error('Failed to delete account:', err)
      setIsDeleting(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="rounded-md border-2 border-[#002498] bg-white px-6 py-3 text-[#002498] hover:bg-[#002498] hover:text-white transition-colors"
        style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
      >
        Delete My Account
      </button>

      <DeleteAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}

