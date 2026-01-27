'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'

interface LocalTimeProps {
  isoString: string
  formatString: string
  uppercase?: boolean
}

export default function LocalTime({ isoString, formatString, uppercase = false }: LocalTimeProps) {
  const text = useMemo(() => {
    try {
      const date = new Date(isoString)
      const formatted = format(date, formatString)
      return uppercase ? formatted.toUpperCase() : formatted
    } catch {
      return ''
    }
  }, [isoString, formatString, uppercase])

  return <>{text}</>
}


