import nodemailer from 'nodemailer';
import db from '@/app/lib/db';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- 1. Save subscriber to Turso database ---
    // Assumes a table "subscribers" exists with columns:
    // email TEXT PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    await db.execute({
      sql: 'INSERT OR IGNORE INTO subscribers (email) VALUES (?)',
      args: [email],
    });

    // --- 2. Send welcome email ---
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Family House SuperMarket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Family House SuperMarket!',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #4b70f5;">Welcome to Family House SuperMarket!</h2>
              <p style="font-size: 16px; line-height: 1.6;">Dear New Customer,</p>
              <p style="font-size: 16px; line-height: 1.6;">
                We are genuinely delighted to welcome you to the Steve-Obizz-Store. Your subscription marks the beginning of an exciting journey, and we couldn't be more thrilled to have you join us.
              </p>
              <div style="margin-top: 20px; text-align: center;">
                <img src="https://plus.unsplash.com/premium_photo-1661381007965-b21e0fb0681b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN1cGVybWFya2V0fGVufDB8fDB8fHww" alt="Premium stationery" style="width: 100%; max-width: 500px; border-radius: 10px;">
              </div>
              <p style="font-size: 16px; line-height: 1.6;">
                As a valued member, you can look forward to receiving carefully curated content, exclusive offers, and first access to our latest product launches—directly in your inbox. Our goal is to enrich your experience, bringing you not only premium Supplies but also creative inspiration that elevates your day-to-day.
              </p>
              <div style="margin-top: 20px; text-align: center;">
                <img src="https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VwZXJtYXJrZXR8ZW58MHx8MHx8fDA%3D" alt="Office supplies" style="width: 100%; max-width: 500px; border-radius: 10px;">
              </div>
              <p style="font-size: 16px; line-height: 1.6;">
                Your welcome email has been sent to ${email}.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                With each communication, we aim to bring you closer to products that embody the highest standards of quality, craftsmanship, and innovation. Whether you are seeking practical solutions, elegant designs, or unique gifts, we’re committed to ensuring that your time with us is nothing short of exceptional.
              </p>
              <div style="margin-top: 20px; text-align: center;">
                <a href="https://family-house-supermarket.com" style="display: inline-block; background-color: #4b70f5; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Shop Now</a>
              </div>
              <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #666;">
                <p>Warm regards,<br>The Family House SuperMarket Team</p>
                <p>198C Governor's Road, Ikotun, Lagos, Nigeria</p>
                <p>+234 704 401 2151<br>${process.env.EMAIL_USER}</p>
              </footer>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);

    return new Response(
      JSON.stringify({
        message: 'Subscription successful! Welcome email sent.',
        email,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Subscribe API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process subscription' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}