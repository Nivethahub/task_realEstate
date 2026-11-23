import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropertyForm from '@/components/PropertyForm';
import { getProperty } from '@/lib/api';
type Props = { params: { id: string } };
export const metadata: Metadata = { title: 'Edit property' };
export default async function EditPropertyPage({ params }: Props) {
  const property = await getProperty(params.id);
  if (!property) notFound();
  return <main className="container-shell max-w-[900px] py-12"><div className="mb-7"><div className="eyebrow">Update your listing</div><h1 className="mt-2 text-4xl font-black">Edit property</h1><p className="mt-2 text-[#718078]">Keep your listing details accurate and up to date.</p></div><PropertyForm initialProperty={property}/></main>;
}
