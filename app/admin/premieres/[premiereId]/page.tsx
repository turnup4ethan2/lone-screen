import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PremiereForm from '@/components/admin/PremiereForm'
import DeletePremiereButton from '@/components/admin/DeletePremiereButton'
import StripeProductInfo from '@/components/admin/StripeProductInfo'

export default async function EditPremierePage({
  params,
}: {
  params: Promise<{ premiereId: string }>
}) {
  const { premiereId } = await params
  const supabase = await createClient()

  // Get the premiere with film info
  const { data: premiere, error } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(*)
    `)
    .eq('id', premiereId)
    .single()

  if (error || !premiere) {
    notFound()
  }

  // Get all films for the dropdown
  const { data: films } = await supabase
    .from('films')
    .select('*')
    .order('title', { ascending: true })

  const film = premiere.film as any

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Premiere</h1>
        <DeletePremiereButton
          premiereId={premiere.id}
          premiereTitle={film?.title || 'Unknown Film'}
        />
      </div>
      
      {/* Stripe Product Info */}
      <div className="mb-6">
        <StripeProductInfo
          stripeProductId={premiere.stripe_product_id}
          premiereId={premiere.id}
          filmTitle={film?.title || 'Unknown Film'}
        />
      </div>
      
      <PremiereForm premiere={premiere} films={films || []} />
    </div>
  )
}

