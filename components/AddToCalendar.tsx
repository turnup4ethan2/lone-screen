'use client'

import { useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import { generateICS } from '@/lib/calendar/ics'
import type { Premiere, Film } from '@/types/database'

interface AddToCalendarProps {
  premiere: Premiere & { film?: Film }
}

export default function AddToCalendar({ premiere }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const film = premiere.film as any
  const premiereDate = new Date(premiere.premiere_date)
  
  // Estimate end time (premiere date + film runtime, or 2 hours default)
  const runtimeMinutes = film?.runtime || 120
  const endDate = new Date(premiereDate.getTime() + runtimeMinutes * 60 * 1000)

  const description = `${film?.description || ''}\n\nPremiere on The Lone Screen - One night only screening followed by Director Q&A.`
  const appUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  const lobbyUrl = `${appUrl}/lobby/${premiere.id}`

  const event = {
    title: `${film?.title || 'Premiere'} - The Lone Screen`,
    description,
    startDate: premiereDate,
    endDate,
    location: 'The Lone Screen - Online Premiere',
    url: lobbyUrl,
  }

  const handleDownload = () => {
    const icsContent = generateICS(event)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${film?.title || 'Premiere'}-premiere.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const handleGoogleCalendar = () => {
    const googleUrl = new URL('https://calendar.google.com/calendar/render')
    googleUrl.searchParams.set('action', 'TEMPLATE')
    googleUrl.searchParams.set('text', event.title)
    googleUrl.searchParams.set('dates', `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`)
    googleUrl.searchParams.set('details', event.description)
    googleUrl.searchParams.set('location', event.location || '')
    if (event.url) {
      googleUrl.searchParams.set('sf', 'true')
      googleUrl.searchParams.set('src', event.url)
    }
    window.open(googleUrl.toString(), '_blank')
    setIsOpen(false)
  }

  const handleOutlookCalendar = () => {
    const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose')
    outlookUrl.searchParams.set('subject', event.title)
    outlookUrl.searchParams.set('startdt', event.startDate.toISOString())
    outlookUrl.searchParams.set('enddt', event.endDate.toISOString())
    outlookUrl.searchParams.set('body', event.description)
    outlookUrl.searchParams.set('location', event.location || '')
    window.open(outlookUrl.toString(), '_blank')
    setIsOpen(false)
  }

  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
      >
        <Calendar className="w-4 h-4" />
        Add to Calendar
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download .ics file
              </button>
              <button
                onClick={handleGoogleCalendar}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Google Calendar
              </button>
              <button
                onClick={handleOutlookCalendar}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Outlook Calendar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

