'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

const IDLE_LIMIT_MS = 2 * 60 * 60 * 1000;

function clearSession() {
  const refreshToken = localStorage.getItem('nestora_refresh_token');
  if (refreshToken) {
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      keepalive: true,
    }).catch(() => undefined);
  }
  localStorage.removeItem('nestora_token');
  localStorage.removeItem('nestora_refresh_token');
  localStorage.removeItem('nestora_user');
  localStorage.removeItem('nestora_last_activity');
  window.dispatchEvent(new Event('nestora-auth-changed'));
}

function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export default function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let lastWrite = 0;
    let redirecting = false;

    const expireSession = () => {
      if (redirecting) return;
      redirecting = true;
      clearSession();
      router.replace('/login?reason=session-expired');
    };

    const checkSession = () => {
      const token = localStorage.getItem('nestora_token');
      if (!token) return;
      const now = Date.now();
      const lastActivity = Number(localStorage.getItem('nestora_last_activity') || 0);
      const tokenExpiry = getTokenExpiry(token);
      if (!lastActivity || now - lastActivity >= IDLE_LIMIT_MS || !tokenExpiry || now >= tokenExpiry) {
        expireSession();
      }
    };

    const recordActivity = () => {
      if (!localStorage.getItem('nestora_token')) return;
      const now = Date.now();
      if (now - lastWrite >= 5000) {
        localStorage.setItem('nestora_last_activity', String(now));
        lastWrite = now;
      }
    };

    const activityEvents: (keyof WindowEventMap)[] = ['click', 'keydown', 'mousemove', 'mousedown', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, recordActivity, { passive: true }));
    const interval = window.setInterval(checkSession, 15000);
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'nestora_token' && !event.newValue && !redirecting) {
        router.replace('/login?reason=session-expired');
      }
    };
    window.addEventListener('storage', onStorage);
    checkSession();

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity));
      window.clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
  }, [pathname, router]);

  return null;
}
