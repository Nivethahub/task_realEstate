'use client';

import { useEffect } from 'react';
import type { Property } from '@/types';

export default function RecentlyViewedTracker({ property }: { property: Property }) {
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('nestora_user') || 'null');
      if (!user?.id) return;
      const key = `nestora_recently_viewed_${user.id}`;
      const previous = JSON.parse(localStorage.getItem(key) || '[]') as Array<{ property: Property; viewedAt: string }>;
      const updated = [
        { property: { ...property, owner: undefined }, viewedAt: new Date().toISOString() },
        ...previous.filter((entry) => entry.property?.id !== property.id),
      ].slice(0, 20);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // Ignore malformed local history; the property page should still work.
    }
  }, [property]);

  return null;
}
