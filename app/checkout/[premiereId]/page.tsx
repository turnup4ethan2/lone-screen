import { getUpcomingPremiere, checkTicketAvailability, getUserTicket } from '@/lib/premieres'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CheckoutForm from '@/components/CheckoutForm'
import { format } from 'date-fns'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ premiereId: string }>
}) {
  const { premiereId } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login?redirect=/checkout/' + premiereId)
  }

  const premiere = await getUpcomingPremiere()
  if (!premiere || premiere.id !== premiereId) {
    redirect('/')
  }

  // Check if user already has a ticket
  const existingTicket = await getUserTicket(premiereId, user.id)
  if (existingTicket) {
    redirect(`/lobby/${premiereId}`)
  }

  // Check availability
  const availability = await checkTicketAvailability(premiereId)
  if (!availability.available) {
    redirect('/?soldout=true')
  }

  const film = premiere.film as any
  const premiereDate = new Date(premiere.premiere_date)

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{film.title}</span>
                  <span className="font-medium">${(premiere.ticket_price / 100).toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {format(premiereDate, 'EEEE, MMMM d, yyyy')} at {format(premiereDate, 'h:mm a')}
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(premiere.ticket_price / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Stripe Checkout */}
            <CheckoutForm premiereId={premiereId} amount={premiere.ticket_price} />
          </div>
        </div>
      </div>
    </div>
  )
}

