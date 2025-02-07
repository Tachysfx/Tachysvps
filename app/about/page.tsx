import { Metadata } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import {
  Rocket,
  ShieldCheck,
  Users,
  Globe,
  LineChart,
  Handshake,
  Lightbulb,
  Heart,
  Clock,
  Server,
  Headphones,
  MapPin,
  Shield,
  BarChart3,
  UserCheck,
  Medal
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Tachys FX",
  description: "Experience lightning-fast VPS hosting with unmatched security and 24/7 support. Perfect for developers, businesses, and anyone needing scalable, reliable infrastructure.",
  applicationName: "High-Performance VPS Hosting",
  keywords: "FOREX, Tachys VPS, Forex VPS hosting, Forex trading servers, low-latency Forex VPS, secure Forex VPS, fast VPS for Forex, trading server hosting, Forex VPS solutions, high-speed trading VPS, optimized VPS for Forex, dedicated Forex VPS, low ping Forex VPS, Forex VPS with SSD, MT4 VPS hosting, MetaTrader VPS, reliable Forex VPS, VPS for Forex brokers, Forex server uptime, premium Forex VPS, latency-optimized VPS, trading VPS infrastructure, VPS for financial markets, VPS with instant setup, customizable Forex VPS, 24/7 Forex VPS support, high-performance trading VPS, Forex VPS for EAs, stable VPS for Forex",
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

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section - Enhanced with animated stats */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-block">
              <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                Established 2024
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-4">About Tachys FX</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              We&apos;re here to assist with all your VPS and trading needs - let&apos;s connect today!
            </p>
          </div>
          
          {/* Enhanced Stats with Animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Active Users", icon: Users },
              { number: "99.9%", label: "Uptime", icon: Server },
              { number: "24/7", label: "Support", icon: Headphones },
              { number: "200+", label: "Global Locations", icon: Globe }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-purple-200" />
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      

      
      <div className="container mx-auto px-4 py-16">
        {/* Awards & Recognition */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">Awards & Recognition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { year: "2024", award: "Best VPS Provider", org: "Trading Awards" },
              { year: "2024", award: "Excellence in Support", org: "Forex Review" },
              { year: "2023", award: "Innovation Award", org: "Tech Excellence" },
              { year: "2023", award: "Best Infrastructure", org: "Cloud Awards" }
            ].map((award, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 text-center">
                <div className="w-14 h-14 mx-auto mb-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  <Medal className="w-8 h-8 text-purple-400" />
                </div>
                <div className="font-semibold text-purple-600 mb-2">{award.award}</div>
                <div className="text-sm text-gray-600">{award.org}</div>
                <div className="text-sm text-purple-400 mt-2">{award.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-b from-white to-purple-50 rounded-2xl shadow-xl border border-purple-200 p-12 mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent text-center mb-16">Our Technology Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Enterprise Hardware", icon: Server, description: "Latest generation processors" },
              { name: "Monitoring Tools", icon: BarChart3, description: "24/7 system monitoring" },
              { name: "Security Systems", icon: ShieldCheck, description: "Multi-layer protection" },
              { name: "Network Infrastructure", icon: Globe, description: "High-speed fiber connections" }
            ].map((tech, index) => (
              <div 
                key={index} 
                className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-6 bg-white rounded-xl shadow-md hover:shadow-xl border border-purple-100"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  <tech.icon className="w-10 h-10 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">{tech.name}</h3>
                <p className="text-gray-600 leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 transform hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Rocket className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide reliable, high-performance VPS hosting and cutting-edge trading applications that empower traders and businesses to maximize their potential.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 transform hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600">Our Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To be the leading platform for VPS hosting and trading solutions, bridging the gap between technology and success for traders around the world.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mb-16">
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">Why Choose Tachys VPS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Server,
                title: "High Performance",
                description: "Enterprise-grade hardware for optimal trading execution"
              },
              {
                icon: Clock,
                title: "99.9% Uptime",
                description: "Reliable infrastructure that never sleeps"
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Expert assistance whenever you need it"
              },
              {
                icon: ShieldCheck,
                title: "Advanced Security",
                description: "Military-grade protection for your trading operations"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-purple-600 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Reliability",
                description: "99.9% uptime and consistent performance for all services."
              },
              {
                icon: LineChart,
                title: "Innovation",
                description: "We integrate the latest technologies to enhance our services."
              },
              {
                icon: UserCheck,
                title: "Customer-Centric",
                description: "We prioritize our customers' needs with unparalleled support."
              },
              {
                icon: Handshake,
                title: "Integrity",
                description: "Building trust through transparent and honest practices."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <value.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-purple-600 mb-2 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12 mb-16 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-purple-100 leading-relaxed">
              Tachys VPS was founded in 2024 with a simple idea: to provide traders with high-performance VPS hosting and premium trading tools. What started as a small team has now grown into a complete platform with scalable solutions for all types of traders.
            </p>
          </div>
        </div>

        {/* Timeline Section - New Addition */}
        <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">Our Journey</h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200"></div>
          
          {/* Timeline Items */}
          <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full">
              <div className="w-1 bg-purple-200 h-full"></div>
            </div>

            <div className="space-y-7">
              {[
                {
                  year: "2024",
                  title: "Foundation",
                  description: "Tachys VPS was established with a vision to revolutionize trading infrastructure."
                },
                {
                  year: "2024 Q2",
                  title: "Global Expansion",
                  description: "Expanded our server network to over 200 locations worldwide."
                },
                {
                  year: "2024 Q3",
                  title: "Innovation",
                  description: "Launched our Algo Market platform for automated trading solutions."
                },
                {
                  year: "2024 Q4",
                  title: "Future Ready",
                  description: "Implementing AI-powered infrastructure optimization."
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  {/* Timeline item */}
                  <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    {/* Content */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}>
                      <div 
                        className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
                      >
                        <div className="text-purple-600 font-bold mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-purple-600 border-4 border-white shadow"></div>
                    </div>
                  </div>

                  {/* Line connecting to dot (optional) */}
                  <div className={`absolute top-1/2 ${index % 2 === 0 ? 'left-[calc(41.666667%+1rem)]' : 'right-[calc(41.666667%+1rem)]'} w-[calc(8.333333%-1rem)] h-[2px] bg-purple-200`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-16 mt-12" id='team'>
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Michael Genesis II",
                role: "Founder & CEO",
                image: "/mike.jpeg"
              },
              {
                name: "Victoria Moth",
                role: "Head of Support",
                image: "/victoria.jpg"
              },
              {
                name: "Mark Ingorvish",
                role: "Head of Marketing",
                image: "/mark.jpg"
              }
            ].map((member, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 text-center transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-semibold text-purple-600 mb-1">{member.name}</h4>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "Tachys VPS helped me scale my trading operations with their lightning-fast VPS and powerful trading bots.",
                author: "Sarah T., Professional Trader"
              },
              {
                quote: "Their 24/7 customer support is always available to help me with any issues. Couldn't be happier!",
                author: "Mike D., Reseller"
              },
              {
                quote: "The security features give me peace of mind. My trades and data are always safe.",
                author: "Al-Farsi., Trader"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <Heart className="w-6 h-6 text-purple-400 mb-4" />
                    <p className="text-gray-600 italic mb-4">&quot;{testimonial.quote}&quot;</p>
                  </div>
                  <p className="text-purple-600 font-medium">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Presence */}
        <div className="container mx-auto px-4 py-16 pb-0" id='location'>
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mb-16">
            <h2 className="text-3xl font-bold text-purple-600 text-center mb-8">Global Presence</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Image
                  src="/worldHigh.svg"
                  width={7000}
                  height={7000}
                  alt="Global Presence"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-purple-600 mb-4">Worldwide Infrastructure</h3>
                <div className="space-y-4">
                  {[
                    { region: "North America", servers: 45, latency: "< 1ms" },
                    { region: "Europe", servers: 68, latency: "< 1ms" },
                    { region: "Asia Pacific", servers: 57, latency: "< 1ms" },
                    { region: "Middle East", servers: 32, latency: "< 1ms" }
                  ].map((location, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-purple-600">{location.region}</div>
                        <div className="text-sm text-gray-600">
                          {location.servers} Servers • {location.latency} Latency
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who trust Tachys VPS for their trading infrastructure
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/plans/lite"
                className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                View Plans
              </Link>
              <Link 
                href="/contact-us"
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default About;