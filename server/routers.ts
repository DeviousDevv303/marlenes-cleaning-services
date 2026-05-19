import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import {
  createSchedulingRequest,
  getAllSchedulingRequests,
  createReview,
  getApprovedReviews,
  getPendingReviews,
  moderateReview,
} from "./db";

// ── Admin guard ───────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ── Service types ─────────────────────────────────────────────────────────────
const SERVICE_TYPES = [
  "Deep Clean",
  "Move In/Out",
  "Home Clean",
  "Office/Business",
  "Post Construction",
  "Rental Turnover",
] as const;

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Scheduling ──────────────────────────────────────────────────────────────
  scheduling: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          phone: z.string().min(7).max(30),
          serviceType: z.enum(SERVICE_TYPES),
          preferredDate: z.string().min(1).max(30),
          address: z.string().min(1),
          notes: z.string().max(2000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createSchedulingRequest({
          name: input.name,
          phone: input.phone,
          serviceType: input.serviceType,
          preferredDate: input.preferredDate,
          address: input.address,
          notes: input.notes ?? null,
        });

        // Notify owner
        await notifyOwner({
          title: `New Cleaning Request — ${input.serviceType}`,
          content: `**Name:** ${input.name}\n**Phone:** ${input.phone}\n**Service:** ${input.serviceType}\n**Date:** ${input.preferredDate}\n**Address:** ${input.address}\n**Notes:** ${input.notes ?? "—"}`,
        });

        return { success: true };
      }),

    // Admin: list all requests
    list: adminProcedure.query(async () => {
      return getAllSchedulingRequests();
    }),
  }),

  // ── Reviews ─────────────────────────────────────────────────────────────────
  reviews: router({
    getApproved: publicProcedure.query(async () => {
      return getApprovedReviews();
    }),

    submit: publicProcedure
      .input(
        z.object({
          reviewerName: z.string().min(1).max(255),
          rating: z.number().int().min(1).max(5),
          message: z.string().min(1).max(2000),
        })
      )
      .mutation(async ({ input }) => {
        await createReview({
          reviewerName: input.reviewerName,
          rating: input.rating,
          message: input.message,
        });
        return { success: true };
      }),

    // Admin: list pending
    listPending: adminProcedure.query(async () => {
      return getPendingReviews();
    }),

    // Admin: approve or reject
    moderate: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["approved", "rejected"]),
        })
      )
      .mutation(async ({ input }) => {
        await moderateReview(input.id, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
