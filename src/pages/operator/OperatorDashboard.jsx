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
  IconCheck, IconFuel, IconWrench, IconAnalytics, IconHR, IconSend,
  IconShield, IconGlobe, IconStar, IconArrow
} from '../../components/ui/Icons'

/* -- Which operator this portal serves -- */
const ACTIVE_OP = 'op-rlx'

const P   = { fontFamily:"'Poppins',sans-serif" }
const I   = { fontFamily:"'Inter',sans-serif" }
const fmt = n => 'UGX ' + Number(n || 0).toLocaleString()
const fmtM = n => 'UGX ' + (Number(n || 0) / 1000000).toFixed(2) + 'M'

const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']

/* -- Demo data for Raylane internal fleet -- */
const DEMO_VEHICLES = [
  { id:'V001', reg:'UBF 001K', make:'Isuzu',   model:'FRR',    type:'67-Seater Coach', year:2019, driver:'James Okello',  status:'Active',      fuel:72, mileage:124500, ins_exp:'2026-12-31', fit_exp:'2026-09-30', ins_amount:4200000,  monthly_ins:350000, wash_fee:50000, assigned_route:'Kampala-Mbale'    },
  { id:'V002', reg:'UBF 002K', make:'Tata',    model:'LP1615', type:'67-Seater Coach', year:2020, driver:'Sarah Nakato',  status:'Active',      fuel:91, mileage:89200,  ins_exp:'2026-12-31', fit_exp:'2026-08-15', ins_amount:4200000,  monthly_ins:350000, wash_fee:50000, assigned_route:'Kampala-Gulu'     },
  { id:'V003', reg:'UBF 003K', make:'Toyota',  model:'HiAce',  type:'14-Seater Taxi',  year:2018, driver:'Peter Mwesiga',status:'Maintenance', fuel:35, mileage:212000, ins_exp:'2026-06-30', fit_exp:'2026-07-01', ins_amount:1800000,  monthly_ins:150000, wash_fee:30000, assigned_route:'Kampala-Entebbe'  },
]

const DEMO_DRIVERS = [
  { id:'D001', name:'James Okello',  phone:'0771-001-001', nid:'CM91123456789XA', licence:'UG-DL-12345', lic_exp:'2027-03-15', class:'PSV', vehicle:'UBF 001K', trips:142, rating:4.8, salary:850000,  status:'Active'   },
  { id:'D002', name:'Sarah Nakato',  phone:'0700-002-002', nid:'CF89234567890XB', licence:'UG-DL-23456', lic_exp:'2026-08-20', class:'PSV', vehicle:'UBF 002K', trips:98,  rating:4.9, salary:850000,  status:'Active'   },
  { id:'D003', name:'Peter Mwesiga', phone:'0752-003-003', nid:'CM92345678901XC', licence:'UG-DL-34567', lic_exp:'2026-06-10', class:'PSV', vehicle:'UBF 003K', trips:67,  rating:4.6, salary:750000,  status:'Off Duty' },
]

const DEMO_VENDORS = [
  { id:'VND001', name:'Total Energies Kampala',  cat:'FUEL',        contact:'0770-123-456', credit_limit:5000000,  balance:1200000,  status:'Active', terms:'Net 15' },
  { id:'VND002', name:'Shell Lugogo Station',    cat:'FUEL',        contact:'0772-234-567', credit_limit:3000000,  balance:800000,   status:'Active', terms:'Net 15' },
  { id:'VND003', name:'Kampala Auto Garage',     cat:'MAINTENANCE', contact:'0751-345-678', credit_limit:8000000,  balance:2400000,  status:'Active', terms:'Net 30' },
  { id:'VND004', name:'Clean Ride Uganda',       cat:'WASHING',     contact:'0700-456-789', credit_limit:500000,   balance:150000,   status:'Active', terms:'Weekly' },
  { id:'VND005', name:'Stanbic Bank Uganda',     cat:'INSURANCE',   contact:'0312-220-000', credit_limit:0,        balance:0,        status:'Active', terms:'Annual' },
  { id:'VND006', name:'UAP Old Mutual',          cat:'INSURANCE',   contact:'0417-715-000', credit_limit:0,        balance:0,        status:'Active', terms:'Annual' },
]

const DEMO_COSTS = [
  { id:'C001', date:'2026-05-01', cat:'FUEL',        vehicle:'UBF 001K', vendor:'Total Energies Kampala', desc:'Monthly fuel top-up',         amount:2400000, status:'PAID',    invoice:'INV-2026-001' },
  { id:'C002', date:'2026-05-02', cat:'FUEL',        vehicle:'UBF 002K', vendor:'Shell Lugogo Station',   desc:'Monthly fuel top-up',         amount:2200000, status:'PAID',    invoice:'INV-2026-002' },
  { id:'C003', date:'2026-05-05', cat:'MAINTENANCE', vehicle:'UBF 003K', vendor:'Kampala Auto Garage',    desc:'Engine overhaul - 212k km',   amount:3800000, status:'PAID',    invoice:'INV-2026-003' },
  { id:'C004', date:'2026-05-08', cat:'WASHING',     vehicle:'UBF 001K', vendor:'Clean Ride Uganda',      desc:'Weekly wash x4 buses',        amount:200000,  status:'PAID',    invoice:'INV-2026-004' },
  { id:'C005', date:'2026-05-10', cat:'WASHING',     vehicle:'UBF 002K', vendor:'Clean Ride Uganda',      desc:'Weekly wash x4 buses',        amount:200000,  status:'PAID',    invoice:'INV-2026-005' },
  { id:'C006', date:'2026-05-12', cat:'INSURANCE',   vehicle:'UBF 001K', vendor:'UAP Old Mutual',         desc:'PSV insurance premium May',   amount:350000,  status:'PAID',    invoice:'INV-2026-006' },
  { id:'C007', date:'2026-05-12', cat:'INSURANCE',   vehicle:'UBF 002K', vendor:'UAP Old Mutual',         desc:'PSV insurance premium May',   amount:350000,  status:'PAID',    invoice:'INV-2026-007' },
  { id:'C008', date:'2026-05-12', cat:'INSURANCE',   vehicle:'UBF 003K', vendor:'UAP Old Mutual',         desc:'PSV insurance premium May',   amount:150000,  status:'PAID',    invoice:'INV-2026-008' },
  { id:'C009', date:'2026-05-15', cat:'STAFF',       vehicle:'ALL',      vendor:'Payroll',                desc:'Driver salaries May 2026',    amount:2450000, status:'PAID',    invoice:'PAY-2026-005' },
  { id:'C010', date:'2026-05-20', cat:'PERMIT',      vehicle:'UBF 001K', vendor:'UNRA Uganda',            desc:'Road fitness renewal',        amount:150000,  status:'UNPAID',  invoice:'UNRA-2026-01' },
  { id:'C011', date:'2026-05-20', cat:'PERMIT',      vehicle:'UBF 002K', vendor:'UNRA Uganda',            desc:'Road fitness renewal',        amount:150000,  status:'UNPAID',  invoice:'UNRA-2026-02' },
  { id:'C012', date:'2026-05-25', cat:'MAINTENANCE', vehicle:'UBF 001K', vendor:'Kampala Auto Garage',    desc:'Oil change + tyre rotation',  amount:680000,  status:'UNPAID',  invoice:'INV-2026-012' },
]

const DEMO_INVOICES = [
  { id:'RINV-001', date:'2026-05-01', client:'Raylane Bookings', desc:'Route revenue Kampala-Mbale May week 1',  amount:8400000,  paid:8400000,  status:'PAID',    type:'INCOME'   },
  { id:'RINV-002', date:'2026-05-08', client:'Raylane Bookings', desc:'Route revenue Kampala-Gulu May week 1',   amount:6200000,  paid:6200000,  status:'PAID',    type:'INCOME'   },
  { id:'RINV-003', date:'2026-05-15', client:'Raylane Bookings', desc:'Route revenue Kampala-Mbale May week 2',  amount:9100000,  paid:0,        status:'UNPAID',  type:'INCOME'   },
  { id:'RINV-004', date:'2026-05-15', client:'Uganda Tourism Co',desc:'Safari charter 3 days Bwindi',            amount:4500000,  paid:4500000,  status:'PAID',    type:'CHARTER'  },
  { id:'RINV-005', date:'2026-05-20', client:'Makerere Univ',    desc:'Staff transport contract May',            amount:3200000,  paid:0,        status:'UNPAID',  type:'CONTRACT' },
]

