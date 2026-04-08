import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const TIPS = [
  { tip:'Carry your national ID or passport for all intercity travel.', category:'Safety' },
  { tip:'Book early-morning buses for smoother roads and less traffic out of Kampala.', category:'Travel Hack' },
  { tip:'Kampala to Bwindi Impenetrable Forest: budget full day (8–9 hrs via Mbarara).', category:'Route' },
  { tip:'MTN MoMo and Airtel Money are accepted everywhere — no need for cash at Raylane parks.', category:'Payment' },
  { tip:'The scenic Kampala–Kabale road is breathtaking. Request a window seat in advance.', category:'Experience' },
]

const DESTS = [
  { name:'Bwindi Impenetrable Forest', region:'South West', hours:8, from:'Kampala', img:'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80' },
  { name:'Lake Bunyonyi', region:'South West', hours:8.5, from:'Kampala', img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80' },
  { name:'Murchison Falls', region:'North West', hours:5, from:'Kampala', img:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80' },
  { name:'Sipi Falls', region:'East', hours:4, from:'Kampala', img:'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80' },
]

export default function TouristPlanner() {
  const [dest, setDest] = useState('')
  const [budget, setBudget] = useState('')
  const [tipIdx, setTipIdx] = useState(0)
  const [results, setResults] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()

  const plan = () => {
    if (!dest) { toast('Select a destination','warning'); return }
    const d = DESTS.find(x => x.name === dest)
    setResults(d)
  }

  const tip = TIPS[tipIdx]

  return (
    <section id="tourist-planner" style={{ background:'#fff', padding:'72px 0' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:48, alignItems:'start' }}>

          {/* Left */}
          <div>
            <div className="section-label">Tourist Planner</div>
            <h2 className="section-title">Discover <span>Beautiful Uganda</span></h2>
            <p className="section-sub" style={{ marginBottom:28 }}>Tell us where you want to go and your budget. We'll suggest the best routes, operators, and travel tips.</p>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:6 }}>Destination</label>
              <select value={dest} onChange={e=>setDest(e.target.value)} style={{ width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:15, fontFamily:"'Inter',sans-serif", WebkitAppearance:'none', background:'#fff', boxSizing:'border-box', outline:'none' }}>
                <option value="">Choose a destination…</option>
                {DESTS.map(d => <option key={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:6 }}>Budget (UGX) — optional</label>
              <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. 150,000" style={{ width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:15, fontFamily:"'Inter',sans-serif", boxSizing:'border-box', outline:'none' }}/>
            </div>

            <button onClick={plan} style={{ padding:'14px 32px', borderRadius:20, background:'#0B3D91', color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, border:'none', cursor:'pointer', boxShadow:'0 4px 16px rgba(11,61,145,.3)', marginBottom:20 }}>
              Plan My Trip
            </button>

            {/* Results */}
            {results && (
              <div style={{ background:'#eff6ff', borderRadius:16, padding:20, border:'1.5px solid #bfdbfe', animation:'fadeIn .4s ease' }}>
                <h4 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, marginBottom:12, color:'#0B3D91' }}>Suggested Trip</h4>
                <div style={{ height:120, borderRadius:10, backgroundImage:`url(${results.img})`, backgroundSize:'cover', backgroundPosition:'center', marginBottom:14 }}/>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, marginBottom:4 }}>{results.name}</div>
                <div style={{ fontSize:13, color:'#64748b', marginBottom:10, fontFamily:"'Inter',sans-serif" }}>From {results.from} · {results.hours} hrs · {results.region}</div>
                <button onClick={() => navigate(`/book?from=${results.from}&to=${results.name}`)} style={{ padding:'11px 22px', borderRadius:20, background:'#FFC72C', color:'#0B3D91', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>
                  Book This Route →
                </button>
              </div>
            )}
          </div>

          {/* Right: Tip of the Day + Destination cards */}
          <div>
            {/* Tip of the day */}
            <div style={{ background:'linear-gradient(135deg,#0B3D91,#1a52b3)', borderRadius:18, padding:24, marginBottom:20, color:'#fff' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, opacity:.8 }}>Travel Tip of the Day</span>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => setTipIdx(i => (i-1+TIPS.length)%TIPS.length)} style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.15)', border:'none', color:'#fff', cursor:'pointer', fontSize:14 }}>‹</button>
                  <button onClick={() => setTipIdx(i => (i+1)%TIPS.length)} style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.15)', border:'none', color:'#fff', cursor:'pointer', fontSize:14 }}>›</button>
                </div>
              </div>
              <div style={{ background:'rgba(255,199,44,.2)', borderRadius:8, padding:'2px 10px', display:'inline-block', marginBottom:10 }}>
                <span style={{ fontSize:11, fontFamily:"'Poppins',sans-serif", fontWeight:600, color:'#FFC72C' }}>{tip.category}</span>
              </div>
              <p style={{ fontSize:15, lineHeight:1.7, fontFamily:"'Inter',sans-serif", opacity:.95 }}>{tip.tip}</p>
            </div>

            {/* Destination cards */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {DESTS.map(d => (
                <div key={d.name} onClick={() => navigate(`/book?from=${d.from}&to=${d.name}`)}
                  style={{ borderRadius:14, overflow:'hidden', cursor:'pointer', transition:'all .22s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
                  <div style={{ height:80, backgroundImage:`url(${d.img})`, backgroundSize:'cover', backgroundPosition:'center' }}/>
                  <div style={{ padding:'10px 12px', background:'#fff', border:'1px solid #E2E8F0', borderTop:'none', borderRadius:'0 0 14px 14px' }}>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, marginBottom:2, color:'#0F1923' }}>{d.name}</div>
                    <div style={{ fontSize:11, color:'#64748b', fontFamily:"'Inter',sans-serif" }}>{d.hours} hrs from {d.from}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){#tourist-planner>div>div>div:first-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
