import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import {
  Card, StatCard, Pill, SectionHead, BarChart, ProgressBar,
  Banner, Modal, Btn, EmptyState
} from '../../components/ui/SharedComponents'
import {
  IconGrid, IconDoc, IconBus, IconChart, IconTicket, IconCash,
  IconParcel, IconCar, IconUsers, IconAlert, IconSettings,
  IconReport, IconCheck, IconStar, IconWrench, IconShield
} from '../../components/ui/Icons'

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

const NAV_ITEMS = [
  { id:'overview',      label:'Overview',      Icon:IconGrid    },
  { id:'applications',  label:'Applications',  Icon:IconDoc,    badge:true },
  { id:'operators',     label:'Operators',     Icon:IconBus     },
  { id:'trips',         label:'Trips',         Icon:IconChart,  badge:true },
  { id:'bookings',      label:'Bookings',      Icon:IconTicket  },
  { id:'payments',      label:'Payments',      Icon:IconCash    },
  { id:'payouts',       label:'Payouts',       Icon:IconCash    },
  { id:'fleet',         label:'Fleet',         Icon:IconCar     },
  { id:'services',      label:'Services',      Icon:IconStar    },
  { id:'users',         label:'Users',         Icon:IconUsers   },
  { id:'alerts',        label:'Alerts',        Icon:IconAlert,  badge:true },
  { id:'audit',         label:'Audit Log',     Icon:IconShield  },
  { id:'syshealth',     label:'System',        Icon:IconWrench  },
  { id:'reports',       label:'Reports',       Icon:IconReport  },
  { id:'settings',      label:'Settings',      Icon:IconSettings},
]

const VEHICLES = [
  { id:'VH-001', reg:'UBF 001K', type:'67-Seater Coach', driver:'James Okello',   status:'Active',      fuel:72, op:'Raylane Fleet', ins:'2026-12-31', fit:'2026-09-30' },
  { id:'VH-002', reg:'UBF 002K', type:'67-Seater Coach', driver:'Sarah Nakato',   status:'Active',      fuel:91, op:'Raylane Fleet', ins:'2026-12-31', fit:'2026-08-15' },
  { id:'VH-003', reg:'UBF 003K', type:'14-Seater Taxi',  driver:'Peter Mwesiga', status:'Maintenance', fuel:35, op:'Raylane Fleet', ins:'2026-06-30', fit:'2026-07-01' },
]

const USERS = [
  { id:'U1', name:'James Okello',   email:'james@raylane.com',    role:'ADMIN',          op:'Raylane Express', status:'Active',    joined:'2024-01-15' },
  { id:'U2', name:'Sarah Nakato',   email:'sarah@raylane.com',    role:'DISPATCHER',     op:'Raylane Express', status:'Active',    joined:'2024-02-01' },
  { id:'U3', name:'John Ssemakula', email:'john@globalcoaches.ug',role:'OPERATOR_ADMIN', op:'Global Coaches',  status:'Active',    joined:'2024-01-16' },
  { id:'U4', name:'Grace Auma',     email:'grace@fastcoaches.ug', role:'OPERATOR_ADMIN', op:'Fast Coaches',    status:'Active',    joined:'2024-08-02' },
  { id:'U5', name:'Ali Nsubuga',    email:'ali@raylane.com',      role:'ACCOUNTANT',     op:'Raylane Express', status:'Suspended', joined:'2024-05-01' },
]

const PAYMENTS = [
  { id:'P1', type:'Rent',      vendor:'Kampala Properties', desc:'Office rent June 2026',      amount:2500000, due:'2026-06-01', status:'UNPAID'  },
  { id:'P2', type:'Utility',   vendor:'UMEME Ltd',           desc:'Electricity May 2026',        amount:380000,  due:'2026-05-20', status:'UNPAID'  },
  { id:'P3', type:'Utility',   vendor:'National Water',      desc:'Water bill Q2',               amount:145000,  due:'2026-05-25', status:'UNPAID'  },
  { id:'P4', type:'Insurance', vendor:'UAP Insurance',       desc:'Fleet insurance H1 2026',     amount:4200000, due:'2026-05-31', status:'UNPAID'  },
  { id:'P5', type:'Internet',  vendor:'MTN Business',        desc:'Fibre internet May 2026',     amount:320000,  due:'2026-05-15', status:'PAID'    },
  { id:'P6', type:'Rent',      vendor:'Kampala Properties',  desc:'Office rent May 2026',        amount:2500000, due:'2026-05-01', status:'PAID'    },
  { id:'P7', type:'Utility',   vendor:'UMEME Ltd',           desc:'Electricity workshop Q1',     amount:290000,  due:'2026-04-20', status:'OVERDUE' },
]

