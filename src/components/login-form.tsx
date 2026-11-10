'use client';
import Link from 'next/link';
import { useState } from 'react';

export function LoginForm() {
  const [mode, setMode] = useState<'pwd' | 'otp'>('pwd');
  const pwd = mode === 'pwd';
  const tab = (on: boolean) => ({ flex: 1, minHeight: 46, border: 0, borderRadius: 999, font: 'inherit', fontSize: 15, fontWeight: 600, color: '#101B33', cursor: 'pointer', background: on ? '#FFD966' : 'transparent' } as const);
  return (
    <div className="panel" style={{ borderRadius: 32, padding: 40 }}>
      <h2 className="d" style={{ fontSize: 36, margin: '0 0 20px' }}>Log in</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#F3F4F8', border: '1.5px solid #101B33', borderRadius: 999, padding: 5 }}>
        <button type="button" onClick={() => setMode('pwd')} style={tab(pwd)}>Password</button>
        <button type="button" onClick={() => setMode('otp')} style={tab(!pwd)}>WhatsApp OTP</button>
      </div>
      {pwd ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label className="lb" htmlFor="em">Email or phone</label><input id="em" className="fld lg" type="text" placeholder="you@yourshop.in or phone number" autoComplete="username" /></div>
          <div><label className="lb" htmlFor="pw">Password</label><input id="pw" className="fld lg" type="password" placeholder="Enter your password" autoComplete="current-password" /></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, fontSize: 15 }}><input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: '#FF6A2B' }} />Keep me logged in</label>
            <Link href="/login" className="ulink" style={{ fontSize: 15 }}>Forgot password</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label className="lb" htmlFor="ph">WhatsApp number</label><input id="ph" className="fld lg mono" type="text" inputMode="tel" placeholder="+91 98XXX XXXXX" /></div>
          <div style={{ background: '#BDEBD3', border: '1.5px solid #101B33', borderRadius: 12, padding: '12px 16px', fontSize: 15, lineHeight: 1.5 }}>We send a 6-digit code to this number on WhatsApp. It expires in [OTP EXPIRY].</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => <input key={i} aria-label={`Digit ${i + 1}`} inputMode="numeric" maxLength={1} style={{ flex: 1, minWidth: 0, height: 54, textAlign: 'center', border: '1.5px solid #101B33', borderRadius: 12, background: '#fff', font: "500 20px 'DM Mono', monospace", color: '#101B33' }} />)}
          </div>
        </div>
      )}
      <Link href="/account" className="btn hover-lift" style={{ display: 'flex', minHeight: 58, marginTop: 24, fontSize: 18 }}>{pwd ? 'Log in' : 'Send code on WhatsApp'}</Link>
    </div>
  );
}
