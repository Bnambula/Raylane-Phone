import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Modal, Btn, Input, EmptyState } from '../../components/ui/SharedComponents'
import store from '../../store/appStore'

/* ─────────────── NAV ─────────────── */
const NAV = [
  { icon:'📊', label:'Overview',       id:'overview' },
  { icon:'📝', label:'Applications',   id:'applications', badge:true },
  { icon:'🚌', label:'Operators',      id:'operators' },
  { icon:'🗺️', label:'Trips',          id:'trips', badge:true },
  { icon:'🎫', label:'Bookings',       id:'bookings' },
  { icon:'💳', label:'Payments',       id:'payments' },
  { icon:'💸', label:'Payouts',        id:'payouts' },
  { icon:'📦', label:'Parcels',        id:'parcels' },
  { icon:'🚗', label:'Raylane Fleet',  id:'fleet' },
  { icon:'🏦', label:'Bank Loans',     id:'bankloans' },
  { icon:'🛒', label:'Services',       id:'services' },
  { icon:'👥', label:'Users',          id:'users' },
  { icon:'📂', label:'Documents',      id:'documents' },
  { icon:'🔔', label:'Alerts',         id:'alerts', badge:true },
  { icon:'📋', label:'Audit Log',      id:'audit' },
  { icon:'🖥️', label:'System Health',  id:'syshealth' },
  { icon:'📈', label:'Reports',        id:'reports' },
  { icon:'⚙️', label:'Settings',       id:'settings' },
]

const MODULE_DEFS = [
  { id:'booking_basic',    name:'Booking System',    price:0,      icon:'🎫', default:true },
  { id:'parcel_basic',     name:'Parcel System',     price:0,      icon:'📦', default:true },
  { id:'financial_module', name:'Financial Module',  price:100000, icon:'💰' },
  { id:'fuel_module',      name:'Fuel Management',   price:80000,  icon:'⛽' },
  { id:'loan_tracking',    name:'Bank Loan Monitor', price:150000, icon:'🏦' },
  { id:'sacco_module',     name:'Sacco Module',      price:200000, icon:'🏛️' },
  { id:'analytics_module', name:'Analytics',         price:100000, icon:'📊' },
  { id:'hr_module',        name:'Staff / HR',        price:100000, icon:'👥' },
  { id:'fleet_module',     name:'Fleet Maintenance', price:120000, icon:'🔧' },
]

const PAYOUTS = [
  { id:'PAY-001', trip_id:'T-001', operator_id:'op-001', operator_name:'Global Coaches', merchant_code:'GLOBAL_UG', gross:900000, commission:72000, net:828000, status:'READY',    triggered_at:null },
  { id:'PAY-002', trip_id:'T-004', operator_id:'op-003', operator_name:'Link Bus',       merchant_code:'LINK_BUS_UG', gross:1080000, commission:86400, net:993600, status:'RELEASED', triggered_at:'2026-05-11 16:00' },
]

const DOCS = [
  { name:'Global Coaches – Operating Licence', operator:'Global Coaches', type:'Licence',   date:'2026-01-15', size:'2.4 MB', status:'active' },
  { name:'YY Coaches – Operator Agreement',    operator:'YY Coaches',    type:'Agreement', date:'2026-02-01', size:'1.1 MB', status:'active' },
  { name:'Link Bus – Vehicle Inspection',      operator:'Link Bus',      type:'Inspection',date:'2025-12-10', size:'3.8 MB', status:'expired' },
]

const ALERTS_DATA = [
  { type:'urgent', icon:'🔴', title:'Payment failure – MTN MoMo',     detail:'Booking RLX-240512-001 payment timed out.',       time:'2 min ago',  link:'payments' },
  { type:'urgent', icon:'🔴', title:'Bank loan overdue – YY Coaches', detail:'3 months outstanding. Immediate action needed.',  time:'1 hr ago',   link:'bankloans' },
  { type:'normal', icon:'🟡', title:'New operator application',        detail:'City Express applied to join Raylane.',           time:'3 hrs ago',  link:'applications' },
  { type:'normal', icon:'🟡', title:'Trip ready for payout',           detail:'Kampala→Mbale 10AM – 36 seats loaded.',          time:'5 hrs ago',  link:'payouts' },
  { type:'normal', icon:'🟡', title:'High demand: Kampala→Nairobi',   detail:'95% booked this weekend. Consider peak pricing.',  time:'6 hrs ago',  link:'trips' },
]

const SYS_METRICS = [
  { label:'Booking Engine',  status:'Online',  uptime:'99.9%', color:'#15803d' },
  { label:'Payment Gateway', status:'Online',  uptime:'99.7%', color:'#15803d' },
  { label:'Seat Sync',       status:'Live',    uptime:'100%',  color:'#15803d' },
  { label:'SMS API',         status:'Active',  uptime:'98.4%', color:'#15803d' },
  { label:'MoMo MTN',        status:'Online',  uptime:'99.1%', color:'#15803d' },
  { label:'Airtel Money',    status:'Delayed', uptime:'94.2%', color:'#d97706' },
]

