import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOperatorStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Modal, Btn, Input, EmptyState } from '../../components/ui/SharedComponents'
import { BusSeat55, BusSeat65, BusSeat67, TaxiSeat14, SeatLegend } from '../../components/ui/SeatMaps'
import store from '../../store/appStore'

const ACTIVE_OP_ID = 'op-001'
const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const VEHICLES_MOCK = ['UBF 234K – 55-Seater','UAR 512B – 67-Seater','UAK 890C – 65-Seater','UBJ 110X – 14-Seater Taxi']
const COST_CATEGORIES = ['FUEL','MAINTENANCE','STAFF','INSURANCE','PERMIT','LOAN','OTHER']

const ML = { 'booking_basic':'Booking','parcel_basic':'Parcels','financial_module':'Financials','fuel_module':'Fuel','loan_tracking':'Bank Loans','sacco_module':'Sacco','analytics_module':'Analytics','hr_module':'Staff/HR','fleet_module':'Fleet','cost_center':'Cost Center' }
const MI = { 'booking_basic':'🎫','parcel_basic':'📦','financial_module':'💰','fuel_module':'⛽','loan_tracking':'🏦','sacco_module':'🏛️','analytics_module':'📊','hr_module':'👥','fleet_module':'🔧','cost_center':'📑' }
const MP = { 'financial_module':100000,'fuel_module':80000,'loan_tracking':150000,'sacco_module':200000,'analytics_module':100000,'hr_module':100000,'fleet_module':120000,'cost_center':80000 }
const fmt = n => 'UGX ' + Number(n).toLocaleString()
const P = { fontFamily:"'Poppins',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const NAV_ITEMS = [
  { id:'dashboard',  icon:'📊', label:'Dashboard' },
  { id:'addtrip',    icon:'➕', label:'Add Trip' },
  { id:'trips',      icon:'🚌', label:'My Trips' },
  { id:'seats',      icon:'💺', label:'Seat Manager' },
  { id:'bookings',   icon:'🎫', label:'Bookings' },
  { id:'parcels',    icon:'📦', label:'Parcels',      mod:'parcel_basic' },
  { id:'payments',   icon:'💳', label:'Payments' },
  { id:'costs',      icon:'📑', label:'Cost Center',  mod:'cost_center',     premium:true },
  { id:'financial',  icon:'💰', label:'Financial',    mod:'financial_module', premium:true },
  { id:'vendors',    icon:'🤝', label:'Vendors',      mod:'cost_center',     premium:true },
  { id:'fuel',       icon:'⛽', label:'Fuel',         mod:'fuel_module',     premium:true },
  { id:'loans',      icon:'🏦', label:'Bank Loans',   mod:'loan_tracking',   premium:true },
  { id:'sacco',      icon:'🏛️', label:'Sacco',        mod:'sacco_module',    premium:true },
  { id:'analytics',  icon:'📈', label:'Analytics',    mod:'analytics_module', premium:true },
  { id:'hr',         icon:'👥', label:'Staff/HR',     mod:'hr_module',       premium:true },
  { id:'fleet',      icon:'🔧', label:'Fleet',        mod:'fleet_module',    premium:true },
  { id:'alerts',     icon:'🔔', label:'Alerts',       badge:true },
  { id:'settings',   icon:'⚙️', label:'Settings' },
]

