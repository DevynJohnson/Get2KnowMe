import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendPasswordResetEmail(userEmail, resetLink) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing or undefined!');
    throw new Error('Email service is not configured. Please set RESEND_API_KEY.');
  }
  const passwordResetHTML = `
    <div style="width:100%;background:#f4f4f4;padding:32px 0;text-align:center;">
      <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;padding:32px 24px 24px 24px;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.07);text-align:center;">
        <div style="margin-bottom:24px;text-align:center;">
          <img src="https://get2know.me/get2knowme_logo_png.png" alt="Get2KnowMe Logo" style="height:90px;margin-bottom:8px;" />
          <h2 style="margin:0;font-size:1.6rem;color:#2a2a2a;text-align:center;">Get2KnowMe</h2>
        </div>
        <h3 style="color:#2a2a2a;font-size:1.2rem;margin-bottom:16px;text-align:center;">Password Reset Request</h3>
        <p style="color:#444;line-height:1.6;">You requested a password reset for your Get2KnowMe account.</p>
        <div style="margin:32px 0;">
          <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1rem;">Reset Password</a>
        </div>
        <p style="color:#888;font-size:0.95rem;">If you did not request this, you can safely ignore this email.</p>
        <hr style="margin:32px 0 16px 0;border:none;border-top:1px solid #eee;" />
        <p style="color:#bbb;font-size:0.85rem;">&copy; ${new Date().getFullYear()} Get2KnowMe. All rights reserved.</p>
      </div>
    </div>
  `;
  try {
    const response = await resend.emails.send({
      from: 'Get2KnowMe <no-reply@get2know.me>',
      to: userEmail,
      subject: 'Password Reset Request for Get2KnowMe',
      html: passwordResetHTML
    });
    return response;
  } catch (error) {
    console.error('Resend API error (passwordReset):', error);
    throw error;
  }
}