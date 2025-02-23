import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../functions/firebase';

// Replace these with your actual Payoneer API credentials
const PAYONEER_API_KEY = process.env.PAYONEER_API_KEY;
const PAYONEER_API_URL = process.env.PAYONEER_API_URL || 'https://api.sandbox.payoneer.com/v2/programs';

interface PaymentRequest {
  amount: number;
  currency?: string;
  description: string;
  orderId?: string;
  customerEmail?: string;
  payeeEmail?: string;
  type: 'payment' | 'withdrawal';
  metadata?: {
    algoId?: string;
    sellerId?: string;
    algoName?: string;
    vpsOrderId?: string;
    membershipId?: string;
    membershipDuration?: number;
    membershipExpiry?: string;
  };
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

    if (body.type === 'payment') {
      // Handle incoming payments (VPS orders, algo purchases, memberships)
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
          metadata: body.metadata
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      const paymentData = await paymentResponse.json();

      if (body.type === 'payment' && body.metadata?.membershipId) {
        // Store the membership details in Firestore
        const userDoc = doc(db, 'users', body.customerEmail);
        await updateDoc(userDoc, {
          role: 'Premium',
          premiumExpiration: body.metadata.membershipExpiry,
          membershipId: body.metadata.membershipId
        });
      }

      return NextResponse.json({
        success: true,
        paymentUrl: paymentData.redirect_url,
        paymentId: paymentData.id
      });

    } else if (body.type === 'withdrawal') {
      // Handle payouts to sellers/affiliates
      const payoutResponse = await fetch(`${PAYONEER_API_URL}/payouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYONEER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: body.amount,
          currency: body.currency || 'USD',
          description: body.description,
          payee_email: body.payeeEmail,
          metadata: body.metadata
        }),
      });

      if (!payoutResponse.ok) {
        const errorData = await payoutResponse.json();
        throw new Error(errorData.message || 'Failed to process withdrawal');
      }

      const payoutData = await payoutResponse.json();
      return NextResponse.json({
        success: true,
        transactionId: payoutData.id,
        status: payoutData.status
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 