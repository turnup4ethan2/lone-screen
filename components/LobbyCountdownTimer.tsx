'use client'

import { useEffect, useState } from 'react'

interface LobbyCountdownTimerProps {
  targetDate: string // ISO date string
}

export default function LobbyCountdownTimer({ targetDate }: LobbyCountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState('00:00:00')
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const target = new Date(targetDate)
      const now = new Date()
      
      if (now >= target) {
        setIsPast(true)
        setTimeRemaining('00:00:00')
        return
      }

      const distance = target.getTime() - now.getTime()
      const totalMinutes = Math.floor(distance / (1000 * 60))
      const minutes = totalMinutes % 60
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Format as MM:SS (only show minutes and seconds)
      setTimeRemaining(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }

    // Update immediately
    updateTimer()
    
    // Then update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <span className="text-[#FFFFFF]">
      {timeRemaining}
    </span>
  )
}

