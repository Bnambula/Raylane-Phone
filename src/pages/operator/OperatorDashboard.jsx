import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOperatorStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import {
  Card, StatCard, Pill, SectionHead, BarChart, ProgressBar,
  Banner, Modal, Btn, EmptyState
} from '../../components/ui/SharedComponents'
import { BusSeat67, TaxiSeat14, SeatLegend } from '../../components/ui/SeatMaps'
import {
  IconGrid, IconBus, IconTicket, IconCash, IconParcel, IconCar,
  IconAlert, IconSettings, IconChart, IconUsers, IconDoc,
  IconCheck, IconFuel, IconWrench, IconAnalytics, IconHR, IconSend
} from '../../components/ui/Icons'

const ACTIVE_OP = 'op-001'

const P   = { fontFamily:"'Poppins',sans-serif" }
const I   = { fontFamily:"'Inter',sans-serif" }
const fmt = n => 'UGX ' + Number(n || 0).toLocaleString()

const iS = {
  width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10,
  padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif",
  background:'#fff', WebkitAppearance:'none', boxSizing:'border-box',
  outline:'none', color:'#0F1923'
}
const lS = {
  display:'block', fontSize:10, fontWeight:600, color:'#64748b',
  fontFamily:"'Poppins',sans-serif", textTransform:'uppercase',
  letterSpacing:'1.5px', marginBottom:5
}

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']

const DEMO_PAYMENTS = [
  { id:'OP1', type:'Rent',      vendor:'Kampala Park Authority', desc:'Monthly bus park fee Gate 3', amount:450000,  due:'2026-06-01', status:'UNPAID' },
  { id:'OP2', type:'Utility',   vendor:'UMEME Ltd',              desc:'Electricity workshop May',    amount:280000,  due:'2026-05-20', status:'UNPAID' },
  { id:'OP3', type:'Insurance', vendor:'UAP Insurance',          desc:'Fleet insurance Q2 2026',     amount:1200000, due:'2026-05-31', status:'UNPAID' },
  { id:'OP4', type:'Permit',    vendor:'UNRA Uganda',            desc:'Road fitness certificates x2',amount:300000,  due:'2026-06-15', status:'UNPAID' },
  { id:'OP5', type:'Internet',  vendor:'MTN Business',           desc:'Booking terminal internet',   amount:180000,  due:'2026-05-15', status:'PAID'   },
  { id:'OP6', type:'Rent',      vendor:'Kampala Park Authority', desc:'Monthly bus park fee May',    amount:450000,  due:'2026-05-01', status:'PAID'   },
]

const DEMO_DRIVERS = [
  { id:'DRV-001', name:'James Okello',  phone:'0771-001-001', licence:'UG-DL-12345', expiry:'2027-03-15', class:'PSV', trips:142, rating:4.8, status:'Active'  },
  { id:'DRV-002', name:'Sarah Nakato',  phone:'0700-002-002', licence:'UG-DL-23456', expiry:'2026-08-20', class:'PSV', trips:98,  rating:4.9, status:'Active'  },
  { id:'DRV-003', name:'Peter Mwesiga', phone:'0752-003-003', licence:'UG-DL-34567', expiry:'2026-06-10', class:'PSV', trips:67,  rating:4.6, status:'Off Duty' },
]

const PC_COLOR = { PAID:'#15803d', UNPAID:'#92400e', OVERDUE:'#dc2626' }

const MODULE_DEFS = [
  { id:'financial_module', label:'Financials',  price:100000 },
  { id:'fuel_module',      label:'Fuel',        price:80000  },
  { id:'analytics_module', label:'Analytics',   price:100000 },
  { id:'hr_module',        label:'Staff/HR',    price:100000 },
  { id:'fleet_module',     label:'Fleet Maint', price:120000 },
  { id:'cost_center',      label:'Cost Center', price:80000  },
]

const BOOKED_DEMO = [3,7,8,11,14,20,21,31,35]

const NAV_ITEMS = [
  { id:'dashboard',  label:'Dashboard',   Icon:IconGrid    },
  { id:'addtrip',    label:'Add Trip',    Icon:IconBus     },
  { id:'trips',      label:'My Trips',    Icon:IconChart   },
  { id:'seats',      label:'Seat Manager',Icon:IconTicket  },
  { id:'bookings',   label:'Bookings',    Icon:IconCheck   },
  { id:'parcels',    label:'Parcels',     Icon:IconParcel  },
  { id:'payments',   label:'Payments',    Icon:IconCash    },
  { id:'costs',      label:'Cost Center', Icon:IconDoc     },
  { id:'drivers',    label:'Drivers',     Icon:IconUsers   },
  { id:'financial',  label:'Financial',   Icon:IconAnalytics },
  { id:'vendors',    label:'Vendors',     Icon:IconWrench  },
  { id:'fuel',       label:'Fuel',        Icon:IconFuel    },
  { id:'hr',         label:'Staff/HR',    Icon:IconHR      },
  { id:'fleet',      label:'Fleet',       Icon:IconCar     },
  { id:'alerts',     label:'Alerts',      Icon:IconAlert,  badge:true },
  { id:'settings',   label:'Settings',    Icon:IconSettings },
]

