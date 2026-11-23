import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Header from '@/components/Header';
import SessionGuard from '@/components/SessionGuard';

export const metadata: Metadata = {
  title: { default: 'Nestora | Find a place to call home', template: '%s | Nestora' },
  description: 'Discover apartments, independent homes and properties for sale or rent.',
};
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><SessionGuard /><Header />{children}<footer className="mt-20 border-t border-[#e5e9e4] bg-white py-8"><div className="container-shell flex flex-col justify-between gap-3 text-sm text-[#718078] sm:flex-row"><span>© {new Date().getFullYear()} Nestora Properties</span><span>Find better. Live brighter.</span></div></footer></body></html>;
}
