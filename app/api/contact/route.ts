import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import db from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // --- Validate required fields ---
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }   

    // --- Save inquiry to Turso database ---
    await db.execute({
      sql: 'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
      args: [name, email, phone || null, message || null],
    });

    // --- Optional WhatsApp notification (skip if Twilio env vars missing) ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let whatsappPromise: Promise<any> = Promise.resolve();

    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      whatsappPromise = client.messages.create({
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:+2347044012151`, // Owner's WhatsApp number
        body: `🚀 New Web Inquiry\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
      });
    } else {
      console.warn('⚠️ Twilio credentials missing – WhatsApp notification skipped');
    }

    // --- Send confirmation email to customer ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Family House SuperMarket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We received your inquiry, ${name}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #FFFFFF; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1e3a8a;">Hello ${name},</h2>
          <p>Thank you for reaching out to <strong>Family House SuperMarket</strong>. We have received your message and our team will get back to you shortly.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your Message:</strong></p>
            <p style="font-style: italic; color: #4b5563;">"${message}"</p>
          </div>
          <p>If you need immediate assistance, feel free to call us at +234 704 401 2151.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">Family House SuperMarket - 198C Governor's Road, Ikotun, Lagos, Nigeria</p>
        </div>
      `,
    };

    // --- Execute both tasks concurrently ---
    await Promise.all([whatsappPromise, transporter.sendMail(mailOptions)]);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('❌ Contact API Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}