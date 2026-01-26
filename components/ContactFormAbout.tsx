'use client'

import { useState } from 'react'

export default function ContactFormAbout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        throw new Error('All fields are required')
      }

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact_us',
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit form')
      }

      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-[14px] font-bold text-[#000000] mb-2"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
        >
          Tell us about your subject...:
        </label>
        <div className="relative">
          <textarea
            id="message"
            required
            rows={6}
            maxLength={500}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter"
            className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-[#000000] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:border-[#002498] transition-colors resize-none"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          />
          <div className="absolute bottom-2 right-0">
            <span
              className="text-[12px] text-[#929292]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              {formData.message.length}/500
            </span>
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
            Thank you for contacting us! We&apos;ll get back to you as soon as possible.
          </p>
        </div>
      )}

      <div className="flex justify-start">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#002498] px-8 py-4 text-center font-medium text-[#FFFFFF] hover:bg-[#001876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
        >
          {isSubmitting ? 'Sending...' : 'Apply'}
        </button>
      </div>
    </form>
  )
}

