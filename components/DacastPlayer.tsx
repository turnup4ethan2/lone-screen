'use client'

interface DacastPlayerProps {
  videoId: string
  accountId?: string
  className?: string
  autoplay?: boolean
}

export default function DacastPlayer({ 
  videoId, 
  accountId,
  className = '',
  autoplay = false
}: DacastPlayerProps) {
  const iframeId = `dacast-player-${videoId}`
  
  // DEBUG: Log the video ID and embed URL
  console.log('🔍 DacastPlayer received:', {
    videoId,
    isLiveStream: videoId.includes('-live-'),
    accountId: accountId || 'using default'
  })
  
  // Build embed URL based on content type
  let embedUrl: string
  
  // Check if it's a live stream (contains '-live-')
  if (videoId.includes('-live-')) {
    // Live stream format: /live/{part1}/{part2}
    // Content ID format: "a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-d19ce51c-432c-4e78-b9f3-f1fb1cce27eb"
    // Split at '-live-' to get the two parts
    const parts = videoId.split('-live-')
    if (parts.length === 2) {
      embedUrl = `https://iframe.dacast.com/live/${parts[0]}/${parts[1]}${autoplay ? '?autoplay=true' : ''}`
    } else {
      // Fallback if format is unexpected
      embedUrl = `https://iframe.dacast.com/live/${videoId}${autoplay ? '?autoplay=true' : ''}`
    }
  } else if (videoId.includes('-vod-')) {
    // VOD format with -vod- marker: /vod/{part1}/{part2}
    // Content ID format: "a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-vod-28237053-834b-4bbf-9b4f-44f9758a16f0"
    // Split at '-vod-' to get the two parts
    const parts = videoId.split('-vod-')
    if (parts.length === 2) {
      embedUrl = `https://iframe.dacast.com/vod/${parts[0]}/${parts[1]}${autoplay ? '?autoplay=true' : ''}`
    } else {
      // Fallback if format is unexpected
      const dacastAccountId = accountId || (typeof window !== 'undefined' 
        ? process.env.NEXT_PUBLIC_DACAST_ACCOUNT_ID 
        : 'd91a1988-f0af-104e-35df-43ef44a1f521')
      embedUrl = `https://iframe.dacast.com/vod/${dacastAccountId}/${videoId}${autoplay ? '?autoplay=true' : ''}`
    }
  } else {
    // Standard VOD format: /vod/{accountId}/{videoId}
    const dacastAccountId = accountId || (typeof window !== 'undefined' 
      ? process.env.NEXT_PUBLIC_DACAST_ACCOUNT_ID 
      : 'd91a1988-f0af-104e-35df-43ef44a1f521')
    embedUrl = `https://iframe.dacast.com/vod/${dacastAccountId}/${videoId}${autoplay ? '?autoplay=true' : ''}`
  }
  
  // DEBUG: Log the final embed URL
  console.log('🔍 DacastPlayer embed URL:', embedUrl)

  if (!videoId) {
    return (
      <div className="text-center text-white py-12">
        <p>Error: Video ID is missing</p>
      </div>
    )
  }

  return (
    <div 
      className={`relative w-full overflow-hidden bg-black ${className}`}
      style={{ paddingBottom: '56.25%', height: 0 }}
    >
      <iframe
        key={embedUrl} // Force re-render when URL changes
        id={iframeId}
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  )
}

