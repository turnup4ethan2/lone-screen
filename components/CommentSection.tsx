'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Heart } from 'lucide-react'
import type { Comment } from '@/types/database'

interface CommentSectionProps {
  premiereId: string
  userId: string
}

type SortOption = 'newest' | 'most-liked'

export default function CommentSection({ premiereId, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [likingComments, setLikingComments] = useState<Set<string>>(new Set())

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
      fetchComments() // Refresh comments
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
      fetchComments() // Refresh comments
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (commentId: string) => {
    // Prevent double-clicking
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
      
      // Update the comment's like status and count
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

  // Organize comments into threads (parent comments and their replies)
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Discussion</h2>
        
        {/* Sort Options */}
        {parentComments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                sortBy === 'newest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortBy('most-liked')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                sortBy === 'most-liked'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Most Liked
            </button>
          </div>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this film..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : parentComments.length === 0 ? (
        <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-6">
          {parentComments.map((comment) => (
            <div key={comment.id} className="bg-gray-900 rounded-lg p-6">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {comment.user?.full_name?.[0]?.toUpperCase() || comment.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {comment.user?.full_name || comment.user?.username || 'Anonymous'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-gray-200 mb-4 whitespace-pre-wrap">{comment.content}</p>

              {/* Like and Reply Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(comment.id)}
                  disabled={likingComments.has(comment.id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    comment.isLiked
                      ? 'text-red-400 hover:text-red-300'
                      : 'text-gray-400 hover:text-gray-300'
                  } disabled:opacity-50`}
                >
                  <Heart
                    size={18}
                    className={comment.isLiked ? 'fill-current' : ''}
                  />
                  <span>{comment.likes_count || 0}</span>
                </button>
                
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <form onSubmit={(e) => handleSubmitReply(comment.id, e)} className="mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !replyContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Reply'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent('')
                      }}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Replies */}
              {repliesByParent[comment.id] && repliesByParent[comment.id].length > 0 && (
                <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-700 pl-4">
                  {repliesByParent[comment.id].map((reply) => (
                    <div key={reply.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {reply.user?.full_name?.[0]?.toUpperCase() || reply.user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <p className="text-white font-medium text-sm">
                          {reply.user?.full_name || reply.user?.username || 'Anonymous'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-gray-200 text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

