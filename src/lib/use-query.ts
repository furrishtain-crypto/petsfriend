'use client';
import { useEffect, useState } from 'react';

/** URL query string, read after hydration (the site is static, so there is no server-side searchParams). */
export function useQuery(): URLSearchParams | null {
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => { setQ(new URLSearchParams(window.location.search)); }, []);
  return q;
}

export function setQueryString(params: Record<string, string | string[] | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => ([] as string[]).concat(v ?? []).forEach((x) => x && u.append(k, x)));
  const qs = u.toString();
  window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
}
