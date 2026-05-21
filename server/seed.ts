import bcrypt from "bcryptjs";
import { createAdmin, getAdminByUsername } from "./db.js";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Marlene2024!";
const SALT_ROUNDS = 12;

export async function seedAdminUser(): Promise<void> {
  const existingAdmin = await getAdminByUsername(ADMIN_USERNAME);
  if (existingAdmin) return;

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  await createAdmin(ADMIN_USERNAME, passwordHash);
  console.info("[seed] Created default admin user");
}
