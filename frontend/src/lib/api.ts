import type { ApiList, Property } from '@/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function getProperties(query = ''): Promise<ApiList> {
  try {
    const response = await fetch(`${API_URL}/properties${query}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load properties');
    return response.json();
  } catch {
    return { success: false, data: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  try {
    const response = await fetch(`${API_URL}/properties/${id}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const result = await response.json();
    return result.data as Property;
  } catch { return null; }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Something went wrong');
  return result as T;
}

export function formatPrice(price: number | string, listingType: string) {
  const value = Number(price);
  if (listingType === 'RENT') return `₹${value.toLocaleString('en-IN')} / month`;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1).replace(/\.0$/, '')} L`;
  return `₹${value.toLocaleString('en-IN')}`;
}
