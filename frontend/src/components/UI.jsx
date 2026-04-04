import React from 'react';

const S = {
  btn: {
    base: { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'var(--font-body)', fontWeight:600, borderRadius:'var(--radius-md)', border:'none', cursor:'pointer', transition:'all 0.18s', fontSize:15, padding:'12px 24px', lineHeight:1 },
    primary: { background:'var(--gold)', color:'var(--navy)' },
    navy: { background:'var(--navy)', color:'var(--white)' },
    green: { background:'var(--green)', color:'var(--navy)' },
    ghost: { background:'transparent', color:'var(--navy)', border:'1.5px solid var(--gray-200)' },
    danger: { background:'#FEE2E2', color:'var(--red)', border:'none' },
    sm: { fontSize:13, padding:'8px 16px' },
    lg: { fontSize:17, padding:'16px 32px' },
    full: { width:'100%' },
    pill: { borderRadius:99 },
  },
  input: { width:'100%', height:48, padding:'0 16px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, background:'var(--white)', outline:'none', fontFamily:'var(--font-body)', color:'var(--gray-800)', transition:'border-color 0.15s' },
  label: { display:'block', fontSize:13, fontWeight:600, color:'var(--gray-600)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' },
  card: { background:'var(--white)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)', border:'1px solid var(--gray-200)', padding:24 },
  badge: {
    base: { display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:99, letterSpacing:'0.04em', textTransform:'uppercase' },
    green: { background:'var(--green-light)', color:'#00885A' },
    gold: { background:'var(--gold-light)', color:'#C47D00' },
    red: { background:'#FEE2E2', color:'var(--red)' },
    gray: { background:'var(--gray-100)', color:'var(--gray-600)' },
    navy: { background:'#E8EDF5', color:'var(--navy)' },
  },
};

export const Btn = ({ children, variant='primary', size, full, pill, onClick, disabled, type='button', style={} }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    style={{ ...S.btn.base, ...S.btn[variant], ...(size?S.btn[size]:{}), ...(full?S.btn.full:{}), ...(pill?S.btn.pill:{}), ...(disabled?{opacity:0.5,cursor:'not-allowed'}:{}), ...style }}>
    {children}
  </button>
);

export const Input = ({ label, icon, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={S.label}>{label}</label>}
    <div style={{ position:'relative' }}>
      {icon && <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:18, color:'var(--gray-400)' }}>{icon}</span>}
      <input style={{ ...S.input, paddingLeft: icon ? 44 : 16 }} {...props} />
    </div>
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={S.label}>{label}</label>}
    <select style={{ ...S.input, appearance:'none', cursor:'pointer', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235A6478' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'calc(100% - 14px) center' }} {...props}>
      {children}
    </select>
  </div>
);

export const Card = ({ children, style={} }) => <div style={{ ...S.card, ...style }}>{children}</div>;

export const Badge = ({ children, variant='gray' }) => (
  <span style={{ ...S.badge.base, ...S.badge[variant] }}>{children}</span>
);

export const Spinner = ({ size=24 }) => (
  <div style={{ width:size, height:size, border:`3px solid var(--gray-200)`, borderTop:`3px solid var(--gold)`, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export const Empty = ({ icon='📭', text='Nothing here yet' }) => (
  <div style={{ textAlign:'center', padding:'48px 24px', color:'var(--gray-400)' }}>
    <div style={{ fontSize:48, marginBottom:12 }}>{icon}</div>
    <div style={{ fontSize:15 }}>{text}</div>
  </div>
);

export const Stat = ({ label, value, sub, color='var(--navy)', icon }) => (
  <div style={{ background:'var(--white)', borderRadius:'var(--radius-md)', padding:'20px', border:'1px solid var(--gray-200)', boxShadow:'var(--shadow-sm)' }}>
    <div style={{ fontSize:12, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>{label}</div>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ fontSize:28, fontWeight:800, color, fontFamily:'var(--font-display)', letterSpacing:'-0.5px' }}>{value}</div>
      {icon && <div style={{ fontSize:28 }}>{icon}</div>}
    </div>
    {sub && <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:4 }}>{sub}</div>}
  </div>
);

export const formatUGX = n => `UGX ${Number(n||0).toLocaleString()}`;
export const formatDate = d => new Date(d).toLocaleDateString('en-UG', { day:'numeric', month:'short', year:'numeric' });
export const formatTime = d => new Date(d).toLocaleTimeString('en-UG', { hour:'2-digit', minute:'2-digit' });

export const statusColor = s => ({ LIVE:'green', ACTIVE:'green', CONFIRMED:'green', DELIVERED:'green', PENDING:'gold', PENDING_PAYMENT:'gold', IN_TRANSIT:'gold', SUSPENDED:'red', CANCELLED:'red', REJECTED:'red', HELD:'navy', PAID_OUT:'green' }[s] || 'gray');

export default S;
