import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPurchaseConfirmationEmail } from '@/lib/email/send'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Fallback: If webhook hasn't run yet (common in local dev), create ticket here
  if (session_id) {
    try {
      const stripe = getStripeServer()
      const session = await stripe.checkout.sessions.retrieve(session_id)
      
      console.log('Stripe session:', {
        payment_status: session.payment_status,
        metadata: session.metadata,
        client_reference_id: session.client_reference_id
      })
      
      if (session.payment_status === 'paid') {
        const premiereId = session.metadata?.premiereId || session.client_reference_id
        
        console.log('Premiere ID from session:', premiereId)
        
        if (premiereId) {
          const supabase = await createClient()
          
          // Check if ticket already exists (webhook might have created it)
          const { data: existingTicket, error: checkError } = await supabase
            .from('tickets')
            .select('id')
            .eq('user_id', user.id)
            .eq('premiere_id', premiereId)
            .eq('status', 'active')
            .maybeSingle()

          console.log('Existing ticket check:', { existingTicket, checkError })

          // If no ticket exists, create it
          if (!existingTicket) {
            // Create ticket using admin client to bypass RLS
            const adminSupabase = createAdminClient()
            
            const { data: newTicket, error: ticketError } = await adminSupabase.from('tickets').insert({
              user_id: user.id,
              premiere_id: premiereId,
              stripe_payment_intent_id: session.payment_intent as string,
              status: 'active',
            }).select()

            console.log('Ticket creation:', { newTicket, ticketError })

            if (!ticketError) {
              // Increment tickets_sold using admin client
              const { data: premiere } = await adminSupabase
                .from('premieres')
                .select(`
                  tickets_sold,
                  premiere_date,
                  ticket_price,
                  film:films(*)
                `)
                .eq('id', premiereId)
                .single()

              if (premiere) {
                await adminSupabase
                  .from('premieres')
                  .update({ tickets_sold: premiere.tickets_sold + 1 })
                  .eq('id', premiereId)
                
                console.log('Updated tickets_sold for premiere:', premiereId)

                // Send purchase confirmation email (fallback)
                try {
                  const { data: profile } = await adminSupabase
                    .from('profiles')
                    .select('email, full_name')
                    .eq('id', user.id)
                    .single()

                  if (profile && premiere) {
                    const film = premiere.film as any
                    const userName = profile.full_name || profile.email.split('@')[0]

                    await sendPurchaseConfirmationEmail({
                      to: profile.email,
                      userName,
                      filmTitle: film?.title || 'Premiere',
                      premiereDate: new Date(premiere.premiere_date),
                      ticketPrice: premiere.ticket_price,
                      premiereId,
                    })
                  }
                } catch (emailError) {
                  // Log error but don't fail the page
                  console.error('Error sending purchase confirmation email:', emailError)
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error creating ticket from success page:', error)
      // Continue anyway - webhook might create it later
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your ticket has been confirmed. You'll receive an email confirmation shortly.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full rounded-md bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Return to Home
          </Link>
          <Link
            href="/my-screenings"
            className="block w-full rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            View My Screenings
          </Link>
        </div>
      </div>
    </div>
  )
}

