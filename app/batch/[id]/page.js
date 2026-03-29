'use client';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AddProductModal from '@/components/AddProductModal';
import SellModal from '@/components/SellModal';
import BatchSummaryBar from '@/components/BatchSummaryBar';
import ActivityFeed from '@/components/ActivityFeed';

export default function BatchPage() {
  const router = useRouter();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [sellTarget, setSellTarget] = useState(null);
  const [batchName, setBatchName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (!role) { router.push('/login'); return; }
    setSession({ role, email });
    fetchData();
  }, [id]);

  async function fetchData() {
    const [batchRes, productsRes] = await Promise.all([
      fetchWithAuth('/api/batches'),
      fetchWithAuth(`/api/products?batchId=${id}`),
    ]);
    const batches = await batchRes.json();
    const prods = await productsRes.json();
    const thisBatch = Array.isArray(batches) ? batches.find(b => b._id === id) : null;
    if (thisBatch) { setBatchName(thisBatch.name); setBatchNumber(thisBatch.batchNumber); }
    setProducts(Array.isArray(prods) ? prods : []);
    setLoading(false);
  }

  async function handleDelete(productId) {
    if (!confirm('Delete this product?')) return;
    await fetchWithAuth(`/api/products/${productId}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p._id !== productId));
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.5}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    </div>
  );

  const inStock = products.filter(p => p.status === 'in_stock');
  const sold = products.filter(p => p.status === 'sold');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar email={session?.email} role={session?.role} />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 160px' }}>

        {/* Back + Header */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', padding: 0, fontFamily: 'DM Sans, sans-serif' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Batches
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: 'var(--accent-dim)', borderRadius: '6px', padding: '4px 10px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--accent)', fontWeight: 500 }}>
                  BATCH {String(batchNumber).padStart(2, '0')}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', padding: '3px 8px', borderRadius: '999px', background: 'var(--green-dim)', color: 'var(--green)' }}>
                    {inStock.length} in stock
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', padding: '3px 8px', borderRadius: '999px', background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                    {sold.length} sold
                  </span>
                </div>
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>{batchName}</h1>
            </div>

            {session?.role === 'manager' && (
              <button
                onClick={() => setShowAddProduct(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginBottom: '32px' }} />

        {/* Empty state */}
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>No products yet</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
              {session?.role === 'manager' ? 'Add the first product to this batch.' : "Manager hasn't added any products yet."}
            </p>
          </div>
        )}

        {/* Products grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {products.map((product, i) => (
            <div key={product._id} className="fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0, background: 'var(--surface)', border: `1px solid ${product.status === 'sold' ? 'var(--border)' : 'var(--border)'}`, borderRadius: '12px', overflow: 'hidden', opacity: product.status === 'sold' ? 0.7 : 1 }}>

              {/* Image */}
              <div style={{ aspectRatio: '1', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="32" height="32" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Status pill */}
                <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', background: product.status === 'sold' ? 'rgba(0,0,0,0.7)' : 'rgba(63,185,80,0.15)', color: product.status === 'sold' ? 'var(--text-muted)' : 'var(--green)', border: product.status === 'sold' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(63,185,80,0.3)', backdropFilter: 'blur(4px)' }}>
                  {product.status === 'sold' ? 'SOLD' : 'IN STOCK'}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{product.name}</h3>

                {product.sizes?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {product.sizes.map((s, j) => (
                      <span key={j} style={{ padding: '2px 8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{s}</span>
                    ))}
                  </div>
                )}

                {/* Financials */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Buying cost</span>
                    <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>KES {product.buyingCost?.toLocaleString()}</span>
                  </div>
                  {product.status === 'sold' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Sold for</span>
                        <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>KES {product.salePrice?.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Profit</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'DM Mono, monospace', color: product.profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          KES {product.profit?.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Date */}
                <p style={{ color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'DM Mono, monospace', marginBottom: session?.role === 'manager' ? '12px' : '0' }}>
                  Added {new Date(product.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {product.soldAt && ` · Sold ${new Date(product.soldAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}`}
                </p>

                {/* Manager actions */}
                {session?.role === 'manager' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.status === 'in_stock' && (
                      <button
                        onClick={() => setSellTarget(product)}
                        style={{ flex: 1, padding: '9px', background: 'var(--green)', border: 'none', borderRadius: '7px', color: '#000', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}
                      >
                        Mark Sold
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{ padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '7px', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                      onMouseOver={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'rgba(248,81,73,0.2)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed - owner only */}
        {session?.role === 'owner' && <ActivityFeed batchId={id} />}
      </main>

      <BatchSummaryBar products={products} />

      {showAddProduct && (
        <AddProductModal
          batchId={id}
          onClose={() => setShowAddProduct(false)}
          onAdded={(p) => { setProducts(prev => [p, ...prev]); setShowAddProduct(false); }}
        />
      )}
      {sellTarget && (
        <SellModal
          product={sellTarget}
          onClose={() => setSellTarget(null)}
          onSold={(updated) => { setProducts(prev => prev.map(p => p._id === updated._id ? updated : p)); setSellTarget(null); }}
        />
      )}
    </div>
  );
}