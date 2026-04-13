import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../hooks/useStore'
import GroupBookingModal from '../modals/GroupBookingModal'
import AdvanceBookingModal from '../modals/AdvanceBookingModal'

const IMGS = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80',
  'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1600&q=80',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1600&q=80',
]
const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const TABS = [{id:'oneway',label:'One Way'},{id:'roundtrip',label:'Round Trip'},{id:'parcel',label:'Parcel'},{id:'plan',label:'Plan Trip'}]

const S = {
  inp: {width:'100%',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'12px 14px',fontSize:15,
    fontFamily:"'Inter',sans-serif",color:'#0F1923',background:'#fff',
    WebkitAppearance:'none',appearance:'none',boxSizing:'border-box',outline:'none',transition:'border-color .2s'},
  lbl: {display:'block',fontSize:10,fontWeight:600,color:'#64748b',
    fontFamily:"'Poppins',sans-serif",textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:5},
}

export default function HeroSection() {
  const [state] = useStore()
  const [img, setImg]     = useState(0)
  const [fade, setFade]   = useState(true)
  const [tab, setTab]     = useState('oneway')
  const [from, setFrom]   = useState('Kampala')
  const [to, setTo]       = useState('Mbale')
  const [date, setDate]   = useState(() => { const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0] })
  const [vehicle, setVehicle] = useState('Any')
  const [scrollY, setScrollY] = useState(0)
  const [entered, setEntered] = useState(false)
  const [showGroup, setShowGroup] = useState(false)
  const [showAdv,   setShowAdv]   = useState(false)
  const heroRef = useRef()
  const navigate = useNavigate()

  // Background rotation
  useEffect(() => {
    const t = setInterval(() => { setFade(false); setTimeout(()=>{ setImg(i=>(i+1)%IMGS.length); setFade(true) },600) }, 7000)
    return () => clearInterval(t)
  }, [])

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Entrance animation
  useEffect(() => { setTimeout(() => setEntered(true), 100) }, [])

  const liveTrips = state.trips.filter(t => t.status==='APPROVED').slice(0,5)

  const search = e => {
    e.preventDefault()
    if (tab==='parcel') { navigate('/parcels'); return }
    navigate(`/book?from=${from}&to=${to}&date=${date}&type=${vehicle}&tripType=${tab}`)
  }

  return (
    <>
      <section ref={heroRef} style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center', overflow:'hidden', paddingTop:'var(--nav-h)' }}>

        {/* -- PARALLAX BG -- */}
        <div style={{
          position:'absolute', inset:0, zIndex:0,
          backgroundImage:`url(${IMGS[img]})`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity:fade?1:0, transition:'opacity .8s ease',
          transform:`translateY(${scrollY * 0.28}px) scale(1.15)`,
          willChange:'transform',
        }}/>

        {/* -- GRADIENT OVERLAY (Megabus-inspired deep sweep) -- */}
        <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(125deg,rgba(11,61,145,0.95) 0%,rgba(8,45,110,0.85) 45%,rgba(0,0,0,0.4) 100%)' }}/>

        {/* -- ANIMATED PARTICLE DOTS -- */}
        <div style={{ position:'absolute', inset:0, zIndex:1, overflow:'hidden', pointerEvents:'none' }}>
          {[...Array(12)].map((_,i)=>(
            <div key={i} style={{
              position:'absolute',
              width:i%3===0?6:i%3===1?4:3,
              height:i%3===0?6:i%3===1?4:3,
              borderRadius:'50%',
              background:i%4===0?'rgba(255,199,44,0.6)':'rgba(255,255,255,0.2)',
              top:`${10+i*7}%`,
              left:`${5+i*8}%`,
              animation:`float${i%3} ${3+i*0.4}s ease-in-out infinite`,
              animationDelay:`${i*0.3}s`,
            }}/>
          ))}
        </div>

        <div className="container" style={{ position:'relative', zIndex:2, width:'100%', padding:'40px 20px 60px' }}>
          <div className="hero-layout">

            {/* -- LEFT TEXT (entrance slide-in) -- */}
            <div style={{ color:'#fff', opacity:entered?1:0, transform:entered?'none':'translateY(32px)', transition:'all .8s cubic-bezier(.22,1,.36,1)' }}>

              {/* Trust badges */}
              <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
                {['No Signup Required','Mobile Money','Instant QR Ticket'].map((b,i) => (
                  <div key={b} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', backdropFilter:'blur(8px)', opacity:entered?1:0, transform:entered?'none':`translateX(-${20+i*8}px)`, transition:`all ${0.6+i*0.12}s cubic-bezier(.22,1,.36,1)`, transitionDelay:`${i*0.08}s` }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#FFC72C', flexShrink:0 }}/>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, whiteSpace:'nowrap' }}>{b}</span>
                  </div>
                ))}
              </div>

              <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:'clamp(2rem,5vw,3.6rem)', lineHeight:1.08, marginBottom:14, wordBreak:'break-word', opacity:entered?1:0, transform:entered?'none':'translateY(24px)', transition:'all .9s cubic-bezier(.22,1,.36,1)', transitionDelay:'.1s' }}>
                Smart Travel Across<br/>
                <span style={{ color:'#FFC72C' }}>Uganda &amp; East Africa</span>
              </h1>
              <p style={{ fontSize:'clamp(.9rem,1.8vw,1.1rem)', opacity:entered?.82:0, marginBottom:32, lineHeight:1.8, maxWidth:480, fontFamily:"'Inter',sans-serif", transition:'opacity 1s ease .25s' }}>
                Book buses &amp; taxis instantly. Safe, reliable, and convenient. Powered by real-time seat sync and mobile money.
              </p>

              {/* Live stats -- animate on entry */}
              <div style={{ display:'flex', gap:28, flexWrap:'wrap', marginBottom:32 }}>
                {[['500+','Operators'],['2M+','Passengers'],['1,000+','Routes'],['99.9%','Uptime']].map(([n,l],i) => (
                  <div key={l} style={{ opacity:entered?1:0, transform:entered?'none':'translateY(20px)', transition:`all .7s cubic-bezier(.22,1,.36,1)`, transitionDelay:`${0.3+i*0.07}s` }}>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:24, color:'#FFC72C', lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:12, opacity:.7, marginTop:3, fontFamily:"'Inter',sans-serif" }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Live departures ticker */}
              {liveTrips.length > 0 && (
                <div style={{ background:'rgba(255,255,255,.06)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.12)', borderRadius:14, padding:'12px 16px', marginBottom:20, maxWidth:480, opacity:entered?1:0, transition:'opacity 1s ease .5s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', animation:'blink 1.2s ease infinite' }}/>
                    <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:11, color:'#22C55E', textTransform:'uppercase', letterSpacing:1.5 }}>Live departures</span>
                  </div>
                  <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:2 }}>
                    {liveTrips.map(t => (
                      <button key={t.id} onClick={() => navigate(`/book?from=${t.from}&to=${t.to}`)}
                        style={{ flexShrink:0, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:10, padding:'7px 12px', color:'#fff', cursor:'pointer', textAlign:'left', transition:'all .2s' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,199,44,.2)';e.currentTarget.style.borderColor='rgba(255,199,44,.5)'}}
                        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.1)';e.currentTarget.style.borderColor='rgba(255,255,255,.2)'}}>
                        <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12 }}>{t.from}->{t.to}</div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', marginTop:1 }}>UGX {t.price.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick action buttons */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {[
                  { label:'Leaving Soon', fn:()=>navigate('/book?leavingSoon=true'), gold:true },
                  { label:'Group Travel (10+)', fn:()=>setShowGroup(true), gold:false },
                  { label:'Advance Booking', fn:()=>setShowAdv(true), gold:false },
                ].map(({label,fn,gold},i) => (
                  <button key={label} onClick={fn} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', borderRadius:20, background:gold?'#FFC72C':'rgba(255,255,255,.14)', border:gold?'none':'1.5px solid rgba(255,255,255,.4)', color:gold?'#0B3D91':'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:gold?700:600, fontSize:13, cursor:'pointer', transition:'all .22s', opacity:entered?1:0, transitionDelay:`${0.5+i*0.07}s`, boxShadow:gold?'0 4px 16px rgba(255,199,44,.4)':'none' }}>
                    {gold && <div style={{ width:7, height:7, borderRadius:'50%', background:'#0B3D91', animation:'blink 1.2s ease infinite' }}/>}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* -- RIGHT: SEARCH CARD -- */}
            <div style={{ background:'#fff', borderRadius:24, padding:26, boxShadow:'0 28px 72px rgba(0,0,0,.32)', width:'100%', boxSizing:'border-box', opacity:entered?1:0, transform:entered?'none':'translateY(24px) scale(.97)', transition:'all .9s cubic-bezier(.22,1,.36,1)', transitionDelay:'.15s' }}>

              {/* Tabs */}
              <div style={{ display:'flex', background:'#F5F7FA', borderRadius:12, padding:3, marginBottom:20, gap:3 }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:'9px 4px', borderRadius:10, background:tab===t.id?'#fff':'transparent', color:tab===t.id?'#0B3D91':'#64748b', boxShadow:tab===t.id?'0 1px 4px rgba(0,0,0,.08)':'none', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:11, border:'none', cursor:'pointer', transition:'all .2s' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              <form onSubmit={search}>
                {tab !== 'parcel' && (<>
                  {/* From / Swap / To */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 40px 1fr', gap:8, alignItems:'flex-end', marginBottom:12 }}>
                    <div>
                      <label style={S.lbl}>From</label>
                      <select value={from} onChange={e=>setFrom(e.target.value)} style={S.inp} onFocus={e=>e.target.style.borderColor='#0B3D91'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}>
                        {CITIES.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <button type="button" onClick={()=>{setFrom(to);setTo(from)}} style={{ width:40, height:40, borderRadius:10, background:'#0B3D91', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', flexShrink:0, transition:'transform .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.transform='rotate(180deg)'}
                      onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 3l4 4-4 4M16 21l-4-4 4-4"/><path d="M12 7H4M12 17h8"/></svg>
                    </button>
                    <div>
                      <label style={S.lbl}>To</label>
                      <select value={to} onChange={e=>setTo(e.target.value)} style={S.inp} onFocus={e=>e.target.style.borderColor='#0B3D91'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}>
                        {CITIES.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Date + Vehicle */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:tab==='plan'?10:16 }}>
                    <div>
                      <label style={S.lbl}>Date</label>
                      <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={S.inp} onFocus={e=>e.target.style.borderColor='#0B3D91'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </div>
                    <div>
                      <label style={S.lbl}>Vehicle</label>
                      <select value={vehicle} onChange={e=>setVehicle(e.target.value)} style={S.inp}>
                        <option>Any</option><option>Bus / Coach</option><option>Taxi</option><option>Special Hire</option>
                      </select>
                    </div>
                  </div>

                  {tab==='roundtrip' && <div style={{ marginBottom:16 }}><label style={S.lbl}>Return Date</label><input type="date" style={S.inp} min={date}/></div>}
                  {tab==='plan' && <div style={{ marginBottom:16, background:'#eff6ff', borderRadius:10, padding:12, fontSize:13, color:'#1d4ed8', fontFamily:"'Inter',sans-serif", lineHeight:1.6 }}>Planning mode: we suggest operators, timing, and travel tips for your route.</div>}
                </>)}

                {tab==='parcel' && (
                  <div style={{ textAlign:'center', padding:'20px 0 16px' }}>
                    <div style={{ fontSize:44, marginBottom:10 }}>[BOX]</div>
                    <p style={{ color:'#64748b', fontSize:14, marginBottom:0, fontFamily:"'Inter',sans-serif" }}>Send parcels across Uganda with real-time GPS tracking.</p>
                  </div>
                )}

                {/* Search Button -- with hover ripple effect */}
                <button type="submit" style={{ width:'100%', background:'#FFC72C', color:'#0B3D91', border:'none', padding:16, borderRadius:12, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', gap:9, boxShadow:'0 4px 18px rgba(255,199,44,.45)', cursor:'pointer', transition:'all .22s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(255,199,44,.55)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 18px rgba(255,199,44,.45)' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  {tab==='parcel'?'Send a Parcel':tab==='plan'?'Plan My Trip':'Search Trips'}
                </button>

                <p style={{ textAlign:'center', fontSize:11, color:'#94a3b8', marginTop:10, fontFamily:"'Inter',sans-serif" }}>
                  Secure . Raylane Pay . SSL Encrypted . 500+ operators
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* -- SCROLL INDICATOR -- */}
        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:4, opacity:entered?.65:0, transition:'opacity 1.2s ease .8s' }}>
          <span style={{ color:'rgba(255,255,255,.7)', fontFamily:"'Inter',sans-serif", fontSize:10, letterSpacing:2, textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:1, height:32, background:'rgba(255,255,255,.4)', animation:'scrollPulse 1.8s ease infinite' }}/>
        </div>
      </section>

      {showGroup && <GroupBookingModal onClose={() => setShowGroup(false)} />}
      {showAdv   && <AdvanceBookingModal onClose={() => setShowAdv(false)} />}

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes float0 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-18px) translateX(6px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-22px) translateX(-8px)} }
        @keyframes scrollPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }
      `}</style>
    </>
  )
}
