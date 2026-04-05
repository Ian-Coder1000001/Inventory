export default function BatchSummaryBar({ products }) {
  const inStock = products.filter(p => p.status === 'in_stock').length;
  const totalBuying = products.reduce((a, p) => a + (p.buyingCost || 0), 0);
  const totalRevenue = products.filter(p => p.status === 'sold').reduce((a, p) => a + (p.salePrice || 0), 0);
  const totalProfit = products.filter(p => p.status === 'sold').reduce((a, p) => a + (p.profit || 0), 0);

  const stats = [
    { label: 'In Stock', value: inStock, color: 'var(--text)' },
    { label: 'Total Cost', value: `KSH ${totalBuying.toLocaleString()}`, color: 'var(--text)' },
    { label: 'Revenue', value: `KSH ${totalRevenue.toLocaleString()}`, color: 'var(--accent)' },
    { label: 'Profit', value: `KSH ${totalProfit.toLocaleString()}`, color: totalProfit >= 0 ? 'var(--green)' : 'var(--red)' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(8,11,16,0.98)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Responsive Grid: 2 columns on mobile, 4 on laptop */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ 
              padding: '12px 16px', 
              borderRight: '1px solid var(--border)',
              borderBottom: i < 2 ? '1px solid var(--border)' : 'none', // for 2-row mobile layout
              '@media (min-width: 600px)': { borderBottom: 'none' }
            }}>
              <p style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace', marginBottom: '2px' }}>
                {s.label}
              </p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: s.color, fontFamily: 'Syne, sans-serif' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// export default function BatchSummaryBar({ products }) {
//   const inStock = products.filter(p => p.status === 'in_stock').length;
//   const totalBuying = products.reduce((a, p) => a + (p.buyingCost || 0), 0);
//   const totalRevenue = products.filter(p => p.status === 'sold').reduce((a, p) => a + (p.salePrice || 0), 0);
//   const totalProfit = products.filter(p => p.status === 'sold').reduce((a, p) => a + (p.profit || 0), 0);

//   const stats = [
//     { label: 'In Stock', value: inStock, mono: true, color: 'var(--text)' },
//     { label: 'Total Cost', value: `KES ${totalBuying.toLocaleString()}`, color: 'var(--text)' },
//     { label: 'Revenue', value: `KES ${totalRevenue.toLocaleString()}`, color: 'var(--accent)' },
//     { label: 'Profit', value: `KES ${totalProfit.toLocaleString()}`, color: totalProfit >= 0 ? 'var(--green)' : 'var(--red)' },
//   ];

//   return (
//     <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(8,11,16,0.96)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(16px)', zIndex: 40 }}>
//       <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderLeft: '1px solid var(--border)' }}>
//           {stats.map((s, i) => (
//             <div key={i} style={{ padding: '16px 20px', borderRight: '1px solid var(--border)' }}>
//               <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace', marginBottom: '4px' }}>
//                 {s.label}
//               </p>
//               <p style={{ fontSize: '18px', fontWeight: 700, color: s.color, fontFamily: 'Syne, sans-serif' }}>
//                 {s.value}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }