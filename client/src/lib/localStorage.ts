// LocalStorage-based storage for static site
// Replaces database for GitHub Pages deployment

const STORAGE_KEYS = {
  REQUESTS: "marlene_requests",
  REVIEWS: "marlene_reviews",
  ADMIN_PASSWORD: "marlene_admin_password",
  ADMIN_SESSION: "marlene_admin_session",
} as const;

// ── Types ───────────────────────────────────────────────────────────────────

export interface CleaningRequest {
  id: string;
  name: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  address: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// ── Requests ────────────────────────────────────────────────────────────────

export function getAllRequests(): CleaningRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addRequest(request: Omit<CleaningRequest, "id" | "status" | "createdAt">): CleaningRequest {
  const requests = getAllRequests();
  const newRequest: CleaningRequest = {
    ...request,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.unshift(newRequest);
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return newRequest;
}

export function updateRequestStatus(id: string, status: CleaningRequest["status"]): void {
  const requests = getAllRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return;
  requests[idx] = { ...requests[idx], status };
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
}

export function deleteRequest(id: string): void {
  const requests = getAllRequests().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
}

// ── Reviews ─────────────────────────────────────────────────────────────────

export function getAllReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getApprovedReviews(): Review[] {
  return getAllReviews().filter((r) => r.status === "approved");
}

export function getPendingReviews(): Review[] {
  return getAllReviews().filter((r) => r.status === "pending");
}

export function addReview(review: Omit<Review, "id" | "status" | "createdAt">): Review {
  const reviews = getAllReviews();
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return newReview;
}

export function moderateReview(id: string, status: "approved" | "rejected"): void {
  const reviews = getAllReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return;
  reviews[idx] = { ...reviews[idx], status };
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
}

export function deleteReview(id: string): void {
  const reviews = getAllReviews().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
}

// ── Admin Auth ──────────────────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "marlene_salt_2026_static");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function setAdminPassword(password: string): Promise<void> {
  const hashed = await hashPassword(password);
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, hashed);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
  if (!stored) return false;
  const hashed = await hashPassword(password);
  return hashed === stored;
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === "true";
}

export function adminLogin(): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, "true");
}

export function adminLogout(): void {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}

export function hasAdminPassword(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
}

// ── Email notification helper ───────────────────────────────────────────────

export function sendBookingEmail(form: {
  name: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  address: string;
  notes?: string;
}): void {
  const subject = encodeURIComponent(`New Cleaning Request - ${form.name}`);
  const body = encodeURIComponent(
    `New booking request:\n\n` +
    `Name: ${form.name}\n` +
    `Phone: ${form.phone}\n` +
    `Service: ${form.serviceType}\n` +
    `Date: ${form.preferredDate}\n` +
    `Address: ${form.address}\n` +
    `Notes: ${form.notes || "None"}\n\n` +
    `---\nSent from Marlene's Cleaning Services website`
  );
  
  // Open email client with pre-filled message
  window.open(`mailto:towerslutz@gmail.com?subject=${subject}&body=${body}`, "_blank");
}

// ── Seed data for demo ─────────────────────────────────────────────────────

export function seedDemoData(): void {
  if (getAllRequests().length > 0) return; // Already has data
  
  const demoRequests: CleaningRequest[] = [
    {
      id: "demo-1",
      name: "Sarah Johnson",
      phone: "580-555-0123",
      serviceType: "Deep Clean",
      preferredDate: "2026-05-28",
      address: "456 Oak Ave, Enid, OK",
      notes: "First time client, has 2 dogs",
      status: "pending",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "demo-2",
      name: "Mike Chen",
      phone: "580-555-0456",
      serviceType: "Move In/Out",
      preferredDate: "2026-06-02",
      address: "789 Pine St, Enid, OK",
      notes: "Moving out June 1st",
      status: "confirmed",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];
  
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(demoRequests));
}
