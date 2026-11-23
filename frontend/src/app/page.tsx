import PropertyBrowser from '@/components/PropertyBrowser';
import { getProperties } from '@/lib/api';

export default async function HomePage() {
  const result = await getProperties('?limit=12&sortBy=createdAt&sortOrder=desc');
  return <main>
    <section className="relative overflow-hidden bg-[#e9f1eb]">
      <div className="container-shell grid min-h-[430px] items-center gap-8 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10"><div className="eyebrow">A place for every chapter</div><h1 className="mt-4 max-w-[620px] text-5xl font-black leading-[1.05] tracking-[-.045em] sm:text-6xl">Find a home that feels <span className="text-forest">like yours.</span></h1><p className="mt-5 max-w-[490px] text-base leading-7 text-[#607168]">Thoughtfully listed homes, clear details and a simpler way to find your next place.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#properties" className="btn-primary">Explore properties <span className="ml-2">↗</span></a><a href="/add-property" className="btn-secondary">List your property</a></div><div className="mt-9 flex gap-8 text-sm"><div><strong className="block text-xl font-black">Verified-style</strong><span className="text-[#718078]">Clear listing details</span></div><div><strong className="block text-xl font-black">Easy search</strong><span className="text-[#718078]">Filters that matter</span></div></div></div>
        <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-[#d1e2d5]"/><div className="relative h-[320px] overflow-hidden rounded-[34px] shadow-soft sm:h-[370px]"><img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400" alt="Warm modern home interior"/><div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 p-4 shadow-lg"><div className="text-xs font-bold uppercase tracking-wider text-[#718078]">Find your space</div><div className="mt-1 text-lg font-black">More than four walls.</div></div></div><div className="absolute -bottom-5 -right-3 rounded-2xl bg-forest px-5 py-4 text-white shadow-lg"><div className="text-xs text-white/70">Your next chapter</div><div className="text-lg font-black">Starts here.</div></div></div>
      </div>
    </section>
    <div id="properties"><PropertyBrowser initialProperties={result.data} initialTotal={result.pagination?.total || 0} /></div>
  </main>;
}
