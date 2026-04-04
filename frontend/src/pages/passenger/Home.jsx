import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn, Input, Select } from '../../components/UI';

const UGANDAN_CITIES = ['Kampala','Mbale','Gulu','Mbarara','Jinja','Masaka','Soroti','Lira','Fort Portal','Kabale','Arua','Tororo','Iganga','Mukono','Entebbe'];

export default function PassengerHome() {
  const nav = useNavigate();
  const [form, setForm] = useState({ from:'Kampala', to:'', date: new Date().toISOString().split('T')[0], vehicleType:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const search = e => {
    e.preventDefault();
    nav(`/search?from=${form.from}&to=${form.to}&date=${form.date}&vehicleType=${form.vehicleType}`);
  };

  const routes = [
    { from:'Kampala', to:'Mbale', price:'25,000', img:'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', tag:'4h 30m' },
    { from:'Kampala', to:'Gulu', price:'35,000', img:'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600&q=80', tag:'5h' },
    { from:'Kampala', to:'Mbarara', price:'22,000', img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', tag:'3h 30m' },
    { from:'Kampala', to:'Jinja', price:'12,000', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', tag:'1h 30m' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)' }}>
      {/* HERO */}
      <div style={{ background:'var(--navy)', position:'relative', overflow:'hidden', paddingBottom:80 }}>
        {/* Geometric background pattern */}
        <div style={{ position:'absolute', inset:0, opacity:0.06 }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ position:'absolute', width:200, height:200, borderRadius:'50%', border:'2px solid var(--gold)', top:`${-20+i*40}%`, left:`${-10+i*25}%`, transform:`scale(${0.5+i*0.3})` }} />
          ))}
        </div>

        {/* Nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 20px 0', position:'relative', zIndex:2 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, background:'var(--gold)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🚌</div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'var(--white)', fontSize:20, letterSpacing:'-0.3px' }}>Raylane</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn variant='ghost' size='sm' pill style={{ color:'white', borderColor:'rgba(255,255,255,0.3)' }} onClick={() => nav('/track')}>Track</Btn>
            <Btn variant='gold' size='sm' pill onClick={() => nav('/login')}>Login</Btn>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ padding:'48px 20px 40px', position:'relative', zIndex:2 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Uganda & East Africa</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:38, fontWeight:800, color:'var(--white)', lineHeight:1.05, letterSpacing:'-1px', marginBottom:10 }}>
            Travel smarter.<br/><span style={{ color:'var(--gold)' }}>Book faster.</span>
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.6, maxWidth:320 }}>
            Book seats, send parcels, track trips — all in one place.
          </p>
        </div>

        {/* Search card — floats over hero */}
        <div style={{ margin:'0 16px', background:'var(--white)', borderRadius:'var(--radius-xl)', padding:20, boxShadow:'var(--shadow-lg)', position:'relative', zIndex:2 }}>
          <form onSubmit={search}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:4 }}>From</label>
                <select value={form.from} onChange={set('from')} style={{ width:'100%', height:44, padding:'0 12px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none', background:'var(--gray-50)' }}>
                  {UGANDAN_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:4 }}>To</label>
                <select value={form.to} onChange={set('to')} style={{ width:'100%', height:44, padding:'0 12px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none', background:'var(--gray-50)' }}>
                  <option value=''>Any destination</option>
                  {UGANDAN_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:4 }}>Date</label>
                <input type='date' value={form.date} onChange={set('date')} style={{ width:'100%', height:44, padding:'0 12px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none', background:'var(--gray-50)' }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:4 }}>Vehicle</label>
                <select value={form.vehicleType} onChange={set('vehicleType')} style={{ width:'100%', height:44, padding:'0 12px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none', background:'var(--gray-50)' }}>
                  <option value=''>All types</option>
                  <option value='COACH'>Coach Bus</option>
                  <option value='MINI_BUS'>Mini Bus</option>
                </select>
              </div>
            </div>
            <Btn type='submit' full style={{ height:52, fontSize:16, borderRadius:'var(--radius-md)' }}>
              🔍 Search Trips
            </Btn>
          </form>
        </div>
      </div>

      {/* Popular routes */}
      <div style={{ padding:'32px 20px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--navy)' }}>Popular Routes</h2>
          <span style={{ fontSize:13, color:'var(--gold)', fontWeight:600 }}>See all →</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {routes.map((r,i) => (
            <div key={i} onClick={() => nav(`/search?from=${r.from}&to=${r.to}&date=${form.date}`)}
              style={{ borderRadius:'var(--radius-lg)', overflow:'hidden', cursor:'pointer', position:'relative', height:150, boxShadow:'var(--shadow-md)' }}>
              <img src={r.img} alt={r.to} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 20%,rgba(11,22,40,0.85) 100%)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:12 }}>
                <div style={{ fontSize:11, color:'var(--gold)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{r.tag}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'white', lineHeight:1.2 }}>{r.from} → {r.to}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', marginTop:2 }}>From UGX {r.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding:'28px 20px' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--navy)', marginBottom:16 }}>Quick Actions</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {[
            { icon:'📦', label:'Send Parcel', path:'/parcels' },
            { icon:'🎫', label:'My Ticket', path:'/track' },
            { icon:'🚌', label:'All Trips', path:'/search' },
          ].map((a,i) => (
            <div key={i} onClick={() => nav(a.path)}
              style={{ background:'var(--white)', borderRadius:'var(--radius-md)', padding:'20px 12px', textAlign:'center', cursor:'pointer', border:'1px solid var(--gray-200)', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{a.icon}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--navy)' }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background:'var(--navy)', margin:'0 0 0', padding:'32px 20px 48px' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--white)', marginBottom:24, textAlign:'center' }}>How it works</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { num:'01', title:'Search your route', desc:'Enter your origin, destination and travel date' },
            { num:'02', title:'Pick your seat', desc:'Choose from a live interactive seat map' },
            { num:'03', title:'Pay with Mobile Money', desc:'MTN or Airtel — instant confirmation' },
            { num:'04', title:'Get your e-ticket', desc:'QR code ticket delivered instantly' },
          ].map((s,i) => (
            <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--gold)', fontFamily:'var(--font-display)', minWidth:32 }}>{s.num}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--white)', marginBottom:4 }}>{s.title}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'var(--white)', borderTop:'1px solid var(--gray-200)', display:'flex', padding:'10px 0 16px', zIndex:100 }}>
        {[
          { icon:'🏠', label:'Home', path:'/' },
          { icon:'🔍', label:'Search', path:'/search' },
          { icon:'📦', label:'Parcels', path:'/parcels' },
          { icon:'🎫', label:'Tickets', path:'/track' },
        ].map((t,i) => (
          <div key={i} onClick={() => nav(t.path)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer' }}>
            <div style={{ fontSize:22 }}>{t.icon}</div>
            <div style={{ fontSize:10, fontWeight:500, color: window.location.pathname === t.path ? 'var(--gold)' : 'var(--gray-400)' }}>{t.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height:80 }} />
    </div>
  );
}