export default function OperatorDashboard() {
  const { state, store: st, op, trips, bookings, notifications, unreadCount } = useOperatorStore(ACTIVE_OP_ID)
  const [active, setActive]   = useState('dashboard')
  const [tripForm, setTripForm] = useState({ from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:'' })
  const [costForm, setCostForm] = useState({ category:'FUEL', vendor:'', amount:'', description:'', date:'', trip_id:'' })
  const [vendorForm, setVendorForm] = useState({ name:'', category:'FUEL', contact:'', credit_limit:'' })
  const [reqModal, setReqModal] = useState(null)
  const [selectedSeatTrip, setSelectedSeatTrip] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const toast = useToast()
  const navigate = useNavigate()

  if (!op) return <div style={{ padding:40, textAlign:'center' }}>Loading…</div>

  const isActive = mod => op.modules[mod]?.status === 'ACTIVE'
  const costs   = state.cost_entries.filter(c => c.operator_id === ACTIVE_OP_ID)
  const vendors = state.vendors.filter(v => v.operator_id === ACTIVE_OP_ID)
  const summary = store.getFinancialSummary(ACTIVE_OP_ID)
  const BOOKED_DEMO = [3,7,8,11,14,20,21]

  const submitTrip = e => {
    e.preventDefault()
    if (!tripForm.to || !tripForm.date || !tripForm.price) { toast('Fill required fields','warning'); return }
    const seat_type = tripForm.vehicle.includes('67')?'67':tripForm.vehicle.includes('65')?'65':tripForm.vehicle.includes('55')?'55':'14'
    st.createTrip({ operator_id:op.id, operator_name:op.company_name, plate:tripForm.vehicle.split('–')[0].trim(), from:tripForm.from, to:tripForm.to, date:tripForm.date, departs:tripForm.departs, seat_type, price:parseInt(tripForm.price), seats_total:parseInt(seat_type)||55, seats_booked:0, boarding_pin:op.boarding_pin, notes:tripForm.notes })
    toast('✅ Trip submitted for admin approval','success')
    setActive('trips')
    setTripForm({ from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:'' })
  }

  const submitCost = e => {
    e.preventDefault()
    if (!costForm.amount || !costForm.description) { toast('Fill required fields','warning'); return }
    st.addCostEntry({ operator_id:ACTIVE_OP_ID, ...costForm, amount:parseInt(costForm.amount), status:'PAID' })
    toast('✅ Cost entry recorded','success')
    setCostForm({ category:'FUEL', vendor:'', amount:'', description:'', date:'', trip_id:'' })
  }

  const submitVendor = e => {
    e.preventDefault()
    if (!vendorForm.name) { toast('Enter vendor name','warning'); return }
    st.addVendor({ operator_id:ACTIVE_OP_ID, ...vendorForm, credit_limit:parseInt(vendorForm.credit_limit)||0, balance_due:0, status:'ACTIVE' })
    toast('✅ Vendor added','success')
    setVendorForm({ name:'', category:'FUEL', contact:'', credit_limit:'' })
  }

  const inS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, ...I, background:'#fff', boxSizing:'border-box', outline:'none', WebkitAppearance:'none', color:'#0F1923' }
  const lS  = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', ...P, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

  /* ── SIDEBAR ── */
  const Sidebar = () => (
    <div className="dash-sidebar" style={{ width:208, background:'#0B3D91', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
      <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,.12)', minHeight:54 }}>
        <div style={{ ...P, fontWeight:700, fontSize:12, color:'#FFC72C', marginBottom:2 }}>{op.company_name}</div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,.6)', ...I }}>{op.merchant_code} · {op.operator_type==='INTERNAL'?'Raylane Fleet':'External'}</div>
      </div>
      <nav style={{ flex:1, padding:'6px 0', display:'flex', flexDirection:'column' }}>
        {NAV_ITEMS.map(item => {
          if (item.mod && !isActive(item.mod)) {
            return (
              <button key={item.id} onClick={() => setReqModal({ mod:item.mod })} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:'none', color:'rgba(255,255,255,.3)', borderLeft:'3px solid transparent', ...P, fontWeight:600, fontSize:11, whiteSpace:'nowrap', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
                <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
                <span style={{ flex:1 }}>{item.label}</span>
                <span style={{ fontSize:9, opacity:.7, flexShrink:0 }}>🔒</span>
              </button>
            )
          }
          const badge = item.badge ? unreadCount : 0
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,.14)':'none', color:active===item.id?'#FFC72C':'rgba(255,255,255,.78)', borderLeft:`3px solid ${active===item.id?'#FFC72C':'transparent'}`, ...P, fontWeight:600, fontSize:11, whiteSpace:'nowrap', transition:'all .18s', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
              <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {badge>0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700, flexShrink:0 }}>{badge}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
        <button onClick={() => navigate('/')} style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.6)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:10 }}>← Back to Site</button>
      </div>
    </div>
  )

  return (
    <div className="dash-wrap" style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>
      <Sidebar />
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:22 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(15px,2vw,20px)', margin:0 }}>
            {NAV_ITEMS.find(n=>n.id===active)?.icon||'📊'} {active==='dashboard'?'Operator Dashboard':NAV_ITEMS.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount>0 && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:12 }}>🔔 {unreadCount}</span>}
            <div style={{ background:'#fff', borderRadius:10, padding:'6px 12px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 1px 4px rgba(0,0,0,.07)' }}>
              <div style={{ width:26, height:26, borderRadius:7, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', ...P, fontWeight:800, fontSize:10, flexShrink:0 }}>{op.company_name[0]}</div>
              <span className="hide-mobile" style={{ ...P, fontWeight:700, fontSize:12 }}>{op.company_name}</span>
            </div>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {active==='dashboard' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard icon="💰" label="Revenue This Month" value={fmt(summary.net_revenue)} sub="After commission" bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🎫" label="Total Bookings"      value={bookings.length} sub="This month" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="🚌" label="Live Trips"          value={trips.filter(t=>t.status==='APPROVED').length} sub="Active" bg="#fef9c3" color="#92400e"/>
            <StatCard icon="⭐" label="Operator Rating"     value={op.rating+' ★'} sub={op.reviews+' reviews'} bg="#f3e8ff" color="#7c3aed"/>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:14, marginBottom:14 }}>
            <Card>
              <SectionHead title="Today's Trips" action="+ Add Trip" onAction={() => setActive('addtrip')}/>
              {trips.filter(t=>t.status==='APPROVED').length===0
                ? <EmptyState icon="🚌" title="No approved trips yet" desc="Submit a trip for admin approval." action="Add Trip" onAction={() => setActive('addtrip')}/>
                : trips.filter(t=>t.status==='APPROVED').slice(0,3).map((t,i)=>(
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:i<2?'1px solid #E2E8F0':'' }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:'rgba(11,61,145,.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🚌</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ ...P, fontWeight:600, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.from} → {t.to}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{t.plate} · {t.departs} · {t.seats_booked}/{t.seats_total} booked</div>
                      <ProgressBar value={t.seats_booked} max={t.seats_total} height={4}/>
                    </div>
                    <Pill text="LIVE" color="#15803d"/>
                  </div>
                ))}
              {trips.filter(t=>t.status==='PENDING_APPROVAL').length>0 && <div style={{ marginTop:10, background:'#fff3cd', borderRadius:10, padding:'8px 12px', fontSize:12, color:'#92400e', ...P, fontWeight:600 }}>⏳ {trips.filter(t=>t.status==='PENDING_APPROVAL').length} trip(s) awaiting admin approval</div>}
            </Card>
            <Card>
              <SectionHead title="Cost Snapshot"/>
              <div style={{ ...P, fontWeight:800, fontSize:22, color:'#dc2626', marginBottom:4 }}>{fmt(summary.total_costs)}</div>
              <div style={{ fontSize:12, color:'#64748b', ...I, marginBottom:12 }}>Total expenses this period</div>
              {Object.entries(summary.cost_by_category||{}).slice(0,4).map(([cat,amt])=>(
                <div key={cat} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #E2E8F0', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'#64748b', ...I }}>{cat}</span>
                  <span style={{ ...P, fontWeight:600, fontSize:12 }}>{fmt(amt)}</span>
                </div>
              ))}
              <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, color:'#64748b', ...I }}>Net Profit</span>
                <span style={{ ...P, fontWeight:800, fontSize:15, color:summary.net_profit>=0?'#15803d':'#dc2626' }}>{fmt(Math.abs(summary.net_profit))}</span>
              </div>
            </Card>
          </div>

          <Card>
            <SectionHead title="Revenue This Week"/>
            <BarChart data={[30,55,40,80,65,90,75]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} height={80} highlightLast/>
          </Card>
        </>)}

        {/* ── ADD TRIP ── */}
        {active==='addtrip' && (
          <Card>
            <Banner type="info">After submitting, <strong>Raylane Admin</strong> reviews and approves before it goes live. Raylane internal fleet trips are auto-approved.</Banner>
            <form onSubmit={submitTrip}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>From</label><select value={tripForm.from} onChange={e=>setTripForm({...tripForm,from:e.target.value})} style={inS}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={lS}>To *</label><select value={tripForm.to} onChange={e=>setTripForm({...tripForm,to:e.target.value})} style={inS}><option value="">Select…</option>{CITIES.filter(c=>c!==tripForm.from).map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={lS}>Vehicle *</label><select value={tripForm.vehicle} onChange={e=>setTripForm({...tripForm,vehicle:e.target.value})} style={inS}><option value="">Select…</option>{VEHICLES_MOCK.map(v=><option key={v}>{v}</option>)}</select></div>
                <div><label style={lS}>Date *</label><input type="date" value={tripForm.date} onChange={e=>setTripForm({...tripForm,date:e.target.value})} style={inS} min={new Date().toISOString().split('T')[0]}/></div>
                <div><label style={lS}>Departure Time *</label><input type="time" value={tripForm.departs} onChange={e=>setTripForm({...tripForm,departs:e.target.value})} style={inS}/></div>
                <div><label style={lS}>Price (UGX) *</label><input type="number" value={tripForm.price} onChange={e=>setTripForm({...tripForm,price:e.target.value})} placeholder="e.g. 25000" style={inS}/></div>
              </div>
              <div style={{ marginBottom:16 }}><label style={lS}>Notes</label><textarea rows={2} placeholder="Amenities, stops…" value={tripForm.notes} onChange={e=>setTripForm({...tripForm,notes:e.target.value})} style={{ ...inS, resize:'none', lineHeight:1.6 }}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
                <Btn variant="ghost" full onClick={() => setActive('trips')}>Cancel</Btn>
                <Btn variant="gold" full>🚀 Submit for Approval</Btn>
              </div>
            </form>
          </Card>
        )}

        {/* ── MY TRIPS ── */}
        {active==='trips' && (<>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}><Btn variant="blue" icon="➕" onClick={() => setActive('addtrip')}>Add Trip</Btn></div>
          {trips.length===0
            ? <EmptyState icon="🚌" title="No trips yet" action="Add Trip" onAction={() => setActive('addtrip')}/>
            : trips.map(t=>(
              <Card key={t.id} style={{ marginBottom:12, borderLeft:`4px solid ${t.status==='APPROVED'?'#22c55e':t.status==='PENDING_APPROVAL'?'#FFC72C':'#ef4444'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:8 }}>
                  <div>
                    <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                      <span style={{ ...P, fontWeight:700, fontSize:15 }}>{t.from} → {t.to}</span>
                      <Pill text={t.status.replace(/_/g,' ')} color={t.status==='APPROVED'?'#15803d':t.status==='PENDING_APPROVAL'?'#92400e':'#dc2626'}/>
                    </div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>{t.plate||'—'} · {t.departs} · {t.date} · {t.seat_type}-seater · {fmt(t.price)}/seat</div>
                    {t.rejection_reason && <div style={{ marginTop:6, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626' }}>❌ {t.rejection_reason}</div>}
                  </div>
                  {t.status==='APPROVED' && <Btn size="sm" variant="blue" onClick={() => { setSelectedSeatTrip(t); setActive('seats') }}>Manage Seats</Btn>}
                </div>
                {t.status==='APPROVED' && <ProgressBar value={t.seats_booked} max={t.seats_total} label={`${t.seats_booked}/${t.seats_total} seats`} showPct/>}
              </Card>
            ))}
        </>)}

        {/* ── SEAT MANAGER ── */}
        {active==='seats' && (
          selectedSeatTrip ? (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
                <button onClick={()=>{setSelectedSeatTrip(null);setSelectedSeats([])}} style={{ background:'none', border:'none', cursor:'pointer', color:'#0B3D91', ...P, fontWeight:700, fontSize:13 }}>← Back</button>
                <h3 style={{ ...P, fontWeight:700, fontSize:16, margin:0 }}>{selectedSeatTrip.from}→{selectedSeatTrip.to} · {selectedSeatTrip.departs}</h3>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'start' }}>
                <div style={{ background:'#F5F7FA', borderRadius:16, padding:14, overflowX:'auto' }}>
                  <div style={{ marginBottom:12 }}><SeatLegend compact/></div>
                  {React.createElement(
                    {55:BusSeat55,65:BusSeat65,67:BusSeat67,14:TaxiSeat14}[selectedSeatTrip.seat_type]||BusSeat55,
                    { booked:BOOKED_DEMO, locked:[], selected:selectedSeats, onToggle:(n)=>setSelectedSeats(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n]) }
                  )}
                </div>
                <div style={{ minWidth:200 }}>
                  <Card style={{ marginBottom:10 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:8 }}>Selected: {selectedSeats.length}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
                      {selectedSeats.map(s=><span key={s} style={{ background:'#FFC72C', color:'#0B3D91', padding:'3px 9px', borderRadius:7, ...P, fontWeight:800, fontSize:12 }}>{s}</span>)}
                    </div>
                    <Btn variant="blue" full size="sm" onClick={() => toast('Seats marked as reserved','success')}>Reserve</Btn>
                    <div style={{ marginTop:8 }}><Btn variant="danger" full size="sm" onClick={() => { setSelectedSeats([]); toast('Released','warning') }}>Release</Btn></div>
                  </Card>
                  <Card><ProgressBar value={selectedSeatTrip.seats_booked} max={selectedSeatTrip.seats_total} showPct label="Capacity"/></Card>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ ...I, color:'#64748b', marginBottom:14 }}>Select a trip:</div>
              {trips.filter(t=>t.status==='APPROVED').map(t=>(
                <Card key={t.id} style={{ marginBottom:10, cursor:'pointer' }} onClick={() => setSelectedSeatTrip(t)}>
                  <div style={{ ...P, fontWeight:700 }}>{t.from}→{t.to} · {t.departs}</div>
                  <div style={{ fontSize:12, color:'#64748b', ...I }}>{t.seats_booked}/{t.seats_total} booked</div>
                </Card>
              ))}
            </div>
          )
        )}

        {/* ── BOOKINGS ── */}
        {active==='bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={bookings.length}/>
            {bookings.length===0 ? <EmptyState icon="🎫" title="No bookings yet"/> : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['ID','Trip','Seat','Method','Amount','Type','Status'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{bookings.map((b,i)=>{
                    const trip=state.trips.find(t=>t.id===b.trip_id)
                    return(
                      <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                        onMouseLeave={e=>e.currentTarget.style.background=''}>
                        <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{trip?.from}→{trip?.to}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                        <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(b.amount)}</td>
                        <td style={{ padding:'10px' }}><Pill text={b.booking_type} color={b.booking_type==='ADVANCE'?'#7c3aed':'#1d4ed8'} bg={b.booking_type==='ADVANCE'?'#ede9fe':'#dbeafe'}/></td>
                        <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status==='CONFIRMED'?'#15803d':'#92400e'}/></td>
                      </tr>
                    )
                  })}</tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* ── COST CENTER ── */}
        {active==='costs' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            {Object.entries({ FUEL:'⛽', MAINTENANCE:'🔧', STAFF:'👥', OTHER:'📄' }).map(([cat,icon])=>{
              const total = costs.filter(c=>c.category===cat).reduce((s,c)=>s+c.amount,0)
              return <StatCard key={cat} icon={icon} label={cat} value={fmt(total)} bg="#F5F7FA" color="#0B3D91"/>
            })}
          </div>

          {/* Add cost form */}
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="Record New Expense"/>
            <form onSubmit={submitCost}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>Category</label><select value={costForm.category} onChange={e=>setCostForm({...costForm,category:e.target.value})} style={inS}>{COST_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={lS}>Vendor</label><select value={costForm.vendor} onChange={e=>setCostForm({...costForm,vendor:e.target.value})} style={inS}><option value="">Select or type…</option>{vendors.map(v=><option key={v.id}>{v.name}</option>)}</select></div>
                <div><label style={lS}>Amount (UGX) *</label><input type="number" value={costForm.amount} onChange={e=>setCostForm({...costForm,amount:e.target.value})} placeholder="e.g. 500000" style={inS}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description *</label><input value={costForm.description} onChange={e=>setCostForm({...costForm,description:e.target.value})} placeholder="What was this expense for?" style={inS}/></div>
                <div><label style={lS}>Date</label><input type="date" value={costForm.date} onChange={e=>setCostForm({...costForm,date:e.target.value})} style={inS}/></div>
                <div><label style={lS}>Link to Trip</label><select value={costForm.trip_id} onChange={e=>setCostForm({...costForm,trip_id:e.target.value})} style={inS}><option value="">None (General)</option>{trips.filter(t=>t.status==='APPROVED').map(t=><option key={t.id} value={t.id}>{t.from}→{t.to} {t.departs}</option>)}</select></div>
                <div style={{ display:'flex', alignItems:'flex-end' }}><Btn variant="blue" full>Add Expense</Btn></div>
              </div>
            </form>
          </Card>

          {/* Cost list */}
          <Card>
            <SectionHead title="All Expenses" count={costs.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Date','Category','Vendor','Description','Amount','Status'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{costs.map((c,i)=>(
                  <tr key={c.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'10px', fontSize:12, ...I, whiteSpace:'nowrap' }}>{c.date}</td>
                    <td style={{ padding:'10px' }}><Pill text={c.category} color="#1d4ed8" bg="#dbeafe"/></td>
                    <td style={{ padding:'10px', fontSize:12, ...I }}>{c.vendor||'—'}</td>
                    <td style={{ padding:'10px', fontSize:13, ...I }}>{c.description}</td>
                    <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:13 }}>{fmt(c.amount)}</td>
                    <td style={{ padding:'10px' }}><Pill text={c.status} color={c.status==='PAID'?'#15803d':c.status==='OVERDUE'?'#dc2626':'#92400e'}/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>)}

        {/* ── FINANCIAL MODULE ── */}
        {active==='financial' && (<>
          {/* P&L Summary */}
          <Card style={{ background:'#0B3D91', marginBottom:16 }}>
            <div style={{ color:'#fff' }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:14, opacity:.8 }}>Profit & Loss Summary — May 2026</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                {[['Gross Revenue',summary.gross_revenue,'#86efac'],['Commission (8%)',summary.commission,'#fca5a5'],['Total Costs',summary.total_costs,'#fca5a5'],['Net Profit',summary.net_profit,summary.net_profit>=0?'#86efac':'#fca5a5']].map(([l,v,c])=>(
                  <div key={l}>
                    <div style={{ fontSize:11, opacity:.7, ...I, marginBottom:4 }}>{l}</div>
                    <div style={{ ...P, fontWeight:800, fontSize:18, color:c }}>{fmt(Math.abs(v))}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <Card>
              <SectionHead title="Revenue Breakdown"/>
              {trips.filter(t=>t.status==='APPROVED').map(t=>{
                const tBookings = bookings.filter(b=>b.trip_id===t.id&&b.status==='CONFIRMED')
                const rev = tBookings.reduce((s,b)=>s+b.amount,0)
                if (rev===0) return null
                return(
                  <div key={t.id} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #E2E8F0', alignItems:'center' }}>
                    <div>
                      <div style={{ ...P, fontWeight:600, fontSize:13 }}>{t.from}→{t.to} · {t.departs}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{tBookings.length} bookings</div>
                    </div>
                    <span style={{ ...P, fontWeight:700, color:'#15803d' }}>{fmt(rev)}</span>
                  </div>
                )
              })}
            </Card>
            <Card>
              <SectionHead title="Expense Breakdown"/>
              <BarChart data={Object.values(summary.cost_by_category||{}).slice(0,6)} labels={Object.keys(summary.cost_by_category||{}).slice(0,6)} height={120}/>
            </Card>
          </div>

          {/* Financial statements buttons */}
          <Card>
            <SectionHead title="Financial Reports"/>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[['📊 P&L Statement','Generate profit & loss for any period'],['📋 Balance Sheet','Assets, liabilities, equity snapshot'],['💸 Cash Flow','Revenue in vs. costs out'],['📦 Trip Profitability','Revenue and cost per route/trip'],['👥 Staff Cost Report','Payroll breakdown by month'],['📤 Export to CSV','For Excel or QuickBooks import']].map(([t,d])=>(
                <button key={t} onClick={() => toast(`Generating: ${t}…`,'success')} style={{ background:'#F5F7FA', borderRadius:12, padding:'14px', border:'1.5px solid #E2E8F0', cursor:'pointer', textAlign:'left', transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#0B3D91';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.transform='none'}}>
                  <div style={{ ...P, fontWeight:700, fontSize:13, marginBottom:4 }}>{t}</div>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>{d}</div>
                </button>
              ))}
            </div>
            <Banner type="info" style={{ marginTop:14 }}>Export data is compatible with QuickBooks Online CSV import format. Use the Export button to get your full ledger.</Banner>
          </Card>
        </>)}

        {/* ── VENDORS ── */}
        {active==='vendors' && (<>
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="Add Vendor"/>
            <form onSubmit={submitVendor}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                <div><label style={lS}>Company Name *</label><input value={vendorForm.name} onChange={e=>setVendorForm({...vendorForm,name:e.target.value})} placeholder="e.g. Total Energies" style={inS}/></div>
                <div><label style={lS}>Category</label><select value={vendorForm.category} onChange={e=>setVendorForm({...vendorForm,category:e.target.value})} style={inS}>{COST_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={lS}>Contact Phone</label><input value={vendorForm.contact} onChange={e=>setVendorForm({...vendorForm,contact:e.target.value})} placeholder="0771-xxx-xxx" style={inS}/></div>
                <div><label style={lS}>Credit Limit (UGX)</label><input type="number" value={vendorForm.credit_limit} onChange={e=>setVendorForm({...vendorForm,credit_limit:e.target.value})} placeholder="0" style={inS}/></div>
                <div style={{ display:'flex', alignItems:'flex-end' }}><Btn variant="blue" full>Add Vendor</Btn></div>
              </div>
            </form>
          </Card>
          <Card>
            <SectionHead title="All Vendors" count={vendors.length}/>
            {vendors.length===0 ? <EmptyState icon="🤝" title="No vendors yet" desc="Add fuel stations, garages, and other suppliers."/> : (
              vendors.map(v=>(
                <div key={v.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🏢</div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13 }}>{v.name}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{v.category} · {v.contact}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    {v.balance_due>0&&<div style={{ ...P, fontWeight:700, fontSize:12, color:'#dc2626' }}>Owes: {fmt(v.balance_due)}</div>}
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>Limit: {fmt(v.credit_limit)}</div>
                  </div>
                  <Pill text={v.status} color={v.status==='ACTIVE'?'#15803d':'#dc2626'}/>
                </div>
              ))
            )}
          </Card>
        </>)}

        {/* ── ALERTS ── */}
        {active==='alerts' && (
          <Card>
            <SectionHead title="🔔 Notifications" action="Mark all read" onAction={() => { st.markOpRead(op.id); toast('All marked read','success') }}/>
            {notifications.length===0
              ? <EmptyState icon="🔔" title="All caught up!"/>
              : notifications.map((n,i)=>(
                <div key={n.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom:i<notifications.length-1?'1px solid #E2E8F0':'', background:!n.read?'#eff6ff':'' }}>
                  <span style={{ fontSize:17, flexShrink:0, marginTop:2 }}>{n.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:2 }}>{n.msg}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{n.time}</div>
                  </div>
                  {!n.read && <span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:9, ...P, fontWeight:700 }}>NEW</span>}
                </div>
              ))}
          </Card>
        )}

        {/* ── SETTINGS ── */}
        {active==='settings' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Company Profile"/>
              {[['Company Name',op.company_name],['Merchant MoMo Code',op.merchant_code],['Phone',op.phone],['Email',op.email],['Fleet Size',op.fleet_size+' vehicles'],['Commission Rate',(op.commission_rate*100)+'%']].map(([l,v])=>(
                <div key={l} style={{ marginBottom:12 }}>
                  <label style={lS}>{l}</label>
                  <input defaultValue={v} style={inS} readOnly={l==='Commission Rate'||l==='Merchant MoMo Code'}/>
                </div>
              ))}
              <Btn variant="blue" full onClick={() => toast('Profile saved','success')}>Save Profile</Btn>
            </Card>
            <Card>
              <SectionHead title="Active Modules"/>
              {Object.entries(op.modules||{}).map(([k,v])=>(
                <div key={k} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <span style={{ fontSize:16 }}>{MI[k]}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13 }}>{ML[k]}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{MP[k]?fmt(MP[k])+'/mo':'Included free'}</div>
                  </div>
                  <Pill text={v.status} color={v.status==='ACTIVE'?'#15803d':'#9ca3af'}/>
                  {v.status==='INACTIVE' && <button onClick={() => setReqModal({mod:k})} style={{ padding:'4px 10px', borderRadius:10, background:'#dbeafe', color:'#1d4ed8', border:'none', ...P, fontWeight:600, fontSize:10, cursor:'pointer' }}>Request</button>}
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Generic locked placeholder */}
        {['fuel','loans','hr','analytics','fleet','sacco'].includes(active) && (
          <Card style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:52, marginBottom:14 }}>{NAV_ITEMS.find(n=>n.id===active)?.icon}</div>
            <h3 style={{ ...P, fontWeight:700, fontSize:20, marginBottom:8 }}>{NAV_ITEMS.find(n=>n.id===active)?.label} Module — Active</h3>
            <p style={{ color:'#64748b', maxWidth:380, margin:'0 auto 20px', ...I }}>Connect to the Raylane backend API to load live data for this module.</p>
            <Btn variant="blue" onClick={() => toast('API connection required','success')}>Configure Module</Btn>
          </Card>
        )}

        {active==='parcels' && (
          <Card>
            <SectionHead title="Parcels" count={state.parcels.filter(p=>p.operator_id===ACTIVE_OP_ID).length}/>
            {state.parcels.filter(p=>p.operator_id===ACTIVE_OP_ID).map(p=>(
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #E2E8F0' }}>
                <span style={{ fontSize:24 }}>📦</span>
                <div style={{ flex:1 }}>
                  <div style={{ ...P, fontWeight:700, fontSize:13 }}>{p.type} — {p.from}→{p.to}</div>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>{p.id} · {p.created_at}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:14, color:'#0B3D91' }}>{fmt(p.amount)}</div>
                  <Pill text={p.status.replace(/_/g,' ')} color={p.status==='DELIVERED'?'#15803d':p.status==='IN_TRANSIT'?'#1d4ed8':'#92400e'}/>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Module request modal */}
      <Modal open={!!reqModal} onClose={() => setReqModal(null)} title={`Request: ${ML[reqModal?.mod]||reqModal?.mod}`}>
        {reqModal && (<>
          <div style={{ background:'#F5F7FA', borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{MI[reqModal.mod]||'💎'}</div>
            <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{ML[reqModal.mod]}</div>
            <div style={{ ...P, fontWeight:800, fontSize:18, color:'#0B3D91' }}>{fmt(MP[reqModal.mod]||0)}<span style={{ fontSize:12, color:'#64748b', fontWeight:400 }}>/month</span></div>
          </div>
          <Banner type="info">Raylane Admin will contact you to confirm payment and activate within 24 hours.</Banner>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={() => setReqModal(null)}>Cancel</Btn>
            <Btn variant="gold" full onClick={() => { st.requestModuleActivation(op.id, reqModal.mod); toast('Request sent to Raylane Admin!','success'); setReqModal(null) }}>Send Request</Btn>
          </div>
        </>)}
      </Modal>
    </div>
  )
}
