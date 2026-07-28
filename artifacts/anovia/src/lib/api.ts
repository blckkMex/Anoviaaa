// ── Storage key ───────────────────────────────────────────────────────────
const TOKEN_KEY = 'anovia_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Base fetch ────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<{ token: string; email: string }> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
export async function getMe(): Promise<{ id: number; email: string }> {
  return apiFetch('/auth/me');
}

// ── Types ─────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  inStock: boolean;
  sortOrder: number;
}

export interface Offer {
  id: number;
  text: string;
  active: boolean;
  sortOrder: number;
}

export type Settings = Record<string, string>;

// ── Public API ────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  return apiFetch('/products');
}
export async function getOffers(): Promise<Offer[]> {
  return apiFetch('/offers');
}
export async function getSettings(): Promise<Settings> {
  return apiFetch('/settings');
}

// ── Admin products ────────────────────────────────────────────────────────
export async function adminGetProducts(): Promise<Product[]> {
  return apiFetch('/admin/products');
}
export async function adminCreateProduct(data: Omit<Product, 'id'>): Promise<Product> {
  return apiFetch('/admin/products', { method: 'POST', body: JSON.stringify(data) });
}
export async function adminUpdateProduct(id: number, data: Partial<Omit<Product, 'id'>>): Promise<Product> {
  return apiFetch(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function adminDeleteProduct(id: number): Promise<void> {
  return apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
}

// ── Admin offers ──────────────────────────────────────────────────────────
export async function adminGetOffers(): Promise<Offer[]> {
  return apiFetch('/admin/offers');
}
export async function adminCreateOffer(data: Omit<Offer, 'id'>): Promise<Offer> {
  return apiFetch('/admin/offers', { method: 'POST', body: JSON.stringify(data) });
}
export async function adminUpdateOffer(id: number, data: Partial<Omit<Offer, 'id'>>): Promise<Offer> {
  return apiFetch(`/admin/offers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function adminDeleteOffer(id: number): Promise<void> {
  return apiFetch(`/admin/offers/${id}`, { method: 'DELETE' });
}

// ── Admin settings ────────────────────────────────────────────────────────
export async function adminGetSettings(): Promise<Settings> {
  return apiFetch('/admin/settings');
}
export async function adminSaveSettings(data: Settings): Promise<void> {
  return apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(data) });
}
