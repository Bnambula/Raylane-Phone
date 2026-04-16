import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Modal, Btn, EmptyState } from '../../components/ui/SharedComponents'
import { IconGrid, IconDoc, IconBus, IconChart, IconTicket, IconCash, IconParcel, IconCar, IconUsers, IconAlert, IconSettings, IconReport, IconCheck, IconStar, IconWrench, IconShield, IconSearch, IconSend, IconPhone, IconAnalytics, IconGlobe } from '../../components/ui/Icons'

const P   = { fontFamily:"'Poppins',sans-serif" }
const I   = { fontFamily:"'Inter',sans-serif" }
const fmt = n => 'UGX ' + Number(n || 0).toLocaleString()
const fmtM = n => 'UGX ' + (Number(n || 0)/1000000).toFixed(2) + 'M'
const iS  = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS  = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

const NAV_ITEMS = [
  { id:'overview',     label:'Overview',     Icon:IconGrid    },
  { id:'applications', label:'Applications', Icon:IconDoc,    badge:true },
  { id:'operators',    label:'Operators',    Icon:IconBus     },
  { id:'trips',        label:'Live Trips',   Icon:IconChart,  badge:true },
  { id:'bookings',     label:'Bookings',     Icon:IconTicket  },
  { id:'payments',     label:'Payments',     Icon:IconCash    },
  { id:'payouts',      label:'Payouts',      Icon:IconSend    },
  { id:'fleet',        label:'Fleet',        Icon:IconCar     },
  { id:'services',     label:'Services',     Icon:IconStar    },
  { id:'users',        label:'Users',        Icon:IconUsers   },
  { id:'alerts',       label:'Alerts',       Icon:IconAlert,  badge:true },
  { id:'audit',        label:'Audit Log',    Icon:IconShield  },
  { id:'syshealth',    label:'System',       Icon:IconWrench  },
  { id:'financial',    label:'Financials',   Icon:IconAnalytics },
  { id:'reports',      label:'Reports',      Icon:IconReport  },
  { id:'settings',     label:'Settings',     Icon:IconSettings },
]

const MODULE_DEFS = [
  { id:'booking_basic',    name:'Booking System',   price:0       },
  { id:'parcel_basic',     name:'Parcel System',    price:0       },
  { id:'financial_module', name:'Financial Module', price:100000  },
  { id:'fuel_module',      name:'Fuel Management',  price:80000   },
  { id:'analytics_module', name:'Analytics',        price:100000  },
  { id:'hr_module',        name:'Staff / HR',       price:100000  },
  { id:'fleet_module',     name:'Fleet Mgmt',       price:120000  },
  { id:'cost_center',      name:'Cost Center',      price:80000   },
]

const ALL_MODULES = ['Booking','Parcels','Trips','Seat Manager','Bookings View','Payments','Cost Center','Financial','Drivers','Fleet','Staff/HR','Fuel','Analytics','Alerts','Settings']

const DEMO_VEHICLES = [
  { id:'VH-001', reg:'UBF 001K', type:'67-Seater Coach', driver:'James Okello',   fleet:'Raylane Express Fleet', status:'Active',      fuel:72, ins:'2026-12-31', fit:'2026-09-30', mileage:124500 },
  { id:'VH-002', reg:'UBF 002K', type:'67-Seater Coach', driver:'Sarah Nakato',   fleet:'Raylane Express Fleet', status:'Active',      fuel:91, ins:'2026-12-31', fit:'2026-08-15', mileage:89200  },
  { id:'VH-003', reg:'UBF 003K', type:'14-Seater Taxi',  driver:'Peter Mwesiga', fleet:'Raylane Express Fleet', status:'Maintenance', fuel:35, ins:'2026-06-30', fit:'2026-07-01', mileage:212000 },
  { id:'VH-004', reg:'UAR 901J', type:'67-Seater Coach', driver:'Moses Kato',    fleet:'Global Coaches Ltd',    status:'Active',      fuel:78, ins:'2026-11-30', fit:'2026-10-15', mileage:98000  },
]

const DEMO_USERS = [
  { id:'U1', name:'James Okello',   email:'james@raylane.com',    role:'ADMIN',          op:'Raylane Express',  fleet:'internal', status:'Active',    joined:'2024-01-15', modules:ALL_MODULES },
  { id:'U2', name:'Sarah Nakato',   email:'sarah@raylane.com',    role:'DISPATCHER',     op:'Raylane Express',  fleet:'internal', status:'Active',    joined:'2024-02-01', modules:['Trips','Bookings View','Seat Manager','Alerts'] },
  { id:'U3', name:'John Ssemakula', email:'john@globalcoaches.ug',role:'OPERATOR_ADMIN', op:'Global Coaches',   fleet:'external', status:'Active',    joined:'2024-01-16', modules:['Booking','Parcels','Trips','Payments','Cost Center','Drivers','Fleet','Alerts','Settings'] },
  { id:'U4', name:'Grace Auma',     email:'grace@fastcoaches.ug', role:'OPERATOR_ADMIN', op:'Fast Coaches',     fleet:'external', status:'Active',    joined:'2024-08-02', modules:['Booking','Parcels','Trips','Payments','Alerts','Settings'] },
  { id:'U5', name:'Ali Nsubuga',    email:'ali@raylane.com',      role:'ACCOUNTANT',     op:'Raylane Express',  fleet:'internal', status:'Suspended', joined:'2024-05-01', modules:['Financial','Payments','Cost Center','Reports'] },
  { id:'U6', name:'Moses Kato',     email:'moses@globalcoaches.ug',role:'LOADER',        op:'Global Coaches',   fleet:'external', status:'Active',    joined:'2024-03-10', modules:['Trips','Bookings View','Seat Manager'] },
]

const DEMO_PAYMENTS = [
  { id:'PMT-001', type:'Rent',      vendor:'Kampala Properties Ltd', desc:'Office rent Kampala Coach Park - June 2026', amount:2500000, due:'2026-06-01', period:'Jun 2026', status:'UNPAID', invoice:'KPL-INV-2026-06' },
  { id:'PMT-002', type:'Utility',   vendor:'UMEME Ltd',              desc:'Electricity - HQ and workshop May 2026',     amount:380000,  due:'2026-05-20', period:'May 2026', status:'UNPAID', invoice:'UMEME-0452891'  },
  { id:'PMT-003', type:'Utility',   vendor:'National Water Uganda',  desc:'Water supply - garage and offices Q2',       amount:145000,  due:'2026-05-25', period:'Q2 2026',  status:'UNPAID', invoice:'NWC-2026-0341'  },
  { id:'PMT-004', type:'Insurance', vendor:'UAP Old Mutual Uganda',  desc:'Fleet PSV insurance all RLX vehicles H1',    amount:4200000, due:'2026-05-31', period:'H1 2026',  status:'UNPAID', invoice:'UAP-2026-FL01'  },
  { id:'PMT-005', type:'Internet',  vendor:'MTN Business Uganda',    desc:'Fibre broadband - HQ and dispatch May',      amount:320000,  due:'2026-05-15', period:'May 2026', status:'PAID',   invoice:'MTN-2026-0098'  },
  { id:'PMT-006', type:'Rent',      vendor:'Kampala Properties Ltd', desc:'Office rent Kampala Coach Park - May 2026',  amount:2500000, due:'2026-05-01', period:'May 2026', status:'PAID',   invoice:'KPL-INV-2026-05' },
  { id:'PMT-007', type:'Utility',   vendor:'UMEME Ltd',              desc:'Electricity - garage workshop Q1 2026',      amount:290000,  due:'2026-04-20', period:'Q1 2026',  status:'OVERDUE',invoice:'UMEME-0449231'  },
  { id:'PMT-008', type:'Cleaning',  vendor:'CleanPro Services',      desc:'Office and facility cleaning - May 2026',    amount:180000,  due:'2026-05-28', period:'May 2026', status:'UNPAID', invoice:'CPS-2026-044'   },
]

const PC_COLOR = { PAID:'#15803d', UNPAID:'#92400e', OVERDUE:'#dc2626' }
const UC_COLOR = { ADMIN:'#7c3aed', OPERATOR_ADMIN:'#1d4ed8', DISPATCHER:'#15803d', ACCOUNTANT:'#d97706', LOADER:'#64748b' }
const SC_COLOR = { Active:'#15803d', Maintenance:'#d97706', Inactive:'#dc2626' }

