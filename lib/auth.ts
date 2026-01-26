import { createClient } from './supabase/server'
import type { User } from '@/types/database'

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as User
}

export async function getCurrentUserProfile(): Promise<User | null> {
  const user = await getCurrentUser()
  if (!user) return null
  return getUserProfile(user.id)
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return profile?.is_admin === true
}

