import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to, resetLink) {
  try {
    const response = await resend.emails.send({
      from: 'no-reply@get2know.me',
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;padding:32px 24px 24px 24px;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.07);text-align:center;">
          <div style="margin-bottom:24px;">
            
            <h2 style="margin:0;font-size:1.6rem;color:#2a2a2a;">Get2KnowMe</h2>
          </div>
          <h3 style="color:#2a2a2a;font-size:1.2rem;margin-bottom:16px;">Password Reset Request</h3>
          <p style="color:#444;line-height:1.6;">You requested a password reset for your Get2KnowMe account.</p>
          <div style="margin:32px 0;">
            <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1rem;">Reset Password</a>
          </div>
          <p style="color:#888;font-size:0.95rem;">If you did not request this, you can safely ignore this email.</p>
          <hr style="margin:32px 0 16px 0;border:none;border-top:1px solid #eee;" />
          <p style="color:#bbb;font-size:0.85rem;">&copy; ${new Date().getFullYear()} Get2KnowMe. All rights reserved.</p>
        </div>
      `,
    });
    console.log('Resend API response:', response);
    return response;
  } catch (error) {
    console.error('Resend API error:', error);
    throw error;
  }
}