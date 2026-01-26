'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Star } from 'lucide-react'
import type { Comment } from '@/types/database'

import MerchLinks from './MerchLinks'

interface ForumSectionProps {
  premiereId: string
  userId: string
  filmTitle?: string
  merchLinks?: any[]
}

export default function ForumSection({ premiereId, userId, filmTitle, merchLinks }: ForumSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'forum' | 'merch'>('forum')
  const [likingComments, setLikingComments] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'newest' | 'most-liked'>('newest')

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?premiereId=${premiereId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [premiereId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      setError('Please enter a comment')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          premiereId,
          content: newComment.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post comment')
      }

      setNewComment('')
      fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault()
    
    if (!replyContent.trim()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          premiereId,
          content: replyContent.trim(),
          parentId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post reply')
      }

      setReplyContent('')
      setReplyingTo(null)
      fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (commentId: string) => {
    if (likingComments.has(commentId)) return
    
    setLikingComments(prev => new Set(prev).add(commentId))
    
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to like comment')
      }

      const data = await response.json()
      
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            const wasLiked = comment.isLiked || false
            const currentLikes = comment.likes_count || 0
            return {
              ...comment,
              isLiked: data.liked,
              likes_count: data.liked 
                ? currentLikes + 1 
                : Math.max(0, currentLikes - 1)
            }
          }
          return comment
        })
      )
    } catch (err) {
      console.error('Error liking comment:', err)
    } finally {
      setLikingComments(prev => {
        const next = new Set(prev)
        next.delete(commentId)
        return next
      })
    }
  }

  // Get parent comments (top-level, no parent_id)
  const parentComments = comments
    .filter(c => !c.parent_id)
    .sort((a, b) => {
      if (sortBy === 'most-liked') {
        const likesA = a.likes_count || 0
        const likesB = b.likes_count || 0
        if (likesA !== likesB) {
          return likesB - likesA // Descending by likes
        }
        // If likes are equal, sort by newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else {
        // newest first (default)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
  
  const repliesByParent = comments
    .filter(c => c.parent_id)
    .reduce((acc, reply) => {
      if (!acc[reply.parent_id!]) {
        acc[reply.parent_id!] = []
      }
      acc[reply.parent_id!].push(reply)
      return acc
    }, {} as Record<string, Comment[]>)

  return (
    <div className="bg-[#F2F0EA]">
      {/* Tabs */}
      <div className="flex border-b border-[#000000]">
        <button
          onClick={() => setActiveTab('forum')}
          className={`px-6 py-3 text-[16px] font-bold transition-colors ${
            activeTab === 'forum'
              ? 'text-[#000000] border-b-2 border-[#000000]'
              : 'text-[#929292]'
          }`}
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
        >
          Forum
        </button>
        <button
          onClick={() => setActiveTab('merch')}
          className={`px-6 py-3 text-[16px] font-bold transition-colors ${
            activeTab === 'merch'
              ? 'text-[#000000] border-b-2 border-[#000000]'
              : 'text-[#929292]'
          }`}
          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
        >
          Merch
        </button>
      </div>

      {activeTab === 'forum' && (
        <div className="p-6">
          {/* The Lone Screen Post */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#002498] rounded-full flex items-center justify-center">
                <span className="text-[#FFFFFF] text-lg font-bold">★</span>
              </div>
              <div>
                <p
                  className="text-[14px] font-bold text-[#000000]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                >
                  The Lone Screen
                </p>
                <p
                  className="text-[12px] text-[#929292]"
                  style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                >
                  now
                </p>
              </div>
            </div>
            <h3
              className="text-[16px] font-bold text-[#000000] mb-2"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
            >
              What do you think about this movie?
            </h3>
            <p
              className="text-[14px] text-[#000000] mb-4"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              Share your thoughts with us about the movie. How was your first experience? Do you like the format?
            </p>
          </div>

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              rows={3}
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#929292] rounded-lg text-[#000000] placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#002498] focus:border-[#002498] resize-none"
              style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </form>

          {/* Sort Options */}
          {parentComments.length > 0 && (
            <div className="flex items-center justify-end gap-4 mb-6">
              <span
                className="text-[12px] text-[#929292]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Sort by:
              </span>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-4 py-2 rounded-md text-[12px] transition-colors ${
                  sortBy === 'newest'
                    ? 'bg-[#002498] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] border border-[#929292] text-[#000000] hover:bg-[#F2F0EA]'
                }`}
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortBy('most-liked')}
                className={`px-4 py-2 rounded-md text-[12px] transition-colors ${
                  sortBy === 'most-liked'
                    ? 'bg-[#002498] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] border border-[#929292] text-[#000000] hover:bg-[#F2F0EA]'
                }`}
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
              >
                Most Liked
              </button>
            </div>
          )}

          {/* Comments List */}
          {loading ? (
            <p className="text-center text-[#929292]">Loading comments...</p>
          ) : parentComments.length === 0 ? (
            <div className="text-center py-8">
              <p
                className="text-[16px] text-[#000000] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                **********************************
              </p>
              <p
                className="text-[16px] text-[#000000] mb-2"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                NO PAST COMMENTS YET
              </p>
              <p
                className="text-[16px] text-[#000000]"
                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '24px', letterSpacing: '-4%' }}
              >
                **********************************
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {parentComments.map((comment) => {
                const replies = repliesByParent[comment.id] || []

                return (
                  <div key={comment.id} className="border-b border-[#DCDCDC] pb-4 last:border-b-0">
                    {/* Comment Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#002498] rounded-full flex items-center justify-center">
                          <span className="text-[#FFFFFF] text-xs font-bold">
                            {comment.user?.full_name?.[0]?.toUpperCase() || comment.user?.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p
                            className="text-[14px] font-bold text-[#000000]"
                            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                          >
                            {comment.user?.full_name || comment.user?.username || 'Anonymous'}
                          </p>
                          <p
                            className="text-[12px] text-[#929292]"
                            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                          >
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }).replace('about ', '').replace(' ago', '')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <p
                      className="text-[14px] text-[#000000] mb-3 whitespace-pre-wrap"
                      style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                    >
                      {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        disabled={likingComments.has(comment.id)}
                        className="flex items-center gap-1 text-[#000000] hover:text-[#002498] transition-colors disabled:opacity-50"
                      >
                        <Star
                          size={16}
                          className={comment.isLiked ? 'fill-[#FFBB00] text-[#FFBB00]' : 'fill-none text-[#000000] stroke-[#000000] stroke-1'}
                        />
                        <span
                          className="text-[12px]"
                          style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                        >
                          {comment.likes_count || 0}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-[12px] text-[#000000] hover:text-[#002498] transition-colors"
                        style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <form onSubmit={(e) => handleSubmitReply(comment.id, e)} className="mt-4 space-y-2">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          className="w-full px-4 py-2 bg-[#FFFFFF] border border-[#929292] rounded-lg text-[#000000] placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#002498] focus:border-[#002498] resize-none"
                          style={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', lineHeight: '20px', letterSpacing: '-4%' }}
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isSubmitting || !replyContent.trim()}
                            className="px-4 py-2 bg-[#002498] text-[#FFFFFF] rounded-md hover:bg-[#001876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent('')
                            }}
                            className="px-4 py-2 bg-[#FFFFFF] border border-[#929292] text-[#000000] rounded-md hover:bg-[#F2F0EA] transition-colors text-sm"
                            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-3 border-l-2 border-[#DCDCDC] pl-4">
                        {replies.slice(0, 1).map((reply) => (
                          <div key={reply.id}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-[#002498] rounded-full flex items-center justify-center">
                                <span className="text-[#FFFFFF] text-xs font-bold">
                                  {reply.user?.full_name?.[0]?.toUpperCase() || reply.user?.username?.[0]?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <p
                                className="text-[12px] font-bold text-[#000000]"
                                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                              >
                                {reply.user?.full_name || reply.user?.username || 'Anonymous'}
                              </p>
                              <p
                                className="text-[12px] text-[#929292]"
                                style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                              >
                                • {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true }).replace('about ', '').replace(' ago', '')}
                              </p>
                            </div>
                            <p
                              className="text-[12px] text-[#000000] mb-2"
                              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                            >
                              {reply.content}
                            </p>
                          </div>
                        ))}
                        {replies.length > 1 && (
                          <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-[12px] text-[#002498] hover:text-[#001876]"
                            style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '16px', letterSpacing: '-4%' }}
                          >
                            {replies.length - 1} more reply{replies.length - 1 !== 1 ? 'ies' : ''}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'merch' && (
        <div className="p-6">
          {merchLinks && Array.isArray(merchLinks) && merchLinks.length > 0 ? (
            <MerchLinks merchLinks={merchLinks} filmTitle={filmTitle || ''} />
          ) : (
            <p
              className="text-[14px] text-[#929292] text-center"
              style={{ fontFamily: 'Spline Sans Mono, monospace', lineHeight: '20px', letterSpacing: '-4%' }}
            >
              No merch available for this film.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

