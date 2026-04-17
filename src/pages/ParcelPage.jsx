import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import { useToast } from '../hooks/useToast'
import { Btn } from '../components/ui/SharedComponents'

const P  = { fontFamily:"'Poppins',sans-serif" }
const I  = { fontFamily:"'Inter',sans-serif" }
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14,
  fontFamily:"'Inter',sans-serif", color:'#0F1923', background:'#fff', boxSizing:'border-box', WebkitAppearance:'none', outline:'none' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif",
  textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

/* SVG icons for parcel types */
const EnvelopeIcon = () => (
  <svg width="36" height="36" fill="none" stroke="#1d4ed8" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const BoxIcon = () => (
  <svg width="36" height="36" fill="none" stroke="#15803d" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const GiftIcon = () => (
  <svg width="36" height="36" fill="none" stroke="#92400e" strokeWidth="1.8" viewBox="0 0 24 24">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="36" height="36" fill="none" stroke="#dc2626" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 3v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const PinIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const BusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="1" y="3" width="22" height="16" rx="2"/>
    <path d="M1 10h22M7 19v2M17 19v2M5 3v8M19 3v8"/>
    <circle cx="7.5" cy="15.5" r="1.5"/><circle cx="16.5" cy="15.5" r="1.5"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const ShareIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const PARCEL_TYPES = [
  { id:'envelope', Icon:EnvelopeIcon, name:'Envelope / Documents', price:5000,  maxWeight:'0.5 kg', desc:'Letters, IDs, certificates, contracts',  color:'#dbeafe', border:'#93c5fd', textColor:'#1d4ed8'  },
  { id:'small',    Icon:BoxIcon,      name:'Small Parcel',          price:12000, maxWeight:'2 kg',   desc:'Clothes, books, small electronics',       color:'#dcfce7', border:'#86efac', textColor:'#15803d'  },
  { id:'large',    Icon:GiftIcon,     name:'Large Parcel',          price:20000, maxWeight:'10 kg',  desc:'Household items, medium packages',        color:'#fef9c3', border:'#fde68a', textColor:'#92400e'  },
  { id:'cargo',    Icon:TruckIcon,    name:'Heavy Cargo',           price:30000, maxWeight:'50 kg+', desc:'Large goods, commercial freight',         color:'#fee2e2', border:'#fca5a5', textColor:'#dc2626'  },
]

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']

const TRACK_EVENTS = [
  { Icon:CheckIcon, label:'Picked Up',   detail:'Global Office, Kampala',        time:'8:00 AM',          done:true,  active:false },
  { Icon:CheckIcon, label:'Verified',    detail:'Parcel weighed and labeled',     time:'8:30 AM',          done:true,  active:false },
  { Icon:BusIcon,   label:'On Board',    detail:'UBF 234K -- Enroute to Gulu',   time:'9:00 AM',          done:true,  active:true  },
  { Icon:PinIcon,   label:'In Transit',  detail:'Karuma Checkpoint, passing',     time:'11:24 AM',         done:false, active:false },
  { Icon:CheckIcon, label:'Delivered',   detail:'Gulu Office, Gate 2',           time:'Expected 2:00 PM', done:false, active:false },
]

export default function ParcelPage() {
  const navigate = useNavigate()
  const toast    = useToast()

  const [activeTab,   setActiveTab]   = useState('send')
  const [parcelType,  setParcelType]  = useState('')
  const [form,        setForm]        = useState({ from:'Kampala', to:'', senderName:'', senderPhone:'', recipientName:'', recipientPhone:'', recipientAddress:'' })
  const [addons,      setAddons]      = useState({ pickupRider:false, insure:false })
  const [trackId,     setTrackId]     = useState('')
  const [insureModal, setInsureModal] = useState(false)
  const [insureForm,  setInsureForm]  = useState({ value:'', description:'' })
  const [booked,      setBooked]      = useState(false)
  const [bookingRef,  setBookingRef]  = useState('')

  const selected = PARCEL_TYPES.find(p => p.id === parcelType)
  const insureCost = Math.round((parseFloat(insureForm.value) || selected?.price || 0) * 0.03)

  const calcTotal = () => {
    let total = selected?.price || 0
    if (addons.pickupRider) total += 5000
    if (addons.insure) total += insureCost
    return total
  }

  const set = (k, v) => setForm(f => ({...f, [k]:v}))

  const handleBook = () => {
    if (!parcelType) { toast('Please select a parcel type', 'warning'); return }
    if (!form.to) { toast('Please select destination', 'warning'); return }
    if (!form.senderPhone) { toast('Enter sender phone number', 'warning'); return }
    if (!form.recipientPhone) { toast('Enter recipient phone number', 'warning'); return }
    const ref = 'PKL-' + Date.now().toString().slice(-6)
    setBookingRef(ref)
    setBooked(true)
    toast('Parcel booked! Track ID: ' + ref, 'success')
  }

  const TABS = [
    { id:'send',    label:'Send Parcel' },
    { id:'track',   label:'Track Parcel' },
    { id:'history', label:'My Parcels' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#0B3D91,#1a52b3)', padding:'36px 0 28px' }}>
        <div className="container">
          <div style={{ ...P, fontWeight:800, fontSize:28, color:'#fff', marginBottom:6 }}>Parcel Delivery</div>
          <div style={{ fontSize:15, color:'rgba(255,255,255,.75)', ...I }}>
            Send envelopes to heavy cargo across Uganda. GPS-tracked, insured, same-day dispatch.
          </div>
          {/* Tab bar */}
          <div style={{ display:'flex', gap:4, marginTop:20, background:'rgba(255,255,255,.1)', borderRadius:14, padding:4, width:'fit-content' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ padding:'9px 20px', borderRadius:11, ...P, fontWeight:700, fontSize:13,
                  background: activeTab===t.id ? '#fff' : 'none',
                  color: activeTab===t.id ? '#0B3D91' : 'rgba(255,255,255,.8)',
                  border:'none', cursor:'pointer', transition:'all .2s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 16px 80px' }}>

        {/* SEND PARCEL */}
        {activeTab === 'send' && (
          booked ? (
            /* Booking confirmation */
            <div style={{ maxWidth:500, margin:'0 auto', background:'#fff', borderRadius:20, padding:32, boxShadow:'0 4px 24px rgba(0,0,0,.08)', textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <svg width="30" height="30" fill="none" stroke="#15803d" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h2 style={{ ...P, fontWeight:800, fontSize:24, marginBottom:8 }}>Parcel Booked!</h2>
              <p style={{ color:'#64748b', ...I, marginBottom:20, lineHeight:1.7 }}>
                Your parcel will be collected and dispatched on the next available bus to {form.to}.
                Track your parcel using the reference below.
              </p>
              <div style={{ background:'#F5F7FA', borderRadius:14, padding:'16px 24px', marginBottom:20 }}>
                <div style={{ fontSize:10, ...P, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:6 }}>Tracking Reference</div>
                <div style={{ ...P, fontWeight:800, fontSize:24, color:'#0B3D91' }}>{bookingRef}</div>
              </div>
              <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:20, lineHeight:1.75, textAlign:'left' }}>
                <div style={{ marginBottom:4 }}>Recipient: <strong style={{ color:'#0F1923' }}>{form.recipientName || 'Recipient'}</strong> ({form.recipientPhone})</div>
                <div style={{ marginBottom:4 }}>Route: <strong style={{ color:'#0F1923' }}>{form.from} to {form.to}</strong></div>
                <div>Type: <strong style={{ color:'#0F1923' }}>{selected?.name}</strong> -- UGX {calcTotal().toLocaleString()}</div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => { setBooked(false); setParcelType(''); setForm({ from:'Kampala', to:'', senderName:'', senderPhone:'', recipientName:'', recipientPhone:'', recipientAddress:'' }) }}
                  style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', ...P, fontWeight:700, fontSize:14, cursor:'pointer' }}>
                  Send Another
                </button>
                <button onClick={() => { setActiveTab('track'); setTrackId(bookingRef) }}
                  style={{ flex:1, padding:'12px', borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                  Track Parcel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:24, alignItems:'start' }}>

              {/* Left: Form */}
              <div>
                {/* Step 1: Parcel type */}
                <div style={{ background:'#fff', borderRadius:18, padding:22, marginBottom:14, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
                  <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:16 }}>1. Select Parcel Type</div>
                  <div className="parcel-types" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {PARCEL_TYPES.map(p => (
                      <button key={p.id} onClick={() => setParcelType(p.id)}
                        style={{ borderRadius:16, padding:'16px 14px', cursor:'pointer', textAlign:'left',
                          border:`2px solid ${parcelType===p.id ? p.textColor : '#E2E8F0'}`,
                          background: parcelType===p.id ? p.color : '#fff',
                          transition:'all .22s', boxShadow: parcelType===p.id ? `0 4px 16px ${p.textColor}22` : '0 1px 4px rgba(0,0,0,.05)' }}>
                        <div style={{ marginBottom:10 }}><p.Icon/></div>
                        <div style={{ ...P, fontWeight:700, fontSize:14, color:'#0F1923', marginBottom:3 }}>{p.name}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I, marginBottom:8 }}>{p.desc}</div>
                        <div style={{ ...P, fontWeight:800, fontSize:16, color:p.textColor }}>UGX {p.price.toLocaleString()}</div>
                        <div style={{ fontSize:11, color:'#94a3b8', ...I }}>Max {p.maxWeight}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Route */}
                <div style={{ background:'#fff', borderRadius:18, padding:22, marginBottom:14, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
                  <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:16 }}>2. Route</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={lS}>From</label>
                      <select value={form.from} onChange={e => set('from', e.target.value)} style={iS}>
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lS}>To *</label>
                      <select value={form.to} onChange={e => set('to', e.target.value)} style={iS}>
                        <option value="">Select city...</option>
                        {CITIES.filter(c => c !== form.from).map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 3: Sender and Recipient */}
                <div style={{ background:'#fff', borderRadius:18, padding:22, marginBottom:14, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
                  <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:16 }}>3. Sender and Recipient</div>
                  <div style={{ ...P, fontWeight:600, fontSize:12, color:'#64748b', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Sender</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                    <div>
                      <label style={lS}>Your Name</label>
                      <input value={form.senderName} onChange={e => set('senderName', e.target.value)} placeholder="Full name" style={iS}/>
                    </div>
                    <div>
                      <label style={lS}>Your Phone *</label>
                      <input type="tel" value={form.senderPhone} onChange={e => set('senderPhone', e.target.value)} placeholder="0771 xxx xxx" style={iS}/>
                    </div>
                  </div>
                  <div style={{ ...P, fontWeight:600, fontSize:12, color:'#64748b', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Recipient</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={lS}>Recipient Name *</label>
                      <input value={form.recipientName} onChange={e => set('recipientName', e.target.value)} placeholder="Full name" style={iS}/>
                    </div>
                    <div>
                      <label style={lS}>Recipient Phone *</label>
                      <input type="tel" value={form.recipientPhone} onChange={e => set('recipientPhone', e.target.value)} placeholder="0700 xxx xxx" style={iS}/>
                    </div>
                    <div style={{ gridColumn:'1/-1' }}>
                      <label style={lS}>Pickup Address / Instructions</label>
                      <input value={form.recipientAddress} onChange={e => set('recipientAddress', e.target.value)} placeholder="e.g. Gulu Main Street, near Total station" style={iS}/>
                    </div>
                  </div>
                </div>

                {/* Step 4: Add-ons */}
                <div style={{ background:'#fff', borderRadius:18, padding:22, marginBottom:14, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
                  <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:16 }}>4. Add-ons</div>
                  {[
                    { key:'pickupRider', Icon:BusIcon, label:'Pickup Rider', price:5000, desc:'We come collect from your location' },
                    { key:'insure', Icon:ShieldIcon, label:'Insurance', price:insureCost, desc: addons.insure && insureForm.description ? 'Covered: ' + insureForm.description.slice(0,30) : 'Declare value and describe contents', specialClick:() => setInsureModal(true) },
                  ].map(addon => (
                    <div key={addon.key} onClick={() => { if(addon.specialClick && !addons[addon.key]) { addon.specialClick(); } else { setAddons(a => ({...a, [addon.key]:!a[addon.key]})) } }}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 14px', borderRadius:14, cursor:'pointer',
                        border:`1.5px solid ${addons[addon.key]?'#0B3D91':'#E2E8F0'}`,
                        background: addons[addon.key]?'#eff6ff':'#fff', marginBottom:10, transition:'all .2s' }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:addons[addon.key]?'#0B3D91':'#F5F7FA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s', color:addons[addon.key]?'#fff':'#64748b' }}>
                        <addon.Icon/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:14 }}>{addon.label}</div>
                        <div style={{ fontSize:12, color:'#64748b', ...I }}>{addon.desc}</div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ ...P, fontWeight:800, fontSize:14, color:addons[addon.key]?'#0B3D91':'#64748b' }}>+UGX {addon.price.toLocaleString()}</div>
                        <div style={{ width:22, height:22, borderRadius:'50%', background:addons[addon.key]?'#0B3D91':'#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:'auto', marginTop:4, color:'#fff' }}>
                          {addons[addon.key] && <CheckIcon/>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Summary */}
              <div style={{ position:'sticky', top:'calc(var(--nav-h) + 20px)' }}>
                <div style={{ background:'#fff', borderRadius:18, padding:22, boxShadow:'0 4px 20px rgba(0,0,0,.08)', marginBottom:14 }}>
                  <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:16 }}>Order Summary</div>
                  {selected ? (
                    <>
                      <div style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 0', borderBottom:'1px solid #F1F5F9', marginBottom:8 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:selected.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <selected.Icon/>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ ...P, fontWeight:700, fontSize:14 }}>{selected.name}</div>
                          <div style={{ fontSize:12, color:'#64748b', ...I }}>Max {selected.maxWeight}</div>
                        </div>
                        <div style={{ ...P, fontWeight:700, fontSize:14, color:'#0B3D91' }}>UGX {selected.price.toLocaleString()}</div>
                      </div>
                      {form.from && form.to && (
                        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:13, ...I, color:'#64748b', borderBottom:'1px solid #F1F5F9' }}>
                          <span>Route</span>
                          <span style={{ ...P, fontWeight:600, color:'#0F1923' }}>{form.from} to {form.to}</span>
                        </div>
                      )}
                      {addons.pickupRider && (
                        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:13, ...I, borderBottom:'1px solid #F1F5F9' }}>
                          <span>Pickup Rider</span><span style={{ ...P, fontWeight:600 }}>UGX 5,000</span>
                        </div>
                      )}
                      {addons.insure && (
                        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:13, ...I, borderBottom:'1px solid #F1F5F9' }}>
                          <span>Insurance (3%)</span><span style={{ ...P, fontWeight:600 }}>UGX {insureCost.toLocaleString()}</span>
                        </div>
                      )}
                      <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 0', ...P, fontWeight:800, fontSize:20, color:'#0B3D91' }}>
                        <span>Total</span><span>UGX {calcTotal().toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign:'center', padding:'24px 0', color:'#94a3b8', fontSize:13, ...I }}>
                      Select a parcel type to see pricing
                    </div>
                  )}
                </div>

                {/* Estimated delivery */}
                {form.to && (
                  <div style={{ background:'#eff6ff', borderRadius:16, padding:16, marginBottom:14, border:'1.5px solid #bfdbfe' }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13, color:'#1d4ed8', marginBottom:8 }}>Estimated Delivery</div>
                    <div style={{ fontSize:13, ...I, color:'#1e3a8a', lineHeight:1.75 }}>
                      <div style={{ marginBottom:2 }}>Same day if dropped by 10 AM</div>
                      <div style={{ marginBottom:2 }}>Next morning if dropped after 10 AM</div>
                      <div>Route: {form.from} to {form.to}</div>
                    </div>
                  </div>
                )}

                <button onClick={handleBook}
                  style={{ width:'100%', padding:16, borderRadius:14, background:'#FFC72C', color:'#0B3D91', ...P, fontWeight:800, fontSize:16, border:'none', cursor:'pointer', boxShadow:'0 4px 18px rgba(255,199,44,.4)' }}>
                  {selected ? 'Book and Pay UGX ' + calcTotal().toLocaleString() : 'Select a parcel type first'}
                </button>
                <p style={{ textAlign:'center', fontSize:11, color:'#94a3b8', ...I, marginTop:8 }}>
                  Pay via MTN MoMo, Airtel Money, or Visa card
                </p>
              </div>
            </div>
          )
        )}

        {/* TRACK PARCEL */}
        {activeTab === 'track' && (
          <div style={{ maxWidth:540, margin:'0 auto' }}>
            <div style={{ background:'#fff', borderRadius:18, padding:22, boxShadow:'0 2px 12px rgba(0,0,0,.06)', marginBottom:16 }}>
              <div style={{ ...P, fontWeight:700, fontSize:16, marginBottom:14 }}>Track Your Parcel</div>
              <div style={{ display:'flex', gap:10 }}>
                <input value={trackId} onChange={e => setTrackId(e.target.value)}
                  placeholder="Enter tracking ID  e.g. PKL-240501"
                  style={{ ...iS, flex:1 }}/>
                <button onClick={() => { if (!trackId.trim()) { toast('Enter a tracking ID', 'warning'); return }; toast('Tracking parcel ' + trackId, 'success') }}
                  style={{ padding:'11px 20px', borderRadius:10, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer', flexShrink:0 }}>
                  Track
                </button>
              </div>
            </div>

            {/* Demo tracking result */}
            {(trackId === 'PKL-240501' || trackId.startsWith('PKL-')) && trackId.length > 6 && (
              <div style={{ background:'#fff', borderRadius:18, padding:22, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                  <div>
                    <div style={{ ...P, fontWeight:800, fontSize:18, marginBottom:4 }}>{trackId}</div>
                    <div style={{ fontSize:13, color:'#64748b', ...I }}>Small Parcel -- Kampala to Gulu</div>
                  </div>
                  <div style={{ background:'#fef9c3', color:'#92400e', padding:'6px 14px', borderRadius:20, ...P, fontWeight:700, fontSize:13 }}>In Transit</div>
                </div>

                <div style={{ position:'relative', paddingLeft:32 }}>
                  <div style={{ position:'absolute', left:12, top:8, bottom:8, width:2, background:'#E2E8F0' }}/>
                  {TRACK_EVENTS.map((ev, i) => (
                    <div key={i} style={{ position:'relative', marginBottom: i < TRACK_EVENTS.length-1 ? 20 : 0 }}>
                      <div style={{ position:'absolute', left:-32, width:22, height:22, borderRadius:'50%',
                        background: ev.done ? '#0B3D91' : ev.active ? '#FFC72C' : '#E2E8F0',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow: ev.active ? '0 0 0 4px rgba(255,199,44,0.3)' : '',
                        color: ev.done||ev.active ? '#fff' : '#94a3b8', top:0 }}>
                        <ev.Icon/>
                      </div>
                      <div style={{ paddingLeft:4 }}>
                        <div style={{ ...P, fontWeight:700, fontSize:14, color: ev.active ? '#FFC72C' : ev.done ? '#0F1923' : '#94a3b8' }}>{ev.label}</div>
                        <div style={{ fontSize:12, ...I, color:'#64748b' }}>{ev.detail}</div>
                        <div style={{ fontSize:11, color:'#94a3b8', ...I, marginTop:2 }}>{ev.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid #E2E8F0', display:'flex', gap:10 }}>
                  <button onClick={() => toast('Tracking link copied!', 'success')}
                    style={{ flex:1, padding:'10px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', ...P, fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                    <ShareIcon/> Share Tracking
                  </button>
                  <button onClick={() => toast('Driver contacted via SMS', 'success')}
                    style={{ flex:1, padding:'10px', borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>
                    Contact Driver
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MY PARCELS (History) */}
        {activeTab === 'history' && (
          <div style={{ maxWidth:580, margin:'0 auto' }}>
            {[
              { id:'PKL-240501', from:'Kampala', to:'Gulu',   type:'Small Parcel',    amount:12000, status:'In Transit', date:'Today 9:00 AM' },
              { id:'PKL-240498', from:'Kampala', to:'Mbale',  type:'Envelope',        amount:5000,  status:'Delivered',  date:'Yesterday' },
              { id:'PKL-240491', from:'Mbale',   to:'Kampala',type:'Large Parcel',    amount:20000, status:'Delivered',  date:'3 days ago' },
            ].map((p, i) => (
              <div key={p.id} style={{ background:'#fff', borderRadius:18, padding:18, marginBottom:12, boxShadow:'0 2px 10px rgba(0,0,0,.06)', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background: p.status==='In Transit' ? '#fef9c3' : '#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {p.status === 'In Transit' ? <BusIcon/> : <CheckIcon/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:2 }}>{p.from} to {p.to}</div>
                  <div style={{ fontSize:12, color:'#64748b', ...I }}>{p.id} -- {p.type} -- {p.date}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ ...P, fontWeight:700, fontSize:14, color:'#0B3D91' }}>UGX {p.amount.toLocaleString()}</div>
                  <div style={{ fontSize:11, ...P, fontWeight:600, color: p.status==='In Transit' ? '#92400e' : '#15803d' }}>{p.status}</div>
                </div>
                <button onClick={() => { setTrackId(p.id); setActiveTab('track') }}
                  style={{ padding:'6px 14px', borderRadius:10, background:'#eff6ff', color:'#1d4ed8', border:'none', cursor:'pointer', ...P, fontWeight:700, fontSize:12, flexShrink:0 }}>
                  Track
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insurance Modal */}
      {insureModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setInsureModal(false)}>
          <div className="modal" style={{ maxWidth:440 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ ...P, fontWeight:800, fontSize:20 }}>Parcel Insurance</h3>
              <button onClick={() => setInsureModal(false)} style={{ width:32, height:32, borderRadius:8, background:'#F5F7FA', border:'none', cursor:'pointer', fontSize:18 }}>x</button>
            </div>
            <div style={{ background:'#eff6ff', borderRadius:12, padding:'12px 14px', marginBottom:16, fontSize:13, ...I, color:'#1d4ed8', lineHeight:1.65 }}>
              Insurance covers loss, damage, or theft during transit. Cost is 3% of declared value. Claims processed within 5 business days.
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={lS}>Declared Value (UGX) *</label>
              <input type="number" value={insureForm.value} onChange={e => setInsureForm({...insureForm, value:e.target.value})}
                placeholder="e.g. 500000" style={iS}/>
              {insureForm.value && <div style={{ marginTop:6, fontSize:12, ...P, fontWeight:600, color:'#0B3D91' }}>Insurance cost: UGX {Math.round((parseFloat(insureForm.value)||0)*0.03).toLocaleString()}</div>}
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lS}>Describe Contents *</label>
              <textarea rows={3} value={insureForm.description} onChange={e => setInsureForm({...insureForm, description:e.target.value})}
                placeholder="Describe exactly what is in the parcel (e.g. Samsung Galaxy A52 smartphone, black)..."
                style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setInsureModal(false)} style={{ padding:'12px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', ...P, fontWeight:700, fontSize:14, cursor:'pointer' }}>Cancel</button>
              <button onClick={() => {
                if (!insureForm.value || !insureForm.description) { toast('Fill both fields', 'warning'); return }
                setAddons(a => ({...a, insure:true}))
                setInsureModal(false)
                toast('Insurance added', 'success')
              }} style={{ padding:'12px', borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                Add Insurance
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer/>
      <style>{`@media(max-width:768px){.parcel-types{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}
