import { NextResponse } from 'next/server';

// Replace these with your actual Payoneer API credentials
const PAYONEER_API_KEY = process.env.PAYONEER_API_KEY;
const PAYONEER_API_URL = process.env.PAYONEER_API_URL || 'https://api.sandbox.payoneer.com/v2/programs';

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  orderId: string;
  customerEmail: string;
}

export async function POST(request: Request) {
  try {
    const body: PaymentRequest = await request.json();
    
    if (!PAYONEER_API_KEY) {
      return NextResponse.json(
        { error: 'Payoneer API key not configured' },
        { status: 500 }
      );
    }

    // Create payment link using Payoneer API
    const paymentResponse = await fetch(`${PAYONEER_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYONEER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: body.currency || 'USD',
        description: body.description,
        client_reference_id: body.orderId,
        payee_email: body.customerEmail,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/v6/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/v6/payment/cancel`,
      }),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      throw new Error(errorData.message || 'Failed to create Payoneer payment');
    }

    const paymentData = await paymentResponse.json();

    return NextResponse.json({
      success: true,
      paymentUrl: paymentData.redirect_url,
      paymentId: paymentData.id
    });

  } catch (error) {
    console.error('Payoneer payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 