const SC_COLOR = { Active:'#15803d', Maintenance:'#d97706', Inactive:'#dc2626', Auctioned:'#7c3aed' }
const UC_COLOR = { ADMIN:'#7c3aed', OPERATOR_ADMIN:'#1d4ed8', DISPATCHER:'#15803d', ACCOUNTANT:'#d97706', LOADER:'#64748b' }
const PC_COLOR = { PAID:'#15803d', UNPAID:'#92400e', OVERDUE:'#dc2626' }

const SYS = [
  { label:'Booking Engine',  status:'Online',  ok:true,  uptime:'99.9%' },
  { label:'Payment Gateway', status:'Online',  ok:true,  uptime:'99.7%' },
  { label:'Seat Sync',       status:'Live',    ok:true,  uptime:'100%'  },
  { label:'SMS API',         status:'Active',  ok:true,  uptime:'98.4%' },
  { label:'MTN MoMo',        status:'Online',  ok:true,  uptime:'99.1%' },
  { label:'Airtel Money',    status:'Delayed', ok:false, uptime:'94.2%' },
]

const MODULE_DEFS = [
  { id:'booking_basic',    name:'Booking',    price:0      },
  { id:'parcel_basic',     name:'Parcels',    price:0      },
  { id:'financial_module', name:'Financial',  price:100000 },
  { id:'fuel_module',      name:'Fuel',       price:80000  },
  { id:'analytics_module', name:'Analytics',  price:100000 },
  { id:'hr_module',        name:'Staff/HR',   price:100000 },
  { id:'fleet_module',     name:'Fleet',      price:120000 },
  { id:'cost_center',      name:'Cost Center',price:80000  },
]

