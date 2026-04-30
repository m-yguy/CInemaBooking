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
    subject: "Confirm Your Cinema Booking Account",
    text: `Hello ${firstName} ${lastName},\n\nPlease confirm your Cinema Booking account by clicking the link below:\n\n${verifyUrl}\n\nIf you did not request this email, you can ignore it.`,
    html: `<p>Hello ${firstName} ${lastName},</p><p>Please confirm your Cinema Booking account by clicking the link below:</p><p><a href="${verifyUrl}">Confirm your account</a></p><p>If you did not request this email, you can ignore it.</p>`,

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

export async function sendBookingConfirmationEmail(
  toEmail: string,
  firstName: string,
  booking: {
    title: string;
    time: string;
    selectedSeats: string[];
    quantities: { adult: number; child: number; senior: number };
    total: number;
    posterUrl?: string | null;
    showId?: string | null;
  },
) {
  const seats = booking.selectedSeats.join(", ");
  const ticketParts: string[] = [];
  if (booking.quantities.adult > 0) {
    ticketParts.push(
      `${booking.quantities.adult}x adult ticket${booking.quantities.adult > 1 ? "s" : ""}`,
    );
  }
  if (booking.quantities.child > 0) {
    ticketParts.push(
      `${booking.quantities.child}x child ticket${booking.quantities.child > 1 ? "s" : ""}`,
    );
  }
  if (booking.quantities.senior > 0) {
    ticketParts.push(
      `${booking.quantities.senior}x senior ticket${booking.quantities.senior > 1 ? "s" : ""}`,
    );
  }
  const tickets = ticketParts.length ? ticketParts.join(", ") : "0 tickets";
  const bookingRef = `CB-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  const subject = `🎟️ Booking Confirmation — ${booking.title} (${booking.time})`;

  const text =
    `Hello ${firstName},\n\n` +
    `Thank you for your booking for ${booking.title} at ${booking.time}.\n\n` +
    `Booking reference: ${bookingRef}\n` +
    `Seats: ${seats}\n` +
    `Tickets: ${tickets}\n` +
    `Total: $${booking.total.toFixed(2)}\n\n` +
    `Please present this email or your booking reference at the venue on arrival. Enjoy the movie!`;

  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.4">` +
    `<div style="background:#e50914;padding:18px 16px;border-radius:8px 8px 0 0;text-align:center;color:#fff">` +
    `<h1 style="margin:0;font-size:18px">Cinema Booking</h1>` +
    `<div style="opacity:0.95;margin-top:6px;font-size:13px">Booking Confirmation</div>` +
    `</div>` +
    `<div style="background:#fff;border:1px solid #eee;padding:18px;border-radius:0 0 8px 8px">` +
    `<h2 style="color:#e50914;margin:0 0 8px">${booking.title}</h2>` +
    `${
      booking.time
        ? `<p style="margin:0 0 12px">Showtime: ${booking.time}</p>`
        : ""
    }` +
    `${
      booking.posterUrl
        ? `<div style="text-align:center;margin:8px 0">
             <img src="${booking.posterUrl}" alt="${booking.title}" style="max-width:160px;border-radius:6px"/>
           </div>`
        : ""
    }` +
    `<table style="width:100%;border-collapse:collapse;margin:12px 0">` +
    `<tr style="border-bottom:1px solid #f3f3f3">
           <td style="padding:8px;font-weight:600;width:30%">Booking ref</td>
           <td style="padding:8px">${bookingRef}</td>
         </tr>` +
    `<tr style="border-bottom:1px solid #f3f3f3">
           <td style="padding:8px;font-weight:600">Seats</td>
           <td style="padding:8px">${seats || "N/A"}</td>
         </tr>` +
    `<tr style="border-bottom:1px solid #f3f3f3">
           <td style="padding:8px;font-weight:600">Tickets</td>
           <td style="padding:8px">${tickets}</td>
         </tr>` +
    `<tr>
           <td style="padding:8px;font-weight:600">Total</td>
           <td style="padding:8px">$${booking.total.toFixed(2)}</td>
         </tr>` +
    `</table>` +
    `<p style="margin:12px 0">
         Please present this email or your booking reference at the venue on arrival. Enjoy the movie!
       </p>` +
    `<p style="font-size:12px;color:#666;margin-top:12px">
         Questions? Reply to this email or visit our help center.
       </p>` +
    `</div>` +
    `</div>`;

  try {
    await sgMail.send({ to: toEmail, from: FROM_EMAIL, subject, text, html });
  } catch (error) {
    console.error(`Failed to send booking confirmation to ${toEmail}:`, error);
  }
}
