import React from 'react'
import { useNavigate } from 'react-router-dom'

const CARDS = [
  { id:'admin',    label:'Admin Portal',       desc:'Full control: approve trips, manage operators, trigger payouts, and oversee the entire ecosystem.', color:'#0B3D91', to:'/admin',   icon:'⚙️' },
  { id:'operator', label:'Operator Portal',    desc:'Manage your fleet, create trips for approval, track bookings, and access premium modules.', color:'#1a52b3',   to:'/operator',icon:'🚌' },
  { id:'partner',  label:'Apply as Operator',  desc:'Join the platform, onboard your transport business, and start receiving digital bookings.', color:'#FFC72C',   to:'/partner', icon:'📝', textColor:'#0B3D91' },
  { id:'tracker',  label:'Live Tracker',       desc:'Real-time location of buses and parcels. Passengers track their journey and deliveries live.', color:'#0f4fa8',  to:'/parcels?tab=track', icon:'📍' },
  { id:'parcel',   label:'Parcel Logistics',   desc:'Send packages nationwide. Insurance, pickup rider, GPS tracking, and same-day dispatch.', color:'#15803d',   to:'/parcels', icon:'📦' },
  { id:'finance',  label:'Financial Center',   desc:'Commission tracking, operator payouts, Sacco module, bank loan monitor, and revenue analytics.', color:'#7c3aed', to:'/admin',   icon:'💰' },
]

export default function EcosystemSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'#F5F7FA', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div className="section-label">The Ecosystem</div>
          <h2 className="section-title">One Platform. <span>Six Portals.</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>Everything connected — operators, passengers, admin, and logistics — in a single intelligent system.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {CARDS.map(c => (
            <div key={c.id} onClick={() => navigate(c.to)} className="eco-card" style={{ '--eco-color':c.color }}>
              <div style={{ width:48, height:48, borderRadius:14, background:c.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:14 }}>{c.icon}</div>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:17, marginBottom:8, color:'#0F1923' }}>{c.label}</h3>
              <p style={{ fontSize:14, color:'#64748b', lineHeight:1.65, fontFamily:"'Inter',sans-serif", marginBottom:16 }}>{c.desc}</p>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:c.color, fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13 }}>
                Open Portal
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:767px){.eco-card{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
