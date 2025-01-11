import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    console.log("Request received at /api/hr/send-email");

    const body = await req.json();
    console.log("Parsed request body:", body);

    const { email, subject, message } = body;

    // Validate request data
    if (!email || !subject || !message) {
      console.error("Validation error: Missing required fields");
      return NextResponse.json(
        { error: 'Email, subject, and message are required.' },
        { status: 400 }
      );
    }

    console.log("Sending email to:", email);

    // Configure Nodemailer with Mailtrap
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: '"Automated Candidate Screening" <no-reply@yourdomain.com>',
      to: email,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error.message || error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}
