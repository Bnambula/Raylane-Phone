import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const DESTS = [
  { name:'Bwindi Impenetrable Forest', region:'South West Uganda', from:'Kampala', hrs:8, busUGX:35000, parkUSD:700, parkUGX:2590000, hotels:[{name:'Basic Guest House',ugx:80000},{name:'Mid-Range Lodge',ugx:250000},{name:'Luxury Eco Lodge',ugx:900000}], desc:'UNESCO World Heritage. Home of mountain gorillas. Gorilla trekking permit: $700 USD. Book 6 months ahead.', tips:['Book gorilla permit via UWA months in advance','Wear long sleeves and waterproof boots','Carry rain gear — forest weather changes quickly'], img:'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&q=80' },
  { name:'Murchison Falls National Park', region:'North West Uganda', from:'Kampala', hrs:5, busUGX:38000, parkUGX:40000, parkNote:'$40 USD/day', hotels:[{name:'Campsite',ugx:50000},{name:'Red Chilli Rest Camp',ugx:180000},{name:'Paraa Safari Lodge',ugx:850000}], desc:'Uganda largest national park. Famous waterfall and game drives. Big 5 wildlife. Boat trips to the falls base.', tips:['Game drives best 6-9 AM and 4-7 PM','Book boat trip at park gate on arrival','Budget UGX 200,000+ for game drive vehicle hire'], img:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80' },
  { name:'Lake Bunyonyi', region:'South West Uganda', from:'Kampala', hrs:8.5, busUGX:42000, parkUGX:0, parkNote:'No park fee', hotels:[{name:'Campsite on island',ugx:45000},{name:'Guest House',ugx:120000},{name:'Arcadia Cottages',ugx:380000}], desc:'One of Africa most beautiful lakes. 29 islands. Canoeing, swimming, bird watching. Ideal family destination.', tips:['Canoe hire costs UGX 30,000/hr','Visit Bwama Island leper colony museum','Best visited April-June or Sept-Dec for dry weather'], img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
  { name:'Sipi Falls', region:'Eastern Uganda (Mt Elgon)', from:'Kampala', hrs:4.5, busUGX:28000, parkUGX:10000, parkNote:'$10 entry', hotels:[{name:'Campsite',ugx:40000},{name:'Sipi River Lodge',ugx:200000},{name:'Lacam Lodge',ugx:420000}], desc:'Three-tier waterfall system on the slopes of Mt Elgon. Coffee farm tours, abseiling, hiking trails.', tips:['Guided hike to all three falls: 4-5 hours','Coffee tour costs UGX 20,000 and includes tasting','Take the 7AM bus from Mbale stage for best access'], img:'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80' },
  { name:'Queen Elizabeth National Park', region:'South West Uganda', from:'Kampala', hrs:6, busUGX:38000, parkUGX:162000, parkNote:'$40 USD/day', hotels:[{name:'Budget Camp',ugx:80000},{name:'Mweya Safari Lodge',ugx:750000},{name:'Ishasha Wilderness',ugx:1200000}], desc:'Famous for tree-climbing lions in Ishasha sector. Kazinga Channel boat safari. Chimp tracking in Kyambura Gorge.', tips:['Kazinga Channel cruise: $25 USD per person','Chimp trekking permit: $50 USD book in advance','Combine with Bwindi for a full western circuit'], img:'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80' },
]

const P  = { fontFamily:"'Poppins',sans-serif" }
const I  = { fontFamily:"'Inter',sans-serif" }
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, ...I, background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', ...P, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

export default function TouristPlanner() {
  const [dest,       setDest]       = useState('')
  const [mode,       setMode]       = useState('public')     // public | private | hotel
  const [nights,     setNights]     = useState('2')
  const [people,     setPeople]     = useState('2')
  const [hotelTier,  setHotelTier]  = useState('mid')
  const [result,     setResult]     = useState(null)
  const [hotelForm,  setHotelForm]  = useState({ name:'', email:'', phone:'', dates:'', people:'2', notes:'' })
  const [hotelSent,  setHotelSent]  = useState(false)
  const [tipIdx,     setTipIdx]     = useState(0)
  const navigate = useNavigate()
  const toast    = useToast()

  const d = DESTS.find(x => x.name === dest)

  const plan = () => {
    if (!dest) { toast('Please select a destination first','warning'); return }
    setResult(d)
  }

  const hotelIdx = hotelTier === 'budget' ? 0 : hotelTier === 'mid' ? 1 : 2
  const hotelCost = () => d ? d.hotels[Math.min(hotelIdx, d.hotels.length-1)].ugx * parseInt(nights||1) : 0
  const busCost   = () => d ? d.busUGX * parseInt(people||1) * (mode==='private'?1:1) : 0
  const hireCost  = () => d ? Math.round(d.busUGX * parseInt(people||1) * 2.8) : 0
  const parkCost  = () => d ? d.parkUGX * parseInt(people||1) : 0
  const mealCost  = () => parseInt(nights||1) * parseInt(people||1) * 45000
  const total     = () => (mode==='private' ? hireCost() : busCost()) + hotelCost() + parkCost() + mealCost()

  const sendHotelRequest = e => {
    e.preventDefault()
    if (!hotelForm.phone || !hotelForm.dates) { toast('Please fill phone and dates','warning'); return }
    setHotelSent(true)
    toast('Hotel request sent to Raylane team. We will respond within 4 hours.','success')
  }

  return (
    <section id="tourist-planner" style={{ background:'linear-gradient(180deg,#fff 0%,#F5F7FA 100%)', padding:'72px 0' }}>
      <div className="container">

        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-label">Trip Planner</div>
          <h2 className="section-title">Discover <span>Beautiful Uganda</span></h2>
          <p className="section-sub" style={{ maxWidth:520, margin:'0 auto' }}>Plan your entire trip in minutes. Real costs, local tips, transport options, and hotel quotes from our team.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.05fr', gap:36, alignItems:'start' }}>

          {/* ── LEFT: Planner form ── */}
          <div>
            {/* Destination */}
            <div style={{ marginBottom:14 }}>
              <label style={lS}>Where do you want to go?</label>
              <select value={dest} onChange={e=>{setDest(e.target.value);setResult(null)}} style={{ ...iS, fontSize:15 }}>
                <option value="">Choose a destination…</option>
                {DESTS.map(d=><option key={d.name}>{d.name}</option>)}
              </select>
            </div>

            {/* Travel mode */}
            <div style={{ marginBottom:14 }}>
              <label style={lS}>How would you like to travel?</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {[['public','Public Bus'],['private','Private Hire'],['hotel','Request Hotel Only']].map(([id,label])=>(
                  <button key={id} onClick={()=>setMode(id)} style={{ padding:'10px 6px', borderRadius:12, border:`2px solid ${mode===id?'#0B3D91':'#E2E8F0'}`, background:mode===id?'#eff6ff':'#fff', ...P, fontWeight:700, fontSize:11, color:mode===id?'#0B3D91':'#64748b', cursor:'pointer', transition:'all .2s' }}>{label}</button>
                ))}
              </div>
            </div>

            {mode !== 'hotel' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div><label style={lS}>Number of Nights</label>
                  <select value={nights} onChange={e=>setNights(e.target.value)} style={iS}>
                    {['1','2','3','4','5','7','10','14'].map(n=><option key={n}>{n}</option>)}
                  </select></div>
                <div><label style={lS}>Number of People</label>
                  <select value={people} onChange={e=>setPeople(e.target.value)} style={iS}>
                    {['1','2','3','4','5','6','8','10','15','20'].map(n=><option key={n}>{n}</option>)}
                  </select></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lS}>Accommodation Preference</label>
                  <div style={{ display:'flex', gap:8 }}>
                    {[['budget','Budget'],['mid','Mid-Range'],['luxury','Luxury']].map(([id,l])=>(
                      <button key={id} onClick={()=>setHotelTier(id)} style={{ flex:1, padding:'10px', borderRadius:10, border:`2px solid ${hotelTier===id?'#0B3D91':'#E2E8F0'}`, background:hotelTier===id?'#eff6ff':'#fff', ...P, fontWeight:700, fontSize:12, color:hotelTier===id?'#0B3D91':'#64748b', cursor:'pointer' }}>{l}</button>
                    ))}
                  </div></div>
              </div>
            )}

            {mode === 'hotel' ? (
              /* Hotel-only request form */
              !hotelSent ? (
                <form onSubmit={sendHotelRequest} style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0' }}>
                  <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:14 }}>Request Hotel Quote from Raylane</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                    <div><label style={lS}>Your Name</label><input value={hotelForm.name} onChange={e=>setHotelForm(f=>({...f,name:e.target.value}))} placeholder="Full name" style={iS}/></div>
                    <div><label style={lS}>Phone *</label><input value={hotelForm.phone} onChange={e=>setHotelForm(f=>({...f,phone:e.target.value}))} placeholder="0771 xxx xxx" style={iS}/></div>
                    <div><label style={lS}>Dates * (e.g. 20-23 May)</label><input value={hotelForm.dates} onChange={e=>setHotelForm(f=>({...f,dates:e.target.value}))} placeholder="Arrival – Departure" style={iS}/></div>
                    <div><label style={lS}>People</label><select value={hotelForm.people} onChange={e=>setHotelForm(f=>({...f,people:e.target.value}))} style={iS}>{['1','2','3','4','5','6','8','10'].map(n=><option key={n}>{n}</option>)}</select></div>
                    <div style={{ gridColumn:'1/-1' }}><label style={lS}>Notes (budget, preferences)</label><textarea value={hotelForm.notes} onChange={e=>setHotelForm(f=>({...f,notes:e.target.value}))} rows={2} style={{ ...iS, resize:'none', lineHeight:1.6 }} placeholder="e.g. near the falls, budget under UGX 300,000/night..."/></div>
                  </div>
                  <button type="submit" style={{ width:'100%', padding:13, borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                    Send Hotel Request
                  </button>
                </form>
              ) : (
                <div style={{ background:'#dcfce7', borderRadius:18, padding:24, textAlign:'center' }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>✓</div>
                  <div style={{ ...P, fontWeight:700, fontSize:16, color:'#15803d', marginBottom:6 }}>Request Sent!</div>
                  <p style={{ fontSize:13, ...I, color:'#166534' }}>Our team will contact you within 4 hours with accommodation options, pricing, and travel advice for {dest||'your destination'}.</p>
                </div>
              )
            ) : (
              <button onClick={plan} style={{ width:'100%', padding:'15px 0', borderRadius:14, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:16, border:'none', cursor:'pointer', boxShadow:'0 4px 18px rgba(11,61,145,.28)' }}>
                Plan My Trip
              </button>
            )}
          </div>

          {/* ── RIGHT: Destination card / Budget breakdown ── */}
          {!result ? (
            <div>
              <div style={{ borderRadius:20, overflow:'hidden', position:'relative', marginBottom:16 }}>
                <img src={DESTS[tipIdx % DESTS.length].img} alt="" style={{ width:'100%', height:220, objectFit:'cover', display:'block' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(11,61,145,.8) 0%,transparent 55%)' }}/>
                <div style={{ position:'absolute', bottom:16, left:20 }}>
                  <div style={{ ...P, fontWeight:800, fontSize:18, color:'#fff', marginBottom:2 }}>{DESTS[tipIdx % DESTS.length].name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', ...I }}>{DESTS[tipIdx % DESTS.length].region} · {DESTS[tipIdx % DESTS.length].hrs}h from Kampala</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
                {DESTS.map((_,i)=><button key={i} onClick={()=>setTipIdx(i)} style={{ width:i===tipIdx%DESTS.length?24:8, height:8, borderRadius:4, background:i===tipIdx%DESTS.length?'#0B3D91':'#E2E8F0', border:'none', cursor:'pointer', transition:'all .3s' }}/>)}
              </div>
              <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0' }}>
                <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:12 }}>Uganda Travel Tips</div>
                {['Carry National ID or passport for all intercity travel.',
                  'Book morning buses (6-8 AM) — less traffic out of Kampala.',
                  'MTN MoMo and Airtel Money accepted everywhere on Raylane.',
                  'For gorilla trekking, book the UWA permit months ahead.',
                  'The Kabale-Kisoro road to Bwindi takes 1.5hrs from Kabale.'
                ].map((t,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<4?'1px solid #F1F5F9':'' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#FFC72C', marginTop:6, flexShrink:0 }}/>
                    <p style={{ fontSize:13, ...I, color:'#475569', margin:0, lineHeight:1.65 }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Destination hero */}
              <div style={{ borderRadius:20, overflow:'hidden', position:'relative', marginBottom:16 }}>
                <img src={result.img} alt={result.name} style={{ width:'100%', height:200, objectFit:'cover', display:'block' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(11,61,145,.85) 0%,transparent 50%)' }}/>
                <div style={{ position:'absolute', bottom:16, left:20 }}>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#fff', marginBottom:2 }}>{result.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', ...I }}>{result.region} · {result.hrs}h from Kampala by bus</div>
                </div>
              </div>

              <p style={{ fontSize:13, ...I, color:'#475569', marginBottom:16, lineHeight:1.7 }}>{result.desc}</p>

              {/* Budget breakdown */}
              <div style={{ background:'#fff', borderRadius:18, border:'1px solid #E2E8F0', padding:20, marginBottom:14 }}>
                <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:14 }}>Estimated Trip Cost ({people} person{people!=='1'?'s':''}, {nights} night{nights!=='1'?'s':''})</div>
                {[
                  [mode==='private'?'Private Hire (return)':'Public Bus (return)', mode==='private'?hireCost():busCost()*2, mode==='private'?'Exclusive vehicle, your schedule':'Shared coach, fixed departures'],
                  ['Accommodation', hotelCost(), result.hotels[Math.min(hotelIdx,result.hotels.length-1)].name],
                  result.parkUGX > 0 ? ['Park Entry Fees', parkCost(), result.parkNote] : null,
                  ['Meals & Incidentals', mealCost(), `UGX 45,000/person/day (estimate)`],
                ].filter(Boolean).map(([label, amount, note])=>(
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ fontSize:13, ...P, fontWeight:600, color:'#0F1923' }}>{label}</div>
                      <div style={{ fontSize:11, ...I, color:'#94a3b8', marginTop:1 }}>{note}</div>
                    </div>
                    <div style={{ ...P, fontWeight:700, fontSize:13, color:'#0B3D91', flexShrink:0, marginLeft:12 }}>UGX {amount.toLocaleString()}</div>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:12, borderTop:'2px solid #E2E8F0', marginTop:4 }}>
                  <span style={{ ...P, fontWeight:800, fontSize:16 }}>Total Estimate</span>
                  <span style={{ ...P, fontWeight:800, fontSize:18, color:'#0B3D91' }}>UGX {total().toLocaleString()}</span>
                </div>
                <p style={{ fontSize:11, color:'#94a3b8', ...I, marginTop:8 }}>*Gorilla permits (Bwindi) and specialised activities not included above. Prices are estimates and may vary.</p>
              </div>

              {/* Local tips */}
              <div style={{ background:'#eff6ff', borderRadius:14, padding:16, marginBottom:14 }}>
                <div style={{ ...P, fontWeight:700, fontSize:13, color:'#1d4ed8', marginBottom:10 }}>Local Tips for {result.name.split(' ')[0]}</div>
                {result.tips.map((t,i)=>(
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                    <div style={{ color:'#FFC72C', fontSize:12, flexShrink:0, marginTop:2 }}>•</div>
                    <p style={{ fontSize:13, ...I, color:'#1e3a8a', margin:0, lineHeight:1.65 }}>{t}</p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {mode === 'private' ? (
                  <button onClick={()=>navigate('/book?type=hire')} style={{ flex:1, padding:'13px 20px', borderRadius:14, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                    Book Private Hire
                  </button>
                ) : (
                  <button onClick={()=>navigate(`/book?from=Kampala&to=${encodeURIComponent(result.from==='Kampala'?result.name.split(' ')[0]:result.from)}`)} style={{ flex:1, padding:'13px 20px', borderRadius:14, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                    Book Bus to {result.name.split(' ')[0]}
                  </button>
                )}
                <button onClick={()=>setMode('hotel')} style={{ padding:'13px 20px', borderRadius:14, border:'1.5px solid #0B3D91', color:'#0B3D91', ...P, fontWeight:700, fontSize:14, background:'#fff', cursor:'pointer' }}>
                  Request Hotel Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
