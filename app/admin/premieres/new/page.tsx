import { createClient } from '@/lib/supabase/server'
import PremiereForm from '@/components/admin/PremiereForm'

export default async function NewPremierePage() {
  const supabase = await createClient()

  // Get all films for the dropdown
  const { data: films } = await supabase
    .from('films')
    .select('*')
    .order('title', { ascending: true })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Premiere</h1>
      <PremiereForm films={films || []} />
    </div>
  )
}

