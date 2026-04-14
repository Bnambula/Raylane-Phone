import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Modal, Btn, Input, EmptyState } from '../../components/ui/SharedComponents'

const P  = { fontFamily:"'Poppins',sans-serif" }
const I  = { fontFamily:"'Inter',sans-serif" }
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }
const fmt = n => 'UGX ' + Number(n).toLocaleString()

const MODULE_DEFS = [
  { id:'booking_basic',    name:'Booking System',   price:0,      default:true },
  { id:'parcel_basic',     name:'Parcel System',    price:0,      default:true },
  { id:'financial_module', name:'Financial Module', price:100000 },
  { id:'fuel_module',      name:'Fuel Management',  price:80000  },
  { id:'sacco_module',     name:'Sacco Module',     price:200000 },
  { id:'analytics_module', name:'Analytics',        price:100000 },
  { id:'hr_module',        name:'Staff / HR',       price:100000 },
  { id:'fleet_module',     name:'Fleet Maintenance',price:120000 },
  { id:'cost_center',      name:'Cost Center',      price:80000  },
]

const DEMO_VEHICLES = [
  { id:'VH-001', operator:'Raylane Express Fleet', reg:'UBF 001K', type:'67-Seater Coach', driver:'James Okello',  status:'Active',      fuel:72, mileage:124500, insurance:'2026-12-31', fitness:'2026-09-30' },
  { id:'VH-002', operator:'Raylane Express Fleet', reg:'UBF 002K', type:'67-Seater Coach', driver:'Sarah Nakato',  status:'Active',      fuel:91, mileage:89200,  insurance:'2026-12-31', fitness:'2026-08-15' },
  { id:'VH-003', operator:'Raylane Express Fleet', reg:'UBF 003K', type:'14-Seater Taxi',  driver:'Peter Mwesiga',status:'Maintenance', fuel:35, mileage:212000, insurance:'2026-06-30', fitness:'2026-07-01' },
  { id:'VH-004', operator:'Global Coaches Ltd',    reg:'UAR 901J', type:'67-Seater Coach', driver:'Moses Kato',    status:'Active',      fuel:78, mileage:98000,  insurance:'2026-11-30', fitness:'2026-10-15' },
]

const DEMO_USERS = [
  { id:'USR-001', name:'James Okello',   email:'james@raylane.com',   role:'ADMIN',             operator:'Raylane Express', phone:'0771-001-001', status:'Active',    joined:'2024-01-15' },
  { id:'USR-002', name:'Sarah Nakato',   email:'sarah@raylane.com',   role:'DISPATCHER',        operator:'Raylane Express', phone:'0700-002-002', status:'Active',    joined:'2024-02-01' },
  { id:'USR-003', name:'John Ssemakula', email:'john@globalcoaches.ug',role:'OPERATOR_ADMIN',    operator:'Global Coaches Ltd', phone:'0771-234-567', status:'Active', joined:'2024-01-16' },
  { id:'USR-004', name:'Peter Ochieng',  email:'peter@linkbus.ug',    role:'OPERATOR_ADMIN',    operator:'Link Bus',        phone:'0752-456-789', status:'Active',    joined:'2024-02-21' },
  { id:'USR-005', name:'Grace Auma',     email:'grace@fastcoaches.ug',role:'OPERATOR_ADMIN',    operator:'Fast Coaches Ltd',phone:'0752-678-901', status:'Active',    joined:'2024-08-02' },
  { id:'USR-006', name:'Moses Kato',     email:'moses@globalcoaches.ug',role:'LOADER',          operator:'Global Coaches Ltd', phone:'0771-400-400', status:'Active', joined:'2024-03-10' },
  { id:'USR-007', name:'Ali Nsubuga',    email:'ali@raylane.com',     role:'ACCOUNTANT',        operator:'Raylane Express', phone:'0700-700-700', status:'Suspended', joined:'2024-05-01' },
]

const DEMO_PAYMENTS = [
  { id:'PMT-001', type:'Utility',    vendor:'UMEME Ltd',            description:'Electricity -- Kampala office May 2026',    amount:380000,  due:'2026-05-20', status:'UNPAID',   period:'May 2026' },
  { id:'PMT-002', type:'Rent',       vendor:'Kampala Properties Ltd', description:'Office rent -- Kampala Coach Park, June', amount:2500000, due:'2026-06-01', status:'UNPAID',   period:'Jun 2026' },
  { id:'PMT-003', type:'Utility',    vendor:'National Water',        description:'Water bill -- garage and office Q2',        amount:145000,  due:'2026-05-25', status:'UNPAID',   period:'Q2 2026'  },
  { id:'PMT-004', type:'Insurance',  vendor:'UAP Insurance Uganda',  description:'Fleet insurance premium -- all RLX vehicles',amount:4200000, due:'2026-05-31', status:'UNPAID',  period:'H1 2026'  },
  { id:'PMT-005', type:'Internet',   vendor:'MTN Business',          description:'Fibre internet -- HQ and dispatch office',   amount:320000,  due:'2026-05-15', status:'PAID',     period:'May 2026' },
  { id:'PMT-006', type:'Rent',       vendor:'Kampala Properties Ltd', description:'Office rent -- Kampala Coach Park, May',   amount:2500000, due:'2026-05-01', status:'PAID',     period:'May 2026' },
  { id:'PMT-007', type:'Utility',    vendor:'UMEME Ltd',             description:'Electricity -- garage workshop Q1',          amount:290000,  due:'2026-04-20', status:'OVERDUE',  period:'Q1 2026'  },
  { id:'PMT-008', type:'Cleaning',   vendor:'CleanPro Uganda',       description:'Weekly cleaning service -- HQ office',       amount:180000,  due:'2026-05-28', status:'UNPAID',   period:'May 2026' },
]

