'use client';
import { useState, type FormEvent } from 'react';
import { API_URL } from '@/lib/api';

export default function InquiryForm({ propertyId }: { propertyId: string }) {
  const [message, setMessage] = useState('Hi, I am interested in this property. Please share more details.');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus('');
    const token = localStorage.getItem('nestora_token');
    if (!token) { setStatus('Please log in before contacting the owner.'); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/inquiries/${propertyId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to send inquiry');
      setStatus('Your inquiry has been sent to the property owner.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Something went wrong'); }
    finally { setLoading(false); }
  }
  return <form onSubmit={submit} className="rounded-2xl border border-[#e8ece7] bg-white p-5"><h3 className="text-lg font-black">Interested in this home?</h3><p className="mt-1 text-sm text-[#718078]">Send a message to the property owner.</p><textarea className="field mt-4 min-h-28 resize-y" minLength={10} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} required/><button disabled={loading} className="btn-primary mt-3 w-full">{loading ? 'Sending…' : 'Send inquiry'}</button>{status && <p aria-live="polite" className="mt-3 text-sm text-forest">{status}</p>}</form>;
}
