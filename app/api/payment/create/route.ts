import { NextResponse } from 'next/server';
import { db } from '@/app/config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { algoId, amount, sellerId, algoName } = await req.json();

    // Initialize Payoneer payment
    const paymentData = {
      amount: amount,
      currency: 'USD',
      description: `Purchase of ${algoName}`,
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/market/${algoId}`,
      metadata: {
        algoId,
        sellerId
      }
    };

    // Make request to Payoneer API
    const response = await fetch('https://api.payoneer.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYONEER_API_KEY}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    const { payment_url } = await response.json();

    return NextResponse.json({ paymentUrl: payment_url });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 