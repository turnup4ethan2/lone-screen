'use client'

import { useState } from 'react'

export default function FilmmakerApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    film_title: '',
    directors: '',
    producers: '',
    writers: '',
    genre: '',
    film_synopsis: '',
    release_year: '',
    runtime: '',
    language: '',
    rights_availability: true,
    key_cast: '',
    film_trailer_link: '',
    film_trailer_file: null as File | null,
    film_trailer_file_url: '',
    additional_info: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim() || !formData.film_title.trim() || 
          !formData.directors.trim() || !formData.producers.trim() || !formData.writers.trim() || 
          !formData.genre.trim()) {
        throw new Error('Please fill in all required fields')
      }

      // Use file URL if uploaded, otherwise use link
      const screenerLink = formData.film_trailer_file_url || formData.film_trailer_link.trim() || null

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'filmmaker_application',
          name: formData.name.trim(),
          email: formData.email.trim(),
          film_title: formData.film_title.trim(),
          screener_link: screenerLink,
          message: `Filmmaker Application Details:
Phone: ${formData.phone.trim() || 'N/A'}
Directors: ${formData.directors.trim()}
Producers: ${formData.producers.trim()}
Writers: ${formData.writers.trim()}
Genre: ${formData.genre.trim()}
Film Synopsis: ${formData.film_synopsis.trim() || 'N/A'}
Release Year: ${formData.release_year.trim() || 'N/A'}
Runtime: ${formData.runtime.trim() || 'N/A'}
Language: ${formData.language.trim() || 'N/A'}
Rights Availability: ${formData.rights_availability ? 'Yes' : 'No'}
Key Cast: ${formData.key_cast.trim() || 'N/A'}
Additional Info: ${formData.additional_info.trim() || 'N/A'}`,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit application')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        film_title: '',
        directors: '',
        producers: '',
        writers: '',
        genre: '',
        film_synopsis: '',
        release_year: '',
        runtime: '',
        language: '',
        rights_availability: true,
        key_cast: '',
        film_trailer_link: '',
        film_trailer_file: null,
        film_trailer_file_url: '',
        additional_info: '',
      })
      
      setTimeout(() => {
        setSuccess(false)
      }, 8000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'filmmaker-submissions')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload file')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, film_trailer_file_url: data.publicUrl }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, film_trailer_file: file }))
      handleFileUpload(file)
    }
  }

  const Separator = () => (
    <div className="flex items-center gap-2 my-4">
      <div className="flex-1 border-t-2 border-dashed border-[#000000]"></div>
      <span
        className="text-[#000000]"
        style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
      >
        #
      </span>
      <div className="flex-1 border-t-2 border-dashed border-[#000000]"></div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CONTACTS Section */}
      <div>
        <h3
          className="text-[16px] font-bold text-[#000000] mb-4 uppercase"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
        >
          CONTACTS:
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Name<span className="text-[#FF383C]">*</span>:
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Email Address<span className="text-[#FF383C]">*</span>:
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Phone number:
            </label>
            <div className="flex items-center gap-2">
              <span
                className="text-[14px] text-[#000000]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                +1
              </span>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone"
                className="flex-1 px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* FILM INFO Section */}
      <div>
        <h3
          className="text-[16px] font-bold text-[#000000] mb-4 uppercase"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
        >
          FILM INFO:
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="film_title"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Film Title<span className="text-[#FF383C]">*</span>:
            </label>
            <input
              type="text"
              id="film_title"
              required
              value={formData.film_title}
              onChange={(e) => setFormData({ ...formData, film_title: e.target.value })}
              placeholder="Enter Title"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label
              htmlFor="directors"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Director(s)<span className="text-[#FF383C]">*</span>:
            </label>
            <input
              type="text"
              id="directors"
              required
              value={formData.directors}
              onChange={(e) => setFormData({ ...formData, directors: e.target.value })}
              placeholder="Enter"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label
              htmlFor="producers"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Producer(s)<span className="text-[#FF383C]">*</span>:
            </label>
            <input
              type="text"
              id="producers"
              required
              value={formData.producers}
              onChange={(e) => setFormData({ ...formData, producers: e.target.value })}
              placeholder="Enter"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label
              htmlFor="writers"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Writer(s)<span className="text-[#FF383C]">*</span>:
            </label>
            <input
              type="text"
              id="writers"
              required
              value={formData.writers}
              onChange={(e) => setFormData({ ...formData, writers: e.target.value })}
              placeholder="Enter"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label
              htmlFor="genre"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Genre<span className="text-[#FF383C]">*</span>:
            </label>
            <input
              type="text"
              id="genre"
              required
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              placeholder="Enter Genre"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label
              htmlFor="film_synopsis"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Film synopsis:
            </label>
            <input
              type="text"
              id="film_synopsis"
              value={formData.film_synopsis}
              onChange={(e) => setFormData({ ...formData, film_synopsis: e.target.value })}
              placeholder="Enter"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="release_year"
                className="block text-[14px] font-bold text-[#000000] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Release year:
              </label>
              <input
                type="text"
                id="release_year"
                value={formData.release_year}
                onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                placeholder="Enter"
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
            </div>

            <div>
              <label
                htmlFor="runtime"
                className="block text-[14px] font-bold text-[#000000] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Runtime:
              </label>
              <input
                type="text"
                id="runtime"
                value={formData.runtime}
                onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                placeholder="Enter"
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Language:
            </label>
            <input
              type="text"
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              placeholder="Enter"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.rights_availability}
                onChange={(e) => setFormData({ ...formData, rights_availability: e.target.checked })}
                className="w-4 h-4 border-2 border-[#000000] rounded focus:ring-2 focus:ring-[#002498]"
              />
              <span
                className="text-[14px] font-bold text-[#000000]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Rights availability<span className="text-[#FF383C]">*</span>:
              </span>
            </label>
          </div>

          <div>
            <label
              htmlFor="key_cast"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Key Cast:
            </label>
            <input
              type="text"
              id="key_cast"
              value={formData.key_cast}
              onChange={(e) => setFormData({ ...formData, key_cast: e.target.value })}
              placeholder="List the cast"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* FILES Section */}
      <div>
        <h3
          className="text-[16px] font-bold text-[#000000] mb-4 uppercase"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
        >
          FILES:
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="film_trailer"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Film trailer:
            </label>
            <div className="flex items-center gap-2 mb-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="video/*,.mp4,.mov,.avi,.mkv"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <span
                  className={`inline-block px-4 py-2 border-2 border-[#000000] rounded-md text-[#000000] hover:bg-[#F2F0EA] transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '12px', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  {isUploading ? 'UPLOADING...' : formData.film_trailer_file_url ? 'FILE ATTACHED ✓' : 'ATTACH FILE'}
                </span>
              </label>
              {formData.film_trailer_file && !formData.film_trailer_file_url && (
                <span
                  className="text-[12px] text-[#929292]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  {formData.film_trailer_file.name}
                </span>
              )}
            </div>
            <input
              type="url"
              id="film_trailer_link"
              value={formData.film_trailer_link}
              onChange={(e) => setFormData({ ...formData, film_trailer_link: e.target.value })}
              placeholder="Link to Film: Enter link"
              className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
            {formData.film_trailer_file_url && (
              <p
                className="mt-2 text-[12px] text-[#00C853]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                File uploaded successfully
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="additional_info"
              className="block text-[14px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Additional Info:
            </label>
            <div className="relative">
              <textarea
                id="additional_info"
                rows={6}
                maxLength={500}
                value={formData.additional_info}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                placeholder="Enter screenings, awards, distribution plans, your excitement about The Lone Screen."
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors resize-none"
                style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
              />
              <div className="absolute bottom-2 right-0">
                <span
                  className="text-[12px] text-[#929292]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  {formData.additional_info.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-[#FF383C]/20 border border-[#FF383C] rounded-md">
          <p
            className="text-[12px] text-[#FF383C]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-[#00C853]/20 border border-[#00C853] rounded-md">
          <p
            className="text-[12px] text-[#00C853]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            Thank you for your application! We&apos;ve received your submission and will review it carefully. We&apos;ll get back to you soon regarding next steps.
          </p>
        </div>
      )}

      <div className="flex justify-start mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#002498] px-8 py-4 text-center font-medium text-[#FFFFFF] hover:bg-[#001876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
        >
          {isSubmitting ? 'Submitting...' : 'Apply'}
        </button>
      </div>
    </form>
  )
}
