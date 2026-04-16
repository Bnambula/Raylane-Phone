import React, { useState } from 'react'

const P  = { fontFamily:"'Poppins',sans-serif" }
const I  = { fontFamily:"'Inter',sans-serif" }
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

export default function NoTripsCard({
  from, to, date, vehicle, allTrips,
  onChangeRoute, onShowAll, onSelectTrip,
  notifyForm, setNotifyForm, notifySent, setNotifySent, toast
}) {
  const [showNotify, setShowNotify] = useState(false)
  const [submitting, setSubmitting]  = useState(false)
  const refNum = 'RLX-MATCH-' + Date.now().toString().slice(-6)

  const nearbyTrips = (allTrips || []).filter(t =>
    t.from.toLowerCase() === (from||'').toLowerCase() &&
    t.to.toLowerCase()   === (to||'').toLowerCase()
  ).slice(0, 3)

  const handleNotify = e => {
    e.preventDefault()
    if (!(notifyForm||{}).phone || !notifyForm.phone.trim()) { toast && toast('Enter your phone number', 'warning'); return }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setNotifySent && setNotifySent(true)
      toast && toast('You are on the waitlist! We will SMS you when a bus is available.', 'success')
    }, 1200)
  }

  if (notifySent) return (
    <div style={{ background:'#fff', borderRadius:20, border:'1px solid #E2E8F0', padding:32, textAlign:'center' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
        <svg width="30" height="30" fill="none" stroke="#15803d" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h3 style={{ ...P, fontWeight:800, fontSize:22, marginBottom:8 }}>You are on the waitlist!</h3>
      <p style={{ color:'#64748b', ...I, fontSize:14, lineHeight:1.75, marginBottom:16, maxWidth:400, margin:'0 auto 16px' }}>
        We are working to match you with a verified operator for <strong>{from} to {to}</strong> on <strong>{date}</strong>.
        We will SMS <strong>{(notifyForm||{}).phone}</strong> as soon as a bus is confirmed.
      </p>
      <div style={{ background:'#F5F7FA', borderRadius:14, padding:'14px 20px', marginBottom:20, display:'inline-block' }}>
        <div style={{ fontSize:10, ...P, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 }}>Reference</div>
        <div style={{ ...P, fontWeight:800, fontSize:18, color:'#0B3D91' }}>{refNum}</div>
      </div>
      <div style={{ background:'#eff6ff', borderRadius:14, padding:'14px 18px', marginBottom:20, textAlign:'left' }}>
        <div style={{ ...P, fontWeight:700, fontSize:13, color:'#1d4ed8', marginBottom:8 }}>What happens next</div>
        <div style={{ fontSize:13, ...I, color:'#1e3a8a', lineHeight:1.85 }}>
          <div style={{ marginBottom:4 }}>1. Our system monitors operator schedules daily for your route</div>
          <div style={{ marginBottom:4 }}>2. When a matching trip is confirmed, we auto-reserve your preferred seat</div>
          <div style={{ marginBottom:4 }}>3. You receive an SMS 24 hours before departure with payment link</div>
          <div>4. Complete payment to confirm your seat -- unpaid seats are released 1 hour before departure</div>
        </div>
      </div>
      <button onClick={() => setNotifySent && setNotifySent(false)}
        style={{ padding:'10px 24px', borderRadius:20, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748b', ...P, fontWeight:600, fontSize:14, cursor:'pointer' }}>
        Update Preferences
      </button>
    </div>
  )

  return (
    <div style={{ background:'#fff', borderRadius:20, border:'1px solid #E2E8F0', overflow:'hidden' }}>
      <div style={{ background:'linear-gradient(135deg,#0B3D91,#1a52b3)', padding:'28px 28px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="26" height="26" fill="none" stroke="#FFC72C" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <div style={{ color:'#fff' }}>
            <div style={{ ...P, fontWeight:800, fontSize:18, marginBottom:2 }}>No buses found yet</div>
            <div style={{ fontSize:13, opacity:.8, ...I }}>{from} to {to} -- {date}</div>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,.12)', borderRadius:12, padding:'12px 16px', fontSize:13, ...I, color:'rgba(255,255,255,.9)', lineHeight:1.65 }}>
          This route does not have a confirmed bus for your date. New operators join Raylane weekly. We can notify you the moment one is available and auto-assign your preferred seat.
        </div>
      </div>

      <div style={{ padding:24 }}>
        {!showNotify ? (
          <div style={{ marginBottom:20 }}>
            <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:6 }}>Get notified and auto-booked</div>
            <p style={{ fontSize:13, ...I, color:'#64748b', lineHeight:1.65, marginBottom:14 }}>
              Leave your number. 24 hours before departure, our system auto-reserves your preferred seat and sends you an SMS to complete payment.
            </p>
            <button onClick={() => setShowNotify(true)}
              style={{ padding:'13px 28px', borderRadius:20, background:'#FFC72C', color:'#0B3D91', ...P, fontWeight:700, fontSize:15, border:'none', cursor:'pointer', boxShadow:'0 4px 16px rgba(255,199,44,.4)', width:'100%' }}>
              Notify Me When Available
            </button>
          </div>
        ) : (
          <form onSubmit={handleNotify} style={{ marginBottom:20, background:'#F5F7FA', borderRadius:16, padding:20 }}>
            <div style={{ ...P, fontWeight:700, fontSize:15, marginBottom:14, color:'#0B3D91' }}>
              Trip alert for {from} to {to}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lS}>Your Phone Number *</label>
                <input value={(notifyForm||{}).phone||''} onChange={e => setNotifyForm && setNotifyForm(f => ({...f, phone:e.target.value}))}
                  placeholder="0771 xxx xxx" type="tel" style={iS}/>
              </div>
              <div>
                <label style={lS}>Seat Preference</label>
                <select value={(notifyForm||{}).seatPref||'window'} onChange={e => setNotifyForm && setNotifyForm(f => ({...f, seatPref:e.target.value}))} style={iS}>
                  <option value="window">Window seat</option>
                  <option value="aisle">Aisle seat</option>
                  <option value="front">Front rows (1-3)</option>
                  <option value="back">Back rows</option>
                  <option value="any">Any available</option>
                </select>
              </div>
              <div>
                <label style={lS}>Number of Passengers</label>
                <select value={(notifyForm||{}).seats||'1'} onChange={e => setNotifyForm && setNotifyForm(f => ({...f, seats:e.target.value}))} style={iS}>
                  {['1','2','3','4','5'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lS}>Notes</label>
                <input value={(notifyForm||{}).notes||''} onChange={e => setNotifyForm && setNotifyForm(f => ({...f, notes:e.target.value}))}
                  placeholder="e.g. morning departure preferred, wheelchair accessible..." style={iS}/>
              </div>
            </div>
            <div style={{ background:'#eff6ff', borderRadius:10, padding:'10px 14px', fontSize:12, ...I, color:'#1d4ed8', marginBottom:14, lineHeight:1.6 }}>
              <strong>Auto-booking:</strong> When a bus is confirmed, we reserve your seat and SMS you to pay -- at least 1 hour before departure. No charge until you confirm.
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
              <button type="button" onClick={() => setShowNotify(false)}
                style={{ padding:'12px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', ...P, fontWeight:700, fontSize:14, cursor:'pointer', color:'#64748b' }}>
                Back
              </button>
              <button type="submit" disabled={submitting}
                style={{ padding:'12px', borderRadius:12, background:submitting?'#94a3b8':'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:submitting?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {submitting
                  ? (<><div style={{ width:16, height:16, border:'3px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }}/> Sending...</>)
                  : 'Add Me to Waitlist'}
              </button>
            </div>
          </form>
        )}

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background:'#E2E8F0' }}/>
          <span style={{ fontSize:12, color:'#94a3b8', ...P, fontWeight:600, whiteSpace:'nowrap' }}>or choose a nearby option</span>
          <div style={{ flex:1, height:1, background:'#E2E8F0' }}/>
        </div>

        {nearbyTrips.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:10 }}>Same route -- other dates:</div>
            {nearbyTrips.map(t => (
              <div key={t.id} onClick={() => onSelectTrip && onSelectTrip(t)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:12, border:'1.5px solid #E2E8F0', marginBottom:8, cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#0B3D91'; e.currentTarget.style.background='#eff6ff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.background='#fff' }}>
                <div>
                  <div style={{ ...P, fontWeight:700, fontSize:14 }}>{t.operator_name}</div>
                  <div style={{ fontSize:12, color:'#64748b', ...I }}>{t.departs} -- {t.seat_type}-seater</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:15, color:'#0B3D91' }}>UGX {(t.price||0).toLocaleString()}</div>
                  <div style={{ fontSize:11, color:'#22c55e', ...P, fontWeight:600 }}>{(t.seats_total||0) - (t.seats_booked||0)} seats left</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom:16 }}>
          <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:10 }}>All departures from {from}:</div>
          {(allTrips||[]).filter(t => t.from.toLowerCase() === (from||'').toLowerCase()).slice(0, 5).map(t => (
            <div key={t.id} onClick={() => onSelectTrip && onSelectTrip(t)}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:12, border:'1px solid #E2E8F0', marginBottom:8, cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.background='#F5F7FA'}
              onMouseLeave={e => e.currentTarget.style.background='#fff'}>
              <div>
                <div style={{ ...P, fontWeight:700, fontSize:13 }}>{t.from} to {t.to}</div>
                <div style={{ fontSize:11, color:'#64748b', ...I }}>{t.operator_name} -- {t.departs}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ ...P, fontWeight:700, fontSize:14, color:'#0B3D91' }}>UGX {(t.price||0).toLocaleString()}</div>
                <div style={{ fontSize:11, color:'#94a3b8', ...I }}>{(t.seats_total||0)-(t.seats_booked||0)} left</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button onClick={onChangeRoute}
            style={{ padding:'12px', borderRadius:12, border:'1.5px solid #0B3D91', color:'#0B3D91', background:'#fff', ...P, fontWeight:700, fontSize:14, cursor:'pointer' }}>
            Change Route
          </button>
          <button onClick={onShowAll}
            style={{ padding:'12px', borderRadius:12, border:'1.5px solid #E2E8F0', color:'#64748b', background:'#fff', ...P, fontWeight:700, fontSize:14, cursor:'pointer' }}>
            Show All Routes
          </button>
        </div>
      </div>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  )
}
