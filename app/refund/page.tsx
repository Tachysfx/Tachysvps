import { CreditCard, AlertTriangle, Clock, CheckCircle2, XCircle, HelpCircle, ArrowLeftRight, Shield, FileText, Scale, Lock, Users } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mt-4 mb-3">Refund Policy</h1>
            <div className="flex flex-col items-center gap-2">
              <p className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                Last updated: May 20, 2025
              </p>
              <p className="text-base text-purple-200 max-w-2xl mx-auto">
                Understanding our refund process and payment terms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Important Notice */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <CreditCard className="w-6 h-6 text-purple-600 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">Payment Processing Notice</h3>
                <p className="text-gray-700">
                  All payments are processed through Flutterwave, our trusted payment processor. Refunds are subject to our terms and conditions and may take 5-10 business days to process.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "1. Payment Processing", icon: CreditCard },
                { title: "2. Refund Eligibility", icon: CheckCircle2 },
                { title: "3. Non-Refundable Items", icon: XCircle },
                { title: "4. Refund Process", icon: ArrowLeftRight },
                { title: "5. Processing Time", icon: Clock },
                { title: "6. Disputes", icon: Shield },
                { title: "7. Special Cases", icon: HelpCircle },
                { title: "8. Contact Support", icon: HelpCircle }
              ].map((item, index) => (
                <Link 
                  key={index}
                  href={`#section-${index + 1}`}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Refund Sections */}
          <div className="space-y-8">
            {/* Section 1: Payment Processing */}
            <section id="section-1" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Payment Processing</h2>
              <div className="space-y-4 text-gray-600">
                <p>We use Flutterwave as our payment processor:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All payments are processed securely through Flutterwave</li>
                  <li>Multiple payment methods are supported (credit/debit cards, bank transfers)</li>
                  <li>Payments are processed in real-time</li>
                  <li>Secure encryption protects all payment information</li>
                  <li>Payment confirmations are sent via email</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Refund Eligibility */}
            <section id="section-2" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Refund Eligibility</h2>
              <div className="space-y-4 text-gray-600">
                <p>Refunds may be granted in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service unavailability within 24 hours of purchase</li>
                  <li>Technical issues preventing service usage</li>
                  <li>Billing errors or duplicate charges</li>
                  <li>Service cancellation within the cooling-off period</li>
                  <li>Failure to deliver promised service features</li>
                </ul>
                <p className="mt-4">
                  Refund requests must be submitted within 7 days of the issue occurring.
                </p>
              </div>
            </section>

            {/* Section 3: Non-Refundable Items */}
            <section id="section-3" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Non-Refundable Items</h2>
              <div className="space-y-4 text-gray-600">
                <p>The following are not eligible for refunds:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Services used beyond the cooling-off period</li>
                  <li>Custom configurations or setup fees</li>
                  <li>Additional services or add-ons</li>
                  <li>Usage-based charges</li>
                  <li>Violation of terms of service</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Refund Process */}
            <section id="section-4" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Refund Process</h2>
              <div className="space-y-4 text-gray-600">
                <p>To request a refund:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact our support team with your request</li>
                  <li>Provide your order number and reason for refund</li>
                  <li>Include any relevant documentation</li>
                  <li>Wait for our review and response</li>
                  <li>If approved, refund will be processed through Flutterwave</li>
                </ol>
                <p className="mt-4">
                  Refunds will be issued to the original payment method used for the purchase.
                </p>
              </div>
            </section>

            {/* Section 5: Processing Time */}
            <section id="section-5" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Processing Time</h2>
              <div className="space-y-4 text-gray-600">
                <p>Refund processing times:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Initial review: 1-2 business days</li>
                  <li>Approval to processing: 1-2 business days</li>
                  <li>Payment provider processing: 3-10 business days</li>
                  <li>Bank processing: 1-5 business days</li>
                </ul>
                <p className="mt-4">
                  Total processing time may vary based on your payment method and bank.
                </p>
              </div>
            </section>

            {/* Section 6: Disputes */}
            <section id="section-6" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Disputes</h2>
              <div className="space-y-4 text-gray-600">
                <p>For payment disputes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact our support team first</li>
                  <li>Provide detailed information about the dispute</li>
                  <li>Include transaction details and evidence</li>
                  <li>We will investigate and respond within 48 hours</li>
                </ul>
                <p className="mt-4">
                  If unresolved, disputes may be escalated to Flutterwave's dispute resolution process.
                </p>
              </div>
            </section>

            {/* Section 7: Special Cases */}
            <section id="section-7" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Special Cases</h2>
              <div className="space-y-4 text-gray-600">
                <p>Special refund considerations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Force majeure events</li>
                  <li>Extended service outages</li>
                  <li>Legal requirements</li>
                  <li>Partner provider issues</li>
                </ul>
                <p className="mt-4">
                  Each case will be evaluated individually based on circumstances and applicable laws.
                </p>
              </div>
            </section>

            {/* Section 8: Contact Support */}
            <section id="section-8" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Contact Support</h2>
              <div className="space-y-4 text-gray-600">
                <p>For refund inquiries:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: support@tachysvps.com</li>
                  <li>Support Ticket: Submit through dashboard</li>
                  <li>Live Chat: Available 24/7</li>
                </ul>
                <p className="mt-4">
                  Please include your order number and relevant details in all communications.
                </p>
              </div>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Help?</h2>
            <p className="text-gray-600">
              Our support team is here to assist you with any refund-related questions or concerns.
            </p>
            <div className="mt-4">
              <Link 
                href="/contact-us"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 