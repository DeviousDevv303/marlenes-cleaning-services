/**
 * Tests for scheduling and reviews tRPC procedures.
 *
 * These tests use in-memory mocks for the database and notification helpers
 * so no live database connection is required.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// ── Mock database helpers ────────────────────────────────────────────────────
vi.mock("./db", () => ({
  createSchedulingRequest: vi.fn().mockResolvedValue(undefined),
  getAllSchedulingRequests: vi.fn().mockResolvedValue([]),
  createReview: vi.fn().mockResolvedValue(undefined),
  getApprovedReviews: vi.fn().mockResolvedValue([]),
  getPendingReviews: vi.fn().mockResolvedValue([]),
  moderateReview: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

// ── Mock notification helper ─────────────────────────────────────────────────
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Import after mocks are registered
import { appRouter } from "./routers";
import * as db from "./db";
import * as notification from "./_core/notification";

// ── Context factories ────────────────────────────────────────────────────────
function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  const admin: User = {
    id: 1,
    openId: "owner-open-id",
    name: "Marlene",
    email: "marlene@example.com",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user: admin,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function makeUserCtx(): TrpcContext {
  const user: User = {
    id: 2,
    openId: "regular-user",
    name: "Client",
    email: "client@example.com",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// ── Scheduling tests ─────────────────────────────────────────────────────────
describe("scheduling.submit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores the request and notifies the owner", async () => {
    const caller = appRouter.createCaller(makePublicCtx());

    const result = await caller.scheduling.submit({
      name: "Jane Doe",
      phone: "580-461-5110",
      serviceType: "Deep Clean",
      preferredDate: "2026-06-15",
      address: "123 Main St, Lawton, OK",
      notes: "Please bring extra supplies.",
    });

    expect(result).toEqual({ success: true });
    expect(db.createSchedulingRequest).toHaveBeenCalledOnce();
    expect(db.createSchedulingRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Doe",
        phone: "580-461-5110",
        serviceType: "Deep Clean",
        preferredDate: "2026-06-15",
        address: "123 Main St, Lawton, OK",
        notes: "Please bring extra supplies.",
      })
    );
    expect(notification.notifyOwner).toHaveBeenCalledOnce();
    expect(notification.notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Deep Clean"),
      })
    );
  });

  it("omits notes when not provided", async () => {
    const caller = appRouter.createCaller(makePublicCtx());

    const result = await caller.scheduling.submit({
      name: "Bob",
      phone: "555-1234",
      serviceType: "Home Clean",
      preferredDate: "2026-07-01",
      address: "456 Oak Ave",
    });

    expect(result).toEqual({ success: true });
    expect(db.createSchedulingRequest).toHaveBeenCalledWith(
      expect.objectContaining({ notes: null })
    );
  });

  it("rejects an invalid service type", async () => {
    const caller = appRouter.createCaller(makePublicCtx());

    await expect(
      caller.scheduling.submit({
        name: "Bad Actor",
        phone: "000-0000",
        serviceType: "Hacking" as never,
        preferredDate: "2026-01-01",
        address: "Nowhere",
      })
    ).rejects.toThrow();
  });
});

// ── Reviews tests ────────────────────────────────────────────────────────────
describe("reviews.submit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores a review as pending", async () => {
    const caller = appRouter.createCaller(makePublicCtx());

    const result = await caller.reviews.submit({
      reviewerName: "Happy Client",
      rating: 5,
      message: "Absolutely spotless — highly recommend!",
    });

    expect(result).toEqual({ success: true });
    expect(db.createReview).toHaveBeenCalledOnce();
    expect(db.createReview).toHaveBeenCalledWith(
      expect.objectContaining({
        reviewerName: "Happy Client",
        rating: 5,
        message: "Absolutely spotless — highly recommend!",
      })
    );
  });

  it("rejects a rating outside 1–5", async () => {
    const caller = appRouter.createCaller(makePublicCtx());

    await expect(
      caller.reviews.submit({
        reviewerName: "Tester",
        rating: 6,
        message: "Out of range",
      })
    ).rejects.toThrow();
  });
});

describe("reviews.moderate", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows admin to approve a review", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());

    const result = await caller.reviews.moderate({ id: 1, status: "approved" });

    expect(result).toEqual({ success: true });
    expect(db.moderateReview).toHaveBeenCalledWith(1, "approved");
  });

  it("allows admin to reject a review", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());

    const result = await caller.reviews.moderate({ id: 2, status: "rejected" });

    expect(result).toEqual({ success: true });
    expect(db.moderateReview).toHaveBeenCalledWith(2, "rejected");
  });

  it("blocks a non-admin user from moderating", async () => {
    const caller = appRouter.createCaller(makeUserCtx());

    await expect(
      caller.reviews.moderate({ id: 1, status: "approved" })
    ).rejects.toThrow();
  });

  it("blocks an unauthenticated caller from moderating", async () => {
    const caller = appRouter.createCaller(makePublicCtx());

    await expect(
      caller.reviews.moderate({ id: 1, status: "approved" })
    ).rejects.toThrow();
  });
});
