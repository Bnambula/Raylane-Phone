import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const inp = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'11px 12px', fontSize:15, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', appearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lbl = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

export function GroupBookingModal({ onClose }) {
  const [form, setForm] = useState({ from:'Kampala', to:'', date:'', people:'10', budget:'', notes:'' })
  const toast = useToast()
  const set = (k,v) => setForm(f => ({...f,[k]:v}))

  const submit = e => {
    e.preventDefault()
    if (!form.to || !form.date) { toast('Please fill required fields','warning'); return }
    toast(`Group quote request sent! We'll contact you within 2 hours.`, 'success')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth:520 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:20, marginBottom:3 }}>Group Travel (10+ people)</h3>
            <p style={{ fontSize:13, color:'#64748b', fontFamily:"'Inter',sans-serif" }}>Get a custom quote for your group or charter a full vehicle</p>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'#f1f5f9', border:'none', cursor:'pointer', fontSize:16, flexShrink:0 }}>✕</button>
        </div>

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={lbl}>From *</label><select value={form.from} onChange={e=>set('from',e.target.value)} style={inp}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>To *</label><select value={form.to} onChange={e=>set('to',e.target.value)} style={inp}><option value="">Select…</option>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>Travel Date *</label><input type="date" value={form.date} onChange={e=>set('date',e.target.value)} style={inp}/></div>
            <div><label style={lbl}>Number of People</label><input type="number" value={form.people} onChange={e=>set('people',e.target.value)} min="10" placeholder="e.g. 25" style={inp}/></div>
          </div>

          <div style={{ marginBottom:12 }}>
            <label style={lbl}>Budget (UGX) — optional</label>
            <input type="number" value={form.budget} onChange={e=>set('budget',e.target.value)} placeholder="e.g. 2,000,000" style={inp}/>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Notes / Special Requirements</label>
            <textarea rows={3} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="School trip, church group, return journey needed, etc." style={{ ...inp, resize:'none', lineHeight:1.6 }}/>
          </div>

          <div style={{ background:'#eff6ff', borderRadius:12, padding:'12px 14px', marginBottom:16, fontSize:13, color:'#1d4ed8', fontFamily:"'Inter',sans-serif", lineHeight:1.6 }}>
            If 10+ seats: we suggest chartering a full vehicle at a discounted rate. Admin will assign the best operator and add a reasonable markup.
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
            <button type="button" onClick={onClose} style={{ padding:'13px', borderRadius:12, background:'#f1f5f9', color:'#0F1923', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:14, cursor:'pointer', border:'none' }}>Cancel</button>
            <button type="submit" style={{ padding:'13px', borderRadius:12, background:'#FFC72C', color:'#0B3D91', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer', border:'none', boxShadow:'0 4px 16px rgba(255,199,44,.4)' }}>
              Submit Group Quote Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AdvanceBookingModal({ onClose }) {
  const [from, setFrom] = useState('Kampala')
  const [to, setTo]     = useState('')
  const [date, setDate] = useState('')
  const [price, setPrice] = useState('')
  const toast = useToast()

  const commitFee = price ? Math.round(parseInt(price.replace(/,/g,'')) * 0.2) : 0

  const submit = e => {
    e.preventDefault()
    if (!to || !date || !price) { toast('Please fill all fields','warning'); return }
    toast(`Advance booking submitted! Pay UGX ${commitFee.toLocaleString()} to secure your seat.`, 'success')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth:500 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:20, marginBottom:3 }}>Advance Booking</h3>
            <p style={{ fontSize:13, color:'#64748b', fontFamily:"'Inter',sans-serif" }}>Reserve a seat up to 4 weeks ahead with just 20% today</p>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'#f1f5f9', border:'none', cursor:'pointer', fontSize:16, flexShrink:0 }}>✕</button>
        </div>

        {/* Feature highlight */}
        <div style={{ background:'linear-gradient(135deg,#0B3D91,#1a52b3)', borderRadius:14, padding:'18px 20px', marginBottom:20, color:'#fff' }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, marginBottom:4 }}>Secure your seat with just 20% today</div>
          <div style={{ fontSize:13, opacity:.85, fontFamily:"'Inter',sans-serif" }}>
            {commitFee > 0
              ? `Pay UGX ${commitFee.toLocaleString()} now. Balance of UGX ${(parseInt(price.replace(/,/g,''))-commitFee).toLocaleString()} due before departure.`
              : 'Enter the ticket price below to see your commitment fee.'}
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={lbl}>From</label><select value={from} onChange={e=>setFrom(e.target.value)} style={inp}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>To *</label><select value={to} onChange={e=>setTo(e.target.value)} style={inp}><option value="">Select…</option>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>Travel Date *</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={inp}/></div>
            <div><label style={lbl}>Ticket Price (UGX)</label><input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="e.g. 25000" style={inp}/></div>
          </div>

          {commitFee > 0 && (
            <div style={{ background:'#dcfce7', borderRadius:12, padding:'12px 14px', marginBottom:16, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, color:'#15803d' }}>
              Commitment fee today: UGX {commitFee.toLocaleString()}
            </div>
          )}

          <div style={{ fontSize:12, color:'#64748b', marginBottom:16, fontFamily:"'Inter',sans-serif", lineHeight:1.7 }}>
            Advance bookings are confirmed within 2 hours. Commitment fee is non-refundable if cancelled less than 48 hours before departure.
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
            <button type="button" onClick={onClose} style={{ padding:'13px', borderRadius:12, background:'#f1f5f9', color:'#0F1923', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:14, cursor:'pointer', border:'none' }}>Cancel</button>
            <button type="submit" style={{ padding:'13px', borderRadius:12, background:'#FFC72C', color:'#0B3D91', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer', border:'none', boxShadow:'0 4px 16px rgba(255,199,44,.4)' }}>
              Reserve My Seat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupBookingModal
