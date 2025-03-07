import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define different transporter configurations
const transporters = {
  support: nodemailer.createTransport({
  host: 'mail.tachysvps.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
  }),
  
  notifications: nodemailer.createTransport({
    host: 'mail.tachysvps.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NOTIFICATIONS_EMAIL_USER,
      pass: process.env.NOTIFICATIONS_EMAIL_PASSWORD
    }
  }),

  founder: nodemailer.createTransport({
    host: 'mail.tachysvps.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.FOUNDER_EMAIL_USER,
      pass: process.env.FOUNDER_EMAIL_PASSWORD
    }
  }),

  sales: nodemailer.createTransport({
    host: 'mail.tachysvps.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SALES_EMAIL_USER,
      pass: process.env.SALES_EMAIL_PASSWORD
    }
  })
};

// Define template types
type TemplateType = keyof EmailTemplates;

// Email template interfaces
interface EmailTemplates {
  CONTACT: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  WELCOME: {
    name: string;
    email: string;
  };
  RESET_PASSWORD: {
    email: string;
    resetLink: string;
  };
  NOTIFICATION: {
    email: string;
    title: string;
    message: string;
  };
  DOWNLOAD_CONGRATS: {
    name: string;
    email: string;
    algoName: string;
    productUrl: string;
  };
  PREMIUM_PAYMENT_SUCCESS: {
    name: string;
    email: string;
    plan: { months: number; price: number };
  };
  PREMIUM_PAYMENT_FAILED: {
    name: string;
    email: string;
    plan: { months: number; price: number };
    error?: string;
  };
  VPS_PAYMENT_SUCCESS: {
    name: string;
    email: string;
    vpsDetails: {
      plan: string;
      quantity: number;
      duration: string;
      region: string;
      price: number;
      serverCredentials?: {
        username: string;
        password: string;
      };
    };
  };
  VPS_PAYMENT_FAILED: {
    name: string;
    email: string;
    vpsDetails: {
      plan: string;
      quantity: number;
      duration: string;
      region: string;
      price: number;
    };
    error?: string;
  };
}

