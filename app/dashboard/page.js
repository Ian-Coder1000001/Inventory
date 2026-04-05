'use client';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (!role) { router.push('/login'); return; }
    setSession({ role, email });
    fetchBatches();
  }, []);

  async function fetchBatches() {
    const res = await fetchWithAuth('/api/batches');
    if (!res.ok) { router.push('/login'); return; }
    const data = await res.json();
    setBatches(data);
    setLoading(false);
  }

  async function addBatch() {
    setAdding(true);
    const res = await fetchWithAuth('/api/batches', { method: 'POST' });
    if (res.ok) {
      const batch = await res.json();
      setBatches(prev => [...prev, batch]);
    }
    setAdding(false);
  }

  async function deleteBatch(e, batchId) {
    e.stopPropagation(); // Prevents clicking the card and going to the batch page
    if (!confirm('Are you sure? This will delete the batch and all products inside it.')) return;
    
    const res = await fetchWithAuth(`/api/batches/${batchId}`, { method: 'DELETE' });
    if (res.ok) {
      setBatches(prev => prev.filter(b => b._id !== batchId));
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.5}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar email={session?.email} role={session?.role} />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Overview
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>Batches</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
              {batches.length === 0 ? 'No batches created yet' : `${batches.length} restocking batch${batches.length > 1 ? 'es' : ''}`}
            </p>
          </div>

          {session?.role === 'manager' && (
            <button
              onClick={addBatch}
              disabled={adding}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: adding ? 'not-allowed' : 'pointer', opacity: adding ? 0.5 : 1, transition: 'opacity 0.15s' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              {adding ? 'Creating...' : 'New Batch'}
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', marginBottom: '32px' }} />

        {/* Empty state */}
        {batches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>No batches yet</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
              {session?.role === 'manager' ? 'Create your first batch to start tracking inventory.' : 'Waiting for the manager to create the first batch.'}
            </p>
          </div>
        )}

        {/* Batch grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {batches.map((batch, i) => (
            <div 
              key={batch._id} 
              className="fade-up" 
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0, position: 'relative' }}
            >
              <button
                onClick={() => router.push(`/batch/${batch._id}`)}
                style={{ textAlign: 'left', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'all 0.15s', display: 'block', width: '100%' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-dim)'; e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ background: 'var(--accent-dim)', borderRadius: '8px', padding: '6px 12px', fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 500, color: 'var(--accent)' }}>
                    BATCH {batch.batchNumber.toString().padStart(2, '0')}
                  </div>
                  
                  {/* Delete Button for Owner only */}
                  {session?.role === 'owner' ? (
                    <div 
                      onClick={(e) => deleteBatch(e, batch._id)}
                      style={{ padding: '6px', borderRadius: '6px', color: 'var(--text-dim)', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.stopPropagation(); e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-dim)'; }}
                      onMouseOut={e => { e.stopPropagation(); e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                       <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{batch.name}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>
                  {new Date(batch.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}



// 'use client';
// import { fetchWithAuth } from '@/lib/fetchWithAuth';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Navbar from '@/components/Navbar';

// export default function Dashboard() {
//   const router = useRouter();
//   const [batches, setBatches] = useState([]);
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);

//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     const email = localStorage.getItem('email');
//     if (!role) { router.push('/login'); return; }
//     setSession({ role, email });
//     fetchBatches();
//   }, []);

//   async function fetchBatches() {
//     const res = await fetchWithAuth('/api/batches');
//     if (!res.ok) { router.push('/login'); return; }
//     const data = await res.json();
//     setBatches(data);
//     setLoading(false);
//   }

//   async function addBatch() {
//     setAdding(true);
//     const res = await fetchWithAuth('/api/batches', { method: 'POST' });
//     if (res.ok) {
//       const batch = await res.json();
//       setBatches(prev => [...prev, batch]);
//     }
//     setAdding(false);
//   }

//   if (loading) return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.5}>
//         <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
//       </svg>
//     </div>
//   );

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
//       <Navbar email={session?.email} role={session?.role} />

//       <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

//         {/* Header row */}
//         <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
//           <div>
//             <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
//               Overview
//             </p>
//             <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>Batches</h1>
//             <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
//               {batches.length === 0 ? 'No batches created yet' : `${batches.length} restocking batch${batches.length > 1 ? 'es' : ''}`}
//             </p>
//           </div>

//           {session?.role === 'manager' && (
//             <button
//               onClick={addBatch}
//               disabled={adding}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: adding ? 'not-allowed' : 'pointer', opacity: adding ? 0.5 : 1, transition: 'opacity 0.15s' }}
//             >
//               <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
//               </svg>
//               {adding ? 'Creating...' : 'New Batch'}
//             </button>
//           )}
//         </div>

//         {/* Divider */}
//         <div style={{ borderTop: '1px solid var(--border)', marginBottom: '32px' }} />

//         {/* Empty state */}
//         {batches.length === 0 && (
//           <div style={{ textAlign: 'center', padding: '80px 24px' }}>
//             <div style={{ width: '56px', height: '56px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
//               <svg width="24" height="24" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
//               </svg>
//             </div>
//             <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>No batches yet</p>
//             <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
//               {session?.role === 'manager' ? 'Create your first batch to start tracking inventory.' : 'Waiting for the manager to create the first batch.'}
//             </p>
//           </div>
//         )}

//         {/* Batch grid */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
//           {batches.map((batch, i) => (
//             <button
//               key={batch._id}
//               onClick={() => router.push(`/batch/${batch._id}`)}
//               className="fade-up"
//               style={{ animationDelay: `${i * 0.05}s`, opacity: 0, textAlign: 'left', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s, background 0.15s', display: 'block', width: '100%' }}
//               onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-dim)'; e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
//               onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.transform = 'translateY(0)'; }}
//             >
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
//                 <div style={{ background: 'var(--accent-dim)', borderRadius: '8px', padding: '6px 12px', fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 500, color: 'var(--accent)' }}>
//                   BATCH {batch.batchNumber.toString().padStart(2, '0')}
//                 </div>
//                 <svg width="16" height="16" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//               <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{batch.name}</h3>
//               <p style={{ color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>
//                 {new Date(batch.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
//               </p>
//             </button>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }