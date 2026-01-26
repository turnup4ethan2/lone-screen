import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/email/resend'

// POST /api/form-submissions - Create a form submission
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { type, name, email, message, film_title, screener_link } = body

    // Validate required fields
    if (!type || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate type
    if (type !== 'contact_us' && type !== 'filmmaker_application') {
      return NextResponse.json(
        { error: 'Invalid submission type' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Insert form submission
    const { error } = await supabase
      .from('form_submissions')
      .insert({
        type,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        film_title: film_title?.trim() || null,
        screener_link: screener_link?.trim() || null,
      })

    if (error) {
      console.error('Error creating form submission:', error)
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      )
    }

    // Send email notification to admins
    if (resend) {
      try {
        // Get all admin emails using admin client to bypass RLS
        const adminSupabase = createAdminClient()
        const { data: admins } = await adminSupabase
          .from('profiles')
          .select('email')
          .eq('is_admin', true)

        if (admins && admins.length > 0) {
          const adminEmails = admins.map(admin => admin.email).filter(Boolean)
          
          if (adminEmails.length > 0) {
            const subject = type === 'contact_us' 
              ? 'New Contact Form Submission - The Lone Screen'
              : 'New Filmmaker Application - The Lone Screen'

            const emailContent = `
              <h2>New ${type === 'contact_us' ? 'Contact Form' : 'Filmmaker Application'} Submission</h2>
              <p><strong>Name:</strong> ${name.trim()}</p>
              <p><strong>Email:</strong> ${email.trim()}</p>
              ${film_title ? `<p><strong>Film Title:</strong> ${film_title.trim()}</p>` : ''}
              ${screener_link ? `<p><strong>Screener Link:</strong> <a href="${screener_link.trim()}">${screener_link.trim()}</a></p>` : ''}
              <p><strong>Message:</strong></p>
              <p>${message.trim().replace(/\n/g, '<br>')}</p>
            `

            await resend.emails.send({
              from: DEFAULT_FROM_EMAIL,
              to: adminEmails,
              subject,
              html: emailContent,
            })
          }
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Error sending admin notification email:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in form-submissions POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

