'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import type { Property } from '@/types';

type FormValues = { title: string; description: string; city: string; locality: string; address: string; price: string; bedrooms: string; bathrooms: string; areaSqft: string; propertyType: string; listingType: string; images: string; amenities: string };
export default function PropertyForm({ initialProperty }: { initialProperty?: Property }) {
  const [form, setForm] = useState<FormValues>(() => initialProperty ? { title: initialProperty.title, description: initialProperty.description, city: initialProperty.city, locality: initialProperty.locality, address: initialProperty.address, price: String(initialProperty.price), bedrooms: String(initialProperty.bedrooms), bathrooms: String(initialProperty.bathrooms), areaSqft: String(initialProperty.areaSqft), propertyType: initialProperty.propertyType, listingType: initialProperty.listingType, images: initialProperty.images.join('\n'), amenities: initialProperty.amenities.join(', ') } : { title: '', description: '', city: 'Chennai', locality: '', address: '', price: '', bedrooms: '2', bathrooms: '2', areaSqft: '', propertyType: 'APARTMENT', listingType: 'SALE', images: '', amenities: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const router = useRouter();
  function change(key: string, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); const token = localStorage.getItem('nestora_token');
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), areaSqft: Number(form.areaSqft), images: form.images.split('\n').map((v) => v.trim()).filter(Boolean), amenities: form.amenities.split(',').map((v) => v.trim()).filter(Boolean) };
      const response = await fetch(`${API_URL}/properties${initialProperty ? `/${initialProperty.id}` : ''}`, { method: initialProperty ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Unable to save listing');
      router.push(`/property/${result.data.id}`); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong'); }
    finally { setLoading(false); }
  }
  const input = (key: keyof typeof form, label: string, type = 'text', required = true) => <label className="block text-sm font-bold">{label}<input className="field mt-2" type={type} value={form[key]} onChange={(e) => change(key, e.target.value)} required={required} /></label>;
  return <form onSubmit={submit} className="rounded-[24px] border border-[#e8ece7] bg-white p-6 shadow-soft sm:p-8"><div className="grid gap-5 sm:grid-cols-2">{input('title', 'Listing title')}<label className="block text-sm font-bold">Listing type<select className="field mt-2" value={form.listingType} onChange={(e) => change('listingType', e.target.value)}><option value="SALE">For sale</option><option value="RENT">For rent</option></select></label><label className="block text-sm font-bold sm:col-span-2">Description<textarea className="field mt-2 min-h-28" value={form.description} onChange={(e) => change('description', e.target.value)} minLength={20} required/></label>{input('city', 'City')}{input('locality', 'Locality')}{input('address', 'Full address')}{input('price', 'Price (INR)', 'number')}{input('bedrooms', 'Bedrooms', 'number')}{input('bathrooms', 'Bathrooms', 'number')}{input('areaSqft', 'Area (sq.ft.)', 'number')}<label className="block text-sm font-bold">Property type<select className="field mt-2" value={form.propertyType} onChange={(e) => change('propertyType', e.target.value)}><option value="APARTMENT">Apartment</option><option value="INDEPENDENT_HOUSE">Independent house</option><option value="VILLA">Villa</option><option value="PLOT">Plot</option><option value="COMMERCIAL">Commercial</option></select></label><label className="block text-sm font-bold sm:col-span-2">Image URLs (one per line)<textarea className="field mt-2 min-h-20" value={form.images} onChange={(e) => change('images', e.target.value)} placeholder="https://example.com/property.jpg"/></label><label className="block text-sm font-bold sm:col-span-2">Amenities (comma separated)<input className="field mt-2" value={form.amenities} onChange={(e) => change('amenities', e.target.value)} placeholder="Lift, Covered parking, Security"/></label></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="btn-primary mt-6 w-full sm:w-auto">{loading ? 'Saving…' : initialProperty ? 'Save changes' : 'Publish property'}</button></form>;
}
