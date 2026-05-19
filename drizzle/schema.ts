import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Scheduling Requests ──────────────────────────────────────────────────────

export const schedulingRequests = mysqlTable("scheduling_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  preferredDate: varchar("preferredDate", { length: 30 }).notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SchedulingRequest = typeof schedulingRequests.$inferSelect;
export type InsertSchedulingRequest = typeof schedulingRequests.$inferInsert;

// ── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  reviewerName: varchar("reviewerName", { length: 255 }).notNull(),
  rating: int("rating").notNull(), // 1–5
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