export default function AdminDashboard() {
  const { state, st, unreadCount, pendingTrips, pendingApps, adminNotifs } = useAdminStore()
  const toast    = useToast()
  const navigate = useNavigate()

  const [tab,      setTab]      = useState('overview')
  const [vehicles, setVehicles] = useState(VEHICLES)
  const [users,    setUsers]    = useState(USERS)
  const [payments, setPayments] = useState(PAYMENTS)
  const [vModal,   setVModal]   = useState(null)
  const [uModal,   setUModal]   = useState(null)
  const [pModal,   setPModal]   = useState(null)
  const [tripModal,setTripModal] = useState(null)
  const [svcModal, setSvcModal]  = useState(null)
  const [rejectR,  setRejectR]   = useState('')
  const [menuOpen, setMenuOpen]  = useState(false)
  const [vForm,    setVForm]     = useState({ reg:'', type:'67-Seater Coach', driver:'', status:'Active' })
  const [uForm,    setUForm]     = useState({ name:'', email:'', phone:'', role:'DISPATCHER', op:'Raylane Express', status:'Active' })

  const trips     = state.trips     || []
  const operators = state.operators || []
  const bookings  = state.bookings  || []
  const payouts   = state.payouts   || []
  const auditLog  = state.audit_log || []

  const approve = id => { st.approveTrip(id); toast('Trip approved', 'success') }
  const reject  = id => {
    if (!rejectR.trim()) { toast('Enter rejection reason', 'warning'); return }
    st.rejectTrip(id, rejectR)
    toast('Trip rejected', 'error')
    setTripModal(null); setRejectR('')
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>

      {/* -- SIDEBAR -- */}
      <div className={`dash-sidebar${menuOpen ? ' open' : ''}`}
        style={{ width:206, background:'#0a0f1e', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto', zIndex:100 }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:9, minHeight:54 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:'#FFC72C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="12" viewBox="0 0 20 16" fill="none"><path d="M1 13L7 3l5 6 4-6 3 10" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ ...P, fontWeight:700, fontSize:11, color:'#fff', lineHeight:1 }}>Raylane Admin</div>
            <div style={{ fontSize:9, color:'#FFC72C', marginTop:1 }}>Super Administrator</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'6px 0' }}>
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
            const bc = badge ? (id==='alerts' ? unreadCount : id==='trips' ? pendingTrips.length : id==='applications' ? pendingApps.length : 0) : 0
            const isActive = tab === id
            return (
              <button key={id} onClick={() => { setTab(id); setMenuOpen(false) }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:isActive ? 'rgba(255,199,44,.12)' : 'none', color:isActive ? '#FFC72C' : 'rgba(255,255,255,.65)', borderLeft:`3px solid ${isActive ? '#FFC72C' : 'transparent'}`, ...P, fontWeight:600, fontSize:11, border:'none', cursor:'pointer', width:'100%', textAlign:'left', transition:'all .18s' }}>
                <Icon size={14} color={isActive ? '#FFC72C' : 'rgba(255,255,255,.5)'}/>
                <span style={{ flex:1 }}>{label}</span>
                {bc > 0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700 }}>{bc}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column', gap:6 }}>
          <button onClick={() => { st.resetToInitial && st.resetToInitial(); sessionStorage.clear(); toast('Demo reset', 'success') }}
            style={{ width:'100%', padding:'6px', borderRadius:7, background:'rgba(255,100,100,.12)', color:'rgba(255,150,150,.8)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:9 }}>Reset Demo</button>
          <button onClick={() => navigate('/')}
            style={{ width:'100%', padding:'7px', borderRadius:7, background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.5)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:10 }}>Back to Site</button>
        </div>
      </div>

      {/* -- MAIN -- */}
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:22 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{ display:'none', width:36, height:36, borderRadius:9, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', alignItems:'center', justifyContent:'center' }} className="mob-menu-btn">
              <IconGrid size={16} color="#0B3D91"/>
            </button>
            <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(14px,2vw,20px)', margin:0 }}>
              {(NAV_ITEMS.find(n => n.id === tab) || {}).label || 'Dashboard'}
            </h1>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount > 0 && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:12 }}>{unreadCount} new</span>}
            <div style={{ width:32, height:32, borderRadius:9, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFC72C', ...P, fontWeight:800, fontSize:12 }}>AD</div>
          </div>
        </div>

        {/* -- OVERVIEW -- */}
        {tab === 'overview' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
              <StatCard label="Today's Bookings" value={bookings.length}                                         sub="+11.5%"      bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Revenue Today"     value="UGX 74.6M"                                              sub="+6.3%"       bg="#dcfce7" color="#15803d"/>
              <StatCard label="Active Operators"  value={operators.filter(o => o.status === 'ACTIVE').length}   sub="Live"        bg="#f3e8ff" color="#7c3aed"/>
              <StatCard label="Pending Actions"   value={pendingTrips.length + pendingApps.length}              sub="Need action" bg="#fef9c3" color="#92400e"/>
            </div>
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <Card>
                <SectionHead title="Pending Trip Approvals" count={pendingTrips.length} action="View All" onAction={() => setTab('trips')}/>
                {pendingTrips.length === 0
                  ? <EmptyState title="All caught up" desc="No trips awaiting approval"/>
                  : pendingTrips.slice(0, 3).map(t => (
                    <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:13 }}>{t.operator_name} -- {t.from} to {t.to}</div>
                        <div style={{ fontSize:11, color:'#64748b', ...I }}>{t.departs} -- {fmt(t.price)}</div>
                      </div>
                      <div style={{ display:'flex', gap:5 }}>
                        <Btn size="sm" variant="success" onClick={() => approve(t.id)}>Approve</Btn>
                        <Btn size="sm" variant="danger"  onClick={() => setTripModal({ trip:t, action:'reject' })}>Reject</Btn>
                      </div>
                    </div>
                  ))}
              </Card>
              <Card>
                <SectionHead title="New Applications" count={pendingApps.length} action="View All" onAction={() => setTab('applications')}/>
                {pendingApps.length === 0
                  ? <EmptyState title="No pending applications"/>
                  : pendingApps.slice(0, 3).map(a => (
                    <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:13 }}>{a.company_name}</div>
                        <div style={{ fontSize:11, color:'#64748b', ...I }}>{a.contact_name} -- {a.fleet_size} vehicles</div>
                      </div>
                      <Btn size="sm" variant="blue" onClick={() => { st.approveApplication(a.id); toast(a.company_name + ' approved', 'success') }}>Approve</Btn>
                    </div>
                  ))}
              </Card>
            </div>
            <Card style={{ background:'#0B3D91' }}>
              <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'space-around' }}>
                {[
                  ['Live Trips',    trips.filter(t => t.status === 'APPROVED').length,          '#7dd3fc'],
                  ['Total Bookings',bookings.length,                                             '#86efac'],
                  ['Operators',     operators.length,                                            '#FFC72C'],
                  ['Payouts Ready', payouts.filter(p => p.status === 'READY').length,           '#fca5a5'],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ textAlign:'center', color:'#fff' }}>
                    <div style={{ ...P, fontWeight:800, fontSize:28, color:c }}>{v}</div>
                    <div style={{ fontSize:12, opacity:.75 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* -- APPLICATIONS -- */}
        {tab === 'applications' && (
          <div>
            {(state.applications || []).map(a => (
              <Card key={a.id} style={{ marginBottom:12, borderLeft:`4px solid ${a.status === 'PENDING_REVIEW' ? '#FFC72C' : '#22c55e'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:6, flexWrap:'wrap' }}>
                      <span style={{ ...P, fontWeight:700, fontSize:16 }}>{a.company_name}</span>
                      <Pill text={a.status.replace(/_/g, ' ')} color={a.status === 'PENDING_REVIEW' ? '#92400e' : '#15803d'}/>
                    </div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>{a.contact_name} -- {a.phone} -- {a.fleet_size} vehicles</div>
                  </div>
                  {a.status === 'PENDING_REVIEW' && (
                    <div style={{ display:'flex', gap:8 }}>
                      <Btn variant="success" onClick={() => { st.approveApplication(a.id); toast(a.company_name + ' onboarded', 'success') }}>Approve</Btn>
                      <Btn variant="danger"  onClick={() => toast('Rejected', 'error')}>Reject</Btn>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* -- OPERATORS -- */}
        {tab === 'operators' && (
          <div>
            {operators.map(op => (
              <Card key={op.id} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                  <div>
                    <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:5, flexWrap:'wrap' }}>
                      <span style={{ ...P, fontWeight:700, fontSize:16 }}>{op.company_name}</span>
                      <Pill text={op.status}           color={op.status === 'ACTIVE' ? '#15803d' : '#dc2626'}/>
                      {op.operator_type === 'INTERNAL' && <Pill text="Raylane Fleet" color="#7c3aed" bg="#ede9fe"/>}
                    </div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>
                      {op.phone} -- Merchant: <strong style={{ color:'#0B3D91' }}>{op.merchant_code}</strong> -- Commission: {((op.commission_rate || 0) * 100)}%
                    </div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:8 }}>
                  {MODULE_DEFS.map(mod => {
                    const isAct = op.modules && op.modules[mod.id] && op.modules[mod.id].status === 'ACTIVE'
                    return (
                      <div key={mod.id} style={{ background:isAct ? '#dcfce7' : '#fff', borderRadius:10, padding:'10px 12px', border:`1px solid ${isAct ? '#22c55e' : '#E2E8F0'}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                        <div>
                          <div style={{ ...P, fontWeight:600, fontSize:12 }}>{mod.name}</div>
                          <div style={{ fontSize:10, color:'#64748b' }}>{isAct ? 'Active' : mod.price ? fmt(mod.price) + '/mo' : 'Free'}</div>
                        </div>
                        <button onClick={() => { isAct ? st.deactivateModule(op.id, mod.id) : setSvcModal({ op, module:mod }) }}
                          style={{ width:24, height:24, borderRadius:6, background:isAct ? '#fee2e2' : '#0B3D91', color:isAct ? '#dc2626' : '#fff', border:'none', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                          {isAct ? 'x' : '+'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* -- TRIPS -- */}
        {tab === 'trips' && (
          <div>
            <Banner type="info">Only APPROVED trips appear on the website. Internal fleet trips auto-approve.</Banner>
            {['PENDING_APPROVAL', 'APPROVED', 'REJECTED'].map(sg => {
              const grp = trips.filter(t => t.status === sg)
              if (!grp.length) return null
              return (
                <div key={sg} style={{ marginBottom:20 }}>
                  <h3 style={{ ...P, fontWeight:700, fontSize:12, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                    {sg === 'PENDING_APPROVAL' ? 'Awaiting Approval' : sg === 'APPROVED' ? 'Live on Website' : 'Rejected'}
                    <span style={{ marginLeft:8, background:'#E2E8F0', borderRadius:10, padding:'2px 8px', fontSize:11 }}>{grp.length}</span>
                  </h3>
                  {grp.map(t => (
                    <Card key={t.id} style={{ marginBottom:10, borderLeft:`4px solid ${t.status === 'APPROVED' ? '#22c55e' : t.status === 'PENDING_APPROVAL' ? '#FFC72C' : '#ef4444'}` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                        <div>
                          <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{t.operator_name} -- {t.from} to {t.to}</div>
                          <div style={{ fontSize:13, color:'#64748b', ...I }}>{t.departs} -- {t.seat_type}-seater -- {fmt(t.price)}/seat</div>
                          {t.rejection_reason && <div style={{ marginTop:6, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626' }}>{t.rejection_reason}</div>}
                        </div>
                        {t.status === 'PENDING_APPROVAL' && (
                          <div style={{ display:'flex', gap:6 }}>
                            <Btn size="sm" variant="success" onClick={() => approve(t.id)}>Approve</Btn>
                            <Btn size="sm" variant="danger"  onClick={() => setTripModal({ trip:t, action:'reject' })}>Reject</Btn>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {/* -- BOOKINGS -- */}
        {tab === 'bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={bookings.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['ID', 'Route', 'Seat', 'Method', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => {
                    const trip = trips.find(t => t.id === b.trip_id)
                    return (
                      <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{trip ? trip.from + ' to ' + trip.to : '--'}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                        <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(b.amount)}</td>
                        <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status === 'CONFIRMED' ? '#15803d' : '#dc2626'}/></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* -- PAYMENTS -- */}
        {tab === 'payments' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Unpaid Bills"    value={payments.filter(p => p.status === 'UNPAID').length}  sub="Due this month" bg="#fef9c3" color="#92400e"/>
              <StatCard label="Overdue"         value={payments.filter(p => p.status === 'OVERDUE').length} sub="Past due date"  bg="#fee2e2" color="#dc2626"/>
              <StatCard label="Total Outstanding" value={fmt(payments.filter(p => p.status !== 'PAID').reduce((s, p) => s + p.amount, 0))} sub="UGX" bg="#dbeafe" color="#1d4ed8"/>
            </div>
            <Card>
              <SectionHead title="Payment Obligations" action="Add Invoice" onAction={() => setPModal('add')}/>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                      {['Type', 'Vendor', 'Description', 'Amount', 'Due', 'Status', 'Actions'].map(h => (
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
                            <button onClick={() => setPModal(p)} style={{ padding:'4px 10px', borderRadius:8, background:'#F5F7FA', color:'#0B3D91', border:'1px solid #E2E8F0', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
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

        {/* -- PAYOUTS -- */}
        {tab === 'payouts' && (
          <div>
            <Banner type="info">Release payout to the operator merchant MoMo code. 8% commission is auto-deducted.</Banner>
            {payouts.map(p => (
              <Card key={p.id} style={{ marginBottom:12, borderLeft:`4px solid ${p.status === 'READY' ? '#FFC72C' : '#22c55e'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{p.operator_name}</div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>Merchant: <strong>{p.merchant_code}</strong></div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>Gross: {fmt(p.gross)}</div>
                    <div style={{ ...P, fontWeight:800, fontSize:20, color:'#15803d' }}>Net: {fmt(p.net)}</div>
                  </div>
                </div>
                <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                  {p.status === 'READY'
                    ? <Btn variant="success" onClick={() => { st.releasePayout && st.releasePayout(p.id); toast(fmt(p.net) + ' sent to ' + p.merchant_code, 'success') }}>Release Payout</Btn>
                    : <span style={{ fontSize:13, color:'#64748b', ...I }}>Released: {p.triggered_at}</span>}
                  <Pill text={p.status} color={p.status === 'READY' ? '#92400e' : '#1d4ed8'}/>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* -- FLEET -- */}
        {tab === 'fleet' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => setVModal('add')}>+ Add Vehicle</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
              {vehicles.map(v => (
                <Card key={v.id} style={{ borderLeft:`4px solid ${SC_COLOR[v.status] || '#E2E8F0'}` }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'rgba(11,61,145,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <IconBus size={22} color="#0B3D91"/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:3 }}>
                        <span style={{ ...P, fontWeight:700, fontSize:15 }}>{v.reg}</span>
                        <Pill text={v.status} color={SC_COLOR[v.status] || '#64748b'}/>
                      </div>
                      <div style={{ fontSize:12, color:'#64748b', ...I }}>{v.type} -- Driver: {v.driver}</div>
                    </div>
                  </div>
                  <ProgressBar value={v.fuel} max={100} label={'Fuel: ' + v.fuel + '%'} showPct height={5}/>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginTop:8, fontSize:11, color:'#64748b', ...I }}>
                    <span>Insurance: {v.ins}</span>
                    <span style={{ color: new Date(v.fit) < new Date() ? '#dc2626' : 'inherit' }}>Fitness: {v.fit}</span>
                  </div>
                  <div style={{ display:'flex', gap:7, marginTop:12, flexWrap:'wrap' }}>
                    <button onClick={() => { setVForm({ ...v }); setVModal(v) }}
                      style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                    <button onClick={() => { setVehicles(prev => prev.map(x => x.id === v.id ? { ...x, status: x.status === 'Active' ? 'Maintenance' : 'Active' } : x)); toast(v.reg + ' status updated', 'success') }}
                      style={{ padding:'6px 12px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                      {v.status === 'Active' ? 'Set Maintenance' : 'Set Active'}
                    </button>
                    <button onClick={() => { setVehicles(prev => prev.filter(x => x.id !== v.id)); toast(v.reg + ' deleted', 'error') }}
                      style={{ padding:'6px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Delete</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* -- SERVICES -- */}
        {tab === 'services' && (
          <div>
            {operators.filter(op => op.operator_type !== 'INTERNAL').map(op => (
              <Card key={op.id} style={{ marginBottom:16 }}>
                <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:14 }}>{op.company_name}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:10 }}>
                  {MODULE_DEFS.filter(m => m.price > 0).map(mod => {
                    const isAct = op.modules && op.modules[mod.id] && op.modules[mod.id].status === 'ACTIVE'
                    return (
                      <div key={mod.id} style={{ border:`1.5px solid ${isAct ? '#22c55e' : '#E2E8F0'}`, borderRadius:12, padding:14, background:isAct ? '#dcfce7' : '#fff' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                          <div style={{ ...P, fontWeight:600, fontSize:13 }}>{mod.name}</div>
                          {isAct ? <Pill text="Active" color="#15803d"/> : <Pill text={fmt(mod.price) + '/mo'} color="#1d4ed8" bg="#dbeafe"/>}
                        </div>
                        {isAct
                          ? <Btn size="sm" variant="danger" full onClick={() => { st.deactivateModule(op.id, mod.id); toast('Deactivated', 'warning') }}>Deactivate</Btn>
                          : <Btn size="sm" variant="blue"   full onClick={() => setSvcModal({ op, module:mod })}>Activate</Btn>}
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* -- USERS -- */}
        {tab === 'users' && (
          <div>
            <Banner type="info">Manages Raylane and all operator users. Operator user requests appear below for approval.</Banner>
            <div style={{ background:'#fef9c3', borderRadius:14, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <div>
                <div style={{ ...P, fontWeight:700, fontSize:13, color:'#92400e', marginBottom:2 }}>Pending User Request -- Global Coaches</div>
                <div style={{ fontSize:12, ...I, color:'#78350f' }}>John Mugisha -- Dispatcher -- john@globalcoaches.ug -- Submitted 2h ago</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn size="sm" variant="success" onClick={() => toast('Account created. Login sent to john@globalcoaches.ug','success')}>Approve</Btn>
                <Btn size="sm" variant="danger"  onClick={() => toast('Request declined','error')}>Decline</Btn>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => { setUForm({ name:'', email:'', phone:'', role:'DISPATCHER', op:'Raylane Express', status:'Active' }); setUModal('add') }}>+ Add User</Btn>
            </div>
            <Card>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                      {['Name', 'Email', 'Role', 'Operator', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:13 }}>{u.name}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{u.email}</td>
                        <td style={{ padding:'10px' }}><Pill text={u.role.replace(/_/g, ' ')} color={UC_COLOR[u.role] || '#64748b'}/></td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{u.op}</td>
                        <td style={{ padding:'10px' }}><Pill text={u.status} color={u.status === 'Active' ? '#15803d' : '#dc2626'}/></td>
                        <td style={{ padding:'10px' }}>
                          <div style={{ display:'flex', gap:5 }}>
                            <button onClick={() => { setUForm({ ...u }); setUModal(u) }}
                              style={{ padding:'4px 10px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                            <button onClick={() => { setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === 'Active' ? 'Suspended' : 'Active' } : x)); toast('Status toggled', 'success') }}
                              style={{ padding:'4px 10px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button onClick={() => { setUsers(prev => prev.filter(x => x.id !== u.id)); toast('User deleted', 'error') }}
                              style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Delete</button>
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

        {/* -- ALERTS -- */}
        {tab === 'alerts' && (
          <Card>
            <SectionHead title="Notifications" action="Mark all read" onAction={() => { st.markAdminRead && st.markAdminRead(); toast('All read', 'success') }}/>
            {adminNotifs.length === 0
              ? <EmptyState title="All caught up" desc="No new notifications"/>
              : adminNotifs.map((n, i) => (
                <div key={n.id || i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom: i < adminNotifs.length - 1 ? '1px solid #E2E8F0' : '', background:!n.read ? '#f8faff' : '' }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <IconAlert size={14} color="#1d4ed8"/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:2 }}>{n.msg}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{n.time}</div>
                  </div>
                  {!n.read && <span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:9, ...P, fontWeight:700 }}>NEW</span>}
                </div>
              ))}
          </Card>
        )}

        {/* -- AUDIT LOG -- */}
        {tab === 'audit' && (
          <Card>
            <SectionHead title="Audit Log"/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['Time', 'Action', 'Actor', 'Detail'].map(h => (
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((e, i) => (
                    <tr key={e.id || i} style={{ borderBottom:'1px solid #E2E8F0' }}
                      onMouseEnter={ex => ex.currentTarget.style.background = '#F5F7FA'}
                      onMouseLeave={ex => ex.currentTarget.style.background = ''}>
                      <td style={{ padding:'9px 10px', fontSize:11, color:'#64748b', ...I, whiteSpace:'nowrap' }}>{e.time}</td>
                      <td style={{ padding:'9px 10px' }}><Pill text={e.action.replace(/_/g, ' ')} color="#1d4ed8" bg="#dbeafe"/></td>
                      <td style={{ padding:'9px 10px', fontSize:12, ...P, fontWeight:600 }}>{e.actor}</td>
                      <td style={{ padding:'9px 10px', fontSize:12, color:'#64748b', ...I }}>{e.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* -- SYSTEM -- */}
        {tab === 'syshealth' && (
          <div>
            <Card style={{ marginBottom:14 }}>
              <SectionHead title="Service Status"/>
              {SYS.map((m, i) => (
                <div key={m.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:i < SYS.length - 1 ? '1px solid #E2E8F0' : '' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:m.ok ? '#22c55e' : '#f59e0b' }}/>
                    <span style={{ ...P, fontWeight:600, fontSize:14 }}>{m.label}</span>
                  </div>
                  <div style={{ display:'flex', gap:16 }}>
                    <span style={{ fontSize:12, color:'#64748b', ...I }}>Uptime: {m.uptime}</span>
                    <Pill text={m.status} color={m.ok ? '#15803d' : '#d97706'}/>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHead title="Revenue Today"/>
              <BarChart data={[30,55,40,80,65,90,75]} labels={['06:00','08:00','10:00','12:00','14:00','16:00','18:00']} height={100}/>
            </Card>
          </div>
        )}

        {/* -- REPORTS -- */}
        {tab === 'reports' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Monthly Revenue"   value="UGX 74.6M" sub="+6.3%"  bg="#dcfce7" color="#15803d"/>
              <StatCard label="Total Bookings"    value={bookings.length}         bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Commission Earned" value="UGX 5.97M"              bg="#fef9c3" color="#92400e"/>
              <StatCard label="Active Operators"  value={operators.filter(o => o.status === 'ACTIVE').length} bg="#f3e8ff" color="#7c3aed"/>
            </div>
            <Card>
              <SectionHead title="Monthly Revenue" action="Export CSV" onAction={() => toast('Generating report...', 'success')}/>
              <BarChart data={[42,58,51,73,69,90,75,82,95,88,74,92]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} height={120}/>
            </Card>
          </div>
        )}

        {/* -- SETTINGS -- */}
        {tab === 'settings' && (
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Commission Settings"/>
              <div style={{ ...P, fontWeight:800, fontSize:36, color:'#0B3D91', marginBottom:8 }}>8%</div>
              <p style={{ fontSize:14, color:'#64748b', ...I, marginBottom:14 }}>Applied on all external operator bookings. Deducted at payout.</p>
              <Banner type="warning">Contact development team before modifying. Changes affect all future payouts.</Banner>
            </Card>
            <Card>
              <SectionHead title="Platform Info"/>
              {[['Version','v7.0 Production'],['Database','Supabase PostgreSQL'],['Payments','MTN MoMo + Airtel + DPO'],['SMS','Africa Talking API'],['Tagline','Tusimbudde']].map(([l, v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <span style={{ ...P, fontWeight:600, fontSize:13 }}>{l}</span>
                  <span style={{ fontSize:13, color:'#64748b', ...I }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* -- TRIP REJECT MODAL -- */}
      <Modal open={!!tripModal} onClose={() => { setTripModal(null); setRejectR('') }} title="Reject Trip">
        {tripModal && (
          <div>
            <div style={{ background:'#F5F7FA', borderRadius:12, padding:14, marginBottom:14 }}>
              <div style={{ ...P, fontWeight:700, fontSize:15 }}>{tripModal.trip.operator_name} -- {tripModal.trip.from} to {tripModal.trip.to}</div>
              <div style={{ fontSize:13, color:'#64748b', ...I, marginTop:4 }}>{tripModal.trip.departs} -- {fmt(tripModal.trip.price)}/seat</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lS}>Rejection Reason *</label>
              <textarea value={rejectR} onChange={e => setRejectR(e.target.value)} placeholder="Explain why this trip is being rejected..." rows={3} style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <Btn variant="ghost" full onClick={() => setTripModal(null)}>Cancel</Btn>
              <Btn variant="danger" full onClick={() => reject(tripModal.trip.id)}>Confirm Rejection</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* -- SERVICE ACTIVATION MODAL -- */}
      <Modal open={!!svcModal} onClose={() => setSvcModal(null)} title={svcModal ? 'Activate: ' + svcModal.module.name : ''}>
        {svcModal && (
          <div>
            <div style={{ background:'#F5F7FA', borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{svcModal.module.name}</div>
              <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(svcModal.module.price)}<span style={{ fontSize:12, color:'#64748b', fontWeight:400 }}>/month</span></div>
            </div>
            <Banner type="warning">Confirm payment received from <strong>{svcModal.op.company_name}</strong> before activating. This is logged in the audit trail.</Banner>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <Btn variant="ghost" full onClick={() => setSvcModal(null)}>Cancel</Btn>
              <Btn variant="gold"  full onClick={() => { st.activateModule(svcModal.op.id, svcModal.module.id); toast(svcModal.module.name + ' activated', 'success'); setSvcModal(null) }}>Confirm Activation</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* -- VEHICLE MODAL -- */}
      <Modal open={!!vModal} onClose={() => setVModal(null)} title={vModal === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['reg','Registration Plate'],['driver','Driver Name']].map(([k, l]) => (
            <div key={k}><label style={lS}>{l}</label><input value={vForm[k] || ''} onChange={e => setVForm(f => ({ ...f, [k]:e.target.value }))} style={iS}/></div>
          ))}
          <div><label style={lS}>Vehicle Type</label>
            <select value={vForm.type || '67-Seater Coach'} onChange={e => setVForm(f => ({ ...f, type:e.target.value }))} style={iS}>
              <option>67-Seater Coach</option><option>14-Seater Taxi</option>
            </select>
          </div>
          <div><label style={lS}>Status</label>
            <select value={vForm.status || 'Active'} onChange={e => setVForm(f => ({ ...f, status:e.target.value }))} style={iS}>
              {['Active','Maintenance','Inactive'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setVModal(null)}>Cancel</Btn>
          <Btn variant="blue"  full onClick={() => {
            if (vModal === 'add') {
              setVehicles(prev => [...prev, { ...vForm, id:'VH-' + Date.now(), fuel:100, op:'Raylane Fleet', ins:'TBD', fit:'TBD' }])
              toast('Vehicle added', 'success')
            } else {
              setVehicles(prev => prev.map(x => x.id === vModal.id ? { ...x, ...vForm } : x))
              toast('Vehicle updated', 'success')
            }
            setVModal(null)
          }}>{vModal === 'add' ? 'Add Vehicle' : 'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* -- USER MODAL -- */}
      <Modal open={!!uModal} onClose={() => setUModal(null)} title={uModal === 'add' ? 'Add User' : 'Edit User'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['name','Full Name'],['email','Email']].map(([k, l]) => (
            <div key={k}><label style={lS}>{l}</label><input value={uForm[k] || ''} onChange={e => setUForm(f => ({ ...f, [k]:e.target.value }))} style={iS}/></div>
          ))}
          <div><label style={lS}>Role</label>
            <select value={uForm.role || 'DISPATCHER'} onChange={e => setUForm(f => ({ ...f, role:e.target.value }))} style={iS}>
              {['ADMIN','OPERATOR_ADMIN','DISPATCHER','ACCOUNTANT','LOADER'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label style={lS}>Status</label>
            <select value={uForm.status || 'Active'} onChange={e => setUForm(f => ({ ...f, status:e.target.value }))} style={iS}>
              {['Active','Suspended'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setUModal(null)}>Cancel</Btn>
          <Btn variant="blue"  full onClick={() => {
            if (uModal === 'add') {
              setUsers(prev => [...prev, { ...uForm, id:'U-' + Date.now(), joined: new Date().toISOString().split('T')[0] }])
              toast('User created', 'success')
            } else {
              setUsers(prev => prev.map(x => x.id === uModal.id ? { ...x, ...uForm } : x))
              toast('User updated', 'success')
            }
            setUModal(null)
          }}>{uModal === 'add' ? 'Create User' : 'Save Changes'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
