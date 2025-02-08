import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

const PAYONEER_API_KEY = process.env.PAYONEER_API_KEY;
const PAYONEER_API_URL = process.env.PAYONEER_API_URL || 'https://api.sandbox.payoneer.com/v2/programs';

export async function POST(request: Request) {
  try {
    const { paymentId, orderId } = await request.json();

    if (!PAYONEER_API_KEY) {
      return NextResponse.json(
        { error: 'Payoneer API key not configured' },
        { status: 500 }
      );
    }

    // Verify payment status with Payoneer
    const verificationResponse = await fetch(
      `${PAYONEER_API_URL}/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYONEER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!verificationResponse.ok) {
      throw new Error('Failed to verify payment with Payoneer');
    }

    const paymentData = await verificationResponse.json();

    // If payment is successful, update order status
    if (paymentData.status === 'COMPLETED') {
      // Update order status in Firestore
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus: 'completed',
        lastUpdated: new Date().toISOString(),
        paymentDetails: {
          provider: 'payoneer',
          paymentId,
          transactionId: paymentData.transaction_id,
          paidAt: new Date().toISOString()
        }
      });

      return NextResponse.json({ success: true, status: 'completed' });
    } else {
      return NextResponse.json(
        { error: 'Payment not completed', status: paymentData.status },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 