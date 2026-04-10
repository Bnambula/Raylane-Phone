import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../hooks/useStore'
import { Pill } from '../ui/SharedComponents'

const amenityIcon = { wifi:'📶', ac:'❄️', usb:'🔌' }

export default function AvailableTripsSection() {
  const [state] = useStore()
  const [sortBy, setSortBy] = useState('price')
  const [alert, setAlert]   = useState(true)
  const navigate = useNavigate()

  // Only show APPROVED trips on website — synced directly from store
  const liveTrips = state.trips.filter(t => t.status === 'APPROVED')

  const enriched = liveTrips.map(t => {
    const op = state.operators.find(o => o.id === t.operator_id)
    return { ...t, op, seatsLeft: t.seats_total - t.seats_booked, full: t.seats_booked >= t.seats_total }
  })

  const sorted = [...enriched].sort((a,b) =>
    sortBy==='price'  ? a.price - b.price  :
    sortBy==='rating' ? (b.op?.rating||0) - (a.op?.rating||0) :
    a.departs.localeCompare(b.departs)
  )

  return (
    <section id="available-trips" style={{ background:'var(--gray-light)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:14 }}>
          <div>
            <div className="section-label">Live Results</div>
            <h2 className="section-title">Available <span>Trips</span></h2>
            <p style={{ color:'var(--gray-text)', fontSize:14, marginTop:4 }}>Kampala routes · Synced live from operator dashboards</p>
          </div>
          <div style={{ display:'flex', gap:7, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>Sort:</span>
            {['price','rating','time'].map(s=>(
              <button key={s} onClick={()=>setSortBy(s)} style={{ padding:'6px 14px', borderRadius:20, border:`1.5px solid ${sortBy===s?'var(--blue)':'var(--gray-mid)'}`, background:sortBy===s?'var(--blue)':'var(--white)', color:sortBy===s?'var(--white)':'var(--dark)', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', textTransform:'capitalize', transition:'all .18s' }}>{s}</button>
            ))}
          </div>
        </div>

        {alert && liveTrips.some(t=>t.seats_total-t.seats_booked<6) && (
          <div style={{ background:'linear-gradient(135deg,#fff3cd,#ffeaa7)', border:'1px solid #f59e0b', borderRadius:12, padding:'13px 18px', marginBottom:18, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <span style={{ fontSize:17 }}>🔔</span>
              <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:'#92400e' }}>High demand — some routes have fewer than 6 seats remaining!</span>
            </div>
            <button onClick={()=>setAlert(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#92400e', flexShrink:0 }}>✕</button>
          </div>
        )}

        {liveTrips.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px', background:'var(--white)', borderRadius:16 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🚌</div>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18 }}>No approved trips right now</h3>
            <p style={{ color:'var(--gray-text)' }}>Operators are adding trips — check back soon.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {sorted.map(trip=>(
              <div key={trip.id} style={{ background:'var(--white)', borderRadius:16, padding:'16px 18px', boxShadow:'var(--shadow-sm)', transition:'all .2s', opacity:trip.full?.7:1 }}
                onMouseEnter={e=>{if(!trip.full){e.currentTarget.style.boxShadow='var(--shadow-lg)';e.currentTarget.style.transform='translateY(-2px)'}}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='none'}}>
                <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center' }}>
                  <div style={{ width:48, height:48, borderRadius:13, background:'rgba(11,61,145,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:15, color:'var(--blue)', flexShrink:0 }}>
                    {trip.op?.company_name?.[0]||'?'}{trip.op?.company_name?.split(' ')[1]?.[0]||''}
                  </div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15 }}>{trip.op?.company_name||'Unknown'}</span>
                      <span style={{ fontSize:11, color:'var(--gray-text)', background:'var(--gray-light)', padding:'2px 7px', borderRadius:8 }}>{trip.plate}</span>
                      <span style={{ fontSize:11, color:'var(--gray-text)' }}>{trip.seat_type}-seater</span>
                      {trip.full&&<Pill text="FULL" color="#dc2626"/>}
                      {!trip.full&&trip.seatsLeft<=5&&<Pill text={`⚠️ ${trip.seatsLeft} seats left`} color="#92400e" bg="#fef9c3"/>}
                    </div>
                    <div style={{ fontSize:12, color:'var(--gray-text)', marginBottom:5 }}>
                      {trip.from} → {trip.to} · Departs {trip.departs} · {trip.date}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                      {trip.op?.rating&&(
                        <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                          <span style={{ color:'var(--gold)', fontSize:12 }}>★</span>
                          <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12 }}>{trip.op.rating}</span>
                          <span style={{ fontSize:11, color:'var(--gray-text)' }}>({trip.op.reviews})</span>
                        </div>
                      )}
                      {trip.boarding_pin?.label&&<span style={{ fontSize:11, color:'var(--gray-text)' }}>📍 {trip.boarding_pin.label}</span>}
                      {trip.notes&&<span style={{ fontSize:11, color:'var(--gray-text)' }}>• {trip.notes}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:'clamp(16px,2vw,20px)', color:'var(--blue)' }}>
                      UGX {trip.price.toLocaleString()}
                    </div>
                    {trip.full
                      ? <button onClick={()=>navigate('/book')} style={{ padding:'8px 16px', borderRadius:20, background:'var(--gray-light)', color:'var(--gray-text)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>View</button>
                      : <button onClick={()=>navigate(`/book?from=${trip.from}&to=${trip.to}&trip=${trip.id}`)} style={{ padding:'9px 18px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, cursor:'pointer', boxShadow:'0 2px 10px rgba(255,199,44,0.35)', transition:'all .18s' }}
                          onMouseEnter={e=>e.target.style.transform='translateY(-1px)'}
                          onMouseLeave={e=>e.target.style.transform='none'}>
                          Select
                        </button>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:24 }}>
          <button onClick={()=>navigate('/book')} style={{ padding:'13px 32px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'var(--shadow-md)' }}>
            View All Available Trips →
          </button>
        </div>
      </div>
    </section>
  )
}
