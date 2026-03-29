'use client';
import { useRouter } from 'next/navigation';

export default function Navbar({ email, role }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    window.location.href = '/login';
  }

  return (
    <nav style={{ borderBottom: '1px solid var(--border)', background: 'rgba(8,11,16,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '15px', color: 'var(--text)', letterSpacing: '0.06em' }}>STOCKR</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>{email}</span>
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase',
                background: role === 'owner' ? 'var(--amber-dim)' : 'var(--accent-dim)',
                color: role === 'owner' ? 'var(--amber)' : 'var(--accent)',
              }}>
                {role}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 12px', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}
            onMouseOver={e => { e.target.style.color = 'var(--text)'; e.target.style.borderColor = 'var(--text-dim)'; }}
            onMouseOut={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)'; }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}