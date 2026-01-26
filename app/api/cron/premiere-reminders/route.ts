import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPremiereReminderEmail } from '@/lib/email/send'

// This endpoint should be called by Vercel Cron Jobs
// Set up in vercel.json with:
// {
//   "crons": [{
//     "path": "/api/cron/premiere-reminders",
//     "schedule": "*/10 * * * *"
//   }]
// }

export async function GET(request: NextRequest) {
  try {
    // Optional: Verify this is a cron request (set CRON_SECRET in env vars)
    // Vercel automatically adds an Authorization header for cron jobs
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // If CRON_SECRET is set, require it. Otherwise allow (for local testing)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const now = new Date()

    // Find premieres that need reminders:
    // 1. 1 hour before (60-70 minutes before)
    // 2. 10 minutes before (10-20 minutes before)
    
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)
    const oneHourMinus = new Date(now.getTime() + 50 * 60 * 1000) // 50 minutes from now
    const tenMinFromNow = new Date(now.getTime() + 10 * 60 * 1000)
    const tenMinMinus = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes from now

    // Get premieres in 1-hour window (50-60 minutes from now)
    const { data: oneHourPremieres } = await supabase
      .from('premieres')
      .select(`
        *,
        film:films(*)
      `)
      .gte('premiere_date', oneHourMinus.toISOString())
      .lte('premiere_date', oneHourFromNow.toISOString())

    // Get premieres in 10-minute window (5-10 minutes from now)
    const { data: tenMinPremieres } = await supabase
      .from('premieres')
      .select(`
        *,
        film:films(*)
      `)
      .gte('premiere_date', tenMinMinus.toISOString())
      .lte('premiere_date', tenMinFromNow.toISOString())

    let emailsSent = 0
    const errors: string[] = []

    // Send 1-hour reminders
    if (oneHourPremieres) {
      for (const premiere of oneHourPremieres) {
        const film = premiere.film as any
        
        // Get all active tickets for this premiere
        const { data: tickets } = await supabase
          .from('tickets')
          .select('user_id')
          .eq('premiere_id', premiere.id)
          .eq('status', 'active')

        if (tickets && tickets.length > 0) {
          // Get user profiles for all ticket holders
          const userIds = tickets.map(t => t.user_id)
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds)

          if (profiles) {
            for (const profile of profiles) {
              if (profile.email) {
                try {
                  await sendPremiereReminderEmail({
                    to: profile.email,
                    userName: profile.full_name || profile.email.split('@')[0],
                    filmTitle: film?.title || 'Premiere',
                    premiereDate: new Date(premiere.premiere_date),
                    reminderType: '1hour',
                    premiereId: premiere.id,
                  })
                  emailsSent++
                } catch (error) {
                  errors.push(`Failed to send 1-hour reminder to ${profile.email}: ${error}`)
                  console.error(`Error sending 1-hour reminder:`, error)
                }
              }
            }
          }
        }
      }
    }

    // Send 10-minute reminders
    if (tenMinPremieres) {
      for (const premiere of tenMinPremieres) {
        const film = premiere.film as any
        
        // Get all active tickets for this premiere
        const { data: tickets } = await supabase
          .from('tickets')
          .select('user_id')
          .eq('premiere_id', premiere.id)
          .eq('status', 'active')

        if (tickets && tickets.length > 0) {
          // Get user profiles for all ticket holders
          const userIds = tickets.map(t => t.user_id)
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds)

          if (profiles) {
            for (const profile of profiles) {
              if (profile.email) {
                try {
                  await sendPremiereReminderEmail({
                    to: profile.email,
                    userName: profile.full_name || profile.email.split('@')[0],
                    filmTitle: film?.title || 'Premiere',
                    premiereDate: new Date(premiere.premiere_date),
                    reminderType: '10min',
                    premiereId: premiere.id,
                  })
                  emailsSent++
                } catch (error) {
                  errors.push(`Failed to send 10-min reminder to ${profile.email}: ${error}`)
                  console.error(`Error sending 10-min reminder:`, error)
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Error in premiere reminders cron:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

