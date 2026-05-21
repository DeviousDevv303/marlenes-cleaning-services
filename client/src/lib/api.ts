const DEFAULT_API_URL = "https://marlenes-cleaning-services-api.onrender.com";
const ADMIN_TOKEN_KEY = "marlene_admin_token";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  retainerPaid: boolean;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  name: string;
  phone: string;
  email: string;
  address: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
}

export interface CreateBookingResponse {
  booking: Booking;
  emailSent: boolean;
  retainer: {
    amount: string;
    cashApp: string;
  };
}

export interface AdminLoginResponse {
  token: string;
  expiresIn: string;
  admin: {
    id: string;
    username: string;
  };
}

export interface BookingsResponse {
  bookings: Booking[];
}

export interface BookingResponse {
  booking: Booking;
}

export interface DeleteBookingResponse {
  deleted: true;
  booking: Booking;
}

export interface HealthResponse {
  ok: boolean;
  service: string;
  timestamp: string;
}

function apiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = configured?.trim() || DEFAULT_API_URL;
  return baseUrl.replace(/\/+$/, "");
}

async function responseError(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}`;
  const text = await response.text();
  if (!text) return fallback;

  try {
    const body = JSON.parse(text) as { error?: unknown };
    return typeof body.error === "string" ? body.error : fallback;
  } catch {
    return text;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await responseError(response));
  }

  return response.json() as Promise<T>;
}

export function createBooking(payload: CreateBookingPayload): Promise<CreateBookingResponse> {
  return request<CreateBookingResponse>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/api/health");
}

export function loginAdmin(username: string, password: string): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function listBookings(token: string): Promise<BookingsResponse> {
  return request<BookingsResponse>("/api/admin/bookings", {}, token);
}

export function updateBookingStatus(
  token: string,
  id: string,
  status: BookingStatus,
): Promise<BookingResponse> {
  return request<BookingResponse>(
    `/api/admin/bookings/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    token,
  );
}

export function markBookingRetainerPaid(
  token: string,
  id: string,
): Promise<BookingResponse> {
  return request<BookingResponse>(
    `/api/admin/bookings/${id}/retainer`,
    { method: "PATCH" },
    token,
  );
}

export function deleteBooking(token: string, id: string): Promise<DeleteBookingResponse> {
  return request<DeleteBookingResponse>(
    `/api/admin/bookings/${id}`,
    { method: "DELETE" },
    token,
  );
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getApiBaseUrl(): string {
  return apiBaseUrl();
}
