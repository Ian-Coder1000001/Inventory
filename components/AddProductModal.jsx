'use client';
import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import imageCompression from 'browser-image-compression';

export default function AddProductModal({ batchId, onClose, onAdded }) {
  const [name, setName] = useState('');
  const [sizes, setSizes] = useState('');
  const [buyingCost, setBuyingCost] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.7, // Slightly smaller for even better performance
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const finalFile = new File([compressedFile], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
      setImageFile(finalFile);
      setImagePreview(URL.createObjectURL(finalFile));
    } catch (err) {
      setError("Failed to process image.");
    }
  }

  async function handleSubmit() {
    if (!name || !buyingCost) { setError('Name and cost required.'); return; }
    setLoading(true); setError('');
    try {
      let imageUrl = '';
      if (imageFile) {
        const fd = new FormData();
        fd.append('file', imageFile);
        const upRes = await fetchWithAuth('/api/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error || 'Upload failed');
        imageUrl = upData.url;
      }
      
      const sizesArr = sizes.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetchWithAuth('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId, name, imageUrl, sizes: sizesArr, buyingCost: Number(buyingCost) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAdded(data);
    } catch (err) { 
      setError(err.message); 
      setLoading(false); 
    }
  }

  const Label = ({ children }) => (
    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>{children}</p>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,11,16,0.9)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-up" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '480px', maxHeight: '92vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Add Product</h2>
          <button onClick={onClose} style={{ background: 'var(--surface-2)', border: 'none', color: 'var(--text-muted)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Image Input */}
          <label style={{ cursor: 'pointer' }}>
            <div style={{ border: `2px dashed var(--border)`, borderRadius: '12px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {imagePreview ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Tap to upload photo</span>}
            </div>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>

          <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" style={{ width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
          <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="Sizes (S, M, L)" style={{ width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
          <input type="number" value={buyingCost} onChange={e => setBuyingCost(e.target.value)} placeholder="Cost (KSH)" style={{ width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />

          {error && <p style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--accent)', color: '#000', borderRadius: '10px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Compressing & Saving...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}




// 'use client';
// import { useState } from 'react';
// import { fetchWithAuth } from '@/lib/fetchWithAuth';
// import imageCompression from 'browser-image-compression'; // Ensure this is installed

// export default function AddProductModal({ batchId, onClose, onAdded }) {
//   const [name, setName] = useState('');
//   const [sizes, setSizes] = useState('');
//   const [buyingCost, setBuyingCost] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // UPDATED: handleImage now compresses the file before saving to state
//   async function handleImage(e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     const options = {
//       maxSizeMB: 0.8,          // Max size ~800KB
//       maxWidthOrHeight: 1200, // Reasonable resolution for inventory
//       useWebWorker: true,
//     };

//     try {
//       const compressedFile = await imageCompression(file, options);
      
//       // Create a new File object from the blob to maintain the filename
//       const finalFile = new File([compressedFile], file.name, {
//         type: file.type,
//         lastModified: Date.now(),
//       });

//       setImageFile(finalFile);
//       setImagePreview(URL.createObjectURL(finalFile));
//     } catch (err) {
//       console.error("Compression error:", err);
//       setError("Failed to process image. Try a different one.");
//     }
//   }

//   async function handleSubmit() {
//     if (!name || !buyingCost) { setError('Name and buying cost are required.'); return; }
//     setLoading(true); setError('');
//     try {
//       let imageUrl = '';
//       if (imageFile) {
//         const fd = new FormData();
//         fd.append('file', imageFile); // This is now the smaller file
//         const upRes = await fetchWithAuth('/api/upload', { method: 'POST', body: fd });
//         const upData = await upRes.json();
//         if (!upRes.ok) { 
//             setError('Image upload failed: ' + (upData.error || '')); 
//             setLoading(false); 
//             return; 
//         }
//         imageUrl = upData.url;
//       }
//       const sizesArr = sizes.split(',').map(s => s.trim()).filter(Boolean);
//       const res = await fetchWithAuth('/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ batchId, name, imageUrl, sizes: sizesArr, buyingCost: Number(buyingCost) }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setError(data.error); setLoading(false); return; }
//       onAdded(data);
//     } catch (err) { setError('Something went wrong: ' + err.message); setLoading(false); }
//   }

//   // --- STYLES & RENDER REMAIN THE SAME ---
//   const Label = ({ children }) => (
//     <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>{children}</p>
//   );
//   const inputStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text)', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none' };

//   return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,11,16,0.88)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '16px' }}
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="fade-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }}>

//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
//           <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Add Product</h2>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
//             <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
//           <div>
//             <Label>Product Image</Label>
//             <label style={{ cursor: 'pointer', display: 'block' }}>
//               <div style={{ border: `2px dashed ${imagePreview ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.15s' }}>
//                 {imagePreview ? (
//                   <img src={imagePreview} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
//                 ) : (
//                   <div style={{ height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                     <svg width="24" height="24" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <span style={{ color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>Click to upload</span>
//                   </div>
//                 )}
//               </div>
//               <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
//             </label>
//           </div>

//           <div>
//             <Label>Product Name *</Label>
//             <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nike Air Max" style={inputStyle}
//               onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
//           </div>

//           <div>
//             <Label>Sizes <span style={{ color: 'var(--text-dim)' }}>(comma separated)</span></Label>
//             <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="e.g. 40, 41, 42, 43" style={inputStyle}
//               onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
//           </div>

//           <div>
//             <Label>Buying Cost (KES) *</Label>
//             <input type="number" value={buyingCost} onChange={e => setBuyingCost(e.target.value)} placeholder="e.g. 3500" style={inputStyle}
//               onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
//           </div>

//           {error && (
//             <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(248,81,73,0.2)', borderRadius: '8px', padding: '10px 14px', color: 'var(--red)', fontSize: '13px' }}>
//               {error}
//             </div>
//           )}

//           <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
//             <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
//               Cancel
//             </button>
//             <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '11px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
//               {loading ? (
//                 <><svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> Saving...</>
//               ) : 'Add Product'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// 'use client';
// import { useState } from 'react';
// import { fetchWithAuth } from '@/lib/fetchWithAuth';

// export default function AddProductModal({ batchId, onClose, onAdded }) {
//   const [name, setName] = useState('');
//   const [sizes, setSizes] = useState('');
//   const [buyingCost, setBuyingCost] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   function handleImage(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   }

//   async function handleSubmit() {
//     if (!name || !buyingCost) { setError('Name and buying cost are required.'); return; }
//     setLoading(true); setError('');
//     try {
//       let imageUrl = '';
//       if (imageFile) {
//         const fd = new FormData();
//         fd.append('file', imageFile);
//         const upRes = await fetchWithAuth('/api/upload', { method: 'POST', body: fd });
//         const upData = await upRes.json();
//         if (!upRes.ok) { setError('Image upload failed: ' + (upData.error || '')); setLoading(false); return; }
//         imageUrl = upData.url;
//       }
//       const sizesArr = sizes.split(',').map(s => s.trim()).filter(Boolean);
//       const res = await fetchWithAuth('/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ batchId, name, imageUrl, sizes: sizesArr, buyingCost: Number(buyingCost) }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setError(data.error); setLoading(false); return; }
//       onAdded(data);
//     } catch (err) { setError('Something went wrong: ' + err.message); setLoading(false); }
//   }

//   const Label = ({ children }) => (
//     <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>{children}</p>
//   );
//   const inputStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text)', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none' };

//   return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,11,16,0.88)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '16px' }}
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="fade-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }}>

//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
//           <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Add Product</h2>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
//             <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
//           <div>
//             <Label>Product Image</Label>
//             <label style={{ cursor: 'pointer', display: 'block' }}>
//               <div style={{ border: `2px dashed ${imagePreview ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.15s' }}>
//                 {imagePreview ? (
//                   <img src={imagePreview} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
//                 ) : (
//                   <div style={{ height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                     <svg width="24" height="24" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <span style={{ color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>Click to upload</span>
//                   </div>
//                 )}
//               </div>
//               <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
//             </label>
//           </div>

//           <div>
//             <Label>Product Name *</Label>
//             <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nike Air Max" style={inputStyle}
//               onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
//           </div>

//           <div>
//             <Label>Sizes <span style={{ color: 'var(--text-dim)' }}>(comma separated)</span></Label>
//             <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="e.g. 40, 41, 42, 43" style={inputStyle}
//               onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
//           </div>

//           <div>
//             <Label>Buying Cost (KES) *</Label>
//             <input type="number" value={buyingCost} onChange={e => setBuyingCost(e.target.value)} placeholder="e.g. 3500" style={inputStyle}
//               onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
//           </div>

//           {error && (
//             <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(248,81,73,0.2)', borderRadius: '8px', padding: '10px 14px', color: 'var(--red)', fontSize: '13px' }}>
//               {error}
//             </div>
//           )}

//           <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
//             <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
//               Cancel
//             </button>
//             <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '11px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
//               {loading ? (
//                 <><svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> Saving...</>
//               ) : 'Add Product'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }