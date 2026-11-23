import type { Metadata } from 'next';
import PropertyForm from '@/components/PropertyForm';
export const metadata: Metadata = { title: 'List your property' };
export default function AddPropertyPage() { return <main className="container-shell max-w-[900px] py-12"><div className="mb-7"><div className="eyebrow">Share your space</div><h1 className="mt-2 text-4xl font-black">List a property</h1><p className="mt-2 text-[#718078]">Add accurate details to help the right people find your property.</p></div><PropertyForm/></main>; }
