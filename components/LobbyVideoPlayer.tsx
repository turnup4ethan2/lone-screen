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
  const hasReloadedRef = useRef(false) // Ensure we only auto-reload once if needed
  const START_THRESHOLD_MS = 2000 // treat within 2s of start as started
  
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

      // If we're within a small threshold of the premiere time, treat it as started
      if (distance <= START_THRESHOLD_MS) {
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
        // Still counting down - compute HH:MM:SS (Figma-style)
        setShowVideo(false)
        const totalSeconds = Math.max(0, Math.floor(distance / 1000))
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        const formatted = [
          hours.toString().padStart(2, '0'),
          minutes.toString().padStart(2, '0'),
          seconds.toString().padStart(2, '0'),
        ].join(':')
        setTimeRemaining(formatted)
      }
    }

    // Check immediately on mount
    const now = new Date()
    const premiere = new Date(premiereDate)
    if (now.getTime() >= premiere.getTime() - START_THRESHOLD_MS) {
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

  // Safety net: if we've passed the premiere time and still aren't showing video,
  // make sure we trigger a fetch. This covers cases where timers are throttled
  // (e.g. tab in background) and prevents getting stuck at 00:00 until refresh.
  useEffect(() => {
    if (showVideo || isLoadingVideoId || hasFetchedRef.current) return

    const now = new Date()
    const premiere = new Date(premiereDate)
    const distance = premiere.getTime() - now.getTime()

    if (distance <= START_THRESHOLD_MS) {
      console.log('Safety net: premiere should have started, forcing video ID fetch')
      fetchLatestVideoId()
    }
  }, [showVideo, isLoadingVideoId, premiereDate, fetchLatestVideoId])

  // Last-resort safety: if the premiere time has passed and we still aren't
  // showing the video after all our fetch attempts, automatically reload
  // the page once. This matches the behavior you've seen manually (refresh
  // fixes it) but makes it automatic for the user.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hasReloadedRef.current) return

    const now = new Date()
    const premiere = new Date(premiereDate)

    // If we're past the premiere time and still not showing video, reload once
    if (now >= premiere && !showVideo) {
      hasReloadedRef.current = true
      console.log('Safety reload: premiere started but video not visible, reloading page')
      window.location.reload()
    }
  }, [showVideo, premiereDate])

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
    if (showVideo && currentVideoId) {
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
    // Figma-style countdown overlay
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center text-white">
          <p
            className="text-[36px] font-bold mb-4"
            style={{
              fontFamily: 'Instrument Sans, sans-serif',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: '44px',
            }}
          >
            The film starts
          </p>
          <div
            className="text-[48px] font-bold italic"
            style={{
              fontFamily: 'Spline Sans Mono, monospace',
              fontWeight: 700,
              letterSpacing: '-4%',
              lineHeight: '56px',
            }}
          >
            in {timeRemaining || '00:00:00'}
          </div>
          <p className="mt-6 text-[16px] text-gray-400" style={{ fontFamily: 'Spline Sans Mono, monospace' }}>
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

