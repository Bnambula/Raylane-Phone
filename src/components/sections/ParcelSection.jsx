import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parcels } from '../../data'

export default function ParcelSection() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <section style={{ background:'var(--white)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div>
            <div className="section-label">Parcel Services</div>
            <h2 className="section-title">Send <span>Anything</span><br/>Anywhere</h2>
            <p style={{ color:'var(--gray-text)', fontSize:14, lineHeight:1.8, marginBottom:24 }}>
              From documents to heavy cargo — your parcels travel safely with every Raylane bus. Real-time GPS tracking included on every shipment.
            </p>
            {[['📍','Real-time tracking','Know exactly where your parcel is at all times'],['🛡️','Insured delivery','3% optional insurance for high-value items'],['📲','SMS notifications','Sender & recipient get live updates'],['⚡','Same-day dispatch','Parcels leave with the next available bus']].map(([ic,t,d])=>(
              <div key={t} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
                <span style={{ fontSize:17, marginTop:2 }}>{ic}</span>
                <div>
                  <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:14 }}>{t}</div>
                  <div style={{ color:'var(--gray-text)', fontSize:13 }}>{d}</div>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/parcels')} style={{ marginTop:10, padding:'13px 28px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'var(--shadow-md)' }}>
              📦 Send a Parcel Now
            </button>
          </div>
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {parcels.map(p => (
                <div key={p.id} onClick={() => setSelected(selected===p.id?null:p.id)}
                  style={{ background:selected===p.id?'var(--blue)':'var(--white)', color:selected===p.id?'var(--white)':'var(--dark)', border:`2px solid ${selected===p.id?'var(--blue)':'var(--gray-mid)'}`, borderRadius:16, padding:18, cursor:'pointer', transition:'all .22s', boxShadow:selected===p.id?'0 8px 24px rgba(11,61,145,0.25)':'var(--shadow-sm)', transform:selected===p.id?'translateY(-3px)':'none' }}>
                  <div style={{ fontSize:30, marginBottom:10 }}>{p.icon}</div>
                  <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:13, marginBottom:5 }}>{p.name}</div>
                  <div style={{ fontSize:11, opacity:.75, marginBottom:10 }}>{p.desc}</div>
                  <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:900, fontSize:15, color:selected===p.id?'var(--gold)':'var(--blue)' }}>UGX {p.price.toLocaleString()}</div>
                  <div style={{ fontSize:10, opacity:.7, marginTop:2 }}>Max {p.maxWeight}</div>
                </div>
              ))}
            </div>
            {selected && (
              <button onClick={() => navigate(`/parcels?type=${selected}`)} style={{ width:'100%', marginTop:14, padding:'13px', borderRadius:14, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'0 4px 16px rgba(255,199,44,0.4)' }}>
                Book {parcels.find(p=>p.id===selected)?.name} →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
