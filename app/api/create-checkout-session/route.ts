import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, orderData, printData } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${
                printData.type === 'canvas'
                  ? 'Canvas Print'
                  : printData.type === 'framed'
                  ? 'Uokvireni Print'
                  : 'Zidni Sticker'
              }`,
              description: `${printData.size}${
                printData.frameColor
                  ? ' • ' +
                    (printData.frameColor === 'black'
                      ? 'Crni okvir'
                      : 'Srebrni okvir')
                  : ''
              }`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get(
        'origin'
      )}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/?payment_canceled=true`,
      customer_email: orderData.email,
      metadata: {
        customerName: `${orderData.firstName} ${orderData.lastName}`,
        customerPhone: orderData.phone,
        customerAddress: `${orderData.address}, ${orderData.city} ${orderData.postalCode}`,
        printType: printData.type,
        printSize: printData.size,
        frameColor: printData.frameColor || '',
        price: amount.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
