import { createClient } from './supabase/server'
import type { Premiere } from '@/types/database'

export async function getUpcomingPremiere(): Promise<Premiere | null> {
  const supabase = await createClient()
  const now = new Date()
  
  // Get upcoming or live premieres ordered by start time
  const { data, error } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(*)
    `)
    .in('status', ['upcoming', 'live'])
    .order('premiere_date', { ascending: true })
    .limit(5)

  if (error || !data || data.length === 0) {
    return null
  }
  
  // Find the first premiere that is either:
  // - In the future, or
  // - Currently in progress (between start and end time, based on livestream duration)
  for (const premiere of data as Premiere[]) {
    const premiereDate = new Date(premiere.premiere_date)

    // Calculate livestream end time based on configured duration
    const hours = premiere.livestream_duration_hours ?? 0
    const minutes = premiere.livestream_duration_minutes ?? 0
    const seconds = premiere.livestream_duration_seconds ?? 0
    let totalSeconds = hours * 3600 + minutes * 60 + seconds

    // Sensible default if duration not set
    if (totalSeconds <= 0) {
      totalSeconds = 2 * 60 * 60 // 2 hours
    }

    const endTime = new Date(premiereDate.getTime() + totalSeconds * 1000)

    // Show premiere if it hasn't finished yet
    if (now <= endTime) {
      return premiere
    }
  }

  // No active or upcoming premieres
  return null
}

export async function getUserTicket(premiereId: string, userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tickets')
    .select('*')
    .eq('premiere_id', premiereId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  return data
}

export async function checkTicketAvailability(premiereId: string) {
  const supabase = await createClient()
  const { data: premiere } = await supabase
    .from('premieres')
    .select('capacity, tickets_sold')
    .eq('id', premiereId)
    .single()

  if (!premiere) return { available: false, remaining: 0 }
  
  const remaining = premiere.capacity - premiere.tickets_sold
  return {
    available: remaining > 0,
    remaining,
  }
}

