import Link from 'next/link'
import TopLeftTimer from '@/components/TopLeftTimer'
import { getUpcomingPremiere } from '@/lib/premieres'
import FAQ from '@/components/FAQ'
import ContactFormAbout from '@/components/ContactFormAbout'

export default async function AboutPage() {
  const upcomingPremiere = await getUpcomingPremiere()
  const upcomingPremiereDate = upcomingPremiere?.premiere_date
  const lobbyOpenTime = upcomingPremiereDate
    ? new Date(new Date(upcomingPremiereDate).getTime() - 15 * 60 * 1000).toISOString()
    : undefined

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      <div className="mx-auto max-w-4xl px-6 py-4 sm:px-8 lg:px-12">
        {/* Top Left Timer */}
        {upcomingPremiereDate && (
          <div className="mb-4">
            <TopLeftTimer targetDate={upcomingPremiereDate} lobbyOpenTime={lobbyOpenTime} />
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="mb-4">
          <Link
            href="/"
            className="text-[12px] text-[#929292] hover:text-[#000000] transition-colors"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            Home
          </Link>
          <span
            className="text-[12px] text-[#929292] mx-2"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            /
          </span>
          <span
            className="text-[12px] text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
          >
            About
          </span>
        </nav>

        {/* Main Content */}
        <div className="bg-[#F2F0EA]">
          {/* Title and Subtitle */}
          <div className="mb-4">
            <h1
              className="text-[48px] font-bold text-[#000000] mb-2"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: '56px',
              }}
            >
              The Lone Screen
            </h1>
            <p
              className="text-[14px] text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              is a one-night-only online movie premiere experience.
            </p>
          </div>

          {/* Dotted Separator */}
          <div className="border-t-2 border-dashed border-[#000000] mb-4"></div>

          {/* Introduction Paragraphs */}
          <div
            className="space-y-3 mb-4 text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            <p>
              Every week, we will <Link href="/" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">showcase</Link> a new, unreleased film at a <Link href="/" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">specific time</Link>. After the film, you&apos;ll get access to <Link href="/forum" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">exclusive features</Link>: discussion forums, director Q&As, and some really <Link href="/forum" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">cool merch</Link>.
            </p>
            <p>
              The goal? Put a spotlight on some <Link href="/" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">really great films</Link> that you won&apos;t immediately find <Link href="/" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">anywhere else</Link> - all while building a <Link href="/forum" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">community</Link> around movies.
            </p>
            <p>
              We want you to be the ones to decide which movies <Link href="/forum" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">get buzz</Link>.
            </p>
          </div>

          {/* Dotted Separator */}
          <div className="border-t-2 border-dashed border-[#000000] mb-4"></div>

          {/* "All you have to do" Section */}
          <div className="bg-[#002498] border-2 border-dashed border-[#FFFFFF] p-4 mb-4">
            <h2
              className="text-[20px] font-bold text-[#FFFFFF] mb-3"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: '28px',
              }}
            >
              All you have to do
            </h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li
                className="text-[12px] text-[#FFFFFF]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Grab a ticket before they sell out - this is not an unlimited situation, folks.
              </li>
              <li
                className="text-[12px] text-[#FFFFFF]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Show up on time - there&apos;s no pausing or rewinding or replaying. We&apos;re doing this together.
              </li>
            </ol>
          </div>

          {/* Dotted Separator */}
          <div className="border-t-2 border-dashed border-[#000000] mb-4"></div>

          {/* FAQ Section */}
          <div className="mb-4">
            <FAQ />
          </div>

          {/* Dotted Separator */}
          <div className="border-t-2 border-dashed border-[#000000] mb-4"></div>

          {/* Contact Section */}
          <div className="mb-8">
            <h2
              className="text-[36px] font-bold text-[#000000] mb-4"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: '44px',
              }}
            >
              Contact us
            </h2>
            <ContactFormAbout />
          </div>
        </div>
      </div>
    </div>
  )
}

