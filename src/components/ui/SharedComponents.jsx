/**
 * RAYLANE EXPRESS -- SHARED COMPONENT LIBRARY
 * Single source of truth for buttons, inputs, modals, seat logic, payment module
 */
import React, { useState, useEffect, useRef } from 'react'

/* ===================================================
   DESIGN TOKENS (mirror CSS vars for JS use)
=================================================== */
export const COLORS = {
  blue: '#0B3D91', blueDark: '#082d6e', blueLight: '#1a52b3',
  gold: '#FFC72C', goldDark: '#e6b020',
  white: '#FFFFFF', grayLight: '#F5F7FA', grayMid: '#E2E8F0',
  grayText: '#64748B', dark: '#1A1A1A',
  success: '#22C55E', danger: '#EF4444', warning: '#F59E0B',
}

/* ===================================================
   BUTTON VARIANTS
=================================================== */
export function Btn({ children, onClick, variant='gold', size='md', full=false, disabled=false, loading=false, icon, style={} }) {
  const base = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:"'Poppins',sans-serif", fontWeight:800, borderRadius:40, border:'none', cursor:disabled||loading?'not-allowed':'pointer', transition:'all .2s', whiteSpace:'nowrap', opacity:disabled?.55:1, ...style }
  const sizes = { sm:{padding:'8px 16px',fontSize:12}, md:{padding:'12px 22px',fontSize:14}, lg:{padding:'15px 32px',fontSize:16}, xl:{padding:'18px 40px',fontSize:18} }
  const variants = {
    gold:    { background:'var(--gold)',       color:'var(--blue)' },
    blue:    { background:'var(--blue)',       color:'var(--white)' },
    outline: { background:'transparent',      color:'var(--blue)',  border:'2px solid var(--blue)' },
    ghost:   { background:'var(--gray-light)', color:'var(--dark)' },
    danger:  { background:'#fee2e2',           color:'#dc2626' },
    success: { background:'#dcfce7',           color:'#15803d' },
    dark:    { background:'var(--dark)',        color:'var(--white)' },
  }
  const combined = { ...base, ...sizes[size], ...variants[variant], width:full?'100%':undefined }
  const hover = { gold:'0 4px 16px rgba(255,199,44,0.45)', blue:'0 4px 16px rgba(11,61,145,0.3)', outline:'none', ghost:'none', danger:'none', success:'none', dark:'none' }

  return (
    <button onClick={!disabled&&!loading ? onClick : undefined} style={combined}
      onMouseEnter={e => { if(!disabled&&!loading){ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow=hover[variant] } }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
      {loading ? <Spinner size={16} color={variant==='gold'?'var(--blue)':'var(--white)'}/> : icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

/* ===================================================
   SPINNER
=================================================== */
export function Spinner({ size=20, color='var(--blue)' }) {
  return (
    <div style={{ width:size, height:size, border:`${size*0.14}px solid rgba(0,0,0,0.12)`, borderTopColor:color, borderRadius:'50%', animation:'spin .7s linear infinite', flexShrink:0 }}/>
  )
}

/* ===================================================
   FORM INPUTS
=================================================== */
export function Input({ label, value, onChange, type='text', placeholder, required, icon, error, hint }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>{label}{required&&<span style={{ color:'#dc2626' }}> *</span>}</label>}
      <div style={{ position:'relative' }}>
        {icon && <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>{icon}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width:'100%', border:`1.5px solid ${error?'#dc2626':focused?'var(--blue)':'var(--gray-mid)'}`, borderRadius:12, padding:`12px ${icon?'12px 12px 12px 38px':'12px'}`, fontSize:14, fontFamily:"'Poppins',sans-serif", fontWeight:600, background:'var(--white)', boxSizing:'border-box', outline:'none', WebkitAppearance:'none', boxShadow:focused?'0 0 0 3px rgba(11,61,145,0.08)':'none', transition:'all .2s' }}/>
      </div>
      {error && <p style={{ color:'#dc2626', fontSize:11, marginTop:4, fontFamily:"'Poppins',sans-serif" }}>{error}</p>}
      {hint && !error && <p style={{ color:'var(--gray-text)', fontSize:11, marginTop:4 }}>{hint}</p>}
    </div>
  )
}

