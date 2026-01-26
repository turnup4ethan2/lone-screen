import Link from 'next/link'
import TopLeftTimer from '@/components/TopLeftTimer'
import { getUpcomingPremiere } from '@/lib/premieres'

export default async function PrivacyPage() {
  const upcomingPremiere = await getUpcomingPremiere()
  const upcomingPremiereDate = upcomingPremiere?.premiere_date
  
  // Calculate if lobby is open (15 minutes before premiere)
  const isLobbyOpen = upcomingPremiereDate
    ? new Date() >= new Date(new Date(upcomingPremiereDate).getTime() - 15 * 60 * 1000)
    : false

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Top Left Timer */}
        {upcomingPremiereDate && (
          <div className="mb-6">
            <TopLeftTimer targetDate={upcomingPremiereDate} isLobbyOpen={isLobbyOpen} />
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="mb-8">
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
            Privacy Policy
          </span>
        </nav>

        {/* Main Content */}
        <div className="bg-[#F2F0EA]">
          {/* Title and Date */}
          <div className="flex items-center justify-between mb-4">
            <h1
              className="text-[48px] font-bold text-[#000000]"
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: '56px',
              }}
            >
              Privacy Policy
            </h1>
            <p
              className="text-[14px] text-[#585858]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Last Updated: December 2025
            </p>
          </div>

          {/* Dotted Separator */}
          <div className="border-t-2 border-dashed border-[#000000] mb-8"></div>

          {/* Privacy Policy Content */}
          <div
            className="text-[#000000] space-y-6 mb-16"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
          >
            <p>
              This Privacy Policy describes how The Lone Screen LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information when you use our website located at <a href="https://thelonescreen.com" className="text-[#002498] hover:underline">https://thelonescreen.com</a> (the &quot;Site&quot;) and the services provided through the Site (collectively, the &quot;Services&quot;).
            </p>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                1. Information We Collect
              </h2>
              <p className="mb-2">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Personal identifiers (name, email address)</li>
                <li>Account and ticket purchase information</li>
                <li>Payment information (processed by third parties like Stripe)</li>
                <li>IP address and device information</li>
                <li>Usage data and analytics</li>
                <li>User-generated content (comments, ratings, reviews)</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                2. How We Use Information
              </h2>
              <p className="mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide and operate the Services</li>
                <li>Process transactions and ticket purchases</li>
                <li>Communicate with you about your account and purchases</li>
                <li>Send marketing and transactional emails (with your consent)</li>
                <li>Improve the Site and user experience</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                3. Cookies and Analytics
              </h2>
              <p>
                We use cookies, Google Analytics, and similar technologies to understand how you use our Services and to improve our Site. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                4. Sharing of Information
              </h2>
              <p className="mb-2">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mb-2">
                <li>Service providers (payment processors, email platforms, analytics providers)</li>
                <li>Filmmakers and partners (aggregated and anonymized viewing and demographic data only)</li>
              </ul>
              <p className="font-bold">
                We do not sell personal information.
              </p>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                5. Marketing Communications
              </h2>
              <p>
                You can opt out of marketing emails at any time by clicking the unsubscribe link in any marketing email we send you.
              </p>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                6. Data Security
              </h2>
              <p>
                We implement reasonable administrative and technical safeguards to protect your information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                7. Children&apos;s Privacy
              </h2>
              <p>
                Our Services are intended for users 18 and older. We do not knowingly collect information from individuals under 18 years of age.
              </p>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will post any changes on this page with an updated effective date.
              </p>
            </div>

            <div>
              <h2
                className="text-[18px] font-bold text-[#000000] mb-2"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  lineHeight: '24px',
                }}
              >
                9. Contact
              </h2>
              <p>
                Questions about this Privacy Policy may be sent to the email address: <a href="mailto:thelonescreen@gmail.com" className="text-[#002498] hover:underline">thelonescreen@gmail.com</a>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

