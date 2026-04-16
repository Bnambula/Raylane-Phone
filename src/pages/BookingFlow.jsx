import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import { BusSeat55, BusSeat65, BusSeat67, TaxiSeat14, SeatLegend } from '../components/ui/SharedComponents'
import { useToast } from '../hooks/useToast'
import Footer from '../components/layout/Footer'
import NoTripsCard from '../components/booking/NoTripsCard'
import store from '../store/appStore'

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const STEPS  = ['Vehicle Type','Search Results','Select Seats','Payment','Ticket']
const BOOKED_DEMO = [3,7,8,11,14,20,21,22,31,35]

/* -- shared input styles -- */
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:"'Inter',sans-serif", color:'#0F1923', background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }
const P  = { fontFamily:"'Poppins',sans-serif" }
const I  = { fontFamily:"'Inter',sans-serif" }

/* -- Lock timer -- */
function LockTimer({ seconds }) {
  const m = Math.floor(seconds / 60), s = seconds % 60
  const urgent = seconds < 60
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:urgent?'#fee2e2':'#fef9c3', color:urgent?'#dc2626':'#92400e', padding:'5px 12px', borderRadius:16, ...P, fontWeight:700, fontSize:12 }}>
      {urgent ? 'Hurry! ' : ''}Seat held: {m}:{String(s).padStart(2,'0')}
    </span>
  )
}

/* -- Seat map picker -- */
function SeatMap({ seatType, booked, selected, onToggle }) {
  const props = { booked, locked:[], selected, onToggle }
  if (parseInt(seatType) >= 67) return <BusSeat67 {...props} />
  if (parseInt(seatType) >= 65) return <BusSeat65 {...props} />
  if (parseInt(seatType) >= 55) return <BusSeat55 {...props} />
  return <TaxiSeat14 {...props} />
}