export function Select({ label, value, onChange, options=[], required, placeholder='Select...' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>{label}{required&&<span style={{ color:'#dc2626' }}> *</span>}</label>}
      <select value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:'100%', border:`1.5px solid ${focused?'var(--blue)':'var(--gray-mid)'}`, borderRadius:12, padding:'12px', fontSize:14, fontFamily:"'Poppins',sans-serif", fontWeight:600, background:'var(--white)', boxSizing:'border-box', outline:'none', WebkitAppearance:'none', appearance:'none', boxShadow:focused?'0 0 0 3px rgba(11,61,145,0.08)':'none', transition:'all .2s' }}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  )
}

export function Toggle({ label, checked, onChange, hint }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'12px 0' }}>
      <div>
        <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14 }}>{label}</div>
        {hint && <div style={{ fontSize:12, color:'var(--gray-text)', marginTop:2 }}>{hint}</div>}
      </div>
      <div onClick={onChange} style={{ width:46, height:26, borderRadius:13, background:checked?'var(--blue)':'var(--gray-mid)', position:'relative', cursor:'pointer', transition:'all .25s', flexShrink:0 }}>
        <div style={{ width:22, height:22, borderRadius:'50%', background:'white', position:'absolute', top:2, left:checked?22:2, transition:'all .25s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
      </div>
    </div>
  )
}

