'use client'

import { useState } from 'react'

interface CheckoutFormProps {
  premiereId: string
  amount: number // in cents
}

export default function CheckoutForm({ premiereId, amount }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          premiereId,
          amount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || `Error: ${response.status} ${response.statusText}`)
        setLoading(false)
        return
      }

      const { sessionId, url, error: sessionError } = await response.json()

      if (sessionError || !sessionId) {
        setError(sessionError || 'Failed to create checkout session')
        setLoading(false)
        return
      }

      // Redirect to Stripe Checkout using session URL
      // New Stripe.js API - use session.url instead of redirectToCheckout
      if (url) {
        window.location.href = url
      } else if (sessionId) {
        // Fallback: construct URL from session ID
        window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`
      } else {
        setError('No checkout URL received')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-md bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>

      <p className="mt-4 text-xs text-gray-500 text-center">
        You will be redirected to Stripe to complete your purchase
      </p>
    </div>
  )
}

