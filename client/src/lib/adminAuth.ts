// Simple admin authentication for Marlene's Cleaning Services
// Bypasses Manus OAuth with a direct password system

import { useState } from "react";

const ADMIN_PASSWORD_KEY = "marlene_admin_password";
const ADMIN_SESSION_KEY = "marlene_admin_session";

// Hash function using SHA-256
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "marlene_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function setAdminPassword(password: string): Promise<void> {
  const hashed = await hashPassword(password);
  localStorage.setItem(ADMIN_PASSWORD_KEY, hashed);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (!stored) return false;
  const hashed = await hashPassword(password);
  return hashed === stored;
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function adminLogin(): void {
  localStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function hasAdminPassword(): boolean {
  return !!localStorage.getItem(ADMIN_PASSWORD_KEY);
}
