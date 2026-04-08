import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GroupBookingModal from '../modals/GroupBookingModal'
import AdvanceBookingModal from '../modals/AdvanceBookingModal'

const IMAGES = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80',
  'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1600&q=80',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1600&q=80',
]
const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const TABS = [{id:'oneway',label:'One Way'},{id:'roundtrip',label:'Round Trip'},{id:'parcel',label:'Parcel'},{id:'plan',label:'Plan Trip'}]

const inp = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:15, fontFamily:"'Inter',sans-serif", fontWeight:400, color:'#0F1923', background:'#fff', WebkitAppearance:'none', appearance:'none', boxSizing:'border-box', transition:'border-color .2s', outline:'none' }
const lbl = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

export default function HeroSection() {
  const [img, setImg]   = useState(0)
  const [fade, setFade] = useState(true)
  const [tab, setTab]   = useState('oneway')
  const [from, setFrom] = useState('Kampala')
  const [to, setTo]     = useState('Mbale')
  const [vehicle, setVehicle] = useState('Any')
  const [date, setDate] = useState(() => { const d=new Date(); d.setDate(d.getDate()+2); return d.toISOString().split('T')[0] })
  const [showGroup, setShowGroup] = useState(false)
  const [showAdv,   setShowAdv]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false)
      setTimeout(() => { setImg(i => (i+1)%IMAGES.length); setFade(true) }, 500)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  const search = e => {
    e.preventDefault()
    if (tab === 'parcel') { navigate('/parcels'); return }
    navigate(`/book?from=${from}&to=${to}&date=${date}&type=${vehicle}&tripType=${tab}`)
  }

  return (
    <>
      <section style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center', overflow:'hidden', paddingTop:'var(--nav-h)' }}>
        {/* BG Image */}
        <div style={{ position:'absolute', inset:0, zIndex:0, backgroundImage:`url(${IMAGES[img]})`, backgroundSize:'cover', backgroundPosition:'center', opacity:fade?1:0, transition:'opacity .8s' }}/>
        <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(120deg,rgba(11,61,145,0.93) 0%,rgba(8,45,110,0.78) 50%,rgba(0,0,0,0.35) 100%)' }}/>

        <div className="container" style={{ position:'relative', zIndex:2, width:'100%', padding:'40px 20px 60px' }}>
          <div className="hero-layout">

            {/* ── LEFT ── */}
            <div style={{ color:'#fff' }}>
              {/* Trust badges */}
              <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
                {['No Signup Required','Mobile Money','Instant QR Ticket'].map(b => (
                  <div key={b} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', backdropFilter:'blur(8px)' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#FFC72C', flexShrink:0 }}/>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, whiteSpace:'nowrap' }}>{b}</span>
                  </div>
                ))}
              </div>

              <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:'clamp(2rem,5vw,3.4rem)', lineHeight:1.1, marginBottom:14, wordBreak:'break-word' }}>
                Smart Travel Across<br/>
                <span style={{ color:'#FFC72C' }}>Uganda &amp; East Africa</span>
              </h1>
              <p style={{ fontSize:'clamp(.9rem,1.8vw,1.1rem)', opacity:.88, marginBottom:32, lineHeight:1.8, maxWidth:480, fontFamily:"'Inter',sans-serif" }}>
                Book buses &amp; taxis instantly. Safe, reliable, and convenient. Powered by real-time seat sync and mobile money.
              </p>

              {/* Stats */}
              <div style={{ display:'flex', gap:28, flexWrap:'wrap', marginBottom:32 }}>
                {[['500+','Operators'],['2M+','Passengers'],['1,000+','Routes']].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:26, color:'#FFC72C', lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:12, opacity:.75, marginTop:3, fontFamily:"'Inter',sans-serif" }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Quick action buttons */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button onClick={() => navigate('/book?leavingSoon=true')} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', borderRadius:20, background:'#FFC72C', color:'#0B3D91', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, border:'none', cursor:'pointer', boxShadow:'0 4px 16px rgba(255,199,44,.4)', transition:'all .2s' }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:'#0B3D91', animation:'blink 1.2s ease infinite' }}/>
                  Leaving Soon
                </button>
                <button onClick={() => setShowGroup(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', borderRadius:20, background:'rgba(255,255,255,.14)', border:'1.5px solid rgba(255,255,255,.4)', color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, cursor:'pointer', transition:'all .2s' }}>
                  Group Travel (10+)
                </button>
                <button onClick={() => setShowAdv(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', borderRadius:20, background:'rgba(255,255,255,.14)', border:'1.5px solid rgba(255,255,255,.4)', color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, cursor:'pointer', transition:'all .2s' }}>
                  Advance Booking
                </button>
              </div>
            </div>

            {/* ── RIGHT: Search Card ── */}
            <div style={{ background:'#fff', borderRadius:24, padding:24, boxShadow:'0 24px 64px rgba(0,0,0,.3)', width:'100%', boxSizing:'border-box' }}>
              {/* Trip Type Tabs */}
              <div style={{ display:'flex', background:'#F5F7FA', borderRadius:12, padding:3, marginBottom:20, gap:3 }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:'9px 4px', borderRadius:10, background:tab===t.id?'#fff':'transparent', color:tab===t.id?'#0B3D91':'#64748b', boxShadow:tab===t.id?'0 1px 4px rgba(0,0,0,.08)':'none', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:11, border:'none', cursor:'pointer', transition:'all .2s' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              <form onSubmit={search}>
                {tab !== 'parcel' && (
                  <>
                    {/* From / To */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 40px 1fr', gap:8, alignItems:'flex-end', marginBottom:12 }}>
                      <div>
                        <label style={lbl}>From</label>
                        <select value={from} onChange={e=>setFrom(e.target.value)} style={inp}>{CITIES.map(c=><option key={c}>{c}</option>)}</select>
                      </div>
                      <button type="button" onClick={() => { setFrom(to); setTo(from) }} style={{ width:40, height:40, borderRadius:10, background:'#0B3D91', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', flexShrink:0 }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 3l4 4-4 4M16 21l-4-4 4-4"/><path d="M12 7H4M12 17h8"/></svg>
                      </button>
                      <div>
                        <label style={lbl}>To</label>
                        <select value={to} onChange={e=>setTo(e.target.value)} style={inp}>{CITIES.map(c=><option key={c}>{c}</option>)}</select>
                      </div>
                    </div>

                    {/* Date + Vehicle */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:tab==='plan'?10:14 }}>
                      <div>
                        <label style={lbl}>Date</label>
                        <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={inp}/>
                      </div>
                      <div>
                        <label style={lbl}>Vehicle</label>
                        <select value={vehicle} onChange={e=>setVehicle(e.target.value)} style={inp}>
                          <option>Any</option><option>Bus / Coach</option><option>Taxi</option><option>Special Hire</option>
                        </select>
                      </div>
                    </div>

                    {tab === 'roundtrip' && (
                      <div style={{ marginBottom:14 }}>
                        <label style={lbl}>Return Date</label>
                        <input type="date" style={inp} min={date}/>
                      </div>
                    )}

                    {tab === 'plan' && (
                      <div style={{ marginBottom:14, background:'#eff6ff', borderRadius:10, padding:12, fontSize:13, color:'#1d4ed8', fontFamily:"'Inter',sans-serif", lineHeight:1.6 }}>
                        Planning mode: we suggest operators, timing, hotels (coming soon), and travel tips for your route.
                      </div>
                    )}
                  </>
                )}

                {tab === 'parcel' && (
                  <div style={{ textAlign:'center', padding:'20px 0' }}>
                    <div style={{ fontSize:44, marginBottom:10 }}>📦</div>
                    <p style={{ color:'#64748b', fontSize:14, marginBottom:16, fontFamily:"'Inter',sans-serif" }}>Send parcels across Uganda with real-time GPS tracking.</p>
                  </div>
                )}

                <button type="submit" style={{ width:'100%', background:'#FFC72C', color:'#0B3D91', border:'none', padding:15, borderRadius:12, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', gap:9, boxShadow:'0 4px 18px rgba(255,199,44,.45)', cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(255,199,44,.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 18px rgba(255,199,44,.45)' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  {tab==='parcel' ? 'Send a Parcel' : tab==='plan' ? 'Plan My Trip' : 'Search Trips'}
                </button>
                <p style={{ textAlign:'center', fontSize:11, color:'#94a3b8', marginTop:10, fontFamily:"'Inter',sans-serif" }}>Secure booking · Raylane Pay · SSL Encrypted</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {showGroup && <GroupBookingModal onClose={() => setShowGroup(false)} />}
      {showAdv   && <AdvanceBookingModal onClose={() => setShowAdv(false)} />}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
    </>
  )
}
