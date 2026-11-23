// 'use client';
// import { useRef, useState, type FormEvent } from 'react';
// // import { useState, type FormEvent } from 'react';
// import type { Property } from '@/types';
// import PropertyCard from './PropertyCard';
// import { API_URL } from '@/lib/api';
// type Props = { initialProperties: Property[]; initialTotal: number };
// export default function PropertyBrowser({ initialProperties, initialTotal }: Props) {
//   const [properties, setProperties] = useState(initialProperties);
//   const [total, setTotal] = useState(initialTotal);
//   const [page, setPage] = useState(1);
//   const searchFormRef = useRef<HTMLFormElement>(null);
//   const [totalPages, setTotalPages] = useState(Math.max(1, Math.ceil(initialTotal / 12)));
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '', bedrooms: '', propertyType: '', listingType: 'SALE', sortBy: 'createdAt', sortOrder: 'desc' });
//   function change(key: string, value: string) { setFilters((current) => ({ ...current, [key]: value })); }
//   async function search(event: FormEvent) {
//     event.preventDefault(); setPage(1); await loadPage(1);
//   }
//   // async function loadPage(nextPage: number) {
//   //   setLoading(true); setError('');
//   //   const params = new URLSearchParams();
//   //   Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
//   //   params.set('page', String(nextPage)); params.set('limit', '12');
//   //   try {
//   //     const response = await fetch(`${API_URL}/properties?${params.toString()}`);
//   //     const result = await response.json();
//   //     if (!response.ok) throw new Error(result.message || 'Search failed');
//   //     setProperties(result.data); setTotal(result.pagination.total); setTotalPages(result.pagination.totalPages || 1); setPage(nextPage);
//   //   } catch (e) { setError(e instanceof Error ? e.message : 'Unable to search'); }
//   //   finally { setLoading(false); }
//   // }

//   async function loadPage(nextPage: number, shouldScroll = false) {
//   setLoading(true);
//   setError('');

//   const params = new URLSearchParams();

//   Object.entries(filters).forEach(([key, value]) => {
//     if (value) params.set(key, value);
//   });

//   params.set('page', String(nextPage));
//   params.set('limit', '12');

//   try {
//     const response = await fetch(
//       `${API_URL}/properties?${params.toString()}`
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || 'Search failed');
//     }

//     setProperties(result.data);
//     setTotal(result.pagination.total);
//     setTotalPages(result.pagination.totalPages || 1);
//     setPage(nextPage);

//     if (shouldScroll) {
//       requestAnimationFrame(() => {
//         searchFormRef.current?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'start',
//         });
//       });
//     }
//   } catch (e) {
//     setError(e instanceof Error ? e.message : 'Unable to search');
//   } finally {
//     setLoading(false);
//   }
// }
//   function reset() { setFilters({ city: '', minPrice: '', maxPrice: '', bedrooms: '', propertyType: '', listingType: 'SALE', sortBy: 'createdAt', sortOrder: 'desc' }); setProperties(initialProperties); setTotal(initialTotal); setTotalPages(Math.max(1, Math.ceil(initialTotal / 12))); setPage(1); setError(''); }
//   return <section className="container-shell -mt-8 relative z-10 pb-8">
//     {/* <form onSubmit={search} className="rounded-[24px] border border-[#e8ece7] bg-white p-5 shadow-soft md:p-6">
//       <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><div className="eyebrow">Find your next address</div><h2 className="mt-1 text-lg font-black">Search properties</h2></div><button type="button" onClick={reset} className="text-xs font-bold text-forest underline">Reset filters</button></div>
//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//         <label className="text-xs font-bold text-[#637168]">City or locality<input className="field mt-2" placeholder="e.g. Chennai, Velachery" value={filters.city} onChange={(e) => change('city', e.target.value)} /></label>
//         <label className="text-xs font-bold text-[#637168]">Minimum budget<input type="number" min="0" className="field mt-2" placeholder="₹ Min" value={filters.minPrice} onChange={(e) => change('minPrice', e.target.value)} /></label>
//         <label className="text-xs font-bold text-[#637168]">Maximum budget<input type="number" min="0" className="field mt-2" placeholder="₹ Max" value={filters.maxPrice} onChange={(e) => change('maxPrice', e.target.value)} /></label>
//         <label className="text-xs font-bold text-[#637168]">Bedrooms<select className="field mt-2" value={filters.bedrooms} onChange={(e) => change('bedrooms', e.target.value)}><option value="">Any</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} BHK</option>)}</select></label>
//         <label className="text-xs font-bold text-[#637168]">Property type<select className="field mt-2" value={filters.propertyType} onChange={(e) => change('propertyType', e.target.value)}><option value="">All types</option><option value="APARTMENT">Apartment</option><option value="INDEPENDENT_HOUSE">Independent house</option><option value="VILLA">Villa</option><option value="PLOT">Plot</option><option value="COMMERCIAL">Commercial</option></select></label>
//         <label className="text-xs font-bold text-[#637168]">Looking to<select className="field mt-2" value={filters.listingType} onChange={(e) => change('listingType', e.target.value)}><option value="SALE">Buy</option><option value="RENT">Rent</option></select></label>
//         <label className="text-xs font-bold text-[#637168]">Sort by<select className="field mt-2" value={filters.sortBy} onChange={(e) => change('sortBy', e.target.value)}><option value="createdAt">Newest</option><option value="price">Price</option></select></label>
//         <label className="text-xs font-bold text-[#637168]">Order<select className="field mt-2" value={filters.sortOrder} onChange={(e) => change('sortOrder', e.target.value)}><option value="desc">High to low / newest</option><option value="asc">Low to high / oldest</option></select></label>
//       </div>
//       <div className="mt-4 flex justify-end"><button className="btn-primary min-w-36" disabled={loading}>{loading ? 'Searching…' : 'Search homes'}</button></div>
//     </form> */}

