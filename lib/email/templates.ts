import { DEFAULT_FROM_EMAIL, APP_NAME } from './resend'
import { format } from 'date-fns'

export interface PurchaseConfirmationEmailProps {
  to: string
  userName: string
  filmTitle: string
  premiereDate: Date
  ticketPrice: number
  premiereId: string
}

export interface PremiereReminderEmailProps {
  to: string
  userName: string
  filmTitle: string
  premiereDate: Date
  reminderType: '1hour' | '10min'
  premiereId: string
}

export function getPurchaseConfirmationHTML({
  userName,
  filmTitle,
  premiereDate,
  ticketPrice,
  premiereId,
}: Omit<PurchaseConfirmationEmailProps, 'to'>) {
  const formattedDate = format(premiereDate, 'EEEE, MMMM d, yyyy')
  const formattedTime = format(premiereDate, 'h:mm a')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const lobbyUrl = `${appUrl}/lobby/${premiereId}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px;">
    <h1 style="color: #000; margin-top: 0;">Thank you for your purchase!</h1>
    
    <p>Hi ${userName},</p>
    
    <p>Your ticket for <strong>${filmTitle}</strong> has been confirmed.</p>
    
    <div style="background-color: #fff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #000;">
      <h2 style="margin-top: 0; color: #000;">Premiere Details</h2>
      <p style="margin: 10px 0;"><strong>Film:</strong> ${filmTitle}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${formattedTime}</p>
      <p style="margin: 10px 0;"><strong>Price:</strong> $${(ticketPrice / 100).toFixed(2)}</p>
    </div>
    
    <p>We'll send you a reminder before the premiere starts. When it's time, you can access the lobby here:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${lobbyUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Go to Lobby</a>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">See you at the premiere!</p>
    <p style="color: #666; font-size: 14px;">The ${APP_NAME} Team</p>
  </div>
</body>
</html>
  `
}

export function getPremiereReminderHTML({
  userName,
  filmTitle,
  premiereDate,
  reminderType,
  premiereId,
}: Omit<PremiereReminderEmailProps, 'to'>) {
  const formattedDate = format(premiereDate, 'EEEE, MMMM d, yyyy')
  const formattedTime = format(premiereDate, 'h:mm a')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const lobbyUrl = `${appUrl}/lobby/${premiereId}`
  
  const timeText = reminderType === '1hour' ? '1 hour' : '10 minutes'
  const urgencyText = reminderType === '10min' ? 'almost time!' : 'starting soon!'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px;">
    <h1 style="color: #000; margin-top: 0;">Premiere Reminder</h1>
    
    <p>Hi ${userName},</p>
    
    <p>The premiere for <strong>${filmTitle}</strong> is ${urgencyText}</p>
    
    <div style="background-color: #fff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #000;">
      <h2 style="margin-top: 0; color: #000;">${filmTitle}</h2>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${formattedTime}</p>
      <p style="margin: 10px 0; color: #dc2626; font-weight: 600;">Starts in ${timeText}!</p>
    </div>
    
    <p>Get ready for this one-night-only screening. When it's time, click the button below to enter the lobby:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${lobbyUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Enter Lobby</a>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">See you soon!</p>
    <p style="color: #666; font-size: 14px;">The ${APP_NAME} Team</p>
  </div>
</body>
</html>
  `
}

