import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOperatorStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Modal, Btn, Input, EmptyState } from '../../components/ui/SharedComponents'
import { BusSeat67, TaxiSeat14, SeatLegend } from '../../components/ui/SeatMaps'
import store from '../../store/appStore'

const ACTIVE_OP_ID = 'op-001'
const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const COST_CATEGORIES = ['FUEL','MAINTENANCE','STAFF','INSURANCE','PERMIT','TAX','OTHER']
const P  = { fontFamily:"'Poppins',sans-serif" }
const I  = { fontFamily:"'Inter',sans-serif" }
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }
const fmt = n => 'UGX ' + Number(n).toLocaleString()

/* Module definitions -- no bank loans */
const MODULE_DEFS = [
  { id:'booking_basic',    label:'Booking',    price:0 },
  { id:'parcel_basic',     label:'Parcels',    price:0 },
  { id:'financial_module', label:'Financials', price:100000 },
  { id:'fuel_module',      label:'Fuel',       price:80000 },
  { id:'sacco_module',     label:'Sacco',      price:200000 },
  { id:'analytics_module', label:'Analytics',  price:100000 },
  { id:'hr_module',        label:'Staff/HR',   price:100000 },
  { id:'fleet_module',     label:'Fleet',      price:120000 },
  { id:'cost_center',      label:'Cost Center',price:80000 },
]

/* Demo operational payments for operators */
const DEMO_OP_PAYMENTS = [
  { id:'OPP-001', type:'Rent',      vendor:'Kampala Park Authority', description:'Monthly bus park fee -- Gate 3 slot', amount:450000, due:'2026-06-01', status:'UNPAID', period:'Jun 2026' },
  { id:'OPP-002', type:'Utility',   vendor:'UMEME Ltd',              description:'Electricity -- workshop and office', amount:280000, due:'2026-05-20', status:'UNPAID', period:'May 2026' },
  { id:'OPP-003', type:'Insurance', vendor:'UAP Insurance Uganda',   description:'Fleet insurance -- 2 vehicles Q2',    amount:1200000,due:'2026-05-31', status:'UNPAID', period:'Q2 2026' },
  { id:'OPP-004', type:'Permit',    vendor:'UNRA Uganda',            description:'Road fitness certificates x2',         amount:300000, due:'2026-06-15', status:'UNPAID', period:'2026' },
  { id:'OPP-005', type:'Utility',   vendor:'MTN Business',           description:'Internet -- booking terminal',          amount:180000, due:'2026-05-15', status:'PAID',   period:'May 2026' },
  { id:'OPP-006', type:'Rent',      vendor:'Kampala Park Authority', description:'Monthly bus park fee -- Gate 3',         amount:450000, due:'2026-05-01', status:'PAID',   period:'May 2026' },
]

const PC = { PAID:'#15803d', UNPAID:'#92400e', OVERDUE:'#dc2626' }

/* Sidebar nav -- no bank loans */
const NAV = [
  { id:'dashboard',  label:'Dashboard' },
  { id:'addtrip',    label:'Add Trip' },
  { id:'trips',      label:'My Trips' },
  { id:'seats',      label:'Seat Manager' },
  { id:'bookings',   label:'Bookings' },
  { id:'parcels',    label:'Parcels',      mod:'parcel_basic' },
  { id:'payments',   label:'Payments' },
  { id:'costs',      label:'Cost Center',  mod:'cost_center',     premium:true },
  { id:'financial',  label:'Financial',    mod:'financial_module', premium:true },
  { id:'vendors',    label:'Vendors',      mod:'cost_center',     premium:true },
  { id:'fuel',       label:'Fuel',         mod:'fuel_module',     premium:true },
  { id:'analytics',  label:'Analytics',    mod:'analytics_module', premium:true },
  { id:'hr',         label:'Staff/HR',     mod:'hr_module',       premium:true },
  { id:'fleet',      label:'Fleet',        mod:'fleet_module',    premium:true },
  { id:'alerts',     label:'Alerts',       badge:true },
  { id:'settings',   label:'Settings' },
]

