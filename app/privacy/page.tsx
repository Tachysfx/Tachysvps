import { Shield, AlertTriangle, FileText, Database, Eye, Lock, Users, Bell, Globe } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mt-4 mb-3">Privacy Policy</h1>
            <div className="flex flex-col items-center gap-2">
              <p className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                Last updated: May 20, 2025
              </p>
              <p className="text-base text-purple-200 max-w-2xl mx-auto">
                Learn how we collect, use, and protect your personal information
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
              <Shield className="w-6 h-6 text-purple-600 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">Data Protection Commitment</h3>
                <p className="text-gray-700">
                  At Tachys VPS, we are committed to protecting your privacy and ensuring the security of your personal information. This policy outlines how we collect, use, and safeguard your data.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "1. Information We Collect", icon: Database },
                { title: "2. How We Use Your Data", icon: Eye },
                { title: "3. Data Sharing", icon: Users },
                { title: "4. Data Security", icon: Lock },
                { title: "5. Your Rights", icon: Shield },
                { title: "6. Cookies & Tracking", icon: Bell },
                { title: "7. International Data", icon: Globe },
                { title: "8. Policy Updates", icon: FileText }
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

          {/* Privacy Sections */}
          <div className="space-y-8">
            {/* Section 1: Information We Collect */}
            <section id="section-1" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-600">
                <p>We collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email, contact details)</li>
                  <li>Billing and payment information</li>
                  <li>Service usage data and preferences</li>
                  <li>Technical information (IP address)</li>
                  <li>Communication records with our support team</li>
                  <li>Information required by our partner providers</li>
                </ul>
              </div>
            </section>

            {/* Section 2: How We Use Your Data */}
            <section id="section-2" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Data</h2>
              <div className="space-y-4 text-gray-600">
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and manage our services</li>
                  <li>Process payments and maintain billing records</li>
                  <li>Communicate with you about our services</li>
                  <li>Share necessary information with partner providers</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Data Sharing */}
            <section id="section-3" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Sharing</h2>
              <div className="space-y-4 text-gray-600">
                <p>We share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our partner VPS providers (AWS, etc.)</li>
                  <li>Trading platform providers (MQL5)</li>
                  <li>Payment processors and financial institutions</li>
                  <li>Service providers who assist our operations</li>
                </ul>
                <p className="mt-4">
                  We only share information necessary for service provision and always ensure appropriate data protection measures are in place.
                </p>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section id="section-4" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
              <div className="space-y-4 text-gray-600">
                <p>We implement various security measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage and transmission</li>
                  <li>Regular security updates and patches</li>
                </ul>
                <p className="mt-4">
                  While we implement robust security measures, no system is completely secure. We recommend users take appropriate precautions to protect their data.
                </p>
              </div>
            </section>

            {/* Section 5: Your Rights */}
            <section id="section-5" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Your Rights</h2>
              <div className="space-y-4 text-gray-600">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact our support team. We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            {/* Section 6: Cookies & Tracking */}
            <section id="section-6" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies & Tracking</h2>
              <div className="space-y-4 text-gray-600">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain your session and preferences</li>
                  <li>Analyze website usage and performance</li>
                  <li>Improve our services</li>
                  <li>Provide personalized content</li>
                </ul>
                <p className="mt-4">
                  You can control cookie preferences through your browser settings. However, disabling certain cookies may affect service functionality.
                </p>
              </div>
            </section>

            {/* Section 7: International Data */}
            <section id="section-7" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. International Data</h2>
              <div className="space-y-4 text-gray-600">
                <p>Data may be transferred internationally because:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our partner providers operate globally</li>
                  <li>We use international cloud services</li>
                  <li>Our support team operates across time zones</li>
                </ul>
                <p className="mt-4">
                  We ensure appropriate safeguards are in place for international data transfers, including standard contractual clauses and data processing agreements.
                </p>
              </div>
            </section>

            {/* Section 8: Policy Updates */}
            <section id="section-8" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Policy Updates</h2>
              <div className="space-y-4 text-gray-600">
                <p>We may update this policy to reflect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Changes in our services</li>
                  <li>New partner relationships</li>
                  <li>Legal requirements</li>
                  <li>Industry standards</li>
                </ul>
                <p className="mt-4">
                  We will notify you of significant changes via email or through our website. Continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              For privacy-related inquiries or to exercise your rights, please contact our Data Protection Officer:
            </p>
            <div className="mt-4">
              <Link 
                href="/contact-us"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Contact Privacy Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
