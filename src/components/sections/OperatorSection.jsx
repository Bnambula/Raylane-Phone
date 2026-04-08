import React from 'react'
import { useNavigate } from 'react-router-dom'

const PERKS = [
  { icon:'📊', title:'Manage Bookings',     desc:'Real-time seat maps, passenger lists, and boarding management from one dashboard.' },
  { icon:'💰', title:'Increase Revenue',    desc:'Reach thousands of digital-first passengers. Average operators see 40%+ growth.' },
  { icon:'📱', title:'Go Fully Digital',    desc:'Ditch paper manifests. Run your entire operation from your smartphone.' },
  { icon:'✅', title:'Trusted Platform',    desc:'Join 500+ verified operators already growing with Raylane Express.' },
]

export default function OperatorSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'linear-gradient(135deg,#0B3D91 0%,#082d6e 60%,#0f4fa8 100%)', padding:'72px 0', color:'var(--white)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,199,44,0.07)', zIndex:0 }}/>
      <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.04)', zIndex:0 }}/>
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div className='op-main-grid' style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,199,44,0.15)', padding:'5px 14px', borderRadius:20, marginBottom:14 }}>
              <span style={{ fontSize:13 }}>🚌</span>
              <span style={{ fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)' }}>For Operators</span>
            </div>
            <h2 style={{ fontFamily:''Poppins',sans-serif', fontWeight:900, fontSize:'clamp(1.6rem,3vw,2.4rem)', marginBottom:12, lineHeight:1.15 }}>
              Grow Your Transport<br/>Business with <span style={{ color:'var(--gold)' }}>Raylane</span>
            </h2>
            <p style={{ opacity:.82, fontSize:14, lineHeight:1.8, marginBottom:28, maxWidth:440 }}>
              Raylane visits your business, sets up your digital dashboard, and connects your fleet to thousands of passengers across Uganda and East Africa. You keep running your buses — we handle the bookings.
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:32 }}>
              <button onClick={() => navigate('/partner')} style={{ padding:'13px 28px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'0 4px 18px rgba(255,199,44,0.4)', transition:'all .2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                🚀 Join Raylane Express
              </button>
              <button onClick={() => navigate('/operator')} style={{ padding:'13px 22px', borderRadius:20, background:'transparent', color:'var(--white)', border:'2px solid rgba(255,255,255,0.35)', fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.35)';e.currentTarget.style.color='var(--white)'}}>
                Partner Portal →
              </button>
            </div>
            <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
              {[['Free','Onboarding & Setup'],['8%','Commission Only'],['24/7','Operator Support']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:900, fontSize:22, color:'var(--gold)' }}>{n}</div>
                  <div style={{ fontSize:12, opacity:.75 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {PERKS.map(p => (
              <div key={p.title} style={{ background:'rgba(255,255,255,0.08)', borderRadius:16, padding:20, backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', transition:'all .22s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.transform='none'}}>
                <div style={{ fontSize:26, marginBottom:10 }}>{p.icon}</div>
                <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:14, marginBottom:7 }}>{p.title}</div>
                <div style={{ fontSize:12, opacity:.75, lineHeight:1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){.op-main-grid,.operator-grid{grid-template-columns:1fr!important;}.operator-perks{grid-template-columns:1fr 1fr!important;}}`}</style>
    </section>
  )
}
