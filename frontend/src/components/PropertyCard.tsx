import Link from 'next/link';
import type { Property } from '@/types';
import { formatPrice } from '@/lib/api';

export default function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000';
  return <article className="group overflow-hidden rounded-[22px] border border-[#e8ece7] bg-white shadow-soft transition hover:-translate-y-1">
    <Link href={`/property/${property.id}`} className="block"><div className="relative h-[220px] overflow-hidden bg-[#e6ece7]"><img src={image} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-forest">For {property.listingType === 'RENT' ? 'rent' : 'sale'}</span><span className="absolute bottom-4 right-4 rounded-full bg-[#18231f]/85 px-3 py-1.5 text-xs font-bold text-white">{property.propertyType.replace(/_/g, ' ')}</span></div>
      <div className="p-5"><div className="text-xl font-black text-forest">{formatPrice(property.price, property.listingType)}</div><h3 className="mt-2 line-clamp-1 text-[17px] font-bold">{property.title}</h3><p className="mt-1 text-sm text-[#718078]">{property.locality}, {property.city}</p><div className="mt-5 flex items-center gap-4 border-t border-[#edf0ec] pt-4 text-xs font-semibold text-[#617168]"><span>{property.bedrooms} Beds</span><span>{property.bathrooms} Baths</span><span>{property.areaSqft.toLocaleString('en-IN')} sq.ft.</span></div></div></Link>
  </article>;
}
