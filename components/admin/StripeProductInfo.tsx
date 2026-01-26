'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Check, Link as LinkIcon } from 'lucide-react'

interface StripeProductInfoProps {
  stripeProductId: string | null | undefined
  premiereId: string
  filmTitle: string
}

export default function StripeProductInfo({ stripeProductId, premiereId, filmTitle }: StripeProductInfoProps) {
  const [copied, setCopied] = useState(false)
  const [paymentLinkUrl, setPaymentLinkUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!stripeProductId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          <strong>No Stripe Product ID configured.</strong> Checkout will create a dynamic product for each purchase.
        </p>
      </div>
    )
  }

  const stripeDashboardUrl = `https://dashboard.stripe.com/products/${stripeProductId}`
  const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/${premiereId}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGeneratePaymentLink = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/premieres/${premiereId}/payment-link`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate payment link')
      }
      const data = await response.json()
      setPaymentLinkUrl(data.paymentLinkUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate payment link')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Stripe Product Configuration</h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-blue-700">Product ID:</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-900">
                {stripeProductId}
              </code>
              <button
                onClick={() => handleCopy(stripeProductId)}
                className="p-1 hover:bg-blue-100 rounded transition-colors"
                title="Copy Product ID"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-blue-600" />
                )}
              </button>
              <a
                href={stripeDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-blue-100 rounded transition-colors"
                title="Open in Stripe Dashboard"
              >
                <ExternalLink size={16} className="text-blue-600" />
              </a>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-blue-700">Checkout URL:</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-900 truncate">
                {checkoutUrl}
              </code>
              <button
                onClick={() => handleCopy(checkoutUrl)}
                className="p-1 hover:bg-blue-100 rounded transition-colors"
                title="Copy Checkout URL"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-blue-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-blue-700">Stripe Payment Link:</label>
            <div className="flex items-center gap-2 mt-1">
              {paymentLinkUrl ? (
                <>
                  <code className="flex-1 px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-900 truncate">
                    {paymentLinkUrl}
                  </code>
                  <button
                    onClick={() => handleCopy(paymentLinkUrl)}
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                    title="Copy Payment Link"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-blue-600" />
                    )}
                  </button>
                  <a
                    href={paymentLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                    title="Open Payment Link"
                  >
                    <LinkIcon size={16} className="text-blue-600" />
                  </a>
                </>
              ) : (
                <button
                  onClick={handleGeneratePaymentLink}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Payment Link'}
                </button>
              )}
            </div>
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-blue-700">
        <p className="mb-1"><strong>Note:</strong> When a Stripe Product ID is set:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Checkout will use this product instead of creating a new one</li>
          <li>You can generate a Stripe Payment Link using the button above</li>
          <li>The Payment Link will automatically grant access to this premiere upon successful payment</li>
          <li>Share the Payment Link URL directly with customers for a streamlined purchase experience</li>
        </ul>
      </div>
    </div>
  )
}

