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

export async function sendVerificationEmail(
  toEmail: string,
  firstName: string,
  lastName: string,
  verifyUrl: string,
) {
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    templateId: "d-ccc0d92738fc40999081974c0dee0aaf",
    dynamicTemplateData: { firstName, lastName, verifyUrl },
  });
}

export async function sendPasswordResetEmail(
  toEmail: string,
  firstName: string,
  lastName: string,
  resetUrl: string,
) {
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: "Reset Your Password",
    text: `Hello ${firstName} ${lastName},\n\nClick the link below to reset your Cinema Booking password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `<p>Hello ${firstName} ${lastName},</p><p>Click the link below to reset your Cinema Booking password. This link expires in <strong>1 hour</strong>.</p><p><a href="${resetUrl}">Reset Password</a></p><p>If you did not request this, you can safely ignore this email.</p>`,
  });
}

export async function sendPromotionEmail(
  toEmail: string,
  firstName: string,
  promotion: {
    title: string;
    description: string;
    promoCode: string;
    discountType: "PERCENTAGE" | "FLAT";
    discountAmount: number;
    startDate: string;
    endDate: string;
  },
) {
  const discountLabel =
    promotion.discountType === "PERCENTAGE"
      ? `${promotion.discountAmount}% off`
      : `$${promotion.discountAmount.toFixed(2)} off`;

  const subject = `🎬 Exclusive Offer: ${promotion.title}`;

  const text =
    `Hello ${firstName},\n\n` +
    `We have an exclusive promotion just for you!\n\n` +
    `${promotion.title}\n` +
    `${promotion.description ? promotion.description + "\n\n" : ""}` +
    `Discount: ${discountLabel}\n` +
    `Promo Code: ${promotion.promoCode}\n` +
    `Valid: ${promotion.startDate} – ${promotion.endDate}\n\n` +
    `Use this code at checkout and enjoy the savings. See you at the movies!`;

  const html =
    `<p>Hello ${firstName},</p>` +
    `<p>We have an exclusive promotion just for you!</p>` +
    `<h2 style="color:#e50914">${promotion.title}</h2>` +
    (promotion.description ? `<p>${promotion.description}</p>` : "") +
    `<table style="border-collapse:collapse;margin:16px 0">` +
    `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Discount</td><td>${discountLabel}</td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Promo Code</td><td><strong style="font-size:1.1em;letter-spacing:2px">${promotion.promoCode}</strong></td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Valid</td><td>${promotion.startDate} – ${promotion.endDate}</td></tr>` +
    `</table>` +
    `<p>Use this code at checkout and enjoy the savings. See you at the movies!</p>`;

  try {
    await sgMail.send({ to: toEmail, from: FROM_EMAIL, subject, text, html });
  } catch (error) {
    console.error(`Failed to send promotion email to ${toEmail}:`, error);
  }
}
