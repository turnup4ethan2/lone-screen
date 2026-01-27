import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-[#F2F0EA]">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <p
            className="text-[12px] text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            {year}, The Lone Screen © All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/terms"
              className="text-[12px] text-[#000000] hover:text-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              TERMS OF USE
            </Link>
            <span
              className="text-[12px] text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              {'>'}
            </span>
            <Link
              href="/privacy"
              className="text-[12px] text-[#000000] hover:text-[#002498] transition-colors"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              PRIVACY POLICY
            </Link>
            <span
              className="text-[12px] text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
            >
              {'>'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

