import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BusSeat55, BusSeat65, BusSeat67, TaxiSeat14, SeatLegend } from '../ui/SharedComponents'

const BOOKED_55   = [3,7,8,11,14,20,21,22,31,35]
const BOOKED_65   = [1,5,12,20,34,40,50]
const BOOKED_TAXI = [1,3,6]

const VEHICLES = [
  { id:'bus55', label:'55-Seater',    icon:'🚌', seats:55, price:25000, Component:BusSeat55, booked:BOOKED_55 },
  { id:'bus65', label:'65-Seater',    icon:'🚌', seats:65, price:24000, Component:BusSeat65, booked:BOOKED_65 },
  { id:'taxi',  label:'14-Seat Taxi', icon:'🚐', seats:14, price:18000, Component:TaxiSeat14, booked:BOOKED_TAXI },
]

export default function SeatSelectionSection() {
  const [vType, setVType]     = useState('bus55')
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  const vehicle = VEHICLES.find(v => v.id === vType)
  useEffect(() => setSelected([]), [vType])

  const toggleSeat = n => {
    if (vehicle.booked.includes(n)) return
    setSelected(prev => prev.includes(n) ? prev.filter(s=>s!==n) : prev.length<6 ? [...prev,n] : prev)
  }

  const total = vehicle.price * Math.max(selected.length, 1)
  const { Component } = vehicle

  return (
    <section style={{ background:'var(--gray-light)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div className="section-label">Real-Time Seats</div>
          <h2 className="section-title">Pick Your <span>Perfect Seat</span></h2>
          <p style={{ color:'var(--gray-text)', maxWidth:480, margin:'0 auto' }}>Live availability. Seat held for 5 minutes after selection. No double booking.</p>
        </div>

        {/* Vehicle picker */}
        <div style={{ background:'var(--white)', borderRadius:18, padding:'16px 20px', marginBottom:28, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', boxShadow:'var(--shadow-sm)' }}>
          {VEHICLES.map(v => (
            <button key={v.id} onClick={() => setVType(v.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:20, border:`2px solid ${vType===v.id?'var(--blue)':'var(--gray-mid)'}`, background:vType===v.id?'var(--blue)':'transparent', color:vType===v.id?'var(--white)':'var(--dark)', fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all .2s' }}>
              <span>{v.icon}</span>{v.label}
              {vType===v.id&&<span style={{ background:'var(--gold)',color:'var(--blue)',borderRadius:10,padding:'1px 7px',fontSize:10,fontWeight:900 }}>✓</span>}
            </button>
          ))}
        </div>

        <div className='seat-grid' style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:20, alignItems:'start' }}>
          {/* Sidebar */}
          <div>
            <div style={{ background:'var(--blue)', borderRadius:16, padding:18, color:'var(--white)', marginBottom:12 }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{vehicle.icon}</div>
              <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:16, marginBottom:3 }}>{vehicle.label} Coach</div>
              <div style={{ opacity:.75, fontSize:13, marginBottom:12 }}>Global Coaches · UBF 234K</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ opacity:.75 }}>Per seat</span>
                <span style={{ fontFamily:''Poppins',sans-serif', fontWeight:800, color:'var(--gold)' }}>UGX {vehicle.price.toLocaleString()}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginTop:4 }}>
                <span style={{ opacity:.75 }}>Available</span>
                <span style={{ fontFamily:''Poppins',sans-serif', fontWeight:800 }}>{vehicle.seats-vehicle.booked.length}/{vehicle.seats}</span>
              </div>
            </div>

            <div style={{ background:'var(--white)', borderRadius:14, padding:14, marginBottom:12, boxShadow:'var(--shadow-sm)' }}>
              <SeatLegend compact/>
            </div>

            {selected.length > 0 ? (
              <div style={{ background:'var(--white)', borderRadius:16, padding:18, boxShadow:'var(--shadow-md)', border:'2px solid var(--gold)' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:''Poppins',sans-serif', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Selected</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
                  {selected.sort((a,b)=>a-b).map(s => (
                    <span key={s} style={{ background:'var(--gold)', color:'var(--blue)', padding:'3px 10px', borderRadius:7, fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:12 }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:900, fontSize:20, color:'var(--blue)', marginBottom:14 }}>UGX {total.toLocaleString()}</div>
                <button onClick={() => navigate(`/book?seats=${selected.join(',')}&vehicle=${vType}`)}
                  style={{ width:'100%', padding:'12px', borderRadius:12, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:14, cursor:'pointer' }}>
                  Continue →
                </button>
              </div>
            ) : (
              <div style={{ background:'var(--white)', borderRadius:14, padding:18, textAlign:'center', color:'var(--gray-text)', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ fontSize:26, marginBottom:7 }}>👆</div>
                <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:13 }}>Tap a seat to select</div>
                <div style={{ fontSize:11, marginTop:4 }}>Up to 6 seats at once</div>
              </div>
            )}
          </div>

          {/* Seat map */}
          <div>
            <div style={{ background:'var(--white)', borderRadius:18, padding:16, overflowX:'auto', WebkitOverflowScrolling:'touch', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ minWidth: vType==='taxi'?200:480 }}>
                <Component booked={vehicle.booked} locked={[]} selected={selected} onToggle={toggleSeat}/>
              </div>
            </div>
            <div style={{ marginTop:10, display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              {[['Total',vehicle.seats,'#1d4ed8'],['Booked',vehicle.booked.length,'#dc2626'],['Available',vehicle.seats-vehicle.booked.length,'#15803d'],['Selected',selected.length,'#92400e']].map(([l,v,c])=>(
                <div key={l} style={{ fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:12, color:'var(--gray-text)' }}>
                  {l}: <strong style={{ color:c }}>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.seat-grid{grid-template-columns:1fr!important;}} @media(max-width:767px){.vehicle-picker{flex-wrap:wrap!important;}}`}</style>
    </section>
  )
}
