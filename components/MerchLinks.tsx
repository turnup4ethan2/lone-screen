'use client'

import { ExternalLink } from 'lucide-react'
import type { MerchLink } from '@/types/database'

interface MerchLinksProps {
  merchLinks: MerchLink[]
  filmTitle: string
}

export default function MerchLinks({ merchLinks, filmTitle }: MerchLinksProps) {
  if (!merchLinks || merchLinks.length === 0) {
    return (
      <div className="p-6">
        <p
          className="text-[14px] text-[#929292] text-center"
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
        >
          No merch available for this film.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {merchLinks.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#FFFFFF] border-2 border-dashed border-[#000000] p-4 rounded-lg hover:bg-[#F2F0EA] transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3
                className="text-[16px] font-bold text-[#000000]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                {item.title}
              </h3>
              <ExternalLink size={16} className="text-[#000000] flex-shrink-0 ml-2" />
            </div>
            {item.description && (
              <p
                className="text-[12px] text-[#585858] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                {item.description}
              </p>
            )}
            {item.price && (
              <p
                className="text-[14px] font-bold text-[#002498]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                {item.price}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}

