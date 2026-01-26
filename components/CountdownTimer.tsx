'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string // ISO date string
  variant?: 'light' | 'dark' // For light or dark backgrounds
}

export default function CountdownTimer({ targetDate, variant = 'light' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState('')
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const target = new Date(targetDate)
      const now = new Date()
      
      if (now >= target) {
        setIsPast(true)
        setTimeRemaining('Premiere has started!')
        return
      }

      const distance = target.getTime() - now.getTime()
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Format for yellow ticket card: MM:SS when under 15 minutes
      if (variant === 'dark' && minutes < 15 && hours === 0 && days === 0) {
        setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        // Format as HH:MM:SS for lobby
        setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    // Update immediately
    updateTimer()
    
    // Then update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (isPast) {
    return (
      <span className="text-[16px] text-[#000000] font-bold" style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}>
        Premiere has started!
      </span>
    )
  }

  return (
    <span className={`text-[16px] font-bold ${variant === 'dark' ? 'text-[#000000]' : 'text-[#000000]'}`} style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '28px', letterSpacing: '-4%' }}>
      {timeRemaining}
    </span>
  )
}

