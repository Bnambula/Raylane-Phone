import React from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { n:1, icon:'🔍', title:'Search Route', desc:'Enter your origin, destination & travel date. Compare operators by price, rating & departure time in seconds.' },
  { n:2, icon:'🚗', title:'Choose Vehicle', desc:'Select Bus, Taxi, or Parcel. Filter by vehicle type to see the right seat layout and pricing.' },
  { n:3, icon:'💺', title:'Select Your Seat', desc:'View the live seat map. Pick your preferred seat — window, aisle, or front. Seat is held for 5 minutes.' },
  { n:4, icon:'📱', title:'Pay via Mobile Money', desc:'Instant payment via MTN MoMo or Airtel Money. Your QR digital ticket arrives immediately.' },
]

export default function HowItWorksSection() {
  const navigate = useNavigate()
  return (
    <section id="how-it-works" style={{ background:'var(--white)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div className="section-label">Simple Process</div>
          <h2 className="section-title">Book in Under <span>2 Minutes</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>No account needed. No cash. No queues.</p>
        </div>
        <div className='resp-grid' style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, position:'relative', marginBottom:44 }}>
          <div style={{ position:'absolute', top:40, left:'10%', right:'10%', height:2, background:'linear-gradient(90deg,var(--gold),var(--blue))', zIndex:0, borderRadius:2 }} className="hide-mobile"/>
          {STEPS.map(s => (
            <div key={s.n} style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ width:76, height:76, borderRadius:20, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', boxShadow:'0 8px 24px rgba(11,61,145,0.2)', position:'relative' }}>
                <span style={{ fontSize:28 }}>{s.icon}</span>
                <div style={{ position:'absolute', top:-10, right:-10, width:24, height:24, background:'var(--gold)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:''Poppins',sans-serif', fontWeight:900, fontSize:11, color:'var(--blue)' }}>{s.n}</div>
              </div>
              <h3 style={{ fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:16, marginBottom:8 }}>{s.title}</h3>
              <p style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <button onClick={() => navigate('/book')} style={{ padding:'15px 38px', borderRadius:40, background:'var(--gold)', color:'var(--blue)', fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:16, boxShadow:'0 4px 20px rgba(255,199,44,0.4)' }}>
            🚌 Book Now — It's Free
          </button>
        </div>
      </div>
      <style>{`@media(max-width:767px){#how-it-works .steps-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
    </section>
  )


/* no resp-grid */
}