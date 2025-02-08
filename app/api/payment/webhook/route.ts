import { NextResponse } from 'next/server';
import { db } from '@/app/config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    // Verify Payoneer webhook signature
    const signature = req.headers.get('x-payoneer-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = await req.json();
    
    // Verify the payment status
    if (payload.status !== 'completed') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Handle different payment types
    if (payload.metadata.type === 'membership') {
      // Handle membership payment
      const userRef = doc(db, 'users', payload.metadata.userId);
      const userDoc = await getDoc(userRef);
      
      // Calculate new expiry date
      const currentExpiryDate = userDoc.exists() ? userDoc.data()?.proExpiryDate : null;
      const now = new Date();
      const expiryDate = currentExpiryDate && new Date(currentExpiryDate) > now
        ? new Date(new Date(currentExpiryDate).getTime() + 30 * 24 * 60 * 60 * 1000) // Add 30 days to current expiry
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      await updateDoc(userRef, {
        isPro: true,
        proExpiryDate: expiryDate.toISOString(),
        activities2: [{
          title: "Pro Membership Activated",
          description: "Upgraded to Pro Membership",
          timestamp: new Date().toISOString()
        }, ...(userDoc.data()?.activities2 || [])].slice(0, 5)
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/market`
      );
    } else {
      // Handle algo purchase
      const { algoId, sellerId } = payload.metadata;

      // Update algo document to mark as paid
      const algoRef = doc(db, 'algos', algoId);
      await updateDoc(algoRef, {
        paid: true
      });

      // Calculate seller earnings (85% of payment)
      const sellerAmount = payload.amount * 0.85;

      // Update seller's earnings
      const sellerRef = doc(db, 'users', sellerId);
      const sellerDoc = await getDoc(sellerRef);
      const currentEarnings = sellerDoc.data()?.earnings || 0;
      const currentPendingEarnings = sellerDoc.data()?.pendingEarnings || 0;
      
      await updateDoc(sellerRef, {
        earnings: currentEarnings + sellerAmount,
        pendingEarnings: currentPendingEarnings + sellerAmount,
        activities2: [{
          title: "Sale Completed",
          description: `Received payment for algorithm: ${payload.metadata.algoName}`,
          timestamp: new Date().toISOString()
        }, ...(sellerDoc.data()?.activities2 || [])].slice(0, 5)
      });

      // Redirect to download page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/market/${algoId}/download`
      );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 