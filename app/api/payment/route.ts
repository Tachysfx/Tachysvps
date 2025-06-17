import { NextResponse } from 'next/server';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../functions/firebase';

// Replace Payoneer credentials with Flutterwave
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3';

interface PaymentRequest {
  amount: number;
  currency?: string;
  description: string;
  orderId?: string;
  customerEmail?: string;
  customerName?: string;
  payeeEmail?: string;
  type: 'payment' | 'withdrawal';
  bankCode?: string;
  accountNumber?: string;
  metadata?: {
    // VPS specific fields
    vpsOrderId?: string;
    planType?: string;
    duration?: string;
    quantity?: number;
    region?: string;
    serverCredentials?: {
      username: string;
      password: string;
    };

    // Algo specific fields
    algoId?: string;
    sellerId?: string;
    algoName?: string;
    paid?: boolean;
    downloadUrl?: string;

    // Premium membership fields
    membershipId?: string;
    membershipDuration?: number;
    membershipExpiry?: string;
    
    // Common fields
    userName?: string;
    type?: 'algo' | 'vps' | 'membership';
    returnUrl?: string;
  };
}

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: 'Application URL not configured' },
        { status: 500 }
      );
    }

    const body: PaymentRequest = await request.json();
    
    if (!FLUTTERWAVE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Flutterwave API key not configured' },
        { status: 500 }
      );
    }

    if (body.type === 'payment') {
      // Pre-payment database updates based on type
      switch(body.metadata?.type) {
        case 'vps':
          // Validate VPS order exists
          if (!body.metadata.vpsOrderId) {
            return NextResponse.json({ error: 'Invalid VPS order' }, { status: 400 });
          }
          break;

        case 'algo':
          // No pre-payment updates needed for algo
          break;

        case 'membership':
          // Validate membership data
          if (!body.metadata.membershipId || !body.metadata.membershipExpiry) {
            return NextResponse.json({ error: 'Invalid membership data' }, { status: 400 });
          }
          
          // Create membership record
          const membershipRef = doc(db, 'memberships', body.metadata.membershipId);
          await updateDoc(membershipRef, {
            userId: body.customerEmail,
            startDate: new Date().toISOString(),
            expiryDate: body.metadata.membershipExpiry,
            duration: body.metadata.membershipDuration,
            status: 'pending',
            amount: body.amount
          });
          break;
      }

      // Get the correct return URL based on payment type
      const returnUrl = getReturnUrl(body.metadata);

      // Create Flutterwave payment
      const flutterwaveData = {
        tx_ref: body.orderId,
        amount: body.amount,
        currency: body.currency || 'USD',
        payment_options: 'card',
        redirect_url: `${returnUrl}`,
        customer: {
          email: body.customerEmail,
          name: body.customerName || body.metadata?.userName,
        },
        customizations: {
          title: body.metadata?.type === 'algo' ? 'Algorithm Purchase' : 'Payment',
          description: body.metadata?.type === 'algo' 
            ? `Purchase of ${body.metadata?.algoName} algorithm`
            : body.description,
          logo: process.env.NEXT_PUBLIC_APP_URL + '/logo.png'
        },
        meta: {
          ...body.metadata,
          returnUrl
        }
      };

      const paymentResponse = await fetch(`${FLUTTERWAVE_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flutterwaveData),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      const paymentData = await paymentResponse.json();

      return NextResponse.json({
        success: true,
        paymentUrl: paymentData.data.link,
        paymentId: paymentData.data.id,
        type: body.metadata?.type
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

function getReturnUrl(metadata?: PaymentRequest['metadata']): string {
  if (!metadata?.type) return `${process.env.NEXT_PUBLIC_APP_URL}/v6/dashboard`;
  
  switch(metadata.type) {
    case 'vps':
      return `${process.env.NEXT_PUBLIC_APP_URL}/v6/vps`;
    case 'algo':
      return `${process.env.NEXT_PUBLIC_APP_URL}/market/${metadata.algoId}/download`;
    case 'membership':
      return `${process.env.NEXT_PUBLIC_APP_URL}/v6/account`;
    default:
      return `${process.env.NEXT_PUBLIC_APP_URL}/v6/dashboard`;
  }
} 