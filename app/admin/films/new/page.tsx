import FilmForm from '@/components/admin/FilmForm'

export default function NewFilmPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Film</h1>
      <FilmForm />
    </div>
  )
}

