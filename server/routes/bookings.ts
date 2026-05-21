import { Router } from "express";
import { createBooking } from "../db.js";
import { sendNewBookingEmail } from "../email.js";
import { createBookingSchema } from "../validation.js";

export const bookingRoutes = Router();

bookingRoutes.post("/", async (req, res, next) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid booking input", issues: parsed.error.flatten() });
      return;
    }

    const input = parsed.data;
    const booking = await createBooking({
      name: input.name,
      phone: input.phone,
      email: input.email,
      address: input.address,
      serviceType: input.service_type,
      preferredDate: input.preferred_date,
      preferredTime: input.preferred_time,
      notes: input.notes || null,
    });

    const emailSent = await sendNewBookingEmail(booking);

    res.status(201).json({
      booking,
      emailSent,
      retainer: {
        amount: "$50",
        cashApp: "$marlz720",
      },
    });
  } catch (error) {
    next(error);
  }
});
