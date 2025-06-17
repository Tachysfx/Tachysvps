import { useFlutterwave } from 'flutterwave-react-v3';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../functions/firebase';

interface FlutterwavePaymentProps {
  amount: number;
  email: string;
  name: string;
  phone_number: string;
  orderId: string;
  metadata: {
    type?: 'vps' | 'membership';
    vpsOrderId?: string;
    planType?: string;
    duration?: string;
    quantity?: number;
    region?: string;
    membershipId?: string;
    membershipDuration?: number;
    membershipExpiry?: string;
    userName?: string;
  };
  onSuccess?: (response: any) => void;
  onClose?: () => void;
}

export default function FlutterwavePayment({
  amount,
  email,
  name,
  phone_number,
  orderId,
  metadata,
  onSuccess,
  onClose
}: FlutterwavePaymentProps) {
  const router = useRouter();

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: orderId,
    amount,
    currency: "USD",
    payment_options: "card",
    customer: {
      email,
      name,
      phone_number,
    },
    customizations: {
      title: "VPS Payment",
      description: `Payment for ${metadata.quantity} ${metadata.planType} VPS (${metadata.duration})`,
      logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
    meta: metadata
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = async () => {
    try {
      const response = await handleFlutterPayment({
        callback: async (response) => {
          if (response.status === 'successful') {
            // Update order status
            await updateDoc(doc(db, "orders", orderId), {
              paymentStatus: 'completed',
              paymentId: response.transaction_id,
              paidAt: new Date().toISOString()
            });

            // Call onSuccess callback if provided
            if (onSuccess) {
              onSuccess(response);
            }

            // Redirect to success page
            router.push(`/v6/payment/success?order_id=${orderId}`);
          }
        },
        onClose: () => {
          // Call onClose callback if provided
          if (onClose) {
            onClose();
          }

          // Redirect to cancel page
          router.push(`/v6/payment/cancel?order_id=${orderId}`);
        },
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
      // Handle error appropriately
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
    >
      Pay Now
    </button>
  );
} 