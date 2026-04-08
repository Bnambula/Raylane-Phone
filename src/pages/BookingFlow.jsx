import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { operators } from '../data'
import { BusSeat55, BusSeat65, BusSeat67, TaxiSeat14, SeatLegend, PaymentModule, PaymentSuccess } from '../components/ui/SharedComponents'
import { useToast } from '../hooks/useToast'
import Footer from '../components/layout/Footer'

/* ── step labels ── */
const STEPS = ['Vehicle Type', 'Search Results', 'Select Seats', 'Payment', 'Ticket']

/* ── vehicle configs ── */
const VEHICLES = [
  { id:'bus',    label:'Bus / Coach',   icon:'🚌', desc:'55–67 seater long-distance coach' },
  { id:'taxi',   label:'Taxi / Matatu', icon:'🚐', desc:'14-seater shared taxi service' },
  { id:'parcel', label:'Send Parcel',   icon:'📦', desc:'Door-to-door parcel delivery' },
  { id:'hire',   label:'Private Hire',  icon:'🚗', desc:'Exclusive vehicle booking', badge:'Soon' },
]

const BOOKED = [3,7,8,11,14,20,21,22,31,35]

/* ── seat map selector ── */
function SeatMap({ vehicleConfig, booked, selected, onToggle }) {
  const props = { booked, locked:[], selected, onToggle }
  if (vehicleConfig?.seats >= 67) return <BusSeat67 {...props} />
  if (vehicleConfig?.seats >= 65) return <BusSeat65 {...props} />
  if (vehicleConfig?.seats >= 55) return <BusSeat55 {...props} />
  return <TaxiSeat14 {...props} />
}

