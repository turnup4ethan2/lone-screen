'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

const faqItems: FAQItem[] = [
  {
    question: 'How do the tickets work?',
    answer: (
      <>
        You can buy a ticket on our <Link href="/" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">home page here</Link>, or on our <Link href="/my-screenings" className="font-bold text-[#000000] hover:text-[#002498] transition-colors">upcoming screenings page here</Link>. Tickets will be priced at $10 before we release any information about the movie. Every Sunday, we will announce what the next week&apos;s movie will be and some key details (director, cast, poster, genre, duration) - once we release this info, tickets will be $20. Take a bet on the experience! It&apos;ll be fun, we promise.
      </>
    ),
  },
  {
    question: 'How many tickets will you sell each week?',
    answer: 'This will vary based on the filmmaker\'s goals. We will have a minimum of 1,000 tickets and a maximum of 50,000 tickets.',
  },
  {
    question: 'What if a movie sells out?',
    answer: 'If a movie sells out, you\'ll see a "Sold Out" status on the ticket card. Unfortunately, we cannot add more tickets once a screening reaches capacity. We recommend purchasing tickets early, especially during the $10 early-bird pricing period, to secure your spot.',
  },
  {
    question: 'What if I can\'t make the movie I bought a ticket for?',
    answer: 'All ticket sales are final. Due to the time-limited, eventized nature of our screenings, we cannot offer refunds for missed events. We recommend marking your calendar and setting reminders. The lobby opens 15 minutes before showtime, so you\'ll have time to get settled.',
  },
  {
    question: 'How will I know the movie is good?',
    answer: 'We curate films from talented independent filmmakers and carefully select each premiere. While we can\'t guarantee you\'ll love every film, we focus on quality storytelling and unique perspectives. After each screening, you can rate the film and join discussions in our forum to share your thoughts with the community.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null) // No items open by default

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-0">
      {faqItems.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between py-3 text-left hover:bg-[#F2F0EA] transition-colors"
          >
            <span
              className="text-[16px] font-bold text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
            >
              {item.question}
            </span>
            {openIndex === index ? (
              <Minus size={20} className="text-[#000000] flex-shrink-0 ml-4" />
            ) : (
              <Plus size={20} className="text-[#000000] flex-shrink-0 ml-4" />
            )}
          </button>
          {openIndex === index && (
            <div
              className="pb-3 text-[#000000]"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '13px', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              {typeof item.answer === 'string' ? item.answer : item.answer}
            </div>
          )}
          {index < faqItems.length - 1 && (
            <div className="border-t-2 border-dashed border-[#000000]"></div>
          )}
        </div>
      ))}
    </div>
  )
}

