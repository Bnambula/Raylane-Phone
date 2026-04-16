import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconSearch, IconTicket, IconPhone, IconBus } from '../ui/Icons'

const STEPS = [
  { Icon:IconSearch, n:1, title:'Search a Route',   desc:'Enter where you are going and your travel date. See all available buses and taxis with live seat counts.' },
  { Icon:IconBus,    n:2, title:'Choose Your Seat', desc:'Pick your exact seat on a live map. See which seats are booked, available, or held. Your seat is locked for 5 minutes.' },
  { Icon:IconPhone,  n:3, title:'Pay via MoMo',     desc:'Pay instantly with MTN MoMo or Airtel Money. No cash, no queue, no risk. Confirmation arrives in seconds.' },
  { Icon:IconTicket, n:4, title:'Board with QR',    desc:'Show your QR ticket at the gate. The loader scans it, marks you boarded, and you take your reserved seat.' },
]

export default function HowItWorksSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'#F5F7FA', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Book in <span>4 Simple Steps</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>From search to boarding in under 2 minutes. No app download needed.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:36 }}>
          {STEPS.map(({ Icon, n, title, desc }, i) => (
            <div key={n} style={{ textAlign:'center', position:'relative' }}>
              {i < STEPS.length - 1 && (
                <div style={{ position:'absolute', top:28, left:'60%', width:'80%', height:2, background:'#E2E8F0', zIndex:0 }}/>
              )}
              <div style={{ width:56, height:56, borderRadius:16, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', position:'relative', zIndex:1, boxShadow:'0 4px 14px rgba(11,61,145,.3)' }}>
                <Icon size={24} color="#FFC72C"/>
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:12, color:'#0B3D91', textTransform:'uppercase', letterSpacing:1.5, marginBottom:6 }}>Step {n}</div>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, marginBottom:8 }}>{title}</h3>
              <p style={{ color:'#64748b', fontSize:13, lineHeight:1.7, fontFamily:"'Inter',sans-serif" }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <button onClick={() => navigate('/book')} style={{ padding:'14px 36px', borderRadius:20, background:'#FFC72C', color:'#0B3D91', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, border:'none', cursor:'pointer', boxShadow:'0 4px 18px rgba(255,199,44,.4)' }}>
            Book Your Seat Now
          </button>
        </div>
      </div>
    </section>
  )
}