//     <form
//       ref={searchFormRef}
//       onSubmit={search}
//       className="rounded-[24px] border border-[#e8ece7] bg-white p-5 shadow-soft md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#b8c9bb] hover:shadow-xl scroll-mt-6"
//     ></form>
//     <div className="mt-12 flex flex-wrap items-end justify-between gap-3"><div><div className="eyebrow">Curated for your search</div><h2 className="mt-1 text-2xl font-black">Homes worth coming home to</h2></div><p className="text-sm text-[#718078]">{total} properties found</p></div>
//     {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
//     {properties.length ? <><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div>{totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-4"><button className="btn-secondary disabled:opacity-40" disabled={page <= 1 || loading} onClick={() => loadPage(page - 1)}>Previous</button><span className="text-sm font-semibold text-[#718078]">Page {page} of {totalPages}</span><button className="btn-secondary disabled:opacity-40" disabled={page >= totalPages || loading} onClick={() => loadPage(page + 1)}>Next</button></div>}</> : <div className="mt-6 rounded-2xl border border-dashed border-[#cbd8ce] bg-white p-12 text-center"><p className="font-bold">No properties match these filters.</p><p className="mt-1 text-sm text-[#718078]">Try changing your location or budget.</p></div>}
//   </section>;
// }



'use client';

import { useRef, useState, type FormEvent } from 'react';
import type { Property } from '@/types';
import PropertyCard from './PropertyCard';
import { API_URL } from '@/lib/api';

type Props = {
  initialProperties: Property[];
  initialTotal: number;
};

