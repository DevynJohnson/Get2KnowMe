import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to, resetLink) {
  try {
    const response = await resend.emails.send({
      from: 'no-reply@get2know.me',
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="width:100%;background:#f4f4f4;padding:32px 0;text-align:center;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;padding:32px 24px 24px 24px;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.07);text-align:center;">
            <div style="margin-bottom:24px;">
              <img src="https://get2know.me/get2knowme_logo_png.png" alt="Get2KnowMe Logo" style="height:90px;margin-bottom:8px;" />
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

export async function sendParentalConsentEmail(childEmail, childUsername, parentEmail, consentToken) {
  console.log('sendParentalConsentEmail called with:', { childEmail, childUsername, parentEmail });
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing or undefined!');
    throw new Error('Email service is not configured. Please set RESEND_API_KEY.');
  } else {
    console.log('RESEND_API_KEY is present, length:', process.env.RESEND_API_KEY.length);
  }

  const consentHtml = `
   <div style="width:100%;background:#f4f4f4;padding:32px 0;text-align:center;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;padding:32px 24px 24px 24px;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.07);text-align:center;">
      <div style="margin-bottom:24px;text-align:center;">
        <img src="https://get2knowme/get2knowme_logo_png.png" alt="Get2KnowMe Logo" style="height:90px;margin-bottom:8px;" />
        <h2 style="margin:0;font-size:1.6rem;color:#2a2a2a;text-align:center;">Get2KnowMe</h2>
      </div>
      <h3 style="color:#2a2a2a;font-size:1.2rem;margin-bottom:16px;text-align:center;">Parental Consent Request for Creating An Account on Get2KnowMe</h3>
      <p style="text-align:center;">A new user has indicated that you are their parent or guardian and is requesting your consent to use Get2KnowMe. We have put their account creation on hold until you have provided your consent using the button at the bottom of this email message. Please read the following information carefully. The new user indicating that you are their parent or guardian is attempting to sign up using the following username and password:</p>
      <ul style="display:inline-block;text-align:left;margin:auto;">
        <li><strong>Child's Email:</strong> ${childEmail}</li>
        <li><strong>Child's Username:</strong> ${childUsername}</li>
      </ul>
      <div style="text-align:center;">
        <h2 style="font-size:1.1rem;margin:24px 0 8px 0;text-align:center;">What is Get2KnowMe?</h2>
        <p style="margin-bottom:12px;text-align:center;">Get2KnowMe is made for being understood and its purpose is to help people be seen for who they are - not just their diagnosis.</p>
        <p style="margin-bottom:12px;text-align:center;">Together we can make communication fairer, kinder, and more human. Get2KnowMe provides a simple and secure platform that helps people communicate their needs, preferences, and personality - especially when words are difficult to find.</p>
        <p style="margin-bottom:12px;text-align:center;">It's designed for neurodivergent individuals, people with communication differences, or anybody who wants to be better understood.</p>
        <p style="margin-bottom:12px;text-align:center;">With Get2KnowMe, you can create a Digital Communication Passport: a personalized profile that explains how you communicate, any adaptations or accommodations you need, and what support is helpful for you, as well as the things that make you feel safe, seen and heard.</p>
        <p style="margin-bottom:12px;text-align:center;">Each passport comes with a unique QR code, allowing you to easily share your information with teachers, healthcare workers, emergency workers, employers, caregivers, friends, or anyone you meet.</p>
        <a href="https://get2know.me" target="_blank" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;margin-top:12px;">Visit Our Site Here</a>
      </div>
      <p style="text-align:center;">By giving your consent, you attest that you are the parent or guardian of the user indicated above. You attest that you have read the <a href="https://get2know.me/policy/UserInfo" target="_blank">Privacy Policy</a> and <a href="https://get2know.me/policy/terms-of-service" target="_blank">Terms of Service</a> and consent to allowing Get2KnowMe to collect and use this user's data as is outlined in those documents.</p>
      <p style="margin-top:24px;text-align:center;">
        <a href="https://get2know.me/api/users/consent?token=${encodeURIComponent(consentToken)}" target="_blank" style="display:inline-block;padding:12px 28px;background:#28a745;color:#fff;text-decoration:none;font-weight:bold;border-radius:5px;margin-right:12px;">I Consent</a>
        <a href="https://get2know.me/api/users/consent/declined?token=${encodeURIComponent(consentToken)}" target="_blank" style="display:inline-block;padding:12px 28px;background:#dc3545;color:#fff;text-decoration:none;font-weight:bold;border-radius:5px;">I Do Not Consent</a>
      </p>
    </div>
  </div>
  `;
  try {
    const response = await resend.emails.send({
      from: 'Get2KnowMe <no-reply@get2know.me>',
      to: parentEmail,
      subject: 'Parental Consent Request for Get2KnowMe',
      html: consentHtml
    });
    console.log('Resend API response (parental consent):', response);
    return response;
  } catch (error) {
    console.error('Resend API error (parental consent):', error);
    throw error;
  }
}