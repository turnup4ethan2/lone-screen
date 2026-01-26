import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPremiereReminderEmail } from '@/lib/email/send'

// This endpoint should be called by Vercel Cron Jobs
// Set up in vercel.json with:
// {
//   "crons": [{
//     "path": "/api/cron/premiere-reminders",
//     "schedule": "0 9 * * *"  // Runs once daily at 9:00 AM UTC (Vercel Hobby plan limit)
//   }]
// }
// 
// Note: Due to Vercel Hobby plan limitations (daily cron jobs only),
// this runs once per day and checks for premieres happening in the next 24 hours.
// For more frequent reminders, consider upgrading to Vercel Pro or using an external cron service.

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
    // Since we can only run once per day (Vercel Hobby plan), we check for premieres
    // happening in the next 24 hours and send appropriate reminders based on timing
    
    // Check for premieres happening in the next 24 hours
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    // Get all premieres happening in the next 24 hours
    const { data: upcomingPremieres } = await supabase
      .from('premieres')
      .select(`
        *,
        film:films(*)
      `)
      .gte('premiere_date', now.toISOString())
      .lte('premiere_date', tomorrow.toISOString())
      .eq('status', 'upcoming')

    if (!upcomingPremieres || upcomingPremieres.length === 0) {
      return NextResponse.json({
        success: true,
        emailsSent: 0,
        message: 'No premieres in the next 24 hours',
      })
    }

    // Separate premieres by reminder timing
    const oneHourPremieres: typeof upcomingPremieres = []
    const tenMinPremieres: typeof upcomingPremieres = []

    for (const premiere of upcomingPremieres) {
      const premiereDate = new Date(premiere.premiere_date)
      const minutesUntilPremiere = (premiereDate.getTime() - now.getTime()) / (1000 * 60)

      // 1-hour reminder: 50-70 minutes before
      if (minutesUntilPremiere >= 50 && minutesUntilPremiere <= 70) {
        oneHourPremieres.push(premiere)
      }
      
      // 10-minute reminder: 5-15 minutes before
      if (minutesUntilPremiere >= 5 && minutesUntilPremiere <= 15) {
        tenMinPremieres.push(premiere)
      }
    }

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

