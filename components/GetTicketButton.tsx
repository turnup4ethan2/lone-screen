'use client'

import { useState } from 'react'
import Link from 'next/link'
import TicketModal from './TicketModal'

interface GetTicketButtonProps {
  premiereId: string
  filmTitle: string
  premiereDate: string
  ticketPrice: number
  isLoggedIn: boolean
}

export default function GetTicketButton({
  premiereId,
  filmTitle,
  premiereDate,
  ticketPrice,
  isLoggedIn,
}: GetTicketButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!isLoggedIn) {
    return (
      <Link
        href="/signup"
        className="block w-full rounded-md bg-[#FFFFFF] px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#001876] hover:text-[#FFFFFF] transition-colors"
        style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
      >
        Get a Ticket →
      </Link>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block w-full rounded-md bg-[#FFFFFF] px-6 py-4 text-center font-medium text-[#002498] hover:bg-[#001876] hover:text-[#FFFFFF] transition-colors"
        style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
      >
        Get a Ticket →
      </button>
      
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filmTitle={filmTitle}
        premiereDate={premiereDate}
        ticketPrice={ticketPrice}
        checkoutUrl={`/checkout/${premiereId}`}
      />
    </>
  )
}

