import { z } from "zod";

export const bookingStatusSchema = z.enum(["pending", "confirmed", "completed", "cancelled"]);

export const createBookingSchema = z.object({
  name: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().email().max(320),
  address: z.string().trim().min(5).max(1000),
  service_type: z.string().trim().min(2).max(120),
  preferred_date: z.string().trim().min(1).max(40),
  preferred_time: z.string().trim().min(1).max(40),
  notes: z.string().trim().max(2000).optional().default(""),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200),
});

export const bookingIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateStatusSchema = z.object({
  status: bookingStatusSchema,
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingStatus = z.infer<typeof bookingStatusSchema>;
