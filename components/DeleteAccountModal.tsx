'use client'

import { X } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, isDeleting }: DeleteAccountModalProps) {
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
          className="relative bg-white border-2 border-dashed border-black p-8 max-w-md w-full mx-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            aria-label="Close"
            disabled={isDeleting}
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
            Are you sure?
          </h2>

          {/* Message */}
          <p
            className="text-[14px] text-[#000000] mb-6"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            YOU WANT TO{' '}
            <span className="text-[#FF383C] font-bold">DELETE YOUR ACCOUNT</span>
            , THIS ACTION CANNOT BE UNDONE.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 rounded-md border-2 border-[#002498] bg-white px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#002498] hover:text-white transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              No, cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-md bg-[#002498] px-6 py-4 text-center font-medium text-white hover:bg-[#001876] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

