'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DacastPlayer from './DacastPlayer'

interface LobbyVideoPlayerProps {
  videoId: string // Initial video ID from server
  premiereDate: string
  premiereId: string
  filmId: string
  livestreamDurationHours?: number
  livestreamDurationMinutes?: number
  livestreamDurationSeconds?: number
}

export default function LobbyVideoPlayer({ 
  videoId: initialVideoId, 
  premiereDate, 
  premiereId,
  filmId,
  livestreamDurationHours = 0,
  livestreamDurationMinutes = 0,
  livestreamDurationSeconds = 0
}: LobbyVideoPlayerProps) {
  const router = useRouter()
  const [showVideo, setShowVideo] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [streamEndTime, setStreamEndTime] = useState<Date | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [isLoadingVideoId, setIsLoadingVideoId] = useState(false)
  const hasFetchedRef = useRef(false) // Track if we've already fetched
  
  // Calculate total duration in seconds
  const totalDurationSeconds = (livestreamDurationHours * 3600) + 
                                (livestreamDurationMinutes * 60) + 
                                livestreamDurationSeconds
  
  // Function to fetch the latest video ID - use useCallback to avoid stale closures
  const fetchLatestVideoId = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (hasFetchedRef.current) {
      console.log('⏭️ Already fetched video ID, skipping')
      return
    }
    
    hasFetchedRef.current = true
    setIsLoadingVideoId(true)
    
    try {
      console.log('🔄 Fetching latest video ID for premiere:', premiereId)
      const response = await fetch(`/api/premieres/${premiereId}/video-id`)
      if (response.ok) {
        const data = await response.json()
        console.log('🔄 Received video ID:', data.videoId)
        if (data.videoId) {
          setCurrentVideoId(data.videoId)
          // Only show video after we have the correct ID
          setShowVideo(true)
        } else {
          // Fallback to initial if fetch fails
          console.warn('No video ID in response, using initial:', initialVideoId)
          setCurrentVideoId(initialVideoId)
          setShowVideo(true)
        }
      } else {
        console.error('Failed to fetch video ID, using initial:', initialVideoId)
        setCurrentVideoId(initialVideoId)
        setShowVideo(true)
      }
    } catch (error) {
      console.error('Error fetching latest video ID:', error)
      // Fallback to initial if fetch fails
      setCurrentVideoId(initialVideoId)
      setShowVideo(true)
    } finally {
      setIsLoadingVideoId(false)
    }
  }, [premiereId, initialVideoId])

  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const premiere = new Date(premiereDate)
      const distance = premiere.getTime() - now.getTime()

      console.log('Time check:', {
        now: now.toISOString(),
        premiere: premiere.toISOString(),
        distance,
        showVideo
      })

      if (distance <= 0) {
        // Premiere has started - fetch the latest video ID and show video
        console.log('Premiere has started - fetching latest video ID')
        setTimeRemaining('')
        
        // Fetch the latest video ID when countdown finishes
        fetchLatestVideoId()
        
        // Calculate stream end time if duration is provided
        if (totalDurationSeconds > 0 && !streamEndTime) {
          const premiere = new Date(premiereDate)
          const endTime = new Date(premiere.getTime() + totalDurationSeconds * 1000) // Convert seconds to milliseconds
          setStreamEndTime(endTime)
          console.log('Stream will end at:', endTime.toISOString(), 
            `(${livestreamDurationHours}h ${livestreamDurationMinutes}m ${livestreamDurationSeconds}s = ${totalDurationSeconds} seconds)`)
        }
      } else {
        // Still counting down
        setShowVideo(false)
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`)
        } else {
          setTimeRemaining(`${seconds}s`)
        }
      }
    }

    // Check immediately on mount
    const now = new Date()
    const premiere = new Date(premiereDate)
    if (now >= premiere) {
      console.log('Premiere already started on mount - fetching video ID')
      setTimeRemaining('')
      // Fetch video ID immediately
      fetchLatestVideoId()
      if (totalDurationSeconds > 0 && !streamEndTime) {
        const endTime = new Date(premiere.getTime() + totalDurationSeconds * 1000) // Convert seconds to milliseconds
        setStreamEndTime(endTime)
        console.log('Stream will end at:', endTime.toISOString(),
          `(${livestreamDurationHours}h ${livestreamDurationMinutes}m ${livestreamDurationSeconds}s = ${totalDurationSeconds} seconds)`)
      }
    } else {
      checkTime()
    }

    // Then check every second
    const interval = setInterval(checkTime, 1000)

    return () => clearInterval(interval)
  }, [premiereDate, totalDurationSeconds, streamEndTime, livestreamDurationHours, livestreamDurationMinutes, livestreamDurationSeconds, fetchLatestVideoId])

  // Check if stream has ended and redirect to rating page
  useEffect(() => {
    if (!streamEndTime) return

    const checkStreamEnd = () => {
      const now = new Date()
      if (now >= streamEndTime) {
        // Stream has ended - redirect to rating page
        console.log('Stream ended - redirecting to rating page')
        router.push(`/lobby/${premiereId}/rate`)
      }
    }

    // Check every second
    const interval = setInterval(checkStreamEnd, 1000)

    return () => clearInterval(interval)
  }, [streamEndTime, premiereId, router])

  console.log('LobbyVideoPlayer render:', { showVideo, timeRemaining, videoId: currentVideoId })
  
  // Log video ID details for debugging
  useEffect(() => {
    if (showVideo) {
      console.log('🎬 VIDEO PLAYER ACTIVE:', {
        videoId: currentVideoId,
        isLiveStream: currentVideoId.includes('-live-'),
        embedUrl: currentVideoId.includes('-live-') 
          ? `https://iframe.dacast.com/live/${currentVideoId.split('-live-')[0]}/${currentVideoId.split('-live-')[1]}`
          : `https://iframe.dacast.com/vod/.../${currentVideoId}`
      })
    }
  }, [showVideo, currentVideoId])

  if (!showVideo) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-white py-12">
          <p className="text-xl mb-4">Premiere starts in</p>
          <p className="text-3xl font-bold text-white mb-4" key={timeRemaining}>
            {timeRemaining || 'Checking...'}
          </p>
          <p className="text-lg text-gray-400">
            The premiere will begin automatically at the scheduled time.
          </p>
        </div>
      </div>
    )
  }

  // Show loading state while fetching video ID
  if (isLoadingVideoId || !currentVideoId) {
    return (
      <div className="text-center text-white py-12">
        <p className="text-xl mb-4">Loading video player...</p>
        <p className="text-sm text-gray-400">
          {isLoadingVideoId ? 'Fetching latest video...' : 'Video ID not found. Check database or environment variables.'}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <DacastPlayer 
        key={currentVideoId} // Force re-render when video ID changes
        videoId={currentVideoId} 
        accountId={process.env.NEXT_PUBLIC_DACAST_ACCOUNT_ID}
        autoplay 
      />
    </div>
  )
}