export default function OperatorDashboard() {
  const { state, store:st, op, trips, bookings, costs, vendors, notifications, unreadCount, summary } = useOperatorStore(ACTIVE_OP_ID)
  const [active,   setActive]   = useState('dashboard')
  const [tripForm, setTripForm] = useState({ from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:'' })
  const [costForm, setCostForm] = useState({ category:'FUEL', vendor:'', amount:'', description:'', date:'', trip_id:'' })
  const [vendorForm, setVendorForm] = useState({ name:'', category:'FUEL', contact:'', credit_limit:'' })
  const [parcelForm, setParcelForm] = useState({ type:'Small Parcel', from:'Kampala', to:'', sender_phone:'', recipient_phone:'', recipient_name:'', amount:12000, insured:false, notes:'' })
  const [payments, setPayments] = useState(DEMO_OP_PAYMENTS)
  const [pModal,   setPModal]   = useState(null)
  const [reqModal, setReqModal] = useState(null)
  const [seatTrip, setSeatTrip] = useState(null)
  const [selSeats, setSelSeats] = useState([])
  const toast    = useToast()
  const navigate = useNavigate()

  if (!op) return <div style={{ padding:40, textAlign:'center' }}>Loading...</div>

  const isActive = mod => op.modules?.[mod]?.status === 'ACTIVE'
  const BOOKED_DEMO = [3,7,8,11,14,20,21]

  const submitTrip = e => {
    e.preventDefault()
    if (!tripForm.to || !tripForm.date || !tripForm.price) { toast('Fill required fields','warning'); return }
    const seat_type = tripForm.vehicle.includes('67') ? '67' : '14'
    st.createTrip({ operator_id:op.id, operator_name:op.company_name, plate:tripForm.vehicle.split('--')[0].trim(), from:tripForm.from, to:tripForm.to, date:tripForm.date, departs:tripForm.departs, seat_type, price:parseInt(tripForm.price), seats_total:parseInt(seat_type)||67, seats_booked:0, boarding_pin:op.boarding_pin, notes:tripForm.notes })
    toast('Trip submitted for admin approval', 'success')
    setActive('trips')
    setTripForm({ from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:'' })
  }

  const submitCost = e => {
    e.preventDefault()
    if (!costForm.amount || !costForm.description) { toast('Fill required fields','warning'); return }
    st.addCostEntry({ operator_id:ACTIVE_OP_ID, ...costForm, amount:parseInt(costForm.amount), status:'PAID' })
    toast('Cost entry recorded', 'success')
    setCostForm({ category:'FUEL', vendor:'', amount:'', description:'', date:'', trip_id:'' })
  }

  const submitVendor = e => {
    e.preventDefault()
    if (!vendorForm.name) { toast('Enter vendor name','warning'); return }
    st.addVendor({ operator_id:ACTIVE_OP_ID, ...vendorForm, credit_limit:parseInt(vendorForm.credit_limit)||0, balance_due:0, status:'ACTIVE' })
    toast('Vendor added', 'success')
    setVendorForm({ name:'', category:'FUEL', contact:'', credit_limit:'' })
  }

  const submitParcel = e => {
    e.preventDefault()
    if (!parcelForm.to || !parcelForm.sender_phone) { toast('Fill required fields','warning'); return }
    toast('Parcel booking created -- assigned to next available trip', 'success')
    setParcelForm({ type:'Small Parcel', from:'Kampala', to:'', sender_phone:'', recipient_phone:'', recipient_name:'', amount:12000, insured:false, notes:'' })
  }

  /* Sidebar */
  const Sidebar = () => (
    <div style={{ width:200, background:'#0B3D91', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
      <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,.12)', minHeight:54 }}>
        <div style={{ ...P, fontWeight:700, fontSize:12, color:'#FFC72C', marginBottom:2 }}>{op.company_name}</div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,.6)', ...I }}>{op.merchant_code}</div>
      </div>
      <nav style={{ flex:1, padding:'6px 0' }}>
        {NAV.map(item => {
          if (item.mod && !isActive(item.mod)) {
            return (
              <button key={item.id} onClick={() => setReqModal({ mod:item.id, label:item.label })}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:'none', color:'rgba(255,255,255,.3)', borderLeft:'3px solid transparent', ...P, fontWeight:600, fontSize:11, whiteSpace:'nowrap', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
                <span style={{ flex:1 }}>{item.label}</span>
                <span style={{ fontSize:9, opacity:.7 }}>LOCK</span>
              </button>
            )
          }
          const bc = item.badge ? unreadCount : 0
          return (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,.14)':'none', color:active===item.id?'#FFC72C':'rgba(255,255,255,.78)', borderLeft:`3px solid ${active===item.id?'#FFC72C':'transparent'}`, ...P, fontWeight:600, fontSize:11, whiteSpace:'nowrap', transition:'all .18s', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
              <span style={{ flex:1 }}>{item.label}</span>
              {bc > 0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700 }}>{bc}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
        <button onClick={() => navigate('/')} style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.6)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:10 }}>Back to Site</button>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>
      <Sidebar/>
      <div style={{ flex:1, overflowY:'auto', padding:22 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(14px,2vw,20px)', margin:0 }}>
            {NAV.find(n => n.id === active)?.label || 'Dashboard'}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount > 0 && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:12 }}>{unreadCount} new</span>}
            <div style={{ background:'#fff', borderRadius:10, padding:'6px 12px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 1px 4px rgba(0,0,0,.07)' }}>
              <div style={{ width:26, height:26, borderRadius:7, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFC72C', ...P, fontWeight:800, fontSize:10 }}>{op.company_name[0]}</div>
              <span style={{ ...P, fontWeight:700, fontSize:12 }}>{op.company_name}</span>
            </div>
          </div>
        </div>

        {/* -- DASHBOARD -- */}
        {active === 'dashboard' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard label="Net Revenue"     value={fmt(summary.net_revenue)}  sub="After commission"  bg="#dcfce7" color="#15803d"/>
            <StatCard label="Total Bookings"  value={bookings.length}            sub="This month"        bg="#dbeafe" color="#1d4ed8"/>
            <StatCard label="Live Trips"      value={trips.filter(t=>t.status==='APPROVED').length} sub="Active" bg="#fef9c3" color="#92400e"/>
            <StatCard label="Rating"          value={(op.rating||0) + ' / 5'}   sub={(op.reviews||0)+' reviews'} bg="#f3e8ff" color="#7c3aed"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:14, marginBottom:14 }}>
            <Card>
              <SectionHead title="Today's Trips" action="Add Trip" onAction={() => setActive('addtrip')}/>
              {trips.filter(t=>t.status==='APPROVED').length === 0
                ? <EmptyState title="No approved trips yet" desc="Submit a trip for admin approval"/>
                : trips.filter(t=>t.status==='APPROVED').slice(0,3).map((t,i)=>(
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:i<2?'1px solid #E2E8F0':'' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ ...P, fontWeight:700, fontSize:13 }}>{t.from} to {t.to}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{t.plate} -- {t.departs} -- {t.seats_booked}/{t.seats_total} booked</div>
                      <ProgressBar value={t.seats_booked} max={t.seats_total} height={4}/>
                    </div>
                    <Pill text="LIVE" color="#15803d"/>
                  </div>
                ))
              }
              {trips.filter(t=>t.status==='PENDING_APPROVAL').length > 0 && (
                <div style={{ marginTop:10, background:'#fff3cd', borderRadius:10, padding:'8px 12px', fontSize:12, color:'#92400e', ...P, fontWeight:600 }}>
                  {trips.filter(t=>t.status==='PENDING_APPROVAL').length} trip(s) awaiting admin approval
                </div>
              )}
            </Card>
            <Card>
              <SectionHead title="Cost Snapshot"/>
              <div style={{ ...P, fontWeight:800, fontSize:22, color:'#dc2626', marginBottom:4 }}>{fmt(summary.total_costs||0)}</div>
              <div style={{ fontSize:12, color:'#64748b', ...I, marginBottom:14 }}>Total expenses this period</div>
              {Object.entries(summary.cost_by_category||{}).slice(0,4).map(([cat,amt]) => (
                <div key={cat} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <span style={{ fontSize:12, color:'#64748b', ...I }}>{cat}</span>
                  <span style={{ ...P, fontWeight:600, fontSize:12 }}>{fmt(amt)}</span>
                </div>
              ))}
              <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, color:'#64748b', ...I }}>Net Profit</span>
                <span style={{ ...P, fontWeight:800, fontSize:15, color:(summary.net_profit||0)>=0?'#15803d':'#dc2626' }}>{fmt(Math.abs(summary.net_profit||0))}</span>
              </div>
            </Card>
          </div>
          <Card>
            <SectionHead title="Revenue This Week"/>
            <BarChart data={[30,55,40,80,65,90,75]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} height={80}/>
          </Card>
        </>)}

        {/* -- ADD TRIP -- */}
        {active === 'addtrip' && (
          <Card>
            <Banner type="info">After submitting, Raylane Admin reviews and approves before the trip goes live on the website.</Banner>
            <form onSubmit={submitTrip}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>From</label>
                  <select value={tripForm.from} onChange={e=>setTripForm({...tripForm,from:e.target.value})} style={iS}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>To *</label>
                  <select value={tripForm.to} onChange={e=>setTripForm({...tripForm,to:e.target.value})} style={iS}>
                    <option value="">Select...</option>
                    {CITIES.filter(c=>c!==tripForm.from).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Vehicle Type</label>
                  <select value={tripForm.vehicle} onChange={e=>setTripForm({...tripForm,vehicle:e.target.value})} style={iS}>
                    <option value="">Select...</option>
                    <option value="UAR 901J -- 67-Seater Coach">UAR 901J -- 67-Seater Coach</option>
                    <option value="UAR 902J -- 67-Seater Coach">UAR 902J -- 67-Seater Coach</option>
                  </select>
                </div>
                <div><label style={lS}>Date *</label>
                  <input type="date" value={tripForm.date} onChange={e=>setTripForm({...tripForm,date:e.target.value})} style={iS} min={new Date().toISOString().split('T')[0]}/>
                </div>
                <div><label style={lS}>Departure Time *</label>
                  <input type="time" value={tripForm.departs} onChange={e=>setTripForm({...tripForm,departs:e.target.value})} style={iS}/>
                </div>
                <div><label style={lS}>Price per Seat (UGX) *</label>
                  <input type="number" value={tripForm.price} onChange={e=>setTripForm({...tripForm,price:e.target.value})} placeholder="e.g. 25000" style={iS}/>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={lS}>Notes</label>
                <textarea rows={2} placeholder="Amenities, stops, special instructions..." value={tripForm.notes} onChange={e=>setTripForm({...tripForm,notes:e.target.value})} style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
                <Btn variant="ghost" full onClick={() => setActive('trips')}>Cancel</Btn>
                <Btn variant="gold" full>Submit for Approval</Btn>
              </div>
            </form>
          </Card>
        )}

        {/* -- MY TRIPS -- */}
        {active === 'trips' && (<>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
            <Btn variant="blue" onClick={() => setActive('addtrip')}>+ Add Trip</Btn>
          </div>
          {trips.length === 0 ? <EmptyState title="No trips yet" action="Add Trip" onAction={() => setActive('addtrip')}/> :
            trips.map(t => (
              <Card key={t.id} style={{ marginBottom:12, borderLeft:`4px solid ${t.status==='APPROVED'?'#22c55e':t.status==='PENDING_APPROVAL'?'#FFC72C':'#ef4444'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:8 }}>
                  <div>
                    <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                      <span style={{ ...P, fontWeight:700, fontSize:15 }}>{t.from} to {t.to}</span>
                      <Pill text={t.status.replace(/_/g,' ')} color={t.status==='APPROVED'?'#15803d':t.status==='PENDING_APPROVAL'?'#92400e':'#dc2626'}/>
                    </div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>{t.plate} -- {t.departs} -- {t.date} -- {fmt(t.price)}/seat</div>
                  </div>
                  {t.status === 'APPROVED' && (
                    <Btn size="sm" variant="blue" onClick={() => { setSeatTrip(t); setActive('seats') }}>Manage Seats</Btn>
                  )}
                </div>
                {t.status === 'APPROVED' && <ProgressBar value={t.seats_booked} max={t.seats_total} label={`${t.seats_booked}/${t.seats_total} seats`} showPct/>}
                {t.rejection_reason && <div style={{ marginTop:8, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626' }}>{t.rejection_reason}</div>}
              </Card>
            ))
          }
        </>)}

        {/* -- SEAT MANAGER -- */}
        {active === 'seats' && (<>
          {!seatTrip ? (
            <div>
              <div style={{ color:'#64748b', ...I, marginBottom:14 }}>Select a trip to manage seats:</div>
              {trips.filter(t=>t.status==='APPROVED').map(t => (
                <Card key={t.id} style={{ marginBottom:10, cursor:'pointer' }} onClick={() => setSeatTrip(t)}>
                  <div style={{ ...P, fontWeight:700 }}>{t.from} to {t.to} -- {t.departs}</div>
                  <div style={{ fontSize:12, color:'#64748b', ...I }}>{t.seats_booked}/{t.seats_total} booked</div>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
                <button onClick={() => { setSeatTrip(null); setSelSeats([]) }} style={{ background:'none', border:'none', cursor:'pointer', color:'#0B3D91', ...P, fontWeight:700, fontSize:13 }}>Back</button>
                <h3 style={{ ...P, fontWeight:700, fontSize:16, margin:0 }}>{seatTrip.from} to {seatTrip.to} -- {seatTrip.departs}</h3>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'start' }}>
                <div style={{ background:'#F5F7FA', borderRadius:16, padding:14, overflowX:'auto' }}>
                  <div style={{ marginBottom:12 }}><SeatLegend compact/></div>
                  {parseInt(seatTrip.seat_type) <= 14
                    ? <TaxiSeat14 booked={BOOKED_DEMO} locked={[]} selected={selSeats} onToggle={n => setSelSeats(p => p.includes(n) ? p.filter(x=>x!==n) : [...p,n])}/>
                    : <BusSeat67  booked={BOOKED_DEMO} locked={[]} selected={selSeats} onToggle={n => setSelSeats(p => p.includes(n) ? p.filter(x=>x!==n) : [...p,n])}/>
                  }
                </div>
                <div style={{ minWidth:200 }}>
                  <Card style={{ marginBottom:10 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:8 }}>Selected: {selSeats.length}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
                      {selSeats.map(s => <span key={s} style={{ background:'#FFC72C', color:'#0B3D91', padding:'3px 9px', borderRadius:7, ...P, fontWeight:800, fontSize:12 }}>{s}</span>)}
                    </div>
                    <Btn variant="blue" full size="sm" onClick={() => toast('Seats reserved','success')}>Reserve</Btn>
                    <div style={{ marginTop:8 }}><Btn variant="danger" full size="sm" onClick={() => { setSelSeats([]); toast('Released','warning') }}>Release</Btn></div>
                  </Card>
                  <Card>
                    <ProgressBar value={seatTrip.seats_booked} max={seatTrip.seats_total} showPct label="Capacity"/>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </>)}

        {/* -- BOOKINGS -- */}
        {active === 'bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={bookings.length}/>
            {bookings.length === 0 ? <EmptyState title="No bookings yet"/> : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['ID','Trip','Seat','Method','Amount','Type','Status'].map(h => (
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{bookings.map(b => {
                    const trip = state.trips.find(t => t.id === b.trip_id)
                    return (
                      <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                        onMouseLeave={e=>e.currentTarget.style.background=''}>
                        <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{trip?.from} to {trip?.to}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                        <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(b.amount)}</td>
                        <td style={{ padding:'10px' }}><Pill text={b.booking_type||'STANDARD'} color="#1d4ed8" bg="#dbeafe"/></td>
                        <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status==='CONFIRMED'?'#15803d':'#92400e'}/></td>
                      </tr>
                    )
                  })}</tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* -- PARCELS -- */}
        {active === 'parcels' && (<>
          {/* Send form */}
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="Send New Parcel"/>
            <form onSubmit={submitParcel}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>Parcel Type</label>
                  <select value={parcelForm.type} onChange={e=>setParcelForm({...parcelForm,type:e.target.value})} style={iS}>
                    {['Envelope (UGX 5,000)','Small Parcel (UGX 12,000)','Large Parcel (UGX 20,000)','Heavy Cargo (UGX 30,000+)'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label style={lS}>From</label>
                  <select value={parcelForm.from} onChange={e=>setParcelForm({...parcelForm,from:e.target.value})} style={iS}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>To *</label>
                  <select value={parcelForm.to} onChange={e=>setParcelForm({...parcelForm,to:e.target.value})} style={iS}>
                    <option value="">Select...</option>
                    {CITIES.filter(c=>c!==parcelForm.from).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Sender Phone *</label>
                  <input value={parcelForm.sender_phone} onChange={e=>setParcelForm({...parcelForm,sender_phone:e.target.value})} placeholder="0771 xxx xxx" style={iS}/>
                </div>
                <div><label style={lS}>Recipient Phone</label>
                  <input value={parcelForm.recipient_phone} onChange={e=>setParcelForm({...parcelForm,recipient_phone:e.target.value})} placeholder="0700 xxx xxx" style={iS}/>
                </div>
                <div><label style={lS}>Recipient Name</label>
                  <input value={parcelForm.recipient_name} onChange={e=>setParcelForm({...parcelForm,recipient_name:e.target.value})} placeholder="Full name" style={iS}/>
                </div>
              </div>
              <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:16 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={parcelForm.insured} onChange={e=>setParcelForm({...parcelForm,insured:e.target.checked})}/>
                  <span style={{ fontSize:13, ...P, fontWeight:600 }}>Add Insurance (3% of declared value)</span>
                </label>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={lS}>Notes</label>
                <input value={parcelForm.notes} onChange={e=>setParcelForm({...parcelForm,notes:e.target.value})} placeholder="Fragile, keep upright, etc." style={iS}/>
              </div>
              <Btn variant="blue" full>Create Parcel Booking</Btn>
            </form>
          </Card>

          {/* Existing parcels */}
          <Card>
            <SectionHead title="Active Parcels" count={state.parcels?.filter(p=>p.operator_id===ACTIVE_OP_ID)?.length||0}/>
            {(state.parcels||[]).filter(p=>p.operator_id===ACTIVE_OP_ID).length === 0 ? (
              <EmptyState title="No parcels yet" desc="Create a parcel booking above."/>
            ) : (
              (state.parcels||[]).filter(p=>p.operator_id===ACTIVE_OP_ID).map(p => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>P</div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13 }}>{p.type} -- {p.from} to {p.to}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{p.id} -- {p.created_at}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ ...P, fontWeight:800, fontSize:14, color:'#0B3D91' }}>{fmt(p.amount)}</div>
                    <Pill text={(p.status||'PENDING').replace(/_/g,' ')} color={p.status==='DELIVERED'?'#15803d':p.status==='IN_TRANSIT'?'#1d4ed8':'#92400e'}/>
                  </div>
                </div>
              ))
            )}
          </Card>
        </>)}

        {/* -- PAYMENTS (Utilities, Rent, etc.) -- */}
        {active === 'payments' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
            <StatCard label="Unpaid Bills"  value={payments.filter(p=>p.status==='UNPAID').length}  sub="Due this month" bg="#fef9c3" color="#92400e"/>
            <StatCard label="Overdue"       value={payments.filter(p=>p.status==='OVERDUE').length} sub="Past due date"  bg="#fee2e2" color="#dc2626"/>
            <StatCard label="Total Unpaid"  value={fmt(payments.filter(p=>p.status!=='PAID').reduce((s,p)=>s+p.amount,0))} sub="Outstanding" bg="#dbeafe" color="#1d4ed8"/>
          </div>
          <Banner type="info">This module tracks your operational expenses: park rent, utilities, insurance, permits, and services.</Banner>
          <Card>
            <SectionHead title="Payment Obligations" action="Add Invoice" onAction={() => setPModal('add')}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Type','Vendor','Description','Amount','Due','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom:'1px solid #E2E8F0', background:p.status==='OVERDUE'?'#fff8f8':'' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=p.status==='OVERDUE'?'#fff8f8':''}>
                      <td style={{ padding:'10px' }}><Pill text={p.type} color="#1d4ed8" bg="#dbeafe"/></td>
                      <td style={{ padding:'10px', ...P, fontWeight:600, fontSize:13 }}>{p.vendor}</td>
                      <td style={{ padding:'10px', fontSize:12, color:'#64748b', ...I }}>{p.description}</td>
                      <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:13, color:'#0B3D91' }}>{fmt(p.amount)}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I, color:p.status==='OVERDUE'?'#dc2626':'#0F1923' }}>{p.due}</td>
                      <td style={{ padding:'10px' }}><Pill text={p.status} color={PC[p.status]||'#64748b'}/></td>
                      <td style={{ padding:'10px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          {p.status !== 'PAID' && (
                            <button onClick={() => { setPayments(prev => prev.map(x => x.id===p.id ? {...x,status:'PAID'} : x)); toast(p.vendor + ' marked as paid', 'success') }}
                              style={{ padding:'4px 10px', borderRadius:8, background:'#0B3D91', color:'#fff', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Pay</button>
                          )}
                          <button onClick={() => setPModal(p)}
                            style={{ padding:'4px 10px', borderRadius:8, background:'#F5F7FA', color:'#0B3D91', border:'1px solid #E2E8F0', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                          <button onClick={() => { setPayments(prev => prev.filter(x => x.id!==p.id)); toast('Removed', 'warning') }}
                            style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>)}

        {/* -- COST CENTER -- */}
        {active === 'costs' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            {['FUEL','MAINTENANCE','STAFF','OTHER'].map(cat => {
              const total = costs.filter(c=>c.category===cat).reduce((s,c)=>s+c.amount,0)
              return <StatCard key={cat} label={cat} value={fmt(total)} bg="#F5F7FA" color="#0B3D91"/>
            })}
          </div>
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="Record New Expense"/>
            <form onSubmit={submitCost}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>Category</label>
                  <select value={costForm.category} onChange={e=>setCostForm({...costForm,category:e.target.value})} style={iS}>
                    {COST_CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Vendor</label>
                  <select value={costForm.vendor} onChange={e=>setCostForm({...costForm,vendor:e.target.value})} style={iS}>
                    <option value="">Select...</option>
                    {vendors.map(v=><option key={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Amount (UGX) *</label>
                  <input type="number" value={costForm.amount} onChange={e=>setCostForm({...costForm,amount:e.target.value})} placeholder="e.g. 500000" style={iS}/>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lS}>Description *</label>
                  <input value={costForm.description} onChange={e=>setCostForm({...costForm,description:e.target.value})} placeholder="What was this expense for?" style={iS}/>
                </div>
                <div><label style={lS}>Date</label>
                  <input type="date" value={costForm.date} onChange={e=>setCostForm({...costForm,date:e.target.value})} style={iS}/>
                </div>
                <div><label style={lS}>Link to Trip</label>
                  <select value={costForm.trip_id} onChange={e=>setCostForm({...costForm,trip_id:e.target.value})} style={iS}>
                    <option value="">None (General)</option>
                    {trips.filter(t=>t.status==='APPROVED').map(t=><option key={t.id} value={t.id}>{t.from} to {t.to} {t.departs}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end' }}>
                  <Btn variant="blue" full>Add Expense</Btn>
                </div>
              </div>
            </form>
          </Card>
          <Card>
            <SectionHead title="All Expenses" count={costs.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Date','Category','Vendor','Description','Amount','Status'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{costs.map(c=>(
                  <tr key={c.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'10px', fontSize:12, ...I }}>{c.date}</td>
                    <td style={{ padding:'10px' }}><Pill text={c.category} color="#1d4ed8" bg="#dbeafe"/></td>
                    <td style={{ padding:'10px', fontSize:12, ...I }}>{c.vendor||'--'}</td>
                    <td style={{ padding:'10px', fontSize:13, ...I }}>{c.description}</td>
                    <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(c.amount)}</td>
                    <td style={{ padding:'10px' }}><Pill text={c.status} color={c.status==='PAID'?'#15803d':'#dc2626'}/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>)}

        {/* -- FINANCIAL MODULE -- */}
        {active === 'financial' && (<>
          <Card style={{ background:'#0B3D91', marginBottom:16 }}>
            <div style={{ color:'#fff' }}>
              <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:14, opacity:.8 }}>Profit and Loss Summary</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                {[['Gross Revenue',summary.gross_revenue||0,'#86efac'],['Commission',summary.commission||0,'#fca5a5'],['Total Costs',summary.total_costs||0,'#fca5a5'],['Net Profit',summary.net_profit||0,(summary.net_profit||0)>=0?'#86efac':'#fca5a5']].map(([l,v,c])=>(
                  <div key={l}>
                    <div style={{ fontSize:11, opacity:.7, ...I, marginBottom:4 }}>{l}</div>
                    <div style={{ ...P, fontWeight:800, fontSize:18, color:c }}>{fmt(Math.abs(v))}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <SectionHead title="Financial Reports"/>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[['P&L Statement','Profit and loss for any period'],['Cash Flow','Revenue in vs costs out'],['Trip Profitability','Revenue and cost per route'],['Staff Cost Report','Payroll breakdown by month'],['Vehicle P&L','Revenue minus costs per bus'],['Export CSV','QuickBooks-compatible format']].map(([t,d])=>(
                <button key={t} onClick={() => toast('Generating: ' + t + '...','success')} style={{ background:'#F5F7FA', borderRadius:12, padding:14, border:'1.5px solid #E2E8F0', cursor:'pointer', textAlign:'left', transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#0B3D91';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.transform='none'}}>
                  <div style={{ ...P, fontWeight:700, fontSize:13, marginBottom:4 }}>{t}</div>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>{d}</div>
                </button>
              ))}
            </div>
          </Card>
        </>)}

        {/* -- VENDORS -- */}
        {active === 'vendors' && (<>
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="Add Vendor"/>
            <form onSubmit={submitVendor}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                <div><label style={lS}>Company Name *</label>
                  <input value={vendorForm.name} onChange={e=>setVendorForm({...vendorForm,name:e.target.value})} placeholder="e.g. Total Energies" style={iS}/>
                </div>
                <div><label style={lS}>Category</label>
                  <select value={vendorForm.category} onChange={e=>setVendorForm({...vendorForm,category:e.target.value})} style={iS}>
                    {COST_CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Contact Phone</label>
                  <input value={vendorForm.contact} onChange={e=>setVendorForm({...vendorForm,contact:e.target.value})} placeholder="0771 xxx xxx" style={iS}/>
                </div>
                <div><label style={lS}>Credit Limit (UGX)</label>
                  <input type="number" value={vendorForm.credit_limit} onChange={e=>setVendorForm({...vendorForm,credit_limit:e.target.value})} placeholder="0" style={iS}/>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end' }}>
                  <Btn variant="blue" full>Add Vendor</Btn>
                </div>
              </div>
            </form>
          </Card>
          <Card>
            <SectionHead title="All Vendors" count={vendors.length}/>
            {vendors.length === 0 ? <EmptyState title="No vendors yet" desc="Add fuel stations, garages, and other suppliers."/> :
              vendors.map(v => (
                <div key={v.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13 }}>{v.name}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{v.category} -- {v.contact}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    {v.balance_due > 0 && <div style={{ ...P, fontWeight:700, fontSize:12, color:'#dc2626' }}>Owes: {fmt(v.balance_due)}</div>}
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>Limit: {fmt(v.credit_limit)}</div>
                  </div>
                  <Pill text={v.status} color={v.status==='ACTIVE'?'#15803d':'#dc2626'}/>
                </div>
              ))
            }
          </Card>
        </>)}

        {/* -- ALERTS -- */}
        {active === 'alerts' && (
          <Card>
            <SectionHead title="Notifications" action="Mark all read" onAction={() => { st.markOpRead && st.markOpRead(op.id); toast('All read','success') }}/>
            {notifications.length === 0 ? <EmptyState title="All caught up!"/> :
              notifications.map((n,i) => (
                <div key={n.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom:i<notifications.length-1?'1px solid #E2E8F0':'', background:!n.read?'#f8faff':'' }}>
                  <div style={{ fontSize:16, flexShrink:0, marginTop:2 }}>{n.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:2 }}>{n.msg}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{n.time}</div>
                  </div>
                  {!n.read && <span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:9, ...P, fontWeight:700 }}>NEW</span>}
                </div>
              ))
            }
          </Card>
        )}

        {/* -- SETTINGS -- */}
        {active === 'settings' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Company Profile"/>
              {[['Company Name',op.company_name],['Merchant Code',op.merchant_code],['Phone',op.phone],['Email',op.email],['Fleet Size',op.fleet_size+' vehicles'],['Commission Rate',((op.commission_rate||0)*100)+'%']].map(([l,v])=>(
                <div key={l} style={{ marginBottom:12 }}>
                  <label style={lS}>{l}</label>
                  <input defaultValue={v} style={iS} readOnly={l==='Commission Rate'||l==='Merchant Code'}/>
                </div>
              ))}
              <Btn variant="blue" full onClick={() => toast('Profile saved','success')}>Save Profile</Btn>
            </Card>
            <Card>
              <SectionHead title="Active Modules"/>
              {MODULE_DEFS.map(m => {
                const active_mod = op.modules?.[m.id]?.status === 'ACTIVE'
                return (
                  <div key={m.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ ...P, fontWeight:600, fontSize:13 }}>{m.label}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{m.price ? fmt(m.price)+'/mo' : 'Included free'}</div>
                    </div>
                    <Pill text={active_mod?'Active':'Locked'} color={active_mod?'#15803d':'#9ca3af'}/>
                    {!active_mod && (
                      <button onClick={() => setReqModal({ mod:m.id, label:m.label })} style={{ padding:'4px 10px', borderRadius:10, background:'#dbeafe', color:'#1d4ed8', border:'none', ...P, fontWeight:600, fontSize:10, cursor:'pointer' }}>Request</button>
                    )}
                  </div>
                )
              })}
            </Card>
          </div>
        )}

        {/* Generic locked */}
        {['fuel','analytics','hr','fleet'].includes(active) && (
          <Card style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:44, marginBottom:14 }}>[{active.toUpperCase()}]</div>
            <h3 style={{ ...P, fontWeight:700, fontSize:20, marginBottom:8 }}>{NAV.find(n=>n.id===active)?.label} Module</h3>
            <p style={{ color:'#64748b', maxWidth:380, margin:'0 auto 20px', ...I }}>Connect to the Raylane backend API to load live data for this module.</p>
            <Btn variant="blue" onClick={() => toast('API connection required','success')}>Configure Module</Btn>
          </Card>
        )}
      </div>

      {/* Module request modal */}
      <Modal open={!!reqModal} onClose={() => setReqModal(null)} title={'Request: ' + (reqModal?.label||'')}>
        {reqModal && (<>
          <div style={{ background:'#F5F7FA', borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{reqModal.label}</div>
            <div style={{ ...P, fontWeight:800, fontSize:18, color:'#0B3D91' }}>
              {fmt(MODULE_DEFS.find(m=>m.id===reqModal.mod)?.price||0)}<span style={{ fontSize:12, color:'#64748b', fontWeight:400 }}>/month</span>
            </div>
          </div>
          <Banner type="info">Raylane Admin will contact you to confirm payment and activate within 24 hours.</Banner>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={() => setReqModal(null)}>Cancel</Btn>
            <Btn variant="gold" full onClick={() => { st.requestModuleActivation && st.requestModuleActivation(op.id, reqModal.mod); toast('Request sent to Raylane Admin','success'); setReqModal(null) }}>Send Request</Btn>
          </div>
        </>)}
      </Modal>

      {/* Payment modal */}
      <Modal open={!!pModal} onClose={() => setPModal(null)} title={pModal==='add'?'Add Invoice':'Edit Invoice'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label style={lS}>Type</label>
            <select defaultValue={typeof pModal==='object'?pModal.type:'Utility'} id="ptype" style={iS}>
              {['Utility','Rent','Insurance','Permit','Internet','Cleaning','Other'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={lS}>Vendor</label>
            <select defaultValue={typeof pModal==='object'?pModal.vendor:''} id="pvendor" style={iS}>
              <option value="">Select vendor...</option>
              {['UMEME Ltd','National Water','Kampala Park Authority','MTN Business','UAP Insurance Uganda','UNRA Uganda','CleanPro Uganda'].map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description</label>
            <input defaultValue={typeof pModal==='object'?pModal.description:''} id="pdesc" style={iS} placeholder="Invoice description..."/>
          </div>
          <div><label style={lS}>Amount (UGX)</label>
            <input type="number" defaultValue={typeof pModal==='object'?pModal.amount:''} id="pamount" style={iS}/>
          </div>
          <div><label style={lS}>Due Date</label>
            <input type="date" defaultValue={typeof pModal==='object'?pModal.due:''} id="pdue" style={iS}/>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setPModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            const amount = parseInt(document.getElementById('pamount')?.value||0)
            if (pModal === 'add') {
              setPayments(p => [...p, { id:'OPP-'+Date.now(), type:document.getElementById('ptype')?.value||'Utility', vendor:document.getElementById('pvendor')?.value||'', description:document.getElementById('pdesc')?.value||'', amount, due:document.getElementById('pdue')?.value||'', status:'UNPAID', period:'Current' }])
              toast('Invoice added','success')
            } else {
              setPayments(p => p.map(x => x.id===pModal.id ? {...x, amount, description:document.getElementById('pdesc')?.value||x.description} : x))
              toast('Invoice updated','success')
            }
            setPModal(null)
          }}>{pModal==='add'?'Add Invoice':'Save Changes'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
