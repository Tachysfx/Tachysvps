import { Shield, AlertTriangle, FileText, CheckCircle2, HelpCircle, Scale, Lock, Users } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mt-4 mb-3">Terms and Conditions</h1>
            <div className="flex flex-col items-center gap-2">
              <p className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                Last updated: May 20, 2025
              </p>
              <p className="text-base text-purple-200 max-w-2xl mx-auto">
                Please read these terms carefully before using our services
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
              <AlertTriangle className="w-6 h-6 text-purple-600 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">Important Notice</h3>
                <p className="text-gray-700">
                  Tachys VPS operates as a service aggregator and intermediary. We do not own or operate the underlying VPS infrastructure or trading algorithms. Our services are provided through partnerships with third-party providers including AWS and MQL5.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "1. Service Description", icon: FileText },
                { title: "2. User Responsibilities", icon: Users },
                { title: "3. Service Limitations", icon: Scale },
                { title: "4. Third-Party Services", icon: HelpCircle },
                { title: "5. Payment Terms", icon: CheckCircle2 },
                { title: "6. Privacy & Security", icon: Lock },
                { title: "7. Liability", icon: Shield },
                { title: "8. Termination", icon: AlertTriangle }
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

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1: Service Description */}
            <section id="section-1" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Service Description</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Tachys VPS provides access to virtual private server (VPS) hosting services and trading algorithms through partnerships with third-party providers. Our role is to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Facilitate access to VPS infrastructure through our partner providers</li>
                  <li>Provide a marketplace for trading algorithms and expert advisors</li>
                  <li>Offer customer support and service management</li>
                  <li>Handle billing and account management</li>
                </ul>
                <p>
                  We do not own or operate the underlying infrastructure or trading algorithms. All services are provided through our network of partner providers.
                </p>
              </div>
            </section>

            {/* Section 2: User Responsibilities */}
            <section id="section-2" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. User Responsibilities</h2>
              <div className="space-y-4 text-gray-600">
                <p>As a user of Tachys VPS services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the services in compliance with all applicable laws</li>
                  <li>Not engage in any activity that may disrupt the services</li>
                  <li>Comply with the terms of our partner providers</li>
                  <li>Maintain appropriate backups of your data</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Service Limitations */}
            <section id="section-3" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Service Limitations</h2>
              <div className="space-y-4 text-gray-600">
                <p>Our services are subject to the following limitations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service availability depends on our partner providers</li>
                  <li>Performance metrics may vary based on the underlying infrastructure</li>
                  <li>Some features may be limited by the capabilities of our partners</li>
                  <li>Service modifications may occur based on partner changes</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Third-Party Services */}
            <section id="section-4" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Third-Party Services</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our services rely on third-party providers, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AWS and other cloud infrastructure providers for VPS hosting</li>
                  <li>MQL5 for trading algorithms and expert advisors</li>
                  <li>Payment processors for billing services</li>
                </ul>
                <p>
                  By using our services, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We are not responsible for the quality of third-party services</li>
                  <li>Third-party terms and conditions apply to their respective services</li>
                  <li>Service availability depends on our partners' infrastructure</li>
                  <li>We may change partners at any time without notice</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Payment Terms */}
            <section id="section-5" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Payment Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>Payment terms and conditions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All fees are billed in advance for the service period</li>
                  <li>Refunds are subject to our partner providers' policies</li>
                  <li>We reserve the right to modify pricing with 30 days notice</li>
                  <li>Late payments may result in service suspension</li>
                  <li>All fees are non-negotiable</li>
                </ul>
              </div>
            </section>

            {/* Section 6: Privacy & Security */}
            <section id="section-6" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Privacy & Security</h2>
              <div className="space-y-4 text-gray-600">
                <p>Privacy and security considerations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We implement industry-standard security measures</li>
                  <li>Data protection is subject to our Privacy Policy</li>
                  <li>Users are responsible for their own data security</li>
                  <li>We may share necessary information with partner providers</li>
                  <li>Security measures may vary based on partner capabilities</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Liability */}
            <section id="section-7" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Liability</h2>
              <div className="space-y-4 text-gray-600">
                <p>Limitations of liability:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We are liable for third-party service disruptions</li>
                  <li>Our liability is limited to the amount paid for services</li>
                  <li>We are not responsible for data loss or corruption</li>
                  <li>No warranty is provided for service performance</li>
                  <li>Users are responsible for their own risk management</li>
                </ul>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section id="section-8" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Termination</h2>
              <div className="space-y-4 text-gray-600">
                <p>Service termination conditions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We may terminate services for violation of these terms</li>
                  <li>Users may cancel services after service period</li>
                  <li>No refunds are provided for late termination</li>
                  <li>We may terminate services if partner agreements end</li>
                  <li>Data may be deleted upon service termination</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms and Conditions, please contact us at:
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