/* ===================================================
   CARD
=================================================== */
export function Card({ children, style={}, hover=false, onClick, padding=20 }) {
  return (
    <div onClick={onClick} style={{ background:'var(--white)', borderRadius:16, padding, boxShadow:'var(--shadow-sm)', transition:'all .22s', cursor:onClick?'pointer':undefined, ...style }}
      onMouseEnter={e => { if(hover||onClick){ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}>
      {children}
    </div>
  )
}

/* ===================================================
   PILL / BADGE
=================================================== */
const PILL_PRESETS = {
  approved:  { bg:'#dcfce7', c:'#15803d' }, active: { bg:'#dcfce7', c:'#15803d' },
  pending:   { bg:'#fef9c3', c:'#92400e' }, 'on-leave':{ bg:'#fef9c3', c:'#92400e' },
  rejected:  { bg:'#fee2e2', c:'#dc2626' }, inactive:{ bg:'#fee2e2', c:'#dc2626' },
  confirmed: { bg:'#dcfce7', c:'#15803d' },
  released:  { bg:'#dbeafe', c:'#1d4ed8' },
  'in-transit':{ bg:'#dbeafe', c:'#1d4ed8' },
  repaid:    { bg:'#dbeafe', c:'#1d4ed8' },
  overdue:   { bg:'#fee2e2', c:'#dc2626' },
  new:       { bg:'#dbeafe', c:'#1d4ed8' },
}
export function Pill({ text, status, color, bg }) {
  const preset = PILL_PRESETS[status] || {}
  const c = color || preset.c || '#64748b'
  const b = bg    || preset.bg || '#f1f5f9'
  return <span style={{ background:b, color:c, padding:'3px 10px', borderRadius:20, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:10, whiteSpace:'nowrap', display:'inline-block' }}>{text||status}</span>
}

/* ===================================================
   STAT CARD
=================================================== */
export function StatCard({ icon, label, value, sub, subColor, bg='#dbeafe', color='#1d4ed8' }) {
  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{icon}</div>
        {sub && <span style={{ background:(subColor||color)+'18', color:subColor||color, padding:'2px 9px', borderRadius:20, fontSize:10, fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>{sub}</span>}
      </div>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:20, color }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--gray-text)', marginTop:3 }}>{label}</div>
    </Card>
  )
}

/* ===================================================
   SECTION HEADER
=================================================== */
export function SectionHead({ title, action, onAction, count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, gap:10, flexWrap:'wrap' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15, margin:0 }}>{title}</h3>
        {count!==undefined && <span style={{ background:'var(--blue)', color:'var(--white)', borderRadius:10, padding:'1px 8px', fontSize:10, fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>{count}</span>}
      </div>
      {action && <button onClick={onAction} style={{ padding:'7px 14px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>{action}</button>}
    </div>
  )
}

/* ===================================================
   MINI BAR CHART
=================================================== */
export function BarChart({ data=[], labels=[], height=100, color='var(--blue)', highlightLast=false }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height, padding:'0 2px' }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
          <div title={v} style={{ width:'100%', background: highlightLast&&i===data.length-1?'var(--gold)':color, borderRadius:'4px 4px 0 0', height:`${(v/max)*100}%`, minHeight:4, transition:'height .5s ease', opacity:0.85+(i/(data.length*6)) }}/>
          {labels[i] && <span style={{ fontSize:9, color:'var(--gray-text)', whiteSpace:'nowrap' }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  )
}

/* ===================================================
   PROGRESS BAR
=================================================== */
export function ProgressBar({ value=0, max=100, color='var(--blue)', height=8, label, showPct=false }) {
  const pct = Math.min(100, (value/max)*100)
  const c = pct > 90 ? '#dc2626' : pct > 65 ? 'var(--gold)' : color
  return (
    <div>
      {(label||showPct) && (
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:11, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>
          {label && <span>{label}</span>}
          {showPct && <span style={{ color:c }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height, background:'var(--gray-mid)', borderRadius:height, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:c, borderRadius:height, transition:'width .6s ease' }}/>
      </div>
    </div>
  )
}

/* ===================================================
   SEAT MAP ENGINE -- all types
=================================================== */


function Row({ seats, booked=[], locked=[], selected=[], onToggle, size=30, gap=4 }) {
  return (
    <div style={{ display:'flex', gap, alignItems:'center' }}>
      {seats.map((n, i) => {
        if (n===null) return <div key={`aisle-${i}`} style={{ width:18, flexShrink:0 }}/>
        if (!n)       return <div key={`blank-${i}`} style={{ width:size, height:size+4, flexShrink:0 }}/>
        const state = booked.includes(n)?'booked':locked.includes(n)?'locked':selected.includes(n)?'selected':'available'
        return <SeatCell key={n} n={n} state={state} onToggle={onToggle} size={size}/>
      })}
    </div>
  )
}

function CabUnit({ label, sz }) {
  return (
    <div style={{ width:sz+6, minHeight:sz*2+10, background:'#374151', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <span style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', fontSize:9, fontFamily:"'Poppins',sans-serif", fontWeight:700, color:'#d1d5db', letterSpacing:1 }}>{label}</span>
    </div>
  )
}

/* 55-seater layout matching wireframe */

/* 65-seater */

/* 14-seater taxi */

/* 67-seater */


/* ===================================================
   PAYMENT MODULE -- reusable across booking + parcels
=================================================== */
export function PaymentModule({ amount, onSuccess, onBack, context='booking', bookingRef }) {
  const [method, setMethod] = useState('mtn')
  const [bookPhone, setBookPhone] = useState('')
  const [useDiff, setUseDiff] = useState(false)
  const [payPhone, setPayPhone]  = useState('')
  const [step, setStep] = useState('form') // form | processing | success
  const [progress, setProgress] = useState(0)

  const methods = [
    { id:'mtn',    label:'MTN MoMo',    color:'#ffc300', bg:'#fffbeb', icon:'[PHONE]' },
    { id:'airtel', label:'Airtel Money', color:'#e4002b', bg:'#fff5f5', icon:'[MSG]' },
  ]

  const handlePay = () => {
    if (!bookPhone || bookPhone.length < 10) return alert('Enter a valid phone number (10+ digits)')
    if (useDiff && (!payPhone || payPhone.length < 10)) return alert('Enter the payment phone number')
    setStep('processing')
    let p = 0
    const t = setInterval(() => {
      p += Math.random() * 18
      setProgress(Math.min(p, 95))
      if (p >= 95) { clearInterval(t); setTimeout(() => { setProgress(100); setStep('success') }, 600) }
    }, 200)
  }

  if (step === 'success') return (
    <PaymentSuccess amount={amount} phone={bookPhone} payPhone={useDiff?payPhone:null} bookingRef={bookingRef} onDone={onSuccess}/>
  )

  return (
    <div style={{ background:'var(--white)', borderRadius:20, padding:24, boxShadow:'var(--shadow-lg)', maxWidth:480, margin:'0 auto' }}>
      {/* Amount display */}
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{ fontSize:13, color:'var(--gray-text)', marginBottom:4 }}>Total Amount</div>
        <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:32, color:'var(--blue)' }}>UGX {amount.toLocaleString()}</div>
        {bookingRef && <div style={{ fontSize:11, color:'var(--gray-text)', marginTop:4 }}>Ref: {bookingRef}</div>}
      </div>

      {/* Method selector */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1.5, marginBottom:9 }}>Payment Method</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {methods.map(m => (
            <div key={m.id} onClick={() => setMethod(m.id)} style={{ border:`2px solid ${method===m.id?m.color:'var(--gray-mid)'}`, borderRadius:14, padding:'13px 14px', cursor:'pointer', background:method===m.id?m.bg:'var(--white)', transition:'all .2s', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:14, height:14, borderRadius:'50%', border:`2.5px solid ${m.color}`, background:method===m.id?m.color:'transparent', transition:'all .2s', flexShrink:0 }}/>
              <div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, color:m.color }}>{m.label}</div>
                <div style={{ fontSize:10, color:'var(--gray-text)' }}>{m.id==='mtn'?'0771, 0772, 0700...':'0700, 0701...'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking phone */}
      <Input label={context==='booking'?'Your Phone (Booking Reference)':'Contact Phone'} value={bookPhone} onChange={e=>setBookPhone(e.target.value)} type="tel" placeholder={method==='mtn'?'0771 000 000':'0700 000 000'} required icon="[CALL]" hint="Ticket/receipt will be sent to this number"/>

      {/* Different payment number */}
      <Toggle label="Pay from a different number" checked={useDiff} onChange={() => setUseDiff(!useDiff)} hint="Link two numbers to the same booking"/>
      {useDiff && (
        <div style={{ background:'#eff6ff', borderRadius:12, padding:14, border:'1.5px solid #bfdbfe', marginBottom:14 }}>
          <div style={{ fontSize:11, color:'#1d4ed8', fontFamily:"'Poppins',sans-serif", fontWeight:700, marginBottom:8 }}>?? Both numbers will be linked. Payment must be exactly UGX {amount.toLocaleString()} -- mismatches are auto-rejected.</div>
          <Input label="Payment Phone Number" value={payPhone} onChange={e=>setPayPhone(e.target.value)} type="tel" placeholder="Payment number" required icon="[CARD]"/>
        </div>
      )}

      {step === 'processing' && (
        <div style={{ marginBottom:16 }}>
          <ProgressBar value={progress} max={100} color='var(--blue)' height={8} showPct/>
          <div style={{ textAlign:'center', marginTop:8, fontSize:12, color:'var(--gray-text)', fontFamily:"'Poppins',sans-serif" }}>Connecting to {method==='mtn'?'MTN MoMo':'Airtel Money'}...</div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10, marginTop:8 }}>
        {onBack && <Btn onClick={onBack} variant='ghost' full><- Back</Btn>}
        <Btn onClick={handlePay} variant='gold' full loading={step==='processing'} style={{ gridColumn:onBack?undefined:'1/-1' }}>
          {step==='processing'?'Processing...':`Pay UGX ${amount.toLocaleString()}`}
        </Btn>
      </div>
      <p style={{ fontSize:11, color:'var(--gray-text)', textAlign:'center', marginTop:10 }}>[LOCK] Secured by Raylane Pay . 256-bit SSL</p>
    </div>
  )
}

/* ===================================================
   PAYMENT SUCCESS SCREEN -- matches wireframe exactly
=================================================== */
export function PaymentSuccess({ amount, phone, payPhone, bookingRef, onDone, route='', seats=[] }) {
  const actions = [
    { icon:'??', label:'Download PDF',   color:'#1d4ed8', bg:'#dbeafe',  fn: () => alert('PDF generation -- connect to backend') },
    { icon:'?', label:'Share Ticket',   color:'#15803d', bg:'#dcfce7',  fn: () => navigator?.share?.({title:'Raylane Ticket',text:`Booking ${bookingRef}`}).catch(()=>{}) },
    { icon:'??', label:'Print Ticket',  color:'#92400e', bg:'#fef9c3',  fn: () => window.print() },
    { icon:'[MSG]', label:`Ticket sent to ${phone}`, color:'#7c3aed', bg:'#f3e8ff', fn:()=>{} },
  ]

  return (
    <div style={{ maxWidth:420, margin:'0 auto', display:'flex', flexDirection:'column', gap:0, animation:'fadeIn .4s ease' }}>
      {/* Success card -- matches wireframe */}
      <div style={{ background:'var(--white)', borderRadius:28, boxShadow:'0 24px 60px rgba(0,0,0,0.18)', overflow:'hidden', marginBottom:16 }}>
        {/* Top blue strip */}
        <div style={{ background:'linear-gradient(135deg,var(--blue),#1a52b3)', padding:'24px 24px 0', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 20 16" fill="none"><path d="M1 13 L7 3 L12 9 L16 3 L19 13" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, color:'var(--gold)' }}>Payment Successful</span>
        </div>

        {/* White body */}
        <div style={{ background:'var(--white)', borderRadius:'24px 24px 0 0', padding:'28px 24px 24px', marginTop:-12 }}>
          {/* Green check */}
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 24px rgba(34,197,94,0.35)' }}>
              <svg width="34" height="34" fill="none" stroke="white" strokeWidth="3.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:22, color:'var(--dark)', marginBottom:6 }}>Your Ticket is Confirmed!</h2>
            <p style={{ color:'var(--gray-text)', fontSize:14 }}>Payment of <strong>UGX {amount.toLocaleString()}</strong> received</p>
            <p style={{ color:'var(--gray-text)', fontSize:13, marginTop:4 }}>Booking ID: <strong style={{ color:'var(--blue)' }}>{bookingRef}</strong></p>
            {payPhone && <p style={{ color:'var(--gray-text)', fontSize:12, marginTop:4 }}>Paid from: {payPhone}</p>}
          </div>

          {/* Action buttons -- exact wireframe style */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {actions.map(a => (
              <button key={a.label} onClick={a.fn} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:14, background:a.bg, color:a.color, border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', transition:'all .18s', textAlign:'left' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}>
                <span style={{ fontSize:18, flexShrink:0 }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>

          {onDone && (
            <button onClick={onDone} style={{ width:'100%', marginTop:16, padding:'13px', borderRadius:14, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer' }}>
              <- Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ===================================================
   MODAL WRAPPER
=================================================== */
export function Modal({ open, onClose, title, children, maxWidth=520 }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:10 }}>
          <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18, margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'var(--gray-light)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>?</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ===================================================
   EMPTY STATE
=================================================== */
export function EmptyState({ icon='?', title, desc, action, onAction }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 20px' }}>
      <div style={{ fontSize:52, marginBottom:14 }}>{icon}</div>
      <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18, marginBottom:8 }}>{title}</h3>
      <p style={{ color:'var(--gray-text)', fontSize:14, maxWidth:340, margin:'0 auto 20px', lineHeight:1.7 }}>{desc}</p>
      {action && <Btn onClick={onAction} variant='blue'>{action}</Btn>}
    </div>
  )
}

/* ===================================================
   INFO BANNER
=================================================== */
export function Banner({ type='info', children }) {
  const styles = {
    info:    { bg:'#eff6ff', border:'#bfdbfe', color:'#1d4ed8', icon:'??' },
    warning: { bg:'#fff3cd', border:'#f59e0b', color:'#92400e', icon:'[!]?' },
    success: { bg:'#dcfce7', border:'#22c55e', color:'#15803d', icon:'[OK]' },
    locked:  { bg:'#fef9c3', border:'#f59e0b', color:'#92400e', icon:'[LOCK]' },
  }
  const s = styles[type] || styles.info
  return (
    <div style={{ background:s.bg, border:`1.5px solid ${s.border}`, borderRadius:12, padding:'12px 16px', marginBottom:18, display:'flex', gap:10, alignItems:'flex-start' }}>
      <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{s.icon}</span>
      <div style={{ fontSize:13, color:s.color, fontFamily:"'Poppins',sans-serif", fontWeight:600, lineHeight:1.6 }}>{children}</div>
    </div>
  )
}


// Seat map components -- imported from SeatMaps
export { BusSeat55, BusSeat65, BusSeat67, TaxiSeat14, SeatLegend } from './SeatMaps'