const SYS = [
  { label:'Booking Engine',  status:'Online',  ok:true,  uptime:'99.9%' },
  { label:'Payment Gateway', status:'Online',  ok:true,  uptime:'99.7%' },
  { label:'Seat Sync',       status:'Live',    ok:true,  uptime:'100%'  },
  { label:'SMS API',         status:'Active',  ok:true,  uptime:'98.4%' },
  { label:'MTN MoMo',        status:'Online',  ok:true,  uptime:'99.1%' },
  { label:'Airtel Money',    status:'Delayed', ok:false, uptime:'94.2%' },
]

const SMS_TEMPLATES = [
  { id:'delay',     label:'Delay Notice',      text:'Dear passenger, your trip [ROUTE] originally departing at [TIME] is delayed by [MINS] minutes. New departure: [NEWTIME]. We apologise for the inconvenience. - Raylane Express' },
  { id:'depart',    label:'Departure Update',  text:'Dear passenger, your [ROUTE] bus departs in 30 minutes from [STAGE]. Please proceed to the departure bay. Your seat [SEAT] is confirmed. - Raylane Express' },
  { id:'weather',   label:'Weather Alert',     text:'Dear passenger, due to adverse weather conditions on [ROUTE], your trip departure has been adjusted to [NEWTIME]. Your safety is our priority. - Raylane Express' },
  { id:'blockage',  label:'Road Blockage',     text:'Dear passenger, there is a reported road incident on [ROUTE]. Our team is monitoring the situation. Estimated delay: [MINS] minutes. - Raylane Express' },
  { id:'cancel',    label:'Cancellation',      text:'Dear passenger, we regret to inform you that your trip [ROUTE] on [DATE] has been cancelled. A full refund will be processed to your MoMo within 2 hours. - Raylane Express' },
  { id:'custom',    label:'Custom Message',    text:'' },
]

const FINANCIAL_PERIODS = ['January 2026','February 2026','March 2026','April 2026','May 2026','Q1 2026','Q2 2026','FY 2025/2026']

const GAAP_REPORTS = [
  { id:'income',     name:'Income Statement (P&L)',           std:'IAS 1',  desc:'Revenue, expenses, EBIT, net profit for the period' },
  { id:'balance',    name:'Statement of Financial Position',  std:'IAS 1',  desc:'Assets, liabilities, and equity - balance sheet' },
  { id:'cashflow',   name:'Statement of Cash Flows',          std:'IAS 7',  desc:'Operating, investing, and financing cash flows' },
  { id:'equity',     name:'Statement of Changes in Equity',   std:'IAS 1',  desc:'Share capital, retained earnings, reserves movements' },
  { id:'notes',      name:'Notes to Financial Statements',    std:'IAS 1',  desc:'Accounting policies, significant judgements, disclosures' },
  { id:'segment',    name:'Segment Report - Routes',          std:'IFRS 8', desc:'Revenue and profit by route/segment' },
  { id:'tax',        name:'URA Tax Computation',              std:'URA',    desc:'VAT, withholding tax, income tax estimate - Uganda' },
  { id:'vat',        name:'VAT Return Summary',               std:'URA',    desc:'Output VAT, input VAT, net VAT payable to URA' },
  { id:'payroll',    name:'PAYE Summary',                     std:'URA',    desc:'Pay-as-you-earn deductions per employee' },
  { id:'qb',         name:'QuickBooks IIF Export',            std:'Intuit', desc:'Import-ready file for QuickBooks Desktop/Online' },
  { id:'csv_all',    name:'Full Transactions CSV',            std:'General',desc:'All income and expense transactions, spreadsheet-ready' },
  { id:'management', name:'Management Accounts',              std:'ICPAU',  desc:'Internal performance report - Uganda accountancy standard' },
]

