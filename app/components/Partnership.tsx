"use client"

import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { 
  DollarSign, PieChart, MessageCircleHeart, 
  LineChart, Receipt, Crosshair, 
  Check, ArrowRight 
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, faClock, faGift 
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Partnership() {
  const [calculatorInput, setCalculatorInput] = useState(100);
  const [estimatedEarnings, setEstimatedEarnings] = useState(10);

  const handleCalculatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCalculatorInput(value);
    setEstimatedEarnings((value * 10) / 100);
  };

  const statsSection = (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { number: "500+", label: "Active Partners" },
          { number: "$50K+", label: "Paid to Partners" },
          { number: "24/7", label: "Support Available" },
          { number: "10%", label: "Commission Rate" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg text-center"
          >
            <h3 className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const trustFactors = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {[
        {
          icon: faShieldAlt,
          title: "Secure Payments",
          description: "Your earnings are protected with industry-standard security"
        },
        {
          icon: faClock,
          title: "Quick Onboarding",
          description: "Start earning within 24 hours of joining"
        },
        {
          icon: faGift,
          title: "Bonus Rewards",
          description: "Earn extra bonuses for high performance"
        }
      ].map((factor, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg border border-purple-100"
        >
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={factor.icon} className="text-xl text-white" />
          </div>
          <h3 className="text-xl font-semibold text-purple-600 mb-2">{factor.title}</h3>
          <p className="text-gray-600">{factor.description}</p>
        </motion.div>
      ))}
    </div>
  );

  const testimonials = [
    {
      quote: "Tachys VPS helped me earn $500 in my first month! The platform is incredibly easy to use and the support team is always there when needed.",
      author: "Peter T.",
      role: "Affiliate Partner",
      image: "/testimonials/peter.jpg"
    },
    {
      quote: "The tools provided made selling a breeze! I've tried other affiliate programs but none compare to the comprehensive support Tachys offers.",
      author: "Torres K.",
      role: "Reseller Partner",
      image: "/testimonials/torres.jpg"
    },
    {
      quote: "Highly recommend for resellers and affiliates! The commission rates are competitive and payments are always on time.",
      author: "Nikes P.",
      role: "Marketing Partner",
      image: "/testimonials/nikes.jpg"
    }
  ];

  const testimonialsSection = (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-8">
        What Our Partners Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 mr-4 flex items-center justify-center">
                <Image src="/user.png" alt="User" width={40} height={40} className="text-purple-600" />
              </div>
              <div>
                <p className="text-purple-600 font-medium">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-600 italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const updatedCalculator = (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl shadow-2xl p-10 mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Calculate Your Potential
      </h2>
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <div className="bg-white/20 backdrop-blur p-8 rounded-xl text-center mb-6">
          <p className="text-purple-100 text-lg mb-3">Estimated Monthly Earnings</p>
          <p className="text-5xl font-bold text-white mb-2">
            ${estimatedEarnings.toFixed(2)}
          </p>
          <p className="text-purple-200 text-sm">At 10% commission rate</p>
        </div>
        <label className="block text-white font-medium mb-3 text-lg">
          Monthly Sales Volume ($)
        </label>
        <div className="relative">
          <input
            type="range"
            className="w-full h-3 bg-purple-200/30 rounded-full appearance-none cursor-pointer"
            min="0"
            max="1000"
            step="50"
            value={calculatorInput}
            onChange={handleCalculatorChange}
          />
          <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs text-purple-200">
            <span>$0</span>
            <span>$500</span>
            <span>$1000</span>
          </div>
        </div>
        <input
          type="number"
          className="w-full mt-6 px-6 py-4 bg-white/5 border-2 border-purple-300/20 rounded-xl focus:outline-none focus:border-purple-300/40 text-white text-xl text-center"
          value={calculatorInput}
          onChange={handleCalculatorChange}
          min="0"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 mb-5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join the Tachys VPS Partnership Program
          </h1>
          <p className="text-xl text-purple-100 mb-8">
            Earn up to 10% profit split for every successful referral or reseller sale
          </p>
          <Link 
            href="/v6/affiliates" 
            className="inline-flex items-center px-8 py-3 text-lg font-medium bg-white text-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Join Now
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>

      {/* Add the new stats section */}
      {statsSection}

      {/* Benefits Grid */}
      <div className="container mx-auto px-4">
        <div className="five col-xxl-12 px-4 py-0">
          <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
            <div className="col-10 col-sm-8 col-lg-4">
              <Image
                src="/business.svg"
                width={700}
                height={500}
                alt="blur"
                className="d-block mx-lg-auto img-fluid"
              />
            </div>
            <div className="col-lg-8">
              <h2 className="text-3xl font-bold text-purple-600 mb-4 text-center text-lg-start">Start Earning with Tachys VPS</h2>
              <h5 className="text-xl text-gray-700 mb-6 text-center text-lg-start">Turn your network into profit -- Your audience deserve the best</h5>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">Quality Products Sell Themselves: </strong>
                    <span className="text-gray-600">With premium VPS hosting and trading solutions, your referrals are guaranteed satisfaction.</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">High Commission Rates: </strong>
                    <span className="text-gray-600">Enjoy an industry-leading 10% profit split on every sale you generate, ensuring substantial earnings.</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">No Expertise Needed: </strong>
                    <span className="text-gray-600">Anyone can join—whether you&apos;re an influencer, a trader, or just someone with a strong network.</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">Diverse Opportunities: </strong>
                    <span className="text-gray-600">Promote not only VPS hosting but also trading apps, copy trading, signals, and prop firm challenges.</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">Expand Your Business Portfolio: </strong>
                    <span className="text-gray-600">Resellers can build a brand around Tachys VPS products and services, boosting credibility.</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">Flexible Partnership Options: </strong>
                    <span className="text-gray-600">Choose between being a simple referrer or a full-fledged reseller with customizable plans.</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">Fast & Transparent Payments: </strong>
                    <span className="text-gray-600">Enjoy timely payouts with clear tracking of your earnings through our partner dashboard.</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="text-purple-600 mt-1 mr-3" size={20} />
                  <div>
                    <strong className="text-purple-600">Lifetime Earnings: </strong>
                    <span className="text-gray-600">Benefit from recurring commissions for as long as your referred customers stay connected.</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link 
                  href="/v6/affiliates" 
                  className="inline-flex items-center px-8 py-3 text-lg font-medium bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Add trust factors */}
        {trustFactors}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: DollarSign,
              title: "Generous Profit Split",
              description: "Earn 10% profit on every successful sale."
            },
            {
              icon: PieChart,
              title: "Comprehensive Analytics",
              description: "Track your referrals and performance in real-time."
            },
            {
              icon: MessageCircleHeart,
              title: "Dedicated Support",
              description: "Get expert guidance and 24/7 support to succeed."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition-all duration-200"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-2xl text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-purple-600 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mb-16">
          <h2 className="text-2xl font-bold text-purple-600 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-purple-50 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-purple-600 mb-4">For Referral Partners</h4>
              <ul className="space-y-4">
                {[
                  "Register to get your referral link.",
                  "Share the link via social media or websites.",
                  "Earn 10% from every purchase.",
                  "Withdraw your earnings directly.",
                  "FYI, minimum withdrawal is $1",
                ].map((step, index) => (
                  <li key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-purple-600 mb-4">For Reseller Partners</h4>
              <ul className="space-y-4">
                {[
                  "Sign up for discounted packages.",
                  "Set your pricing and sell Tachys services.",
                  "Earn 0% profit on net revenue.",
                  "Leverage exclusive reseller resources.",
                  "FYI, minimum withdrawal is $1",
                ].map((step, index) => (
                  <li key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Earnings Calculator */}
        {updatedCalculator}

        {/* Partner Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-purple-600 text-center mb-8">Features for Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: LineChart,
                title: "Real-Time Tracking",
                description: "Monitor your referrals, sales, and earnings effortlessly.",
              },
              {
                icon: Receipt,
                title: "Automated Payouts", 
                description: "Get your commissions paid securely and on time.",
              },
              {
                icon: Crosshair,
                title: "Marketing Tools",
                description: "Access banners, templates, and videos for promotion.",
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition-all duration-200"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-2xl text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-purple-600 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        {testimonialsSection}

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our partnership program today and start earning passive income with Tachys VPS
          </p>
          <Link 
            href="/v6/affiliates"
            className="inline-flex items-center px-8 py-3 text-lg font-medium bg-white text-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Become a Partner
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}