'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import type { Ticket } from '@/types/database'

interface PurchaseHistoryNewProps {
  tickets: (Ticket & {
    premiere?: {
      id: string
      premiere_date: string
      ticket_price: number
      film?: {
        title: string
        director?: string
      }
    }
  })[]
}

export default function PurchaseHistoryNew({ tickets }: PurchaseHistoryNewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(tickets.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTickets = tickets.slice(startIndex, endIndex)

  if (tickets.length === 0) {
    return (
      <p 
        className="text-[14px] text-[#585858]"
        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
      >
        No purchase history yet.
      </p>
    )
  }

  // Generate a masked transaction ID from ticket ID
  const getMaskedTransactionId = (ticketId: string) => {
    const last4 = ticketId.slice(-4)
    return `****${last4}`
  }

  return (
    <div className="space-y-0">
      {currentTickets.map((ticket, index) => {
        const premiere = ticket.premiere
        if (!premiere) return null

        const film = premiere.film as any
        const purchaseDate = new Date(ticket.purchase_date)
        const maskedId = getMaskedTransactionId(ticket.id)

        return (
          <div key={ticket.id}>
            <div className="flex items-start justify-between py-4">
              <div className="flex-1">
                <p
                  className="text-[14px] text-[#000000] mb-1"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                >
                  Ticket for {film?.title || 'Unknown Film'} premiere
                </p>
                <p
                  className="text-[12px] text-[#585858]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  {maskedId}
                </p>
              </div>
              <div className="text-right ml-4">
                <p
                  className="text-[14px] text-[#FF383C] mb-1"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                >
                  -${(premiere.ticket_price / 100).toFixed(2)}
                </p>
                <p
                  className="text-[12px] text-[#585858]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  {format(purchaseDate, 'yy.MM.dd HH:mm')}
                </p>
              </div>
            </div>
            {index < currentTickets.length - 1 && (
              <div className="border-t border-dashed border-[#DCDCDC]" />
            )}
          </div>
        )
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-[12px] text-[#000000] hover:text-[#002498] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            &lt;
          </button>
          <span
            className="text-[12px] text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="text-[12px] text-[#000000] hover:text-[#002498] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