const SC = { ACTIVE:'#15803d', MAINTENANCE:'#d97706', INACTIVE:'#dc2626', AUCTIONED:'#7c3aed' }
const UC = { ADMIN:'#7c3aed', OPERATOR_ADMIN:'#1d4ed8', DISPATCHER:'#15803d', ACCOUNTANT:'#d97706', LOADER:'#64748b' }
const PC = { PAID:'#15803d', UNPAID:'#92400e', OVERDUE:'#dc2626' }

const NAV = [
  {icon:'grid', label:'Overview',      id:'overview'},
  {icon:'doc',  label:'Applications',  id:'applications', badge:true},
  {icon:'bus',  label:'Operators',     id:'operators'},
  {icon:'map',  label:'Trips',         id:'trips',        badge:true},
  {icon:'tick', label:'Bookings',      id:'bookings'},
  {icon:'cash', label:'Payments',      id:'payments'},
  {icon:'out',  label:'Payouts',       id:'payouts'},
  {icon:'box',  label:'Parcels',       id:'parcels'},
  {icon:'car',  label:'Fleet',         id:'fleet'},
  {icon:'shop', label:'Services',      id:'services'},
  {icon:'usr',  label:'Users',         id:'users'},
  {icon:'bell', label:'Alerts',        id:'alerts',       badge:true},
  {icon:'log',  label:'Audit Log',     id:'audit'},
  {icon:'sys',  label:'System',        id:'syshealth'},
  {icon:'rpt',  label:'Reports',       id:'reports'},
  {icon:'set',  label:'Settings',      id:'settings'},
]

const SYS = [
  { label:'Booking Engine',  status:'Online',  uptime:'99.9%', ok:true },
  { label:'Payment Gateway', status:'Online',  uptime:'99.7%', ok:true },
  { label:'Seat Sync',       status:'Live',    uptime:'100%',  ok:true },
  { label:'SMS API',         status:'Active',  uptime:'98.4%', ok:true },
  { label:'MTN MoMo',        status:'Online',  uptime:'99.1%', ok:true },
  { label:'Airtel Money',    status:'Delayed', uptime:'94.2%', ok:false },
]

