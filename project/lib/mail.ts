// lib/mail.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendProfileUpdateEmail(toEmail: string, userName: string) {
  const msg = {
    to: toEmail,
    from: 'your-verified-sender@domain.com', // Must be verified in SendGrid
    subject: 'Security Alert: Profile Updated',
    text: `Hello ${userName}, your profile information was recently updated. If you did not make this change, please contact support immediately.`,
    html: `<strong>Hello ${userName},</strong><p>Your cinema account profile information was recently updated. If you did not make this change, please secure your account.</p>`,
  };

  try {   // sending mail
    await sgMail.send(msg);
  } catch (error) {
    console.error("Email failed to send:", error);
  }
}