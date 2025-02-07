import type { Metadata } from 'next';
import { 
  MapPin, Mail, 
  Phone, Clock, Globe,
} from 'lucide-react';
import Link from 'next/link';
import ContactForm from '@/app/components/ContactForm';

export const metadata: Metadata = {
    title: "Tachys FX",
    description: "Experience lightning-fast VPS hosting with unmatched security and 24/7 support. Perfect for developers, businesses, and anyone needing scalable, reliable infrastructure.",
    applicationName: "High-Performance VPS Hosting",
    keywords: "Algo Market, Tachys VPS, Forex VPS hosting, Forex trading servers, low-latency Forex VPS, secure Forex VPS, fast VPS for Forex, trading server hosting, Forex VPS solutions, high-speed trading VPS, optimized VPS for Forex, dedicated Forex VPS, low ping Forex VPS, Forex VPS with SSD, MT4 VPS hosting, MetaTrader VPS, reliable Forex VPS, VPS for Forex brokers, Forex server uptime, premium Forex VPS, latency-optimized VPS, trading VPS infrastructure, VPS for financial markets, VPS with instant setup, customizable Forex VPS, 24/7 Forex VPS support, high-performance trading VPS, Forex VPS for EAs, stable VPS for Forex",
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/favicon.png',
      other: [
        {
          rel: 'icon',
          url: '/favicon.png',
          sizes: '192x192',
        },
        {
          rel: 'icon',
          url: '/favicon.png',
          sizes: '512x512',
        },
      ],
    },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section - Updated with a more modern design */}
      <div className="relative bg-gradient-to-r from-purple-600 to-purple-800 py-24">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium text-purple-200 bg-purple-900/30 rounded-full">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Let&apos;s Start a Conversation
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Whether you need technical support, have questions about our services, or want to explore custom solutions,
            we&apos;re here to help 24/7.
          </p>
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: Phone,
              title: "Call Us",
              content: "+44 2890 ***",
              action: "Call now",
              link: "tel:+442890***",
              color: "bg-emerald-500"
            },
            {
              icon: Mail,
              title: "Email Us",
              content: "support@tachysvps.com",
              action: "Send email",
              link: "mailto:support@tachysvps.com",
              color: "bg-blue-500"
            },
            {
              icon: Globe,
              title: "Live Chat",
              content: "Chat with support",
              action: "Start chat",
              link: "v6/support",
              color: "bg-purple-500"
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300">
              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <item.icon className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.content}</p>
              <Link
                href={item.link}
                className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                {item.action} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 h-full">
            <div className="mb-8">
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                Send Message
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                We typically respond within 10-30 Minutes
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Right Side - Contact Info & Map */}
          <div className="space-y-8">

            {/* Map Section - Updated styling */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <MapPin className="text-purple-600 mr-2 w-8 h-8" />
                <h3 className="text-xl font-semibold text-gray-900">Our Location</h3>
              </div>
              <div className="rounded-xl overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18557.871386033583!2d-5.93583565!3d54.5973525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486108f043c0e747%3A0xdb367e0c3f5fc60d!2sBelfast%2C%20UK!5e0!3m2!1sen!2sus!4v1699482037122!5m2!1sen!2sus"
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Business Hours - Updated design */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl text-white">
              <div className="flex items-center mb-4">
                <Clock className="text-purple-200 mr-2 w-8 h-8" />
                <h3 className="font-semibold text-white">24/7 Availability</h3>
              </div>
              <div className="space-y-2 text-purple-100">
                <p>Monday - Sunday: 24/7</p>
                <p className="text-sm mt-4 border-t border-purple-500 pt-4">
                  Our support team is available round the clock to assist you with any queries or technical issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
