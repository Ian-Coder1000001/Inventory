'use client';
import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export default function SellModal({ product, onClose, onSold }) {
  const [salePrice, setSalePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const profit = salePrice ? Number(salePrice) - product.buyingCost : null;

  async function handleSell() {
    if (!salePrice) { setError('Enter the sale price.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetchWithAuth(`/api/products/${product._id}/sell`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salePrice: Number(salePrice) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Server error'); setLoading(false); return; }
      onSold(data);
    } catch (err) { setError('Something went wrong: ' + err.message); setLoading(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,11,16,0.88)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '16px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Mark as Sold</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '48px', height: '48px', background: 'var(--surface-2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                </svg>
              </div>
            )}
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>{product.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'DM Mono, monospace', marginTop: '3px' }}>
                Cost: KES {product.buyingCost?.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>
              Sale Price (KES) *
            </p>
            <input
              type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)}
              placeholder="Enter amount" autoFocus
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '11px 14px', color: 'var(--text)', fontSize: '20px', fontFamily: 'Syne, sans-serif', fontWeight: 700, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = 'var(--green)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {profit !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: profit >= 0 ? 'var(--green-dim)' : 'var(--red-dim)', border: `1px solid ${profit >= 0 ? 'rgba(63,185,80,0.2)' : 'rgba(248,81,73,0.2)'}`, borderRadius: '8px', padding: '12px 16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Profit</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                KES {profit.toLocaleString()}
              </span>
            </div>
          )}

          {error && <p style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Cancel
            </button>
            <button onClick={handleSell} disabled={loading} style={{ flex: 1, padding: '11px', background: 'var(--green)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontFamily: 'Syne, sans-serif' }}>
              {loading ? 'Saving...' : 'Confirm Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}