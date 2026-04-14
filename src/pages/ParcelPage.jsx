import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import { PaymentModule, PaymentSuccess, Card, Btn, Banner, Pill, SectionHead, ProgressBar } from '../components/ui/SharedComponents'
import Footer from '../components/layout/Footer'
import { ParcelIcon } from '../components/ui/Icons'

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']

const PARCEL_TYPES = [
  { id:'envelope', icon:'doc', name:'Envelope / Documents', price:5000,  maxWeight:'0.5 kg', desc:'Letters, IDs, certificates, contracts', color:'#dbeafe', textColor:'#1d4ed8' },
  { id:'small',    icon:'box', name:'Small Parcel',          price:12000, maxWeight:'2 kg',   desc:'Clothes, books, small electronics',  color:'#dcfce7', textColor:'#15803d' },
  { id:'large',    icon:'[GIFT]', name:'Large Parcel',          price:20000, maxWeight:'10 kg',  desc:'Household items, medium packages',   color:'#fef9c3', textColor:'#92400e' },
  { id:'cargo',    icon:'??', name:'Heavy Cargo',           price:30000, maxWeight:'50 kg+', desc:'Large goods, commercial freight',    color:'#fee2e2', textColor:'#dc2626' },
]

const SAMPLE_TRACKING = {
  id: 'PCL-240512-GUL-00991',
  type: 'Small Parcel . 2 kg',
  from: 'Kampala', to: 'Gulu',
  operator: 'Global Coaches . UBF 234K',
  estimatedDelivery: '2:00 PM Today',
  events: [
    { icon:'?', label:'Picked Up',   detail:'Global Office, Kampala',       time:'8:00 AM',   done:true, active:false },
    { icon:'ok', label:'Verified',    detail:'Parcel weighed & labeled',      time:'8:30 AM',   done:true, active:false },
    { icon:'bus', label:'On Board',    detail:'UBF 234K -- Enroute to Gulu',   time:'9:00 AM',   done:true, active:true  },
    { icon:'[PIN]', label:'In Transit',  detail:'Karuma Checkpoint, passing',    time:'11:24 AM',  done:false, active:false },
    { icon:'?', label:'Delivered',   detail:'Gulu Office, Gate 2',          time:'Expected 2:00 PM', done:false, active:false },
  ]
}

const inputStyle = {
  width:'100%', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'11px 12px',
  fontSize:14, fontFamily:"'Poppins',sans-serif", fontWeight:500,
  boxSizing:'border-box', WebkitAppearance:'none', outline:'none'
}
const labelStyle = {
  display:'block', fontSize:10, fontWeight:700, color:'#64748b',
  fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1.5, marginBottom:5
}

