import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconUser, IconParcel, IconBus, IconPin, IconChart, IconCar } from '../ui/Icons'

const SERVICES = [
  { Icon:IconUser,   title:'Passenger Booking',  desc:'Search routes, pick your seat on a live map, pay via mobile money, get a QR ticket instantly.',     to:'/book',            color:'#0B3D91', label:'Book Now' },
  { Icon:IconParcel, title:'Parcel Delivery',    desc:'Send envelopes to heavy cargo across Uganda. GPS-tracked, insured, same-day dispatch available.',   to:'/parcels',         color:'#15803d', label:'Send Parcel' },
  { Icon:IconCar,    title:'Private Hire',       desc:'Charter a full vehicle for events, school trips, corporate travel, or tourist safaris. Your schedule.',to:'/book?type=hire', color:'#7c3aed', label:'Get Quote' },
  { Icon:IconPin,    title:'Tourist Planning',   desc:'Discover Uganda - routes, destinations, park fees, hotel quotes, and suggested itineraries.',        to:'/#tourist-planner',color:'#d97706', label:'Plan Trip' },
  { Icon:IconChart,  title:'Operator Services',  desc:'Join Raylane as a transport operator. Digitise your fleet and reach thousands of passengers daily.', to:'/partner',         color:'#1a52b3', label:'Join Now' },
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
          {SERVICES.map(({ Icon, title, desc, to, color, label }) => (
            <div key={title} onClick={() => {
              if (to.startsWith('/#')) document.getElementById(to.slice(2))?.scrollIntoView({ behavior:'smooth' })
              else navigate(to)
            }} className="service-card" style={{ '--svc-color':color }}>
              <div style={{ width:52, height:52, borderRadius:14, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={24} color={color}/>
              </div>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, color:'#0F1923' }}>{title}</h3>
              <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, fontFamily:"'Inter',sans-serif", flex:1 }}>{desc}</p>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:20, background:color, color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, marginTop:4 }}>
                {label}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.service-card ~ .service-card ~ .service-card{grid-column:auto}}`}</style>
    </section>
  )
}
