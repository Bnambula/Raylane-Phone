import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../hooks/useStore'

export default function LeavingSoonSection() {
  const [state] = useStore()
  const navigate = useNavigate()

  const liveTrips = state.trips.filter(t => t.status === 'APPROVED' && t.seats_booked < t.seats_total)
  const soon = liveTrips.slice(0, 8)

  if (soon.length === 0) return null

  return (
    <section style={{ background:'#fff', padding:'56px 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#22C55E', animation:'blink 1.2s ease infinite' }}/>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:22, margin:0 }}>Leaving Soon</h2>
            <span style={{ background:'#dcfce7', color:'#15803d', padding:'3px 10px', borderRadius:20, fontSize:11, fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>LIVE</span>
          </div>
          <button onClick={() => navigate('/book')} style={{ padding:'9px 20px', borderRadius:20, background:'#0B3D91', color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, border:'none', cursor:'pointer' }}>
            View All Trips →
          </button>
        </div>

        <div className="scroll-x" style={{ display:'flex', gap:14, paddingBottom:8 }}>
          {soon.map(trip => {
            const pct = Math.round((trip.seats_booked/trip.seats_total)*100)
            const seatsLeft = trip.seats_total - trip.seats_booked
            const urgent = seatsLeft <= 5
            return (
              <div key={trip.id} onClick={() => navigate(`/book?from=${trip.from}&to=${trip.to}&trip=${trip.id}`)}
                style={{ minWidth:220, borderRadius:16, border:`1.5px solid ${urgent?'#fca5a5':'#E2E8F0'}`, padding:18, background:urgent?'#fff5f5':'#fff', cursor:'pointer', transition:'all .22s', flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:'#0F1923' }}>{trip.from} → {trip.to}</span>
                  {urgent && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'2px 8px', borderRadius:10, fontSize:10, fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>HOT</span>}
                </div>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:10, fontFamily:"'Inter',sans-serif" }}>{trip.operator_name} · {trip.departs}</div>
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#64748b', marginBottom:4 }}>
                    <span>{seatsLeft} seats left</span><span>{pct}% full</span>
                  </div>
                  <div style={{ height:5, background:'#E2E8F0', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:pct>85?'#ef4444':pct>60?'#f59e0b':'#22C55E', borderRadius:3, transition:'width .5s' }}/>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:17, color:'#0B3D91' }}>UGX {trip.price.toLocaleString()}</span>
                  <div style={{ background:'#FFC72C', color:'#0B3D91', padding:'6px 14px', borderRadius:20, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12 }}>Book</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </section>
  )
}