// Update templates to include transporter selection
const templates: {
  [K in TemplateType]: {
    transporter: keyof typeof transporters;
    generator: (data: EmailTemplates[K]) => {
    to: string;
    subject: string;
    html: string;
    };
  };
} = {
  CONTACT: {
    transporter: 'support',
    generator: (data: EmailTemplates['CONTACT']) => ({
    to: 'support@tachysvps.com',
    subject: `Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #7A49B7; border-bottom: 2px solid #7A49B7; padding-bottom: 10px; margin-top: 0;">
          New Contact Form Submission
        </h2>
        <div style="margin: 25px 0;">
          <p style="margin: 12px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 12px 0;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 12px 0;"><strong>Subject:</strong> ${data.subject}</p>
          <div style="margin-top: 25px;">
            <p style="margin: 12px 0;"><strong>Message:</strong></p>
            <p style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #7A49B7;">${data.message}</p>
          </div>
        </div>
      </div>
    `
    })
  },

  WELCOME: {
    transporter: 'founder',
    generator: (data: EmailTemplates['WELCOME']) => ({
    to: data.email,
      subject: 'Welcome to Tachys VPS - Your Journey to Superior Performance Begins',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://tachysvps.com/logo.png" alt="Tachys VPS Logo" width="40" height="40" style="margin: 0 auto; border-radius: 50%; object-fit: cover;">
          </div>
          
          <div style="background: linear-gradient(135deg, #7A49B7, #9B6DDF); padding: 25px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to the Future of VPS, ${data.name}!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Your journey to exceptional performance begins now</p>
          </div>

          <div style="margin: 30px 0;">
            <p style="font-size: 16px; line-height: 1.6;">I'm Michael Genesis II, founder of Tachys VPS, and I'm thrilled to welcome you to our cutting-edge platform.</p>
            
            <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 30px 0;">
              <h3 style="color: #7A49B7; margin-top: 0;">🚀 Your Success Stories Start Here</h3>
              <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                <div style="border-left: 4px solid #7A49B7; padding-left: 15px;">
                  <h4 style="margin: 0; color: #333;">Algorithmic Trading</h4>
                  <p style="margin: 5px 0; color: #666;">Execute complex trading strategies with ultra-low latency and zero downtime</p>
                </div>
                <div style="border-left: 4px solid #7A49B7; padding-left: 15px;">
                  <h4 style="margin: 0; color: #333;">Web Development & Hosting</h4>
                  <p style="margin: 5px 0; color: #666;">Host high-traffic applications with confidence using our enterprise-grade infrastructure</p>
                </div>
                <div style="border-left: 4px solid #7A49B7; padding-left: 15px;">
                  <h4 style="margin: 0; color: #333;">Data Analytics</h4>
                  <p style="margin: 5px 0; color: #666;">Process big data workloads with powerful computing resources and NVMe storage</p>
                </div>
              </div>
            </div>

            <div style="background: #7A49B7; border-radius: 12px; padding: 25px; color: white; margin: 30px 0;">
              <h3 style="margin-top: 0;">⚡ Premium Features at Your Fingertips</h3>

              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 15px 0; display: flex; align-items: center;">
                  ✓ NVMe SSD Storage for Lightning-Fast Performance
                </li>
                <li style="margin: 15px 0; display: flex; align-items: center;">
                  ✓ Exclusive Access to Algo Market Trading Tools
                </li>
                <li style="margin: 15px 0; display: flex; align-items: center;">
                  ✓ 24/7 Priority Technical Support
                </li>
              </ul>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://tachysvps.com/dashboard" 
                 style="display: inline-block; background: #7A49B7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin-bottom: 15px;">
                Launch Your Dashboard
              </a>
              <div style="margin-top: 20px;">
                <a href="https://tachysvps.com/plans/lite" style="color: #7A49B7; text-decoration: none; margin: 0 15px;">Launch VPS</a>
                <a href="https://tachysvps.com/market" style="color: #7A49B7; text-decoration: none; margin: 0 15px;">Explore Algo Market</a>
                <a href="https://tachysvps.com/partnership" style="color: #7A49B7; text-decoration: none; margin: 0 15px;">Partnership</a>
              </div>
            </div>

            <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 30px 0;">
              <h3 style="color: #7A49B7; margin-top: 0;">🎓 Quick Start Resources</h3>
              <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                <a href="https://tachysvps.com/explore" style="text-decoration: none; color: inherit; background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                  <h4 style="margin: 0; color: #7A49B7;">Getting Started Guide</h4>
                  <p style="margin: 5px 0; color: #666;">Learn the basics and set up your first VPS</p>
                </a>
                <a href="https://tachysvps.com/explore" style="text-decoration: none; color: inherit; background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                  <h4 style="margin: 0; color: #7A49B7;">Algo Trading Setup</h4>
                  <p style="margin: 5px 0; color: #666;">Configure your trading environment</p>
                </a>
              </div>
            </div>

            <p style="margin-top: 30px; font-style: italic; line-height: 1.6;">
              Ready to revolutionize your VPS experience? Our team is here to support your journey every step of the way.
            </p>
            
            <div style="margin-top: 30px;">
              <p style="margin: 0;">Best regards,</p>
              <p style="margin: 5px 0; font-weight: bold;">Michael Genesis II</p>
              <p style="margin: 0; color: #666;">Founder & CEO, Tachys VPS</p>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666;">
              <p style="margin: 0;">Need assistance? Contact our 24/7 support team:</p>
              <p style="margin: 5px 0;">
                <a href="mailto:support@tachysvps.com" style="color: #7A49B7; text-decoration: none;">support@tachysvps.com</a>
              </p>
              <p style="margin: 15px 0 0 0;">
                Follow us on: 
                <a href="https://twitter.com/tachysvps" style="color: #7A49B7; text-decoration: none; margin: 0 5px; display: inline-flex; align-items: center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                  X
                </a> | 
                <a href="https://linkedin.com/company/tachysvps" style="color: #7A49B7; text-decoration: none; margin: 0 5px; display: inline-flex; align-items: center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>
              </p>
            </div>
        </div>
      </div>
    `
    })
  },

  RESET_PASSWORD: {
    transporter: 'support',
    generator: (data: EmailTemplates['RESET_PASSWORD']) => ({
    to: data.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #7A49B7; border-bottom: 2px solid #7A49B7; padding-bottom: 10px; margin-top: 0;">
          Password Reset Request
        </h2>
        <div style="margin: 25px 0;">
          <p>Click the link below to reset your password:</p>
          <a href="${data.resetLink}" style="display: inline-block; background: #7A49B7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
        </div>
      </div>
    `
    })
  },

  NOTIFICATION: {
    transporter: 'notifications',
    generator: (data: EmailTemplates['NOTIFICATION']) => ({
    to: data.email,
    subject: data.title,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #7A49B7; border-bottom: 2px solid #7A49B7; padding-bottom: 10px; margin-top: 0;">
          ${data.title}
        </h2>
        <div style="margin: 25px 0;">
          <p>${data.message}</p>
        </div>
      </div>
    `
  })
  },

  DOWNLOAD_CONGRATS: {
    transporter: 'sales',
    generator: (data: EmailTemplates['DOWNLOAD_CONGRATS']) => ({
      to: data.email,
      subject: `Congratulations on Your ${data.algoName} Download! 🎉`,
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://tachysvps.com/logo.png" alt="Tachys VPS Logo" width="60" height="60" style="margin: 0 auto; border-radius: 12px; object-fit: cover;">
          </div>
          <div style="text-align: center; margin-bottom: 35px;">
            <p style="font-size: 18px; color: #7A49B7; font-weight: 600; margin: 0;">Thank You for Choosing Tachys VPS</p>
          </div>

          <div style="background: linear-gradient(135deg, #8A56C3 0%, #7A49B7 100%); border-radius: 16px; padding: 35px; color: white; text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; margin: 0 0 15px 0; font-weight: 700;">
              Download Complete! 🎉
            </h1>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">
              Your journey with ${data.algoName} begins now
            </p>
          </div>

          <div style="margin: 30px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">Thank you for downloading <strong>${data.algoName}</strong>! We're thrilled to be part of your trading journey and are dedicated to providing you with exceptional trading tools and support.</p>

            <div style="background: #F9F5FF; border: 1px solid #E9D8FD; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #7A49B7; margin: 0 0 20px 0; font-size: 20px;">🌟 Exclusive Seller Opportunity</h3>
              <p style="color: #4A5568; margin: 0 0 20px 0;">Transform your trading expertise into a profitable venture:</p>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Generate passive income through algorithm sales
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Access dedicated seller support
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Be part of an elite trading community
                </li>
              </ul>
            </div>

            <div style="background: #7A49B7; border-radius: 16px; padding: 30px; margin: 35px 0; text-align: center;">
              <h2 style="color: white; margin: 0 0 15px 0; font-size: 22px;">Share Your Experience ⭐</h2>
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0;">
                Help fellow traders make informed decisions by sharing your experience
              </p>
              <a href="${data.productUrl}" 
                style="display: inline-block; background: white; color: #7A49B7; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                Write a Review
              </a>
            </div>

            <div style="background: #F7FAFC; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #7A49B7; margin: 0 0 20px 0; font-size: 20px;">🎁 Refer & Earn Rewards</h3>
              <p style="color: #4A5568; margin: 0 0 20px 0;">Share success, earn rewards:</p>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Earn 10% commission per referral
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Your referrals get 10% off
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> $5 bonus for first 3 referrals
                </li>
              </ul>
              <a href="https://tachysvps.com/v6/affiliates" 
                style="display: inline-block; background: #7A49B7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; transition: all 0.3s ease;">
                Join Referral Program
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">Our 24/7 support team is here to ensure your success. Don't hesitate to reach out if you need any assistance!</p>

            <p style="margin-top: 35px; color: #2D3748;">
              Best regards,<br>
              <strong style="color: #7A49B7;">The Tachys VPS Team</strong>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #E2E8F0; text-align: center;">
            <p style="color: #718096; font-size: 14px;">This is an automated message. Please do not reply.<br>
            For support: <a href="mailto:support@tachysvps.com" style="color: #7A49B7; text-decoration: none;">support@tachysvps.com</a></p>
            
            <div style="margin-top: 20px;">
              <a href="https://twitter.com/tachysvps" style="color: #718096; text-decoration: none; margin: 0 10px; display: inline-flex; align-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/tachysvps" style="color: #718096; text-decoration: none; margin: 0 10px; display: inline-flex; align-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `
    })
  },

  PREMIUM_PAYMENT_SUCCESS: {
    transporter: 'sales',
    generator: (data: EmailTemplates['PREMIUM_PAYMENT_SUCCESS']) => ({
      to: data.email,
      subject: 'Welcome to Premium Membership! 🌟',
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://tachysvps.com/logo.png" alt="Tachys VPS Logo" width="60" height="60" style="margin: 0 auto; border-radius: 12px; object-fit: cover;">
          </div>

          <div style="background: linear-gradient(135deg, #8A56C3 0%, #7A49B7 100%); border-radius: 16px; padding: 35px; color: white; text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; margin: 0 0 15px 0; font-weight: 700;">
              Welcome to Premium! 🎉
            </h1>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">
              Your ${data.plan.months}-month premium membership is now active
            </p>
          </div>

          <div style="margin: 30px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              Thank you for upgrading to Premium! Your payment of $${data.plan.price} has been successfully processed. 
              You now have access to all premium features and benefits.
            </p>

            <div style="background: #F9F5FF; border: 1px solid #E9D8FD; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #7A49B7; margin: 0 0 20px 0; font-size: 20px;">🌟 Your Premium Benefits</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Unlimited Free Algorithm Downloads
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Weekly Best Performing Algorithm Newsletter
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">✓</span> Early Access to New Algorithms
                </li>
              </ul>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://tachysvps.com/v6/dashboard" 
                style="display: inline-block; background: #7A49B7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                Explore Premium Features
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              If you have any questions about your premium membership or need assistance, our support team is here to help 24/7.
            </p>

            <p style="margin-top: 35px; color: #2D3748;">
              Best regards,<br>
              <strong style="color: #7A49B7;">The Tachys VPS Team</strong>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #E2E8F0; text-align: center;">
            <p style="color: #718096; font-size: 14px;">
              For support: <a href="mailto:support@tachysvps.com" style="color: #7A49B7; text-decoration: none;">support@tachysvps.com</a>
            </p>
          </div>
        </div>
      `
    })
  },

  PREMIUM_PAYMENT_FAILED: {
    transporter: 'sales',
    generator: (data: EmailTemplates['PREMIUM_PAYMENT_FAILED']) => ({
      to: data.email,
      subject: 'Premium Membership Payment Failed',
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://tachysvps.com/logo.png" alt="Tachys VPS Logo" width="60" height="60" style="margin: 0 auto; border-radius: 12px; object-fit: cover;">
          </div>

          <div style="background: #FEF2F2; border-radius: 16px; padding: 35px; color: #991B1B; text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; margin: 0 0 15px 0; font-weight: 700;">
              Payment Failed
            </h1>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">
              We couldn't process your premium membership payment
            </p>
          </div>

          <div style="margin: 30px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              We're sorry, but we couldn't process your payment of $${data.plan.price} for the ${data.plan.months}-month premium membership.
              ${data.error ? `<br><br>Error: ${data.error}` : ''}
            </p>

            <div style="background: #F9F5FF; border: 1px solid #E9D8FD; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #7A49B7; margin: 0 0 20px 0; font-size: 20px;">What to do next?</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">1.</span> Check your payment method details
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">2.</span> Ensure sufficient funds are available
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">3.</span> Try again or use a different payment method
                </li>
              </ul>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://tachysvps.com/v6/account" 
                style="display: inline-block; background: #7A49B7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                Try Again
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              If you continue to experience issues or need assistance, please don't hesitate to contact our support team.
            </p>

            <p style="margin-top: 35px; color: #2D3748;">
              Best regards,<br>
              <strong style="color: #7A49B7;">The Tachys VPS Team</strong>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #E2E8F0; text-align: center;">
            <p style="color: #718096; font-size: 14px;">
              For support: <a href="mailto:support@tachysvps.com" style="color: #7A49B7; text-decoration: none;">support@tachysvps.com</a>
            </p>
          </div>
        </div>
      `
    })
  },

  VPS_PAYMENT_SUCCESS: {
    transporter: 'sales',
    generator: (data: EmailTemplates['VPS_PAYMENT_SUCCESS']) => ({
      to: data.email,
      subject: 'Your VPS Order is Confirmed! 🚀',
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://tachysvps.com/logo.png" alt="Tachys VPS Logo" width="60" height="60" style="margin: 0 auto; border-radius: 12px; object-fit: cover;">
          </div>

          <div style="background: linear-gradient(135deg, #8A56C3 0%, #7A49B7 100%); border-radius: 16px; padding: 35px; color: white; text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; margin: 0 0 15px 0; font-weight: 700;">
              Order Confirmed! 🎉
            </h1>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">
              Your VPS server${data.vpsDetails.quantity > 1 ? 's are' : ' is'} being set up
            </p>
          </div>

          <div style="margin: 30px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              Thank you for choosing Tachys VPS! Your payment of $${data.vpsDetails.price} has been successfully processed. 
              We're now setting up your VPS server${data.vpsDetails.quantity > 1 ? 's' : ''}.
            </p>

            <div style="background: #F9F5FF; border: 1px solid #E9D8FD; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #7A49B7; margin: 0 0 20px 0; font-size: 20px;">🖥️ Your VPS Details</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Plan:</span>
                  <strong>${data.vpsDetails.plan}</strong>
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Quantity:</span>
                  <strong>${data.vpsDetails.quantity} Server${data.vpsDetails.quantity > 1 ? 's' : ''}</strong>
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Duration:</span>
                  <strong>${data.vpsDetails.duration}</strong>
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Region:</span>
                  <strong>${data.vpsDetails.region}</strong>
                </li>
              </ul>
            </div>

            ${data.vpsDetails.serverCredentials ? `
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #15803D; margin: 0 0 20px 0; font-size: 20px;">🔐 Server Credentials</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #374151; display: flex; justify-content: space-between;">
                  <span>Username:</span>
                  <strong>${data.vpsDetails.serverCredentials.username}</strong>
                </li>
                <li style="margin: 12px 0; color: #374151; display: flex; justify-content: space-between;">
                  <span>Password:</span>
                  <strong>${data.vpsDetails.serverCredentials.password}</strong>
                </li>
              </ul>
              <p style="margin: 20px 0 0 0; font-size: 14px; color: #374151;">
                Please save these credentials securely. For security reasons, we recommend changing your password after first login.
              </p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://tachysvps.com/v6/dashboard/vps" 
                style="display: inline-block; background: #7A49B7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                View Server Details
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              Your server${data.vpsDetails.quantity > 1 ? 's' : ''} will be ready shortly. You'll receive another email once the setup is complete.
              If you need any assistance, our support team is available 24/7.
            </p>

            <p style="margin-top: 35px; color: #2D3748;">
              Best regards,<br>
              <strong style="color: #7A49B7;">The Tachys VPS Team</strong>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #E2E8F0; text-align: center;">
            <p style="color: #718096; font-size: 14px;">
              For support: <a href="mailto:support@tachysvps.com" style="color: #7A49B7; text-decoration: none;">support@tachysvps.com</a>
            </p>
          </div>
        </div>
      `
    })
  },

  VPS_PAYMENT_FAILED: {
    transporter: 'sales',
    generator: (data: EmailTemplates['VPS_PAYMENT_FAILED']) => ({
      to: data.email,
      subject: 'VPS Order Payment Failed',
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://tachysvps.com/logo.png" alt="Tachys VPS Logo" width="60" height="60" style="margin: 0 auto; border-radius: 12px; object-fit: cover;">
          </div>

          <div style="background: #FEF2F2; border-radius: 16px; padding: 35px; color: #991B1B; text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; margin: 0 0 15px 0; font-weight: 700;">
              Payment Failed
            </h1>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">
              We couldn't process your VPS order payment
            </p>
          </div>

          <div style="margin: 30px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              We're sorry, but we couldn't process your payment of $${data.vpsDetails.price} for your VPS order.
              ${data.error ? `<br><br>Error: ${data.error}` : ''}
            </p>

            <div style="background: #F9F5FF; border: 1px solid #E9D8FD; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #7A49B7; margin: 0 0 20px 0; font-size: 20px;">🖥️ Order Details</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Plan:</span>
                  <strong>${data.vpsDetails.plan}</strong>
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Quantity:</span>
                  <strong>${data.vpsDetails.quantity} Server${data.vpsDetails.quantity > 1 ? 's' : ''}</strong>
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Duration:</span>
                  <strong>${data.vpsDetails.duration}</strong>
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; justify-content: space-between;">
                  <span>Region:</span>
                  <strong>${data.vpsDetails.region}</strong>
                </li>
              </ul>
            </div>

            <div style="background: #F9F5FF; border: 1px solid #E9D8FD; border-radius: 16px; padding: 30px; margin: 35px 0;">
              <h3 style="color: #7A49B7; margin: 0 0 20px 0; font-size: 20px;">What to do next?</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">1.</span> Check your payment method details
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">2.</span> Ensure sufficient funds are available
                </li>
                <li style="margin: 12px 0; color: #4A5568; display: flex; align-items: center;">
                  <span style="color: #7A49B7; margin-right: 10px;">3.</span> Try again or use a different payment method
                </li>
              </ul>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://tachysvps.com/v6/vps" 
                style="display: inline-block; background: #7A49B7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                Try Again
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #2D3748;">
              If you continue to experience issues or need assistance, please don't hesitate to contact our support team.
            </p>

            <p style="margin-top: 35px; color: #2D3748;">
              Best regards,<br>
              <strong style="color: #7A49B7;">The Tachys VPS Team</strong>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #E2E8F0; text-align: center;">
            <p style="color: #718096; font-size: 14px;">
              For support: <a href="mailto:support@tachysvps.com" style="color: #7A49B7; text-decoration: none;">support@tachysvps.com</a>
            </p>
          </div>
        </div>
      `
    })
  }
};

// Update the from email logic to handle all transporter types
const getFromEmail = (transporterType: keyof typeof transporters) => {
  switch (transporterType) {
    case 'founder':
      return process.env.FOUNDER_EMAIL_USER;
    case 'sales':
      return process.env.SALES_EMAIL_USER;
    case 'notifications':
      return process.env.NOTIFICATIONS_EMAIL_USER;
    default:
      return process.env.EMAIL_USER;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { template, data } = await request.json();

    // Type check for template
    if (!template || !data || !templates[template as TemplateType]) {
      return NextResponse.json(
        { error: 'Invalid template or data' },
        { status: 400 }
      );
    }

    const templateConfig = templates[template as TemplateType];
    const emailContent = templateConfig.generator(data);
    
    // Use the correct from email based on the transporter type
    const fromEmail = getFromEmail(templateConfig.transporter);
    const fromName = (() => {
      switch (templateConfig.transporter) {
        case 'founder':
          return 'TachysVPS Founder';
        case 'sales':
          return 'TachysVPS Sales';
        case 'notifications':
          return 'TachysVPS Notifications';
        default:
          return 'TachysVPS Support';
      }
    })();

    await transporters[templateConfig.transporter].sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      ...emailContent
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 


// Sample Usage
// 1. Contact Form (existing):
// ```typescript
// fetch('/api/contact', {
//   method: 'POST',
//   body: JSON.stringify({
//     template: 'CONTACT',
//     data: {
//       name: 'John Doe',
//       email: 'john@example.com',
//       subject: 'Technical Support',
//       message: 'Hello...'
//     }
//   })
// });
// ```


// 2. Welcome Email:
// ```typescript
// fetch('/api/contact', {
//   method: 'POST',
//   body: JSON.stringify({
//     template: 'WELCOME',
//     data: {
//       name: 'John Doe',
//       email: 'john@example.com'
//     }
//   })
// });
// ```


// 3. Password Reset: 
// ```typescript
// fetch('/api/contact', {
//   method: 'POST',
//   body: JSON.stringify({
//     template: 'RESET_PASSWORD',
//     data: {
//       email: 'john@example.com',
//       resetLink: 'https://yoursite.com/reset-password?token=xyz'
//     }
//   })
// });
// ```


// 4. Custom Notification:
// ```typescript
// fetch('/api/contact', {
//   method: 'POST',
//   body: JSON.stringify({
//     template: 'NOTIFICATION',
//     data: {
//       email: 'john@example.com',
//       title: 'New Feature Available',
//       message: 'Check out our latest feature...'
//     }
//   })
// });
// ```