import { createClient } from './supabase/server'
import type { Premiere } from '@/types/database'

export async function getUpcomingPremiere(): Promise<Premiere | null> {
  const supabase = await createClient()
  const now = new Date()
  const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000).toISOString()

  // Get premieres that are:
  // 1. In the future (upcoming)
  // 2. OR currently happening (started within last 1 minute)
  // This allows viewing during active premieres but hides old ones quickly
  const { data, error } = await supabase
    .from('premieres')
    .select(`
      *,
      film:films(*)
    `)
    .in('status', ['upcoming', 'live'])
    .gte('premiere_date', oneMinuteAgo) // Started within last 1 minute OR in future
    .order('premiere_date', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    return null
  }
  
  // Additional check: if premiere is more than 1 minute old, don't show it
  const premiereDate = new Date(data.premiere_date)
  const minutesSincePremiere = (now.getTime() - premiereDate.getTime()) / (1000 * 60)
  
  if (minutesSincePremiere > 1) {
    return null
  }
  
  return data as Premiere
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

