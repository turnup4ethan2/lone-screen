import Link from 'next/link'
import TopLeftTimer from '@/components/TopLeftTimer'
import { getUpcomingPremiere } from '@/lib/premieres'
import FilmmakerApplicationForm from '@/components/FilmmakerApplicationForm'

export default async function FilmmakerApplicationPage() {
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
            Filmmaker Application
          </span>
        </nav>

        {/* Main Content */}
        <div className="bg-[#F2F0EA]">
          {/* Main Heading */}
          <h1
            className="text-[48px] font-bold text-[#000000] mb-4"
            style={{
              fontFamily: 'Instrument Sans, sans-serif',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: '56px',
            }}
          >
            Are you a Filmmaker?
          </h1>

          {/* Introduction Paragraphs */}
          <div
            className="space-y-3 mb-4 text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            <p>
              We want to help you get the reach, buzz, and long-term success that you and your movie deserve.
            </p>
            <p className="uppercase">
              ...AND, WE THINK THAT THE CURRENT MODEL OF PREMIERES, MARKETING, AND DISTRIBUTION IS BROKEN.
            </p>
          </div>

          {/* Dotted Separator with Hash */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 border-t-2 border-dashed border-[#000000]"></div>
            <span
              className="text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              #
            </span>
            <div className="flex-1 border-t-2 border-dashed border-[#000000]"></div>
          </div>

          {/* More Introduction Text */}
          <div
            className="space-y-3 mb-4 text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            <p>
              We believe in hyper-curating, simultaneous viewing, and great community features to create a real experience around each movie premiere. Insights from the premiere (who watched, where, what they thought) to guide distribution.
            </p>
            <p>
              We will only be premiering one film a week.
            </p>
          </div>

          {/* "What are we looking for?" Blue Box */}
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
              What are we looking for?
            </h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li
                className="text-[12px] text-[#FFFFFF]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Good narrative features that will get people talking. All genres welcome!
              </li>
              <li
                className="text-[12px] text-[#FFFFFF]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                A willingness to engage with our community - participating in director Q&A is a must for us.
              </li>
              <li
                className="text-[12px] text-[#FFFFFF]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
              >
                Excitement about the work we&apos;re doing.
              </li>
            </ol>
          </div>

          {/* More Text */}
          <div
            className="space-y-3 mb-4 text-[#000000]"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
          >
            <p>
              We want to build something that works for you. We&apos;d love to hear your feedback.
            </p>
            <p>
              Financials: we&apos;ll be doing a 50/50 revenue share after we recoup marketing costs.
            </p>
          </div>

          {/* Dotted Separator with Hash */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 border-t-2 border-dashed border-[#000000]"></div>
            <span
              className="text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              #
            </span>
            <div className="flex-1 border-t-2 border-dashed border-[#000000]"></div>
          </div>

          {/* Form Section Heading */}
          <div className="mb-4">
            <h2
              className="text-[36px] font-bold text-[#000000] mb-2"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: '44px',
              }}
            >
              Sound good? Apply now.
            </h2>
            <p
              className="text-[14px] text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              We&apos;ll reach out if we think it might be a fit.
            </p>
          </div>

          {/* Form */}
          <FilmmakerApplicationForm />
        </div>
      </div>
    </div>
  )
}
