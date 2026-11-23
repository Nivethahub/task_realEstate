'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Property } from '@/types';
import { API_URL, formatPrice } from '@/lib/api';

type ViewedProperty = { property: Property; viewedAt: string };

function PropertyRow({ item, viewed = false, onDelete }: { item: Property; viewed?: boolean; onDelete?: (id: string) => void }) {
  return <div className="flex flex-col gap-4 rounded-2xl border border-[#e8ece7] bg-white p-4 sm:flex-row sm:items-center">
    <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500'} alt={item.title} className="h-28 w-full rounded-xl object-cover sm:w-40" />
    <div className="min-w-0 flex-1"><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-sm text-[#718078]">{item.locality}, {item.city}</p><p className="mt-2 font-black text-forest">{formatPrice(item.price, item.listingType)}</p>{viewed && <p className="mt-1 text-xs text-[#87938c]">Recently viewed</p>}</div>
    <div className="flex flex-wrap gap-2"><Link className="btn-secondary" href={`/property/${item.id}`}>View</Link>{!viewed && <><Link className="btn-secondary" href={`/edit-property/${item.id}`}>Edit</Link><button className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600" onClick={() => onDelete?.(item.id)}>Delete</button></>}</div>
  </div>;
}

export default function Dashboard() {
  const [items, setItems] = useState<Property[]>([]);
  const [recentItems, setRecentItems] = useState<ViewedProperty[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'created' | 'viewed'>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('nestora_token');
    const user = JSON.parse(localStorage.getItem('nestora_user') || 'null');
    if (!token) { router.replace('/login'); return; }
    if (user?.id) {
      try {
        const history = JSON.parse(localStorage.getItem(`nestora_recently_viewed_${user.id}`) || '[]');
        // setRecentItems(Array.isArray(history) ? history : []);
        setRecentItems(
          Array.isArray(history) ? history.slice(0, 5) : []
        );
      } catch { setRecentItems([]); }
    }
    fetch(`${API_URL}/properties/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        const result = await r.json();
        if (r.status === 401) { localStorage.removeItem('nestora_token'); localStorage.removeItem('nestora_refresh_token'); localStorage.removeItem('nestora_user'); router.replace('/login?reason=session-expired'); throw new Error('Your session expired. Please log in again.'); }
        if (!r.ok) throw new Error(result.message || 'Unable to load listings');
        setItems(result.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredItems = useMemo(() => items.filter((item) => `${item.title} ${item.city} ${item.locality}`.toLowerCase().includes(search.toLowerCase().trim())), [items, search]);
  const filteredRecent = useMemo(() => recentItems.filter(({ property }) => property && property.isArchive === false && `${property.title} ${property.city} ${property.locality}`.toLowerCase().includes(search.toLowerCase().trim())), [recentItems, search]);

  // async function remove(id: string) {
  //   if (!confirm('Delete this property listing?')) return;
  //   const token = localStorage.getItem('nestora_token');
  //   const response = await fetch(`${API_URL}/properties/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  //   const result = await response.json();
  //   if (!response.ok) { setError(result.message); return; }
  //   setItems((current) => current.filter((item) => item.id !== id));
  // }
  async function remove(id: string) {
  if (!confirm('Delete this property listing?')) return;

  const token = localStorage.getItem('nestora_token');

  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    setError(result.message);
    return;
  }

  // Remove from My Listings
  setItems((current) =>
    current.filter((item) => item.id !== id)
  );

  // Remove from Recently Viewed state
  setRecentItems((current) =>
    current.filter(({ property }) => property.id !== id)
  );

  // Remove from browser localStorage
  const user = JSON.parse(
    localStorage.getItem('nestora_user') || 'null'
  );

  if (user?.id) {
    const storageKey = `nestora_recently_viewed_${user.id}`;

    try {
      const history = JSON.parse(
        localStorage.getItem(storageKey) || '[]'
      );

      const updatedHistory = history.filter(
        (item: ViewedProperty) => item.property?.id !== id
      );

      localStorage.setItem(
        storageKey,
        JSON.stringify(updatedHistory)
      );
    } catch {
      console.error('Unable to update recently viewed history');
    }
  }
}

  return <main className="container-shell min-h-[550px] py-12">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Your Nestora space</div><h1 className="mt-2 text-4xl font-black">My dashboard</h1><p className="mt-2 text-[#718078]">Manage your listings and recently viewed properties.</p></div><Link className="btn-primary" href="/add-property">+ Add property</Link></div>
    <div className="mt-8"><label htmlFor="dashboard-search" className="mb-2 block text-sm font-bold text-[#52645a]">Search your properties</label><input id="dashboard-search" className="field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by property title, city or locality..." /></div>
    <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Dashboard property sections">
      {([{ id: 'all', label: 'All' }, { id: 'created', label: `My listings (${items.length})` }, { id: 'viewed', label: `Recently viewed (${recentItems.length})` }] as const).map((tab) => <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-bold ${activeTab === tab.id ? 'bg-forest text-white' : 'border border-[#d6ded8] bg-white text-forest'}`}>{tab.label}</button>)}
    </div>
    {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {loading ? <p className="mt-10 text-[#718078]">Loading your dashboard…</p> : <div className="mt-7 space-y-9">
      {(activeTab === 'all' || activeTab === 'created') && <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">My listings</h2><span className="text-sm text-[#718078]">{filteredItems.length} found</span></div>{filteredItems.length ? <div className="space-y-4">{filteredItems.map((item) => <PropertyRow key={item.id} item={item} onDelete={remove} />)}</div> : <p className="rounded-xl bg-white p-6 text-sm text-[#718078]">{search ? 'No created listings match your search.' : 'You have not listed a property yet.'} <Link className="font-bold text-forest underline" href="/add-property">Create a listing</Link></p>}</section>}
      {(activeTab === 'all' || activeTab === 'viewed') && <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Recently viewed</h2><span className="text-sm text-[#718078]">{filteredRecent.length} found</span></div>{filteredRecent.length ? <div className="space-y-4">{filteredRecent.map(({ property, viewedAt }) => <div key={property.id}><PropertyRow item={property} viewed /><p className="mt-1 px-2 text-xs text-[#87938c]">Viewed {new Date(viewedAt).toLocaleString()}</p></div>)}</div> : <p className="rounded-xl bg-white p-6 text-sm text-[#718078]">{search ? 'No viewed properties match your search.' : 'Properties you open will appear here when you are logged in.'}</p>}</section>}
    </div>}
  </main>;
}
