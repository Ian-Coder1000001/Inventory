'use client';
import { useEffect, useState } from 'react';

export default function ActivityFeed({ batchId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/activity/${batchId}`)
      .then(r => r.json())
      .then(data => { setActivities(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [batchId]);

  return (
    <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '6px', height: '6px', background: 'var(--amber)', borderRadius: '50%' }} />
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>Activity Log</h2>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)', marginLeft: '4px' }}>
          — owner view only
        </span>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth={2.5}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>No activity recorded yet</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {activities.map((a, i) => (
          <div key={a._id} className="fade-up" style={{ animationDelay: `${i * 0.03}s`, opacity: 0, display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--amber-dim)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
              <svg width="12" height="12" fill="none" stroke="var(--amber)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--text)', fontSize: '13px', lineHeight: 1.5 }}>{a.action}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'DM Mono, monospace', marginTop: '4px' }}>
                {a.userEmail} · {new Date(a.createdAt).toLocaleString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}