export default function AdminDashboard() {
  const { state, st, unreadCount, pendingTrips, pendingApps, totalRevenue, totalCommission, adminNotifs } = useAdminStore()
  const [active,   setActive]   = useState('overview')
  const [tripModal,setTripModal] = useState(null)
  const [svcModal, setSvcModal]  = useState(null)
  const [rejectR,  setRejectR]   = useState('')
  const [editForm, setEditForm]  = useState({})
  /* fleet state */
  const [vehicles, setVehicles]  = useState(DEMO_VEHICLES)
  const [vModal,   setVModal]    = useState(null)  // null | 'add' | vehicle obj
  const [vForm,    setVForm]     = useState({ reg:'', type:'67-Seater Coach', driver:'', operator:'Raylane Express Fleet', status:'Active' })
  /* users state */
  const [users,    setUsers]     = useState(DEMO_USERS)
  const [uModal,   setUModal]    = useState(null)
  const [uForm,    setUForm]     = useState({ name:'', email:'', phone:'', role:'DISPATCHER', operator:'Raylane Express', status:'Active' })
  /* payments state */
  const [payments, setPayments]  = useState(DEMO_PAYMENTS)
  const [pModal,   setPModal]    = useState(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toast    = useToast()
  const navigate = useNavigate()

  const approve = id => { st.approveTrip(id); toast('Trip approved and live','success') }
  const reject  = id => {
    if (!rejectR.trim()) { toast('Enter rejection reason','warning'); return }
    st.rejectTrip(id, rejectR); toast('Trip rejected','error')
    setTripModal(null); setRejectR('')
  }

  /* -- Sidebar -- */
  const renderSidebar = () => (
    <div style={{ width:206, background:'#0a0f1e', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
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
        {NAV.map(item => {
          const bc = item.badge ? (item.id==='alerts'?unreadCount:item.id==='trips'?pendingTrips.length:item.id==='applications'?pendingApps.length:0) : 0
          return (
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,.12)':'none', color:active===item.id?'#FFC72C':'rgba(255,255,255,.65)', borderLeft:`3px solid ${active===item.id?'#FFC72C':'transparent'}`, ...P, fontWeight:600, fontSize:11, whiteSpace:'nowrap', border:'none', cursor:'pointer', width:'100%', textAlign:'left', transition:'all .18s' }}>
              <span style={{ flex:1 }}>{item.label}</span>
              {bc>0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700 }}>{bc}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column', gap:6 }}>
        <button onClick={()=>{st.resetToInitial ? st.resetToInitial() : window.location.reload();toast('Demo reset','success')}} style={{ width:'100%', padding:'6px', borderRadius:7, background:'rgba(255,100,100,.12)', color:'rgba(255,150,150,.8)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:9 }}>Reset Demo</button>
        <button onClick={()=>navigate('/')} style={{ width:'100%', padding:'7px', borderRadius:7, background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.5)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:10 }}>Back to Site</button>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)', position:'relative' }}>
      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.5)', zIndex:50, display:'none' }} className="mob-overlay"/>}
      {renderSidebar()}
      <div style={{ flex:1, overflowY:'auto', padding:22 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(14px,2vw,20px)', margin:0 }}>
            {NAV.find(n=>n.id===active)?.label || 'Dashboard'}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount>0 && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:12 }}>
              {unreadCount} new alert{unreadCount!==1?'s':''}
            </span>}
            <div style={{ width:32, height:32, borderRadius:9, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFC72C', ...P, fontWeight:800, fontSize:12 }}>AD</div>
          </div>
        </div>

        {/* == OVERVIEW == */}
        {active==='overview' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
            <StatCard icon="[TKT]" label="Daily Bookings"   value={state.bookings.length} sub="+11.5%" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="[UGX]" label="Revenue Today"    value="UGX 74.6M"              sub="+6.3%"  bg="#dcfce7" color="#15803d"/>
            <StatCard icon="[BUS]" label="Active Operators" value={state.operators.filter(o=>o.status==='ACTIVE').length} sub="Live" bg="#f3e8ff" color="#7c3aed"/>
            <StatCard icon="[!]"   label="Pending Actions"  value={pendingTrips.length+pendingApps.length} sub="Action needed" bg="#fef9c3" color="#92400e"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <Card>
              <SectionHead title="Pending Approvals" count={pendingTrips.length} action="View All" onAction={()=>setActive('trips')}/>
              {pendingTrips.length===0 ? <EmptyState icon="[OK]" title="All clear"/> : pendingTrips.slice(0,3).map(t=>(
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13 }}>{t.operator_name} -- {t.from}-{t.to}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{t.departs} -- {fmt(t.price)}</div>
                  </div>
                  <div style={{ display:'flex', gap:5 }}>
                    <Btn size="sm" variant="success" onClick={()=>approve(t.id)}>Approve</Btn>
                    <Btn size="sm" variant="danger"  onClick={()=>setTripModal({trip:t,action:'reject'})}>Reject</Btn>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHead title="Applications" count={pendingApps.length} action="View All" onAction={()=>setActive('applications')}/>
              {pendingApps.length===0 ? <EmptyState icon="[OK]" title="No pending"/> : pendingApps.slice(0,3).map(a=>(
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:600, fontSize:13 }}>{a.company_name}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{a.contact_name} -- {a.fleet_size} vehicles</div>
                  </div>
                  <Btn size="sm" variant="blue" onClick={()=>{st.approveApplication(a.id);toast(`${a.company_name} approved`,'success')}}>Approve</Btn>
                </div>
              ))}
            </Card>
          </div>
          <Card style={{ background:'#0B3D91' }}>
            <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'space-around' }}>
              {[['Live Trips',state.trips.filter(t=>t.status==='APPROVED').length,'#7dd3fc'],['Total Bookings',state.bookings.length,'#86efac'],['Operators',state.operators.length,'#FFC72C'],['System',SYS.filter(s=>s.ok).length+'/'+SYS.length,'#c4b5fd']].map(([l,v,c])=>(
                <div key={l} style={{ textAlign:'center', color:'#fff' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:28, color:c }}>{v}</div>
                  <div style={{ fontSize:12, opacity:.75 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </>)}

        {/* == APPLICATIONS == */}
        {active==='applications' && (
          state.applications.map(a=>(
            <Card key={a.id} style={{ marginBottom:12, borderLeft:`4px solid ${a.status==='PENDING_REVIEW'?'#FFC72C':a.status==='APPROVED'?'#22c55e':'#ef4444'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:6, flexWrap:'wrap' }}>
                    <span style={{ ...P, fontWeight:700, fontSize:16 }}>{a.company_name}</span>
                    <Pill text={a.status.replace(/_/g,' ')} color={a.status==='PENDING_REVIEW'?'#92400e':a.status==='APPROVED'?'#15803d':'#dc2626'}/>
                  </div>
                  <div style={{ fontSize:13, color:'#64748b', ...I }}>{a.contact_name} -- {a.phone} -- {a.fleet_size} vehicles</div>
                </div>
                {a.status==='PENDING_REVIEW' && (
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn variant="success" onClick={()=>{st.approveApplication(a.id);toast(`${a.company_name} onboarded`,'success')}}>Approve and Create Account</Btn>
                    <Btn variant="danger"  onClick={()=>toast('Rejected','error')}>Reject</Btn>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}

        {/* == OPERATORS == */}
        {active==='operators' && state.operators.map(op=>(
          <Card key={op.id} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
              <div>
                <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:5, flexWrap:'wrap' }}>
                  <span style={{ ...P, fontWeight:700, fontSize:16 }}>{op.company_name}</span>
                  <Pill text={op.status} color={op.status==='ACTIVE'?'#15803d':'#dc2626'}/>
                  {op.operator_type==='INTERNAL' && <Pill text="Raylane Fleet" color="#7c3aed" bg="#ede9fe"/>}
                </div>
                <div style={{ fontSize:13, color:'#64748b', ...I }}>{op.phone} -- Merchant: <strong style={{ color:'#0B3D91' }}>{op.merchant_code}</strong> -- Commission: {(op.commission_rate*100)||0}%</div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8 }}>
              {MODULE_DEFS.map(mod=>{
                const isActive = op.modules?.[mod.id]?.status==='ACTIVE'
                return (
                  <div key={mod.id} style={{ background:isActive?'#dcfce7':'#fff', borderRadius:10, padding:'10px 12px', border:`1px solid ${isActive?'#22c55e':'#E2E8F0'}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                    <div>
                      <div style={{ ...P, fontWeight:600, fontSize:12 }}>{mod.name}</div>
                      <div style={{ fontSize:10, color:'#64748b' }}>{isActive?'Active':mod.price?fmt(mod.price)+'/mo':'Free'}</div>
                    </div>
                    <button onClick={()=>{isActive?st.deactivateModule(op.id,mod.id):setSvcModal({op,module:mod})}} style={{ width:24, height:24, borderRadius:6, background:isActive?'#fee2e2':'#0B3D91', color:isActive?'#dc2626':'#fff', border:'none', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                      {isActive?'x':'+'}
                    </button>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}

        {/* == TRIPS == */}
        {active==='trips' && (<>
          <Banner type="info">Only APPROVED trips appear on the website. Internal fleet trips are auto-approved.</Banner>
          {['PENDING_APPROVAL','APPROVED','REJECTED'].map(sg=>{
            const grp = state.trips.filter(t=>t.status===sg)
            if (!grp.length) return null
            return (
              <div key={sg} style={{ marginBottom:20 }}>
                <h3 style={{ ...P, fontWeight:700, fontSize:12, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                  {sg==='PENDING_APPROVAL'?'Awaiting Approval':sg==='APPROVED'?'Live on Website':'Rejected'}
                  <span style={{ marginLeft:8, background:'#E2E8F0', color:'#64748b', borderRadius:10, padding:'2px 8px', fontSize:11 }}>{grp.length}</span>
                </h3>
                {grp.map(t=>(
                  <Card key={t.id} style={{ marginBottom:10, borderLeft:`4px solid ${t.status==='APPROVED'?'#22c55e':t.status==='PENDING_APPROVAL'?'#FFC72C':'#ef4444'}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                      <div>
                        <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{t.operator_name} -- {t.from} to {t.to}</div>
                        <div style={{ fontSize:13, color:'#64748b', ...I }}>{t.departs} -- {t.date} -- {t.seat_type}-seater -- {fmt(t.price)}/seat</div>
                        {t.rejection_reason && <div style={{ marginTop:6, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626' }}>{t.rejection_reason}</div>}
                      </div>
                      {t.status==='PENDING_APPROVAL' && (
                        <div style={{ display:'flex', gap:6 }}>
                          <Btn size="sm" variant="success" onClick={()=>approve(t.id)}>Approve</Btn>
                          <Btn size="sm" variant="blue"    onClick={()=>{setTripModal({trip:t,action:'edit'});setEditForm({price:t.price,departs:t.departs})}}>Edit</Btn>
                          <Btn size="sm" variant="danger"  onClick={()=>setTripModal({trip:t,action:'reject'})}>Reject</Btn>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )
          })}
        </>)}

        {/* == BOOKINGS == */}
        {active==='bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={state.bookings.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['ID','Route','Seat','Method','Amount','Status'].map(h=><th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>)}
                </tr></thead>
                <tbody>{state.bookings.map(b=>{
                  const trip=state.trips.find(t=>t.id===b.trip_id)
                  return (
                    <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{trip?.from}-{trip?.to}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                      <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(b.amount)}</td>
                      <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status==='CONFIRMED'?'#15803d':'#dc2626'}/></td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          </Card>
        )}

        {/* == PAYMENTS MODULE == */}
        {active==='payments' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
            <StatCard label="Unpaid Bills"  value={payments.filter(p=>p.status==='UNPAID').length}  sub="Due this month" bg="#fef9c3" color="#92400e"/>
            <StatCard label="Overdue"       value={payments.filter(p=>p.status==='OVERDUE').length} sub="Past due date" bg="#fee2e2" color="#dc2626"/>
            <StatCard label="Total Unpaid"  value={fmt(payments.filter(p=>p.status!=='PAID').reduce((s,p)=>s+p.amount,0))} sub="Outstanding" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard label="Paid This Month" value={payments.filter(p=>p.status==='PAID').length} sub="Settled" bg="#dcfce7" color="#15803d"/>
          </div>
          <Banner type="info">Payments here cover operational expenses: office rent, utilities, insurance, and services. Pay against a vendor invoice or mark as paid.</Banner>
          <Card>
            <SectionHead title="Payment Obligations" action="Add Invoice" onAction={()=>setPModal('add')}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Type','Vendor','Description','Amount','Due','Period','Status','Actions'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {payments.map((p,i)=>(
                    <tr key={p.id} style={{ borderBottom:'1px solid #E2E8F0', background:p.status==='OVERDUE'?'#fff8f8':'' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=p.status==='OVERDUE'?'#fff8f8':''}>
                      <td style={{ padding:'10px' }}><Pill text={p.type} color="#1d4ed8" bg="#dbeafe"/></td>
                      <td style={{ padding:'10px', ...P, fontWeight:600, fontSize:13 }}>{p.vendor}</td>
                      <td style={{ padding:'10px', fontSize:12, color:'#64748b', ...I, maxWidth:200 }}>{p.description}</td>
                      <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:13, color:'#0B3D91' }}>{fmt(p.amount)}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I, whiteSpace:'nowrap', color:p.status==='OVERDUE'?'#dc2626':'#0F1923' }}>{p.due}</td>
                      <td style={{ padding:'10px', fontSize:12, color:'#64748b', ...I }}>{p.period}</td>
                      <td style={{ padding:'10px' }}><Pill text={p.status} color={PC[p.status]||'#64748b'}/></td>
                      <td style={{ padding:'10px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          {p.status!=='PAID' && (
                            <button onClick={()=>{setPayments(prev=>prev.map(x=>x.id===p.id?{...x,status:'PAID'}:x));toast(`${p.vendor} marked as paid`,'success')}} style={{ padding:'4px 10px', borderRadius:8, background:'#0B3D91', color:'#fff', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Pay</button>
                          )}
                          <button onClick={()=>setPModal(p)} style={{ padding:'4px 10px', borderRadius:8, background:'#F5F7FA', color:'#0B3D91', border:'1px solid #E2E8F0', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                          <button onClick={()=>{setPayments(prev=>prev.filter(x=>x.id!==p.id));toast('Invoice removed','warning')}} style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>)}

        {/* == PAYOUTS == */}
        {active==='payouts' && (
          state.payouts.map(p=>(
            <Card key={p.id} style={{ marginBottom:12, borderLeft:`4px solid ${p.status==='READY'?'#FFC72C':'#22c55e'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{p.operator_name}</div>
                  <div style={{ fontSize:13, color:'#64748b', ...I }}>Merchant: <strong>{p.merchant_code}</strong> -- {state.trips.find(t=>t.id===p.trip_id)?.from}-{state.trips.find(t=>t.id===p.trip_id)?.to}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'#64748b', ...I }}>Gross: {fmt(p.gross)}</div>
                  <div style={{ fontSize:12, color:'#dc2626', ...I }}>Commission: -{fmt(p.commission)}</div>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#15803d' }}>Net: {fmt(p.net)}</div>
                </div>
              </div>
              <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                {p.status==='READY'
                  ? <Btn variant="success" onClick={()=>{st.releasePayout&&st.releasePayout(p.id);toast(`${fmt(p.net)} sent to ${p.merchant_code}`,'success')}}>Release to {p.merchant_code}</Btn>
                  : <span style={{ fontSize:13, color:'#64748b', ...I }}>Released: {p.triggered_at}</span>}
                <Pill text={p.status} color={p.status==='READY'?'#92400e':'#1d4ed8'}/>
              </div>
            </Card>
          ))
        )}

        {/* == FLEET MANAGEMENT == */}
        {active==='fleet' && (<>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16, gap:10 }}>
            <Btn variant="blue" onClick={()=>setVModal('add')}>+ Add Vehicle</Btn>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
            {vehicles.map(v=>(
              <Card key={v.id} style={{ borderLeft:`4px solid ${SC[v.status]||'#E2E8F0'}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'rgba(11,61,145,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>[B]</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:3 }}>
                      <span style={{ ...P, fontWeight:700, fontSize:15 }}>{v.reg}</span>
                      <Pill text={v.status} color={SC[v.status]||'#64748b'}/>
                    </div>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>{v.type} -- {v.operator}</div>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>Driver: <strong style={{ color:'#0F1923' }}>{v.driver}</strong></div>
                  </div>
                </div>
                <ProgressBar value={v.fuel} max={100} label={`Fuel: ${v.fuel}%`} showPct height={5}/>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:10, fontSize:11, color:'#64748b', ...I }}>
                  <span>Mileage: {v.mileage.toLocaleString()} km</span>
                  <span style={{ color:new Date(v.fitness) < new Date()?'#dc2626':'inherit' }}>Fitness: {v.fitness}</span>
                  <span style={{ color:new Date(v.insurance) < new Date()?'#dc2626':'inherit' }}>Insurance: {v.insurance}</span>
                </div>
                <div style={{ display:'flex', gap:7, marginTop:12, flexWrap:'wrap' }}>
                  <button onClick={()=>{setVForm({...v});setVModal(v)}} style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                  <button onClick={()=>{setVehicles(p=>p.map(x=>x.id===v.id?{...x,status:x.status==='Active'?'Maintenance':'Active'}:x));toast(`${v.reg} status updated`,'success')}} style={{ padding:'6px 12px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                    {v.status==='Active'?'Set Maintenance':'Set Active'}
                  </button>
                  <button onClick={()=>{const d=prompt('Reassign driver:');if(d){setVehicles(p=>p.map(x=>x.id===v.id?{...x,driver:d}:x));toast(`Driver reassigned`,'success')}}} style={{ padding:'6px 12px', borderRadius:8, background:'#f0fdf4', color:'#15803d', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Reassign Driver</button>
                  <button onClick={()=>{if(window.confirm(`Auction ${v.reg}?`)){setVehicles(p=>p.map(x=>x.id===v.id?{...x,status:'Auctioned'}:x));toast(`${v.reg} listed for auction`,'success')}}} style={{ padding:'6px 12px', borderRadius:8, background:'#ede9fe', color:'#7c3aed', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Auction</button>
                  <button onClick={()=>{if(window.confirm(`Delete ${v.reg}?`)){setVehicles(p=>p.filter(x=>x.id!==v.id));toast(`${v.reg} deleted`,'error')}}} style={{ padding:'6px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Delete</button>
                </div>
              </Card>
            ))}
          </div>
        </>)}

        {/* == SERVICES MARKETPLACE == */}
        {active==='services' && state.operators.filter(o=>o.operator_type!=='INTERNAL').map(op=>(
          <Card key={op.id} style={{ marginBottom:16 }}>
            <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:14 }}>{op.company_name}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
              {MODULE_DEFS.filter(m=>m.price>0).map(mod=>{
                const isActive=op.modules?.[mod.id]?.status==='ACTIVE'
                return (
                  <div key={mod.id} style={{ border:`1.5px solid ${isActive?'#22c55e':'#E2E8F0'}`, borderRadius:12, padding:14, background:isActive?'#dcfce7':'#fff' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                      <div style={{ ...P, fontWeight:600, fontSize:13 }}>{mod.name}</div>
                      {isActive?<Pill text="Active" color="#15803d"/>:<Pill text={fmt(mod.price)+'/mo'} color="#1d4ed8" bg="#dbeafe"/>}
                    </div>
                    {isActive
                      ?<Btn size="sm" variant="danger" full onClick={()=>{st.deactivateModule(op.id,mod.id);toast('Deactivated','warning')}}>Deactivate</Btn>
                      :<Btn size="sm" variant="blue"   full onClick={()=>setSvcModal({op,module:mod})}>Activate</Btn>}
                  </div>
                )
              })}
            </div>
          </Card>
        ))}

        {/* == USERS == */}
        {active==='users' && (<>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
            <Btn variant="blue" onClick={()=>{setUForm({name:'',email:'',phone:'',role:'DISPATCHER',operator:'Raylane Express',status:'Active'});setUModal('add')}}>+ Add User</Btn>
          </div>
          <Card>
            <SectionHead title="All Users" count={users.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Name','Email','Phone','Role','Operator','Joined','Status','Actions'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{users.map(u=>(
                  <tr key={u.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:13 }}>{u.name}</td>
                    <td style={{ padding:'10px', fontSize:12, ...I }}>{u.email}</td>
                    <td style={{ padding:'10px', fontSize:12, ...I }}>{u.phone}</td>
                    <td style={{ padding:'10px' }}><Pill text={u.role.replace(/_/g,' ')} color={UC[u.role]||'#64748b'}/></td>
                    <td style={{ padding:'10px', fontSize:12, ...I }}>{u.operator}</td>
                    <td style={{ padding:'10px', fontSize:11, color:'#64748b', ...I }}>{u.joined}</td>
                    <td style={{ padding:'10px' }}><Pill text={u.status} color={u.status==='Active'?'#15803d':'#dc2626'}/></td>
                    <td style={{ padding:'10px' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={()=>{setUForm({...u});setUModal(u)}} style={{ padding:'4px 10px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                        <button onClick={()=>{setUsers(p=>p.map(x=>x.id===u.id?{...x,status:x.status==='Active'?'Suspended':'Active'}:x));toast('User status toggled','success')}} style={{ padding:'4px 10px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                          {u.status==='Active'?'Suspend':'Activate'}
                        </button>
                        <button onClick={()=>{if(window.confirm(`Delete ${u.name}?`)){setUsers(p=>p.filter(x=>x.id!==u.id));toast('User deleted','error')}}} style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>)}

        {/* == ALERTS == */}
        {active==='alerts' && (
          <Card>
            <SectionHead title="Notifications" action="Mark all read" onAction={()=>{st.markAdminRead&&st.markAdminRead();toast('All read','success')}}/>
            {adminNotifs.length===0 ? <EmptyState icon="[OK]" title="All caught up!"/> : adminNotifs.map((n,i)=>(
              <div key={n.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom:i<adminNotifs.length-1?'1px solid #E2E8F0':'', background:!n.read?'#f8faff':'' }}>
                <div style={{ fontSize:16, flexShrink:0, marginTop:2 }}>{n.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:2 }}>{n.msg}</div>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>{n.time}</div>
                </div>
                {!n.read && <span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:9, ...P, fontWeight:700 }}>NEW</span>}
              </div>
            ))}
          </Card>
        )}

        {/* == AUDIT LOG == */}
        {active==='audit' && (
          <Card>
            <SectionHead title="Audit Log -- Every Action Tracked"/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Time','Action','Actor','Target','Detail'].map(h=><th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>)}
                </tr></thead>
                <tbody>{state.audit_log.map((e,i)=>(
                  <tr key={e.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                    onMouseEnter={ex=>ex.currentTarget.style.background='#F5F7FA'}
                    onMouseLeave={ex=>ex.currentTarget.style.background=''}>
                    <td style={{ padding:'9px 10px', fontSize:11, color:'#64748b', ...I, whiteSpace:'nowrap' }}>{e.time}</td>
                    <td style={{ padding:'9px 10px' }}><Pill text={e.action.replace(/_/g,' ')} color="#1d4ed8" bg="#dbeafe"/></td>
                    <td style={{ padding:'9px 10px', fontSize:12, ...P, fontWeight:600 }}>{e.actor}</td>
                    <td style={{ padding:'9px 10px', fontSize:11, color:'#64748b', ...I }}>{e.target}</td>
                    <td style={{ padding:'9px 10px', fontSize:12, color:'#64748b', ...I }}>{e.detail}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        )}

        {/* == SYSTEM == */}
        {active==='syshealth' && (<>
          <Card style={{ marginBottom:14 }}>
            <SectionHead title="Service Status"/>
            {SYS.map((m,i)=>(
              <div key={m.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:i<SYS.length-1?'1px solid #E2E8F0':'' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:m.ok?'#22c55e':'#f59e0b', animation:'blink 2s ease infinite' }}/>
                  <span style={{ ...P, fontWeight:600, fontSize:14 }}>{m.label}</span>
                </div>
                <div style={{ display:'flex', gap:16 }}>
                  <span style={{ fontSize:12, color:'#64748b', ...I }}>Uptime: <strong>{m.uptime}</strong></span>
                  <Pill text={m.status} color={m.ok?'#15803d':'#d97706'}/>
                </div>
              </div>
            ))}
          </Card>
          <Card><SectionHead title="Revenue Today"/>
            <BarChart data={[30,55,40,80,65,90,75]} labels={['06:00','08:00','10:00','12:00','14:00','16:00','18:00']} height={100}/>
          </Card>
          <style>{"@keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}"}</style>
        </>)}

        {/* == REPORTS == */}
        {active==='reports' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard label="Monthly Revenue"   value="UGX 74.6M" sub="+6.3%"  bg="#dcfce7" color="#15803d"/>
            <StatCard label="Total Bookings"    value={state.bookings.length} sub="This month" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard label="Commission Earned" value="UGX 5.97M" sub="8%"    bg="#fef9c3" color="#92400e"/>
            <StatCard label="Active Operators"  value={state.operators.filter(o=>o.status==='ACTIVE').length} bg="#f3e8ff" color="#7c3aed"/>
          </div>
          <Card>
            <SectionHead title="Monthly Revenue Trend" action="Export CSV" onAction={()=>toast('Generating report...','success')}/>
            <BarChart data={[42,58,51,73,69,90,75,82,95,88,74,92]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} height={120}/>
          </Card>
        </>)}

        {/* == SETTINGS == */}
        {active==='settings' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Commission Settings"/>
              <div style={{ ...P, fontWeight:800, fontSize:36, color:'#0B3D91', marginBottom:8 }}>8%</div>
              <div style={{ fontSize:14, color:'#64748b', ...I, marginBottom:14 }}>Applied on all external operator bookings. Deducted at payout.</div>
              <Banner type="warning">Contact the development team before modifying the commission rate. Changes affect all future payouts.</Banner>
            </Card>
            <Card>
              <SectionHead title="Platform Info"/>
              {[['Version','v6.0 -- Production'],['DB','Supabase PostgreSQL'],['Payments','MTN MoMo + Airtel'],['SMS','Africa Talking API']].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <span style={{ ...P, fontWeight:600, fontSize:13 }}>{l}</span>
                  <span style={{ fontSize:13, color:'#64748b', ...I }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {!['overview','applications','operators','trips','bookings','payments','payouts','parcels','fleet','services','users','alerts','audit','syshealth','reports','settings'].includes(active) && (
          <EmptyState icon="[?]" title={NAV.find(n=>n.id===active)?.label||'Module'} desc="Connect to the Raylane backend API to load live data."/>
        )}
      </div>

      {/* Trip modal */}
      <Modal open={!!tripModal} onClose={()=>{setTripModal(null);setRejectR('')}} title={tripModal?.action==='reject'?'Reject Trip':'Edit and Approve'}>
        {tripModal && (<>
          <div style={{ background:'#F5F7FA', borderRadius:12, padding:14, marginBottom:14 }}>
            <div style={{ ...P, fontWeight:700, fontSize:15 }}>{tripModal.trip.operator_name} -- {tripModal.trip.from} to {tripModal.trip.to}</div>
            <div style={{ fontSize:13, color:'#64748b', ...I, marginTop:4 }}>{tripModal.trip.departs} -- {fmt(tripModal.trip.price)}/seat</div>
          </div>
          {tripModal.action==='reject' && <Input label="Rejection Reason *" value={rejectR} onChange={e=>setRejectR(e.target.value)} placeholder="Explain why..."/>}
          {tripModal.action==='edit' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div><label style={lS}>Price (UGX)</label><input type="number" value={editForm.price||''} onChange={e=>setEditForm({...editForm,price:e.target.value})} style={iS}/></div>
              <div><label style={lS}>Departure Time</label><input value={editForm.departs||''} onChange={e=>setEditForm({...editForm,departs:e.target.value})} style={iS}/></div>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={()=>setTripModal(null)}>Cancel</Btn>
            {tripModal.action==='reject'
              ?<Btn variant="danger" full onClick={()=>reject(tripModal.trip.id)}>Confirm Rejection</Btn>
              :<Btn variant="success" full onClick={()=>{st.editApproveTrip?st.editApproveTrip(tripModal.trip.id,editForm):st.approveTrip(tripModal.trip.id);toast('Approved','success');setTripModal(null)}}>Approve and Make Live</Btn>}
          </div>
        </>)}
      </Modal>

      {/* Service activation modal */}
      <Modal open={!!svcModal} onClose={()=>setSvcModal(null)} title={`Activate: ${svcModal?.module?.name}`}>
        {svcModal && (<>
          <div style={{ background:'#F5F7FA', borderRadius:14, padding:18, marginBottom:14 }}>
            <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{svcModal.module.name}</div>
            <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(svcModal.module.price)}<span style={{ fontSize:12, color:'#64748b', fontWeight:400 }}>/month</span></div>
          </div>
          <Banner type="warning">Confirm payment received from <strong>{svcModal.op.company_name}</strong> before activating. This is logged in the audit trail.</Banner>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={()=>setSvcModal(null)}>Cancel</Btn>
            <Btn variant="gold"  full onClick={()=>{st.activateModule(svcModal.op.id,svcModal.module.id);toast(`${svcModal.module.name} activated`,'success');setSvcModal(null)}}>Confirm Activation</Btn>
          </div>
        </>)}
      </Modal>

      {/* Vehicle modal */}
      <Modal open={!!vModal} onClose={()=>setVModal(null)} title={vModal==='add'?'Add Vehicle':'Edit Vehicle'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['reg','Registration Plate'],['driver','Driver Name'],['mileage','Mileage (km)'],['insurance','Insurance Expiry'],['fitness','Fitness Expiry']].map(([k,l])=>(
            <div key={k}><label style={lS}>{l}</label><input value={vForm[k]||''} onChange={e=>setVForm(f=>({...f,[k]:e.target.value}))} style={iS}/></div>
          ))}
          <div><label style={lS}>Vehicle Type</label>
            <select value={vForm.type||'67-Seater Coach'} onChange={e=>setVForm(f=>({...f,type:e.target.value}))} style={iS}>
              <option>67-Seater Coach</option><option>14-Seater Taxi</option>
            </select>
          </div>
          <div><label style={lS}>Status</label>
            <select value={vForm.status||'Active'} onChange={e=>setVForm(f=>({...f,status:e.target.value}))} style={iS}>
              {['Active','Maintenance','Inactive','Auctioned'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={()=>setVModal(null)}>Cancel</Btn>
          <Btn variant="blue"  full onClick={()=>{
            if (vModal==='add') {
              setVehicles(p=>[...p,{...vForm,id:`VH-${Date.now()}`,fuel:100,operator:'Raylane Express Fleet'}])
              toast('Vehicle added','success')
            } else {
              setVehicles(p=>p.map(x=>x.id===vModal.id?{...x,...vForm}:x))
              toast('Vehicle updated','success')
            }
            setVModal(null)
          }}>{vModal==='add'?'Add Vehicle':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* User modal */}
      <Modal open={!!uModal} onClose={()=>setUModal(null)} title={uModal==='add'?'Add User':'Edit User'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['name','Full Name'],['email','Email Address'],['phone','Phone Number']].map(([k,l])=>(
            <div key={k} style={k==='email'?{gridColumn:'1/-1'}:{}}><label style={lS}>{l}</label><input value={uForm[k]||''} onChange={e=>setUForm(f=>({...f,[k]:e.target.value}))} style={iS}/></div>
          ))}
          <div><label style={lS}>Role</label>
            <select value={uForm.role} onChange={e=>setUForm(f=>({...f,role:e.target.value}))} style={iS}>
              {['ADMIN','OPERATOR_ADMIN','DISPATCHER','ACCOUNTANT','LOADER'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label style={lS}>Operator / Company</label>
            <select value={uForm.operator} onChange={e=>setUForm(f=>({...f,operator:e.target.value}))} style={iS}>
              {['Raylane Express',...state.operators.filter(o=>o.operator_type!=='INTERNAL').map(o=>o.company_name)].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div><label style={lS}>Status</label>
            <select value={uForm.status} onChange={e=>setUForm(f=>({...f,status:e.target.value}))} style={iS}>
              {['Active','Suspended'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={()=>setUModal(null)}>Cancel</Btn>
          <Btn variant="blue"  full onClick={()=>{
            if (uModal==='add') {
              setUsers(p=>[...p,{...uForm,id:`USR-${Date.now()}`,joined:new Date().toISOString().split('T')[0]}])
              toast('User created','success')
            } else {
              setUsers(p=>p.map(x=>x.id===uModal.id?{...x,...uForm}:x))
              toast('User updated','success')
            }
            setUModal(null)
          }}>{uModal==='add'?'Create User':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* Payment edit modal */}
      <Modal open={!!pModal} onClose={()=>setPModal(null)} title={pModal==='add'?'Add Invoice':'Edit Invoice'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label style={lS}>Type</label>
            <select defaultValue={typeof pModal==='object'?pModal.type:'Utility'} id="ptype" style={iS}>
              {['Utility','Rent','Insurance','Internet','Cleaning','Maintenance','Other'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={lS}>Vendor</label>
            <select defaultValue={typeof pModal==='object'?pModal.vendor:''} id="pvendor" style={iS}>
              <option value="">Select vendor...</option>
              {['UMEME Ltd','National Water','Kampala Properties Ltd','MTN Business','UAP Insurance Uganda','CleanPro Uganda'].map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description</label><input defaultValue={typeof pModal==='object'?pModal.description:''} id="pdesc" style={iS} placeholder="Invoice description..."/></div>
          <div><label style={lS}>Amount (UGX)</label><input type="number" defaultValue={typeof pModal==='object'?pModal.amount:''} id="pamount" style={iS}/></div>
          <div><label style={lS}>Due Date</label><input type="date" defaultValue={typeof pModal==='object'?pModal.due:''} id="pdue" style={iS}/></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={()=>setPModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={()=>{
            const amount = parseInt(document.getElementById('pamount')?.value||0)
            if (pModal==='add') {
              setPayments(p=>[...p,{ id:`PMT-${Date.now()}`, type:document.getElementById('ptype')?.value||'Utility', vendor:document.getElementById('pvendor')?.value||'', description:document.getElementById('pdesc')?.value||'', amount, due:document.getElementById('pdue')?.value||'', status:'UNPAID', period:'Current' }])
              toast('Invoice added','success')
            } else {
              setPayments(p=>p.map(x=>x.id===pModal.id?{...x,amount}:x))
              toast('Invoice updated','success')
            }
            setPModal(null)
          }}>{pModal==='add'?'Add Invoice':'Save Changes'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
