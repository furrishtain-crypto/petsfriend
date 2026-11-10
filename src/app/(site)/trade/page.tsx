import type { Metadata } from 'next';
import Link from 'next/link';
import { FormNotice } from '@/components/form-notice';
import { collections } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Apply for a trade account',
  description: 'Pet shops, clinics and distributors can apply for a Pets Friend trade account. GST number is optional.',
  alternates: { canonical: '/trade' },
};

const STEPS = [
  { n: '1', t: 'Submit this form', d: 'Business details, GSTIN and a copy of your GST certificate.', bg: '#FFD966' },
  { n: '2', t: 'We verify your GST', d: 'The trade desk checks the details and approves the account in [VERIFICATION TIME].', bg: '#BDEBD3' },
  { n: '3', t: 'Prices unlock', d: 'Log in to see MOQs and slab prices, build an order sheet, and pay or request a quote.', bg: '#BFE0FF' },
];

export default function Trade() {
  const cats = collections().map((c) => c.name);
  return (
    <section className="sectionpad" style={{ paddingTop: 56, paddingBottom: 80, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'stretch' }}>
      <div style={{ flex: '1 1 380px', minWidth: 0, background: '#101B33', color: '#F3F4F8', borderRadius: 30, padding: '44px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <span className="m" style={{ fontSize: 13, color: '#FFD966' }}>Trade account</span>
          <h1 className="d" style={{ fontSize: 54, lineHeight: 1, margin: '14px 0 16px' }}>Apply for wholesale pricing.</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: '#C9CEDD', margin: 0 }}>Tell us about your business. Once approved, MOQs and slab prices show across the whole catalog.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span className="d" style={{ flex: '0 0 44px', height: 44, borderRadius: '50%', background: s.bg, color: '#101B33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.n}</span>
              <div><div className="d" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{s.t}</div><div style={{ fontSize: 15, lineHeight: 1.5, color: '#C9CEDD', marginTop: 4 }}>{s.d}</div></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', borderTop: '1px solid #36425F', paddingTop: 20, fontSize: 14, color: '#C9CEDD' }}>
          Already approved? <Link href="/login" style={{ color: '#FFD966', fontWeight: 600, borderBottom: '2px solid #FFD966' }}>Log in to your account</Link>
        </div>
      </div>

      <form name="trade-application" method="POST" action="/trade?sent=1" encType="multipart/form-data" data-netlify="true" netlify-honeypot="bot-field" className="panel" style={{ flex: '1 1 560px', minWidth: 0, borderRadius: 30, padding: 40, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <input type="hidden" name="form-name" value="trade-application" />
        <p hidden><label>Do not fill this in: <input name="bot-field" /></label></p>
        <FormNotice message="Thanks. We have your application and will reply on WhatsApp and email." />

        <div>
          <div className="d" style={{ fontSize: 26, marginBottom: 16 }}>Business details</div>
          <div className="fgrid">
            <div className="full"><label className="lb" htmlFor="bn">Business name</label><input id="bn" name="shop_name" required className="fld" placeholder="Shop or company name" /></div>
            <div><label className="lb" htmlFor="bt">Business type</label>
              <select id="bt" name="business_type" className="fld sel2"><option>Pet store</option><option>Veterinary clinic</option><option>Distributor</option><option>Online seller</option><option>Groomer</option></select></div>
            <div><label className="lb" htmlFor="gstin">GSTIN <span style={{ fontFamily: 'inherit', color: '#4A5470' }}>(optional)</span></label><input id="gstin" name="gstin" maxLength={15} pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z][1-9A-Za-z]Z[0-9A-Za-z]" title="15-character GSTIN, for example 27ABCDE1234F1Z5. Leave empty to skip." className="fld mono" placeholder="15-character GSTIN" style={{ textTransform: 'uppercase' }} /></div>
            <div><label className="lb" htmlFor="city">City</label><input id="city" name="city" className="fld" placeholder="City" /></div>
            <div><label className="lb" htmlFor="st">State</label><input id="st" name="state" className="fld" placeholder="State" /></div>
          </div>
        </div>

        <div>
          <div className="d" style={{ fontSize: 26, marginBottom: 16 }}>Contact person</div>
          <div className="fgrid">
            <div><label className="lb" htmlFor="cn">Full name</label><input id="cn" name="contact" className="fld" placeholder="Your name" /></div>
            <div><label className="lb" htmlFor="ph">WhatsApp number</label><input id="ph" name="phone" inputMode="tel" className="fld mono" placeholder="+91 98XXX XXXXX" /></div>
            <div className="full"><label className="lb" htmlFor="em">Work email</label><input id="em" name="email" type="email" required className="fld" placeholder="you@yourshop.in" /></div>
          </div>
        </div>

        <div>
          <div className="d" style={{ fontSize: 26, marginBottom: 16 }}>What will you stock?</div>
          <label className="lb" htmlFor="vol" style={{ marginBottom: 8 }}>Expected monthly volume</label>
          <select id="vol" name="volume" className="fld sel2"><option>Under 500 pcs</option><option>500–2,000 pcs</option><option>2,000–10,000 pcs</option><option>10,000+ pcs</option></select>
          <div className="lb" style={{ margin: '18px 0 8px' }}>Categories of interest</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cats.map((c) => (
              <label key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '0 16px', border: '1.5px solid #101B33', borderRadius: 999, fontSize: 15, fontWeight: 600, background: '#fff' }}>
                <input type="checkbox" name="categories" value={c} style={{ width: 18, height: 18, accentColor: '#101B33' }} />{c}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="d" style={{ fontSize: 26, marginBottom: 12 }}>GST certificate <span className="mchip" style={{ background: '#BDEBD3', verticalAlign: 'middle', marginLeft: 8 }}>Optional</span></div>
          <label htmlFor="gstfile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 110, border: '2px dashed #101B33', borderRadius: 16, background: '#F3F4F8', fontSize: 15, textAlign: 'center', padding: 16 }}>
            <span style={{ fontWeight: 600 }}>Upload a PDF or photo of your GST certificate</span>
            <span style={{ fontSize: 13, color: '#4A5470' }}>Used only to verify your trade account</span>
            <input id="gstfile" name="gstfile" type="file" accept="image/*,application/pdf" style={{ marginTop: 6, fontSize: 14 }} />
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, lineHeight: 1.5, color: '#4A5470' }}>
          <input type="checkbox" required style={{ width: 20, height: 20, marginTop: 2, accentColor: '#FF6A2B', flex: '0 0 auto' }} />I confirm these details are correct and agree to the trade terms.
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <button type="submit" className="btn hover-lift" style={{ minHeight: 56, padding: '0 36px', fontSize: 17 }}>Submit application</button>
          <span style={{ fontSize: 14, color: '#4A5470' }}>We reply on WhatsApp and email.</span>
        </div>
      </form>
    </section>
  );
}
