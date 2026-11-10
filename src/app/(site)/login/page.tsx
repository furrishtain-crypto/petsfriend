import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Trade login',
  description: 'Log in to your Pets Friend trade account to see wholesale prices, MOQs, order history and GST invoices.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
};

const PERKS = [
  { t: 'Wholesale prices and MOQs on every SKU', bg: '#FFD966' },
  { t: 'Reorder past orders in one click', bg: '#BDEBD3' },
  { t: 'GST invoices and price list downloads', bg: '#BFE0FF' },
  { t: 'Credit terms for approved accounts', bg: '#D9D4FF' },
];

export default function Login() {
  return (
    <section className="sectionpad" style={{ paddingTop: 56, paddingBottom: 80, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'stretch' }}>
      <div style={{ flex: '1 1 440px', minWidth: 0, background: '#27BFB1', border: '1.5px solid #101B33', borderRadius: 32, padding: '44px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <span className="m" style={{ display: 'inline-block', background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, padding: '5px 14px', fontSize: 13 }}>Trade portal</span>
          <h1 className="d hugeh1" style={{ fontSize: 58, lineHeight: .98, margin: '18px 0 14px' }}>Welcome back to Pets Friend.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, margin: 0, maxWidth: 420 }}>Log in to see your wholesale prices, MOQs and order history.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PERKS.map((p) => (
            <div key={p.t} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1.5px solid #101B33', borderRadius: 14, padding: '12px 16px', fontWeight: 600, fontSize: 16 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.bg, border: '1.5px solid #101B33', flex: '0 0 12px' }} />{p.t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <svg width="170" height="170" viewBox="0 0 64 64" fill="none" stroke="#101B33" strokeWidth="1.6" aria-hidden="true"><ellipse cx="32" cy="42" rx="13" ry="10" /><ellipse cx="14" cy="28" rx="5" ry="7" /><ellipse cx="25" cy="18" rx="5" ry="7" /><ellipse cx="39" cy="18" rx="5" ry="7" /><ellipse cx="50" cy="28" rx="5" ry="7" /></svg>
        </div>
      </div>

      <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <LoginForm />
        <div style={{ background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 26, padding: '26px 30px', display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 240px' }}><div className="d" style={{ fontSize: 24, marginBottom: 4 }}>New to Pets Friend trade?</div><div style={{ fontSize: 15, lineHeight: 1.5 }}>Apply with your GST number to unlock wholesale prices.</div></div>
          <Link href="/trade" className="b ink hover-lift" style={{ minHeight: 50, fontSize: 16 }}>Apply for an account</Link>
        </div>
        <div style={{ background: '#fff', border: '1.5px solid #101B33', borderRadius: 26, padding: '22px 30px', display: 'flex', flexWrap: 'wrap', gap: '12px 24px', alignItems: 'center', justifyContent: 'space-between', fontSize: 15 }}>
          <span>Applied already? Check your approval status.</span>
          <Link href="/login" className="ulink" style={{ fontSize: 15 }}>Check status</Link>
        </div>
      </div>
    </section>
  );
}
