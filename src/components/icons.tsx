import React from 'react';

export function Paw({ size = 84, sw = 2.2, color = '#101B33' }: { size?: number; sw?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={sw} aria-hidden="true">
      <ellipse cx="32" cy="42" rx="13" ry="10" /><ellipse cx="14" cy="28" rx="5" ry="7" /><ellipse cx="25" cy="18" rx="5" ry="7" />
      <ellipse cx="39" cy="18" rx="5" ry="7" /><ellipse cx="50" cy="28" rx="5" ry="7" />
    </svg>
  );
}

export const Ico = ({ d, size = 24, color = '#101B33', sw = 2.2 }: { d: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export const PATHS = {
  search: 'M15.5 15.5L21 21M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z',
  user: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21c1-5 15-5 16 0',
  bag: 'M3 9h18l-2 11H5zM8 9l3-5M16 9l-3-5',
  chat: 'M4 5h16v11H9l-5 4z',
  wa: 'M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6zM9 9c0 3 3 6 6 6',
  truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01',
  invoice: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  support: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19a4 4 0 0 1-4 3h-2',
};
