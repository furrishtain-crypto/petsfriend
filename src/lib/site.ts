// Single place for site-wide facts. SITE_URL is the only thing to change when the domain is connected.
// Netlify sets URL at build time; set SITE_URL in Netlify settings once the real domain is connected.
export const SITE_URL = (process.env.SITE_URL || process.env.URL || 'http://localhost:3000').replace(/\/$/, '');

export const SITE = {
  name: 'Pets Friend',
  tagline: 'Wholesale dog and cat essentials and accessories for pet retailers in India',
  description:
    'Pets Friend supplies dog and cat essentials and accessories to pet retailers, clinics and distributors across India, with quantity slab pricing and GST invoices.',
  locale: 'en_IN',
  currency: 'INR',
  // Placeholders until the real details are added in Admin > Settings.
  email: '[TRADE EMAIL]',
  phone: '[TRADE PHONE]',
};

export function abs(path: string): string {
  return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}

export function inr(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