const DEMO_SUBSCRIPTIONS = [
  { id:'SUB001', name:'Raylane Operator SaaS',      vendor:'Raylane Express', amount:0,       cycle:'Monthly', due:'Free - Internal', status:'ACTIVE', category:'PLATFORM' },
  { id:'SUB002', name:'Africa Talking SMS API',     vendor:'Africa Talking',  amount:200000,  cycle:'Monthly', due:'2026-06-01',      status:'ACTIVE', category:'TECH'     },
  { id:'SUB003', name:'Google Workspace',           vendor:'Google',          amount:180000,  cycle:'Monthly', due:'2026-06-05',      status:'ACTIVE', category:'TECH'     },
  { id:'SUB004', name:'QuickBooks Online Uganda',   vendor:'Intuit',          amount:250000,  cycle:'Monthly', due:'2026-06-10',      status:'ACTIVE', category:'FINANCE'  },
  { id:'SUB005', name:'MTN Business Internet',      vendor:'MTN Uganda',      amount:180000,  cycle:'Monthly', due:'2026-05-30',      status:'DUE',    category:'UTILITY'  },
  { id:'SUB006', name:'KCCA Business Licence',      vendor:'KCCA',            amount:800000,  cycle:'Annual',  due:'2027-01-15',      status:'ACTIVE', category:'LEGAL'    },
]

const DEMO_PAYMENTS_OP = [
  { id:'PMT001', type:'Utility',   vendor:'UMEME Ltd',          desc:'Electricity - workshop & office May', amount:580000,  due:'2026-05-20', status:'UNPAID' },
  { id:'PMT002', type:'Rent',      vendor:'Kampala Park Ltd',   desc:'Bus park fee Gate 3 & 4 June',        amount:900000,  due:'2026-06-01', status:'UNPAID' },
  { id:'PMT003', type:'Utility',   vendor:'National Water',     desc:'Water bill - workshop Q2',            amount:145000,  due:'2026-05-25', status:'UNPAID' },
  { id:'PMT004', type:'Washing',   vendor:'Clean Ride Uganda',  desc:'Vehicle washing contract June',       amount:600000,  due:'2026-06-01', status:'UNPAID' },
  { id:'PMT005', type:'Internet',  vendor:'MTN Business',       desc:'Fibre internet - HQ May',             amount:180000,  due:'2026-05-15', status:'PAID'   },
  { id:'PMT006', type:'Rent',      vendor:'Kampala Park Ltd',   desc:'Bus park fee Gate 3 & 4 May',         amount:900000,  due:'2026-05-01', status:'PAID'   },
]

const BOOKED_DEMO = [3,7,8,11,14,20,21,31,35]
const PC_COLOR = { PAID:'#15803d', UNPAID:'#92400e', OVERDUE:'#dc2626', DUE:'#d97706', ACTIVE:'#15803d' }
const CAT_COLOR = { FUEL:'#d97706', MAINTENANCE:'#7c3aed', WASHING:'#0891b2', INSURANCE:'#0B3D91', STAFF:'#15803d', PERMIT:'#dc2626', TAX:'#6b7280', OTHER:'#6b7280', INCOME:'#15803d', CHARTER:'#7c3aed', CONTRACT:'#1d4ed8', PLATFORM:'#0B3D91', TECH:'#7c3aed', FINANCE:'#d97706', UTILITY:'#0891b2', LEGAL:'#dc2626' }

const NAV_ITEMS = [
  { id:'dashboard',     label:'Dashboard',     Icon:IconGrid     },
  { id:'addtrip',       label:'Add Trip',      Icon:IconBus      },
  { id:'trips',         label:'My Trips',      Icon:IconChart    },
  { id:'seats',         label:'Seat Manager',  Icon:IconTicket   },
  { id:'bookings',      label:'Bookings',      Icon:IconCheck    },
  { id:'parcels',       label:'Parcels',       Icon:IconParcel   },
  { id:'fleet',         label:'Fleet Mgmt',    Icon:IconCar      },
  { id:'drivers',       label:'Drivers',       Icon:IconUsers    },
  { id:'payments',      label:'Payments',      Icon:IconCash     },
  { id:'costs',         label:'Cost Center',   Icon:IconDoc      },
  { id:'vendors',       label:'Vendors',       Icon:IconWrench   },
  { id:'subscriptions', label:'Subscriptions', Icon:IconGlobe    },
  { id:'insurance',     label:'Insurance',     Icon:IconShield   },
  { id:'invoices',      label:'Invoices',      Icon:IconSend     },
  { id:'financial',     label:'Financial',     Icon:IconAnalytics },
  { id:'hr',            label:'Staff/HR',      Icon:IconHR       },
  { id:'fuel',          label:'Fuel Log',      Icon:IconFuel     },
  { id:'alerts',        label:'Alerts',        Icon:IconAlert,   badge:true },
  { id:'settings',      label:'Settings',      Icon:IconSettings },
]

/* -- Summary calculations -- */
function calcSummary(costs, invoices) {
  const totalIncome  = (invoices || []).filter(i => i.type !== undefined).reduce((s,i) => s + (i.paid || 0), 0)
  const totalCosts   = (costs || []).reduce((s,c) => s + (c.amount || 0), 0)
  const unpaidCosts  = (costs || []).filter(c => c.status === 'UNPAID').reduce((s,c) => s + (c.amount || 0), 0)
  const unpaidInv    = (invoices || []).filter(i => i.status === 'UNPAID').reduce((s,i) => s + (i.amount || 0), 0)
  const byCategory   = (costs || []).reduce((acc, c) => { acc[c.cat] = (acc[c.cat] || 0) + c.amount; return acc }, {})
  return { totalIncome, totalCosts, netProfit: totalIncome - totalCosts, unpaidCosts, unpaidInv, byCategory }
}

