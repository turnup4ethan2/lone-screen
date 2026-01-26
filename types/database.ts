export interface User {
  id: string
  email: string
  full_name?: string
  username?: string
  year_of_birth?: number
  is_admin?: boolean
  created_at: string
  updated_at: string
}

export interface MerchLink {
  title: string
  url: string
  price?: string
  description?: string
}

export interface Film {
  id: string
  title: string
  description: string
  director?: string
  cast_members?: string[]
  runtime?: number // in minutes
  poster_url?: string
  trailer_url?: string
  dacast_video_id?: string // Main film video
  dacast_qa_video_id?: string // Q&A video
  dacast_countdown_video_id?: string // Pre-movie countdown
  merch_links?: MerchLink[] // Array of merch links
  created_at: string
  updated_at: string
}

export interface Premiere {
  id: string
  film_id: string
  premiere_date: string // ISO datetime
  ticket_price: number // in cents
  capacity: number
  tickets_sold: number
  status: 'upcoming' | 'live' | 'completed'
  livestream_duration_hours?: number
  livestream_duration_minutes?: number
  livestream_duration_seconds?: number
  lobby_background_image_url?: string
  stripe_product_id?: string // Stripe Product ID for this premiere
  created_at: string
  updated_at: string
  film?: Film
}

export interface Ticket {
  id: string
  user_id: string
  premiere_id: string
  stripe_payment_intent_id?: string
  purchase_date: string
  status: 'active' | 'cancelled' | 'refunded'
  created_at: string
  premiere?: Premiere
}

export interface Rating {
  id: string
  user_id: string
  film_id: string
  premiere_id: string
  rating: number // 1-5
  comment?: string
  created_at: string
  updated_at: string
}

export interface FormSubmission {
  id: string
  type: 'contact_us' | 'filmmaker_application'
  name: string
  email: string
  message: string
  film_title?: string // for filmmaker applications
  screener_link?: string // for filmmaker applications
  created_at: string
}

export interface Comment {
  id: string
  premiere_id: string
  user_id: string
  content: string
  parent_id?: string // For nested replies
  created_at: string
  updated_at: string
  deleted_at?: string
  user?: User // Populated with user info when fetching
  likes_count?: number // Number of likes on this comment
  isLiked?: boolean // Whether the current user has liked this comment
}

