import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProperty, getProperties, formatPrice } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import InquiryForm from '@/components/InquiryForm';
import RecentlyViewedTracker from '@/components/RecentlyViewedTracker';

type Props = { params: { id: string } };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.id);
  if (!property) return { title: 'Property not found' };
  return { title: `${property.title} in ${property.locality}`, description: `${property.bedrooms} bedroom property in ${property.locality}, ${property.city}. ${property.description.slice(0, 140)}`, openGraph: { title: property.title, description: `${property.locality}, ${property.city}`, images: property.images?.[0] ? [property.images[0]] : [] } };
}
export default async function PropertyDetailPage({ params }: Props) {
  const property = await getProperty(params.id);
  if (!property) notFound();
  const similarResult = await getProperties(`?city=${encodeURIComponent(property.city)}&propertyType=${property.propertyType}&limit=4`);
  const similar = similarResult.data.filter((item) => item.id !== property.id).slice(0, 3);
  return <main className="container-shell py-10"><RecentlyViewedTracker property={property}/><Link href="/" className="text-sm font-bold text-forest">← Back to properties</Link>
    <div className="mt-5 grid gap-8 lg:grid-cols-[1.5fr_.8fr]"><div><div className="h-[360px] overflow-hidden rounded-[28px] bg-[#e5ece6] sm:h-[470px]"><img src={property.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'} alt={property.title} className="h-full w-full object-cover"/></div><div className="mt-7"><div className="eyebrow">{property.locality}, {property.city}</div><h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{property.title}</h1><p className="mt-2 text-sm text-[#718078]">{property.address}</p><div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[#e8ece7] bg-white p-4 text-center"><div><strong className="block text-xl">{property.bedrooms}</strong><span className="text-xs text-[#718078]">Bedrooms</span></div><div><strong className="block text-xl">{property.bathrooms}</strong><span className="text-xs text-[#718078]">Bathrooms</span></div><div><strong className="block text-xl">{property.areaSqft.toLocaleString('en-IN')}</strong><span className="text-xs text-[#718078]">Sq.ft.</span></div></div><h2 className="mt-8 text-xl font-black">About this property</h2><p className="mt-3 whitespace-pre-line leading-7 text-[#617168]">{property.description}</p>{property.amenities.length > 0 && <><h2 className="mt-8 text-xl font-black">Amenities</h2><div className="mt-3 flex flex-wrap gap-2">{property.amenities.map((item) => <span key={item} className="rounded-full bg-[#e9f3ed] px-4 py-2 text-sm font-semibold text-forest">{item}</span>)}</div></>}</div></div>
    <aside className="space-y-4"><div className="sticky top-24 rounded-[24px] border border-[#e8ece7] bg-white p-6 shadow-soft"><div className="text-sm font-bold uppercase tracking-wider text-[#718078]">{property.listingType === 'RENT' ? 'Monthly rent' : 'Asking price'}</div><div className="mt-2 text-3xl font-black text-forest">{formatPrice(property.price, property.listingType)}</div><div className="mt-5 border-t border-[#edf0ec] pt-5"><p className="text-xs font-bold uppercase tracking-wider text-[#718078]">Listed by</p><p className="mt-1 text-lg font-bold">{property.owner?.name || 'Property owner'}</p><p className="text-sm text-[#718078]">Owner</p></div><div className="mt-5"><InquiryForm propertyId={property.id}/></div></div></aside></div>
    {similar.length > 0 && <section className="mt-14"><div className="eyebrow">You may also like</div><h2 className="mt-2 text-2xl font-black">Similar properties</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((item) => <PropertyCard key={item.id} property={item}/>)}</div></section>}
  </main>;
}
