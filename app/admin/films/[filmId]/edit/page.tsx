import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FilmForm from '@/components/admin/FilmForm'
import DeleteFilmButton from '@/components/admin/DeleteFilmButton'

export default async function EditFilmPage({
  params,
}: {
  params: Promise<{ filmId: string }>
}) {
  const { filmId } = await params
  const supabase = await createClient()

  const { data: film, error } = await supabase
    .from('films')
    .select(`
      *,
      premieres(id)
    `)
    .eq('id', filmId)
    .single()

  if (error || !film) {
    notFound()
  }

  const premiereCount = Array.isArray(film.premieres) ? film.premieres.length : 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Film</h1>
        <DeleteFilmButton
          filmId={film.id}
          filmTitle={film.title}
          premiereCount={premiereCount}
        />
      </div>
      <FilmForm film={film} />
    </div>
  )
}

