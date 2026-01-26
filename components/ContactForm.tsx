'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactForm() {
  const router = useRouter()
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
      
      // Reset success message after 5 seconds
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
      <div>
        <label
          htmlFor="name"
          className="block text-[14px] font-bold text-[#000000] mb-2"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
        >
          Name <span className="text-[#FF383C]">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-[#929292] rounded-md bg-[#FFFFFF] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#002498] focus:border-[#002498] transition-colors"
          style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-[14px] font-bold text-[#000000] mb-2"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
        >
          Email <span className="text-[#FF383C]">*</span>
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-[#929292] rounded-md bg-[#FFFFFF] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#002498] focus:border-[#002498] transition-colors"
          style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-[14px] font-bold text-[#000000] mb-2"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
        >
          Message <span className="text-[#FF383C]">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={8}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3 py-2 border border-[#929292] rounded-md bg-[#FFFFFF] text-[#000000] placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#002498] focus:border-[#002498] transition-colors resize-y"
          style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          placeholder="Tell us what's on your mind..."
        />
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-[#000000] text-[#FFFFFF] rounded-md hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', lineHeight: '28px', letterSpacing: '-4%' }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

