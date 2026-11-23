import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';
export const metadata: Metadata = { title: 'Create an account' };
export default function RegisterPage() { return <main className="container-shell grid min-h-[650px] place-items-center py-12"><div className="w-full max-w-[460px] rounded-[28px] border border-[#e8ece7] bg-white p-7 shadow-soft sm:p-9"><div className="eyebrow">A better move starts here</div><h1 className="mt-2 text-3xl font-black">Create your account</h1><p className="mb-7 mt-2 text-sm text-[#718078]">Save your searches and connect with property owners.</p><AuthForm mode="register"/></div></main>; }
