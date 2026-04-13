import React from 'react'
import { useNavigate } from 'react-router-dom'

const SERVICES = [
  { icon:'[PAX]', title:'Passenger Booking', desc:'Search routes, pick seats live, pay via mobile money, get your QR ticket instantly.', to:'/book', color:'#0B3D91', label:'Book Now' },
  { icon:'[BOX]', title:'Parcel Delivery', desc:'Send envelopes to heavy cargo across Uganda. GPS-tracked, insured, and same-day dispatch.', to:'/parcels', color:'#15803d', label:'Send Parcel' },
  { icon:'[BUS]', title:'Charter Vehicles', desc:'Need a private bus for events, schools, or corporate travel? Get a full vehicle quote.', to:'/book?charter=true', color:'#7c3aed', label:'Get Quote' },
  { icon:'?', title:'Tourist Planning', desc:'Discover Uganda -- routes, destinations, travel tips, and suggested itineraries.', to:'/#tourist-planner', color:'#d97706', label:'Plan Trip' },
  { icon:'[CHART]', title:'Operator Services', desc:'Join Raylane as a transport operator. Digitise your fleet and reach thousands of passengers.', to:'/partner', color:'#1a52b3', label:'Join Now' },
]

export default function ServicesGrid() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'#F5F7FA', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-label">Our Services</div>
          <h2 className="section-title">Everything You <span>Need to Travel</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>From a single seat to a chartered fleet -- one platform handles it all.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 }}>
          {SERVICES.map(s => (
            <div key={s.title} onClick={() => {
              if (s.to.startsWith('/#')) { document.getElementById(s.to.slice(2))?.scrollIntoView({behavior:'smooth'}) }
              else navigate(s.to)
            }}
              className="service-card"
              style={{ '--svc-color':s.color }}>
              <div style={{ width:52, height:52, borderRadius:14, background:s.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{s.icon}</div>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, color:'#0F1923' }}>{s.title}</h3>
              <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, fontFamily:"'Inter',sans-serif", flex:1 }}>{s.desc}</p>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:20, background:s.color, color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, marginTop:4 }}>
                {s.label}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.service-card{grid-template-columns:1fr 1fr 1fr!important}}`}</style>
    </section>
  )
}
