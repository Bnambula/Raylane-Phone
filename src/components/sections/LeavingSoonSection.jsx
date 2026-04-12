import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../hooks/useStore'

export default function LeavingSoonSection() {
  const [state] = useStore()
  const navigate = useNavigate()

  const live = state.trips.filter(t => t.status === 'APPROVED' && t.seats_booked < t.seats_total)
  if (live.length === 0) return null

  const goToSeats = trip => {
    // Skip vehicle selection — go directly to seat selection for this specific trip
    navigate(`/book?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&trip=${trip.id}&step=seats`)
  }

  return (
    <section style={{ background:"#fff", padding:"56px 0" }}>
      <div className="container">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#22C55E", animation:"blink 1.2s ease infinite" }}/>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:22, margin:0 }}>Leaving Soon</h2>
            <span style={{ background:"#dcfce7", color:"#15803d", padding:"3px 10px", borderRadius:20, fontSize:11, fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>LIVE</span>
          </div>
          <button onClick={() => navigate('/book')} style={{ padding:"9px 22px", borderRadius:20, background:"#0B3D91", color:"#fff", fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, border:"none", cursor:"pointer" }}>
            View All Trips
          </button>
        </div>

        <div style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:8 }}>
          {live.slice(0,8).map(trip => {
            const pct = Math.round((trip.seats_booked / trip.seats_total) * 100)
            const left = trip.seats_total - trip.seats_booked
            const hot = left <= 8
            const amenityIcons = { ac:"AC", wifi:"WiFi", usb:"USB" }
            return (
              <div key={trip.id}
                style={{ minWidth:230, borderRadius:18, border:`1.5px solid ${hot?"#fca5a5":"#E2E8F0"}`, padding:18, background:hot?"#fff8f8":"#fff", cursor:"pointer", transition:"all .22s", flexShrink:0 }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(11,61,145,.13)" }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none" }}>

                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15, color:"#0F1923" }}>{trip.from} → {trip.to}</div>
                  {hot && <span style={{ background:"#fee2e2", color:"#dc2626", padding:"2px 8px", borderRadius:10, fontSize:10, fontFamily:"'Poppins',sans-serif", fontWeight:700, flexShrink:0, marginLeft:6 }}>HOT</span>}
                </div>

                {/* Operator + departs */}
                <div style={{ fontSize:12, color:"#64748b", marginBottom:4, fontFamily:"'Inter',sans-serif" }}>
                  {trip.operator_name}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                  <span style={{ background:"#eff6ff", color:"#1d4ed8", padding:"2px 8px", borderRadius:8, fontSize:11, fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>{trip.departs}</span>
                  <span style={{ fontSize:11, color:"#94a3b8" }}>{trip.seat_type}-seater</span>
                  {(trip.amenities||[]).slice(0,2).map(a => (
                    <span key={a} style={{ background:"#f0fdf4", color:"#15803d", padding:"2px 6px", borderRadius:6, fontSize:10, fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>{amenityIcons[a]||a}</span>
                  ))}
                </div>

                {/* Seat fill */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#64748b", marginBottom:4, fontFamily:"'Inter',sans-serif" }}>
                    <span>{left} seat{left!==1?"s":""} left</span>
                    <span>{pct}% full</span>
                  </div>
                  <div style={{ height:5, background:"#E2E8F0", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:pct>85?"#ef4444":pct>60?"#f59e0b":"#22C55E", borderRadius:3, transition:"width .5s" }}/>
                  </div>
                </div>

                {/* Price + CTA */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18, color:"#0B3D91" }}>UGX {trip.price.toLocaleString()}</div>
                    <div style={{ fontSize:10, color:"#94a3b8", fontFamily:"'Inter',sans-serif" }}>per seat</div>
                  </div>
                  <button onClick={() => goToSeats(trip)} style={{ background:"#FFC72C", color:"#0B3D91", border:"none", padding:"9px 18px", borderRadius:20, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .2s", boxShadow:"0 3px 10px rgba(255,199,44,.4)" }}>
                    Select Seat
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{"@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}"}</style>
    </section>
  )
}
