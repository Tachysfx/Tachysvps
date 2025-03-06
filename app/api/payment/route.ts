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
          // Update algo payment status
          if (body.metadata.algoId) {
            const algoRef = doc(db, 'algos', body.metadata.algoId);
            await updateDoc(algoRef, {
              paid: true,
              lastPurchased: new Date().toISOString(),
              purchaseHistory: arrayUnion({
                userId: body.customerEmail,
                purchaseDate: new Date().toISOString(),
                amount: body.amount
              })
            });
          }
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

      // Create Flutterwave payment
      const paymentResponse = await fetch(`${FLUTTERWAVE_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: body.orderId || crypto.randomUUID(),
          amount: body.amount,
          currency: body.currency || 'USD',
          payment_options: 'card,banktransfer',
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/v6/payment/success`,
          customer: {
            email: body.customerEmail,
            name: body.metadata?.userName,
          },
          customizations: {
            title: 'Payment for ' + body.description,
            description: body.description,
            logo: process.env.NEXT_PUBLIC_APP_URL + '/logo.png'
          },
          meta: {
            ...body.metadata,
            returnUrl: getReturnUrl(body.metadata)
          }
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      const paymentData = await paymentResponse.json();

      // Post-payment success updates
      if (paymentData.status === 'success') {
        switch(body.metadata?.type) {
          case 'vps':
            await updateDoc(doc(db, 'orders', body.metadata.vpsOrderId!), {
              paymentStatus: 'completed',
              paymentId: paymentData.data.id,
              paidAt: new Date().toISOString()
            });
            break;

          case 'algo':
            await updateDoc(doc(db, 'users', body.customerEmail), {
              purchasedAlgos: arrayUnion({
                algoId: body.metadata.algoId,
                purchaseDate: new Date().toISOString(),
                amount: body.amount
              })
            });
            break;

          case 'membership':
            await updateDoc(doc(db, 'users', body.customerEmail), {
              role: 'Premium',
              premiumExpiration: body.metadata.membershipExpiry,
              membershipId: body.metadata.membershipId,
              membershipHistory: arrayUnion({
                membershipId: body.metadata.membershipId,
                startDate: new Date().toISOString(),
                expiryDate: body.metadata.membershipExpiry,
                duration: body.metadata.membershipDuration,
                amount: body.amount
              })
            });

            await updateDoc(doc(db, 'memberships', body.metadata.membershipId!), {
              status: 'active',
              paymentId: paymentData.data.id,
              paidAt: new Date().toISOString()
            });
            break;
        }
      }

      return NextResponse.json({
        success: true,
        paymentUrl: paymentData.data.link,
        paymentId: paymentData.data.id,
        type: body.metadata?.type
      });

    } else if (body.type === 'withdrawal') {
      // Handle payouts using Flutterwave Transfer
      const payoutResponse = await fetch(`${FLUTTERWAVE_API_URL}/transfers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_bank: body.bankCode,
          account_number: body.accountNumber,
          amount: body.amount,
          currency: body.currency || 'USD',
          narration: body.description,
          reference: body.orderId,
          meta: body.metadata
        }),
      });

      if (!payoutResponse.ok) {
        const errorData = await payoutResponse.json();
        throw new Error(errorData.message || 'Failed to process withdrawal');
      }

      const payoutData = await payoutResponse.json();
      return NextResponse.json({
        success: true,
        transactionId: payoutData.data.id,
        status: payoutData.data.status
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
  if (!metadata?.type) return '/v6/dashboard';
  
  switch(metadata.type) {
    case 'vps':
      return '/v6/dashboard/vps';
    case 'algo':
      return metadata.algoId ? `/market/${metadata.algoId}/download` : '/v6/dashboard';
    case 'membership':
      return '/v6/dashboard';
    default:
      return '/v6/dashboard';
  }
} 