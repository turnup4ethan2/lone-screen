import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import DeleteFilmButton from '@/components/admin/DeleteFilmButton'

export default async function AdminFilmsPage() {
  const supabase = await createClient()

  // Get all films with premiere counts
  const { data: films } = await supabase
    .from('films')
    .select(`
      *,
      premieres(id)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Films</h1>
        <Link
          href="/admin/films/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Create New Film
        </Link>
      </div>

      {films && films.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {films.map((film) => {
            const premiereCount = Array.isArray(film.premieres) ? film.premieres.length : 0

            return (
              <div
                key={film.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {film.poster_url && (
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200">
                    <Image
                      src={film.poster_url}
                      alt={film.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{film.title}</h3>
                  {film.director && (
                    <p className="text-sm text-gray-600 mb-2">Directed by {film.director}</p>
                  )}
                  {film.runtime && (
                    <p className="text-sm text-gray-500 mb-2">{film.runtime} minutes</p>
                  )}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{film.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {premiereCount} premiere{premiereCount !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/films/${film.id}/edit`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteFilmButton
                        filmId={film.id}
                        filmTitle={film.title}
                        premiereCount={premiereCount}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No films yet</p>
          <Link
            href="/admin/films/new"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Create Your First Film
          </Link>
        </div>
      )}
    </div>
  )
}

