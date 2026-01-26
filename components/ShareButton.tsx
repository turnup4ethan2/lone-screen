'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Watch ${title} on The Lone Screen`,
          url: url,
        })
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy link')
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 border-2 border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] px-4 py-2 hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors"
      style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
    >
      Share <Share2 size={16} />
    </button>
  )
}

