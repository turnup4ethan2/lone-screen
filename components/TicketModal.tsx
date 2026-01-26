'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { X } from 'lucide-react'

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
  filmTitle: string
  premiereDate: string
  ticketPrice: number
  checkoutUrl: string
}

export default function TicketModal({
  isOpen,
  onClose,
  filmTitle,
  premiereDate,
  ticketPrice,
  checkoutUrl,
}: TicketModalProps) {
  if (!isOpen) return null

  const date = new Date(premiereDate)

  return (
    <>
      {/* Overlay - darkened background */}
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
          Get a ticket
        </h2>

        {/* Instructions */}
        <p
          className="text-[14px] text-[#000000] mb-6"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
        >
          VIRTUAL LOBBY OPENS 15 MINUTES BEFORE SHOWTIME, COME BACK ON TIME!
        </p>

        {/* Ticket Details */}
        <div className="space-y-3 mb-6">
          {/* PREMIERE row */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#000000]">
            <span
              className="text-[12px] text-[#000000] uppercase"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              PREMIERE
            </span>
            <span
              className="text-[16px] text-[#000000] font-bold"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              {filmTitle} #
            </span>
          </div>

          {/* DATE row */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#000000]">
            <span
              className="text-[12px] text-[#000000] uppercase"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              DATE
            </span>
            <span
              className="text-[16px] text-[#000000] uppercase"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              {format(date, 'MMMM d, yyyy').toUpperCase()} #
            </span>
          </div>

          {/* TIME row */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#000000]">
            <span
              className="text-[12px] text-[#000000] uppercase"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              TIME
            </span>
            <span
              className="text-[16px] text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}
            >
              {format(date, 'h:mm a')} #
            </span>
          </div>

          {/* TOTAL row */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#000000]">
            <span
              className="text-[12px] text-[#000000] uppercase"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              TOTAL
            </span>
            <span
              className="text-[28px] font-bold text-[#000000]"
              style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700, letterSpacing: '0px', lineHeight: '28px' }}
            >
              ${(ticketPrice / 100).toFixed(2)} #
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border-2 border-[#002498] bg-white px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#002498] hover:text-white transition-colors"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
          >
            Cancel
          </button>
          <Link
            href={checkoutUrl}
            className="flex-1 rounded-md bg-[#002498] px-6 py-4 text-center font-medium text-white hover:bg-[#001876] transition-colors"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
          >
            Claim my seat
          </Link>
        </div>
        </div>
      </div>
    </>
  )
}

