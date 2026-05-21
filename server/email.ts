import { Resend } from "resend";
import type { Booking } from "../drizzle/schema.js";

const OWNER_EMAIL = "towerslutz@gmail.com";
const CASHAPP_HANDLE = "$marlz720";
const RETAINER_AMOUNT = "$50";

function bookingEmailHtml(booking: Booking): string {
  return `
    <h2>New booking request</h2>
    <p><strong>Name:</strong> ${booking.name}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Address:</strong> ${booking.address}</p>
    <p><strong>Service:</strong> ${booking.serviceType}</p>
    <p><strong>Preferred date:</strong> ${booking.preferredDate}</p>
    <p><strong>Preferred time:</strong> ${booking.preferredTime}</p>
    <p><strong>Notes:</strong> ${booking.notes || "None"}</p>
    <p><strong>Retainer:</strong> ${RETAINER_AMOUNT} via CashApp ${CASHAPP_HANDLE}</p>
  `;
}

export async function sendNewBookingEmail(booking: Booking): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not configured; booking email skipped");
    return false;
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Marlene's Cleaning Services <onboarding@resend.dev>",
    to: OWNER_EMAIL,
    subject: `New booking: ${booking.serviceType} for ${booking.name}`,
    html: bookingEmailHtml(booking),
    replyTo: booking.email,
  });

  if (result.error) {
    console.error("[email] Resend failed:", result.error.message);
    return false;
  }

  return true;
}
