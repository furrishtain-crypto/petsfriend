'use client';
import { useEffect, useState } from 'react';

/** Shows the success message after Netlify redirects back with ?sent=1. */
export function FormNotice({ message }: { message: string }) {
  const [sent, setSent] = useState(false);
  useEffect(() => { setSent(new URLSearchParams(window.location.search).has('sent')); }, []);
  if (!sent) return null;
  return <div className="notice" role="status" style={{ margin: 0 }}>{message}</div>;
}
