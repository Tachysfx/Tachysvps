import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../functions/firebase';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

// Verify webhook signature for Flutterwave
function verifyFlutterwaveSignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  
  const hash = crypto
    .createHash('sha256')
    .update(payload + WEBHOOK_SECRET)
    .digest('hex');
    
  return hash === signature;
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
      case 'charge.completed': {
        const { tx_ref, id, amount } = event.data;
        
        // Get order from Firestore
        const orderRef = doc(db, 'orders', tx_ref);
        const orderDoc = await getDoc(orderRef);
        
        if (!orderDoc.exists()) {
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          );
        }

        const orderData = orderDoc.data();

        // For algo purchases, calculate seller earnings (85% of payment)
        if (orderData.type === 'algo') {
          const sellerAmount = amount * 0.85; // 85% commission to seller
          const sellerRef = doc(db, 'sellers', orderData.sellerId);
          const sellerDoc = await getDoc(sellerRef);
          
          // Update seller's pending earnings
          await updateDoc(sellerRef, {
            pendingEarnings: (sellerDoc.data()?.pendingEarnings || 0) + sellerAmount,
            activities2: [{
              title: "Sale Completed",
              description: `Received payment for algorithm: ${orderData.algoName}`,
              timestamp: new Date().toISOString()
            }, ...(sellerDoc.data()?.activities2 || [])].slice(0, 5)
          });
        }

        // Update order status
        await updateDoc(orderRef, {
          paymentStatus: 'completed',
          lastUpdated: new Date().toISOString(),
          paymentDetails: {
            provider: 'flutterwave',
            paymentId: id,
            amount: amount,
            paidAt: new Date().toISOString()
          }
        });
        break;
      }

      // ... handle other Flutterwave events as needed ...
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