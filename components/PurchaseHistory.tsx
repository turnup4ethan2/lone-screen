'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import type { Ticket } from '@/types/database'

interface PurchaseHistoryProps {
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

export default function PurchaseHistory({ tickets }: PurchaseHistoryProps) {
  if (tickets.length === 0) {
    return (
      <p className="text-gray-600">No purchase history yet.</p>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const premiere = ticket.premiere
        if (!premiere) return null

        const film = premiere.film as any
        const purchaseDate = new Date(ticket.purchase_date)
        const premiereDate = new Date(premiere.premiere_date)
        const isPast = premiereDate < new Date()

        return (
          <div
            key={ticket.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {film?.title || 'Unknown Film'}
                </h3>
                {film?.director && (
                  <p className="text-sm text-gray-600 mb-2">Directed by {film.director}</p>
                )}
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Purchased:</span>{' '}
                    {format(purchaseDate, 'MMMM d, yyyy')} at {format(purchaseDate, 'h:mm a')}
                  </p>
                  <p>
                    <span className="font-medium">Premiere:</span>{' '}
                    {format(premiereDate, 'MMMM d, yyyy')} at {format(premiereDate, 'h:mm a')}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> ${(premiere.ticket_price / 100).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={
                      ticket.status === 'active' ? 'text-green-600' :
                      ticket.status === 'cancelled' ? 'text-orange-600' :
                      'text-red-600'
                    }>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="ml-4">
                {isPast && ticket.status === 'active' ? (
                  <Link
                    href={`/forum/${premiere.id}`}
                    className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Go to Forum
                  </Link>
                ) : !isPast && ticket.status === 'active' ? (
                  <Link
                    href={`/lobby/${premiere.id}`}
                    className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Go to Lobby
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

