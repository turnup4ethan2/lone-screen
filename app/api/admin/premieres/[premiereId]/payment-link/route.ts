import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { isAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/admin/premieres/[premiereId]/payment-link - Generate or get Stripe Payment Link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ premiereId: string }> }
) {
  try {
    // Check admin status
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { premiereId } = await params
    const supabase = createAdminClient()

    // Get premiere with film info
    const { data: premiere, error: premiereError } = await supabase
      .from('premieres')
      .select(`
        *,
        film:films(*)
      `)
      .eq('id', premiereId)
      .single()

    if (premiereError || !premiere) {
      return NextResponse.json(
        { error: 'Premiere not found' },
        { status: 404 }
      )
    }

    if (!premiere.stripe_product_id) {
      return NextResponse.json(
        { error: 'No Stripe Product ID configured for this premiere' },
        { status: 400 }
      )
    }

    const stripe = getStripeServer()
    const film = premiere.film as any

    // Get the default price for this product
    const prices = await stripe.prices.list({
      product: premiere.stripe_product_id,
      active: true,
      limit: 1,
    })

    if (prices.data.length === 0) {
      return NextResponse.json(
        { error: 'No active price found for this Stripe product' },
        { status: 400 }
      )
    }

    const priceId = prices.data[0].id

    // Create or retrieve Payment Link
    // Note: Stripe Payment Links are persistent, so we check if one exists first
    // For now, we'll create a new one each time (you might want to store the payment link ID in the database)
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        premiereId: premiereId,
        filmTitle: film?.title || 'Premiere',
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?premiere_id=${premiereId}`,
        },
      },
    })

    return NextResponse.json({
      paymentLinkUrl: paymentLink.url,
      paymentLinkId: paymentLink.id,
      instructions: 'Share this Payment Link URL with customers. When they purchase through this link, they will automatically receive access to this premiere.',
    })
  } catch (error: any) {
    console.error('Error creating payment link:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment link' },
      { status: 500 }
    )
  }
}

