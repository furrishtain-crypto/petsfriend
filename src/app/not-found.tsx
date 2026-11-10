import Link from 'next/link';
import { Header, Footer } from '@/components/chrome';

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="sec" style={{ textAlign: 'center' }}>
        <h1>Page not found</h1>
        <p className="muted">That page does not exist or has moved.</p>
        <p><Link className="btn" href="/collections">Browse collections</Link></p>
      </section>
      <Footer />
    </>
  );
}
