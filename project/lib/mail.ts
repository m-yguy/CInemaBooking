// lib/mail.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = "cinemabookingsystemxyz@gmail.com";

export async function sendPasswordChangedEmail(
  toEmail: string,
  firstName: string,
) {
  try {
    await sgMail.send({
      to: toEmail,
      from: FROM_EMAIL,
      subject: "Security Alert: Your Password Was Changed",
      text: `Hello ${firstName}, your account password was recently changed. If you did not make this change, please contact support immediately.`,
      html: `<p>Hello ${firstName},</p><p>Your cinema account password was recently changed. If you did not make this change, please secure your account immediately.</p>`,
    });
  } catch (error) {
    console.error("Failed to send password changed email:", error);
  }
}

export async function sendProfileUpdatedEmail(
  toEmail: string,
  firstName: string,
  changes: string[],
) {
  const changeList = changes.map((c) => `<li>${c}</li>`).join("");
  try {
    await sgMail.send({
      to: toEmail,
      from: FROM_EMAIL,
      subject: "Your Account Profile Was Updated",
      text: `Hello ${firstName}, the following profile fields were recently updated: ${changes.join(", ")}. If you did not make these changes, please contact support.`,
      html: `<p>Hello ${firstName},</p><p>The following profile fields were recently updated on your account:</p><ul>${changeList}</ul><p>If you did not make these changes, please contact support immediately.</p>`,
    });
  } catch (error) {
    console.error("Failed to send profile updated email:", error);
  }
}
