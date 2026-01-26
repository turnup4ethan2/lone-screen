'use client'

import { useEffect, useState } from 'react'

interface TopLeftTimerProps {
  targetDate: string // ISO date string
  isLobbyOpen?: boolean // Whether the lobby is open (15 min before premiere)
}

export default function TopLeftTimer({ targetDate, isLobbyOpen = false }: TopLeftTimerProps) {
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

      // Format: HH:MM:SS or DD:HH:MM:SS
      if (days > 0) {
        setTimeRemaining(`${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    // Update immediately
    updateTimer()
    
    // Then update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const wrapperClasses =
    'inline-flex items-center justify-center border-2 border-dashed border-[#FFFFFF] bg-[#000000] px-6 py-2 min-w-[260px]'
  const textClasses = 'text-[12px] text-[#FFFFFF] tracking-tight'

  if (isPast) {
    return (
      <div className={wrapperClasses}>
        <p
          className={textClasses}
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
        >
          Premiere has started!
        </p>
      </div>
    )
  }

  return (
    <div className={wrapperClasses}>
      <p
        className={textClasses}
        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
      >
        {isLobbyOpen ? `Premiere in ${timeRemaining} - Lobby Open` : `Next premiere in ${timeRemaining}`}
      </p>
    </div>
  )
}

