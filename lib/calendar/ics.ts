import { format } from 'date-fns'

export interface CalendarEvent {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
  url?: string
}

/**
 * Generate an ICS (iCalendar) file content for a calendar event
 */
export function generateICS({
  title,
  description,
  startDate,
  endDate,
  location,
  url,
}: CalendarEvent): string {
  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatICSDate = (date: Date): string => {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }

  // Escape special characters in ICS format
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  // Generate UID (unique identifier for the event)
  const uid = `${Date.now()}-${Math.random().toString(36).substring(7)}@lonescreen.com`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Lone Screen//Premiere Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    ...(location ? [`LOCATION:${escapeICS(location)}`] : []),
    ...(url ? [`URL:${url}`] : []),
    `STATUS:CONFIRMED`,
    `SEQUENCE:0`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return ics
}

/**
 * Generate a download URL for an ICS file
 */
export function generateCalendarDownloadURL(event: CalendarEvent): string {
  const icsContent = generateICS(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  return URL.createObjectURL(blob)
}

