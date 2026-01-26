import Link from 'next/link'
import TopLeftTimer from '@/components/TopLeftTimer'
import { getUpcomingPremiere } from '@/lib/premieres'

export default async function TermsPage() {
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
            Terms of Use
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
              Terms of Use
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

          {/* Terms Content */}
          <div
            className="text-[#000000] space-y-6 mb-16"
            style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '24px', letterSpacing: '-4%' }}
          >
            <p>
              The website located at <a href="https://thelonescreen.com" className="text-[#002498] hover:underline">https://thelonescreen.com</a> (the &quot;Site&quot;) and the services provided through the Site (collectively, the &quot;Services&quot;) are owned and operated by The Lone Screen LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>

            <p>
              These Terms of Use (&quot;Terms&quot;) are a legally binding agreement between you and The Lone Screen LLC governing your access to and use of the Services. By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, you may not use the Services. You must be at least 18 years old to use the Services.
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
                1. Scope of Terms
              </h2>
              <p>
                These Terms apply to all users of the Services, including visitors, registered users, ticket purchasers, merchandise purchasers, and participants in interactive features (&quot;Users&quot;). These Terms incorporate by reference our Privacy Policy and any additional guidelines posted on the Site.
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
                2. Description of Services
              </h2>
              <p>
                The Lone Screen provides an eventized streaming platform offering time-limited film screenings, interactive discussion features, and merchandise sales. Films are licensed from third-party rights holders for limited exhibition, and The Lone Screen does not own such films.
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
                3. Eligibility and Accounts
              </h2>
              <p>
                You must be at least 18 years old to use the Services. Certain features require account registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
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
                4. License to Use the Services
              </h2>
              <p>
                Subject to your compliance with these Terms, The Lone Screen grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Services for your personal, non-commercial use. Except as expressly permitted, you may not copy, modify, distribute, sell, lease, reverse engineer, or attempt to extract the source code of the Services or any content made available through them.
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
                5. Purchases, Fees, and Refunds
              </h2>
              <p className="mb-2">
                The Lone Screen may charge fees for tickets, merchandise, or other Services. Prices are displayed at the time of purchase and are subject to change. All ticket sales are final unless otherwise stated.
              </p>
              <p className="mb-2">
                No refunds are generally offered for missed streaming events, technical issues beyond our control, or changes in personal circumstances due to their time-limited nature. Merchandise refund or exchange policies will be disclosed at the point of sale.
              </p>
              <p>
                Payments are processed by third-party providers like Stripe, and full payment card details are not stored.
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
                6. User Content, Ratings, and Reviews
              </h2>
              <p className="mb-2">
                The Services may allow users to post comments, ratings, reviews, or other content (&quot;User Content&quot;). By submitting User Content, you grant The Lone Screen a worldwide, perpetual, irrevocable, royalty-free license to use, display, reproduce, distribute, and modify such content in connection with the Services.
              </p>
              <p className="mb-2">
                User Content must be respectful and relevant. You agree not to post content that is unlawful, defamatory, obscene, harassing, hateful, infringing, or misleading, or that contains spoilers presented in bad faith.
              </p>
              <p>
                The Lone Screen reserves the right to remove or moderate User Content at its discretion.
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
                7. Intellectual Property
              </h2>
              <p>
                All Site content, trademarks, and branding are owned by or licensed to The Lone Screen LLC. Films are owned by third-party filmmakers or rights holders and are licensed for limited exhibition only.
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
                8. Prohibited Conduct
              </h2>
              <p>
                You agree not to violate applicable laws, infringe intellectual property rights, interfere with the Services, attempt to record or redistribute streamed films, or engage in abusive or harmful conduct.
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
                9. Disclaimers
              </h2>
              <p>
                The Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. The Lone Screen does not guarantee uninterrupted or error-free access.
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
                10. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, The Lone Screen LLC shall not be liable for indirect, incidental, consequential, or punitive damages arising from the use of the Services.
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
                11. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless The Lone Screen LLC from claims arising out of your use of the Services or violation of these Terms.
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
                12. Arbitration and Governing Law
              </h2>
              <p className="mb-2">
                Any disputes shall be resolved by binding arbitration in Texas under the rules of the American Arbitration Association. These Terms are governed by Texas law.
              </p>
              <p>
                You waive any right to participate in a class action.
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
                13. Contact
              </h2>
              <p>
                Questions about these Terms may be sent to the email address: <a href="mailto:thelonescreen@gmail.com" className="text-[#002498] hover:underline">thelonescreen@gmail.com</a>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

