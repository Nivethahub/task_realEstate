import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';
export const metadata: Metadata = { title: 'Log in' };
export default function LoginPage() { return <main className="container-shell grid min-h-[650px] place-items-center py-12"><div className="w-full max-w-[460px] rounded-[28px] border border-[#e8ece7] bg-white p-7 shadow-soft sm:p-9"><div className="eyebrow">Welcome back</div><h1 className="mt-2 text-3xl font-black">Log in to Nestora</h1><p className="mb-7 mt-2 text-sm text-[#718078]">Continue your property search or manage your listings.</p><AuthForm mode="login"/></div></main>; }