export default function BookingFlow() {
  const [params]  = useSearchParams()
  const [state]   = useStore()
  const navigate  = useNavigate()
  const toast     = useToast()

  /* -- URL params -- */
  const urlFrom    = params.get('from')    || 'Kampala'
  const urlTo      = params.get('to')      || ''
  const urlDate    = params.get('date')    || new Date(Date.now()+86400000).toISOString().split('T')[0]
  const urlTrip    = params.get('trip')    || ''
  const urlStep    = params.get('step')    || ''
  const urlType    = params.get('type')    || ''
  const isAdvance  = params.get('advance') === 'true'
  const isCharter  = urlType === 'hire'

  /* -- state -- */
  const [step,        setStep]        = useState(urlStep === 'seats' ? 2 : 0)
  const [vehicle,     setVehicle]     = useState('coach')       // 'matatu' | 'coach'
  const [from,        setFrom]        = useState(urlFrom)
  const [to,          setTo]          = useState(urlTo)
  const [date,        setDate]        = useState(urlDate)
  const [results,     setResults]     = useState([])
  const [selectedTrip,setSelectedTrip]= useState(null)
  const [selectedSeats,setSelectedSeats]= useState([])
  const [payMethod,   setPayMethod]   = useState('mtn')
  const [phone,       setPhone]       = useState('')
  const [payPhone,    setPayPhone]    = useState('')
  const [diffNum,     setDiffNum]     = useState(false)
  const [paying,      setPaying]      = useState(false)
  const [paid,        setPaid]        = useState(false)
  const [lockSecs,    setLockSecs]    = useState(null)
  const [advanceMode, setAdvanceMode] = useState(isAdvance)
  const [bookingType, setBookingType] = useState('standard')
  const [notifyForm, setNotifyForm]   = useState({ phone:'', seatPref:'window', notes:'' })
  const [notifySent, setNotifySent]   = useState(false)
  const timerRef = useRef(null)
  const ticketId = useRef(`RLX-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*9000+1000)}`)

  /* -- Pre-select trip from "Leaving Soon" -- */
  useEffect(() => {
    if (urlTrip && state.trips.length > 0) {
      const t = state.trips.find(x => x.id === urlTrip)
      if (t) {
        setSelectedTrip(t)
        setFrom(t.from)
        setTo(t.to)
        setVehicle(parseInt(t.seat_type) <= 14 ? 'matatu' : 'coach')
        setStep(2)
      }
    }
    if (isCharter) setStep(0)
  }, [urlTrip, state.trips.length])

  /* -- Seat lock countdown -- */
  useEffect(() => {
    if (selectedSeats.length > 0 && step === 2) {
      setLockSecs(300)
      timerRef.current = setInterval(() => {
        setLockSecs(s => {
          if (s <= 1) { clearInterval(timerRef.current); toast('Seat hold expired -- please reselect','warning'); setSelectedSeats([]); return null }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [selectedSeats.length > 0 && step === 2])

  /* -- Search trips from store -- */
  const search = () => {
    if (!to) { toast('Please select a destination','warning'); return }
    const seatFilter = vehicle === 'matatu' ? 14 : null
    const found = state.trips.filter(t =>
      t.status === 'APPROVED' &&
      t.from.toLowerCase() === from.toLowerCase() &&
      t.to.toLowerCase() === to.toLowerCase() &&
      (seatFilter ? parseInt(t.seat_type) <= 14 : parseInt(t.seat_type) > 14)
    )
    setResults(found)
    setStep(1)
  }

  /* -- Average fare for advance booking -- */
  const avgFare = () => {
    const route = state.trips.filter(t => t.status === 'APPROVED' && t.from === from && t.to === to)
    if (!route.length) return 30000
    return Math.round(route.reduce((s,t) => s+t.price, 0) / route.length)
  }

  /* -- Advance booking 20% commitment fee -- */
  const commitFee = () => Math.round(avgFare() * 0.20)

  /* -- Payment amount -- */
  const payAmount = () => {
    if (!selectedTrip) return 0
    const base = selectedTrip.price * Math.max(selectedSeats.length, 1)
    return bookingType === 'advance' ? commitFee() : base
  }

  /* -- Process payment -- */
  const processPayment = () => {
    if (!phone.trim()) { toast('Enter your phone number','warning'); return }
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
      setStep(4)
      toast('Payment confirmed! Check your SMS for the QR ticket.','success')
    }, 2800)
  }

  /* ======================= RENDER ======================= */
  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>

      {/* Progress bar */}
      {step < 4 && (
        <div style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'14px 0' }}>
          <div className="container">
            <div style={{ display:'flex', gap:0 }}>
              {STEPS.slice(0,4).map((s,i) => (
                <div key={s} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
                  {i < 3 && <div style={{ position:'absolute', top:13, left:'50%', width:'100%', height:2, background:i < step ? '#0B3D91' : '#E2E8F0', zIndex:0 }}/>}
                  <div style={{ width:28, height:28, borderRadius:'50%', background:i < step ? '#0B3D91' : i === step ? '#FFC72C' : '#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:700, fontSize:12, color:i <= step ? '#fff' : '#94a3b8', zIndex:1, border:i === step ? '3px solid #0B3D91' : 'none', boxSizing:'border-box', transition:'all .3s' }}>
                    {i < step ? '?' : i+1}
                  </div>
                  <span style={{ fontSize:10, marginTop:5, ...P, fontWeight:600, color:i === step ? '#0B3D91' : '#94a3b8', whiteSpace:'nowrap' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ padding:'28px 16px 60px' }}>

        {/* == STEP 0: VEHICLE TYPE == */}
        {step === 0 && (
          <div style={{ maxWidth:560, margin:'0 auto' }}>
            <h2 style={{ ...P, fontWeight:800, fontSize:26, marginBottom:6, textAlign:'center' }}>
              {isCharter ? 'Request Private Hire' : 'How would you like to travel?'}
            </h2>
            <p style={{ textAlign:'center', color:'#64748b', ...I, marginBottom:32 }}>
              {isCharter ? 'Charter a full vehicle for your group or event.' : 'Select your preferred type of vehicle.'}
            </p>

            {!isCharter && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32 }}>
                {/* Matatu option */}
                <button onClick={() => setVehicle('matatu')} style={{ padding:'28px 20px', borderRadius:18, border:`2.5px solid ${vehicle==='matatu'?'#0B3D91':'#E2E8F0'}`, background:vehicle==='matatu'?'#eff6ff':'#fff', cursor:'pointer', textAlign:'left', transition:'all .2s' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:16, color:'#0F1923', marginBottom:6 }}>14-Seater Minivan</div>
                  <div style={{ fontSize:10, ...P, fontWeight:600, color:'#0B3D91', textTransform:'uppercase', letterSpacing:1.2, marginBottom:10 }}>Matatu</div>
                  <p style={{ fontSize:13, color:'#64748b', ...I, lineHeight:1.65, margin:0 }}>Ideal for short to medium distances. Shared service -- departs when full. Affordable and frequent.</p>
                  {vehicle==='matatu' && <div style={{ marginTop:12, width:20, height:20, borderRadius:'50%', background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>}
                </button>

                {/* Coach option */}
                <button onClick={() => setVehicle('coach')} style={{ padding:'28px 20px', borderRadius:18, border:`2.5px solid ${vehicle==='coach'?'#0B3D91':'#E2E8F0'}`, background:vehicle==='coach'?'#eff6ff':'#fff', cursor:'pointer', textAlign:'left', transition:'all .2s' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:16, color:'#0F1923', marginBottom:6 }}>67-Seater Coach</div>
                  <div style={{ fontSize:10, ...P, fontWeight:600, color:'#0B3D91', textTransform:'uppercase', letterSpacing:1.2, marginBottom:10 }}>Intercity Coach</div>
                  <p style={{ fontSize:13, color:'#64748b', ...I, lineHeight:1.65, margin:0 }}>Recommended for longer journeys. Spacious, comfortable, with fixed departure times.</p>
                  {vehicle==='coach' && <div style={{ marginTop:12, width:20, height:20, borderRadius:'50%', background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>}
                </button>
              </div>
            )}

            {/* Route + Date */}
            <div style={{ background:'#fff', borderRadius:18, padding:24, border:'1px solid #E2E8F0', marginBottom:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>From</label>
                  <select value={from} onChange={e=>setFrom(e.target.value)} style={iS}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={lS}>To *</label>
                  <select value={to} onChange={e=>setTo(e.target.value)} style={iS}><option value="">Select...</option>{CITIES.filter(c=>c!==from).map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={lS}>Travel Date</label>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={iS}/></div>
                <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                  <label style={lS}>Booking Type</label>
                  <div style={{ display:'flex', gap:8 }}>
                    {['standard','advance'].map(t => (
                      <button key={t} onClick={()=>setBookingType(t)} style={{ flex:1, padding:'11px 8px', borderRadius:10, border:`1.5px solid ${bookingType===t?'#0B3D91':'#E2E8F0'}`, background:bookingType===t?'#eff6ff':'#fff', ...P, fontWeight:600, fontSize:12, color:bookingType===t?'#0B3D91':'#64748b', cursor:'pointer', textTransform:'capitalize' }}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              {bookingType==='advance' && (
                <div style={{ background:'#fef9c3', borderRadius:12, padding:'12px 14px', fontSize:13, ...P, fontWeight:600, color:'#92400e' }}>
                  Advance booking: pay 20% commitment fee now (approx. UGX {commitFee().toLocaleString()}). Balance due at boarding.
                </div>
              )}
            </div>

            <button onClick={isCharter ? () => navigate('/book?charter=true') : search} style={{ width:'100%', padding:16, borderRadius:14, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:16, border:'none', cursor:'pointer', boxShadow:'0 4px 18px rgba(11,61,145,.3)' }}>
              {isCharter ? 'Request Charter Quote' : 'Search Available Trips'}
            </button>
          </div>
        )}

        {/* == STEP 1: SEARCH RESULTS == */}
        {step === 1 && (
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
              <button onClick={()=>setStep(0)} style={{ background:'none', border:'none', cursor:'pointer', color:'#0B3D91', ...P, fontWeight:700, fontSize:14 }}> Back</button>
              <div>
                <h2 style={{ ...P, fontWeight:800, fontSize:20, margin:0 }}>{from} to {to}</h2>
                <div style={{ fontSize:13, color:'#64748b', ...I }}>{date} . {vehicle==='matatu'?'14-Seater Minivan':'67-Seater Coach'}</div>
              </div>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff', borderRadius:20, border:'1px solid #E2E8F0' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>search</div>
                <h3 style={{ ...P, fontWeight:700, fontSize:20, marginBottom:8 }}>No trips found for this route</h3>
                <p style={{ color:'#64748b', ...I, marginBottom:24, maxWidth:360, margin:'0 auto 24px' }}>
                  Try a different date, or browse all available departures below.
                </p>
                <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:32 }}>
                  <button onClick={()=>setStep(0)} style={{ padding:'11px 22px', borderRadius:20, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>Change Route</button>
                  <button onClick={()=>{ setTo(''); setResults(state.trips.filter(t=>t.status==='APPROVED'&&parseInt(t.seat_type)>(vehicle==='matatu'?14:0))); }} style={{ padding:'11px 22px', borderRadius:20, border:'1.5px solid #0B3D91', color:'#0B3D91', ...P, fontWeight:700, fontSize:14, background:'#fff', cursor:'pointer' }}>Show All Available</button>
                </div>
                {/* Show all approved trips as suggestions */}
                <div style={{ textAlign:'left' }}>
                  <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:12, color:'#64748b' }}>All available departures:</div>
                  {state.trips.filter(t=>t.status==='APPROVED').slice(0,6).map(t=>(
                    <div key={t.id} onClick={()=>{setSelectedTrip(t);setFrom(t.from);setTo(t.to);setStep(2)}} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:12, border:'1px solid #E2E8F0', marginBottom:8, cursor:'pointer', background:'#fff', transition:'all .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#eff6ff'}
                      onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                      <div>
                        <div style={{ ...P, fontWeight:700, fontSize:14 }}>{t.from} to {t.to}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>{t.operator_name} . {t.departs} . {t.seat_type}-seater</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ ...P, fontWeight:800, fontSize:15, color:'#0B3D91' }}>UGX {t.price.toLocaleString()}</div>
                        <div style={{ fontSize:11, color:'#94a3b8', ...I }}>{t.seats_total-t.seats_booked} seats left</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:14 }}>{results.length} trip{results.length!==1?'s':''} found</div>
                {results.map(t => {
                  const left = t.seats_total - t.seats_booked
                  const pct  = Math.round((t.seats_booked/t.seats_total)*100)
                  return (
                    <div key={t.id} style={{ background:'#fff', borderRadius:18, border:'1.5px solid #E2E8F0', padding:20, marginBottom:14, transition:'all .22s', cursor:'pointer' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='#0B3D91';e.currentTarget.style.boxShadow='0 4px 20px rgba(11,61,145,.12)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.boxShadow='none'}}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                            <span style={{ ...P, fontWeight:800, fontSize:17 }}>{t.operator_name}</span>
                            {t.operator_type==='INTERNAL' && <span style={{ background:'#ede9fe', color:'#7c3aed', padding:'2px 9px', borderRadius:10, fontSize:10, ...P, fontWeight:700 }}>Raylane Fleet</span>}
                          </div>
                          <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:8 }}>{t.departs} . {t.seat_type}-seater . {t.boarding_pin?.label||'See boarding details'}</div>
                          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                            {(t.amenities||[]).map(a => <span key={a} style={{ background:'#f0fdf4', color:'#15803d', padding:'3px 9px', borderRadius:8, fontSize:11, ...P, fontWeight:600 }}>{a.toUpperCase()}</span>)}
                          </div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div style={{ ...P, fontWeight:900, fontSize:22, color:'#0B3D91' }}>UGX {t.price.toLocaleString()}</div>
                          <div style={{ fontSize:12, color:'#94a3b8', ...I }}>per seat</div>
                          {bookingType==='advance' && <div style={{ fontSize:11, color:'#d97706', ...P, fontWeight:600 }}>20% = UGX {Math.round(t.price*0.2).toLocaleString()} now</div>}
                        </div>
                      </div>
                      <div style={{ margin:'12px 0' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#64748b', marginBottom:4 }}>
                          <span>{left} seats available</span><span>{pct}% booked</span>
                        </div>
                        <div style={{ height:5, background:'#E2E8F0', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${pct}%`, background:pct>85?'#ef4444':pct>60?'#f59e0b':'#22C55E', borderRadius:3 }}/>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', flexWrap:'wrap' }}>
                        {bookingType==='advance' && (
                          <button onClick={()=>{setSelectedTrip(t);setStep(2);setAdvanceMode(true)}} style={{ padding:'11px 22px', borderRadius:20, border:'1.5px solid #FFC72C', background:'#fff', color:'#92400e', ...P, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                            Reserve (20% Deposit)
                          </button>
                        )}
                        <button onClick={()=>{setSelectedTrip(t);setStep(2)}} style={{ padding:'11px 22px', borderRadius:20, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>
                          Select Seats ->
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* == STEP 2: SELECT SEATS == */}
        {step === 2 && selectedTrip && (
          <div style={{ maxWidth:780, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
              <button onClick={()=>setStep(1)} style={{ background:'none', border:'none', cursor:'pointer', color:'#0B3D91', ...P, fontWeight:700, fontSize:14 }}> Back</button>
              <div style={{ flex:1 }}>
                <h2 style={{ ...P, fontWeight:800, fontSize:20, margin:0 }}>{selectedTrip.from} to {selectedTrip.to} . {selectedTrip.departs}</h2>
                <div style={{ fontSize:13, color:'#64748b', ...I }}>{selectedTrip.operator_name} . UGX {selectedTrip.price.toLocaleString()}/seat</div>
              </div>
              {lockSecs && <LockTimer seconds={lockSecs}/>}
            </div>

            {advanceMode && (
              <div style={{ background:'#fef9c3', border:'1.5px solid #fde68a', borderRadius:14, padding:'12px 16px', marginBottom:16, ...P, fontWeight:600, fontSize:14, color:'#92400e' }}>
                Advance Booking -- pay 20% now (UGX {commitFee().toLocaleString()}). Balance of UGX {(selectedTrip.price - commitFee()).toLocaleString()} at boarding.
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:20, alignItems:'start' }}>
              <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0', overflowX:'auto' }}>
                <div style={{ marginBottom:14 }}><SeatLegend/></div>
                <SeatMap seatType={selectedTrip.seat_type} booked={BOOKED_DEMO} selected={selectedSeats} onToggle={n=>setSelectedSeats(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n])}/>
              </div>
              <div>
                <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0', marginBottom:12 }}>
                  <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:12 }}>Your Selection</div>
                  {selectedSeats.length === 0 ? (
                    <p style={{ color:'#94a3b8', ...I, fontSize:14 }}>Tap seats on the map to select them.</p>
                  ) : (
                    <>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                        {selectedSeats.map(s=><span key={s} style={{ background:'#0B3D91', color:'#fff', padding:'4px 10px', borderRadius:8, ...P, fontWeight:700, fontSize:13 }}>Seat {s}</span>)}
                      </div>
                      <div style={{ borderTop:'1px solid #E2E8F0', paddingTop:12 }}>
                        {!advanceMode && <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, ...I, marginBottom:4 }}><span>Price ? {selectedSeats.length}</span><span>UGX {(selectedTrip.price*selectedSeats.length).toLocaleString()}</span></div>}
                        {advanceMode && <>
                          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, ...I, marginBottom:4 }}><span>Commitment (20%)</span><span>UGX {(Math.round(selectedTrip.price*0.2)*selectedSeats.length).toLocaleString()}</span></div>
                          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#94a3b8', ...I, marginBottom:4 }}><span>Balance at boarding</span><span>UGX {(Math.round(selectedTrip.price*0.8)*selectedSeats.length).toLocaleString()}</span></div>
                        </>}
                        <div style={{ display:'flex', justifyContent:'space-between', ...P, fontWeight:800, fontSize:17, color:'#0B3D91', marginTop:8 }}>
                          <span>Pay Now</span>
                          <span>UGX {(advanceMode?Math.round(selectedTrip.price*0.2):selectedTrip.price)*selectedSeats.length > 0 ? ((advanceMode?Math.round(selectedTrip.price*0.2):selectedTrip.price)*selectedSeats.length).toLocaleString() : 0}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button onClick={()=>{ if(!selectedSeats.length){toast('Select at least one seat','warning');return}; setStep(3) }} disabled={!selectedSeats.length} style={{ width:'100%', padding:'14px', borderRadius:14, background:selectedSeats.length?'#FFC72C':'#E2E8F0', color:selectedSeats.length?'#0B3D91':'#94a3b8', ...P, fontWeight:700, fontSize:15, border:'none', cursor:selectedSeats.length?'pointer':'not-allowed', transition:'all .2s' }}>
                  {advanceMode ? 'Confirm Reserve Seat' : 'Proceed to Payment'} ->
                </button>
              </div>
            </div>
          </div>
        )}

        {/* == STEP 3: PAYMENT == */}
        {step === 3 && (
          <div style={{ maxWidth:520, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
              <button onClick={()=>setStep(2)} style={{ background:'none', border:'none', cursor:'pointer', color:'#0B3D91', ...P, fontWeight:700, fontSize:14 }}> Back</button>
              <h2 style={{ ...P, fontWeight:800, fontSize:22, margin:0 }}>{advanceMode ? 'Pay Commitment Fee' : 'Complete Payment'}</h2>
            </div>

            {/* Order summary */}
            <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0', marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:12, color:'#64748b' }}>Order Summary</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, ...I, marginBottom:6 }}>
                <span>{selectedTrip?.from} to {selectedTrip?.to} . {selectedTrip?.departs}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#64748b', ...I, marginBottom:6 }}>
                <span>Seats: {selectedSeats.join(', ')}</span><span>{selectedSeats.length} seat{selectedSeats.length!==1?'s':''}</span>
              </div>
              {advanceMode && <div style={{ background:'#fef9c3', borderRadius:10, padding:'8px 12px', fontSize:13, ...P, fontWeight:600, color:'#92400e', marginBottom:8 }}>Advance reservation -- 20% commitment fee</div>}
              <div style={{ borderTop:'1px solid #E2E8F0', paddingTop:12, display:'flex', justifyContent:'space-between', ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>
                <span>Total</span><span>UGX {payAmount().toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method */}
            <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0', marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:14 }}>Payment Method</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
                {[['mtn','MTN MoMo'],['airtel','Airtel Money'],['visa','Visa / Card']].map(([id,label])=>(
                  <button key={id} onClick={()=>setPayMethod(id)} style={{ padding:'12px 8px', borderRadius:12, border:`2px solid ${payMethod===id?'#0B3D91':'#E2E8F0'}`, background:payMethod===id?'#eff6ff':'#fff', ...P, fontWeight:700, fontSize:12, color:payMethod===id?'#0B3D91':'#64748b', cursor:'pointer', transition:'all .2s' }}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom:12 }}>
                <label style={lS}>Your Phone Number *</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 0771 234 567" style={iS}/>
              </div>

              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', marginBottom:12 }}>
                <input type="checkbox" checked={diffNum} onChange={e=>setDiffNum(e.target.checked)}/>
                <span style={{ fontSize:13, ...I, color:'#64748b' }}>Pay from a different number</span>
              </label>

              {diffNum && (
                <div style={{ marginBottom:12 }}>
                  <label style={lS}>Payment Number</label>
                  <input value={payPhone} onChange={e=>setPayPhone(e.target.value)} placeholder="Number that will receive the prompt" style={iS}/>
                </div>
              )}

              {payMethod==='visa' && <div style={{ background:'#f8fafc', borderRadius:12, padding:14, fontSize:13, color:'#64748b', ...I }}>Visa payment redirects to our secure 3DS gateway. Your card details are never stored.</div>}
            </div>

            <button onClick={processPayment} disabled={paying} style={{ width:'100%', padding:16, borderRadius:14, background:paying?'#94a3b8':'#FFC72C', color:'#0B3D91', ...P, fontWeight:800, fontSize:16, border:'none', cursor:paying?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:'0 4px 18px rgba(255,199,44,.4)' }}>
              {paying ? (
                <><div style={{ width:18, height:18, border:'3px solid #0B3D91', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }}/> Processing...</>
              ) : `Pay UGX ${payAmount().toLocaleString()} ->`}
            </button>
            <p style={{ textAlign:'center', fontSize:11, color:'#94a3b8', marginTop:10, ...I }}>SSL secured . 256-bit encryption . Instant confirmation</p>
            <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          </div>
        )}

        {/* == STEP 4: TICKET == */}
        {step === 4 && (
          <div style={{ maxWidth:480, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="34" height="34" fill="none" stroke="#15803d" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div style={{ ...P, fontWeight:900, fontSize:32, color:'#FFC72C', marginBottom:4, letterSpacing:-1 }}>Tusimbudde!</div>
            <h2 style={{ ...P, fontWeight:800, fontSize:22, marginBottom:6 }}>{advanceMode ? 'Your seat is reserved' : 'Booking confirmed'}</h2>
            <p style={{ color:'#64748b', ...I, marginBottom:24 }}>{advanceMode ? 'Your seat is reserved. Complete payment at boarding.' : 'Your QR ticket has been sent via SMS. Show it at boarding.'}</p>
            <div style={{ background:'#fff', borderRadius:20, padding:28, border:'1px solid #E2E8F0', marginBottom:24 }}>
              <div style={{ ...P, fontWeight:800, fontSize:13, color:'#64748b', textTransform:'uppercase', letterSpacing:2, marginBottom:6 }}>Booking Reference</div>
              <div style={{ ...P, fontWeight:800, fontSize:22, color:'#0B3D91', marginBottom:16 }}>{ticketId.current}</div>
              {/* QR placeholder */}
              <div style={{ width:120, height:120, background:'#f1f5f9', borderRadius:12, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                  {[[10,10],[40,10],[10,40],[60,10],[70,10],[60,20],[70,20],[60,30],[10,60],[10,70],[20,60],[30,60],[30,70],[40,60],[50,60],[50,70],[50,80],[60,50],[70,50],[80,50],[80,60],[80,70],[70,70]].map(([x,y],i)=>(
                    <rect key={i} x={x} y={y} width="9" height="9" fill="#0B3D91" rx="1"/>
                  ))}
                </svg>
              </div>
              <div style={{ fontSize:13, color:'#64748b', ...I }}>
                <div style={{ marginBottom:4 }}>{selectedTrip?.from} to {selectedTrip?.to}</div>
                <div style={{ marginBottom:4 }}>{selectedTrip?.departs} . Seat{selectedSeats.length!==1?'s':''} {selectedSeats.join(', ')}</div>
                <div style={{ ...P, fontWeight:700, color:'#0B3D91', marginTop:8 }}>{advanceMode ? `Commitment paid: UGX ${payAmount().toLocaleString()}` : `Total paid: UGX ${payAmount().toLocaleString()}`}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={()=>{window.print()}} style={{ padding:'11px 22px', borderRadius:20, border:'1.5px solid #0B3D91', color:'#0B3D91', ...P, fontWeight:700, fontSize:14, background:'#fff', cursor:'pointer' }}>Download Ticket</button>
              <button onClick={()=>navigate('/')} style={{ padding:'11px 22px', borderRadius:20, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}
