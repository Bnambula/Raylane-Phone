/**
 * RAYLANE EXPRESS — CENTRAL STORE v6
 * Full Ecosystem: Booking Platform + Operator SaaS + Fleet Manager + Financial ERP
 * Inspired by: FlixBus operator model, RedBus SaaS, Truckbase financial integration
 */

export const INITIAL_STATE = {

  /* ─── OPERATORS ─── */
  operators: [
    { id:'op-rlx', company_name:'Raylane Express Fleet', contact:'Raylane Admin',
      phone:'0700-000-000', email:'fleet@raylaneexpress.com', fleet_size:3,
      status:'ACTIVE', is_premium:true, operator_type:'INTERNAL', managed_by_raylane:true,
      merchant_code:'RAYLANE_EXPRESS', momo_number:'0700-000-000', rating:5.0, reviews:0,
      boarding_pin:{ lat:0.3476, lng:32.5825, label:'Raylane HQ, Kampala Coach Park' },
      created_at:'2024-01-01', commission_rate:0,
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'ACTIVE'}, fuel_module:{status:'ACTIVE'}, loan_tracking:{status:'ACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'ACTIVE'}, hr_module:{status:'ACTIVE'}, fleet_module:{status:'ACTIVE'}, cost_center:{status:'ACTIVE'} } },
    { id:'op-001', company_name:'Global Coaches Ltd', contact:'John Ssemakula',
      phone:'0771-234-567', email:'info@globalcoaches.ug', fleet_size:5,
      status:'ACTIVE', is_premium:true, operator_type:'EXTERNAL', managed_by_raylane:false,
      merchant_code:'GLOBAL_UG', momo_number:'0771-234-567', rating:4.8, reviews:312,
      boarding_pin:{ lat:0.3476, lng:32.5825, label:'Kampala Coach Park, Gate 3' },
      created_at:'2024-01-15', commission_rate:0.08,
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'ACTIVE'}, fuel_module:{status:'INACTIVE'}, loan_tracking:{status:'ACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'ACTIVE'}, hr_module:{status:'INACTIVE'}, fleet_module:{status:'INACTIVE'}, cost_center:{status:'ACTIVE'} } },
    { id:'op-002', company_name:'YY Coaches', contact:'Yusuf Yasiin',
      phone:'0700-345-678', email:'yy@yycoaches.ug', fleet_size:3,
      status:'ACTIVE', is_premium:false, operator_type:'EXTERNAL', managed_by_raylane:false,
      merchant_code:'YY_COACHES', momo_number:'0700-345-678', rating:4.6, reviews:208,
      boarding_pin:{ lat:0.3489, lng:32.5814, label:'New Taxi Park, Stand 7' },
      created_at:'2024-03-10', commission_rate:0.08,
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'INACTIVE'}, fuel_module:{status:'INACTIVE'}, loan_tracking:{status:'INACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'INACTIVE'}, hr_module:{status:'INACTIVE'}, fleet_module:{status:'INACTIVE'}, cost_center:{status:'INACTIVE'} } },
    { id:'op-004', company_name:'Fast Coaches Ltd', contact:'Grace Auma', phone:'0752-678-901',
      email:'grace@fastcoaches.ug', fleet_size:4, status:'ACTIVE', is_premium:false, operator_type:'EXTERNAL', managed_by_raylane:false,
      merchant_code:'FAST_COACHES', momo_number:'0752-678-901', rating:4.3, reviews:87,
      boarding_pin:{ lat:0.3492, lng:32.5801, label:'Nakivubo Terminal, Bay 5' }, created_at:'2024-08-01', commission_rate:0.08,
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'INACTIVE'}, fuel_module:{status:'INACTIVE'}, loan_tracking:{status:'INACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'INACTIVE'}, hr_module:{status:'INACTIVE'}, fleet_module:{status:'INACTIVE'}, cost_center:{status:'INACTIVE'} } },
    { id:'op-003', company_name:'Link Bus', contact:'Peter Ochieng',
      phone:'0752-456-789', email:'ops@linkbus.ug', fleet_size:8,
      status:'ACTIVE', is_premium:true, operator_type:'EXTERNAL', managed_by_raylane:false,
      merchant_code:'LINK_BUS_UG', momo_number:'0752-456-789', rating:4.5, reviews:189,
      boarding_pin:{ lat:0.3501, lng:32.5798, label:'Namirembe Road Bus Park' },
      created_at:'2024-02-20', commission_rate:0.08,
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'ACTIVE'}, fuel_module:{status:'ACTIVE'}, loan_tracking:{status:'INACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'ACTIVE'}, hr_module:{status:'ACTIVE'}, fleet_module:{status:'ACTIVE'}, cost_center:{status:'ACTIVE'} } },
  ],

  /* ─── TRIPS ─── */
  trips: [
    { id:'T-001', operator_id:'op-rlx', operator_name:'Raylane Express Fleet', plate:'UBF 001K', from:'Kampala', to:'Mbale',       date:'2026-05-12', departs:'8:00 AM',  seat_type:'55', price:28000, seats_total:55, seats_booked:22, status:'APPROVED',          amenities:['ac','wifi','usb'], notes:'Premium Raylane direct service',  boarding_pin:{lat:0.3476,lng:32.5825,label:'Raylane HQ, Gate 1'}, operator_type:'INTERNAL' },
    { id:'T-002', operator_id:'op-rlx', operator_name:'Raylane Express Fleet', plate:'UBF 002K', from:'Kampala', to:'Gulu',        date:'2026-05-12', departs:'7:00 AM',  seat_type:'67', price:38000, seats_total:67, seats_booked:31, status:'APPROVED',          amenities:['ac','usb'],       notes:'Express — no stops',            boarding_pin:{lat:0.3476,lng:32.5825,label:'Raylane HQ, Gate 2'}, operator_type:'INTERNAL' },
    { id:'T-003', operator_id:'op-001', operator_name:'Global Coaches Ltd',    plate:'UAR 901J', from:'Kampala', to:'Mbale',       date:'2026-05-12', departs:'10:00 AM', seat_type:'55', price:25000, seats_total:55, seats_booked:36, status:'APPROVED',          amenities:['ac'],             notes:'',                              boarding_pin:{lat:0.3476,lng:32.5825,label:'Kampala Coach Park, Gate 3'} },
    { id:'T-004', operator_id:'op-001', operator_name:'Global Coaches Ltd',    plate:'UAR 902J', from:'Kampala', to:'Mbarara',     date:'2026-05-12', departs:'9:00 AM',  seat_type:'67', price:30000, seats_total:67, seats_booked:8,  status:'APPROVED',          amenities:['ac'],             notes:'',                              boarding_pin:{lat:0.3476,lng:32.5825,label:'Kampala Coach Park, Gate 3'} },
    { id:'T-005', operator_id:'op-003', operator_name:'Link Bus',              plate:'UBJ 890C', from:'Kampala', to:'Nairobi',     date:'2026-05-14', departs:'6:00 AM',  seat_type:'65', price:65000, seats_total:65, seats_booked:18, status:'APPROVED',          amenities:['ac','wifi'],      notes:'Passport required',             boarding_pin:{lat:0.3501,lng:32.5798,label:'Namirembe Road Bus Park'} },
    { id:'T-006', operator_id:'op-003', operator_name:'Link Bus',              plate:'UBJ 890C', from:'Kampala', to:'Kigali',      date:'2026-05-14', departs:'5:30 AM',  seat_type:'65', price:60000, seats_total:65, seats_booked:12, status:'APPROVED',          amenities:['ac','wifi'],      notes:'Passport required',             boarding_pin:{lat:0.3501,lng:32.5798,label:'Namirembe Road Bus Park'} },
    { id:'T-007', operator_id:'op-004', operator_name:'Fast Coaches Ltd',      plate:'UAK 512B', from:'Kampala', to:'Fort Portal', date:'2026-05-12', departs:'9:30 AM',  seat_type:'55', price:35000, seats_total:55, seats_booked:14, status:'APPROVED',          amenities:['ac'],             notes:'Scenic western route',          boarding_pin:{lat:0.3492,lng:32.5801,label:'Nakivubo Terminal, Bay 5'} },
    { id:'T-008', operator_id:'op-001', operator_name:'Global Coaches Ltd',    plate:'UAR 901J', from:'Kampala', to:'Kabale',      date:'2026-05-15', departs:'6:00 AM',  seat_type:'55', price:42000, seats_total:55, seats_booked:5,  status:'APPROVED',          amenities:['ac'],             notes:'Via Mbarara',                   boarding_pin:{lat:0.3476,lng:32.5825,label:'Kampala Coach Park, Gate 3'} },
    { id:'T-009', operator_id:'op-rlx', operator_name:'Raylane Express Fleet', plate:'UBF 001K', from:'Mbale',   to:'Kampala',     date:'2026-05-12', departs:'2:00 PM',  seat_type:'55', price:28000, seats_total:55, seats_booked:12, status:'APPROVED',          amenities:['ac','usb'],       notes:'Afternoon return service',      boarding_pin:{lat:1.0754,lng:34.1736,label:'Mbale Bus Terminal'}, operator_type:'INTERNAL' },
    { id:'T-010', operator_id:'op-002', operator_name:'YY Coaches',            plate:'UAK 512B', from:'Kampala', to:'Gulu',        date:'2026-05-13', departs:'7:00 AM',  seat_type:'67', price:35000, seats_total:67, seats_booked:0,  status:'PENDING_APPROVAL', amenities:[],                 notes:'Direct route',                  boarding_pin:{lat:0.3489,lng:32.5814,label:'New Taxi Park, Stand 7'} },
  ],

  /* ─── BOOKINGS ─── */
  bookings: [
    { id:'RLX-001', trip_id:'T-001', operator_id:'op-001', seat:'5',  phone:'0771-xxx', pay_phone:null, amount:25000, method:'MTN MoMo',    status:'CONFIRMED', created_at:'2026-05-10 09:14', booking_type:'STANDARD' },
    { id:'RLX-002', trip_id:'T-001', operator_id:'op-001', seat:'12', phone:'0700-xxx', pay_phone:null, amount:25000, method:'Airtel Money', status:'CONFIRMED', created_at:'2026-05-10 10:02', booking_type:'STANDARD' },
    { id:'RLX-003', trip_id:'T-004', operator_id:'op-003', seat:'7',  phone:'0703-xxx', pay_phone:null, amount:60000, method:'MTN MoMo',    status:'CONFIRMED', created_at:'2026-05-11 11:20', booking_type:'STANDARD' },
    { id:'RLX-004', trip_id:'T-005', operator_id:'op-rlx', seat:'3',  phone:'0752-xxx', pay_phone:null, amount:28000, method:'MTN MoMo',    status:'CONFIRMED', created_at:'2026-05-10 08:00', booking_type:'ADVANCE', commitment_fee:5600, commitment_paid:true },
  ],

  /* ─── PAYOUTS ─── */
  payouts: [
    { id:'PAY-001', trip_id:'T-001', operator_id:'op-001', operator_name:'Global Coaches Ltd', merchant_code:'GLOBAL_UG', gross:900000, commission:72000, net:828000, status:'READY', triggered_at:null },
    { id:'PAY-002', trip_id:'T-004', operator_id:'op-003', operator_name:'Link Bus', merchant_code:'LINK_BUS_UG', gross:1080000, commission:86400, net:993600, status:'RELEASED', triggered_at:'2026-05-11 16:00' },
  ],

  /* ─── APPLICATIONS ─── */
  applications: [
    { id:'APP-001', status:'PENDING_REVIEW', contact_name:'David Kamya', company_name:'City Express', phone:'0781-567-890', email:'david@cityexpress.ug', fleet_size:4, current_routes:'Kampala–Fort Portal', modules_requested:['booking_basic','parcel_basic'], terms_accepted:true, signature_name:'David Kamya', submitted_at:'2026-05-11 14:22' },
    { id:'APP-002', status:'PENDING_REVIEW', contact_name:'Grace Auma', company_name:'Fast Coaches Ltd', phone:'0752-678-901', email:'grace@fastcoaches.ug', fleet_size:6, current_routes:'Kampala–Gulu, Gulu–Juba', modules_requested:['booking_basic','parcel_basic','financial_module','analytics_module'], terms_accepted:true, signature_name:'Grace Auma', submitted_at:'2026-05-12 09:05' },
  ],

  /* ─── NOTIFICATIONS ─── */
  notifications: {
    admin: [
      { id:'N-001', type:'TRIP_PENDING',  icon:'🚌', msg:'YY Coaches submitted Kampala→Gulu 7AM',      time:'2 hrs ago', read:false, link:'trips' },
      { id:'N-002', type:'APP_SUBMITTED', icon:'📝', msg:'New application: City Express (David Kamya)', time:'4 hrs ago', read:false, link:'applications' },
      { id:'N-003', type:'LOAN_OVERDUE',  icon:'🔴', msg:'YY Coaches bank loan overdue 3 months',      time:'1 day ago', read:true,  link:'bankloans' },
    ],
    operator: {
      'op-001': [
        { id:'N-101', type:'BOOKING',   icon:'🎫', msg:'New booking – Seat 47 (UGX 25,000) MTN MoMo', time:'2 min ago', read:false },
        { id:'N-102', type:'PAYOUT',    icon:'💸', msg:'UGX 828,000 sent to GLOBAL_UG merchant',     time:'2 hrs ago', read:true },
        { id:'N-103', type:'TRIP_LIVE', icon:'✅', msg:'Kampala→Mbale 10AM is now LIVE',              time:'1 day ago', read:true },
      ],
      'op-002': [
        { id:'N-201', type:'TRIP_PENDING',  icon:'⏳', msg:'Kampala→Gulu awaiting admin approval',    time:'2 hrs ago', read:false },
      ],
      'op-rlx': [
        { id:'N-301', type:'BOOKING',   icon:'🎫', msg:'New advance booking – Seat 3 (Raylane Fleet)', time:'1 hr ago', read:false },
      ],
    }
  },

  /* ─── BANK LOANS ─── */
  bank_loans: [
    { id:'BL-001', operator_id:'op-001', operator_name:'Global Coaches Ltd', bank:'Centenary Bank',  principal:50000000, paid:32000000, monthly:3200000, nextDue:'2026-06-01', status:'CURRENT', months_paid:10, total_months:18, purpose:'Fleet expansion' },
    { id:'BL-002', operator_id:'op-002', operator_name:'YY Coaches',         bank:'DFCU Bank',       principal:80000000, paid:24000000, monthly:5000000, nextDue:'2026-05-15', status:'OVERDUE', months_paid:4,  total_months:16, purpose:'New vehicles' },
    { id:'BL-003', operator_id:'op-003', operator_name:'Link Bus',           bank:'Stanbic Bank',    principal:30000000, paid:30000000, monthly:2500000, nextDue:null,         status:'REPAID',  months_paid:12, total_months:12, purpose:'Terminal facilities' },
  ],

  /* ─── COST MANAGEMENT (per operator) ─── */
  cost_entries: [
    /* Global Coaches */
    { id:'CE-001', operator_id:'op-001', category:'FUEL',        vendor:'Total Energies',    amount:2400000, date:'2026-05-01', description:'Monthly fuel – 3 buses', trip_id:null,  status:'PAID' },
    { id:'CE-002', operator_id:'op-001', category:'MAINTENANCE', vendor:'Kampala Motors',    amount:850000,  date:'2026-05-03', description:'UBF 234K service & oil change', trip_id:'T-001', status:'PAID' },
    { id:'CE-003', operator_id:'op-001', category:'STAFF',       vendor:'Internal',          amount:4200000, date:'2026-05-05', description:'May salaries – 12 staff', trip_id:null,  status:'PAID' },
    { id:'CE-004', operator_id:'op-001', category:'INSURANCE',   vendor:'UAP Insurance',     amount:1200000, date:'2026-05-10', description:'Quarterly vehicle insurance', trip_id:null,  status:'PAID' },
    { id:'CE-005', operator_id:'op-001', category:'PERMIT',      vendor:'UNRA',              amount:300000,  date:'2026-05-12', description:'Road fitness certificates x3', trip_id:null,  status:'PENDING' },
    /* YY Coaches */
    { id:'CE-006', operator_id:'op-002', category:'FUEL',        vendor:'Shell Uganda',      amount:1800000, date:'2026-05-01', description:'Fuel – 2 buses', trip_id:null,  status:'PAID' },
    { id:'CE-007', operator_id:'op-002', category:'LOAN',        vendor:'DFCU Bank',         amount:5000000, date:'2026-05-15', description:'Monthly loan repayment', trip_id:null,  status:'OVERDUE' },
    /* Raylane Fleet */
    { id:'CE-008', operator_id:'op-rlx', category:'FUEL',        vendor:'Total Energies',    amount:3200000, date:'2026-05-01', description:'Fleet fuel – all vehicles', trip_id:null,  status:'PAID' },
    { id:'CE-009', operator_id:'op-rlx', category:'STAFF',       vendor:'Internal',          amount:8500000, date:'2026-05-05', description:'Staff salaries – operations team', trip_id:null, status:'PAID' },
    { id:'CE-010', operator_id:'op-rlx', category:'MAINTENANCE', vendor:'Speedway Garage',   amount:1100000, date:'2026-05-08', description:'Scheduled service – UBF 001K', trip_id:'T-005', status:'PAID' },
  ],

  /* ─── VENDORS ─── */
  vendors: [
    { id:'VEN-001', operator_id:'op-001', name:'Total Energies Uganda', category:'FUEL',        contact:'0752-111-222', balance_due:0,       credit_limit:5000000, status:'ACTIVE' },
    { id:'VEN-002', operator_id:'op-001', name:'Kampala Motors Ltd',    category:'MAINTENANCE', contact:'0771-333-444', balance_due:850000,  credit_limit:3000000, status:'ACTIVE' },
    { id:'VEN-003', operator_id:'op-001', name:'UAP Insurance',         category:'INSURANCE',   contact:'0700-555-666', balance_due:0,       credit_limit:0,       status:'ACTIVE' },
    { id:'VEN-004', operator_id:'op-rlx', name:'Total Energies Uganda', category:'FUEL',        contact:'0752-111-222', balance_due:0,       credit_limit:10000000,status:'ACTIVE' },
    { id:'VEN-005', operator_id:'op-rlx', name:'Speedway Garage',       category:'MAINTENANCE', contact:'0771-777-888', balance_due:0,       credit_limit:5000000, status:'ACTIVE' },
  ],

  /* ─── INVOICES (Raylane → Operators for SaaS fees) ─── */
  invoices: [
    { id:'INV-001', operator_id:'op-001', module:'financial_module', amount:100000, period:'May 2026', status:'PAID',    due:'2026-05-05', paid_at:'2026-05-04' },
    { id:'INV-002', operator_id:'op-001', module:'analytics_module', amount:100000, period:'May 2026', status:'PAID',    due:'2026-05-05', paid_at:'2026-05-04' },
    { id:'INV-003', operator_id:'op-001', module:'loan_tracking',    amount:150000, period:'May 2026', status:'PENDING', due:'2026-05-15', paid_at:null },
    { id:'INV-004', operator_id:'op-003', module:'financial_module', amount:100000, period:'May 2026', status:'PAID',    due:'2026-05-05', paid_at:'2026-05-03' },
    { id:'INV-005', operator_id:'op-003', module:'fleet_module',     amount:120000, period:'May 2026', status:'PAID',    due:'2026-05-05', paid_at:'2026-05-03' },
    { id:'INV-006', operator_id:'op-003', module:'hr_module',        amount:100000, period:'May 2026', status:'OVERDUE', due:'2026-05-01', paid_at:null },
  ],

  /* ─── FLEET VEHICLES ─── */
  vehicles: [
    { id:'VH-001', operator_id:'op-rlx', reg:'UBF 001K', type:'55-Seater Coach', driver:'James Okello',  driver_phone:'0771-001-001', status:'On Route',    route:'Kampala→Mbale', fuel_pct:62, last_service:'2026-04-15', next_service:'2026-07-15', insurance_exp:'2026-12-31', fitness_exp:'2026-09-30', mileage:124500 },
    { id:'VH-002', operator_id:'op-rlx', reg:'UBF 002K', type:'67-Seater Coach', driver:'Sarah Nakato',  driver_phone:'0700-002-002', status:'Available',   route:'—',             fuel_pct:88, last_service:'2026-03-10', next_service:'2026-06-10', insurance_exp:'2026-12-31', fitness_exp:'2026-08-15', mileage:89200 },
    { id:'VH-003', operator_id:'op-rlx', reg:'UBF 003K', type:'14-Seater Taxi',  driver:'Peter Mwesiga', driver_phone:'0752-003-003', status:'Maintenance', route:'—',             fuel_pct:35, last_service:'2026-02-20', next_service:'2026-05-20', insurance_exp:'2026-06-30', fitness_exp:'2026-07-01', mileage:212000 },
    { id:'VH-004', operator_id:'op-001', reg:'UAR 901J', type:'55-Seater Coach', driver:'Moses Kato',    driver_phone:'0771-004-004', status:'Available',   route:'—',             fuel_pct:70, last_service:'2026-04-01', next_service:'2026-07-01', insurance_exp:'2026-11-30', fitness_exp:'2026-10-15', mileage:98000 },
  ],

  /* ─── DRIVERS ─── */
  drivers: [
    { id:'DRV-001', operator_id:'op-rlx', name:'James Okello',   phone:'0771-001-001', licence:'DL-001-2024', licence_exp:'2028-01-15', rating:4.9, trips_completed:234, status:'Active' },
    { id:'DRV-002', operator_id:'op-rlx', name:'Sarah Nakato',   phone:'0700-002-002', licence:'DL-002-2024', licence_exp:'2027-06-30', rating:4.7, trips_completed:178, status:'Active' },
    { id:'DRV-003', operator_id:'op-rlx', name:'Peter Mwesiga',  phone:'0752-003-003', licence:'DL-003-2022', licence_exp:'2026-08-01', rating:4.5, trips_completed:312, status:'On Leave' },
  ],

  /* ─── PARCELS ─── */
  parcels: [
    { id:'PCL-001', operator_id:'op-001', type:'Small Parcel', from:'Kampala', to:'Mbale',  sender:'0771-xxx', recipient:'0752-xxx', amount:12000, status:'IN_TRANSIT', insured:false, created_at:'2026-05-11', tracking_events:[{ label:'Picked Up', time:'8:00 AM', done:true },{ label:'On Board', time:'9:00 AM', done:true },{ label:'In Transit', time:'11:30 AM', done:false },{ label:'Delivered', time:'2:00 PM est', done:false }] },
    { id:'PCL-002', operator_id:'op-rlx', type:'Envelope',    from:'Kampala', to:'Gulu',   sender:'0700-xxx', recipient:'0703-xxx', amount:5000,  status:'PENDING',    insured:false, created_at:'2026-05-12', tracking_events:[] },
  ],

  /* ─── AUDIT LOG ─── */
  audit_log: [
    { id:'AUD-001', action:'TRIP_APPROVED',    actor:'Admin', target:'T-001', time:'2026-05-10 08:00', detail:'Global Coaches Kampala→Mbale approved' },
    { id:'AUD-002', action:'MODULE_ACTIVATED', actor:'Admin', target:'op-001',time:'2026-03-01 10:00', detail:'Financial Module activated for Global Coaches' },
    { id:'AUD-003', action:'PAYOUT_RELEASED',  actor:'Admin', target:'PAY-002',time:'2026-05-11 16:00',detail:'UGX 993,600 released to Link Bus' },
    { id:'AUD-004', action:'VENDOR_ADDED',     actor:'op-001',target:'VEN-002',time:'2026-05-03 09:00',detail:'Kampala Motors added as maintenance vendor' },
  ],

  /* ─── MODULE REQUESTS ─── */
  module_requests: [],
}

/* ─────────────────────────────────────
   STORE CLASS
───────────────────────────────────────── */
class RaylaneStore {
  constructor() {
    this._listeners = []
    this._state = this._load()
  }

  _load() {
    try {
      const s = sessionStorage.getItem('rlx_v6')
      if (s) return { ...INITIAL_STATE, ...JSON.parse(s) }
    } catch {}
    return { ...INITIAL_STATE }
  }

  _save() {
    try { sessionStorage.setItem('rlx_v6', JSON.stringify(this._state)) } catch {}
    this._listeners.forEach(fn => fn({ ...this._state }))
  }

  subscribe(fn) {
    this._listeners.push(fn)
    return () => { this._listeners = this._listeners.filter(l => l !== fn) }
  }

  getState() { return { ...this._state } }

  /* ── TRIPS ── */
  getTrips(f={}) {
    let t = this._state.trips
    if (f.operator_id) t = t.filter(x => x.operator_id === f.operator_id)
    if (f.status)      t = t.filter(x => x.status === f.status)
    if (f.live)        t = t.filter(x => x.status === 'APPROVED')
    return t
  }

  createTrip(data) {
    const op = this._state.operators.find(o => o.id === data.operator_id)
    const isInternal = op?.operator_type === 'INTERNAL'
    const trip = { ...data, id:`T-${Date.now()}`, status: isInternal ? 'APPROVED' : 'PENDING_APPROVAL', created_at: new Date().toISOString() }
    this._state = { ...this._state, trips: [trip, ...this._state.trips] }
    if (!isInternal) this._adminNotif({ type:'TRIP_PENDING', icon:'🚌', msg:`${data.operator_name} submitted ${data.from}→${data.to} ${data.departs}`, link:'trips' })
    this._audit('TRIP_SUBMITTED', op?.company_name||'Admin', trip.id, `${data.operator_name} trip ${data.from}→${data.to}`)
    this._save()
    return trip
  }

  approveTrip(id, note='') {
    this._state = { ...this._state, trips: this._state.trips.map(t => t.id===id ? {...t, status:'APPROVED', admin_note:note, approved_at:new Date().toISOString()} : t) }
    const t = this._state.trips.find(x => x.id===id)
    this._opNotif(t.operator_id, { type:'TRIP_LIVE', icon:'✅', msg:`Your trip ${t.from}→${t.to} ${t.departs} is now LIVE` })
    this._audit('TRIP_APPROVED', 'Admin', id, `${t.operator_name} ${t.from}→${t.to} approved`)
    this._save()
  }

  rejectTrip(id, reason='') {
    this._state = { ...this._state, trips: this._state.trips.map(t => t.id===id ? {...t, status:'REJECTED', rejection_reason:reason} : t) }
    const t = this._state.trips.find(x => x.id===id)
    this._opNotif(t.operator_id, { type:'TRIP_REJECTED', icon:'❌', msg:`Trip ${t.from}→${t.to} rejected: ${reason}` })
    this._audit('TRIP_REJECTED', 'Admin', id, reason)
    this._save()
  }

  editApproveTrip(id, edits) {
    this._state = { ...this._state, trips: this._state.trips.map(t => t.id===id ? {...t, ...edits, status:'APPROVED', approved_at:new Date().toISOString()} : t) }
    const t = this._state.trips.find(x => x.id===id)
    this._opNotif(t.operator_id, { type:'TRIP_EDITED', icon:'✏️', msg:`Admin edited & approved your trip ${t.from}→${t.to}` })
    this._save()
  }

  /* ── MODULES ── */
  activateModule(opId, mod) {
    this._state = { ...this._state, operators: this._state.operators.map(op => op.id!==opId ? op : { ...op, modules: { ...op.modules, [mod]: { status:'ACTIVE', activated_at: new Date().toISOString() } } }) }
    const op = this._state.operators.find(o => o.id===opId)
    this._opNotif(opId, { type:'MODULE_ACTIVATED', icon:'🔓', msg:`${mod.replace(/_/g,' ')} is now active on your dashboard` })
    this._audit('MODULE_ACTIVATED', 'Admin', opId, `${mod} activated for ${op.company_name}`)
    this._save()
  }

  deactivateModule(opId, mod) {
    this._state = { ...this._state, operators: this._state.operators.map(op => op.id!==opId ? op : { ...op, modules: { ...op.modules, [mod]: { status:'INACTIVE', activated_at:null } } }) }
    this._audit('MODULE_DEACTIVATED', 'Admin', opId, `${mod} deactivated`)
    this._save()
  }

  /* ── APPLICATIONS ── */
  submitApplication(data) {
    const app = { ...data, id:`APP-${Date.now()}`, status:'PENDING_REVIEW', submitted_at: new Date().toISOString() }
    this._state = { ...this._state, applications: [app, ...this._state.applications] }
    this._adminNotif({ type:'APP_SUBMITTED', icon:'📝', msg:`New application: ${data.company_name} (${data.contact_name})`, link:'applications' })
    this._save()
    return app
  }

  approveApplication(appId) {
    const app = this._state.applications.find(a => a.id===appId)
    const modules = {}
    ;['booking_basic','parcel_basic','financial_module','fuel_module','loan_tracking','sacco_module','analytics_module','hr_module','fleet_module','cost_center'].forEach(m => {
      modules[m] = { status: ['booking_basic','parcel_basic'].includes(m) ? 'ACTIVE':'INACTIVE', activated_at:null }
    })
    const op = { id:`op-${Date.now()}`, company_name:app.company_name, contact:app.contact_name, phone:app.phone, email:app.email, fleet_size:app.fleet_size, status:'ACTIVE', is_premium:false, operator_type:'EXTERNAL', managed_by_raylane:false, merchant_code:app.company_name.replace(/\s/g,'_').toUpperCase(), momo_number:app.phone, rating:0, reviews:0, boarding_pin:null, created_at:new Date().toISOString(), commission_rate:0.08, modules }
    this._state = { ...this._state, operators:[...this._state.operators, op], applications:this._state.applications.map(a => a.id===appId ? {...a, status:'APPROVED'} : a) }
    this._audit('OPERATOR_APPROVED', 'Admin', op.id, `${app.company_name} onboarded`)
    this._save()
    return op
  }

  rejectApplication(appId, reason='') {
    this._state = { ...this._state, applications: this._state.applications.map(a => a.id===appId ? {...a, status:'REJECTED', rejection_reason:reason} : a) }
    this._save()
  }

  /* ── PAYOUTS ── */
  releasePayout(payId) {
    const p = this._state.payouts.find(x => x.id===payId)
    this._state = { ...this._state, payouts: this._state.payouts.map(x => x.id===payId ? {...x, status:'RELEASED', triggered_at:new Date().toISOString()} : x) }
    this._opNotif(p.operator_id, { type:'PAYOUT', icon:'💸', msg:`UGX ${p.net.toLocaleString()} sent to ${p.merchant_code} merchant account` })
    this._audit('PAYOUT_RELEASED', 'Admin', payId, `UGX ${p.net.toLocaleString()} released to ${p.operator_name}`)
    this._save()
  }

  /* ── COST MANAGEMENT ── */
  addCostEntry(data) {
    const entry = { ...data, id:`CE-${Date.now()}`, created_at: new Date().toISOString() }
    this._state = { ...this._state, cost_entries: [entry, ...this._state.cost_entries] }
    this._audit('COST_ADDED', data.operator_id, entry.id, `${data.category} – ${data.description} – UGX ${data.amount.toLocaleString()}`)
    this._save()
    return entry
  }

  addVendor(data) {
    const vendor = { ...data, id:`VEN-${Date.now()}`, created_at: new Date().toISOString() }
    this._state = { ...this._state, vendors: [...this._state.vendors, vendor] }
    this._audit('VENDOR_ADDED', data.operator_id, vendor.id, `${data.name} added`)
    this._save()
    return vendor
  }

  /* ── NOTIFICATIONS ── */
  _adminNotif(n) {
    const notif = { ...n, id:`N-${Date.now()}`, read:false, time:'Just now' }
    this._state = { ...this._state, notifications: { ...this._state.notifications, admin: [notif, ...this._state.notifications.admin] } }
  }

  _opNotif(opId, n) {
    const notif = { ...n, id:`N-${Date.now()}`, read:false, time:'Just now' }
    const cur = this._state.notifications.operator[opId] || []
    this._state = { ...this._state, notifications: { ...this._state.notifications, operator: { ...this._state.notifications.operator, [opId]: [notif, ...cur] } } }
  }

  markAdminRead()   { this._state = { ...this._state, notifications: { ...this._state.notifications, admin: this._state.notifications.admin.map(n=>({...n,read:true})) } }; this._save() }
  markOpRead(opId)  { this._state = { ...this._state, notifications: { ...this._state.notifications, operator: { ...this._state.notifications.operator, [opId]: (this._state.notifications.operator[opId]||[]).map(n=>({...n,read:true})) } } }; this._save() }

  _audit(action, actor, target, detail) {
    const e = { id:`AUD-${Date.now()}`, action, actor, target, detail, time: new Date().toLocaleString() }
    this._state = { ...this._state, audit_log: [e, ...this._state.audit_log] }
  }

  /* ── MODULE REQUESTS ── */
  requestModuleActivation(opId, mod) {
    const req = { id:`REQ-${Date.now()}`, operator_id:opId, module:mod, status:'PENDING', submitted_at:new Date().toISOString() }
    this._state = { ...this._state, module_requests: [req, ...(this._state.module_requests||[])] }
    const op = this.getOperator(opId)
    this._adminNotif({ type:'MODULE_REQUEST', icon:'💎', msg:`${op?.company_name} requested ${mod.replace(/_/g,' ')}`, link:'services' })
    this._save()
    return req
  }

  /* ── HELPERS ── */
  getOperator(id)    { return this._state.operators.find(o => o.id===id) }
  isModuleActive(opId, mod) { return this.getOperator(opId)?.modules?.[mod]?.status === 'ACTIVE' }
  getLiveTrips(from, to) { return this._state.trips.filter(t => t.status==='APPROVED' && (!from||t.from===from) && (!to||t.to===to)) }
  getBookings(f={}) { let b=this._state.bookings; if(f.operator_id) b=b.filter(x=>x.operator_id===f.operator_id); if(f.trip_id) b=b.filter(x=>x.trip_id===f.trip_id); return b }
  getCosts(opId) { return this._state.cost_entries.filter(c => c.operator_id===opId) }
  getVendors(opId) { return this._state.vendors.filter(v => v.operator_id===opId) }

  /* Financial summaries */
  getFinancialSummary(opId) {
    const costs = this.getCosts(opId)
    const bookings = this.getBookings({ operator_id: opId })
    const revenue = bookings.filter(b=>b.status==='CONFIRMED').reduce((s,b)=>s+b.amount,0)
    const totalCosts = costs.filter(c=>c.status==='PAID').reduce((s,c)=>s+c.amount,0)
    const op = this.getOperator(opId)
    const commission = revenue * (op?.commission_rate||0)
    return { revenue, gross_revenue: revenue, commission, net_revenue: revenue-commission, total_costs: totalCosts, net_profit: revenue-commission-totalCosts, cost_by_category: costs.reduce((acc,c)=>{ acc[c.category]=(acc[c.category]||0)+c.amount; return acc }, {}) }
  }

  resetToInitial() { this._state = { ...INITIAL_STATE }; sessionStorage.removeItem('rlx_v6'); this._save() }
}

export const store = new RaylaneStore()
export default store
