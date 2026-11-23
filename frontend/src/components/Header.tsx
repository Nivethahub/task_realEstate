// 'use client';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Header() {
//   const [signedIn, setSignedIn] = useState(false);
//   const router = useRouter();
//   useEffect(() => { const sync = () => setSignedIn(Boolean(localStorage.getItem('nestora_token'))); sync(); window.addEventListener('nestora-auth-changed', sync); window.addEventListener('storage', sync); return () => { window.removeEventListener('nestora-auth-changed', sync); window.removeEventListener('storage', sync); }; }, []);
//   async function logout() { const refreshToken = localStorage.getItem('nestora_refresh_token'); if (refreshToken) { try { await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) }); } catch { /* Clear local session even if the API is offline. */ } } localStorage.removeItem('nestora_token'); localStorage.removeItem('nestora_refresh_token'); localStorage.removeItem('nestora_user'); localStorage.removeItem('nestora_last_activity'); window.dispatchEvent(new Event('nestora-auth-changed')); setSignedIn(false); router.push('/'); }
//   return <header className="sticky top-0 z-40 border-b border-[#e8ece7] bg-[#f7f6f1]/95 backdrop-blur"><div className="container-shell flex h-[76px] items-center justify-between">
//     <Link href="/" className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-lg font-black text-white">N</span><span className="text-xl font-black tracking-tight">nestora<span className="text-forest">.</span><small className="ml-2 hidden text-[10px] font-bold uppercase tracking-[.18em] text-[#8a9890] sm:inline">Real estate</small></span></Link>
//     <nav className="flex items-center gap-3 text-sm font-semibold sm:gap-6"><Link className="hidden text-[#52645a] hover:text-forest sm:block" href="/">Explore</Link><Link className="hidden text-[#52645a] hover:text-forest sm:block" href="/add-property">List property</Link>{signedIn ? <><Link className="text-[#52645a] hover:text-forest" href="/dashboard">Dashboard</Link><button onClick={logout} className="btn-secondary !px-4 !py-2">Logout</button></> : <><Link className="text-[#52645a]" href="/login">Log in</Link><Link className="btn-primary !px-4 !py-2" href="/register">Get started</Link></>}</nav>
//   </div></header>;
// }


'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [signedIn, setSignedIn] = useState(false);
  const [accountName, setAccountName] = useState('Account');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const token = localStorage.getItem('nestora_token');
      setSignedIn(Boolean(token));

      try {
        const user = JSON.parse(
          localStorage.getItem('nestora_user') || 'null'
        );

        setAccountName(user?.name || user?.fullName || 'Account');
      } catch {
        setAccountName('Account');
      }
    };

    sync();

    window.addEventListener('nestora-auth-changed', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('nestora-auth-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function logout() {
    const refreshToken = localStorage.getItem('nestora_refresh_token');

    if (refreshToken) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/logout`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          }
        );
      } catch {
        // Clear local session even if API is offline.
      }
    }

    localStorage.removeItem('nestora_token');
    localStorage.removeItem('nestora_refresh_token');
    localStorage.removeItem('nestora_user');
    localStorage.removeItem('nestora_last_activity');

    window.dispatchEvent(new Event('nestora-auth-changed'));

    setSignedIn(false);
    setDropdownOpen(false);

    router.push('/');
  }

  const initial = accountName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-[#e8ece7] bg-[#f7f6f1]/95 backdrop-blur">
      <div className="container-shell flex h-[76px] items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-lg font-black text-white">
            N
          </span>

          <span className="text-xl font-black tracking-tight">
            nestora<span className="text-forest">.</span>
            <small className="ml-2 hidden text-[10px] font-bold uppercase tracking-[.18em] text-[#8a9890] sm:inline">
              Real estate
            </small>
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm font-semibold sm:gap-6">
          <Link
            className="hidden text-[#52645a] hover:text-forest sm:block"
            href="/"
          >
            Explore
          </Link>

          <Link
            className="hidden text-[#52645a] hover:text-forest sm:block"
            href="/add-property"
          >
            List property
          </Link>

          {signedIn ? (
            <>
              <Link
                className="text-[#52645a] hover:text-forest"
                href="/dashboard"
              >
                Dashboard
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-[#d8e1da] bg-white px-3 py-2 transition-all duration-200 hover:border-[#245d4a] hover:bg-[#f0f5f1] hover:shadow-md"
                  aria-expanded={dropdownOpen}
                  aria-label="Account menu"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-sm font-bold text-white">
                    {initial}
                  </span>

                  <span className="hidden max-w-[100px] truncate text-[#245d4a] sm:block">
                    {accountName}
                  </span>

                  <svg
                    className={`h-4 w-4 text-[#52645a] transition-transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-[#e8ece7] bg-white py-2 shadow-xl">

                    <div className="border-b border-[#e8ece7] px-4 py-3">
                      <p className="text-xs text-[#8a9890]">
                        Signed in as
                      </p>
                      <p className="mt-1 truncate font-bold text-[#245d4a]">
                        {accountName}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#52645a] transition hover:bg-[#f0f5f1] hover:text-forest"
                    >
                      <span>👤</span>
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-3 border-t border-[#e8ece7] px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <span>↪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link className="text-[#52645a]" href="/login">
                Log in
              </Link>

              <Link className="btn-primary !px-4 !py-2" href="/register">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