/* -- Search helper -- */
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position:'relative', marginBottom:14 }}>
      <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
        <IconSearch size={15} color="#94a3b8"/>
      </div>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        style={{ ...iS, paddingLeft:36, background:'#fff' }}/>
      {value && (
        <button onClick={() => onChange('')}
          style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:16 }}>x</button>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { state, st, unreadCount, pendingTrips, pendingApps, adminNotifs } = useAdminStore()
  const toast    = useToast()
  const navigate = useNavigate()

  const [tab,      setTab]      = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [vehicles, setVehicles] = useState(DEMO_VEHICLES)
  const [users,    setUsers]    = useState(DEMO_USERS)
  const [payments, setPayments] = useState(DEMO_PAYMENTS)

  /* Search states */
  const [tripSearch,    setTripSearch]    = useState('')
  const [bookSearch,    setBookSearch]    = useState('')
  const [userSearch,    setUserSearch]    = useState('')
  const [paySearch,     setPaySearch]     = useState('')
  const [auditSearch,   setAuditSearch]   = useState('')
  const [finPeriod,     setFinPeriod]     = useState('May 2026')
  const [finReport,     setFinReport]     = useState(null)

  /* Modal states */
  const [tripModal,    setTripModal]    = useState(null)   // {trip, action:'reject'|'view'|'sms'|'edit'}
  const [svcModal,     setSvcModal]     = useState(null)
  const [vModal,       setVModal]       = useState(null)
  const [uModal,       setUModal]       = useState(null)
  const [pModal,       setPModal]       = useState(null)   // payment add/edit
  const [payoutModal,  setPayoutModal]  = useState(null)   // payout preview
  const [appModal,     setAppModal]     = useState(null)   // application view
  const [rejectR,      setRejectR]      = useState('')
  const [smsText,      setSmsText]      = useState('')
  const [smsTemplate,  setSmsTemplate]  = useState('delay')
  const [editDeparts,  setEditDeparts]  = useState('')

  /* Forms */
  const [vForm, setVForm] = useState({ reg:'', type:'67-Seater Coach', driver:'', fleet:'Raylane Express Fleet', status:'Active', ins:'', fit:'' })
  const [uForm, setUForm] = useState({ name:'', email:'', phone:'', role:'DISPATCHER', op:'Raylane Express', fleet:'internal', status:'Active', modules:['Booking','Parcels','Trips','Alerts'] })
  const [pForm, setPForm] = useState({ type:'Utility', vendor:'', desc:'', amount:'', due:'', period:'', invoice:'', status:'UNPAID' })

  const trips     = state.trips     || []
  const operators = state.operators || []
  const bookings  = state.bookings  || []
  const payouts   = state.payouts   || []
  const auditLog  = state.audit_log || []
  const apps      = state.applications || []

  /* Filtered data */
  const filteredTrips    = useMemo(() => trips.filter(t => !tripSearch || [t.from,t.to,t.operator_name,t.id,t.plate].some(v => v?.toLowerCase().includes(tripSearch.toLowerCase()))), [trips, tripSearch])
  const filteredBookings = useMemo(() => bookings.filter(b => !bookSearch || [b.id,b.seat,b.phone,b.method].some(v => v?.toLowerCase().includes(bookSearch.toLowerCase()))), [bookings, bookSearch])
  const filteredUsers    = useMemo(() => users.filter(u => !userSearch || [u.name,u.email,u.role,u.op].some(v => v?.toLowerCase().includes(userSearch.toLowerCase()))), [users, userSearch])
  const filteredPayments = useMemo(() => payments.filter(p => !paySearch || [p.vendor,p.desc,p.invoice,p.type,p.id].some(v => v?.toLowerCase().includes(paySearch.toLowerCase()))), [payments, paySearch])
  const filteredAudit    = useMemo(() => auditLog.filter(e => !auditSearch || [e.actor,e.action,e.detail,e.target].some(v => v?.toLowerCase().includes(auditSearch.toLowerCase()))), [auditLog, auditSearch])

  /* Financial summary */
  const totalRevenue    = bookings.filter(b => b.status === 'CONFIRMED').reduce((s,b) => s + (b.amount||0), 0)
  const totalCommission = Math.round(totalRevenue * 0.08)
  const totalCosts      = payments.filter(p => p.status !== 'UNPAID').reduce((s,p) => s + p.amount, 0)
  const netProfit       = totalCommission - totalCosts

  const approve = id => { st.approveTrip(id); toast('Trip approved and live', 'success') }
  const reject  = id => {
    if (!rejectR.trim()) { toast('Enter rejection reason', 'warning'); return }
    st.rejectTrip(id, rejectR)
    toast('Trip rejected', 'error')
    setTripModal(null); setRejectR('')
  }

  const sendSmsUpdate = () => {
    if (!smsText.trim()) { toast('Enter message text', 'warning'); return }
    toast('SMS sent to all ' + (tripModal?.trip?.seats_booked || 0) + ' passengers on this trip', 'success')
    setTripModal(null)
  }

  /* Generate financial statement */
  const genReport = (report) => {
    setFinReport(report)
  }

  /* Sidebar */
  const Sidebar = () => (
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
      <nav style={{ flex:1, padding:'4px 0', overflowY:'auto' }}>
        {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
          const bc = badge ? (id==='alerts' ? unreadCount : id==='trips' ? pendingTrips.length : id==='applications' ? pendingApps.length : 0) : 0
          const isAct = tab === id
          return (
            <button key={id} onClick={() => { setTab(id); setMenuOpen(false) }}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:isAct?'rgba(255,199,44,.12)':'none', color:isAct?'#FFC72C':'rgba(255,255,255,.65)', borderLeft:`3px solid ${isAct?'#FFC72C':'transparent'}`, ...P, fontWeight:600, fontSize:11, border:'none', cursor:'pointer', width:'100%', textAlign:'left', transition:'all .18s' }}>
              <Icon size={13} color={isAct?'#FFC72C':'rgba(255,255,255,.45)'}/>
              <span style={{ flex:1 }}>{label}</span>
              {bc > 0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700 }}>{bc}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'8px 12px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column', gap:5 }}>
        <button onClick={() => { st.resetToInitial && st.resetToInitial(); sessionStorage.clear(); toast('Reset','success') }}
          style={{ width:'100%', padding:'5px', borderRadius:7, background:'rgba(255,100,100,.12)', color:'rgba(255,150,150,.8)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:9 }}>Reset Demo</button>
        <button onClick={() => navigate('/')}
          style={{ width:'100%', padding:'6px', borderRadius:7, background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.5)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:10 }}>Back to Site</button>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>
      <Sidebar/>

      {/* MAIN */}
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:22 }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setMenuOpen(o=>!o)} style={{ width:36, height:36, borderRadius:9, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IconGrid size={15} color="#0B3D91"/>
            </button>
            <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(14px,2vw,20px)', margin:0 }}>
              {(NAV_ITEMS.find(n=>n.id===tab)||{}).label||'Dashboard'}
            </h1>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount > 0 && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:12 }}>{unreadCount} new</span>}
            <div style={{ width:32, height:32, borderRadius:9, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFC72C', ...P, fontWeight:800, fontSize:12 }}>AD</div>
          </div>
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
              <StatCard label="Daily Bookings"    value={bookings.length}                                          sub="+11.5%"      bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Revenue Today"     value={fmtM(totalRevenue)}                                       sub="+6.3%"       bg="#dcfce7" color="#15803d"/>
              <StatCard label="Active Operators"  value={operators.filter(o=>o.status==='ACTIVE').length}          sub="Live"        bg="#f3e8ff" color="#7c3aed"/>
              <StatCard label="Pending Actions"   value={pendingTrips.length+pendingApps.length}                   sub="Need action" bg="#fef9c3" color="#92400e"/>
            </div>
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <Card>
                <SectionHead title="Pending Trip Approvals" count={pendingTrips.length} action="View All" onAction={() => setTab('trips')}/>
                {pendingTrips.length===0 ? <EmptyState title="All caught up"/> :
                  pendingTrips.slice(0,3).map(t => (
                    <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0', flexWrap:'wrap' }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:13 }}>{t.operator_name} -- {t.from} to {t.to}</div>
                        <div style={{ fontSize:11, color:'#64748b', ...I }}>{t.departs} -- {fmt(t.price)}/seat -- {t.seat_type}-seater</div>
                      </div>
                      <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                        <button onClick={() => setTripModal({trip:t,action:'view'})} style={{ padding:'4px 9px', borderRadius:7, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>View</button>
                        <Btn size="sm" variant="success" onClick={() => approve(t.id)}>Approve</Btn>
                        <Btn size="sm" variant="danger"  onClick={() => setTripModal({trip:t,action:'reject'})}>Reject</Btn>
                      </div>
                    </div>
                  ))
                }
              </Card>
              <Card>
                <SectionHead title="Applications" count={pendingApps.length} action="View All" onAction={() => setTab('applications')}/>
                {pendingApps.length===0 ? <EmptyState title="No pending"/> :
                  pendingApps.slice(0,3).map(a => (
                    <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:13 }}>{a.company_name}</div>
                        <div style={{ fontSize:11, color:'#64748b', ...I }}>{a.contact_name} -- {a.fleet_size} vehicles</div>
                      </div>
                      <button onClick={() => setAppModal(a)} style={{ padding:'4px 9px', borderRadius:7, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>View</button>
                      <Btn size="sm" variant="blue" onClick={() => { st.approveApplication(a.id); toast(a.company_name+' approved','success') }}>Approve</Btn>
                    </div>
                  ))
                }
              </Card>
            </div>
            <Card style={{ background:'#0B3D91' }}>
              <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'space-around' }}>
                {[['Live Trips',trips.filter(t=>t.status==='APPROVED').length,'#7dd3fc'],['Total Bookings',bookings.length,'#86efac'],['Operators',operators.length,'#FFC72C'],['Payouts Ready',payouts.filter(p=>p.status==='READY').length,'#fca5a5']].map(([l,v,c])=>(
                  <div key={l} style={{ textAlign:'center', color:'#fff' }}>
                    <div style={{ ...P, fontWeight:800, fontSize:28, color:c }}>{v}</div>
                    <div style={{ fontSize:12, opacity:.75 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* APPLICATIONS */}
        {tab==='applications' && (
          <div>
            <SearchBar value={auditSearch} onChange={setAuditSearch} placeholder="Search by company, contact, phone..."/>
            {apps.map(a => (
              <Card key={a.id} style={{ marginBottom:12, borderLeft:`4px solid ${a.status==='PENDING_REVIEW'?'#FFC72C':'#22c55e'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:6 }}>
                      <span style={{ ...P, fontWeight:700, fontSize:16 }}>{a.company_name}</span>
                      <Pill text={a.status.replace(/_/g,' ')} color={a.status==='PENDING_REVIEW'?'#92400e':'#15803d'}/>
                    </div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>{a.contact_name} -- {a.phone} -- {a.fleet_size} vehicles</div>
                  </div>
                  {a.status==='PENDING_REVIEW' && (
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <button onClick={() => setAppModal(a)} style={{ padding:'8px 16px', borderRadius:10, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:700, fontSize:13 }}>Preview Application</button>
                      <Btn variant="success" onClick={() => { st.approveApplication(a.id); toast(a.company_name+' approved','success') }}>Approve and Onboard</Btn>
                      <Btn variant="danger"  onClick={() => toast('Rejected','error')}>Reject</Btn>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* OPERATORS */}
        {tab==='operators' && (
          <div>
            {operators.map(op => (
              <Card key={op.id} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                  <div>
                    <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:5 }}>
                      <span style={{ ...P, fontWeight:700, fontSize:16 }}>{op.company_name}</span>
                      <Pill text={op.status} color={op.status==='ACTIVE'?'#15803d':'#dc2626'}/>
                      {op.operator_type==='INTERNAL' && <Pill text="Raylane Fleet" color="#7c3aed" bg="#ede9fe"/>}
                    </div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>Merchant: <strong style={{ color:'#0B3D91' }}>{op.merchant_code}</strong> -- Commission: {((op.commission_rate||0)*100)}% -- Phone: {op.phone}</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:8 }}>
                  {MODULE_DEFS.map(mod => {
                    const isAct = op.modules?.[mod.id]?.status==='ACTIVE'
                    return (
                      <div key={mod.id} style={{ background:isAct?'#dcfce7':'#fff', borderRadius:10, padding:'10px 12px', border:`1px solid ${isAct?'#22c55e':'#E2E8F0'}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                        <div>
                          <div style={{ ...P, fontWeight:600, fontSize:12 }}>{mod.name}</div>
                          <div style={{ fontSize:10, color:'#64748b' }}>{isAct?'Active':mod.price?fmt(mod.price)+'/mo':'Free'}</div>
                        </div>
                        <button onClick={() => isAct?st.deactivateModule(op.id,mod.id):setSvcModal({op,module:mod})}
                          style={{ width:24, height:24, borderRadius:6, background:isAct?'#fee2e2':'#0B3D91', color:isAct?'#dc2626':'#fff', border:'none', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                          {isAct?'x':'+'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* LIVE TRIPS - with SMS and management */}
        {tab==='trips' && (
          <div>
            <SearchBar value={tripSearch} onChange={setTripSearch} placeholder="Search by route, operator, trip ID, plate..."/>
            <Banner type="info">APPROVED trips are live on the website. Use the SMS button to send instant updates to all passengers on a trip.</Banner>
            {['PENDING_APPROVAL','APPROVED','REJECTED'].map(sg => {
              const grp = filteredTrips.filter(t=>t.status===sg)
              if (!grp.length) return null
              return (
                <div key={sg} style={{ marginBottom:20 }}>
                  <h3 style={{ ...P, fontWeight:700, fontSize:12, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                    {sg==='PENDING_APPROVAL'?'Awaiting Approval':sg==='APPROVED'?'Live on Website':'Rejected'}
                    <span style={{ marginLeft:8, background:'#E2E8F0', borderRadius:10, padding:'2px 8px', fontSize:11 }}>{grp.length}</span>
                  </h3>
                  {grp.map(t => (
                    <Card key={t.id} style={{ marginBottom:10, borderLeft:`4px solid ${t.status==='APPROVED'?'#22c55e':t.status==='PENDING_APPROVAL'?'#FFC72C':'#ef4444'}` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:t.status==='APPROVED'?10:0 }}>
                        <div>
                          <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{t.operator_name} -- {t.from} to {t.to}</div>
                          <div style={{ fontSize:13, color:'#64748b', ...I }}>{t.departs} -- {t.date} -- {t.seat_type}-seater -- {fmt(t.price)}/seat -- {t.seats_booked}/{t.seats_total} booked</div>
                          {t.rejection_reason && <div style={{ marginTop:6, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626' }}>{t.rejection_reason}</div>}
                        </div>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap', flexShrink:0 }}>
                          <button onClick={() => setTripModal({trip:t,action:'view'})} style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:700, fontSize:12 }}>View</button>
                          {t.status==='APPROVED' && (<>
                            <button onClick={() => { setTripModal({trip:t,action:'sms'}); setSmsText('') }} style={{ padding:'6px 12px', borderRadius:8, background:'#dcfce7', color:'#15803d', border:'none', cursor:'pointer', ...P, fontWeight:700, fontSize:12 }}>SMS Passengers</button>
                            <button onClick={() => { setTripModal({trip:t,action:'edit'}); setEditDeparts(t.departs) }} style={{ padding:'6px 12px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:700, fontSize:12 }}>Edit Departure</button>
                          </>)}
                          {t.status==='PENDING_APPROVAL' && (<>
                            <Btn size="sm" variant="success" onClick={() => approve(t.id)}>Approve</Btn>
                            <Btn size="sm" variant="danger"  onClick={() => setTripModal({trip:t,action:'reject'})}>Reject</Btn>
                          </>)}
                        </div>
                      </div>
                      {t.status==='APPROVED' && <ProgressBar value={t.seats_booked} max={t.seats_total} label={t.seats_booked+'/'+t.seats_total+' seats booked'} showPct/>}
                    </Card>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {/* BOOKINGS */}
        {tab==='bookings' && (
          <Card>
            <div style={{ marginBottom:14 }}>
              <SearchBar value={bookSearch} onChange={setBookSearch} placeholder="Search by booking ID, seat number, phone, method..."/>
            </div>
            <SectionHead title="All Bookings" count={filteredBookings.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:520 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['ID','Route','Seat','Phone','Method','Amount','Type','Status'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{filteredBookings.map(b => {
                  const trip = trips.find(t=>t.id===b.trip_id)
                  return (
                    <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{trip?trip.from+' to '+trip.to:'--'}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{b.phone||'--'}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                      <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(b.amount)}</td>
                      <td style={{ padding:'10px' }}><Pill text={b.booking_type||'STANDARD'} color="#1d4ed8" bg="#dbeafe"/></td>
                      <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status==='CONFIRMED'?'#15803d':'#dc2626'}/></td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          </Card>
        )}

        {/* PAYMENTS - fixed with state-based modal */}
        {tab==='payments' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:14 }}>
              <StatCard label="Unpaid Bills"    value={payments.filter(p=>p.status==='UNPAID').length}  sub="Due this month" bg="#fef9c3" color="#92400e"/>
              <StatCard label="Overdue"         value={payments.filter(p=>p.status==='OVERDUE').length} sub="Past due date"  bg="#fee2e2" color="#dc2626"/>
              <StatCard label="Total Outstanding" value={fmt(payments.filter(p=>p.status!=='PAID').reduce((s,p)=>s+p.amount,0))} bg="#dbeafe" color="#1d4ed8"/>
            </div>
            <SearchBar value={paySearch} onChange={setPaySearch} placeholder="Search by vendor, invoice number, type, description..."/>
            <Card>
              <SectionHead title="Payment Obligations" action="Add Invoice" onAction={() => { setPForm({ type:'Utility', vendor:'', desc:'', amount:'', due:'', period:'', invoice:'', status:'UNPAID' }); setPModal('add') }}/>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['Type','Vendor','Description','Invoice No.','Amount','Due','Status','Actions'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{filteredPayments.map(p=>(
                    <tr key={p.id} style={{ borderBottom:'1px solid #E2E8F0', background:p.status==='OVERDUE'?'#fff8f8':'' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=p.status==='OVERDUE'?'#fff8f8':''}>
                      <td style={{ padding:'10px' }}><Pill text={p.type} color="#1d4ed8" bg="#dbeafe"/></td>
                      <td style={{ padding:'10px', ...P, fontWeight:600, fontSize:13 }}>{p.vendor}</td>
                      <td style={{ padding:'10px', fontSize:12, color:'#64748b', ...I, maxWidth:200 }}>{p.desc}</td>
                      <td style={{ padding:'10px', fontSize:11, color:'#94a3b8', ...I, fontFamily:'monospace' }}>{p.invoice}</td>
                      <td style={{ padding:'10px', ...P, fontWeight:700, color:'#0B3D91' }}>{fmt(p.amount)}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I, color:p.status==='OVERDUE'?'#dc2626':'#0F1923', fontWeight:p.status==='OVERDUE'?700:400 }}>{p.due}</td>
                      <td style={{ padding:'10px' }}><Pill text={p.status} color={PC_COLOR[p.status]||'#64748b'}/></td>
                      <td style={{ padding:'10px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          {p.status!=='PAID' && (
                            <button onClick={() => { setPayments(prev=>prev.map(x=>x.id===p.id?{...x,status:'PAID'}:x)); toast(p.vendor+' marked paid','success') }}
                              style={{ padding:'4px 10px', borderRadius:8, background:'#0B3D91', color:'#fff', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Pay</button>
                          )}
                          <button onClick={() => { setPForm({...p}); setPModal(p) }}
                            style={{ padding:'4px 10px', borderRadius:8, background:'#F5F7FA', color:'#0B3D91', border:'1px solid #E2E8F0', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                          <button onClick={() => { setPayments(prev=>prev.filter(x=>x.id!==p.id)); toast('Removed','warning') }}
                            style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* PAYOUTS - with preview modal */}
        {tab==='payouts' && (
          <div>
            <Banner type="info">Review payout details before releasing. Click Preview to verify amount and merchant code before funds are transferred.</Banner>
            {payouts.map(p => (
              <Card key={p.id} style={{ marginBottom:12, borderLeft:`4px solid ${p.status==='READY'?'#FFC72C':'#22c55e'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4 }}>{p.operator_name}</div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>Merchant: <strong style={{ color:'#0B3D91' }}>{p.merchant_code}</strong></div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>Gross: {fmt(p.gross)} -- Commission (8%): -{fmt(p.commission)}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ ...P, fontWeight:900, fontSize:24, color:'#15803d' }}>{fmt(p.net)}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>Net payout</div>
                  </div>
                </div>
                <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' }}>
                  {p.status==='READY' ? (
                    <>
                      <button onClick={() => setPayoutModal(p)}
                        style={{ padding:'9px 18px', borderRadius:10, background:'#eff6ff', color:'#1d4ed8', border:'1.5px solid #bfdbfe', cursor:'pointer', ...P, fontWeight:700, fontSize:13 }}>
                        Preview Payout Details
                      </button>
                      <Btn variant="success" onClick={() => setPayoutModal(p)}>Review and Release</Btn>
                    </>
                  ) : (
                    <span style={{ fontSize:13, color:'#64748b', ...I }}>Released: {p.triggered_at}</span>
                  )}
                  <Pill text={p.status} color={p.status==='READY'?'#92400e':'#1d4ed8'}/>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* FLEET */}
        {tab==='fleet' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => { setVForm({ reg:'', type:'67-Seater Coach', driver:'', fleet:'Raylane Express Fleet', status:'Active', ins:'', fit:'' }); setVModal('add') }}>+ Add Vehicle</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
              {vehicles.map(v => (
                <Card key={v.id} style={{ borderLeft:`4px solid ${SC_COLOR[v.status]||'#E2E8F0'}` }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'rgba(11,61,145,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <IconBus size={22} color="#0B3D91"/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:3 }}>
                        <span style={{ ...P, fontWeight:800, fontSize:15 }}>{v.reg}</span>
                        <Pill text={v.status} color={SC_COLOR[v.status]||'#64748b'}/>
                      </div>
                      <div style={{ fontSize:12, color:'#64748b', ...I }}>{v.type}</div>
                      <div style={{ fontSize:12, color:'#64748b', ...I }}>Driver: <strong style={{ color:'#0F1923' }}>{v.driver}</strong></div>
                      <div style={{ fontSize:11, color:'#94a3b8', ...I, marginTop:2 }}>{v.fleet}</div>
                    </div>
                  </div>
                  <ProgressBar value={v.fuel} max={100} label={'Fuel: '+v.fuel+'%'} showPct height={5}/>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginTop:8, fontSize:11, color:'#64748b', ...I }}>
                    <span style={{ color:new Date(v.ins)<new Date()?'#dc2626':'inherit' }}>Insurance: {v.ins}</span>
                    <span style={{ color:new Date(v.fit)<new Date()?'#dc2626':'inherit' }}>Fitness: {v.fit}</span>
                    <span>Mileage: {(v.mileage||0).toLocaleString()} km</span>
                  </div>
                  <div style={{ display:'flex', gap:7, marginTop:12, flexWrap:'wrap' }}>
                    <button onClick={() => { setVForm({...v}); setVModal(v) }} style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                    <button onClick={() => { setVehicles(p=>p.map(x=>x.id===v.id?{...x,status:x.status==='Active'?'Maintenance':'Active'}:x)); toast('Status updated','success') }}
                      style={{ padding:'6px 12px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                      {v.status==='Active'?'Set Maintenance':'Set Active'}
                    </button>
                    <button onClick={() => { setVehicles(p=>p.filter(x=>x.id!==v.id)); toast('Removed','error') }} style={{ padding:'6px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Remove</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {tab==='services' && (
          <div>{operators.filter(op=>op.operator_type!=='INTERNAL').map(op=>(
            <Card key={op.id} style={{ marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:14 }}>{op.company_name}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:10 }}>
                {MODULE_DEFS.filter(m=>m.price>0).map(mod=>{
                  const isAct=op.modules?.[mod.id]?.status==='ACTIVE'
                  return (
                    <div key={mod.id} style={{ border:`1.5px solid ${isAct?'#22c55e':'#E2E8F0'}`, borderRadius:12, padding:14, background:isAct?'#dcfce7':'#fff' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                        <div style={{ ...P, fontWeight:600, fontSize:13 }}>{mod.name}</div>
                        {isAct?<Pill text="Active" color="#15803d"/>:<Pill text={fmt(mod.price)+'/mo'} color="#1d4ed8" bg="#dbeafe"/>}
                      </div>
                      {isAct?<Btn size="sm" variant="danger" full onClick={()=>{st.deactivateModule(op.id,mod.id);toast('Deactivated','warning')}}>Deactivate</Btn>
                            :<Btn size="sm" variant="blue"   full onClick={()=>setSvcModal({op,module:mod})}>Activate</Btn>}
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}</div>
        )}

        {/* USERS */}
        {tab==='users' && (
          <div>
            <Banner type="info">Manages all platform users. Operator user requests appear below for approval and account creation.</Banner>
            {/* Pending request from operator */}
            <div style={{ background:'#fef9c3', borderRadius:14, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <div>
                <div style={{ ...P, fontWeight:700, fontSize:13, color:'#92400e', marginBottom:2 }}>Pending User Request -- Global Coaches Ltd</div>
                <div style={{ fontSize:12, ...I, color:'#78350f' }}>John Mugisha -- Dispatcher -- john@globalcoaches.ug -- Submitted 2h ago</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => { setUForm({ name:'John Mugisha', email:'john@globalcoaches.ug', phone:'', role:'DISPATCHER', op:'Global Coaches', fleet:'external', status:'Active', modules:['Trips','Bookings View','Alerts'] }); setUModal('add') }}
                  style={{ padding:'7px 14px', borderRadius:9, background:'#15803d', color:'#fff', border:'none', cursor:'pointer', ...P, fontWeight:700, fontSize:12 }}>Approve and Create Account</button>
                <Btn size="sm" variant="danger" onClick={() => toast('Request declined','error')}>Decline</Btn>
              </div>
            </div>
            <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search by name, email, role, operator..."/>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
              <Btn variant="blue" onClick={() => { setUForm({ name:'', email:'', phone:'', role:'DISPATCHER', op:'Raylane Express', fleet:'internal', status:'Active', modules:['Booking','Parcels','Trips','Alerts'] }); setUModal('add') }}>+ Add User</Btn>
            </div>
            <Card>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:650 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['Name','Email','Role','Operator','Fleet','Modules','Status','Actions'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{filteredUsers.map(u=>(
                    <tr key={u.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:13 }}>{u.name}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{u.email}</td>
                      <td style={{ padding:'10px' }}><Pill text={u.role.replace(/_/g,' ')} color={UC_COLOR[u.role]||'#64748b'}/></td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{u.op}</td>
                      <td style={{ padding:'10px' }}><Pill text={u.fleet==='internal'?'Raylane':'External'} color={u.fleet==='internal'?'#7c3aed':'#1d4ed8'}/></td>
                      <td style={{ padding:'10px', fontSize:11, color:'#64748b', ...I }}>{(u.modules||[]).length} modules</td>
                      <td style={{ padding:'10px' }}><Pill text={u.status} color={u.status==='Active'?'#15803d':'#dc2626'}/></td>
                      <td style={{ padding:'10px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          <button onClick={() => { setUForm({...u}); setUModal(u) }} style={{ padding:'4px 10px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                          <button onClick={() => { setUsers(p=>p.map(x=>x.id===u.id?{...x,status:x.status==='Active'?'Suspended':'Active'}:x)); toast('Status toggled','success') }}
                            style={{ padding:'4px 10px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                            {u.status==='Active'?'Suspend':'Activate'}
                          </button>
                          <button onClick={() => { setUsers(p=>p.filter(x=>x.id!==u.id)); toast('Deleted','error') }}
                            style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ALERTS */}
        {tab==='alerts' && (
          <Card>
            <SectionHead title="Notifications" action="Mark all read" onAction={() => { st.markAdminRead&&st.markAdminRead(); toast('All read','success') }}/>
            {adminNotifs.length===0 ? <EmptyState title="All caught up"/> :
              adminNotifs.map((n,i) => (
                <div key={n.id||i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:i<adminNotifs.length-1?'1px solid #E2E8F0':'', background:!n.read?'#f8faff':'' }}>
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

        {/* AUDIT */}
        {tab==='audit' && (
          <Card>
            <SearchBar value={auditSearch} onChange={setAuditSearch} placeholder="Search by actor, action, target..."/>
            <SectionHead title="Audit Log"/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                  {['Time','Action','Actor','Target','Detail'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{filteredAudit.map((e,i)=>(
                  <tr key={e.id||i} style={{ borderBottom:'1px solid #E2E8F0' }}
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

        {/* SYSTEM */}
        {tab==='syshealth' && (
          <div>
            <Card style={{ marginBottom:14 }}>
              <SectionHead title="Service Status"/>
              {SYS.map((m,i)=>(
                <div key={m.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:i<SYS.length-1?'1px solid #E2E8F0':'' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:m.ok?'#22c55e':'#f59e0b' }}/>
                    <span style={{ ...P, fontWeight:600, fontSize:14 }}>{m.label}</span>
                  </div>
                  <div style={{ display:'flex', gap:16 }}>
                    <span style={{ fontSize:12, color:'#64748b', ...I }}>Uptime: {m.uptime}</span>
                    <Pill text={m.status} color={m.ok?'#15803d':'#d97706'}/>
                  </div>
                </div>
              ))}
            </Card>
            <Card><SectionHead title="Revenue Today"/>
              <BarChart data={[30,55,40,80,65,90,75]} labels={['06:00','08:00','10:00','12:00','14:00','16:00','18:00']} height={100}/>
            </Card>
          </div>
        )}

        {/* FINANCIALS - GAAP/IASB/URA compliant */}
        {tab==='financial' && (
          <div>
            {/* Period selector + summary */}
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:16, flexWrap:'wrap' }}>
              <label style={{ ...P, fontWeight:600, fontSize:13 }}>Period:</label>
              <select value={finPeriod} onChange={e=>setFinPeriod(e.target.value)} style={{ ...iS, width:'auto', padding:'8px 14px' }}>
                {FINANCIAL_PERIODS.map(p=><option key={p}>{p}</option>)}
              </select>
              <Pill text="GAAP / IAS 1" color="#7c3aed" bg="#ede9fe"/>
              <Pill text="IFRS Compliant" color="#1d4ed8" bg="#dbeafe"/>
              <Pill text="URA Ready" color="#15803d" bg="#dcfce7"/>
            </div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Total Revenue"    value={fmtM(totalRevenue)}    sub={finPeriod} bg="#dcfce7" color="#15803d"/>
              <StatCard label="Commission (8%)"  value={fmtM(totalCommission)} sub="Platform income" bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Operating Costs"  value={fmtM(totalCosts)}      sub="All obligations" bg="#fee2e2" color="#dc2626"/>
              <StatCard label="Net Profit"       value={fmtM(Math.abs(netProfit))} sub={netProfit>=0?'Profit':'Loss'} bg={netProfit>=0?'#dcfce7':'#fee2e2'} color={netProfit>=0?'#15803d':'#dc2626'}/>
            </div>

            {/* Condensed Income Statement preview */}
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <Card>
                <SectionHead title="Income Statement (IAS 1) -- Summary"/>
                {[
                  ['Revenue -- Passenger Bookings',   Math.round(totalRevenue*0.70), false],
                  ['Revenue -- Parcel Services',       Math.round(totalRevenue*0.08), false],
                  ['Revenue -- Charter Hire',          Math.round(totalRevenue*0.12), false],
                  ['Revenue -- SaaS Subscriptions',    Math.round(totalRevenue*0.10), false],
                  ['','',true],
                  ['Gross Revenue',                    totalRevenue,                  false, true],
                  ['Less: Platform Commission (8%)',   -totalCommission,              false],
                  ['Less: Operating Expenses',         -totalCosts,                   false],
                  ['','',true],
                  ['Net Profit / (Loss)',               netProfit,                    false, true, true],
                ].map(([l,v,divider,bold,final],i) => divider?(
                  <div key={i} style={{ height:1, background:'#E2E8F0', margin:'6px 0' }}/>
                ):(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:final?'2px solid #0B3D91':'1px solid #F1F5F9' }}>
                    <span style={{ fontSize:13, ...P, fontWeight:bold?700:400, color:bold?'#0F1923':'#475569' }}>{l}</span>
                    <span style={{ fontSize:13, ...P, fontWeight:bold||final?800:600, color:final?(v>=0?'#15803d':'#dc2626'):'#0B3D91' }}>
                      {v>=0?'':''}{fmt(Math.abs(v))}
                    </span>
                  </div>
                ))}
              </Card>
              <Card>
                <SectionHead title="Statement of Financial Position (IAS 1)"/>
                <div style={{ ...P, fontWeight:700, fontSize:12, color:'#64748b', marginBottom:6, textTransform:'uppercase', letterSpacing:1 }}>Assets</div>
                {[['Cash and Cash Equivalents',Math.round(totalRevenue*0.15)],['Accounts Receivable',Math.round(totalRevenue*0.08)],['Prepaid Expenses',Math.round(totalCosts*0.1)],['Property and Equipment (Fleet)',45000000]].map(([l,v])=>(
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <span style={{ fontSize:12, ...I, color:'#475569', paddingLeft:10 }}>{l}</span>
                    <span style={{ fontSize:12, ...P, fontWeight:600, color:'#0B3D91' }}>{fmt(v)}</span>
                  </div>
                ))}
                <div style={{ ...P, fontWeight:700, fontSize:12, color:'#64748b', margin:'10px 0 6px', textTransform:'uppercase', letterSpacing:1 }}>Liabilities</div>
                {[['Accounts Payable',payments.filter(p=>p.status!=='PAID').reduce((s,p)=>s+p.amount,0)],['Deferred Revenue',Math.round(totalRevenue*0.03)]].map(([l,v])=>(
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <span style={{ fontSize:12, ...I, color:'#475569', paddingLeft:10 }}>{l}</span>
                    <span style={{ fontSize:12, ...P, fontWeight:600, color:'#dc2626' }}>{fmt(v)}</span>
                  </div>
                ))}
                <div style={{ ...P, fontWeight:700, fontSize:12, color:'#64748b', margin:'10px 0 6px', textTransform:'uppercase', letterSpacing:1 }}>Equity</div>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'2px solid #0B3D91' }}>
                  <span style={{ fontSize:12, ...I, color:'#475569', paddingLeft:10 }}>Retained Earnings</span>
                  <span style={{ fontSize:12, ...P, fontWeight:700, color:'#15803d' }}>{fmt(Math.max(0,netProfit))}</span>
                </div>
              </Card>
            </div>

            {/* Report generation grid */}
            <Card>
              <SectionHead title="Generate Financial Statements and Reports"/>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:10 }}>
                {GAAP_REPORTS.map(r=>(
                  <button key={r.id} onClick={() => genReport(r)}
                    style={{ background:'#F5F7FA', borderRadius:12, padding:'14px 16px', border:'1.5px solid #E2E8F0', cursor:'pointer', textAlign:'left', transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#0B3D91';e.currentTarget.style.background='#eff6ff'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.background='#F5F7FA'}}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                      <div style={{ ...P, fontWeight:700, fontSize:13, color:'#0B3D91', lineHeight:1.3 }}>{r.name}</div>
                      <span style={{ background:'#ede9fe', color:'#7c3aed', padding:'2px 7px', borderRadius:6, fontSize:9, ...P, fontWeight:700, flexShrink:0, marginLeft:6 }}>{r.std}</span>
                    </div>
                    <div style={{ fontSize:11, color:'#64748b', ...I, lineHeight:1.5 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* REPORTS */}
        {tab==='reports' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Monthly Revenue"   value={fmtM(totalRevenue)} sub="+6.3%" bg="#dcfce7" color="#15803d"/>
              <StatCard label="Total Bookings"    value={bookings.length}                bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Commission"        value={fmtM(totalCommission)}          bg="#fef9c3" color="#92400e"/>
              <StatCard label="Active Operators"  value={operators.filter(o=>o.status==='ACTIVE').length} bg="#f3e8ff" color="#7c3aed"/>
            </div>
            <Card>
              <SectionHead title="Monthly Revenue" action="Export CSV" onAction={() => toast('Generating report...','success')}/>
              <BarChart data={[42,58,51,73,69,90,75,82,95,88,74,92]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} height={120}/>
            </Card>
          </div>
        )}

        {/* SETTINGS */}
        {tab==='settings' && (
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Commission Settings"/>
              <div style={{ ...P, fontWeight:800, fontSize:36, color:'#0B3D91', marginBottom:8 }}>8%</div>
              <p style={{ fontSize:14, color:'#64748b', ...I, marginBottom:14 }}>Applied on all external operator bookings. Deducted at payout.</p>
              <Banner type="warning">Contact development team before modifying. Changes affect all future payouts.</Banner>
            </Card>
            <Card>
              <SectionHead title="Platform Info"/>
              {[['Version','v7.0 Production'],['Database','Supabase PostgreSQL'],['Payments','MTN MoMo + Airtel + DPO'],['SMS','Africa Talking API'],['Standards','GAAP / IFRS / URA']].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <span style={{ ...P, fontWeight:600, fontSize:13 }}>{l}</span>
                  <span style={{ fontSize:13, color:'#64748b', ...I }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* -- TRIP VIEW / REJECT / SMS / EDIT MODAL -- */}
      <Modal open={!!tripModal} onClose={() => { setTripModal(null); setRejectR('') }} title={
        tripModal?.action==='view'?'Trip Details':tripModal?.action==='sms'?'Send SMS to All Passengers':tripModal?.action==='edit'?'Update Departure Time':'Reject Trip'
      }>
        {tripModal && (
          <div>
            <div style={{ background:'#F5F7FA', borderRadius:14, padding:16, marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{tripModal.trip.operator_name} -- {tripModal.trip.from} to {tripModal.trip.to}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:13, ...I, color:'#64748b', marginTop:8 }}>
                <span>Departure: {tripModal.trip.departs}</span>
                <span>Date: {tripModal.trip.date}</span>
                <span>Vehicle: {tripModal.trip.seat_type}-seater</span>
                <span>Price: {fmt(tripModal.trip.price)}/seat</span>
                <span>Booked: {tripModal.trip.seats_booked}/{tripModal.trip.seats_total}</span>
                <span>Status: {tripModal.trip.status}</span>
                <span>Boarding: {tripModal.trip.boarding_pin?.label||'--'}</span>
                <span>Plate: {tripModal.trip.plate||'--'}</span>
              </div>
            </div>

            {tripModal.action==='view' && (
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <Btn variant="ghost" full onClick={() => setTripModal(null)}>Close</Btn>
                {tripModal.trip.status==='PENDING_APPROVAL' && (<>
                  <Btn variant="success" full onClick={() => { approve(tripModal.trip.id); setTripModal(null) }}>Approve Trip</Btn>
                  <Btn variant="danger"  full onClick={() => setTripModal({...tripModal,action:'reject'})}>Reject Trip</Btn>
                </>)}
                {tripModal.trip.status==='APPROVED' && (
                  <Btn variant="blue" full onClick={() => setTripModal({...tripModal,action:'sms'})}>Send SMS to Passengers</Btn>
                )}
              </div>
            )}

            {tripModal.action==='reject' && (
              <div>
                <div style={{ marginBottom:16 }}>
                  <label style={lS}>Rejection Reason *</label>
                  <textarea value={rejectR} onChange={e=>setRejectR(e.target.value)} placeholder="Explain why..." rows={3} style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <Btn variant="ghost" full onClick={() => setTripModal(null)}>Cancel</Btn>
                  <Btn variant="danger" full onClick={() => reject(tripModal.trip.id)}>Confirm Rejection</Btn>
                </div>
              </div>
            )}

            {tripModal.action==='sms' && (
              <div>
                <div style={{ marginBottom:12 }}>
                  <label style={lS}>Message Template</label>
                  <select value={smsTemplate} onChange={e=>{ setSmsTemplate(e.target.value); setSmsText(SMS_TEMPLATES.find(t=>t.id===e.target.value)?.text||'') }} style={iS}>
                    {SMS_TEMPLATES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={lS}>Message Text * ({160-smsText.length} chars left)</label>
                  <textarea value={smsText} onChange={e=>setSmsText(e.target.value.slice(0,160))} rows={4} placeholder="Type your message to all passengers on this trip..." style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
                </div>
                <div style={{ background:'#eff6ff', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:12, ...I, color:'#1d4ed8' }}>
                  This will send to all <strong>{tripModal.trip.seats_booked}</strong> confirmed passengers on this trip. Cost: approx. UGX {(tripModal.trip.seats_booked*150).toLocaleString()} via Africa Talking.
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <Btn variant="ghost" full onClick={() => setTripModal(null)}>Cancel</Btn>
                  <Btn variant="success" full onClick={sendSmsUpdate}>Send SMS Now</Btn>
                </div>
              </div>
            )}

            {tripModal.action==='edit' && (
              <div>
                <div style={{ marginBottom:12 }}>
                  <label style={lS}>New Departure Time *</label>
                  <input type="time" value={editDeparts} onChange={e=>setEditDeparts(e.target.value)} style={iS}/>
                </div>
                <div style={{ background:'#fef9c3', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:12, ...I, color:'#92400e' }}>
                  Changing departure time will auto-send an SMS to all {tripModal.trip.seats_booked} booked passengers notifying them of the change.
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <Btn variant="ghost" full onClick={() => setTripModal(null)}>Cancel</Btn>
                  <Btn variant="gold" full onClick={() => { toast('Departure updated to '+editDeparts+' -- SMS sent to passengers','success'); setTripModal(null) }}>Update and Notify</Btn>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* -- APPLICATION PREVIEW MODAL -- */}
      <Modal open={!!appModal} onClose={() => setAppModal(null)} title="Application Preview">
        {appModal && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[['Company',appModal.company_name],['Contact',appModal.contact_name],['Phone',appModal.phone],['Email',appModal.email||'--'],['Fleet Size',appModal.fleet_size+' vehicles'],['Status',appModal.status?.replace(/_/g,' ')]].map(([l,v])=>(
                <div key={l} style={{ background:'#F5F7FA', borderRadius:10, padding:'10px 12px' }}>
                  <div style={{ fontSize:10, ...P, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1.2, marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:14, ...P, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Btn variant="ghost" full onClick={() => setAppModal(null)}>Close</Btn>
              {appModal.status==='PENDING_REVIEW' && (
                <Btn variant="success" full onClick={() => { st.approveApplication(appModal.id); toast(appModal.company_name+' approved','success'); setAppModal(null) }}>Approve and Onboard</Btn>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* -- PAYOUT PREVIEW MODAL -- */}
      <Modal open={!!payoutModal} onClose={() => setPayoutModal(null)} title="Payout Review -- Confirm Before Release">
        {payoutModal && (
          <div>
            <div style={{ background:'#F5F7FA', borderRadius:14, padding:20, marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:18, marginBottom:14, color:'#0B3D91' }}>Payout to {payoutModal.operator_name}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[['Merchant MoMo Code',payoutModal.merchant_code],['Gross Revenue',fmt(payoutModal.gross)],['Commission Deducted',fmt(payoutModal.commission)],['Net to Operator',fmt(payoutModal.net)]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{ fontSize:11, color:'#64748b', ...I, marginBottom:3 }}>{l}</div>
                    <div style={{ ...P, fontWeight:700, fontSize:l==='Net to Operator'?20:14, color:l==='Net to Operator'?'#15803d':l.includes('Commission')?'#dc2626':'#0F1923' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <Banner type="warning">This will initiate an MTN MoMo transfer of <strong>{fmt(payoutModal.net)}</strong> to merchant code <strong>{payoutModal.merchant_code}</strong>. This action cannot be undone.</Banner>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
              <Btn variant="ghost" full onClick={() => setPayoutModal(null)}>Cancel</Btn>
              <Btn variant="success" full onClick={() => { st.releasePayout&&st.releasePayout(payoutModal.id); toast(fmt(payoutModal.net)+' released to '+payoutModal.merchant_code,'success'); setPayoutModal(null) }}>Confirm Release</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* -- PAYMENT MODAL (state-based -- fixes unresponsive buttons) -- */}
      <Modal open={!!pModal} onClose={() => setPModal(null)} title={pModal==='add'?'Add Invoice':'Edit Invoice'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label style={lS}>Type</label>
            <select value={pForm.type} onChange={e=>setPForm({...pForm,type:e.target.value})} style={iS}>
              {['Utility','Rent','Insurance','Internet','Cleaning','Maintenance','Other'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={lS}>Vendor *</label>
            <input value={pForm.vendor} onChange={e=>setPForm({...pForm,vendor:e.target.value})} placeholder="Vendor name" style={iS}/>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description</label>
            <input value={pForm.desc} onChange={e=>setPForm({...pForm,desc:e.target.value})} placeholder="Invoice description..." style={iS}/>
          </div>
          <div><label style={lS}>Invoice Number</label>
            <input value={pForm.invoice} onChange={e=>setPForm({...pForm,invoice:e.target.value})} placeholder="INV-2026-xxx" style={iS}/>
          </div>
          <div><label style={lS}>Amount (UGX) *</label>
            <input type="number" value={pForm.amount} onChange={e=>setPForm({...pForm,amount:e.target.value})} placeholder="e.g. 500000" style={iS}/>
          </div>
          <div><label style={lS}>Due Date *</label>
            <input type="date" value={pForm.due} onChange={e=>setPForm({...pForm,due:e.target.value})} style={iS}/>
          </div>
          <div><label style={lS}>Period</label>
            <input value={pForm.period} onChange={e=>setPForm({...pForm,period:e.target.value})} placeholder="e.g. May 2026" style={iS}/>
          </div>
          <div><label style={lS}>Status</label>
            <select value={pForm.status} onChange={e=>setPForm({...pForm,status:e.target.value})} style={iS}>
              {['UNPAID','PAID','OVERDUE'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setPModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (!pForm.vendor || !pForm.amount || !pForm.due) { toast('Fill required fields','warning'); return }
            if (pModal==='add') {
              setPayments(prev=>[...prev,{...pForm,id:'PMT-'+Date.now(),amount:parseInt(pForm.amount)}])
              toast('Invoice added','success')
            } else {
              setPayments(prev=>prev.map(x=>x.id===pModal.id?{...pForm,id:x.id,amount:parseInt(pForm.amount)}:x))
              toast('Invoice updated','success')
            }
            setPModal(null)
          }}>{pModal==='add'?'Add Invoice':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* -- FINANCIAL REPORT MODAL -- */}
      <Modal open={!!finReport} onClose={() => setFinReport(null)} title={finReport?.name||''}>
        {finReport && (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
              <Pill text={finReport.std} color="#7c3aed" bg="#ede9fe"/>
              <Pill text={finPeriod} color="#1d4ed8" bg="#dbeafe"/>
              <Pill text="Raylane Express Ltd" color="#64748b"/>
            </div>
            <div style={{ background:'#F5F7FA', borderRadius:12, padding:16, marginBottom:16 }}>
              <p style={{ fontSize:14, ...I, color:'#475569', lineHeight:1.75, marginBottom:8 }}>{finReport.desc}</p>
              <p style={{ fontSize:13, ...I, color:'#64748b' }}>Standard: {finReport.std} -- Period: {finPeriod} -- Prepared by: Raylane Finance System</p>
            </div>
            <Banner type="info">This report will be generated using live transaction data from the Raylane platform for the selected period. Connect to Supabase backend to generate actual figures.</Banner>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:16 }}>
              <Btn variant="ghost" full onClick={() => setFinReport(null)}>Close</Btn>
              <Btn variant="blue" full onClick={() => { toast('Generating PDF: '+finReport.name,'success'); setFinReport(null) }}>Export PDF</Btn>
              <Btn variant="gold" full onClick={() => { toast('Exporting: '+finReport.name+' to CSV','success'); setFinReport(null) }}>Export CSV</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* -- VEHICLE MODAL -- */}
      <Modal open={!!vModal} onClose={() => setVModal(null)} title={vModal==='add'?'Add Vehicle':'Edit Vehicle'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label style={lS}>Registration Plate *</label><input value={vForm.reg||''} onChange={e=>setVForm(f=>({...f,reg:e.target.value}))} placeholder="e.g. UBF 005K" style={iS}/></div>
          <div><label style={lS}>Assigned Driver</label><input value={vForm.driver||''} onChange={e=>setVForm(f=>({...f,driver:e.target.value}))} placeholder="Driver full name" style={iS}/></div>
          <div><label style={lS}>Vehicle Type</label>
            <select value={vForm.type||'67-Seater Coach'} onChange={e=>setVForm(f=>({...f,type:e.target.value}))} style={iS}>
              <option>67-Seater Coach</option><option>14-Seater Taxi</option>
            </select>
          </div>
          <div><label style={lS}>Fleet Owner *</label>
            <select value={vForm.fleet||'Raylane Express Fleet'} onChange={e=>setVForm(f=>({...f,fleet:e.target.value}))} style={iS}>
              <option>Raylane Express Fleet</option>
              {operators.filter(o=>o.operator_type!=='INTERNAL').map(o=><option key={o.id}>{o.company_name}</option>)}
            </select>
          </div>
          <div><label style={lS}>Insurance Expiry</label><input type="date" value={vForm.ins||''} onChange={e=>setVForm(f=>({...f,ins:e.target.value}))} style={iS}/></div>
          <div><label style={lS}>Fitness Expiry</label><input type="date" value={vForm.fit||''} onChange={e=>setVForm(f=>({...f,fit:e.target.value}))} style={iS}/></div>
          <div><label style={lS}>Status</label>
            <select value={vForm.status||'Active'} onChange={e=>setVForm(f=>({...f,status:e.target.value}))} style={iS}>
              {['Active','Maintenance','Inactive'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setVModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (!vForm.reg) { toast('Enter registration plate','warning'); return }
            if (vModal==='add') {
              setVehicles(prev=>[...prev,{...vForm,id:'VH-'+Date.now(),fuel:100,mileage:0}])
              toast('Vehicle added','success')
            } else {
              setVehicles(prev=>prev.map(x=>x.id===vModal.id?{...x,...vForm}:x))
              toast('Vehicle updated','success')
            }
            setVModal(null)
          }}>{vModal==='add'?'Add Vehicle':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* -- USER MODAL (with fleet type + module permissions) -- */}
      <Modal open={!!uModal} onClose={() => setUModal(null)} title={uModal==='add'?'Add User':'Edit User'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
          <div><label style={lS}>Full Name *</label><input value={uForm.name||''} onChange={e=>setUForm(f=>({...f,name:e.target.value}))} placeholder="Full name" style={iS}/></div>
          <div><label style={lS}>Email Address *</label><input type="email" value={uForm.email||''} onChange={e=>setUForm(f=>({...f,email:e.target.value}))} placeholder="user@company.com" style={iS}/></div>
          <div><label style={lS}>Phone</label><input value={uForm.phone||''} onChange={e=>setUForm(f=>({...f,phone:e.target.value}))} placeholder="0771 xxx xxx" style={iS}/></div>
          <div><label style={lS}>Role</label>
            <select value={uForm.role||'DISPATCHER'} onChange={e=>setUForm(f=>({...f,role:e.target.value}))} style={iS}>
              {['ADMIN','OPERATOR_ADMIN','DISPATCHER','ACCOUNTANT','LOADER'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label style={lS}>Fleet Type *</label>
            <select value={uForm.fleet||'internal'} onChange={e=>setUForm(f=>({...f,fleet:e.target.value,op:e.target.value==='internal'?'Raylane Express':f.op}))} style={iS}>
              <option value="internal">Raylane Express (Internal)</option>
              <option value="external">Third-Party Operator</option>
            </select>
          </div>
          <div><label style={lS}>{uForm.fleet==='internal'?'Department':'Operator Company'}</label>
            {uForm.fleet==='internal'
              ? <select value={uForm.op||'Raylane Express'} onChange={e=>setUForm(f=>({...f,op:e.target.value}))} style={iS}>
                  {['Raylane Express','Finance','Operations','Dispatch','IT'].map(d=><option key={d}>{d}</option>)}
                </select>
              : <select value={uForm.op||''} onChange={e=>setUForm(f=>({...f,op:e.target.value}))} style={iS}>
                  <option value="">Select operator...</option>
                  {operators.filter(o=>o.operator_type!=='INTERNAL').map(o=><option key={o.id}>{o.company_name}</option>)}
                </select>
            }
          </div>
          <div><label style={lS}>Status</label>
            <select value={uForm.status||'Active'} onChange={e=>setUForm(f=>({...f,status:e.target.value}))} style={iS}>
              {['Active','Suspended'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Module access customisation */}
        <div style={{ marginBottom:16 }}>
          <label style={{ ...lS, marginBottom:10 }}>Module Access Permissions</label>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
            {ALL_MODULES.map(mod => {
              const hasAccess = (uForm.modules||[]).includes(mod)
              return (
                <button key={mod} onClick={() => setUForm(f => ({ ...f, modules: hasAccess ? (f.modules||[]).filter(m=>m!==mod) : [...(f.modules||[]),mod] }))}
                  style={{ padding:'7px 10px', borderRadius:9, border:`1.5px solid ${hasAccess?'#0B3D91':'#E2E8F0'}`, background:hasAccess?'#eff6ff':'#fff', ...P, fontWeight:600, fontSize:11, color:hasAccess?'#0B3D91':'#94a3b8', cursor:'pointer', textAlign:'left', transition:'all .15s' }}>
                  {hasAccess ? 'v ' : '+ '}{mod}
                </button>
              )
            })}
          </div>
          <div style={{ marginTop:8, display:'flex', gap:8 }}>
            <button onClick={() => setUForm(f=>({...f,modules:[...ALL_MODULES]}))} style={{ padding:'5px 12px', borderRadius:8, background:'#dcfce7', color:'#15803d', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Grant All</button>
            <button onClick={() => setUForm(f=>({...f,modules:[]}))} style={{ padding:'5px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Revoke All</button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <Btn variant="ghost" full onClick={() => setUModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (!uForm.name || !uForm.email) { toast('Name and email required','warning'); return }
            if (uModal==='add') {
              setUsers(prev=>[...prev,{...uForm,id:'U-'+Date.now(),joined:new Date().toISOString().split('T')[0]}])
              toast('User created and credentials sent to '+uForm.email,'success')
            } else {
              setUsers(prev=>prev.map(x=>x.id===uModal.id?{...x,...uForm}:x))
              toast('User updated','success')
            }
            setUModal(null)
          }}>{uModal==='add'?'Create User and Send Login':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* -- SERVICE ACTIVATION MODAL -- */}
      <Modal open={!!svcModal} onClose={() => setSvcModal(null)} title={svcModal?'Activate: '+svcModal.module.name:''}>
        {svcModal && (
          <div>
            <div style={{ background:'#F5F7FA', borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:4 }}>{svcModal.module.name}</div>
              <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(svcModal.module.price)}<span style={{ fontSize:12, color:'#64748b', fontWeight:400 }}>/month</span></div>
            </div>
            <Banner type="warning">Confirm payment received from <strong>{svcModal.op.company_name}</strong> before activating. Logged in audit trail.</Banner>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <Btn variant="ghost" full onClick={() => setSvcModal(null)}>Cancel</Btn>
              <Btn variant="gold"  full onClick={() => { st.activateModule(svcModal.op.id,svcModal.module.id); toast(svcModal.module.name+' activated','success'); setSvcModal(null) }}>Confirm Activation</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
