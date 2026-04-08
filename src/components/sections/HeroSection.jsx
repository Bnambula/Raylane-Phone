import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const IMAGES = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=80',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1400&q=80',
  'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1400&q=80',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1400&q=80',
]
const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']

export default function HeroSection() {
  const [img,  setImg]  = useState(0)
  const [fade, setFade] = useState(true)
  const [type, setType] = useState('oneway')
  const [from, setFrom] = useState('Kampala')
  const [to,   setTo]   = useState('Mbale')
  const [date, setDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0]
  })
  const [vehicle, setVehicle] = useState('Any')
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false)
      setTimeout(() => { setImg(i => (i + 1) % IMAGES.length); setFade(true) }, 500)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  const swap   = () => { setFrom(to); setTo(from) }
  const search = (e) => { e.preventDefault(); navigate(`/book?from=${from}&to=${to}&date=${date}&type=${vehicle}`) }

  /* shared input style — 16px prevents iOS zoom */
  const inp = {
    width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10,
    padding: '11px 12px', fontSize: 16, fontFamily: ''Poppins',sans-serif',
    fontWeight: 600, color: 'var(--dark)', background: 'var(--white)',
    WebkitAppearance: 'none', appearance: 'none', boxSizing: 'border-box',
    maxWidth: '100%',
  }
  const lbl = {
    display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b',
    fontFamily: ''Poppins',sans-serif', textTransform: 'uppercase',
    letterSpacing: 1.5, marginBottom: 5,
  }

  return (
    <section style={{
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      paddingTop: 'var(--nav-h)',
    }}>
      {/* BG */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage: `url(${IMAGES[img]})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: fade ? 1 : 0, transition: 'opacity .7s',
      }}/>
      <div style={{
        position:'absolute', inset:0, zIndex:1,
        background:'linear-gradient(135deg,rgba(11,61,145,0.92) 0%,rgba(11,61,145,0.65) 55%,rgba(0,0,0,0.3) 100%)',
      }}/>

      <div className="container" style={{ position:'relative', zIndex:2, width:'100%', padding:'32px 16px 48px' }}>
        {/* ── STACKED MOBILE LAYOUT ── */}
        <div className="hero-layout">

          {/* Text */}
          <div style={{ color:'var(--white)', marginBottom: 28 }}>
            <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
              {['✅ No Signup', '📱 Mobile Money', '🎫 Instant Ticket'].map(b => (
                <span key={b} style={{
                  background:'rgba(255,255,255,0.13)', backdropFilter:'blur(8px)',
                  padding:'5px 12px', borderRadius:20, fontSize:11,
                  fontFamily:''Poppins',sans-serif', fontWeight:700,
                  border:'1px solid rgba(255,255,255,0.2)', whiteSpace:'nowrap',
                }}>{b}</span>
              ))}
            </div>

            <h1 style={{
              fontFamily:''Poppins',sans-serif', fontWeight:900,
              fontSize:'clamp(1.8rem,5vw,3.2rem)', lineHeight:1.1, marginBottom:12,
              wordBreak:'break-word',
            }}>
              Smart Travel Across<br/>
              <span style={{ color:'var(--gold)' }}>Uganda &amp; East Africa</span>
            </h1>
            <p style={{
              fontSize:'clamp(.9rem,2vw,1.1rem)', opacity:.9,
              marginBottom:24, lineHeight:1.75, maxWidth:480,
            }}>
              Book buses &amp; taxis instantly. Safe, reliable, and convenient.
            </p>

            <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
              {[['🚌','500+','Operators'],['👥','2M+','Passengers'],['🗺️','1,000+','Routes']].map(([ic,n,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:32,height:32,background:'rgba(255,199,44,0.2)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0 }}>{ic}</div>
                  <div>
                    <div style={{ fontFamily:''Poppins',sans-serif',fontWeight:900,fontSize:17,lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:10,opacity:.72 }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search card */}
          <div style={{ background:'var(--white)', borderRadius:20, padding:20, boxShadow:'0 20px 60px rgba(0,0,0,0.28)', width:'100%', boxSizing:'border-box' }}>
            {/* Trip type */}
            <div style={{ display:'flex', background:'var(--gray-light)', borderRadius:12, padding:3, marginBottom:16, gap:3 }}>
              {[['oneway','One Way'],['roundtrip','Round Trip'],['parcel','Parcel']].map(([v,l]) => (
                <button key={v} onClick={() => setType(v)} style={{
                  flex:1, padding:'9px 4px', borderRadius:10,
                  background:type===v?'var(--white)':'transparent',
                  color:type===v?'var(--blue)':'var(--gray-text)',
                  boxShadow:type===v?'var(--shadow-sm)':'none',
                  fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:12, transition:'all .2s',
                  border:'none', cursor:'pointer',
                }}>{l}</button>
              ))}
            </div>

            <form onSubmit={search}>
              {/* From / swap / To */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 40px 1fr', gap:8, alignItems:'flex-end', marginBottom:12 }}>
                <div>
                  <label style={lbl}>From</label>
                  <select value={from} onChange={e=>setFrom(e.target.value)} style={inp}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <button type="button" onClick={swap} style={{ width:40, height:40, borderRadius:10, background:'var(--blue)', color:'var(--white)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:0, flexShrink:0, border:'none', cursor:'pointer' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M8 3l4 4-4 4M16 21l-4-4 4-4"/><path d="M12 7H4M12 17h8"/>
                  </svg>
                </button>
                <div>
                  <label style={lbl}>To</label>
                  <select value={to} onChange={e=>setTo(e.target.value)} style={inp}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Date + Vehicle */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                <div>
                  <label style={lbl}>Date</label>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} style={inp}/>
                </div>
                <div>
                  <label style={lbl}>Vehicle</label>
                  <select value={vehicle} onChange={e=>setVehicle(e.target.value)} style={inp}>
                    <option>Any</option>
                    <option>Bus/Coach</option>
                    <option>Taxi/Minivan</option>
                    <option>Special Hire</option>
                  </select>
                </div>
              </div>

              <button type="submit" style={{
                width:'100%', background:'var(--gold)', color:'var(--blue)', border:'none',
                padding:15, borderRadius:12, fontFamily:''Poppins',sans-serif', fontWeight:800,
                fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', gap:9,
                boxShadow:'0 4px 18px rgba(255,199,44,0.45)', cursor:'pointer',
              }}>
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Search Trips
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        /* Mobile: single column stacked */
        .hero-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }
        /* Desktop: side by side */
        @media (min-width: 768px) {
          .hero-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: center;
          }
        }
      `}</style>
    </section>
  )
}