/* ── lock timer pill ── */
function LockTimer({ seconds }) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6, background: seconds < 60 ? '#fee2e2' : '#fff3cd', color: seconds < 60 ? '#dc2626' : '#92400e', padding:'6px 14px', borderRadius:20, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13 }}>
      ⏱ Seat held: {m}:{String(s).padStart(2,'0')}
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function BookingFlow() {
  const [params] = useSearchParams()
  const [step, setStep] = useState(0)
  const [vehicleFilter, setVehicleFilter] = useState('bus')
  const [selectedOp, setSelectedOp] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [payMethod, setPayMethod] = useState('mtn')
  const [phone, setPhone] = useState('')
  const [useDiffNumber, setUseDiffNumber] = useState(false)
  const [payPhone, setPayPhone] = useState('')
  const [paying, setPaying] = useState(false)
  const [lockTimer, setLockTimer] = useState(null) // seconds remaining
  const [ticketId] = useState(`RLX-${Date.now().toString().slice(-6)}-MBA-${Math.floor(Math.random()*90000+10000)}`)
  const timerRef = useRef(null)
  const toast = useToast()
  const navigate = useNavigate()

  const from = params.get('from') || 'Kampala'
  const to   = params.get('to')   || 'Mbale'
  const date = params.get('date') || 'Fri, 12 May 2026'
  const opId = params.get('operator')

  useEffect(() => {
    if (opId) {
      const op = operators.find(o => o.id === parseInt(opId))
      if (op) { setSelectedOp(op); setStep(2) }
    }
  }, [opId])

  /* seat lock countdown */
  useEffect(() => {
    if (selectedSeats.length > 0 && step === 2) {
      setLockTimer(5 * 60) // 5 min
      timerRef.current = setInterval(() => {
        setLockTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            setSelectedSeats([])
            toast('⏰ Seat hold expired. Please re-select.', 'warning')
            return null
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      if (selectedSeats.length === 0) setLockTimer(null)
    }
    return () => clearInterval(timerRef.current)
  }, [selectedSeats.length > 0, step])

  const toggleSeat = (n) => {
    if (BOOKED.includes(n)) return
    setSelectedSeats(prev =>
      prev.includes(n) ? prev.filter(s => s !== n) : prev.length < 6 ? [...prev, n] : prev
    )
  }

  const handlePay = async () => {
    const pNum = useDiffNumber ? payPhone : phone
    if (!phone || phone.length < 10) { toast('Enter your booking phone number','warning'); return }
    if (useDiffNumber && (!payPhone || payPhone.length < 10)) { toast('Enter the payment phone number','warning'); return }
    setPaying(true)
    await new Promise(r => setTimeout(r, 2400))
    setPaying(false)
    clearInterval(timerRef.current)
    setStep(4)
    toast('🎉 Payment confirmed! Ticket sent to ' + pNum, 'success')
  }

  const filteredOps = operators.filter(op => {
    if (vehicleFilter === 'bus')   return op.seats >= 30 && !op.full
    if (vehicleFilter === 'taxi')  return op.seats < 30 && !op.full
    return false
  })

  const total = (selectedOp?.price || 25000) * Math.max(selectedSeats.length, 1)
  const effPhone = useDiffNumber ? payPhone : phone

  /* ── STEP HEADER ── */
  const StepBar = () => (
    <div style={{ background:'var(--blue)', padding:'20px 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:14, flexWrap:'wrap' }}>
          <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.65)', cursor:'pointer', fontSize:12, fontFamily:"'Poppins',sans-serif" }}>← Home</button>
          <span style={{ color:'rgba(255,255,255,0.3)' }}>/</span>
          <span style={{ color:'var(--white)', fontSize:12, fontFamily:"'Poppins',sans-serif" }}>{from} → {to}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background: i<step?'var(--gold)': i===step?'var(--white)':'rgba(255,255,255,0.2)', color: i<step?'var(--blue)': i===step?'var(--blue)':'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:12 }}>{i<step?'✓':i+1}</div>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, color: i===step?'var(--gold)': i<step?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.4)', whiteSpace:'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length-1 && <div style={{ flex:1, height:2, background: i<step?'var(--gold)':'rgba(255,255,255,0.12)', margin:'0 8px', minWidth:16 }}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop:64, background:'var(--gray-light)', minHeight:'100vh' }}>
      <StepBar />
      <div className="container" style={{ padding:'28px 16px 100px' }}>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            STEP 0: VEHICLE TYPE SELECTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {step === 0 && (
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:'clamp(1.5rem,3vw,2rem)', marginBottom:8 }}>How would you like to travel?</h2>
              <p style={{ color:'var(--gray-text)', fontSize:15 }}>{from} → {to} &nbsp;·&nbsp; {date}</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {VEHICLES.map(v => (
                <button key={v.id} onClick={() => {
                  if (v.badge) { toast('Coming soon!','warning'); return }
                  setVehicleFilter(v.id === 'taxi' ? 'taxi' : v.id === 'parcel' ? 'parcel' : 'bus')
                  if (v.id === 'parcel') { navigate('/parcels'); return }
                  setStep(1)
                }} style={{
                  background:'var(--white)', borderRadius:18, padding:24, textAlign:'left',
                  border:`2px solid ${vehicleFilter === (v.id==='taxi'?'taxi':'bus') && v.id!=='parcel' && v.id!=='hire' ? 'var(--blue)':'var(--gray-mid)'}`,
                  cursor: v.badge ? 'not-allowed' : 'pointer', transition:'all 0.2s',
                  boxShadow:'var(--shadow-sm)', position:'relative', opacity: v.badge ? 0.5 : 1,
                }}>
                  {v.badge && <span style={{ position:'absolute', top:10, right:10, background:'var(--gold)', color:'var(--blue)', padding:'2px 9px', borderRadius:10, fontSize:10, fontFamily:"'Poppins',sans-serif", fontWeight:800 }}>{v.badge}</span>}
                  <div style={{ fontSize:40, marginBottom:12 }}>{v.icon}</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:17, marginBottom:6 }}>{v.label}</div>
                  <div style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.6 }}>{v.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            STEP 1: SEARCH RESULTS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {step === 1 && (
          <div>
            <div style={{ background:'var(--white)', borderRadius:16, padding:18, marginBottom:20, boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18 }}>{from} → {to}</div>
                <div style={{ color:'var(--gray-text)', fontSize:13 }}>{date} · {vehicleFilter === 'taxi' ? 'Taxi/Matatu' : 'Bus/Coach'}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setStep(0)} style={{ padding:'9px 18px', borderRadius:20, background:'var(--gray-light)', color:'var(--blue)', border:'1.5px solid var(--blue)', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>← Change Type</button>
                <button onClick={() => navigate('/')} style={{ padding:'9px 18px', borderRadius:20, background:'var(--gray-light)', color:'var(--dark)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>✏️ Edit Search</button>
              </div>
            </div>

            {filteredOps.length === 0 ? (
              <div style={{ background:'var(--white)', borderRadius:16, padding:40, textAlign:'center', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>😔</div>
                <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:20, marginBottom:8 }}>No {vehicleFilter === 'taxi' ? 'taxis' : 'buses'} found</h3>
                <p style={{ color:'var(--gray-text)' }}>Try a different date or vehicle type.</p>
                <button onClick={() => setStep(0)} style={{ marginTop:20, padding:'12px 28px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, cursor:'pointer' }}>Change Vehicle Type</button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {filteredOps.map(op => (
                  <div key={op.id} style={{ background:'var(--white)', borderRadius:16, padding:18, boxShadow:'var(--shadow-sm)', display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:16, alignItems:'center', transition:'all 0.2s', cursor:'pointer' }}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-lg)';e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='none'}}
                    onClick={() => { setSelectedOp(op); setStep(2) }}>
                    <div style={{ width:50, height:50, borderRadius:14, background:`${op.color}18`, border:`2px solid ${op.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:16, color:op.color }}>{op.shortName}</div>
                    <div>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15, marginBottom:3 }}>{op.name} <span style={{ fontSize:11, color:'var(--gray-text)', fontWeight:500 }}>· {op.plate}</span></div>
                      <div style={{ fontSize:12, color:'var(--gray-text)', marginBottom:5 }}>{op.type} · Departs {op.departureTime}</div>
                      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                        {[...Array(5)].map((_,i)=><span key={i} style={{ color:i<Math.floor(op.rating)?'var(--gold)':'var(--gray-mid)', fontSize:12 }}>★</span>)}
                        <span style={{ fontSize:11, color:'var(--gray-text)', marginLeft:4 }}>{op.rating} ({op.reviews})</span>
                        {op.seatsLeft <= 5 && <span style={{ marginLeft:8, background:'#fef3c7', color:'#92400e', padding:'2px 8px', borderRadius:10, fontSize:11, fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>⚠️ {op.seatsLeft} seats left</span>}
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:20, color:'var(--blue)' }}>UGX {op.price.toLocaleString()}</div>
                      <div style={{ fontSize:12, color:'var(--gray-text)' }}>per seat</div>
                    </div>
                    <button style={{ padding:'10px 20px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, cursor:'pointer', flexShrink:0 }}>Select</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            STEP 2: SEAT SELECTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {step === 2 && selectedOp && (
          <div className='seat-step-grid' style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:20, alignItems:'start' }}>
            {/* Sidebar */}
            <div>
              {/* Operator card */}
              <div style={{ background:'var(--blue)', borderRadius:16, padding:18, color:'var(--white)', marginBottom:12 }}>
                <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${selectedOp.color}30`, border:`2px solid ${selectedOp.color}60`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:15, color:selectedOp.color }}>{selectedOp.shortName}</div>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15 }}>{selectedOp.name}</div>
                    <div style={{ fontSize:12, opacity:0.75 }}>{selectedOp.plate} · {selectedOp.type}</div>
                  </div>
                </div>
                <div style={{ fontSize:13, opacity:0.75, marginBottom:4 }}>{from} → {to}</div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13 }}>Departs {selectedOp.departureTime}</div>
                <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.15)', fontFamily:"'Poppins',sans-serif", fontWeight:800, color:'var(--gold)' }}>
                  UGX {selectedOp.price.toLocaleString()} / seat
                </div>
              </div>

              {/* Legend */}
              <div style={{ background:'var(--white)', borderRadius:14, padding:14, marginBottom:12, boxShadow:'var(--shadow-sm)' }}>
                <SeatLegend />
              </div>

              {/* Lock timer */}
              {lockTimer !== null && (
                <div style={{ marginBottom:12, textAlign:'center' }}>
                  <LockTimer seconds={lockTimer} />
                </div>
              )}

              {/* Selected summary */}
              {selectedSeats.length > 0 ? (
                <div style={{ background:'var(--white)', borderRadius:16, padding:18, boxShadow:'var(--shadow-md)', border:'2px solid var(--gold)' }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:11, color:'var(--gray-text)', marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>Selected Seats</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
                    {selectedSeats.sort((a,b)=>a-b).map(s => (
                      <span key={s} style={{ background:'var(--gold)', color:'var(--blue)', padding:'4px 10px', borderRadius:8, fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:20, color:'var(--blue)', marginBottom:14 }}>UGX {total.toLocaleString()}</div>
                  {selectedSeats.length >= 7 && (
                    <div style={{ background:'#fff3cd', borderRadius:10, padding:'8px 12px', marginBottom:12, fontSize:12, fontFamily:"'Poppins',sans-serif", fontWeight:700, color:'#92400e' }}>💡 Full vehicle charter available!</div>
                  )}
                  <button onClick={() => setStep(3)} style={{ width:'100%', padding:'12px', borderRadius:14, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, cursor:'pointer' }}>Continue to Payment →</button>
                </div>
              ) : (
                <div style={{ background:'var(--gray-light)', borderRadius:14, padding:18, textAlign:'center', color:'var(--gray-text)' }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>👆</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14 }}>Tap a seat to select it</div>
                  <div style={{ fontSize:12, marginTop:4 }}>Up to 6 seats at once</div>
                </div>
              )}
            </div>

            {/* Seat map */}
            <div>
              <div style={{ background:'var(--gray-light)', borderRadius:20, padding:16, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                <div style={{ minWidth: vehicleFilter === 'taxi' ? 220 : 480 }}>
                  <SeatMap
                    vehicleConfig={selectedOp}
                    booked={BOOKED}
                    selected={selectedSeats}
                    onToggle={toggleSeat}
                  />
                </div>
              </div>
              <div style={{ marginTop:10, display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
                {[['Booked',BOOKED.length,'#dc2626'],['Available',selectedOp.seats-BOOKED.length,'#15803d'],['Selected',selectedSeats.length,'#92400e']].map(([l,v,c])=>(
                  <div key={l} style={{ fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:12, color:'var(--gray-text)' }}>
                    {l}: <strong style={{ color:c }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            STEP 3: PAYMENT
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {step === 3 && (
          <div style={{ maxWidth:520, margin:'0 auto' }}>
            <div style={{ background:'var(--white)', borderRadius:20, padding:28, boxShadow:'var(--shadow-lg)' }}>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:22, marginBottom:6 }}>Complete Payment</h2>
              <p style={{ color:'var(--gray-text)', fontSize:14, marginBottom:22 }}>🔒 Secure mobile money payment via Raylane Pay</p>

              {/* Booking summary */}
              <div style={{ background:'var(--gray-light)', borderRadius:14, padding:16, marginBottom:22 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                  <span style={{ color:'var(--gray-text)' }}>{from} → {to}</span>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>{date}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                  <span style={{ color:'var(--gray-text)' }}>Seats: {selectedSeats.join(', ') || '2, 5'}</span>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>{selectedOp?.name || 'Global Coaches'}</span>
                </div>
                <div style={{ borderTop:'1px solid var(--gray-mid)', paddingTop:12, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>Total</span>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:20, color:'var(--blue)' }}>UGX {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment method */}
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:10 }}>Payment Method</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[{id:'mtn',label:'MTN MoMo',color:'#ffc300',bg:'#fffbeb'},{id:'airtel',label:'Airtel Money',color:'#e4002b',bg:'#fff5f5'}].map(m=>(
                    <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{ border:`2px solid ${payMethod===m.id?m.color:'var(--gray-mid)'}`, borderRadius:14, padding:'12px 14px', cursor:'pointer', background:payMethod===m.id?m.bg:'var(--white)', transition:'all 0.2s', display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${m.color}`, background:payMethod===m.id?m.color:'transparent', transition:'all 0.2s' }}/>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, color:m.color }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking phone */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>
                  Your Phone Number (Booking Reference)
                </label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={payMethod==='mtn'?'0771 000 000':'0700 000 000'}
                  style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:12, padding:'12px 14px', fontSize:14, fontFamily:"'Poppins',sans-serif", fontWeight:600, boxSizing:'border-box' }}
                  onFocus={e=>e.target.style.borderColor='var(--blue)'}
                  onBlur={e=>e.target.style.borderColor='var(--gray-mid)'}/>
              </div>

              {/* Pay with different number toggle */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <div onClick={()=>setUseDiffNumber(!useDiffNumber)} style={{ width:44, height:24, borderRadius:12, background:useDiffNumber?'var(--blue)':'var(--gray-mid)', position:'relative', transition:'all 0.25s', flexShrink:0 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'white', position:'absolute', top:2, left:useDiffNumber?22:2, transition:'all 0.25s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
                  </div>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:'var(--dark)' }}>Pay with a different number</span>
                </label>
                {useDiffNumber && (
                  <div style={{ marginTop:12, background:'#eff6ff', borderRadius:12, padding:14, border:'1.5px solid #bfdbfe' }}>
                    <div style={{ fontSize:12, color:'#1d4ed8', fontFamily:"'Poppins',sans-serif", fontWeight:700, marginBottom:8 }}>
                      ℹ️ Both numbers will be linked to booking ID: {ticketId}
                    </div>
                    <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:6 }}>
                      Payment Phone Number
                    </label>
                    <input value={payPhone} onChange={e=>setPayPhone(e.target.value)} placeholder="Payment number (MTN/Airtel)"
                      style={{ width:'100%', border:'1.5px solid #bfdbfe', borderRadius:10, padding:'11px 14px', fontSize:14, fontFamily:"'Poppins',sans-serif", fontWeight:600, boxSizing:'border-box' }}/>
                    <div style={{ fontSize:11, color:'var(--gray-text)', marginTop:8 }}>
                      Payment must exactly match UGX {total.toLocaleString()}. Mismatches are auto-rejected.
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handlePay} disabled={paying} style={{ width:'100%', padding:'15px', borderRadius:14, background:paying?'var(--gray-mid)':'var(--gold)', color:paying?'var(--gray-text)':'var(--blue)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:16, cursor:paying?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxSizing:'border-box' }}>
                {paying
                  ? <><span style={{ width:18,height:18,border:'3px solid var(--gray-text)',borderTopColor:'var(--blue)',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }}/> Processing Payment…</>
                  : `📱 Pay UGX ${total.toLocaleString()}`}
              </button>
              <p style={{ fontSize:11, color:'var(--gray-text)', textAlign:'center', marginTop:10 }}>🔒 Secured by Raylane Pay · SSL Encrypted</p>
            </div>
          </div>
        )}

        {/* STEP 4: DIGITAL TICKET */}
        {step === 4 && (
          <div style={{ padding:'0 4px 24px' }}>
            <PaymentSuccess
              amount={total}
              phone={phone}
              payPhone={useDiffNumber ? payPhone : null}
              bookingRef={ticketId}
              route={`${from} → ${to}`}
              seats={selectedSeats}
              onDone={() => navigate('/')}
            />
          </div>
        )}

            </div>
      <Footer />
      <style>{`
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @media(max-width:767px){
    .seat-step-grid{grid-template-columns:1fr!important;}
    .vehicle-type-grid{grid-template-columns:1fr 1fr!important;}
  }
`}</style>
    </div>
  )
}
