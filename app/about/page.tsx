import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
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
  Gamepad2,
  Code2,
  Database,
  Layout,
  Zap,
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              Established 2020
            </span>
            <h1 className="text-4xl font-bold mt-4 mb-3">About Tachys VPS</h1>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto">
              Join thousands of businesses, developers, gamers, and traders who trust Tachys VPS for their digital infrastructure
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
                  {/* <Medal className="w-8 h-8 text-purple-400" /> */}
                  <FontAwesomeIcon icon={faAward} className="text-4xl text-purple-600 m-4" />
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
              Our mission is to deliver reliable, high-performance VPS hosting solutions that empower businesses and individuals to achieve their goals, whether they're scaling web applications, hosting game servers, developing software, or executing trades.
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
              To be the leading provider of versatile VPS solutions, setting new standards in performance, reliability, and innovation across all digital sectors - from web hosting to financial markets.
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
              Tachys VPS was founded in 2020 with a bold vision: to provide enterprise-grade VPS solutions that power the digital world. What started as a commitment to excellence has grown into a comprehensive platform serving diverse needs - from web hosting and game servers to development environments and trading infrastructure.
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
        <div className="py-8">
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                quote: "Our e-commerce platform loads lightning-fast. Outstanding performance and reliability!",
                author: "Sarah Chen",
                role: "E-commerce Owner",
                icon: Globe
              },
              {
                quote: "Perfect latency for our game servers. Players experience zero lag worldwide.",
                author: "Mike Davidson",
                role: "Gaming Host",
                icon: Gamepad2
              },
              {
                quote: "Development and deployment is seamless. Great for our CI/CD pipeline.",
                author: "Elena Rodriguez",
                role: "Lead Developer",
                icon: Code2
              },
              {
                quote: "Rock-solid database hosting with automated backups. Exactly what we needed.",
                author: "Ahmed Al-Farsi",
                role: "DB Admin",
                icon: Database
              },
              {
                quote: "Ultra-low latency and 100% uptime. Essential for our trading operations.",
                author: "Thomas Wright",
                role: "Pro Trader",
                icon: LineChart
              },
              {
                quote: "Managing client websites is effortless. Intuitive control panel and instant scaling.",
                author: "Maria Santos",
                role: "Web Agency",
                icon: Layout
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-purple-50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-purple-50 rounded-lg mr-3">
                    <testimonial.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-2">&quot;{testimonial.quote}&quot;</p>
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-purple-600">{testimonial.author}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-500">{testimonial.role}</span>
                    </div>
                  </div>
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
              Join thousands of professionals worldwide who trust Tachys VPS for their mission-critical infrastructure
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