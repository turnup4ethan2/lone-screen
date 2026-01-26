import { resend, DEFAULT_FROM_EMAIL, APP_NAME } from './resend'
import { getPurchaseConfirmationHTML, getPremiereReminderHTML } from './templates'
import type { PurchaseConfirmationEmailProps, PremiereReminderEmailProps } from './templates'

export async function sendPurchaseConfirmationEmail(props: PurchaseConfirmationEmailProps) {
  try {
    if (!resend) {
      console.warn('Resend not configured - skipping purchase confirmation email')
      return { success: false, error: 'Email service not configured' }
    }

    const { to, userName, filmTitle, premiereDate, ticketPrice, premiereId } = props

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [to],
      subject: `Ticket Confirmed: ${filmTitle}`,
      html: getPurchaseConfirmationHTML({
        userName,
        filmTitle,
        premiereDate,
        ticketPrice,
        premiereId,
      }),
    })

    if (error) {
      console.error('Error sending purchase confirmation email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in sendPurchaseConfirmationEmail:', error)
    return { success: false, error }
  }
}

export async function sendPremiereReminderEmail(props: PremiereReminderEmailProps) {
  try {
    if (!resend) {
      console.warn('Resend not configured - skipping premiere reminder email')
      return { success: false, error: 'Email service not configured' }
    }

    const { to, userName, filmTitle, premiereDate, reminderType, premiereId } = props

    const timeText = reminderType === '1hour' ? '1 hour' : '10 minutes'
    const subject = `${filmTitle} starts in ${timeText}!`

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [to],
      subject,
      html: getPremiereReminderHTML({
        userName,
        filmTitle,
        premiereDate,
        reminderType,
        premiereId,
      }),
    })

    if (error) {
      console.error('Error sending premiere reminder email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in sendPremiereReminderEmail:', error)
    return { success: false, error }
  }
}