export default function PropertyBrowser({
  initialProperties,
  initialTotal,
}: Props) {
  const [properties, setProperties] = useState(initialProperties);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil(initialTotal / 12))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // const searchFormRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    listingType: 'SALE',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  function change(key: string, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function search(event: FormEvent) {
    event.preventDefault();
    await loadPage(1);
  }

  async function loadPage(nextPage: number, shouldScroll = false) {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set('page', String(nextPage));
    params.set('limit', '12');

    try {
      const response = await fetch(
        `${API_URL}/properties?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Search failed');
      }

      setProperties(result.data);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages || 1);
      setPage(nextPage);

      if (shouldScroll) {
        requestAnimationFrame(() => {
          // searchFormRef.current?.scrollIntoView({
          //   behavior: 'smooth',
          //   block: 'start',
          // });
          resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to search');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    const defaultFilters = {
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: '',
      listingType: 'SALE',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    setFilters(defaultFilters);
    setProperties(initialProperties);
    setTotal(initialTotal);
    setTotalPages(Math.max(1, Math.ceil(initialTotal / 12)));
    setPage(1);
    setError('');
  }

  return (
    <section className="container-shell -mt-8 relative z-10 pb-8">
      <form
        onSubmit={search}
        className="rounded-[24px] border border-[#e8ece7] bg-white p-5 shadow-soft md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#b8c9bb] hover:shadow-xl scroll-mt-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="eyebrow">Find your next address</div>
            <h2 className="mt-1 text-lg font-black">Search properties</h2>
          </div>

          <button
            type="button"
            onClick={reset}
            className="text-xs font-bold text-forest underline"
          >
            Reset filters
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-bold text-[#637168]">
            City or locality
            <input
              className="field mt-2"
              placeholder="e.g. Chennai, Velachery"
              value={filters.city}
              onChange={(e) => change('city', e.target.value)}
            />
          </label>

          <label className="text-xs font-bold text-[#637168]">
            Minimum budget
            <input
              type="number"
              min="0"
              className="field mt-2"
              placeholder="₹ Min"
              value={filters.minPrice}
              onChange={(e) => change('minPrice', e.target.value)}
            />
          </label>

          <label className="text-xs font-bold text-[#637168]">
            Maximum budget
            <input
              type="number"
              min="0"
              className="field mt-2"
              placeholder="₹ Max"
              value={filters.maxPrice}
              onChange={(e) => change('maxPrice', e.target.value)}
            />
          </label>

          <label className="text-xs font-bold text-[#637168]">
            Bedrooms
            <select
              className="field mt-2"
              value={filters.bedrooms}
              onChange={(e) => change('bedrooms', e.target.value)}
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} BHK
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-bold text-[#637168]">
            Property type
            <select
              className="field mt-2"
              value={filters.propertyType}
              onChange={(e) => change('propertyType', e.target.value)}
            >
              <option value="">All types</option>
              <option value="APARTMENT">Apartment</option>
              <option value="INDEPENDENT_HOUSE">Independent house</option>
              <option value="VILLA">Villa</option>
              <option value="PLOT">Plot</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </label>

          <label className="text-xs font-bold text-[#637168]">
            Looking to
            <select
              className="field mt-2"
              value={filters.listingType}
              onChange={(e) => change('listingType', e.target.value)}
            >
              <option value="SALE">Buy</option>
              <option value="RENT">Rent</option>
            </select>
          </label>

          <label className="text-xs font-bold text-[#637168]">
            Sort by
            <select
              className="field mt-2"
              value={filters.sortBy}
              onChange={(e) => change('sortBy', e.target.value)}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
            </select>
          </label>

          <label className="text-xs font-bold text-[#637168]">
            Order
            <select
              className="field mt-2"
              value={filters.sortOrder}
              onChange={(e) => change('sortOrder', e.target.value)}
            >
              <option value="desc">High to low / newest</option>
              <option value="asc">Low to high / oldest</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="btn-primary min-w-36" disabled={loading}>
            {loading ? 'Searching…' : 'Search homes'}
          </button>
        </div>
      </form>

      {/* <div className="mt-12 flex flex-wrap items-end justify-between gap-3"> */}
      <div
        ref={resultsRef}
        className="mt-12 flex flex-wrap items-end justify-between gap-3 scroll-mt-24"
      >
        <div>
          <div className="eyebrow">Curated for your search</div>
          <h2 className="mt-1 text-2xl font-black">
            Homes worth coming home to
          </h2>
        </div>
        <p className="text-sm text-[#718078]">
          {total} properties found
        </p>
      </div>

      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {properties.length ? (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                className="btn-secondary disabled:opacity-40"
                disabled={page <= 1 || loading}
                onClick={() => loadPage(page - 1, true)}
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-[#718078]">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn-secondary disabled:opacity-40"
                disabled={page >= totalPages || loading}
                onClick={() => loadPage(page + 1, true)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[#cbd8ce] bg-white p-12 text-center">
          <p className="font-bold">No properties match these filters.</p>
          <p className="mt-1 text-sm text-[#718078]">
            Try changing your location or budget.
          </p>
        </div>
      )}
    </section>
  );
}
