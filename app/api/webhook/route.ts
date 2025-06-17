import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../functions/firebase';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

// Verify webhook signature for Flutterwave
function verifyFlutterwaveSignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  
  const hash = crypto
    .createHash('sha256')
    .update(payload + WEBHOOK_SECRET)
    .digest('hex');
    
  return hash === signature;
}

// Retry function with exponential backoff
async function retryWithBackoff(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY * (MAX_RETRIES - retries)));
    return retryWithBackoff(fn, retries - 1);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('verif-hash');

    if (!signature || !verifyFlutterwaveSignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(payload);

    // Handle different Flutterwave event types
    switch (event.event) {

      case 'transfer.completed': {
        const { reference, id, amount } = event.data;
        
        // Handle successful transfers (e.g., seller payouts)
        const transferRef = doc(db, 'transfers', reference);
        await retryWithBackoff(async () => {
          await updateDoc(transferRef, {
            status: 'completed',
            completedAt: new Date().toISOString(),
            flutterwaveTransferId: id
          });
        });
        break;
      }

      case 'charge.failed': {
        const { tx_ref, id } = event.data;
        
        // Update order status for failed payments
        const orderRef = doc(db, 'orders', tx_ref);
        await retryWithBackoff(async () => {
          await updateDoc(orderRef, {
            paymentStatus: 'failed',
            lastUpdated: new Date().toISOString(),
            paymentDetails: {
              provider: 'flutterwave',
              paymentId: id,
              failedAt: new Date().toISOString()
            }
          });
        });
        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 