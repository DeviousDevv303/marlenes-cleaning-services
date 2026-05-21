import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { admin, bookings, type NewBooking } from "../drizzle/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool);

export async function ensureDatabaseSchema(): Promise<void> {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(160) NOT NULL,
      phone varchar(40) NOT NULL,
      email varchar(320) NOT NULL,
      address text NOT NULL,
      service_type varchar(120) NOT NULL,
      preferred_date varchar(40) NOT NULL,
      preferred_time varchar(40) NOT NULL,
      notes text,
      retainer_paid boolean NOT NULL DEFAULT false,
      status booking_status NOT NULL DEFAULT 'pending',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS admin (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username varchar(80) NOT NULL UNIQUE,
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

export async function createBooking(data: NewBooking) {
  const [booking] = await db.insert(bookings).values(data).returning();
  return booking;
}

export async function listBookings() {
  return db.select().from(bookings).orderBy(bookings.createdAt);
}

export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled") {
  const [booking] = await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookings.id, id))
    .returning();
  return booking;
}

export async function markRetainerPaid(id: string) {
  const [booking] = await db
    .update(bookings)
    .set({ retainerPaid: true, updatedAt: new Date() })
    .where(eq(bookings.id, id))
    .returning();
  return booking;
}

export async function deleteBooking(id: string) {
  const [booking] = await db.delete(bookings).where(eq(bookings.id, id)).returning();
  return booking;
}

export async function getAdminByUsername(username: string) {
  const [user] = await db.select().from(admin).where(eq(admin.username, username)).limit(1);
  return user;
}

export async function createAdmin(username: string, passwordHash: string) {
  await db.insert(admin).values({ username, passwordHash }).onConflictDoNothing();
}
