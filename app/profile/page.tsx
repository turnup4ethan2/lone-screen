import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileFormNew from '@/components/ProfileFormNew'
import PurchaseHistoryNew from '@/components/PurchaseHistoryNew'
import DeleteAccountButton from '@/components/DeleteAccountButton'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/profile')
  }

  const supabase = await createClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get purchase history (tickets) with premiere and film info
  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('purchase_date', { ascending: false })

  // Fetch premiere and film info for each ticket
  const ticketsWithPremieres = await Promise.all(
    (tickets || []).map(async (ticket) => {
      const { data: premiere } = await supabase
        .from('premieres')
        .select(`
          *,
          film:films(*)
        `)
        .eq('id', ticket.premiere_id)
        .single()

      return {
        ...ticket,
        premiere: premiere || null
      }
    })
  )

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-[12px] text-[#585858] hover:text-[#000000] transition-colors"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            Home
          </Link>
          <span
            className="text-[12px] text-[#585858] mx-2"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            /
          </span>
          <span
            className="text-[12px] text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            My Account
          </span>
        </div>

        {/* Page Title */}
        <h1
          className="text-[56px] font-bold text-[#000000] mb-8"
          style={{
            fontFamily: 'Instrument Sans, sans-serif',
            fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: '44px',
          }}
        >
          My account
        </h1>

        <div className="space-y-12">
          {/* Account Info Section */}
          <section>
            <ProfileFormNew 
              profile={profile || null}
              email={user.email || ''}
            />
          </section>

          {/* Transaction History Section */}
          <section className="pt-8 border-t border-dashed border-[#DCDCDC]">
            <h2
              className="text-[56px] font-bold text-[#000000] mb-8"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: '44px',
              }}
            >
              Transaction history
            </h2>
            <PurchaseHistoryNew tickets={ticketsWithPremieres || []} />
            
            {/* Delete Account Button */}
            <div className="pt-8">
              <DeleteAccountButton />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