export default function OperatorDashboard() {
  const { state, st, op, trips, bookings, costs, vendors, notifications, unreadCount, summary } = useOperatorStore(ACTIVE_OP)
  const toast    = useToast()
  const navigate = useNavigate()

  const [tab,       setTab]       = useState('dashboard')
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [payments,  setPayments]  = useState(DEMO_PAYMENTS)
  const [drivers,   setDrivers]   = useState(DEMO_DRIVERS)
  const [seatTrip,  setSeatTrip]  = useState(null)
  const [selSeats,  setSelSeats]  = useState([])
  const [reqModal,  setReqModal]  = useState(null)
  const [pModal,    setPModal]    = useState(null)
  const [dModal,    setDModal]    = useState(null)

  const [tripForm, setTripForm] = useState({
    from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:''
  })
  const [costForm, setCostForm] = useState({
    category:'FUEL', vendor:'', amount:'', description:'', date:''
  })
  const [parcelForm, setParcelForm] = useState({
    type:'Small Parcel', from:'Kampala', to:'', senderPhone:'', recipientPhone:'', recipientName:'', insured:false, notes:''
  })
  const [dForm, setDForm] = useState({
    name:'', phone:'', licence:'', expiry:'', class:'PSV', status:'Active'
  })

  if (!op) return (
    <div style={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', paddingTop:'var(--nav-h)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ ...P, fontWeight:700, fontSize:18, marginBottom:8 }}>Loading operator data...</div>
        <button onClick={() => { sessionStorage.clear(); window.location.reload() }}
          style={{ padding:'10px 20px', borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, border:'none', cursor:'pointer' }}>
          Reset and Reload
        </button>
      </div>
    </div>
  )

  const isActive = modId => op.modules && op.modules[modId] && op.modules[modId].status === 'ACTIVE'

  const submitTrip = e => {
    e.preventDefault()
    if (!tripForm.to || !tripForm.date || !tripForm.price) { toast('Fill all required fields', 'warning'); return }
    const seat_type = tripForm.vehicle.includes('14') ? '14' : '67'
    st.createTrip({
      operator_id: op.id, operator_name: op.company_name,
      plate: tripForm.vehicle.split('--')[0].trim(),
      from: tripForm.from, to: tripForm.to, date: tripForm.date,
      departs: tripForm.departs, seat_type, price: parseInt(tripForm.price),
      seats_total: parseInt(seat_type), seats_booked: 0,
      boarding_pin: op.boarding_pin, notes: tripForm.notes
    })
    toast('Trip submitted for admin approval', 'success')
    setTab('trips')
    setTripForm({ from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:'' })
  }

  const submitCost = e => {
    e.preventDefault()
    if (!costForm.amount || !costForm.description) { toast('Fill required fields', 'warning'); return }
    st.addCostEntry({ operator_id:ACTIVE_OP, ...costForm, amount:parseInt(costForm.amount), status:'PAID' })
    toast('Expense recorded', 'success')
    setCostForm({ category:'FUEL', vendor:'', amount:'', description:'', date:'' })
  }

  const toggleSeat = n => setSelSeats(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n])

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>

      {/* SIDEBAR */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', zIndex:99, display:'none' }} className="mob-overlay"/>
      )}
      <div className={`dash-sidebar${menuOpen ? ' open' : ''}`}
        style={{ width:200, background:'#0B3D91', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto', zIndex:100 }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,.12)', minHeight:54 }}>
          <div style={{ ...P, fontWeight:700, fontSize:12, color:'#FFC72C', marginBottom:2, lineHeight:1.2 }}>{op.company_name}</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,.6)', ...I }}>{op.merchant_code}</div>
        </div>
        <nav style={{ flex:1, padding:'4px 0' }}>
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
            const bc = badge ? unreadCount : 0
            const isAct = tab === id
            return (
              <button key={id} onClick={() => { setTab(id); setMenuOpen(false) }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:isAct ? 'rgba(255,199,44,.14)' : 'none', color:isAct ? '#FFC72C' : 'rgba(255,255,255,.78)', borderLeft:`3px solid ${isAct ? '#FFC72C' : 'transparent'}`, ...P, fontWeight:600, fontSize:11, border:'none', cursor:'pointer', width:'100%', textAlign:'left', transition:'all .18s' }}>
                <Icon size={13} color={isAct ? '#FFC72C' : 'rgba(255,255,255,.5)'}/>
                <span style={{ flex:1 }}>{label}</span>
                {bc > 0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700 }}>{bc}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
          <button onClick={() => navigate('/')}
            style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.6)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:10 }}>
            Back to Site
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:22 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ width:36, height:36, borderRadius:9, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IconGrid size={16} color="#0B3D91"/>
            </button>
            <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(14px,2vw,20px)', margin:0 }}>
              {(NAV_ITEMS.find(n => n.id === tab) || {}).label || 'Dashboard'}
            </h1>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount > 0 && (
              <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:12 }}>{unreadCount} new</span>
            )}
            <div style={{ background:'#fff', borderRadius:10, padding:'6px 12px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 1px 4px rgba(0,0,0,.07)' }}>
              <div style={{ width:26, height:26, borderRadius:7, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFC72C', ...P, fontWeight:800, fontSize:10 }}>
                {op.company_name[0]}
              </div>
              <span style={{ ...P, fontWeight:700, fontSize:12 }}>{op.company_name}</span>
            </div>
          </div>
        </div>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Net Revenue"    value={fmt(summary.net_revenue)}                            sub="After commission" bg="#dcfce7" color="#15803d"/>
              <StatCard label="Bookings"       value={bookings.length}                                     sub="This month"       bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Live Trips"     value={trips.filter(t => t.status === 'APPROVED').length}   sub="Active now"       bg="#fef9c3" color="#92400e"/>
              <StatCard label="Rating"         value={(op.rating || 0) + ' / 5'}                          sub={(op.reviews || 0) + ' reviews'} bg="#f3e8ff" color="#7c3aed"/>
            </div>

            {/* Daily brief */}
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:14, marginBottom:14 }}>
              <Card>
                <SectionHead title="Today's Trips" action="Add Trip" onAction={() => setTab('addtrip')}/>
                {trips.filter(t => t.status === 'APPROVED').length === 0
                  ? <EmptyState title="No live trips" desc="Submit a trip for admin approval"/>
                  : trips.filter(t => t.status === 'APPROVED').slice(0, 3).map((t, i) => (
                    <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i < 2 ? '1px solid #E2E8F0' : '' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:13 }}>{t.from} to {t.to}</div>
                        <div style={{ fontSize:11, color:'#64748b', ...I }}>{t.departs} -- {t.seats_booked}/{t.seats_total} booked</div>
                        <ProgressBar value={t.seats_booked} max={t.seats_total} height={4}/>
                      </div>
                      <Pill text="LIVE" color="#15803d"/>
                    </div>
                  ))
                }
                {trips.filter(t => t.status === 'PENDING_APPROVAL').length > 0 && (
                  <div style={{ marginTop:10, background:'#fef9c3', borderRadius:10, padding:'8px 12px', fontSize:12, color:'#92400e', ...P, fontWeight:600 }}>
                    {trips.filter(t => t.status === 'PENDING_APPROVAL').length} trip(s) awaiting admin approval
                  </div>
                )}
              </Card>
              <Card>
                <SectionHead title="Cost Snapshot"/>
                <div style={{ ...P, fontWeight:800, fontSize:22, color:'#dc2626', marginBottom:4 }}>{fmt(summary.total_costs || 0)}</div>
                <div style={{ fontSize:12, color:'#64748b', ...I, marginBottom:12 }}>Total expenses this period</div>
                <div style={{ paddingTop:10, borderTop:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:13, color:'#64748b', ...I }}>Net Profit</span>
                  <span style={{ ...P, fontWeight:800, fontSize:15, color:(summary.net_profit || 0) >= 0 ? '#15803d' : '#dc2626' }}>
                    {fmt(Math.abs(summary.net_profit || 0))}
                  </span>
                </div>
              </Card>
            </div>

            <Card>
              <SectionHead title="Revenue This Week"/>
              <BarChart data={[30,55,40,80,65,90,75]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} height={80}/>
            </Card>
          </div>
        )}

        {/* ADD TRIP */}
        {tab === 'addtrip' && (
          <Card>
            <Banner type="info">After submitting, Raylane Admin reviews and approves before the trip goes live.</Banner>
            <form onSubmit={submitTrip} style={{ marginTop:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>From</label>
                  <select value={tripForm.from} onChange={e => setTripForm({ ...tripForm, from:e.target.value })} style={iS}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>To *</label>
                  <select value={tripForm.to} onChange={e => setTripForm({ ...tripForm, to:e.target.value })} style={iS}>
                    <option value="">Select destination...</option>
                    {CITIES.filter(c => c !== tripForm.from).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Vehicle</label>
                  <select value={tripForm.vehicle} onChange={e => setTripForm({ ...tripForm, vehicle:e.target.value })} style={iS}>
                    <option value="">Select vehicle...</option>
                    <option value="UAR 901J -- 67-Seater Coach">UAR 901J -- 67-Seater Coach</option>
                    <option value="UAR 902J -- 67-Seater Coach">UAR 902J -- 67-Seater Coach</option>
                  </select>
                </div>
                <div><label style={lS}>Date *</label>
                  <input type="date" value={tripForm.date} onChange={e => setTripForm({ ...tripForm, date:e.target.value })} style={iS} min={new Date().toISOString().split('T')[0]}/>
                </div>
                <div><label style={lS}>Departure Time</label>
                  <input type="time" value={tripForm.departs} onChange={e => setTripForm({ ...tripForm, departs:e.target.value })} style={iS}/>
                </div>
                <div><label style={lS}>Price per Seat (UGX) *</label>
                  <input type="number" value={tripForm.price} onChange={e => setTripForm({ ...tripForm, price:e.target.value })} placeholder="e.g. 25000" style={iS}/>
                </div>
                <div style={{ gridColumn:'1/-1' }}><label style={lS}>Notes</label>
                  <textarea rows={2} value={tripForm.notes} onChange={e => setTripForm({ ...tripForm, notes:e.target.value })} placeholder="Amenities, stops, special instructions..." style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
                <Btn variant="ghost" full onClick={() => setTab('trips')}>Cancel</Btn>
                <Btn variant="gold" full>Submit for Approval</Btn>
              </div>
            </form>
          </Card>
        )}

        {/* MY TRIPS */}
        {tab === 'trips' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => setTab('addtrip')}>+ Add Trip</Btn>
            </div>
            {trips.length === 0
              ? <EmptyState title="No trips yet" action="Add Trip" onAction={() => setTab('addtrip')}/>
              : trips.map(t => (
                <Card key={t.id} style={{ marginBottom:12, borderLeft:`4px solid ${t.status === 'APPROVED' ? '#22c55e' : t.status === 'PENDING_APPROVAL' ? '#FFC72C' : '#ef4444'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:8 }}>
                    <div>
                      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                        <span style={{ ...P, fontWeight:700, fontSize:15 }}>{t.from} to {t.to}</span>
                        <Pill text={t.status.replace(/_/g, ' ')} color={t.status === 'APPROVED' ? '#15803d' : t.status === 'PENDING_APPROVAL' ? '#92400e' : '#dc2626'}/>
                      </div>
                      <div style={{ fontSize:13, color:'#64748b', ...I }}>{t.departs} -- {t.date} -- {fmt(t.price)}/seat</div>
                    </div>
                    {t.status === 'APPROVED' && (
                      <Btn size="sm" variant="blue" onClick={() => { setSeatTrip(t); setTab('seats') }}>Manage Seats</Btn>
                    )}
                  </div>
                  {t.status === 'APPROVED' && <ProgressBar value={t.seats_booked} max={t.seats_total} label={t.seats_booked + '/' + t.seats_total + ' seats booked'} showPct/>}
                  {t.rejection_reason && <div style={{ marginTop:8, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626' }}>{t.rejection_reason}</div>}
                </Card>
              ))
            }
          </div>
        )}

        {/* SEAT MANAGER */}
        {tab === 'seats' && (
          <div>
            {!seatTrip ? (
              <div>
                <p style={{ color:'#64748b', ...I, marginBottom:14 }}>Select a trip to manage seats:</p>
                {trips.filter(t => t.status === 'APPROVED').map(t => (
                  <Card key={t.id} style={{ marginBottom:10, cursor:'pointer' }} onClick={() => setSeatTrip(t)}>
                    <div style={{ ...P, fontWeight:700 }}>{t.from} to {t.to} -- {t.departs}</div>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>{t.seats_booked}/{t.seats_total} booked</div>
                  </Card>
                ))}
                {trips.filter(t => t.status === 'APPROVED').length === 0 && <EmptyState title="No approved trips" desc="Trips must be approved before managing seats"/>}
              </div>
            ) : (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
                  <button onClick={() => { setSeatTrip(null); setSelSeats([]) }}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#0B3D91', ...P, fontWeight:700, fontSize:13 }}>Back</button>
                  <h3 style={{ ...P, fontWeight:700, fontSize:16, margin:0 }}>{seatTrip.from} to {seatTrip.to} -- {seatTrip.departs}</h3>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'start' }}>
                  <div style={{ background:'#F5F7FA', borderRadius:16, padding:14, overflowX:'auto' }}>
                    <div style={{ marginBottom:12 }}><SeatLegend compact/></div>
                    {parseInt(seatTrip.seat_type) <= 14
                      ? <TaxiSeat14 booked={BOOKED_DEMO} locked={[]} selected={selSeats} onToggle={toggleSeat}/>
                      : <BusSeat67  booked={BOOKED_DEMO} locked={[]} selected={selSeats} onToggle={toggleSeat}/>
                    }
                  </div>
                  <div style={{ minWidth:200 }}>
                    <Card style={{ marginBottom:10 }}>
                      <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:8 }}>Selected: {selSeats.length}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
                        {selSeats.map(s => <span key={s} style={{ background:'#FFC72C', color:'#0B3D91', padding:'3px 9px', borderRadius:7, ...P, fontWeight:800, fontSize:12 }}>{s}</span>)}
                      </div>
                      <Btn variant="blue" full size="sm" onClick={() => { toast('Seats reserved', 'success'); setSelSeats([]) }}>Reserve Selected</Btn>
                      <div style={{ marginTop:8 }}>
                        <Btn variant="danger" full size="sm" onClick={() => { setSelSeats([]); toast('Selection cleared', 'warning') }}>Clear</Btn>
                      </div>
                    </Card>
                    <Card><ProgressBar value={seatTrip.seats_booked} max={seatTrip.seats_total} showPct label="Capacity"/></Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={bookings.length}/>
            {bookings.length === 0
              ? <EmptyState title="No bookings yet" desc="Bookings will appear here as passengers book your trips"/>
              : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                    <thead>
                      <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                        {['ID','Route','Seat','Method','Amount','Status'].map(h => (
                          <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => {
                        const trip = (state.trips || []).find(t => t.id === b.trip_id)
                        return (
                          <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}>
                            <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                            <td style={{ padding:'10px', fontSize:12, ...I }}>{trip ? trip.from + ' to ' + trip.to : '--'}</td>
                            <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                            <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                            <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(b.amount)}</td>
                            <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status === 'CONFIRMED' ? '#15803d' : '#92400e'}/></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </Card>
        )}

        {/* PARCELS */}
        {tab === 'parcels' && (
          <div>
            <Card style={{ marginBottom:16 }}>
              <SectionHead title="Send New Parcel"/>
              <form onSubmit={e => { e.preventDefault(); if (!parcelForm.to || !parcelForm.senderPhone) { toast('Fill required fields', 'warning'); return }; toast('Parcel booking created', 'success'); setParcelForm({ type:'Small Parcel', from:'Kampala', to:'', senderPhone:'', recipientPhone:'', recipientName:'', insured:false, notes:'' }) }} style={{ marginTop:12 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                  <div><label style={lS}>Parcel Type</label>
                    <select value={parcelForm.type} onChange={e => setParcelForm({ ...parcelForm, type:e.target.value })} style={iS}>
                      {['Envelope (UGX 5,000)','Small Parcel (UGX 12,000)','Large Parcel (UGX 20,000)','Heavy Cargo (UGX 30,000+)'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label style={lS}>From</label>
                    <select value={parcelForm.from} onChange={e => setParcelForm({ ...parcelForm, from:e.target.value })} style={iS}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={lS}>To *</label>
                    <select value={parcelForm.to} onChange={e => setParcelForm({ ...parcelForm, to:e.target.value })} style={iS}>
                      <option value="">Select...</option>
                      {CITIES.filter(c => c !== parcelForm.from).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={lS}>Sender Phone *</label>
                    <input value={parcelForm.senderPhone} onChange={e => setParcelForm({ ...parcelForm, senderPhone:e.target.value })} placeholder="0771 xxx xxx" style={iS}/>
                  </div>
                  <div><label style={lS}>Recipient Phone</label>
                    <input value={parcelForm.recipientPhone} onChange={e => setParcelForm({ ...parcelForm, recipientPhone:e.target.value })} placeholder="0700 xxx xxx" style={iS}/>
                  </div>
                  <div><label style={lS}>Recipient Name</label>
                    <input value={parcelForm.recipientName} onChange={e => setParcelForm({ ...parcelForm, recipientName:e.target.value })} placeholder="Full name" style={iS}/>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <input type="checkbox" checked={parcelForm.insured} onChange={e => setParcelForm({ ...parcelForm, insured:e.target.checked })} id="ins"/>
                  <label htmlFor="ins" style={{ fontSize:13, ...P, fontWeight:600, cursor:'pointer' }}>Add Insurance (3% of declared value)</label>
                </div>
                <Btn variant="blue" full>Create Parcel Booking</Btn>
              </form>
            </Card>
            <Card>
              <SectionHead title="Recent Parcels"/>
              <EmptyState title="No parcels yet" desc="Create a parcel booking above to get started"/>
            </Card>
          </div>
        )}

        {/* PAYMENTS */}
        {tab === 'payments' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Unpaid Bills"   value={payments.filter(p => p.status === 'UNPAID').length}  sub="Due this month" bg="#fef9c3" color="#92400e"/>
              <StatCard label="Overdue"        value={payments.filter(p => p.status === 'OVERDUE').length} sub="Past due"       bg="#fee2e2" color="#dc2626"/>
              <StatCard label="Total Unpaid"   value={fmt(payments.filter(p => p.status !== 'PAID').reduce((s, p) => s + p.amount, 0))} sub="Outstanding" bg="#dbeafe" color="#1d4ed8"/>
            </div>
            <Card>
              <SectionHead title="Payment Obligations" action="Add Invoice" onAction={() => setPModal('add')}/>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:580 }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                      {['Type','Vendor','Description','Amount','Due','Status','Actions'].map(h => (
                        <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} style={{ borderBottom:'1px solid #E2E8F0', background:p.status === 'OVERDUE' ? '#fff8f8' : '' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
                        onMouseLeave={e => e.currentTarget.style.background = p.status === 'OVERDUE' ? '#fff8f8' : ''}>
                        <td style={{ padding:'10px' }}><Pill text={p.type} color="#1d4ed8" bg="#dbeafe"/></td>
                        <td style={{ padding:'10px', ...P, fontWeight:600, fontSize:13 }}>{p.vendor}</td>
                        <td style={{ padding:'10px', fontSize:12, color:'#64748b', ...I }}>{p.desc}</td>
                        <td style={{ padding:'10px', ...P, fontWeight:700, color:'#0B3D91' }}>{fmt(p.amount)}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I, color:p.status === 'OVERDUE' ? '#dc2626' : '#0F1923' }}>{p.due}</td>
                        <td style={{ padding:'10px' }}><Pill text={p.status} color={PC_COLOR[p.status] || '#64748b'}/></td>
                        <td style={{ padding:'10px' }}>
                          <div style={{ display:'flex', gap:5 }}>
                            {p.status !== 'PAID' && (
                              <button onClick={() => { setPayments(prev => prev.map(x => x.id === p.id ? { ...x, status:'PAID' } : x)); toast(p.vendor + ' paid', 'success') }}
                                style={{ padding:'4px 10px', borderRadius:8, background:'#0B3D91', color:'#fff', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Pay</button>
                            )}
                            <button onClick={() => setPModal(p)}
                              style={{ padding:'4px 10px', borderRadius:8, background:'#F5F7FA', color:'#0B3D91', border:'1px solid #E2E8F0', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                            <button onClick={() => { setPayments(prev => prev.filter(x => x.id !== p.id)); toast('Removed', 'warning') }}
                              style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* COST CENTER */}
        {tab === 'costs' && (
          <div>
            <Card style={{ marginBottom:16 }}>
              <SectionHead title="Record Expense"/>
              <form onSubmit={submitCost} style={{ marginTop:12 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                  <div><label style={lS}>Category</label>
                    <select value={costForm.category} onChange={e => setCostForm({ ...costForm, category:e.target.value })} style={iS}>
                      {['FUEL','MAINTENANCE','STAFF','INSURANCE','PERMIT','TAX','OTHER'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={lS}>Vendor</label>
                    <select value={costForm.vendor} onChange={e => setCostForm({ ...costForm, vendor:e.target.value })} style={iS}>
                      <option value="">Select vendor...</option>
                      {vendors.map(v => <option key={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div><label style={lS}>Amount (UGX) *</label>
                    <input type="number" value={costForm.amount} onChange={e => setCostForm({ ...costForm, amount:e.target.value })} placeholder="e.g. 500000" style={iS}/>
                  </div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description *</label>
                    <input value={costForm.description} onChange={e => setCostForm({ ...costForm, description:e.target.value })} placeholder="What was this expense for?" style={iS}/>
                  </div>
                  <div><label style={lS}>Date</label>
                    <input type="date" value={costForm.date} onChange={e => setCostForm({ ...costForm, date:e.target.value })} style={iS}/>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end' }}>
                    <Btn variant="blue" full>Add Expense</Btn>
                  </div>
                </div>
              </form>
            </Card>
            <Card>
              <SectionHead title="All Expenses" count={costs.length}/>
              {costs.length === 0
                ? <EmptyState title="No expenses recorded" desc="Record your first expense above"/>
                : (
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                          {['Date','Category','Description','Amount','Status'].map(h => (
                            <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {costs.map((c, i) => (
                          <tr key={c.id || i} style={{ borderBottom:'1px solid #E2E8F0' }}>
                            <td style={{ padding:'10px', fontSize:12, ...I }}>{c.date}</td>
                            <td style={{ padding:'10px' }}><Pill text={c.category} color="#1d4ed8" bg="#dbeafe"/></td>
                            <td style={{ padding:'10px', fontSize:13, ...I }}>{c.description}</td>
                            <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(c.amount)}</td>
                            <td style={{ padding:'10px' }}><Pill text={c.status} color={c.status === 'PAID' ? '#15803d' : '#dc2626'}/></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </Card>
          </div>
        )}

        {/* DRIVERS */}
        {tab === 'drivers' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => { setDForm({ name:'', phone:'', licence:'', expiry:'', class:'PSV', status:'Active' }); setDModal('add') }}>+ Add Driver</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
              {drivers.map(d => {
                const expiringSoon = new Date(d.expiry) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                return (
                  <Card key={d.id} style={{ borderLeft:`4px solid ${d.status === 'Active' ? '#22c55e' : '#d97706'}` }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:800, fontSize:16, color:'#0B3D91', flexShrink:0 }}>
                        {d.name[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:15 }}>{d.name}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>{d.phone}</div>
                      </div>
                      <Pill text={d.status} color={d.status === 'Active' ? '#15803d' : '#d97706'}/>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:12, ...I, color:'#64748b', marginBottom:12 }}>
                      <span>Licence: {d.licence}</span>
                      <span>Class: {d.class}</span>
                      <span style={{ color: expiringSoon ? '#dc2626' : 'inherit', fontWeight: expiringSoon ? 700 : 400 }}>
                        Expires: {d.expiry} {expiringSoon ? '(!!)' : ''}
                      </span>
                      <span>Trips: {d.trips}</span>
                      <span>Rating: {d.rating}/5</span>
                    </div>
                    {expiringSoon && (
                      <div style={{ background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:11, color:'#dc2626', ...P, fontWeight:600, marginBottom:10 }}>
                        Licence expiring soon -- renew before {d.expiry}
                      </div>
                    )}
                    <div style={{ display:'flex', gap:7 }}>
                      <button onClick={() => { setDForm({ ...d }); setDModal(d) }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                      <button onClick={() => { setDrivers(prev => prev.map(x => x.id === d.id ? { ...x, status: x.status === 'Active' ? 'Off Duty' : 'Active' } : x)); toast('Status updated', 'success') }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                        {d.status === 'Active' ? 'Set Off Duty' : 'Set Active'}
                      </button>
                      <button onClick={() => { setDrivers(prev => prev.filter(x => x.id !== d.id)); toast('Driver removed', 'error') }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Remove</button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* FINANCIAL */}
        {tab === 'financial' && (
          <div>
            <Card style={{ background:'#0B3D91', marginBottom:16 }}>
              <div style={{ color:'#fff' }}>
                <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:14, opacity:.8 }}>Profit and Loss Summary</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                  {[
                    ['Gross Revenue',   summary.gross_revenue || 0, '#86efac'],
                    ['Commission (8%)', summary.commission    || 0, '#fca5a5'],
                    ['Total Costs',     summary.total_costs   || 0, '#fca5a5'],
                    ['Net Profit',      summary.net_profit    || 0, (summary.net_profit || 0) >= 0 ? '#86efac' : '#fca5a5'],
                  ].map(([l, v, c]) => (
                    <div key={l}>
                      <div style={{ fontSize:11, opacity:.7, ...I, marginBottom:4 }}>{l}</div>
                      <div style={{ ...P, fontWeight:800, fontSize:18, color:c }}>{fmt(Math.abs(v))}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card>
              <SectionHead title="Revenue This Month"/>
              <BarChart data={[42,58,51,73,69,90,75,82,95,88,74,92]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} height={100}/>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:16 }}>
                {[['P&L Statement','Full profit and loss'],['Cash Flow','Revenue vs costs'],['Export CSV','QuickBooks format']].map(([t, d]) => (
                  <button key={t} onClick={() => toast('Generating: ' + t, 'success')}
                    style={{ background:'#F5F7FA', borderRadius:12, padding:14, border:'1.5px solid #E2E8F0', cursor:'pointer', textAlign:'left' }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13, marginBottom:4 }}>{t}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{d}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ALERTS */}
        {tab === 'alerts' && (
          <Card>
            <SectionHead title="Notifications" action="Mark all read" onAction={() => { st.markOpRead && st.markOpRead(op.id); toast('All read', 'success') }}/>
            {notifications.length === 0
              ? <EmptyState title="All caught up" desc="No new notifications"/>
              : notifications.map((n, i) => (
                <div key={n.id || i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom: i < notifications.length - 1 ? '1px solid #E2E8F0' : '', background:!n.read ? '#f8faff' : '' }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <IconAlert size={14} color="#1d4ed8"/>
                  </div>
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

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Company Profile"/>
              {[
                ['Company Name', op.company_name],
                ['Merchant Code', op.merchant_code],
                ['Phone', op.phone],
                ['Commission Rate', ((op.commission_rate || 0) * 100) + '%'],
                ['Fleet Size', (op.fleet_size || 0) + ' vehicles'],
              ].map(([l, v]) => (
                <div key={l} style={{ marginBottom:12 }}>
                  <label style={lS}>{l}</label>
                  <input defaultValue={v} style={iS} readOnly={l === 'Commission Rate' || l === 'Merchant Code'}/>
                </div>
              ))}
              <Btn variant="blue" full onClick={() => toast('Profile saved', 'success')}>Save Profile</Btn>
            </Card>
            <Card>
              <SectionHead title="Module Subscriptions"/>
              {MODULE_DEFS.map(m => {
                const isAct = isActive(m.id)
                return (
                  <div key={m.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ ...P, fontWeight:600, fontSize:13 }}>{m.label}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{m.price ? fmt(m.price) + '/month' : 'Included free'}</div>
                    </div>
                    <Pill text={isAct ? 'Active' : 'Locked'} color={isAct ? '#15803d' : '#9ca3af'}/>
                    {!isAct && (
                      <button onClick={() => setReqModal({ id:m.id, label:m.label, price:m.price })}
                        style={{ padding:'4px 10px', borderRadius:10, background:'#dbeafe', color:'#1d4ed8', border:'none', ...P, fontWeight:600, fontSize:10, cursor:'pointer' }}>Request</button>
                    )}
                  </div>
                )
              })}
            </Card>
          </div>
        )}

        {/* Stub tabs */}
        {['vendors','fuel','hr','fleet'].includes(tab) && (
          <Card style={{ textAlign:'center', padding:40 }}>
            <div style={{ width:64, height:64, borderRadius:20, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <IconWrench size={28} color="#0B3D91"/>
            </div>
            <h3 style={{ ...P, fontWeight:700, fontSize:20, marginBottom:8 }}>{(NAV_ITEMS.find(n => n.id === tab) || {}).label} Module</h3>
            <p style={{ color:'#64748b', maxWidth:360, margin:'0 auto 20px', ...I }}>Connect to the Raylane backend API to load live data for this module.</p>
            <Btn variant="blue" onClick={() => toast('API integration required', 'success')}>Configure Module</Btn>
          </Card>
        )}
      </div>

      {/* MODULE REQUEST MODAL */}
      <Modal open={!!reqModal} onClose={() => setReqModal(null)} title={reqModal ? 'Request: ' + reqModal.label : ''}>
        {reqModal && (
          <div>
            <div style={{ background:'#F5F7FA', borderRadius:12, padding:16, marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{reqModal.label}</div>
              <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(reqModal.price)}<span style={{ fontSize:12, color:'#64748b', fontWeight:400 }}>/month</span></div>
            </div>
            <Banner type="info">Raylane Admin will contact you to confirm payment and activate within 24 hours.</Banner>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <Btn variant="ghost" full onClick={() => setReqModal(null)}>Cancel</Btn>
              <Btn variant="gold" full onClick={() => { st.requestModuleActivation && st.requestModuleActivation(op.id, reqModal.id); toast('Request sent to Raylane Admin', 'success'); setReqModal(null) }}>Send Request</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal open={!!pModal} onClose={() => setPModal(null)} title={pModal === 'add' ? 'Add Invoice' : 'Edit Invoice'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label style={lS}>Type</label>
            <select defaultValue={typeof pModal === 'object' ? pModal.type : 'Utility'} id="ptype-op" style={iS}>
              {['Utility','Rent','Insurance','Permit','Internet','Other'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={lS}>Vendor</label>
            <select defaultValue={typeof pModal === 'object' ? pModal.vendor : ''} id="pvendor-op" style={iS}>
              <option value="">Select...</option>
              {['UMEME Ltd','National Water','Kampala Park Authority','MTN Business','UAP Insurance','UNRA Uganda'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description</label>
            <input defaultValue={typeof pModal === 'object' ? pModal.desc : ''} id="pdesc-op" style={iS} placeholder="Invoice description..."/>
          </div>
          <div><label style={lS}>Amount (UGX)</label>
            <input type="number" defaultValue={typeof pModal === 'object' ? pModal.amount : ''} id="pamount-op" style={iS}/>
          </div>
          <div><label style={lS}>Due Date</label>
            <input type="date" defaultValue={typeof pModal === 'object' ? pModal.due : ''} id="pdue-op" style={iS}/>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setPModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            const amount = parseInt(document.getElementById('pamount-op')?.value || 0)
            const desc   = document.getElementById('pdesc-op')?.value || ''
            const type   = document.getElementById('ptype-op')?.value || 'Utility'
            const vendor = document.getElementById('pvendor-op')?.value || ''
            const due    = document.getElementById('pdue-op')?.value || ''
            if (pModal === 'add') {
              setPayments(prev => [...prev, { id:'OP-' + Date.now(), type, vendor, desc, amount, due, status:'UNPAID' }])
              toast('Invoice added', 'success')
            } else {
              setPayments(prev => prev.map(x => x.id === pModal.id ? { ...x, amount, desc, type, vendor, due } : x))
              toast('Invoice updated', 'success')
            }
            setPModal(null)
          }}>{pModal === 'add' ? 'Add Invoice' : 'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* DRIVER MODAL */}
      <Modal open={!!dModal} onClose={() => setDModal(null)} title={dModal === 'add' ? 'Add Driver' : 'Edit Driver'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['name','Full Name'],['phone','Phone Number'],['licence','Licence Number']].map(([k, l]) => (
            <div key={k}><label style={lS}>{l}</label>
              <input value={dForm[k] || ''} onChange={e => setDForm(f => ({ ...f, [k]:e.target.value }))} style={iS}/>
            </div>
          ))}
          <div><label style={lS}>Licence Expiry</label>
            <input type="date" value={dForm.expiry || ''} onChange={e => setDForm(f => ({ ...f, expiry:e.target.value }))} style={iS}/>
          </div>
          <div><label style={lS}>Licence Class</label>
            <select value={dForm.class || 'PSV'} onChange={e => setDForm(f => ({ ...f, class:e.target.value }))} style={iS}>
              <option>PSV</option><option>Class B</option><option>Class C</option>
            </select>
          </div>
          <div><label style={lS}>Status</label>
            <select value={dForm.status || 'Active'} onChange={e => setDForm(f => ({ ...f, status:e.target.value }))} style={iS}>
              <option>Active</option><option>Off Duty</option><option>Suspended</option>
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setDModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (dModal === 'add') {
              setDrivers(prev => [...prev, { ...dForm, id:'DRV-' + Date.now(), trips:0, rating:0 }])
              toast('Driver added', 'success')
            } else {
              setDrivers(prev => prev.map(x => x.id === dModal.id ? { ...x, ...dForm } : x))
              toast('Driver updated', 'success')
            }
            setDModal(null)
          }}>{dModal === 'add' ? 'Add Driver' : 'Save Changes'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
