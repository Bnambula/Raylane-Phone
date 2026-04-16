import React from 'react'
import { IconFlash, IconLock, IconPhone, IconGlobe, IconStar, IconTicket } from '../ui/Icons'

const FEATURES = [
  { Icon:IconFlash,  title:'Real-Time Booking',    desc:'Seat availability updates live. No lag, no overbooking. Your seat is locked the moment you select it.',     bg:'#dbeafe', ic:'#1d4ed8' },
  { Icon:IconLock,   title:'No Double Booking',    desc:'Our Seat Sync Engine holds your seat for 5 minutes during payment. No one else can take it.',               bg:'#dcfce7', ic:'#15803d' },
  { Icon:IconPhone,  title:'Mobile Money Pay',     desc:'MTN MoMo and Airtel Money. No bank card needed. Book and pay in under 60 seconds from any phone.',          bg:'#fef9c3', ic:'#92400e' },
  { Icon:IconGlobe,  title:'East Africa Coverage', desc:'Kampala to Nairobi, Gulu to Kigali. Over 1,000 routes covered across Uganda, Kenya, Rwanda, and South Sudan.',bg:'#fce7f3', ic:'#be185d' },
  { Icon:IconStar,   title:'Vetted Operators',     desc:'Every operator on Raylane is verified and approved by our admin team. Unrated operators cannot go live.',     bg:'#ede9fe', ic:'#7c3aed' },
  { Icon:IconTicket, title:'Instant QR Ticket',   desc:'Your boarding pass arrives via SMS within seconds. No printing. Show your phone at the gate and board.',      bg:'#ffedd5', ic:'#c2410c' },
]

export default function WhyChooseSection() {
  return (
    <section style={{ background:'#fff', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-label">Why Raylane</div>
          <h2 className="section-title">Travel Smarter with <span>Raylane Express</span></h2>
        </div>
        <div className="resp-grid">
          {FEATURES.map(({ Icon, title, desc, bg, ic }) => (
            <div key={title} style={{ background:'#fff', borderRadius:18, padding:24, boxShadow:'0 2px 16px rgba(0,0,0,.07)', transition:'all .25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,.12)' }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 16px rgba(0,0,0,.07)' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={24} color={ic}/>
              </div>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, marginBottom:8 }}>{title}</h3>
              <p style={{ color:'#64748b', fontSize:14, lineHeight:1.7, fontFamily:"'Inter',sans-serif" }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:48, background:'#0B3D91', borderRadius:20, padding:'28px 32px', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:20 }}>
          {[['500+','Verified Operators'],['2M+','Happy Passengers'],['1,000+','Routes Covered'],['99.9%','Uptime']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center', color:'#fff' }}>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:28, color:'#FFC72C' }}>{n}</div>
              <div style={{ fontSize:13, opacity:.8, fontFamily:"'Inter',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
