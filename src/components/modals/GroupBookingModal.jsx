import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const P  = { fontFamily:"'Poppins',sans-serif" }
const I  = { fontFamily:"'Inter',sans-serif" }
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

export function GroupBookingModal({ onClose }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    from:'Kampala', to:'', date:'', returnDate:'', people:'10',
    purpose:'', contact:'', phone:'', email:'', notes:'', vehicleType:'coach'
  })
  const toast = useToast()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = e => {
    e.preventDefault()
    if (!form.to || !form.date || !form.phone) { toast('Please fill all required fields', 'warning'); return }
    setSent(true)
  }

  if (sent) return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth:460, textAlign:'center' }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <svg width="28" height="28" fill="none" stroke="#15803d" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 style={{ ...P, fontWeight:800, fontSize:22, marginBottom:8 }}>Request Received!</h3>
        <p style={{ ...I, color:'#64748b', fontSize:14, lineHeight:1.7, marginBottom:16 }}>
          Our team will contact you within <strong>2 hours</strong> with a custom quote, vehicle options, and availability confirmation.
        </p>
        <div style={{ background:'#f8fafc', borderRadius:14, padding:16, marginBottom:20, textAlign:'left' }}>
          <div style={{ fontSize:13, ...I, color:'#64748b', lineHeight:1.9 }}>
            <div><strong style={{ color:'#0F1923' }}>Route:</strong> {form.from} to {form.to}</div>
            <div><strong style={{ color:'#0F1923' }}>Date:</strong> {form.date}{form.returnDate ? ' (Return: ' + form.returnDate + ')' : ''}</div>
            <div><strong style={{ color:'#0F1923' }}>People:</strong> {form.people}</div>
            <div><strong style={{ color:'#0F1923' }}>We will call:</strong> {form.phone}</div>
          </div>
        </div>
        <p style={{ fontSize:12, color:'#94a3b8', ...I, marginBottom:20 }}>
          Ref: GRP-{Date.now().toString().slice(-6)}
        </p>
        <button onClick={onClose} style={{ padding:'12px 32px', borderRadius:20, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>Done</button>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth:560 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h3 style={{ ...P, fontWeight:800, fontSize:20, marginBottom:3 }}>Group Travel (10+ People)</h3>
            <p style={{ fontSize:13, color:'#64748b', ...I }}>Submit your details and we will send a custom quote within 2 hours.</p>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'#f1f5f9', border:'none', cursor:'pointer', fontSize:16, flexShrink:0 }}>x</button>
        </div>
        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={lS}>From *</label>
              <select value={form.from} onChange={e=>set('from',e.target.value)} style={iS}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lS}>To *</label>
              <select value={form.to} onChange={e=>set('to',e.target.value)} style={iS}>
                <option value="">Select...</option>
                {CITIES.filter(c => c !== form.from).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lS}>Travel Date *</label>
              <input type="date" value={form.date} onChange={e=>set('date',e.target.value)} style={iS} min={new Date().toISOString().split('T')[0]}/>
            </div>
            <div><label style={lS}>Return Date</label>
              <input type="date" value={form.returnDate} onChange={e=>set('returnDate',e.target.value)} style={iS}/>
            </div>
            <div><label style={lS}>Number of People *</label>
              <input type="number" min="10" value={form.people} onChange={e=>set('people',e.target.value)} placeholder="Minimum 10" style={iS}/>
            </div>
            <div><label style={lS}>Vehicle Preference</label>
              <select value={form.vehicleType} onChange={e=>set('vehicleType',e.target.value)} style={iS}>
                <option value="coach">67-Seater Coach</option>
                <option value="taxi">14-Seater Taxi</option>
                <option value="fleet">Multiple Vehicles</option>
                <option value="any">Any available</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={lS}>Trip Purpose</label>
            <select value={form.purpose} onChange={e=>set('purpose',e.target.value)} style={iS}>
              <option value="">Select...</option>
              {['School Trip','Corporate Event','Church / Religious','Wedding','Tourism / Safari','Sports Team','Family Travel','Other'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={lS}>Contact Name *</label>
              <input value={form.contact} onChange={e=>set('contact',e.target.value)} placeholder="Your full name" style={iS}/>
            </div>
            <div><label style={lS}>Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="0771 xxx xxx" style={iS}/>
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={lS}>Email (for written quote)</label>
            <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="your@email.com" style={iS}/>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={lS}>Additional Notes</label>
            <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} rows={3}
              placeholder="Special requirements, accessibility needs, stopovers, catering..."
              style={{ ...iS, resize:'none', lineHeight:1.6 }}/>
          </div>
          <div style={{ background:'#eff6ff', borderRadius:12, padding:'12px 14px', fontSize:13, ...P, fontWeight:600, color:'#1d4ed8', marginBottom:16 }}>
            Team responds within 2 hours (Mon-Sat 7AM-8PM). Urgent? Call +256 700 000 000.
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
            <button type="button" onClick={onClose} style={{ padding:'13px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', ...P, fontWeight:700, fontSize:14, cursor:'pointer', color:'#64748b' }}>Cancel</button>
            <button type="submit" style={{ padding:'13px', borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer', boxShadow:'0 4px 14px rgba(11,61,145,.3)' }}>
              Send Request to Raylane Team
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AdvanceBookingModal({ onClose }) {
  const navigate = useNavigate()
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth:440 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 style={{ ...P, fontWeight:800, fontSize:20 }}>Advance Booking</h3>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'#f1f5f9', border:'none', cursor:'pointer', fontSize:16 }}>x</button>
        </div>
        <div style={{ background:'#fef9c3', borderRadius:14, padding:18, marginBottom:16 }}>
          <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:10, color:'#92400e' }}>How Advance Booking Works</div>
          <div style={{ fontSize:13, ...I, color:'#78350f', lineHeight:1.9 }}>
            <div style={{ marginBottom:4 }}>1. Select your route and preferred date</div>
            <div style={{ marginBottom:4 }}>2. We calculate the average fare for that route</div>
            <div style={{ marginBottom:4 }}>3. Pay a 20% commitment fee via MoMo or Visa</div>
            <div style={{ marginBottom:4 }}>4. Your seat is reserved and confirmed via SMS</div>
            <div>5. Pay the remaining 80% balance at boarding</div>
          </div>
        </div>
        <p style={{ fontSize:13, color:'#64748b', ...I, marginBottom:20, lineHeight:1.7 }}>
          Advance booking guarantees your seat up to 30 days ahead. Commitment fees are non-refundable within 24 hours of departure.
        </p>
        <button onClick={() => { onClose(); navigate('/book?advance=true') }}
          style={{ width:'100%', padding:14, borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:15, border:'none', cursor:'pointer', boxShadow:'0 4px 14px rgba(11,61,145,.3)' }}>
          Reserve My Seat Now
        </button>
      </div>
    </div>
  )
}

export default GroupBookingModal
