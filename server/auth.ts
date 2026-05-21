import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { getAdminByUsername } from "./db.js";

const JWT_EXPIRES_IN = "24h";
const SALT_ROUNDS = 12;

export interface AuthenticatedRequest extends Request {
  admin: {
    id: string;
    username: string;
  };
}

interface AdminJwtPayload extends JwtPayload {
  adminId: string;
  username: string;
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  return "dev-only-change-me";
}

function isAdminJwtPayload(value: string | JwtPayload): value is AdminJwtPayload {
  return typeof value !== "string"
    && typeof value.adminId === "string"
    && typeof value.username === "string";
}

export async function verifyAdminCredentials(username: string, password: string) {
  const admin = await getAdminByUsername(username);
  if (!admin) return null;

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) return null;

  return {
    id: admin.id,
    username: admin.username,
  };
}

export function signAdminToken(admin: { id: string; username: string }): string {
  return jwt.sign(
    { adminId: admin.id, username: admin.username },
    jwtSecret(),
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!token) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret());
    if (!isAdminJwtPayload(payload)) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    (req as AuthenticatedRequest).admin = {
      id: payload.adminId,
      username: payload.username,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export { SALT_ROUNDS };