export default function ParcelPage() {
  const [params] = useSearchParams()
  const [tab, setTab]           = useState(params.get('tab') || 'send')
  const [parcelType, setParcelType] = useState(null)
  const [step, setStep]         = useState('form')   // form | payment | success
  const [trackId, setTrackId]   = useState('')
  const [tracking, setTracking] = useState(null)
  const [trackError, setTrackError] = useState('')
  const [bookingRef]            = useState(`PCL-${Date.now().toString().slice(-6)}-KLA-${Math.floor(Math.random()*90000+10000)}`)
  const [form, setForm]         = useState({ from:'Kampala', to:'Gulu', senderPhone:'', recipientPhone:'', recipientName:'', notes:'', insure:false, pickupRider:false })
  const [errors, setErrors]     = useState({})
  const [insureModal, setInsureModal] = useState(false)
  const [insureForm, setInsureForm]   = useState({ value:'', description:'', acceptTerms:false })
  const toast = useToast()
  const navigate = useNavigate()

  const selected = PARCEL_TYPES.find(p => p.id === parcelType)

  const calcTotal = () => {
    if (!selected) return 0
    let t = selected.price
    if (form.insure)       t += Math.round(t * 0.03)
    if (form.pickupRider)  t += 5000
    return t
  }

  const validate = () => {
    const e = {}
    if (!parcelType)         e.type = 'Please select a parcel type'
    if (!form.senderPhone || form.senderPhone.length < 10) e.senderPhone = 'Enter valid sender phone'
    if (!form.recipientPhone || form.recipientPhone.length < 10) e.recipientPhone = 'Enter valid recipient phone'
    if (!form.to || form.to === form.from) e.to = 'Destination must differ from origin'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleBook = () => {
    if (!validate()) { toast('Please fix the form errors', 'warning'); return }
    setStep('payment')
  }

  const handleTrack = () => {
    setTrackError('')
    if (!trackId.trim()) { setTrackError('Enter a parcel tracking ID'); return }
    if (trackId.trim().toUpperCase() === SAMPLE_TRACKING.id || trackId.trim().length > 5) {
      setTracking(SAMPLE_TRACKING)
    } else {
      setTrackError('Parcel not found. Check the ID and try again.')
    }
  }

  const TABS = [
    { id:'send',   label:'box Send Parcel' },
    { id:'track',  label:'[SEARCH] Track Parcel' },
    { id:'history',label:'? My Parcels' },
  ]

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--gray-light)', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--blue),#1a52b3)', padding:'32px 0 28px' }}>
        <div className="container">
          <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.65)', cursor:'pointer', fontSize:13, fontFamily:"'Poppins',sans-serif", marginBottom:10, display:'flex', alignItems:'center', gap:6 }}> Back
          </button>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:'clamp(1.5rem,3vw,2.2rem)', color:'var(--white)', marginBottom:6 }}>
            Parcel <span style={{ color:'var(--gold)' }}>Services</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.78)', fontSize:14, marginBottom:22 }}>Send anything across Uganda -- real-time tracking on every parcel</p>
          {/* Tabs */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setStep('form') }} style={{ padding:'9px 20px', borderRadius:20, background:tab===t.id?'var(--gold)':'rgba(255,255,255,0.12)', color:tab===t.id?'var(--blue)':'var(--white)', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, border:'none', cursor:'pointer', transition:'all .2s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 16px 100px' }}>

        {/* -- SEND TAB -- */}
        {tab === 'send' && step === 'form' && (
          <div className='parcel-send-grid' style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:24, alignItems:'start' }}>

            {/* Left: Parcel type selector */}
            <div>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:16, marginBottom:16 }}>Select Parcel Type</h3>
              {errors.type && <div style={{ color:'#dc2626', fontSize:12, marginBottom:10, fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>!? {errors.type}</div>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                {PARCEL_TYPES.map(p => (
                  <div key={p.id} onClick={() => { setParcelType(p.id); setErrors(e => ({...e, type:''})) }}
                    style={{ borderRadius:16, padding:18, cursor:'pointer', border:`2px solid ${parcelType===p.id?p.textColor:'var(--gray-mid)'}`, background:parcelType===p.id?p.color:'var(--white)', transition:'all .22s', boxShadow:parcelType===p.id?`0 4px 16px ${p.textColor}22`:'var(--shadow-sm)' }}>
                    <div style={{ fontSize:28, marginBottom:10 }}>{p.icon}</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, marginBottom:4, color:parcelType===p.id?p.textColor:'var(--dark)' }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'var(--gray-text)', marginBottom:10 }}>{p.desc}</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:15, color:parcelType===p.id?p.textColor:'var(--blue)' }}>
                      UGX {p.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize:10, color:'var(--gray-text)', marginTop:2 }}>Max {p.maxWeight}</div>
                  </div>
                ))}
              </div>

              {/* Add-ons */}
              {parcelType && (
                <Card style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, marginBottom:12, color:'var(--gray-text)', textTransform:'uppercase', letterSpacing:1 }}>Optional Add-ons</div>
                  {[
                    { key:'pickupRider', icon:'?', label:'Pickup Rider', price:5000, desc:'We come collect from your location' },
                    { key:'insure', icon:'[SHIELD]?', label:'Insurance (3% of declared value)', price:Math.round((parseFloat(insureForm.value)||selected?.price||0)*0.03), desc:insureForm.description?'ok Covered: '+insureForm.description.slice(0,28):'Declare value & describe contents', specialClick:()=>setInsureModal(true) },
                  ].map(addon => (
                    <div key={addon.key} onClick={() => setForm(f => ({...f, [addon.key]:!f[addon.key]}))}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid var(--gray-mid)', cursor:'pointer' }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:form[addon.key]?'var(--blue)':'var(--gray-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, transition:'all .2s' }}>{addon.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:form[addon.key]?'var(--blue)':'var(--dark)' }}>{addon.label}</div>
                        <div style={{ fontSize:11, color:'var(--gray-text)' }}>{addon.desc}</div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, color:form[addon.key]?'var(--blue)':'var(--gray-text)' }}>+ UGX {addon.price.toLocaleString()}</div>
                        <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${form[addon.key]?'var(--blue)':'var(--gray-mid)'}`, background:form[addon.key]?'var(--blue)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:'auto', marginTop:3, fontSize:11, color:'white', transition:'all .2s' }}>{form[addon.key]?'?':''}</div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {/* Price summary */}
              {parcelType && (
                <Card style={{ background:'var(--blue)', color:'var(--white)' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                      <span style={{ opacity:.8 }}>{selected?.name}</span>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>UGX {selected?.price.toLocaleString()}</span>
                    </div>
                    {form.pickupRider && <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}><span style={{ opacity:.8 }}>Pickup Rider</span><span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>+ UGX 5,000</span></div>}
                    {form.insure && <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}><span style={{ opacity:.8 }}>Insurance (3%)</span><span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>+ UGX {Math.round((selected?.price||0)*0.03).toLocaleString()}</span></div>}
                    <div style={{ borderTop:'1px solid rgba(255,255,255,0.2)', paddingTop:8, display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>Total</span>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:20, color:'var(--gold)' }}>UGX {calcTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right: Details form */}
            <Card>
              <SectionHead title="Parcel Details"/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div>
                  <label style={labelStyle}>From City</label>
                  <select value={form.from} onChange={e=>setForm({...form,from:e.target.value})} style={inputStyle}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>To City</label>
                  <select value={form.to} onChange={e=>setForm({...form,to:e.target.value})} style={{ ...inputStyle, borderColor:errors.to?'#dc2626':undefined }}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                  {errors.to && <div style={{ color:'#dc2626', fontSize:11, marginTop:4 }}>{errors.to}</div>}
                </div>
              </div>

              {[
                { label:"Sender's Phone *",    key:'senderPhone',    ph:'0771 000 000',   err:errors.senderPhone },
                { label:"Recipient's Name",    key:'recipientName',  ph:'John Doe',       err:null },
                { label:"Recipient's Phone *", key:'recipientPhone', ph:'0700 000 000',   err:errors.recipientPhone },
              ].map(f => (
                <div key={f.key} style={{ marginBottom:14 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input placeholder={f.ph} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    style={{ ...inputStyle, borderColor:f.err?'#dc2626':undefined }}/>
                  {f.err && <div style={{ color:'#dc2626', fontSize:11, marginTop:4 }}>{f.err}</div>}
                </div>
              ))}

              <div style={{ marginBottom:20 }}>
                <label style={labelStyle}>Special Instructions (optional)</label>
                <textarea rows={2} placeholder="Fragile, keep upright, urgent..." value={form.notes}
                  onChange={e=>setForm({...form,notes:e.target.value})}
                  style={{ ...inputStyle, resize:'none', lineHeight:1.6 }}/>
              </div>

              <Banner type="info">
                Track your parcel in real-time once booked. The recipient gets an SMS notification when the parcel is picked up and delivered.
              </Banner>

              <Btn variant="gold" full size="lg" onClick={handleBook} icon="box">
                {parcelType ? `Book & Pay UGX ${calcTotal().toLocaleString()}` : 'Select a parcel type first'}
              </Btn>
            </Card>
          </div>
        )}

        {/* -- PAYMENT STEP -- */}
        {tab === 'send' && step === 'payment' && (
          <PaymentModule
            amount={calcTotal()}
            bookingRef={bookingRef}
            context="parcel"
            onBack={() => setStep('form')}
            onSuccess={() => setStep('success')}
          />
        )}

        {/* -- SUCCESS STEP -- */}
        {tab === 'send' && step === 'success' && (
          <PaymentSuccess
            amount={calcTotal()}
            phone={form.senderPhone}
            bookingRef={bookingRef}
            onDone={() => { setStep('form'); setParcelType(null); setTab('track') }}
          />
        )}

        {/* -- TRACK TAB -- */}
        {tab === 'track' && (
          <div style={{ maxWidth:560, margin:'0 auto' }}>
            <Card style={{ marginBottom:20 }}>
              <SectionHead title="[SEARCH] Track Your Parcel"/>
              <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                <input value={trackId} onChange={e=>setTrackId(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleTrack()}
                  placeholder="Enter Parcel ID (e.g. PCL-240512-GUL-00991)"
                  style={{ ...inputStyle, flex:1, borderColor:trackError?'#dc2626':undefined }}/>
                <Btn variant="blue" onClick={handleTrack}>Track</Btn>
              </div>
              {trackError && <div style={{ color:'#dc2626', fontSize:13, fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>!? {trackError}</div>}
              <button onClick={() => { setTrackId(SAMPLE_TRACKING.id); setTracking(SAMPLE_TRACKING) }}
                style={{ background:'none', border:'none', color:'var(--blue)', fontSize:12, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:600, marginTop:8 }}>
                Try demo: {SAMPLE_TRACKING.id}
              </button>
            </Card>

            {tracking && (
              <Card>
                {/* Header */}
                <div style={{ background:'var(--blue)', margin:-20, padding:'18px 20px', borderRadius:'16px 16px 0 0', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, color:'var(--white)', marginBottom:3 }}>{tracking.id}</div>
                    <div style={{ fontSize:12, color:'var(--gold)' }}>{tracking.type}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:3 }}>{tracking.from} to {tracking.to}</div>
                  </div>
                  <Pill status="new" text="bus In Transit" color="#FFC72C" bg="rgba(255,199,44,0.2)"/>
                </div>

                {/* Map placeholder */}
                <div style={{ height:160, background:'linear-gradient(135deg,#e8f4fd,#dbeafe)', borderRadius:12, border:'2px solid #bfdbfe', position:'relative', overflow:'hidden', marginBottom:20 }}>
                  <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(11,61,145,0.05) 22px,rgba(11,61,145,0.05) 23px),repeating-linear-gradient(90deg,transparent,transparent 22px,rgba(11,61,145,0.05) 22px,rgba(11,61,145,0.05) 23px)' }}/>
                  {/* Animated route line */}
                  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 300 160">
                    <path d="M40 130 Q150 30 260 80" stroke="#0B3D91" strokeWidth="2.5" fill="none" strokeDasharray="6,4" opacity="0.4"/>
                    <circle cx="40" cy="130" r="6" fill="#22c55e" stroke="white" strokeWidth="2"/>
                    <circle cx="260" cy="80" r="6" fill="#ef4444" stroke="white" strokeWidth="2"/>
                    {/* Moving dot */}
                    <circle cx="160" cy="62" r="8" fill="var(--gold)" stroke="white" strokeWidth="2.5">
                      <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  <div style={{ position:'absolute', bottom:10, left:14, fontSize:11, fontFamily:"'Poppins',sans-serif", fontWeight:700, color:'#1d4ed8' }}>{tracking.from}</div>
                  <div style={{ position:'absolute', bottom:10, right:14, fontSize:11, fontFamily:"'Poppins',sans-serif", fontWeight:700, color:'#dc2626' }}>{tracking.to}</div>
                  <div style={{ position:'absolute', top:10, right:14, fontSize:11, color:'var(--gray-text)' }}>Last update: 11:24 AM</div>
                </div>

                {/* Operator */}
                <div style={{ background:'var(--gray-light)', borderRadius:12, padding:'12px 14px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                  <div>
                    <div style={{ fontSize:11, color:'var(--gray-text)', marginBottom:2 }}>On board</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13 }}>{tracking.operator}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:'var(--gray-text)', marginBottom:2 }}>Estimated delivery</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, color:'var(--blue)' }}>{tracking.estimatedDelivery}</div>
                  </div>
                </div>

                {/* Timeline */}
                <SectionHead title="Tracking Timeline"/>
                {tracking.events.map((ev, i) => (
                  <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:i<tracking.events.length-1?4:0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:ev.done?'var(--blue)':ev.active?'var(--gold)':'var(--gray-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, boxShadow:ev.active?'0 0 0 4px rgba(255,199,44,0.3)':'' }}>
                        {ev.icon}
                      </div>
                      {i < tracking.events.length-1 && <div style={{ width:2, height:20, background:ev.done?'var(--blue)':'var(--gray-mid)', marginTop:3 }}/>}
                    </div>
                    <div style={{ flex:1, paddingTop:4 }}>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:ev.active?'var(--blue)':ev.done?'var(--dark)':'var(--gray-text)' }}>{ev.label}</div>
                      <div style={{ fontSize:12, color:'var(--gray-text)', marginTop:2 }}>{ev.detail}</div>
                      <div style={{ fontSize:11, color:ev.active?'var(--gold)':'var(--gray-text)', marginTop:2, fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>{ev.time}</div>
                    </div>
                  </div>
                ))}

                <Btn variant="blue" full style={{ marginTop:20 }} onClick={() => {
                  if (navigator.share) navigator.share({ title:'Track Parcel', text:`Track ${tracking.id} on Raylane Express` })
                  else toast('Tracking link copied!', 'success')
                }} icon="?">Share Tracking Link</Btn>
              </Card>
            )}
          </div>
        )}

        {/* -- HISTORY TAB -- */}
        {tab === 'history' && (
          <div style={{ maxWidth:600, margin:'0 auto' }}>
            {[
              { id:'PCL-240512-GUL-00991', type:'Small Parcel', from:'Kampala', to:'Gulu', amount:12000, status:'delivered', date:'12 May 2026' },
              { id:'PCL-240510-MBA-00234', type:'Envelope',     from:'Kampala', to:'Mbale',amount:5000,  status:'in-transit',date:'10 May 2026' },
              { id:'PCL-240508-ARU-00102', type:'Large Parcel', from:'Jinja',   to:'Arua', amount:20000, status:'delivered', date:'8 May 2026' },
            ].map(p => (
              <Card key={p.id} style={{ marginBottom:12 }} hover onClick={() => { setTrackId(p.id); setTab('track'); handleTrack() }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>box</div>
                  <div style={{ flex:1, minWidth:140 }}>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, marginBottom:3 }}>{p.type}</div>
                    <div style={{ fontSize:12, color:'var(--gray-text)' }}>{p.from} to {p.to} . {p.date}</div>
                    <div style={{ fontSize:11, color:'var(--blue)', marginTop:2, fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>{p.id}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, color:'var(--blue)', marginBottom:4 }}>UGX {p.amount.toLocaleString()}</div>
                    <Pill status={p.status} text={p.status==='delivered'?'ok Delivered':'bus In Transit'}/>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />


      {/* Insurance Modal */}
      {insureModal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center' }}
          onClick={e=>{if(e.target===e.currentTarget)setInsureModal(false)}}>
          <div style={{ background:'var(--white)',borderRadius:'20px 20px 0 0',width:'100%',maxWidth:540,padding:24,boxShadow:'0 -8px 40px rgba(0,0,0,0.2)',animation:'slideUp .3s ease',maxHeight:'90vh',overflowY:'auto' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:18,margin:0 }}>[SHIELD]? Parcel Insurance</h3>
              <button onClick={()=>setInsureModal(false)} style={{ width:32,height:32,borderRadius:8,background:'var(--gray-light)',border:'none',cursor:'pointer',fontSize:16 }}>?</button>
            </div>
            <div style={{ background:'#eff6ff',borderRadius:12,padding:'12px 16px',marginBottom:18,fontSize:13,color:'#1d4ed8',fontFamily:"'Poppins',sans-serif",fontWeight:600,border:'1px solid #bfdbfe' }}>
              ?? Insurance costs 3% of your declared item value. Maximum payout equals the declared value.
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block',fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:"'Poppins',sans-serif",textTransform:'uppercase',letterSpacing:1.5,marginBottom:5 }}>Declared Item Value (UGX) *</label>
              <input type="number" placeholder="e.g. 500000" value={insureForm.value} onChange={e=>setInsureForm({...insureForm,value:e.target.value})} style={{ width:'100%',border:'1.5px solid #e2e8f0',borderRadius:10,padding:'11px 12px',fontSize:14,fontFamily:"'Poppins',sans-serif",fontWeight:600,boxSizing:'border-box' }}/>
              {insureForm.value&&<div style={{ fontSize:12,color:'var(--blue)',fontFamily:"'Poppins',sans-serif",fontWeight:700,marginTop:4 }}>Insurance fee: UGX {Math.round(parseFloat(insureForm.value||0)*0.03).toLocaleString()}</div>}
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block',fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:"'Poppins',sans-serif",textTransform:'uppercase',letterSpacing:1.5,marginBottom:5 }}>Description of Contents *</label>
              <textarea rows={3} placeholder="Describe exactly what is in the parcel (e.g. Samsung Galaxy A52 smartphone, black)..." value={insureForm.description} onChange={e=>setInsureForm({...insureForm,description:e.target.value})} style={{ width:'100%',border:'1.5px solid #e2e8f0',borderRadius:10,padding:'11px 12px',fontSize:14,fontFamily:"'Inter',sans-serif",resize:'none',boxSizing:'border-box' }}/>
            </div>
            {/* What we don't insure */}
            <div style={{ background:'#fff3cd',borderRadius:12,padding:14,marginBottom:16,border:'1px solid #f59e0b' }}>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:13,color:'#92400e',marginBottom:8 }}>? Items We Do NOT Transport or Insure</div>
              {['Illegal substances or contraband','Live animals or perishable food without prior arrangement','Explosives, firearms, or dangerous chemicals','Cash, jewellery over UGX 5M, or raw gold','Counterfeit goods or unlicensed items','Human remains (requires special permit)'].map(item=>(
                <div key={item} style={{ display:'flex',gap:8,marginBottom:5,fontSize:12,color:'#92400e',alignItems:'flex-start' }}>
                  <span style={{ flexShrink:0,fontWeight:700 }}>?</span>{item}
                </div>
              ))}
            </div>
            {/* Terms */}
            <div style={{ background:'var(--gray-light)',borderRadius:12,padding:14,marginBottom:16 }}>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:13,marginBottom:8 }}>? Insurance Terms</div>
              <ul style={{ paddingLeft:16,fontSize:12,color:'var(--gray-text)',lineHeight:1.8 }}>
                <li>Insurance covers loss or damage during transit only</li>
                <li>Claims must be reported within 24 hours of delivery</li>
                <li>Payout equals declared value, subject to verification</li>
                <li>Raylane is not liable for items not declared accurately</li>
                <li>Photos of parcel contents may be required for claims</li>
              </ul>
            </div>
            <label style={{ display:'flex',alignItems:'flex-start',gap:10,marginBottom:18,cursor:'pointer' }}>
              <div onClick={()=>setInsureForm(f=>({...f,acceptTerms:!f.acceptTerms}))} style={{ width:20,height:20,borderRadius:5,border:`2px solid ${insureForm.acceptTerms?'var(--blue)':'var(--gray-mid)'}`,background:insureForm.acceptTerms?'var(--blue)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1,transition:'all .2s' }}>
                {insureForm.acceptTerms&&<span style={{ color:'white',fontSize:11,fontWeight:900 }}>?</span>}
              </div>
              <span style={{ fontSize:13,color:'var(--gray-text)',lineHeight:1.6 }}>I confirm the declared value is accurate and I have read and accept the insurance terms above.</span>
            </label>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 2fr',gap:10 }}>
              <button onClick={()=>setInsureModal(false)} style={{ padding:'12px',borderRadius:14,background:'var(--gray-light)',color:'var(--dark)',border:'none',fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer' }}>Cancel</button>
              <button onClick={()=>{
                if(!insureForm.value||!insureForm.description){toast('Please fill all fields','warning');return}
                if(!insureForm.acceptTerms){toast('Please accept the insurance terms','warning');return}
                setForm(f=>({...f,insure:true}))
                setInsureModal(false)
                toast('[SHIELD]? Insurance added to your parcel booking','success')
              }} style={{ padding:'12px',borderRadius:14,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:15,cursor:'pointer' }}>
                Add Insurance -- UGX {Math.round(parseFloat(insureForm.value||0)*0.03).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
            <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @media(max-width:767px){
          .parcel-send-grid { grid-template-columns:1fr !important; }
          .parcel-types { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