const FLEET_VEHICLES = [
  { id:'V-001', reg:'UBF 001K', type:'55-Seater Coach', driver:'James Okello',   status:'On Route',  route:'Kampala→Mbale',  fuel:75 },
  { id:'V-002', reg:'UBF 002K', type:'67-Seater Coach', driver:'Sarah Nakato',   status:'Available', route:'—',              fuel:90 },
  { id:'V-003', reg:'UBF 003K', type:'14-Seater Taxi',  driver:'Peter Mwesiga',  status:'Maintenance',route:'—',             fuel:40 },
]

const fmt = n => 'UGX ' + Number(n).toLocaleString()
const P = { fontFamily:"'Poppins',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

export default function AdminDashboard() {
  const { state, store: st, unreadCount, pendingTrips, pendingApps } = useAdminStore()
  const [active, setActive]       = useState('overview')
  const [tripModal, setTripModal] = useState(null)
  const [svcModal,  setSvcModal]  = useState(null)
  const [payouts,   setPayouts]   = useState(PAYOUTS)
  const [rejectReason, setRejectReason] = useState('')
  const [editForm,  setEditForm]  = useState({})
  const [newTripForm, setNewTripForm] = useState({ from:'Kampala', to:'', date:'', departs:'', price:'', operator_id:'', seat_type:'55', notes:'' })
  const toast = useToast()
  const navigate = useNavigate()

  const approve = (id) => { st.approveTrip(id); toast('✅ Trip approved — now live!', 'success') }
  const reject  = (id) => {
    if (!rejectReason.trim()) { toast('Enter a rejection reason', 'warning'); return }
    st.rejectTrip(id, rejectReason)
    toast('❌ Trip rejected — operator notified', 'error')
    setTripModal(null); setRejectReason('')
  }

  const releasePayout = (payId) => {
    const p = payouts.find(x => x.id === payId)
    setPayouts(prev => prev.map(x => x.id === payId ? {...x, status:'RELEASED', triggered_at: new Date().toISOString()} : x))
    st.releasePayout ? st.releasePayout(payId) : null
    toast(`💸 ${fmt(p.net)} dispatched to ${p.merchant_code}`, 'success')
  }

  const activateMod = () => {
    st.activateModule(svcModal.op.id, svcModal.module.id)
    toast(`✅ ${svcModal.module.name} activated for ${svcModal.op.company_name}`, 'success')
    setSvcModal(null)
  }

  const createAdminTrip = (e) => {
    e.preventDefault()
    if (!newTripForm.to || !newTripForm.date || !newTripForm.price) { toast('Fill required fields','warning'); return }
    const op = state.operators.find(o => o.id === newTripForm.operator_id) || state.operators.find(o => o.operator_type === 'INTERNAL')
    if (!op) { toast('Select an operator', 'warning'); return }
    st.createTrip({ ...newTripForm, operator_id: op.id, operator_name: op.company_name, plate: 'UBF 001K', seats_total: parseInt(newTripForm.seat_type), seats_booked: 0, price: parseInt(newTripForm.price), boarding_pin: op.boarding_pin })
    toast('✅ Trip created by Admin — auto-approved if internal operator', 'success')
    setActive('trips')
    setNewTripForm({ from:'Kampala', to:'', date:'', departs:'', price:'', operator_id:'', seat_type:'55', notes:'' })
  }

  const inS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', boxSizing:'border-box', outline:'none', WebkitAppearance:'none' }
  const lS  = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', ...P, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

  /* ── SIDEBAR ── */
  const Sidebar = () => (
    <div className="dash-sidebar" style={{ width:200, background:'#0a0f1e', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden' }}>
      <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:9, minHeight:54 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:'#FFC72C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="14" height="12" viewBox="0 0 20 16" fill="none"><path d="M1 13L7 3l5 6 4-6 3 10" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ ...P, fontWeight:700, fontSize:12, color:'#fff', lineHeight:1 }}>Admin Panel</div>
          <div style={{ fontSize:9, color:'#FFC72C', ...P, marginTop:1 }}>Raylane Express</div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'6px 0', display:'flex', flexDirection:'column' }}>
        {NAV.map(item => {
          const bc = item.badge ? (item.id==='alerts'?unreadCount : item.id==='trips'?pendingTrips.length : item.id==='applications'?pendingApps.length : 0) : 0
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,.12)':'none', color:active===item.id?'#FFC72C':'rgba(255,255,255,.65)', borderLeft:`3px solid ${active===item.id?'#FFC72C':'transparent'}`, ...P, fontWeight:600, fontSize:11, whiteSpace:'nowrap', transition:'all .18s', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
              <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {bc > 0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700, flexShrink:0 }}>{bc}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column', gap:6 }}>
        <button onClick={() => { store.resetToInitial(); toast('Demo data reset', 'success') }} style={{ width:'100%', padding:'6px', borderRadius:7, background:'rgba(255,100,100,.12)', color:'rgba(255,150,150,.8)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:9 }}>Reset Demo</button>
        <button onClick={() => navigate('/')} style={{ width:'100%', padding:'7px', borderRadius:7, background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.55)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:10 }}>← Back to Site</button>
      </div>
    </div>
  )

  const statusColor = { APPROVED:'#15803d', PENDING_APPROVAL:'#92400e', REJECTED:'#dc2626', ACTIVE:'#15803d', INACTIVE:'#9ca3af', READY:'#92400e', RELEASED:'#1d4ed8', CURRENT:'#15803d', OVERDUE:'#dc2626', REPAID:'#1d4ed8', PENDING_REVIEW:'#92400e' }

  return (
    <div className="dash-wrap" style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>
      <Sidebar />
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:22 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(15px,2vw,20px)', margin:0 }}>
            {NAV.find(n=>n.id===active)?.icon} {active==='overview'?'Dashboard':NAV.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount>0 && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:12 }}>🔔 {unreadCount} new</span>}
            <div style={{ width:32, height:32, borderRadius:9, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', ...P, fontWeight:800, fontSize:11 }}>AD</div>
          </div>
        </div>

        {/* ══ OVERVIEW ══ */}
        {active==='overview' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
            <StatCard icon="🎫" label="Daily Bookings"  value={state.bookings.length.toLocaleString()} sub="+11.5%" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="💰" label="Revenue Today"    value="UGX 74.6M" sub="+6.3%"  bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🚌" label="Active Operators" value={state.operators.filter(o=>o.status==='ACTIVE').length} sub="Live" bg="#f3e8ff" color="#7c3aed"/>
            <StatCard icon="⏳" label="Pending Actions"  value={pendingTrips.length+pendingApps.length} sub="Action needed" bg="#fef9c3" color="#92400e"/>
          </div>

          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <Card>
              <SectionHead title="Pending Trip Approvals" count={pendingTrips.length} action="View All" onAction={() => setActive('trips')}/>
              {pendingTrips.length === 0
                ? <EmptyState icon="✅" title="All caught up!" desc="No trips awaiting approval."/>
                : pendingTrips.slice(0,3).map(t => (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 0', borderBottom:'1px solid #E2E8F0' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ ...P, fontWeight:600, fontSize:13 }}>{t.operator_name} — {t.from}→{t.to}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>Departs {t.departs} · {fmt(t.price)}/seat</div>
                    </div>
                    <div style={{ display:'flex', gap:5 }}>
                      <Btn size="sm" variant="success" onClick={() => approve(t.id)}>✅</Btn>
                      <Btn size="sm" variant="danger"  onClick={() => setTripModal({trip:t, action:'reject'})}>❌</Btn>
                      <Btn size="sm" variant="ghost"   onClick={() => { setTripModal({trip:t,action:'edit'}); setEditForm({price:t.price,departs:t.departs,notes:t.notes||''}) }}>✏️</Btn>
                    </div>
                  </div>
                ))}
            </Card>
            <Card>
              <SectionHead title="New Applications" count={pendingApps.length} action="View All" onAction={() => setActive('applications')}/>
              {pendingApps.length === 0
                ? <EmptyState icon="✅" title="No pending applications"/>
                : pendingApps.slice(0,3).map(a => (
                  <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 0', borderBottom:'1px solid #E2E8F0' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ ...P, fontWeight:600, fontSize:13 }}>{a.company_name}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{a.contact_name} · {a.fleet_size} vehicles</div>
                    </div>
                    <Btn size="sm" variant="blue" onClick={() => { st.approveApplication(a.id); toast(`✅ ${a.company_name} onboarded!`,'success') }}>Approve</Btn>
                  </div>
                ))}
            </Card>
          </div>

          {/* Live stats */}
          <Card style={{ background:'#0B3D91' }}>
            <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'space-around' }}>
              {[['Live Trips',state.trips.filter(t=>t.status==='APPROVED').length,'#7dd3fc'],['Total Bookings',state.bookings.length,'#86efac'],['Operators',state.operators.length,'#FFC72C'],['Payouts Ready',payouts.filter(p=>p.status==='READY').length,'#fca5a5']].map(([l,v,c]) => (
                <div key={l} style={{ textAlign:'center', color:'#fff' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:28, color:c }}>{v}</div>
                  <div style={{ fontSize:12, opacity:.75, ...I }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </>)}

        {/* ══ APPLICATIONS ══ */}
        {active==='applications' && (<>
          <Banner type="info">On approval, an operator account is auto-created and credentials sent via SMS. Basic modules (Booking + Parcel) are activated. All others remain inactive until requested.</Banner>
          {state.applications.map(a => (
            <Card key={a.id} style={{ marginBottom:12, borderLeft:`4px solid ${statusColor[a.status]||'#E2E8F0'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:5, flexWrap:'wrap' }}>
                    <span style={{ ...P, fontWeight:700, fontSize:16 }}>{a.company_name}</span>
                    <Pill text={a.status.replace(/_/g,' ')} color={statusColor[a.status]||'#64748b'}/>
                  </div>
                  <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:4 }}>Contact: {a.contact_name} · {a.phone} · {a.email}</div>
                  <div style={{ fontSize:13, color:'#64748b', ...I }}>Fleet: {a.fleet_size} vehicles · Routes: {a.current_routes}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
                    {a.modules_requested?.map(m => <span key={m} style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:10, ...P, fontWeight:600 }}>{m.replace(/_/g,' ')}</span>)}
                  </div>
                </div>
                <div style={{ fontSize:11, color:'#64748b', ...I, textAlign:'right' }}>
                  <div>Submitted: {a.submitted_at}</div><div style={{ marginTop:4 }}>ID: {a.id}</div>
                </div>
              </div>
              {a.status==='PENDING_REVIEW' && (
                <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap', paddingTop:12, borderTop:'1px solid #E2E8F0' }}>
                  <Btn variant="success" icon="✅" onClick={() => { st.approveApplication(a.id); toast(`✅ ${a.company_name} approved!`,'success') }}>Approve & Create Account</Btn>
                  <Btn variant="danger"  onClick={() => toast('Rejection modal — add rejection reason','warning')}>❌ Reject</Btn>
                  <Btn variant="ghost"   onClick={() => toast('Request info — connect SMS API','success')}>📞 Request Info</Btn>
                </div>
              )}
            </Card>
          ))}
        </>)}

        {/* ══ OPERATORS ══ */}
        {active==='operators' && (
          state.operators.map(op => (
            <Card key={op.id} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                <div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:5, flexWrap:'wrap' }}>
                    <span style={{ ...P, fontWeight:700, fontSize:16 }}>{op.company_name}</span>
                    <Pill text={op.status} color={op.status==='ACTIVE'?'#15803d':'#dc2626'}/>
                    {op.operator_type==='INTERNAL' && <Pill text="Raylane Fleet" color="#7c3aed" bg="#ede9fe"/>}
                    {op.managed_by_raylane && <Pill text="Managed Mode" color="#d97706" bg="#fef9c3"/>}
                    {op.is_premium && <Pill text="⭐ Premium" color="#92400e" bg="#fef9c3"/>}
                  </div>
                  <div style={{ fontSize:13, color:'#64748b', ...I }}>
                    {op.contact} · {op.phone} · Merchant: <strong style={{ color:'#0B3D91' }}>{op.merchant_code}</strong>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <Btn size="sm" variant="ghost" onClick={() => {
                    const newManaged = !op.managed_by_raylane
                    // toggle managed mode
                    toast(`${op.company_name} managed mode: ${newManaged?'ON':'OFF'}`,'success')
                  }}>
                    {op.managed_by_raylane ? '🔓 Unmanage' : '🤝 Manage'}
                  </Btn>
                </div>
              </div>

              {/* Module panel */}
              <div style={{ background:'#F5F7FA', borderRadius:12, padding:14 }}>
                <div style={{ ...P, fontWeight:600, fontSize:11, marginBottom:10, color:'#64748b', textTransform:'uppercase', letterSpacing:1 }}>Modules</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:7 }}>
                  {MODULE_DEFS.map(mod => {
                    const isActive = op.modules[mod.id]?.status === 'ACTIVE'
                    return (
                      <div key={mod.id} style={{ background:isActive?'#dcfce7':'#fff', borderRadius:9, padding:'8px 10px', border:`1px solid ${isActive?'#22c55e':'#E2E8F0'}`, display:'flex', alignItems:'center', gap:7 }}>
                        <span style={{ fontSize:13, flexShrink:0 }}>{mod.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ ...P, fontWeight:600, fontSize:11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{mod.name}</div>
                          <div style={{ fontSize:9, color:'#64748b', ...I }}>{isActive?'Active':mod.price?fmt(mod.price)+'/mo':'Free'}</div>
                        </div>
                        <button onClick={() => {
                          if (isActive) { st.deactivateModule(op.id, mod.id); toast(`${mod.name} deactivated`,'warning') }
                          else setSvcModal({op, module:mod})
                        }} style={{ width:22, height:22, borderRadius:6, background:isActive?'#fee2e2':'#0B3D91', color:isActive?'#dc2626':'#fff', border:'none', cursor:'pointer', fontSize:11, fontWeight:700, flexShrink:0 }}>
                          {isActive ? '✕' : '＋'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          ))
        )}

        {/* ══ TRIPS ══ */}
        {active==='trips' && (<>
          <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
            <Btn variant="blue" icon="➕" onClick={() => setActive('createtrip')}>Admin: Create Trip</Btn>
            <span style={{ fontSize:12, color:'#64748b', ...I }}>Trips created by Admin for internal fleet are auto-approved</span>
          </div>
          <Banner type="info">Only <strong>APPROVED</strong> trips appear on the website. Admin can approve, reject, or edit &amp; approve operator submissions. Raylane internal fleet trips are auto-approved.</Banner>
          {['PENDING_APPROVAL','APPROVED','REJECTED'].map(sg => {
            const grp = state.trips.filter(t => t.status === sg)
            if (!grp.length) return null
            return (
              <div key={sg} style={{ marginBottom:20 }}>
                <h3 style={{ ...P, fontWeight:700, fontSize:13, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                  {sg==='PENDING_APPROVAL'?'⏳ Awaiting Approval':sg==='APPROVED'?'✅ Live on Website':'❌ Rejected'}
                  <span style={{ marginLeft:8, background:'#E2E8F0', color:'#64748b', borderRadius:10, padding:'2px 8px', fontSize:11 }}>{grp.length}</span>
                </h3>
                {grp.map(t => (
                  <Card key={t.id} style={{ marginBottom:10, borderLeft:`4px solid ${statusColor[t.status]||'#E2E8F0'}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                      <div>
                        <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{t.operator_name} — {t.from} → {t.to}</div>
                        <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:3 }}>{t.plate||'—'} · {t.departs} · {t.date} · {t.seat_type}-seater</div>
                        <div style={{ ...P, fontWeight:700, fontSize:13, color:'#0B3D91' }}>{fmt(t.price)}/seat</div>
                        {t.rejection_reason && <div style={{ marginTop:6, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626', ...P, fontWeight:600 }}>❌ {t.rejection_reason}</div>}
                        {t.operator_type==='INTERNAL' && <div style={{ marginTop:4 }}><Pill text="Raylane Fleet — Auto-approved" color="#7c3aed" bg="#ede9fe"/></div>}
                      </div>
                      {t.status==='PENDING_APPROVAL' && (
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          <Btn size="sm" variant="success" onClick={() => approve(t.id)}>✅ Approve</Btn>
                          <Btn size="sm" variant="blue"    onClick={() => { setTripModal({trip:t,action:'edit'}); setEditForm({price:t.price,departs:t.departs,notes:t.notes||''}) }}>✏️ Edit</Btn>
                          <Btn size="sm" variant="danger"  onClick={() => setTripModal({trip:t,action:'reject'})}>❌ Reject</Btn>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )
          })}
        </>)}

        {/* ══ CREATE TRIP (ADMIN) ══ */}
        {active==='createtrip' && (
          <Card>
            <Banner type="info">Admin-created trips can be assigned to any operator. Trips assigned to the <strong>Raylane Internal Fleet</strong> are auto-approved and go live immediately.</Banner>
            <form onSubmit={createAdminTrip}>
              <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>Operator *</label>
                  <select value={newTripForm.operator_id} onChange={e=>setNewTripForm({...newTripForm,operator_id:e.target.value})} style={inS}>
                    <option value="">Select operator…</option>
                    {state.operators.map(o=><option key={o.id} value={o.id}>{o.company_name} {o.operator_type==='INTERNAL'?'(Raylane Fleet)':''}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Seat Type</label>
                  <select value={newTripForm.seat_type} onChange={e=>setNewTripForm({...newTripForm,seat_type:e.target.value})} style={inS}>
                    <option value="55">55-Seater Coach</option><option value="65">65-Seater Coach</option><option value="67">67-Seater Coach</option><option value="14">14-Seater Taxi</option>
                  </select>
                </div>
                {[['From','from','text','Kampala'],['To *','to','text','Destination city'],['Date *','date','date',''],['Departs *','departs','time',''],['Price (UGX) *','price','number','25000']].map(([l,k,t,ph])=>(
                  <div key={k}><label style={lS}>{l}</label><input type={t} placeholder={ph} value={newTripForm[k]} onChange={e=>setNewTripForm({...newTripForm,[k]:e.target.value})} style={inS}/></div>
                ))}
              </div>
              <div style={{ marginBottom:16 }}><label style={lS}>Notes</label><textarea rows={2} placeholder="Amenities, special instructions…" value={newTripForm.notes} onChange={e=>setNewTripForm({...newTripForm,notes:e.target.value})} style={{ ...inS, resize:'none', lineHeight:1.6 }}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
                <Btn variant="ghost" full onClick={() => setActive('trips')}>Cancel</Btn>
                <Btn variant="gold" full>🚀 Create Trip</Btn>
              </div>
            </form>
          </Card>
        )}

        {/* ══ BOOKINGS ══ */}
        {active==='bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={state.bookings.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Booking ID','Operator','Route','Seat','Method','Amount','Status'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{state.bookings.map((b,i)=>{
                  const trip=state.trips.find(t=>t.id===b.trip_id)
                  const op=state.operators.find(o=>o.id===b.operator_id)
                  return(
                    <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{op?.company_name}</td>
                      <td style={{ padding:'10px', fontSize:12, color:'#64748b', ...I }}>{trip?.from}→{trip?.to}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                      <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:13 }}>{fmt(b.amount)}</td>
                      <td style={{ padding:'10px' }}><Pill text={b.status} color={statusColor[b.status]||'#64748b'}/></td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ══ PAYOUTS ══ */}
        {active==='payouts' && (<>
          <Banner type="info">Release payout to the operator's registered <strong>merchant MoMo code</strong>, not a personal phone number. 8% commission is auto-deducted. Each payout can only be triggered once.</Banner>
          {payouts.map(p => (
            <Card key={p.id} style={{ marginBottom:12, borderLeft:`4px solid ${p.status==='READY'?'#FFC72C':'#22c55e'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{p.operator_name}</div>
                  <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:3 }}>Trip: {state.trips.find(t=>t.id===p.trip_id)?.from}→{state.trips.find(t=>t.id===p.trip_id)?.to}</div>
                  <div style={{ fontSize:13, color:'#64748b', ...I }}>Merchant Code: <strong style={{ color:'#0B3D91' }}>{p.merchant_code}</strong></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'#64748b', ...I }}>Gross: {fmt(p.gross)}</div>
                  <div style={{ fontSize:12, color:'#dc2626', ...I }}>Commission (8%): −{fmt(p.commission)}</div>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#15803d' }}>Net: {fmt(p.net)}</div>
                </div>
              </div>
              <div style={{ marginTop:14, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                {p.status==='READY'
                  ? <Btn variant="success" icon="💸" onClick={() => releasePayout(p.id)}>Release to {p.merchant_code}</Btn>
                  : <span style={{ fontSize:13, color:'#64748b', ...I }}>Released: {p.triggered_at}</span>}
                <Pill text={p.status} color={statusColor[p.status]||'#64748b'}/>
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ RAYLANE FLEET ══ */}
        {active==='fleet' && (<>
          <Banner type="info">Raylane's internal fleet. Trips created for these vehicles are <strong>auto-approved</strong> and go live immediately — no approval queue. Full revenue retained (no commission).</Banner>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
            <Btn variant="blue" icon="➕" onClick={() => setActive('createtrip')}>Create Internal Trip</Btn>
          </div>
          {FLEET_VEHICLES.map(v => (
            <Card key={v.id} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14, flexWrap:'wrap' }}>
                <div style={{ width:48, height:48, borderRadius:14, background:'rgba(11,61,145,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🚌</div>
                <div style={{ flex:1, minWidth:160 }}>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ ...P, fontWeight:700, fontSize:15 }}>{v.reg}</span>
                    <Pill text={v.type} color="#1d4ed8" bg="#dbeafe"/>
                    <Pill text={v.status} color={v.status==='On Route'?'#15803d':v.status==='Maintenance'?'#dc2626':'#64748b'}/>
                  </div>
                  <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:6 }}>Driver: {v.driver} · Route: {v.route}</div>
                  <ProgressBar value={v.fuel} max={100} label={`Fuel: ${v.fuel}%`} showPct height={6}/>
                </div>
                <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                  <Btn size="sm" variant="blue" onClick={() => toast(`Managing ${v.reg}…`,'success')}>Manage</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => toast(`Schedule maintenance for ${v.reg}`,'success')}>Service</Btn>
                </div>
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ BANK LOANS ══ */}
        {active==='bankloans' && (<>
          <Banner type="info">Bank Loan Monitor is a <strong>premium service (UGX 150,000/month)</strong>. Raylane provides the tracking platform only.</Banner>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard icon="🏦" label="Monitored Loans" value={state.bank_loans.length} bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="💰" label="Total Principal"  value="UGX 160M" bg="#fef9c3" color="#92400e"/>
            <StatCard icon="✅" label="Total Repaid"     value="UGX 86M"  bg="#dcfce7" color="#15803d"/>
            <StatCard icon="⚠️" label="Overdue"          value={state.bank_loans.filter(l=>l.status==='OVERDUE').length} bg="#fee2e2" color="#dc2626"/>
          </div>
          {state.bank_loans.map(l => (
            <Card key={l.id} style={{ marginBottom:12, borderLeft:`4px solid ${l.status==='OVERDUE'?'#ef4444':l.status==='REPAID'?'#22c55e':'#0B3D91'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:12 }}>
                <div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                    <span style={{ ...P, fontWeight:700, fontSize:15 }}>{l.operator_name}</span>
                    <Pill text={l.status} color={statusColor[l.status]||'#64748b'}/>
                  </div>
                  <div style={{ fontSize:13, color:'#64748b', ...I }}>{l.bank} · {l.id}{l.nextDue&&` · Due: ${l.nextDue}`}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(l.principal)}</div>
                  <div style={{ fontSize:12, color:'#64748b', ...I }}>{fmt(l.monthly)}/month</div>
                </div>
              </div>
              <ProgressBar value={l.paid} max={l.principal} showPct label={`Repaid: ${fmt(l.paid)}`}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#64748b', ...I, marginTop:6 }}>
                <span>Months: {l.months_paid}/{l.total_months}</span>
                <span>Remaining: {fmt(l.principal-l.paid)}</span>
              </div>
              {l.status==='OVERDUE' && (
                <div style={{ marginTop:10, display:'flex', gap:8, flexWrap:'wrap' }}>
                  <Btn size="sm" variant="danger" onClick={() => toast(`Reminder sent to ${l.operator_name}`,'warning')} icon="📧">Send Reminder</Btn>
                  <Btn size="sm" variant="ghost"  onClick={() => toast('Contacting bank…','success')} icon="📞">Contact Bank</Btn>
                </div>
              )}
            </Card>
          ))}
        </>)}

        {/* ══ SERVICES MARKETPLACE ══ */}
        {active==='services' && (<>
          <Banner type="info">All services are activated <strong>per operator, on request only</strong> after payment confirmation. Each activation is logged in the audit trail.</Banner>
          {state.operators.filter(o=>o.operator_type!=='INTERNAL').map(op => (
            <Card key={op.id} style={{ marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:14 }}>{op.company_name}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:10 }}>
                {MODULE_DEFS.filter(m=>m.price>0).map(mod => {
                  const isActive = op.modules[mod.id]?.status==='ACTIVE'
                  return (
                    <div key={mod.id} style={{ border:`1.5px solid ${isActive?'#22c55e':'#E2E8F0'}`, borderRadius:12, padding:14, background:isActive?'#dcfce7':'#fff' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                        <span style={{ fontSize:20 }}>{mod.icon}</span>
                        {isActive?<Pill text="✅ Active" color="#15803d"/>:<Pill text={fmt(mod.price)+'/mo'} color="#1d4ed8" bg="#dbeafe"/>}
                      </div>
                      <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:8 }}>{mod.name}</div>
                      {isActive
                        ? <Btn size="sm" variant="danger" full onClick={() => { st.deactivateModule(op.id,mod.id); toast(`${mod.name} deactivated`,'warning') }}>Deactivate</Btn>
                        : <Btn size="sm" variant="blue"   full onClick={() => setSvcModal({op,module:mod})}>Activate</Btn>}
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ ALERTS ══ */}
        {active==='alerts' && (
          <Card>
            <SectionHead title="Notifications Inbox" count={unreadCount} action="Mark all read" onAction={() => { st.markAdminRead(); toast('All marked read','success') }}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              {[['🔴 Urgent',ALERTS_DATA.filter(a=>a.type==='urgent').length,'#fee2e2','#dc2626'],['🟡 Normal',ALERTS_DATA.filter(a=>a.type==='normal').length,'#fef9c3','#92400e']].map(([l,v,bg,c])=>(
                <div key={l} style={{ background:bg, borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ ...P, fontWeight:800, fontSize:24, color:c }}>{v}</div>
                  <div style={{ ...P, fontWeight:600, fontSize:13, color:c }}>{l}</div>
                </div>
              ))}
            </div>
            {[...state.notifications.admin, ...ALERTS_DATA].slice(0,10).map((n,i)=>(
              <div key={n.id||i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom:i<9?'1px solid #E2E8F0':'' }}>
                <span style={{ fontSize:17, flexShrink:0, marginTop:2 }}>{n.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ ...P, fontWeight:600, fontSize:13, marginBottom:2 }}>{n.msg||n.title}</div>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>{n.time}{n.detail&&` · ${n.detail}`}</div>
                </div>
                {n.link && <Btn size="sm" variant="ghost" onClick={() => setActive(n.link)}>View →</Btn>}
              </div>
            ))}
          </Card>
        )}

        {/* ══ SYSTEM HEALTH ══ */}
        {active==='syshealth' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
            <StatCard icon="✅" label="Services Online"  value={SYS_METRICS.filter(s=>s.status==='Online'||s.status==='Active'||s.status==='Live').length+'/'+SYS_METRICS.length} bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🎫" label="Active Bookings"  value={state.bookings.length} bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="🚌" label="Live Trips"       value={state.trips.filter(t=>t.status==='APPROVED').length} bg="#fef9c3" color="#92400e"/>
          </div>
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="Service Status"/>
            {SYS_METRICS.map((m,i) => (
              <div key={m.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:i<SYS_METRICS.length-1?'1px solid #E2E8F0':'' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:m.color, animation:m.color==='#15803d'?'blink 2s ease infinite':'none' }}/>
                  <span style={{ ...P, fontWeight:600, fontSize:14 }}>{m.label}</span>
                </div>
                <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'#64748b', ...I }}>Uptime: <strong>{m.uptime}</strong></span>
                  <Pill text={m.status} color={m.color}/>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHead title="Revenue Today"/>
            <BarChart data={[30,55,40,80,65,90,75]} labels={['06:00','08:00','10:00','12:00','14:00','16:00','18:00']} height={100} highlightLast/>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, fontSize:13, color:'#64748b', ...I }}>
              <span>Peak hour: 16:00</span><span>Today total: <strong style={{ color:'#0B3D91' }}>UGX 74.6M</strong></span>
            </div>
          </Card>
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        </>)}

        {/* ══ AUDIT LOG ══ */}
        {active==='audit' && (
          <Card>
            <SectionHead title="Audit Log — Every Action Tracked"/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:400 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Time','Action','Actor','Target','Detail'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
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

        {/* ══ REPORTS ══ */}
        {active==='reports' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard icon="💰" label="Monthly Revenue"   value="UGX 74.6M" sub="+6.3%"  bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🎫" label="Total Bookings"    value={state.bookings.length} sub="This month" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="💎" label="Commission Earned" value="UGX 5.97M" sub="8%"    bg="#fef9c3" color="#92400e"/>
            <StatCard icon="🛒" label="Service Revenue"   value="UGX 840K"  sub="Subs"  bg="#f3e8ff" color="#7c3aed"/>
          </div>
          <Card>
            <SectionHead title="Monthly Revenue Trend" action="Export CSV" onAction={() => toast('Generating CSV report…','success')}/>
            <BarChart data={[42,58,51,73,69,90,75,82,95,88,74,92]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} height={120} highlightLast/>
          </Card>
        </>)}

        {/* ══ SETTINGS ══ */}
        {active==='settings' && (
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Commission & Pricing"/>
              <div style={{ ...P, fontWeight:800, fontSize:32, color:'#0B3D91', marginBottom:8 }}>8%</div>
              <div style={{ fontSize:14, color:'#64748b', ...I, marginBottom:16 }}>Applied on all platform bookings. Deducted at payout.</div>
              <Banner type="warning">Changing the commission rate affects all future payouts. Contact the development team before modifying this value.</Banner>
            </Card>
            <Card>
              <SectionHead title="System Status"/>
              {SYS_METRICS.slice(0,4).map((m,i) => (
                <div key={m.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:i<3?'1px solid #E2E8F0':'', alignItems:'center' }}>
                  <span style={{ ...P, fontWeight:600, fontSize:13 }}>{m.label}</span>
                  <span style={{ ...P, fontWeight:700, fontSize:12, color:m.color }}>● {m.status}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Generic placeholder */}
        {!['overview','applications','operators','trips','createtrip','bookings','payments','payouts','parcels','fleet','bankloans','services','users','documents','alerts','audit','syshealth','reports','settings'].includes(active) && (
          <EmptyState icon={NAV.find(n=>n.id===active)?.icon||'📊'} title={NAV.find(n=>n.id===active)?.label} desc="Connect to the Raylane backend API to power this module."/>
        )}
      </div>

      {/* Trip action modal */}
      <Modal open={!!tripModal} onClose={() => { setTripModal(null); setRejectReason(''); setEditForm({}) }} title={tripModal?.action==='reject'?'Reject Trip':'Edit & Approve Trip'}>
        {tripModal && (<>
          <div style={{ background:'#F5F7FA', borderRadius:12, padding:14, marginBottom:16 }}>
            <div style={{ ...P, fontWeight:700, fontSize:15 }}>{tripModal.trip.operator_name} — {tripModal.trip.from}→{tripModal.trip.to}</div>
            <div style={{ fontSize:13, color:'#64748b', ...I, marginTop:4 }}>{tripModal.trip.plate||'—'} · {tripModal.trip.departs} · {fmt(tripModal.trip.price)}/seat</div>
          </div>
          {tripModal.action==='reject' && (
            <Input label="Rejection Reason *" value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Explain why this trip is being rejected…" required hint="Operator will receive this feedback"/>
          )}
          {tripModal.action==='edit' && (
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <Input label="Adjust Price (UGX)" value={editForm.price||''} onChange={e=>setEditForm({...editForm,price:e.target.value})} type="number"/>
              <Input label="Adjust Departure"   value={editForm.departs||''} onChange={e=>setEditForm({...editForm,departs:e.target.value})} placeholder="e.g. 10:30 AM"/>
              <div style={{ gridColumn:'1/-1' }}><Input label="Admin Note" value={editForm.notes||''} onChange={e=>setEditForm({...editForm,notes:e.target.value})}/></div>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={() => { setTripModal(null); setRejectReason('') }}>Cancel</Btn>
            {tripModal.action==='reject'
              ? <Btn variant="danger"  full onClick={() => reject(tripModal.trip.id)}>❌ Confirm Rejection</Btn>
              : <Btn variant="success" full onClick={() => { st.editApproveTrip?st.editApproveTrip(tripModal.trip.id,editForm):st.approveTrip(tripModal.trip.id); toast('✅ Edited & approved!','success'); setTripModal(null) }}>✅ Approve & Make Live</Btn>}
          </div>
        </>)}
      </Modal>

      {/* Service activation modal */}
      <Modal open={!!svcModal} onClose={() => setSvcModal(null)} title={`Activate: ${svcModal?.module?.name}`}>
        {svcModal && (<>
          <div style={{ background:'#F5F7FA', borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{svcModal.module.icon}</div>
            <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{svcModal.module.name}</div>
            <div style={{ ...P, fontWeight:800, fontSize:18, color:'#0B3D91' }}>{fmt(svcModal.module.price)}<span style={{ fontSize:12, color:'#64748b', fontWeight:400 }}>/month</span></div>
          </div>
          <Banner type="warning">Confirm that <strong>{svcModal.op.company_name}</strong> has paid <strong>{fmt(svcModal.module.price)}</strong> before activating. This action is logged in the audit trail.</Banner>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={() => setSvcModal(null)}>Cancel</Btn>
            <Btn variant="gold"  full onClick={activateMod}>✅ Confirm Activation</Btn>
          </div>
        </>)}
      </Modal>
    </div>
  )
}
