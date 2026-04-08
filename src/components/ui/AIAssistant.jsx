import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const QUICK = [
  { icon:'🕐', q:'Best time to travel?', a:'Weekday mornings (Tue–Thu, 6–9 AM) are least busy. Avoid Friday 4–8 PM — peak traffic out of Kampala.' },
  { icon:'💸', q:'Cheapest route today?', a:'Kampala → Jinja from UGX 12,000. Kampala → Entebbe from UGX 8,000. Prices rise ~15% after 2 PM.' },
  { icon:'📦', q:'How to send a parcel?', a:'Go to Parcels → choose size (Envelope from UGX 5K to Heavy Cargo UGX 30K) → pay via MoMo → drop at any Raylane hub.' },
  { icon:'🚌', q:'How do I join as operator?', a:'Click "Join Now" or visit /partner. Fill the form — our team reviews within 24–48 hrs and sets up your dashboard.' },
]

const REPLIES = {
  default: 'I can help with routes, booking, parcels, and payments. What would you like to know?',
  cheap:   '💸 Kampala → Jinja from UGX 12,000. → Entebbe from UGX 8,000. Prices rise after 2 PM — book early!',
  parcel:  '📦 Send from UGX 5,000 (envelope) to UGX 30,000 (heavy cargo). All parcels get real-time tracking!',
  book:    '🎫 Search route → choose vehicle type → select seat → pay via MTN MoMo or Airtel. Done in under 2 minutes!',
  time:    '🕐 Best: Tue–Thu 6–9 AM. Avoid Friday evenings. Weekend mornings also good for long routes.',
  nairobi: '🌍 Kampala→Nairobi: UGX 60,000 · ~8 hrs. Kampala→Kigali: UGX 55,000 · ~9 hrs. Kampala→Juba: UGX 60,000 · ~12 hrs.',
  pay:     '📱 We accept MTN Mobile Money & Airtel Money. After selecting your seat, a prompt is sent to your phone to confirm payment.',
  operator:'🚌 Join via /partner. Free onboarding. You get a full dashboard to manage routes, bookings, and passengers.',
  seat:    '💺 After selecting your bus, tap any green seat to select it. Yellow = yours. Red = booked. Your seat is held 5 minutes.',
  cancel:  '❌ Cancellations are subject to the operator\'s policy. Contact support at +256 700 000 000 for assisted cancellations.',
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ from:'bot', text:'👋 Hi! I\'m the Raylane AI. Ask me about routes, prices, parcels, or anything travel-related!' }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const reply = (q) => {
    const lower = q.toLowerCase()
    if (lower.includes('cheap') || lower.includes('price')) return REPLIES.cheap
    if (lower.includes('parcel') || lower.includes('send')) return REPLIES.parcel
    if (lower.includes('book') || lower.includes('seat')) return REPLIES.book
    if (lower.includes('time') || lower.includes('when') || lower.includes('best')) return REPLIES.time
    if (lower.includes('nairobi') || lower.includes('kigali') || lower.includes('juba')) return REPLIES.nairobi
    if (lower.includes('pay') || lower.includes('momo') || lower.includes('money')) return REPLIES.pay
    if (lower.includes('operator') || lower.includes('join') || lower.includes('business')) return REPLIES.operator
    if (lower.includes('select seat') || lower.includes('choose seat')) return REPLIES.seat
    if (lower.includes('cancel') || lower.includes('refund')) return REPLIES.cancel
    return REPLIES.default
  }

  const send = (text) => {
    const q = text || input.trim()
    if (!q) return
    setInput('')
    setMsgs(m => [...m, { from:'user', text:q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(m => [...m, { from:'bot', text:reply(q) }])
    }, 800)
  }

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(!open)} aria-label="AI Assistant" style={{
        position:'fixed', bottom: open ? 'calc(420px + 20px)' : 76, right:16, zIndex:850,
        width:52, height:52, borderRadius:18, background:'var(--blue)', color:'var(--white)',
        border:'3px solid var(--gold)', boxShadow:'0 6px 20px rgba(11,61,145,0.4)',
        fontSize:22, transition:'all .3s', display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{ position:'fixed', bottom:76, right:16, zIndex:849, width:'min(340px,calc(100vw - 32px))', background:'var(--white)', borderRadius:20, boxShadow:'0 16px 48px rgba(0,0,0,0.2)', border:'1px solid var(--gray-mid)', overflow:'hidden', display:'flex', flexDirection:'column', animation:'fadeIn .25s ease', maxHeight:'70vh' }}>
          {/* Header */}
          <div style={{ background:'var(--blue)', padding:'14px 18px', color:'var(--white)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🤖</div>
            <div>
              <div style={{ fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:13 }}>Raylane AI</div>
              <div style={{ fontSize:10, opacity:.75 }}>● Online · Instant answers</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:9 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.from==='user'?'flex-end':'flex-start' }}>
                <div style={{ background:m.from==='user'?'var(--blue)':'var(--gray-light)', color:m.from==='user'?'var(--white)':'var(--dark)', padding:'9px 13px', borderRadius:m.from==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px', maxWidth:'82%', fontSize:13, lineHeight:1.6 }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display:'flex', gap:4, padding:'10px 14px', background:'var(--gray-light)', borderRadius:'14px 14px 14px 4px', width:60 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--gray-text)', animation:`pulse .8s ease ${i*.2}s infinite` }}/>)}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick replies */}
          <div style={{ padding:'6px 12px', display:'flex', gap:5, overflowX:'auto', borderTop:'1px solid var(--gray-mid)' }}>
            {QUICK.map(q => (
              <button key={q.q} onClick={() => send(q.q)} style={{ background:'var(--gray-light)', border:'1px solid var(--gray-mid)', borderRadius:16, padding:'5px 10px', fontSize:10, fontFamily:''Poppins',sans-serif', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                {q.icon} {q.q.split(' ').slice(0,3).join(' ')}…
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', display:'flex', gap:8, borderTop:'1px solid var(--gray-mid)' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&send()} placeholder="Ask about routes, prices…" style={{ flex:1, border:'1.5px solid var(--gray-mid)', borderRadius:16, padding:'9px 13px', fontSize:13 }}/>
            <button onClick={() => send()} style={{ width:36, height:36, borderRadius:11, background:'var(--gold)', color:'var(--blue)', fontWeight:900, fontSize:16, flexShrink:0 }}>→</button>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </>
  )
}
