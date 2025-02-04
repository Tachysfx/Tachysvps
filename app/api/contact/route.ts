import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

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
}

// Template generators with proper typing
const templates: {
  [K in TemplateType]: (data: EmailTemplates[K]) => {
    to: string;
    subject: string;
    html: string;
  };
} = {
  CONTACT: (data: EmailTemplates['CONTACT']) => ({
    to: 'michaelgenesis26@gmail.com',
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
  }),

  WELCOME: (data: EmailTemplates['WELCOME']) => ({
    to: data.email,
    subject: 'Welcome to Our Platform!',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #7A49B7; border-bottom: 2px solid #7A49B7; padding-bottom: 10px; margin-top: 0;">
          Welcome, ${data.name}!
        </h2>
        <div style="margin: 25px 0;">
          <p>We're excited to have you on board.</p>
          <p>Get started by exploring our platform...</p>
        </div>
      </div>
    `
  }),

  RESET_PASSWORD: (data: EmailTemplates['RESET_PASSWORD']) => ({
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
  }),

  NOTIFICATION: (data: EmailTemplates['NOTIFICATION']) => ({
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

    const emailContent = templates[template as TemplateType](data);
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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