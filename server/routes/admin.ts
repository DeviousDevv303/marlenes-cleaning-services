import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticateAdmin } from "../auth";
import {
  deleteBooking,
  listBookings,
  markRetainerPaid,
  updateBookingStatus,
} from "../db";
import {
  adminLoginSchema,
  bookingIdParamsSchema,
  updateStatusSchema,
} from "../validation";
import { signAdminToken, verifyAdminCredentials } from "../auth";

export const adminRoutes = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

adminRoutes.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const parsed = adminLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid login input", issues: parsed.error.flatten() });
      return;
    }

    const admin = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
    if (!admin) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    res.json({
      token: signAdminToken(admin),
      expiresIn: "24h",
      admin,
    });
  } catch (error) {
    next(error);
  }
});

adminRoutes.use(authenticateAdmin);

adminRoutes.get("/bookings", async (_req, res, next) => {
  try {
    res.json({ bookings: await listBookings() });
  } catch (error) {
    next(error);
  }
});

adminRoutes.patch("/bookings/:id/status", async (req, res, next) => {
  try {
    const params = bookingIdParamsSchema.safeParse(req.params);
    const body = updateStatusSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({
        error: "Invalid status update input",
        issues: {
          params: params.success ? null : params.error.flatten(),
          body: body.success ? null : body.error.flatten(),
        },
      });
      return;
    }

    const booking = await updateBookingStatus(params.data.id, body.data.status);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

adminRoutes.patch("/bookings/:id/retainer", async (req, res, next) => {
  try {
    const params = bookingIdParamsSchema.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid booking id", issues: params.error.flatten() });
      return;
    }

    const booking = await markRetainerPaid(params.data.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

adminRoutes.delete("/bookings/:id", async (req, res, next) => {
  try {
    const params = bookingIdParamsSchema.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid booking id", issues: params.error.flatten() });
      return;
    }

    const booking = await deleteBooking(params.data.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({ deleted: true, booking });
  } catch (error) {
    next(error);
  }
});