export default function OperatorDashboard() {
  const { state, st, op, trips, bookings, costs, vendors, notifications, unreadCount, summary } = useOperatorStore(ACTIVE_OP)
  const toast    = useToast()
  const navigate = useNavigate()

  const [tab,       setTab]       = useState('dashboard')
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [vehicles,  setVehicles]  = useState(DEMO_VEHICLES)
  const [drivers,   setDrivers]   = useState(DEMO_DRIVERS)
  const [demoVendors, setDemoVendors] = useState(DEMO_VENDORS)
  const [demoCosts, setDemoCosts] = useState(DEMO_COSTS)
  const [invoices,  setInvoices]  = useState(DEMO_INVOICES)
  const [subs,      setSubs]      = useState(DEMO_SUBSCRIPTIONS)
  const [opPayments,setOpPayments] = useState(DEMO_PAYMENTS_OP)
  const [seatTrip,  setSeatTrip]  = useState(null)
  const [selSeats,  setSelSeats]  = useState([])

  /* modal states */
  const [vModal,  setVModal]  = useState(null)
  const [dModal,  setDModal]  = useState(null)
  const [cModal,  setCModal]  = useState(null)
  const [vnModal, setVnModal] = useState(null)
  const [pModal,  setPModal]  = useState(null)
  const [invModal,setInvModal] = useState(null)
  const [costFilter, setCostFilter] = useState('ALL')

  /* forms */
  const [tripForm, setTripForm] = useState({ from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:'' })
  const [pForm, setPForm] = useState({ type:'Utility', vendor:'', desc:'', amount:'', due:'', status:'UNPAID' })
  const [vForm,  setVForm]  = useState({ reg:'', make:'', model:'', type:'67-Seater Coach', year:'', driver:'', status:'Active', ins_exp:'', fit_exp:'', monthly_ins:350000, wash_fee:50000 })
  const [dForm,  setDForm]  = useState({ name:'', phone:'', nid:'', licence:'', lic_exp:'', class:'PSV', vehicle:'', salary:'', status:'Active' })
  const [cForm,  setCForm]  = useState({ date:'', cat:'FUEL', vehicle:'', vendor:'', desc:'', amount:'', invoice:'' })
  const [vnForm, setVnForm] = useState({ name:'', cat:'FUEL', contact:'', credit_limit:'', terms:'Net 30' })

  const fin = calcSummary(demoCosts, invoices)

  /* loading guard */
  if (!op) return (
    <div style={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ ...P, fontWeight:700, fontSize:18, marginBottom:8 }}>Loading...</div>
        <button onClick={() => { sessionStorage.clear(); window.location.reload() }}
          style={{ padding:'10px 20px', borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, border:'none', cursor:'pointer', marginTop:8 }}>
          Reset and Reload
        </button>
      </div>
    </div>
  )

  const submitTrip = e => {
    e.preventDefault()
    if (!tripForm.to || !tripForm.date || !tripForm.price) { toast('Fill all required fields', 'warning'); return }
    const seat_type = tripForm.vehicle.includes('14') ? '14' : '67'
    st.createTrip({ operator_id:op.id, operator_name:op.company_name, plate:tripForm.vehicle.split('--')[0].trim(), from:tripForm.from, to:tripForm.to, date:tripForm.date, departs:tripForm.departs, seat_type, price:parseInt(tripForm.price), seats_total:parseInt(seat_type), seats_booked:0, boarding_pin:op.boarding_pin, notes:tripForm.notes })
    toast('Trip submitted - auto-approved for Raylane fleet', 'success')
    setTab('trips')
    setTripForm({ from:'Kampala', to:'', vehicle:'', date:'', departs:'', price:'', notes:'' })
  }

  const addCost = () => {
    if (!cForm.amount || !cForm.desc) { toast('Fill required fields', 'warning'); return }
    setDemoCosts(prev => [{ id:'C' + Date.now(), ...cForm, amount:parseInt(cForm.amount), status:'UNPAID' }, ...prev])
    toast('Cost entry added', 'success')
    setCForm({ date:'', cat:'FUEL', vehicle:'', vendor:'', desc:'', amount:'', invoice:'' })
    setCModal(null)
  }

  const filteredCosts = costFilter === 'ALL' ? demoCosts : demoCosts.filter(c => c.cat === costFilter)
  const allVehicleRegs = vehicles.map(v => v.reg)

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>

      {/* SIDEBAR */}
      <div className={`dash-sidebar${menuOpen ? ' open' : ''}`}
        style={{ width:200, background:'#0B3D91', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto', zIndex:100 }}>
        <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,.12)', minHeight:50 }}>
          <div style={{ ...P, fontWeight:700, fontSize:11, color:'#FFC72C', marginBottom:1, lineHeight:1.3 }}>Raylane Express</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,.55)', ...I }}>Internal Fleet Portal</div>
        </div>
        <nav style={{ flex:1, padding:'4px 0', overflowY:'auto' }}>
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
            const bc = badge ? unreadCount : 0
            const isAct = tab === id
            return (
              <button key={id} onClick={() => { setTab(id); setMenuOpen(false) }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:isAct ? 'rgba(255,199,44,.14)' : 'none', color:isAct ? '#FFC72C' : 'rgba(255,255,255,.75)', borderLeft:`3px solid ${isAct ? '#FFC72C' : 'transparent'}`, ...P, fontWeight:600, fontSize:11, border:'none', cursor:'pointer', width:'100%', textAlign:'left', transition:'all .15s' }}>
                <Icon size={13} color={isAct ? '#FFC72C' : 'rgba(255,255,255,.45)'}/>
                <span style={{ flex:1 }}>{label}</span>
                {bc > 0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700 }}>{bc}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding:'8px 12px', borderTop:'1px solid rgba(255,255,255,.1)', display:'flex', flexDirection:'column', gap:5 }}>
          <button onClick={() => navigate('/admin')} style={{ width:'100%', padding:'6px', borderRadius:7, background:'rgba(255,199,44,.15)', color:'#FFC72C', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:9 }}>Raylane Admin</button>
          <button onClick={() => navigate('/')} style={{ width:'100%', padding:'6px', borderRadius:7, background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.5)', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:9 }}>Back to Site</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:22 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{ width:34, height:34, borderRadius:9, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IconGrid size={15} color="#0B3D91"/>
            </button>
            <div>
              <h1 style={{ ...P, fontWeight:700, fontSize:'clamp(13px,2vw,18px)', margin:0 }}>
                {(NAV_ITEMS.find(n => n.id === tab) || {}).label || 'Dashboard'}
              </h1>
              <div style={{ fontSize:10, color:'#94a3b8', ...I }}>Raylane Express Internal Fleet</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount > 0 && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:11 }}>{unreadCount} new</span>}
            <span style={{ background:'#dcfce7', color:'#15803d', padding:'4px 12px', borderRadius:20, ...P, fontWeight:700, fontSize:11 }}>INTERNAL</span>
          </div>
        </div>

        {/* == DASHBOARD == */}
        {tab === 'dashboard' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Income This Month" value={fmtM(fin.totalIncome)}  sub="All routes + charters" bg="#dcfce7" color="#15803d"/>
              <StatCard label="Total Costs"       value={fmtM(fin.totalCosts)}   sub="Operating expenses"   bg="#fee2e2" color="#dc2626"/>
              <StatCard label="Net Profit"        value={fmtM(fin.netProfit)}    sub="After all costs"      bg={fin.netProfit >= 0 ? '#dcfce7' : '#fee2e2'} color={fin.netProfit >= 0 ? '#15803d' : '#dc2626'}/>
              <StatCard label="Unpaid Invoices"   value={fmt(fin.unpaidInv)}     sub="Outstanding receivable" bg="#fef9c3" color="#92400e"/>
            </div>

            {/* Fleet health row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
              {vehicles.slice(0,4).map(v => (
                <Card key={v.id} style={{ padding:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13 }}>{v.reg}</div>
                    <Pill text={v.status} color={v.status === 'Active' ? '#15803d' : '#d97706'}/>
                  </div>
                  <div style={{ fontSize:11, color:'#64748b', ...I, marginBottom:8 }}>{v.type}</div>
                  <ProgressBar value={v.fuel} max={100} label={'Fuel ' + v.fuel + '%'} height={4} color={v.fuel < 30 ? '#dc2626' : '#22c55e'}/>
                  {new Date(v.fit_exp) < new Date(Date.now() + 30*24*60*60*1000) && (
                    <div style={{ marginTop:6, fontSize:10, color:'#dc2626', ...P, fontWeight:700 }}>Fitness exp: {v.fit_exp}</div>
                  )}
                </Card>
              ))}
            </div>

            {/* Cost breakdown + Recent */}
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <Card>
                <SectionHead title="Cost by Category"/>
                {Object.entries(fin.byCategory).sort((a,b) => b[1]-a[1]).slice(0,6).map(([cat, amt]) => (
                  <div key={cat} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <Pill text={cat} color={CAT_COLOR[cat] || '#64748b'}/>
                    <div style={{ flex:1, height:6, background:'#E2E8F0', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:(amt/fin.totalCosts*100)+'%', background:CAT_COLOR[cat] || '#64748b', borderRadius:3 }}/>
                    </div>
                    <span style={{ ...P, fontWeight:700, fontSize:12, color:'#0B3D91', flexShrink:0 }}>{fmt(amt)}</span>
                  </div>
                ))}
              </Card>
              <Card>
                <SectionHead title="Recent Costs" action="View All" onAction={() => setTab('costs')}/>
                {demoCosts.slice(0,5).map((c, i) => (
                  <div key={c.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : '' }}>
                    <Pill text={c.cat} color={CAT_COLOR[c.cat] || '#64748b'}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, ...P, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.desc}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{c.vehicle} -- {c.date}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{fmt(c.amount)}</div>
                      <Pill text={c.status} color={PC_COLOR[c.status] || '#64748b'}/>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            <Card>
              <SectionHead title="Revenue vs Costs (Monthly)"/>
              <BarChart data={[30,55,40,80,65,90,75]} labels={['Nov','Dec','Jan','Feb','Mar','Apr','May']} height={80}/>
            </Card>
          </div>
        )}

        {/* == ADD TRIP == */}
        {tab === 'addtrip' && (
          <Card>
            <Banner type="info">Internal fleet trips are auto-approved and go live immediately on the platform.</Banner>
            <form onSubmit={submitTrip} style={{ marginTop:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div><label style={lS}>From</label>
                  <select value={tripForm.from} onChange={e => setTripForm({...tripForm,from:e.target.value})} style={iS}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>To *</label>
                  <select value={tripForm.to} onChange={e => setTripForm({...tripForm,to:e.target.value})} style={iS}>
                    <option value="">Select...</option>
                    {CITIES.filter(c => c !== tripForm.from).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Vehicle</label>
                  <select value={tripForm.vehicle} onChange={e => setTripForm({...tripForm,vehicle:e.target.value})} style={iS}>
                    <option value="">Select vehicle...</option>
                    {vehicles.filter(v => v.status === 'Active').map(v => (
                      <option key={v.id} value={v.reg + ' -- ' + v.type}>{v.reg} -- {v.type} ({v.driver})</option>
                    ))}
                  </select>
                </div>
                <div><label style={lS}>Date *</label>
                  <input type="date" value={tripForm.date} onChange={e => setTripForm({...tripForm,date:e.target.value})} style={iS} min={new Date().toISOString().split('T')[0]}/>
                </div>
                <div><label style={lS}>Departure Time</label>
                  <input type="time" value={tripForm.departs} onChange={e => setTripForm({...tripForm,departs:e.target.value})} style={iS}/>
                </div>
                <div><label style={lS}>Price per Seat (UGX) *</label>
                  <input type="number" value={tripForm.price} onChange={e => setTripForm({...tripForm,price:e.target.value})} placeholder="e.g. 28000" style={iS}/>
                </div>
                <div style={{ gridColumn:'1/-1' }}><label style={lS}>Notes</label>
                  <textarea rows={2} value={tripForm.notes} onChange={e => setTripForm({...tripForm,notes:e.target.value})} placeholder="Amenities, special instructions..." style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
                <Btn variant="ghost" full onClick={() => setTab('trips')}>Cancel</Btn>
                <Btn variant="gold" full>Create Trip</Btn>
              </div>
            </form>
          </Card>
        )}

        {/* == MY TRIPS == */}
        {tab === 'trips' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => setTab('addtrip')}>+ Add Trip</Btn>
            </div>
            {trips.length === 0
              ? <EmptyState title="No trips yet" action="Add Trip" onAction={() => setTab('addtrip')}/>
              : trips.map(t => (
                <Card key={t.id} style={{ marginBottom:12, borderLeft:`4px solid ${t.status === 'APPROVED' ? '#22c55e' : '#FFC72C'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:8 }}>
                    <div>
                      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                        <span style={{ ...P, fontWeight:700, fontSize:15 }}>{t.from} to {t.to}</span>
                        <Pill text={t.status.replace(/_/g,' ')} color={t.status === 'APPROVED' ? '#15803d' : '#92400e'}/>
                      </div>
                      <div style={{ fontSize:13, color:'#64748b', ...I }}>{t.departs} -- {t.date} -- {t.seat_type}-seater -- {fmt(t.price)}/seat</div>
                    </div>
                    {t.status === 'APPROVED' && (
                      <Btn size="sm" variant="blue" onClick={() => { setSeatTrip(t); setTab('seats') }}>Manage Seats</Btn>
                    )}
                  </div>
                  {t.status === 'APPROVED' && <ProgressBar value={t.seats_booked} max={t.seats_total} label={t.seats_booked + '/' + t.seats_total + ' seats'} showPct/>}
                </Card>
              ))
            }
          </div>
        )}

        {/* == SEATS == */}
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
                {trips.filter(t => t.status === 'APPROVED').length === 0 && <EmptyState title="No approved trips"/>}
              </div>
            ) : (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                  <button onClick={() => { setSeatTrip(null); setSelSeats([]) }} style={{ background:'none', border:'none', cursor:'pointer', color:'#0B3D91', ...P, fontWeight:700, fontSize:13 }}>Back</button>
                  <h3 style={{ ...P, fontWeight:700, fontSize:16, margin:0 }}>{seatTrip.from} to {seatTrip.to} -- {seatTrip.departs}</h3>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20 }}>
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
                      <Btn variant="blue" full size="sm" onClick={() => { toast('Seats reserved','success'); setSelSeats([]) }}>Reserve</Btn>
                      <div style={{ marginTop:8 }}><Btn variant="danger" full size="sm" onClick={() => setSelSeats([])}>Clear</Btn></div>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* == BOOKINGS == */}
        {tab === 'bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={bookings.length}/>
            {bookings.length === 0 ? <EmptyState title="No bookings yet"/> : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['ID','Route','Seat','Method','Amount','Status'].map(h => (
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{bookings.map(b => {
                    const trip = (state.trips||[]).find(t => t.id === b.trip_id)
                    return (
                      <tr key={b.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                        onMouseLeave={e=>e.currentTarget.style.background=''}>
                        <td style={{ padding:'10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{b.id}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{trip ? trip.from + ' to ' + trip.to : '--'}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>Seat {b.seat}</td>
                        <td style={{ padding:'10px', fontSize:12, ...I }}>{b.method}</td>
                        <td style={{ padding:'10px', ...P, fontWeight:700 }}>{fmt(b.amount)}</td>
                        <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status==='CONFIRMED'?'#15803d':'#92400e'}/></td>
                      </tr>
                    )
                  })}</tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* == PARCELS == */}
        {tab === 'parcels' && (
          <div>
            <Card style={{ marginBottom:16 }}>
              <SectionHead title="Send New Parcel"/>
              <form onSubmit={e => { e.preventDefault(); toast('Parcel booking created','success') }} style={{ marginTop:12 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                  <div><label style={lS}>Parcel Type</label>
                    <select style={iS}>{['Envelope (UGX 5,000)','Small Parcel (UGX 12,000)','Large Parcel (UGX 20,000)','Heavy Cargo (UGX 30,000+)'].map(t=><option key={t}>{t}</option>)}</select>
                  </div>
                  <div><label style={lS}>From</label><select style={iS}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><label style={lS}>To *</label><select style={iS}><option value="">Select...</option>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><label style={lS}>Sender Phone *</label><input placeholder="0771 xxx xxx" style={iS}/></div>
                  <div><label style={lS}>Recipient Phone</label><input placeholder="0700 xxx xxx" style={iS}/></div>
                  <div><label style={lS}>Recipient Name</label><input placeholder="Full name" style={iS}/></div>
                </div>
                <Btn variant="blue" full>Create Parcel Booking</Btn>
              </form>
            </Card>
            <Card><SectionHead title="Recent Parcels"/><EmptyState title="No parcels yet" desc="Create a parcel booking above"/></Card>
          </div>
        )}

        {/* == FLEET MANAGEMENT == */}
        {tab === 'fleet' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => { setVForm({ reg:'', make:'', model:'', type:'67-Seater Coach', year:'', driver:'', status:'Active', ins_exp:'', fit_exp:'', monthly_ins:350000, wash_fee:50000 }); setVModal('add') }}>+ Add Vehicle</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
              {vehicles.map(v => {
                const insExp  = new Date(v.ins_exp)
                const fitExp  = new Date(v.fit_exp)
                const now     = new Date()
                const soon60  = new Date(now.getTime() + 60*24*60*60*1000)
                const insWarn = insExp < soon60
                const fitWarn = fitExp < soon60
                return (
                  <Card key={v.id} style={{ borderLeft:`4px solid ${v.status==='Active'?'#22c55e':'#d97706'}` }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:'rgba(11,61,145,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <IconBus size={22} color="#0B3D91"/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:2 }}>
                          <span style={{ ...P, fontWeight:800, fontSize:15 }}>{v.reg}</span>
                          <Pill text={v.status} color={v.status==='Active'?'#15803d':'#d97706'}/>
                        </div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>{v.make} {v.model} {v.year} -- {v.type}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>Driver: <strong style={{ color:'#0F1923' }}>{v.driver}</strong></div>
                      </div>
                    </div>
                    <ProgressBar value={v.fuel} max={100} label={'Fuel: ' + v.fuel + '%'} showPct height={5} color={v.fuel < 30 ? '#dc2626' : '#22c55e'}/>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginTop:10, fontSize:11, ...I, color:'#64748b' }}>
                      <span>Mileage: {v.mileage.toLocaleString()} km</span>
                      <span>Route: {v.assigned_route}</span>
                      <span style={{ color:insWarn?'#dc2626':'inherit', fontWeight:insWarn?700:400 }}>Insurance: {v.ins_exp}</span>
                      <span style={{ color:fitWarn?'#dc2626':'inherit', fontWeight:fitWarn?700:400 }}>Fitness: {v.fit_exp}</span>
                      <span>Wash fee: {fmt(v.wash_fee)}/mo</span>
                      <span>Ins: {fmt(v.monthly_ins)}/mo</span>
                    </div>
                    {(insWarn || fitWarn) && (
                      <div style={{ marginTop:8, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:11, color:'#dc2626', ...P, fontWeight:600 }}>
                        {insWarn ? 'Insurance expiring soon. ' : ''}{fitWarn ? 'Fitness cert expiring soon.' : ''}
                      </div>
                    )}
                    <div style={{ display:'flex', gap:7, marginTop:12, flexWrap:'wrap' }}>
                      <button onClick={() => { setVForm({...v}); setVModal(v) }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                      <button onClick={() => { setVehicles(p => p.map(x => x.id===v.id ? {...x,status:x.status==='Active'?'Maintenance':'Active'} : x)); toast('Status updated','success') }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                        {v.status==='Active'?'Set Maintenance':'Set Active'}
                      </button>
                      <button onClick={() => toast('Sending SMS to driver...','success')}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#f0fdf4', color:'#15803d', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Alert Driver</button>
                      <button onClick={() => { if(window.confirm('Remove '+v.reg+'?')){ setVehicles(p=>p.filter(x=>x.id!==v.id)); toast('Vehicle removed','error') } }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Remove</button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* == DRIVERS == */}
        {tab === 'drivers' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => { setDForm({ name:'', phone:'', nid:'', licence:'', lic_exp:'', class:'PSV', vehicle:'', salary:'', status:'Active' }); setDModal('add') }}>+ Add Driver</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
              {drivers.map(d => {
                const licWarn = new Date(d.lic_exp) < new Date(Date.now() + 60*24*60*60*1000)
                return (
                  <Card key={d.id} style={{ borderLeft:`4px solid ${d.status==='Active'?'#22c55e':'#d97706'}` }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:800, fontSize:18, color:'#0B3D91', flexShrink:0 }}>
                        {d.name[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:15 }}>{d.name}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>{d.phone} -- NID: {d.nid}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>Vehicle: {d.vehicle || 'Unassigned'}</div>
                      </div>
                      <Pill text={d.status} color={d.status==='Active'?'#15803d':'#d97706'}/>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:12, ...I, color:'#64748b', marginBottom:8 }}>
                      <span>Licence: {d.licence}</span>
                      <span>Class: {d.class}</span>
                      <span style={{ color:licWarn?'#dc2626':'inherit', fontWeight:licWarn?700:400 }}>Exp: {d.lic_exp}</span>
                      <span>Trips: {d.trips}</span>
                      <span>Rating: {d.rating}/5</span>
                      <span>Salary: {fmt(d.salary)}/mo</span>
                    </div>
                    {licWarn && (
                      <div style={{ background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:11, color:'#dc2626', ...P, fontWeight:600, marginBottom:8 }}>
                        Licence expiring - renew before {d.lic_exp}
                      </div>
                    )}
                    <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                      <button onClick={() => { setDForm({...d}); setDModal(d) }} style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                      <button onClick={() => { setDrivers(p => p.map(x => x.id===d.id ? {...x,status:x.status==='Active'?'Off Duty':'Active'} : x)); toast('Status updated','success') }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#fef9c3', color:'#92400e', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                        {d.status==='Active'?'Off Duty':'Activate'}
                      </button>
                      <button onClick={() => { if(window.confirm('Remove '+d.name+'?')){ setDrivers(p=>p.filter(x=>x.id!==d.id)); toast('Driver removed','error') } }}
                        style={{ padding:'6px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Remove</button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* == PAYMENTS (utilities/rent/washing/subscriptions) == */}
        {tab === 'payments' && (
          <div>
            <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Unpaid Bills"  value={opPayments.filter(p=>p.status==='UNPAID').length}  sub="Due this month" bg="#fef9c3" color="#92400e"/>
              <StatCard label="Overdue"       value={opPayments.filter(p=>p.status==='OVERDUE').length} sub="Past due"       bg="#fee2e2" color="#dc2626"/>
              <StatCard label="Total Unpaid"  value={fmt(opPayments.filter(p=>p.status!=='PAID').reduce((s,p)=>s+p.amount,0))} sub="Outstanding" bg="#dbeafe" color="#1d4ed8"/>
            </div>
            <Card>
              <SectionHead title="Payment Obligations" action="Add Invoice" onAction={() => { setPForm({ type:'Utility', vendor:'', desc:'', amount:'', due:'', status:'UNPAID' }); setPModal('add') }}/>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:580 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['Type','Vendor','Description','Amount','Due','Status','Actions'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{opPayments.map(p=>(
                    <tr key={p.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'10px' }}><Pill text={p.type} color={CAT_COLOR[(p.type||'').toUpperCase()]||'#1d4ed8'} bg="#dbeafe"/></td>
                      <td style={{ padding:'10px', ...P, fontWeight:600, fontSize:13 }}>{p.vendor}</td>
                      <td style={{ padding:'10px', fontSize:12, color:'#64748b', ...I }}>{p.desc}</td>
                      <td style={{ padding:'10px', ...P, fontWeight:700, color:'#0B3D91' }}>{fmt(p.amount)}</td>
                      <td style={{ padding:'10px', fontSize:12, ...I }}>{p.due}</td>
                      <td style={{ padding:'10px' }}><Pill text={p.status} color={PC_COLOR[p.status]||'#64748b'}/></td>
                      <td style={{ padding:'10px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          {p.status!=='PAID' && <button onClick={() => { setOpPayments(prev=>prev.map(x=>x.id===p.id?{...x,status:'PAID'}:x)); toast(p.vendor+' paid','success') }} style={{ padding:'4px 10px', borderRadius:8, background:'#0B3D91', color:'#fff', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Pay</button>}
                          <button onClick={() => { setPForm({ type:p.type||'Utility', vendor:p.vendor||'', desc:p.desc||'', amount:String(p.amount||''), due:p.due||'', status:p.status||'UNPAID' }); setPModal(p) }} style={{ padding:'4px 10px', borderRadius:8, background:'#F5F7FA', color:'#0B3D91', border:'1px solid #E2E8F0', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                          <button onClick={() => { setOpPayments(prev=>prev.filter(x=>x.id!==p.id)); toast('Removed','warning') }} style={{ padding:'4px 10px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* == COST CENTER == */}
        {tab === 'costs' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:16 }}>
              {['FUEL','MAINTENANCE','WASHING','INSURANCE','STAFF'].map(cat => {
                const total = demoCosts.filter(c=>c.cat===cat).reduce((s,c)=>s+c.amount,0)
                return (
                  <div key={cat} onClick={() => setCostFilter(costFilter===cat?'ALL':cat)}
                    style={{ background:costFilter===cat?'#0B3D91':'#fff', borderRadius:14, padding:'12px 14px', border:`1.5px solid ${costFilter===cat?'#0B3D91':'#E2E8F0'}`, cursor:'pointer', transition:'all .2s' }}>
                    <div style={{ fontSize:10, ...P, fontWeight:700, color:costFilter===cat?'#FFC72C':CAT_COLOR[cat]||'#64748b', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{cat}</div>
                    <div style={{ ...P, fontWeight:800, fontSize:16, color:costFilter===cat?'#fff':'#0B3D91' }}>{fmt(total)}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:10 }}>
              <div style={{ fontSize:13, ...I, color:'#64748b' }}>
                {costFilter==='ALL'?'All costs':'Filter: '+costFilter} -- {filteredCosts.length} entries
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {costFilter!=='ALL' && <button onClick={()=>setCostFilter('ALL')} style={{ padding:'7px 14px', borderRadius:10, border:'1.5px solid #E2E8F0', background:'#fff', ...P, fontWeight:600, fontSize:12, cursor:'pointer' }}>Clear Filter</button>}
                <Btn variant="blue" onClick={() => setCModal('add')}>+ Add Cost</Btn>
              </div>
            </div>
            <Card>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['Date','Category','Vehicle','Vendor','Description','Amount','Invoice','Status'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{filteredCosts.map((c,i)=>(
                    <tr key={c.id} style={{ borderBottom:'1px solid #E2E8F0', background:c.status==='UNPAID'?'#fffbf0':'' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=c.status==='UNPAID'?'#fffbf0':''}>
                      <td style={{ padding:'9px 10px', fontSize:12, ...I }}>{c.date}</td>
                      <td style={{ padding:'9px 10px' }}><Pill text={c.cat} color={CAT_COLOR[c.cat]||'#64748b'}/></td>
                      <td style={{ padding:'9px 10px', fontSize:12, ...P, fontWeight:600 }}>{c.vehicle}</td>
                      <td style={{ padding:'9px 10px', fontSize:12, ...I, color:'#64748b' }}>{c.vendor}</td>
                      <td style={{ padding:'9px 10px', fontSize:12, ...I }}>{c.desc}</td>
                      <td style={{ padding:'9px 10px', ...P, fontWeight:700, color:'#0B3D91' }}>{fmt(c.amount)}</td>
                      <td style={{ padding:'9px 10px', fontSize:11, ...I, color:'#64748b' }}>{c.invoice}</td>
                      <td style={{ padding:'9px 10px' }}><Pill text={c.status} color={PC_COLOR[c.status]||'#64748b'}/></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div style={{ paddingTop:14, borderTop:'2px solid #E2E8F0', marginTop:4, display:'flex', justifyContent:'flex-end', gap:24 }}>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>Total shown</div>
                  <div style={{ ...P, fontWeight:800, fontSize:18, color:'#0B3D91' }}>{fmt(filteredCosts.reduce((s,c)=>s+c.amount,0))}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>Unpaid</div>
                  <div style={{ ...P, fontWeight:800, fontSize:18, color:'#dc2626' }}>{fmt(filteredCosts.filter(c=>c.status==='UNPAID').reduce((s,c)=>s+c.amount,0))}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* == VENDORS == */}
        {tab === 'vendors' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
              <Btn variant="blue" onClick={() => { setVnForm({ name:'', cat:'FUEL', contact:'', credit_limit:'', terms:'Net 30' }); setVnModal('add') }}>+ Add Vendor</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
              {demoVendors.map(v => (
                <Card key={v.id} style={{ borderLeft:`4px solid ${CAT_COLOR[v.cat]||'#E2E8F0'}` }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:(CAT_COLOR[v.cat]||'#0B3D91')+'18', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:800, fontSize:14, color:CAT_COLOR[v.cat]||'#0B3D91', flexShrink:0 }}>
                      {v.name[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:2 }}>{v.name}</div>
                      <div style={{ fontSize:12, color:'#64748b', ...I }}>{v.contact}</div>
                    </div>
                    <Pill text={v.cat} color={CAT_COLOR[v.cat]||'#64748b'}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:12, ...I, color:'#64748b', marginBottom:12 }}>
                    <span>Credit limit: {fmt(v.credit_limit)}</span>
                    <span>Terms: {v.terms}</span>
                    <span style={{ color:v.balance>v.credit_limit*0.8?'#dc2626':'inherit' }}>Balance due: {fmt(v.balance)}</span>
                    <span>Status: {v.status}</span>
                  </div>
                  {v.balance > 0 && (
                    <div style={{ marginBottom:10 }}>
                      <ProgressBar value={v.balance} max={v.credit_limit||1} label={'Credit used: ' + Math.round(v.balance/(v.credit_limit||1)*100) + '%'} showPct height={5} color={v.balance>v.credit_limit*0.8?'#dc2626':'#0B3D91'}/>
                    </div>
                  )}
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    <button onClick={() => { setVnForm({...v}); setVnModal(v) }} style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Edit</button>
                    <button onClick={() => toast('Statement generated','success')} style={{ padding:'6px 12px', borderRadius:8, background:'#f0fdf4', color:'#15803d', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Statement</button>
                    <button onClick={() => { setDemoVendors(p=>p.filter(x=>x.id!==v.id)); toast('Vendor removed','error') }} style={{ padding:'6px 12px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>Remove</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* == SUBSCRIPTIONS == */}
        {tab === 'subscriptions' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Active Subscriptions" value={subs.filter(s=>s.status==='ACTIVE').length} bg="#dcfce7" color="#15803d"/>
              <StatCard label="Monthly Cost"         value={fmt(subs.filter(s=>s.cycle==='Monthly').reduce((s,x)=>s+x.amount,0))} bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Annual Cost"          value={fmt(subs.filter(s=>s.cycle==='Annual').reduce((s,x)=>s+x.amount,0))}  bg="#fef9c3" color="#92400e"/>
            </div>
            <Card>
              <SectionHead title="All Subscriptions" action="Add Subscription" onAction={() => toast('Add subscription form coming soon','success')}/>
              {subs.map(s => (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #E2E8F0', flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:2 }}>{s.name}</div>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>{s.vendor} -- {s.cycle} -- Due: {s.due}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ ...P, fontWeight:700, fontSize:14, color:'#0B3D91' }}>{s.amount ? fmt(s.amount) : 'Free'}</div>
                      <div style={{ fontSize:11, color:'#64748b', ...I }}>{s.cycle}</div>
                    </div>
                    <Pill text={s.status} color={PC_COLOR[s.status]||'#64748b'}/>
                    <Pill text={s.category} color={CAT_COLOR[s.category]||'#64748b'}/>
                    <button onClick={() => { setSubs(prev=>prev.map(x=>x.id===s.id?{...x,status:x.status==='ACTIVE'?'PAUSED':'ACTIVE'}:x)); toast('Subscription updated','success') }}
                      style={{ padding:'5px 12px', borderRadius:8, background:s.status==='ACTIVE'?'#fee2e2':'#dcfce7', color:s.status==='ACTIVE'?'#dc2626':'#15803d', border:'none', cursor:'pointer', ...P, fontWeight:600, fontSize:11 }}>
                      {s.status==='ACTIVE'?'Pause':'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* == INSURANCE == */}
        {tab === 'insurance' && (
          <div>
            <Banner type="info">All PSV vehicles must have valid third-party insurance. Raylane auto-alerts 60 days before expiry.</Banner>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14, marginTop:16 }}>
              {vehicles.map(v => {
                const exp = new Date(v.ins_exp)
                const daysLeft = Math.round((exp - new Date()) / (1000*60*60*24))
                const urgent = daysLeft < 60
                return (
                  <Card key={v.id} style={{ borderLeft:`4px solid ${urgent?'#dc2626':'#22c55e'}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div>
                        <div style={{ ...P, fontWeight:700, fontSize:15 }}>{v.reg}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>{v.type}</div>
                      </div>
                      <Pill text={urgent?'Expiring':'Valid'} color={urgent?'#dc2626':'#15803d'}/>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:12, ...I, color:'#64748b', marginBottom:12 }}>
                      <div><div style={{ ...P, fontWeight:600, fontSize:11, color:'#0F1923', marginBottom:2 }}>Insurer</div>UAP Old Mutual</div>
                      <div><div style={{ ...P, fontWeight:600, fontSize:11, color:'#0F1923', marginBottom:2 }}>Annual Premium</div>{fmt(v.ins_amount)}</div>
                      <div><div style={{ ...P, fontWeight:600, fontSize:11, color:'#0F1923', marginBottom:2 }}>Monthly Cost</div>{fmt(v.monthly_ins)}</div>
                      <div><div style={{ ...P, fontWeight:600, fontSize:11, color:urgent?'#dc2626':'#0F1923', marginBottom:2 }}>Expires</div><span style={{ fontWeight:urgent?700:400, color:urgent?'#dc2626':'inherit' }}>{v.ins_exp} ({daysLeft}d)</span></div>
                    </div>
                    <div style={{ display:'flex', gap:7 }}>
                      <button onClick={() => toast('Insurance renewal initiated with UAP Old Mutual','success')} style={{ padding:'6px 14px', borderRadius:8, background:urgent?'#0B3D91':'#F5F7FA', color:urgent?'#fff':'#0B3D91', border:'none', cursor:'pointer', ...P, fontWeight:700, fontSize:12 }}>
                        {urgent?'Renew Now':'View Policy'}
                      </button>
                      <button onClick={() => toast('Claim form opened','success')} style={{ padding:'6px 14px', borderRadius:8, background:'#fff', color:'#64748b', border:'1.5px solid #E2E8F0', cursor:'pointer', ...P, fontWeight:600, fontSize:12 }}>File Claim</button>
                    </div>
                  </Card>
                )
              })}
            </div>
            <Card style={{ marginTop:16 }}>
              <SectionHead title="Insurance Summary"/>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                <div>
                  <div style={{ fontSize:11, color:'#64748b', ...I, marginBottom:4 }}>Total Annual Premium</div>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(vehicles.reduce((s,v)=>s+v.ins_amount,0))}</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#64748b', ...I, marginBottom:4 }}>Monthly Allocation</div>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(vehicles.reduce((s,v)=>s+v.monthly_ins,0))}</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#64748b', ...I, marginBottom:4 }}>Vehicles Insured</div>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#15803d' }}>{vehicles.length} / {vehicles.length}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* == INVOICES (receivables) == */}
        {tab === 'invoices' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Total Billed"    value={fmt(invoices.reduce((s,i)=>s+i.amount,0))} bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Collected"       value={fmt(invoices.reduce((s,i)=>s+i.paid,0))}   bg="#dcfce7" color="#15803d"/>
              <StatCard label="Outstanding"     value={fmt(invoices.filter(i=>i.status==='UNPAID').reduce((s,i)=>s+i.amount,0))} bg="#fef9c3" color="#92400e"/>
            </div>
            <Card>
              <SectionHead title="All Invoices" action="New Invoice" onAction={() => setInvModal('add')}/>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:580 }}>
                  <thead><tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                    {['Invoice','Date','Client','Description','Billed','Paid','Type','Status'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', ...P, fontWeight:600, fontSize:11, color:'#64748b', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{invoices.map(inv=>(
                    <tr key={inv.id} style={{ borderBottom:'1px solid #E2E8F0' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F5F7FA'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'9px 10px', ...P, fontWeight:700, fontSize:12, color:'#0B3D91' }}>{inv.id}</td>
                      <td style={{ padding:'9px 10px', fontSize:12, ...I }}>{inv.date}</td>
                      <td style={{ padding:'9px 10px', fontSize:13, ...P, fontWeight:600 }}>{inv.client}</td>
                      <td style={{ padding:'9px 10px', fontSize:12, ...I, color:'#64748b' }}>{inv.desc}</td>
                      <td style={{ padding:'9px 10px', ...P, fontWeight:700, color:'#0B3D91' }}>{fmt(inv.amount)}</td>
                      <td style={{ padding:'9px 10px', ...P, fontWeight:700, color:'#15803d' }}>{fmt(inv.paid)}</td>
                      <td style={{ padding:'9px 10px' }}><Pill text={inv.type} color={CAT_COLOR[inv.type]||'#64748b'}/></td>
                      <td style={{ padding:'9px 10px' }}><Pill text={inv.status} color={PC_COLOR[inv.status]||'#64748b'}/></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* == FINANCIAL (P&L, QuickBooks-like) == */}
        {tab === 'financial' && (
          <div>
            {/* P&L Header */}
            <Card style={{ background:'#0B3D91', marginBottom:16 }}>
              <div style={{ color:'#fff' }}>
                <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:4, opacity:.8 }}>Profit and Loss Statement -- May 2026</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:14 }}>
                  {[
                    ['Total Revenue',   fin.totalIncome, '#86efac'],
                    ['Operating Costs', fin.totalCosts,  '#fca5a5'],
                    ['Net Profit',      fin.netProfit,   fin.netProfit>=0?'#86efac':'#fca5a5'],
                    ['Profit Margin',   Math.round(fin.totalIncome>0?fin.netProfit/fin.totalIncome*100:0), '#FFC72C', '%'],
                  ].map(([l,v,c,sfx]) => (
                    <div key={l}>
                      <div style={{ fontSize:11, opacity:.7, ...I, marginBottom:4 }}>{l}</div>
                      <div style={{ ...P, fontWeight:800, fontSize:22, color:c }}>{sfx==='%'?v+'%':fmt(Math.abs(v))}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Income statement */}
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <Card>
                <SectionHead title="Income"/>
                {[
                  ['Route Revenue',      fin.totalIncome * 0.7],
                  ['Charter Revenue',    fin.totalIncome * 0.15],
                  ['Contract Revenue',   fin.totalIncome * 0.1],
                  ['Parcel Revenue',     fin.totalIncome * 0.05],
                ].map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <span style={{ fontSize:13, ...I }}>{l}</span>
                    <span style={{ ...P, fontWeight:700, fontSize:13, color:'#15803d' }}>{fmt(v)}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'2px solid #E2E8F0', marginTop:4 }}>
                  <span style={{ ...P, fontWeight:700 }}>Total Income</span>
                  <span style={{ ...P, fontWeight:800, fontSize:16, color:'#15803d' }}>{fmt(fin.totalIncome)}</span>
                </div>
              </Card>

              <Card>
                <SectionHead title="Expenses by Category"/>
                {Object.entries(fin.byCategory).map(([cat,amt]) => (
                  <div key={cat} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #F1F5F9', alignItems:'center' }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <Pill text={cat} color={CAT_COLOR[cat]||'#64748b'}/>
                    </div>
                    <span style={{ ...P, fontWeight:700, fontSize:13, color:'#dc2626' }}>{fmt(amt)}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'2px solid #E2E8F0', marginTop:4 }}>
                  <span style={{ ...P, fontWeight:700 }}>Total Costs</span>
                  <span style={{ ...P, fontWeight:800, fontSize:16, color:'#dc2626' }}>{fmt(fin.totalCosts)}</span>
                </div>
              </Card>
            </div>

            {/* Monthly trend */}
            <Card style={{ marginBottom:14 }}>
              <SectionHead title="Monthly Revenue vs Costs"/>
              <BarChart data={[42,58,51,73,69,90,75]} labels={['Nov','Dec','Jan','Feb','Mar','Apr','May']} height={100}/>
            </Card>

            {/* Export options */}
            <Card>
              <SectionHead title="Reports and Export"/>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
                {[
                  ['P&L Statement',     'Income vs expenses, full month'],
                  ['Balance Sheet',     'Assets, liabilities, equity'],
                  ['Cash Flow Report',  'Cash in vs cash out'],
                  ['Cost per Vehicle',  'Route P&L per bus'],
                  ['Driver Report',     'Trip count, fuel, salary'],
                  ['Export QuickBooks', 'IIF format import file'],
                  ['Export CSV',        'All transactions, spreadsheet'],
                  ['Tax Summary',       'VAT and withholding tax'],
                ].map(([t,d]) => (
                  <button key={t} onClick={() => toast('Generating: '+t+'...','success')}
                    style={{ background:'#F5F7FA', borderRadius:12, padding:14, border:'1.5px solid #E2E8F0', cursor:'pointer', textAlign:'left', transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#0B3D91';e.currentTarget.style.background='#eff6ff'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.background='#F5F7FA'}}>
                    <div style={{ ...P, fontWeight:700, fontSize:13, marginBottom:4, color:'#0B3D91' }}>{t}</div>
                    <div style={{ fontSize:11, color:'#64748b', ...I }}>{d}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* == STAFF/HR == */}
        {tab === 'hr' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Total Staff"    value={drivers.length + 3} sub="Drivers + admin" bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Monthly Payroll" value={fmt(drivers.reduce((s,d)=>s+d.salary,0)+2400000)} sub="All staff" bg="#fef9c3" color="#92400e"/>
              <StatCard label="Active Drivers"  value={drivers.filter(d=>d.status==='Active').length} sub="On duty" bg="#dcfce7" color="#15803d"/>
            </div>
            <Card>
              <SectionHead title="Payroll Summary -- May 2026" action="Run Payroll" onAction={() => toast('Payroll processed via MTN MoMo','success')}/>
              {[...drivers.map(d=>({ name:d.name, role:'Driver', salary:d.salary, status:d.status })),
                { name:'Operations Manager', role:'Admin', salary:1500000, status:'Active' },
                { name:'Fleet Assistant',    role:'Admin', salary:600000,  status:'Active' },
                { name:'Accounts Officer',   role:'Admin', salary:700000,  status:'Active' },
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:800, fontSize:14, color:'#0B3D91', flexShrink:0 }}>{s.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13 }}>{s.name}</div>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>{s.role}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ ...P, fontWeight:700, fontSize:14, color:'#0B3D91' }}>{fmt(s.salary)}</div>
                    <Pill text={s.status} color={s.status==='Active'?'#15803d':'#d97706'}/>
                  </div>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:14, borderTop:'2px solid #E2E8F0', marginTop:4 }}>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:11, color:'#64748b', ...I }}>Total Monthly Payroll</div>
                  <div style={{ ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>{fmt(drivers.reduce((s,d)=>s+d.salary,0)+2800000)}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* == FUEL LOG == */}
        {tab === 'fuel' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              <StatCard label="Fuel Spend May" value={fmt(demoCosts.filter(c=>c.cat==='FUEL').reduce((s,c)=>s+c.amount,0))} bg="#fef9c3" color="#92400e"/>
              <StatCard label="Avg Cost/km"    value="UGX 420" sub="Fleet average" bg="#dbeafe" color="#1d4ed8"/>
              <StatCard label="Total km May"   value="14,200 km" sub="All vehicles" bg="#dcfce7" color="#15803d"/>
            </div>
            <Card>
              <SectionHead title="Fuel Entries" action="Log Fuel" onAction={() => setCModal({ cat:'FUEL' })}/>
              {demoCosts.filter(c=>c.cat==='FUEL').map((c,i) => (
                <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'#fef9c3', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <IconFuel size={18} color="#92400e"/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13 }}>{c.vehicle} -- {c.vendor}</div>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>{c.desc} -- {c.date}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ ...P, fontWeight:700, fontSize:14, color:'#0B3D91' }}>{fmt(c.amount)}</div>
                    <Pill text={c.status} color={PC_COLOR[c.status]||'#64748b'}/>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* == ALERTS == */}
        {tab === 'alerts' && (
          <Card>
            <SectionHead title="Notifications" action="Mark all read" onAction={() => { st.markOpRead && st.markOpRead(op.id); toast('All read','success') }}/>
            {notifications.length === 0
              ? <EmptyState title="All caught up" desc="No new notifications"/>
              : notifications.map((n,i) => (
                <div key={n.id||i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:i<notifications.length-1?'1px solid #E2E8F0':'', background:!n.read?'#f8faff':'' }}>
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

        {/* == SETTINGS == */}
        {tab === 'settings' && (
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Fleet Profile"/>
              {[['Company','Raylane Express Fleet'],['Type','Internal Fleet'],['Merchant Code','RAYLANE_EXPRESS'],['Commission','0% (internal)'],['Vehicles',vehicles.length],['Drivers',drivers.length]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                  <span style={{ ...P, fontWeight:600, fontSize:13 }}>{l}</span>
                  <span style={{ fontSize:13, color:'#64748b', ...I }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHead title="Compliance Status"/>
              {vehicles.map(v => {
                const fitWarn = new Date(v.fit_exp) < new Date(Date.now()+60*24*60*60*1000)
                const insWarn = new Date(v.ins_exp) < new Date(Date.now()+60*24*60*60*1000)
                return (
                  <div key={v.id} style={{ padding:'10px 0', borderBottom:'1px solid #E2E8F0' }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13, marginBottom:4 }}>{v.reg}</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <Pill text={insWarn?'Insurance WARN':'Insurance OK'} color={insWarn?'#dc2626':'#15803d'}/>
                      <Pill text={fitWarn?'Fitness WARN':'Fitness OK'}    color={fitWarn?'#dc2626':'#15803d'}/>
                    </div>
                  </div>
                )
              })}
            </Card>
          </div>
        )}
      </div>

      {/* -- VEHICLE MODAL -- */}
      <Modal open={!!vModal} onClose={() => setVModal(null)} title={vModal==='add'?'Add Vehicle':'Edit Vehicle'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['reg','Registration Plate'],['make','Make'],['model','Model'],['year','Year']].map(([k,l]) => (
            <div key={k}><label style={lS}>{l}</label><input value={vForm[k]||''} onChange={e=>setVForm(f=>({...f,[k]:e.target.value}))} style={iS}/></div>
          ))}
          <div><label style={lS}>Type</label>
            <select value={vForm.type||'67-Seater Coach'} onChange={e=>setVForm(f=>({...f,type:e.target.value}))} style={iS}>
              <option>67-Seater Coach</option><option>14-Seater Taxi</option>
            </select>
          </div>
          <div><label style={lS}>Assigned Driver</label>
            <select value={vForm.driver||''} onChange={e=>setVForm(f=>({...f,driver:e.target.value}))} style={iS}>
              <option value="">Unassigned</option>
              {drivers.map(d=><option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          {[['ins_exp','Insurance Expiry'],['fit_exp','Fitness Expiry']].map(([k,l]) => (
            <div key={k}><label style={lS}>{l}</label><input type="date" value={vForm[k]||''} onChange={e=>setVForm(f=>({...f,[k]:e.target.value}))} style={iS}/></div>
          ))}
          {[['monthly_ins','Monthly Insurance (UGX)'],['wash_fee','Monthly Wash Fee (UGX)']].map(([k,l]) => (
            <div key={k}><label style={lS}>{l}</label><input type="number" value={vForm[k]||''} onChange={e=>setVForm(f=>({...f,[k]:parseInt(e.target.value)||0}))} style={iS}/></div>
          ))}
          <div><label style={lS}>Status</label>
            <select value={vForm.status||'Active'} onChange={e=>setVForm(f=>({...f,status:e.target.value}))} style={iS}>
              {['Active','Maintenance','Inactive'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setVModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (vModal==='add') {
              setVehicles(p=>[...p,{...vForm,id:'V'+Date.now(),fuel:100,mileage:0,ins_amount:4200000,assigned_route:'TBD'}])
              toast('Vehicle added','success')
            } else {
              setVehicles(p=>p.map(x=>x.id===vModal.id?{...x,...vForm}:x))
              toast('Vehicle updated','success')
            }
            setVModal(null)
          }}>{vModal==='add'?'Add Vehicle':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* -- DRIVER MODAL -- */}
      <Modal open={!!dModal} onClose={() => setDModal(null)} title={dModal==='add'?'Add Driver':'Edit Driver'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['name','Full Name'],['phone','Phone'],['nid','National ID'],['licence','Licence No.']].map(([k,l]) => (
            <div key={k}><label style={lS}>{l}</label><input value={dForm[k]||''} onChange={e=>setDForm(f=>({...f,[k]:e.target.value}))} style={iS}/></div>
          ))}
          <div><label style={lS}>Licence Expiry</label><input type="date" value={dForm.lic_exp||''} onChange={e=>setDForm(f=>({...f,lic_exp:e.target.value}))} style={iS}/></div>
          <div><label style={lS}>Salary (UGX/mo)</label><input type="number" value={dForm.salary||''} onChange={e=>setDForm(f=>({...f,salary:parseInt(e.target.value)||0}))} style={iS}/></div>
          <div><label style={lS}>Assigned Vehicle</label>
            <select value={dForm.vehicle||''} onChange={e=>setDForm(f=>({...f,vehicle:e.target.value}))} style={iS}>
              <option value="">Unassigned</option>
              {allVehicleRegs.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label style={lS}>Status</label>
            <select value={dForm.status||'Active'} onChange={e=>setDForm(f=>({...f,status:e.target.value}))} style={iS}>
              {['Active','Off Duty','Suspended'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setDModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (dModal==='add') {
              setDrivers(p=>[...p,{...dForm,id:'D'+Date.now(),trips:0,rating:0,class:'PSV'}])
              toast('Driver added','success')
            } else {
              setDrivers(p=>p.map(x=>x.id===dModal.id?{...x,...dForm}:x))
              toast('Driver updated','success')
            }
            setDModal(null)
          }}>{dModal==='add'?'Add Driver':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* -- COST MODAL -- */}
      <Modal open={!!cModal} onClose={() => setCModal(null)} title="Add Cost Entry">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label style={lS}>Date</label><input type="date" value={cForm.date} onChange={e=>setCForm({...cForm,date:e.target.value})} style={iS}/></div>
          <div><label style={lS}>Category</label>
            <select value={cForm.cat||'FUEL'} onChange={e=>setCForm({...cForm,cat:e.target.value})} style={iS}>
              {['FUEL','MAINTENANCE','WASHING','INSURANCE','STAFF','PERMIT','TAX','OTHER'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={lS}>Vehicle</label>
            <select value={cForm.vehicle||''} onChange={e=>setCForm({...cForm,vehicle:e.target.value})} style={iS}>
              <option value="">General / All</option>
              {allVehicleRegs.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label style={lS}>Vendor</label>
            <select value={cForm.vendor||''} onChange={e=>setCForm({...cForm,vendor:e.target.value})} style={iS}>
              <option value="">Select vendor...</option>
              {demoVendors.map(v=><option key={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description *</label><input value={cForm.desc||''} onChange={e=>setCForm({...cForm,desc:e.target.value})} placeholder="What was this expense for?" style={iS}/></div>
          <div><label style={lS}>Amount (UGX) *</label><input type="number" value={cForm.amount||''} onChange={e=>setCForm({...cForm,amount:e.target.value})} placeholder="e.g. 500000" style={iS}/></div>
          <div><label style={lS}>Invoice Number</label><input value={cForm.invoice||''} onChange={e=>setCForm({...cForm,invoice:e.target.value})} placeholder="INV-2026-xxx" style={iS}/></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setCModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={addCost}>Add Cost Entry</Btn>
        </div>
      </Modal>

      {/* -- VENDOR MODAL -- */}
      <Modal open={!!vnModal} onClose={() => setVnModal(null)} title={vnModal==='add'?'Add Vendor':'Edit Vendor'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div style={{ gridColumn:'1/-1' }}><label style={lS}>Company Name *</label><input value={vnForm.name||''} onChange={e=>setVnForm({...vnForm,name:e.target.value})} placeholder="e.g. Total Energies Kampala" style={iS}/></div>
          <div><label style={lS}>Category</label>
            <select value={vnForm.cat||'FUEL'} onChange={e=>setVnForm({...vnForm,cat:e.target.value})} style={iS}>
              {['FUEL','MAINTENANCE','WASHING','INSURANCE','STAFF','PERMIT','OTHER'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={lS}>Contact Phone</label><input value={vnForm.contact||''} onChange={e=>setVnForm({...vnForm,contact:e.target.value})} style={iS}/></div>
          <div><label style={lS}>Credit Limit (UGX)</label><input type="number" value={vnForm.credit_limit||''} onChange={e=>setVnForm({...vnForm,credit_limit:parseInt(e.target.value)||0})} style={iS}/></div>
          <div><label style={lS}>Payment Terms</label>
            <select value={vnForm.terms||'Net 30'} onChange={e=>setVnForm({...vnForm,terms:e.target.value})} style={iS}>
              {['Cash','Weekly','Net 7','Net 15','Net 30','Net 60','Annual'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setVnModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (vnModal==='add') {
              setDemoVendors(p=>[...p,{...vnForm,id:'VND'+Date.now(),balance:0,status:'Active'}])
              toast('Vendor added','success')
            } else {
              setDemoVendors(p=>p.map(x=>x.id===vnModal.id?{...x,...vnForm}:x))
              toast('Vendor updated','success')
            }
            setVnModal(null)
          }}>{vnModal==='add'?'Add Vendor':'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* -- PAYMENT MODAL (state-based) -- */}
      <Modal open={!!pModal} onClose={() => setPModal(null)} title={pModal==='add'?'Add Invoice':'Edit Invoice'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label style={lS}>Type</label>
            <select value={pForm.type||'Utility'} onChange={e=>setPForm(f=>({...f,type:e.target.value}))} style={iS}>
              {['Utility','Rent','Washing','Internet','Insurance','Permit','Other'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={lS}>Vendor</label>
            <select value={pForm.vendor||''} onChange={e=>setPForm(f=>({...f,vendor:e.target.value}))} style={iS}>
              <option value="">Select vendor...</option>
              {demoVendors.map(v=><option key={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lS}>Description</label>
            <input value={pForm.desc||''} onChange={e=>setPForm(f=>({...f,desc:e.target.value}))} placeholder="Invoice description..." style={iS}/>
          </div>
          <div><label style={lS}>Amount (UGX)</label>
            <input type="number" value={pForm.amount||''} onChange={e=>setPForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 450000" style={iS}/>
          </div>
          <div><label style={lS}>Due Date</label>
            <input type="date" value={pForm.due||''} onChange={e=>setPForm(f=>({...f,due:e.target.value}))} style={iS}/>
          </div>
          <div><label style={lS}>Status</label>
            <select value={pForm.status||'UNPAID'} onChange={e=>setPForm(f=>({...f,status:e.target.value}))} style={iS}>
              {['UNPAID','PAID','OVERDUE'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
          <Btn variant="ghost" full onClick={() => setPModal(null)}>Cancel</Btn>
          <Btn variant="blue" full onClick={() => {
            if (!pForm.vendor || !pForm.amount || !pForm.due) { toast('Fill vendor, amount and due date','warning'); return }
            const entry = { ...pForm, amount:parseInt(pForm.amount||0) }
            if (pModal==='add') {
              setOpPayments(p=>[...p,{id:'PMT'+Date.now(),...entry}])
              toast('Invoice added','success')
            } else {
              setOpPayments(p=>p.map(x=>x.id===pModal.id?{...x,...entry}:x))
              toast('Invoice updated','success')
            }
            setPModal(null)
          }}>{pModal==='add'?'Add Invoice':'Save Changes'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
