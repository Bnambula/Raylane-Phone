import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import Footer from '../components/layout/Footer'

const P = { fontFamily:"'Poppins',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }
const iS = { width:'100%', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'12px 14px', fontSize:14, fontFamily:"'Inter',sans-serif", background:'#fff', WebkitAppearance:'none', boxSizing:'border-box', outline:'none', color:'#0F1923' }
const lS = { display:'block', fontSize:10, fontWeight:600, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:5 }

const MOCK_BOOKINGS = [
  { id:'RLX-240501', from:'Kampala', to:'Mbale', date:'12 May 2026', departs:'8:00 AM', operator:'Raylane Express', seats:['5'], amount:28000, status:'CONFIRMED', points:280 },
  { id:'RLX-240498', from:'Kampala', to:'Gulu',  date:'28 Apr 2026', departs:'7:00 AM', operator:'Global Coaches', seats:['12','13'], amount:50000, status:'COMPLETED', points:500 },
  { id:'RLX-240491', from:'Mbale',   to:'Kampala',date:'15 Apr 2026', departs:'2:00 PM', operator:'Raylane Express', seats:['8'], amount:28000, status:'COMPLETED', points:280 },
]

const TABS = ['My Bookings','Profile','Loyalty Points','Payment Methods']

export default function AccountPage() {
  const [tab,     setTab]     = useState('My Bookings')
  const [loggedIn, setLoggedIn] = useState(false)
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [step,    setStep]    = useState('phone')
  const [profile, setProfile] = useState({ name:'', email:'', phone:'', city:'Kampala' })
  const navigate = useNavigate()
  const toast    = useToast()

  const totalPoints = MOCK_BOOKINGS.reduce((s, b) => s + (b.points || 0), 0)
  const tier = totalPoints >= 5000 ? 'Gold' : totalPoints >= 2000 ? 'Silver' : 'Bronze'
  const tierColor = tier === 'Gold' ? '#d4a017' : tier === 'Silver' ? '#64748b' : '#c2410c'

  const sendOtp = e => {
    e.preventDefault()
    if (!phone.trim()) { toast('Enter your phone number', 'warning'); return }
    setStep('otp')
    toast('OTP sent to ' + phone, 'success')
  }

  const verifyOtp = e => {
    e.preventDefault()
    if (otp.length < 4) { toast('Enter the 4-digit OTP', 'warning'); return }
    setLoggedIn(true)
    setProfile(p => ({ ...p, phone }))
    toast('Welcome back! Tusimbudde.', 'success')
  }

  if (!loggedIn) return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA', paddingTop:'var(--nav-h)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:32, width:'100%', maxWidth:400, boxShadow:'0 4px 24px rgba(0,0,0,.08)', margin:16 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <svg width="26" height="26" fill="none" stroke="#FFC72C" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 style={{ ...P, fontWeight:800, fontSize:22, marginBottom:6 }}>My Account</h2>
          <p style={{ color:'#64748b', ...I, fontSize:14 }}>
            {step === 'phone' ? 'Enter your phone to receive a one-time code' : 'Enter the 4-digit code sent to ' + phone}
          </p>
        </div>
        {step === 'phone' ? (
          <form onSubmit={sendOtp}>
            <div style={{ marginBottom:16 }}>
              <label style={lS}>Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0771 xxx xxx" style={iS} type="tel"/>
            </div>
            <button type="submit" style={{ width:'100%', padding:14, borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <div style={{ marginBottom:16 }}>
              <label style={lS}>Enter OTP</label>
              <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="4-digit code" maxLength={4} style={{ ...iS, textAlign:'center', fontSize:22, letterSpacing:8, fontWeight:700 }} type="number"/>
            </div>
            <button type="submit" style={{ width:'100%', padding:14, borderRadius:12, background:'#FFC72C', color:'#0B3D91', ...P, fontWeight:700, fontSize:15, border:'none', cursor:'pointer', marginBottom:10 }}>
              Verify and Sign In
            </button>
            <button type="button" onClick={() => setStep('phone')} style={{ width:'100%', padding:11, borderRadius:12, background:'#fff', color:'#64748b', ...P, fontWeight:600, fontSize:14, border:'1.5px solid #E2E8F0', cursor:'pointer' }}>
              Change Number
            </button>
          </form>
        )}
        <p style={{ textAlign:'center', fontSize:12, color:'#94a3b8', ...I, marginTop:16 }}>No signup needed. Your booking history is linked to your phone number.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA', paddingTop:'var(--nav-h)' }}>
      {/* Header */}
      <div style={{ background:'#0B3D91', padding:'28px 0 0' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap' }}>
            <div style={{ width:52, height:52, borderRadius:16, background:'#FFC72C', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:800, fontSize:20, color:'#0B3D91', flexShrink:0 }}>
              {(profile.name || phone)[0]?.toUpperCase() || 'R'}
            </div>
            <div style={{ color:'#fff' }}>
              <div style={{ ...P, fontWeight:700, fontSize:18 }}>{profile.name || 'Raylane Traveller'}</div>
              <div style={{ fontSize:13, opacity:.75, ...I }}>{profile.phone} -- {totalPoints.toLocaleString()} points -- <span style={{ color:tierColor, fontWeight:700 }}>{tier}</span></div>
            </div>
            <div style={{ marginLeft:'auto' }}>
              <button onClick={() => setLoggedIn(false)} style={{ padding:'8px 16px', borderRadius:20, background:'rgba(255,255,255,.12)', color:'rgba(255,255,255,.8)', border:'1px solid rgba(255,255,255,.2)', ...P, fontWeight:600, fontSize:12, cursor:'pointer' }}>Sign Out</button>
            </div>
          </div>
          <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:'10px 18px', ...P, fontWeight:700, fontSize:13, color:tab===t?'#FFC72C':'rgba(255,255,255,.6)', borderBottom:`3px solid ${tab===t?'#FFC72C':'transparent'}`, background:'none', border:'none', borderBottom:`3px solid ${tab===t?'#FFC72C':'transparent'}`, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'24px 16px 60px' }}>

        {/* MY BOOKINGS */}
        {tab === 'My Bookings' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
              <h2 style={{ ...P, fontWeight:700, fontSize:20 }}>My Trips</h2>
              <button onClick={() => navigate('/book')} style={{ padding:'10px 20px', borderRadius:20, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>Book New Trip</button>
            </div>
            {MOCK_BOOKINGS.map(b => (
              <div key={b.id} style={{ background:'#fff', borderRadius:18, padding:20, marginBottom:12, border:'1px solid #E2E8F0', transition:'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 20px rgba(11,61,145,.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10 }}>
                  <div>
                    <div style={{ ...P, fontWeight:800, fontSize:17, marginBottom:4 }}>{b.from} to {b.to}</div>
                    <div style={{ fontSize:13, color:'#64748b', ...I, marginBottom:6 }}>{b.operator} -- {b.date} -- {b.departs}</div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {b.seats.map(s => <span key={s} style={{ background:'#eff6ff', color:'#1d4ed8', padding:'2px 9px', borderRadius:8, ...P, fontWeight:700, fontSize:12 }}>Seat {s}</span>)}
                      <span style={{ background:b.status==='CONFIRMED'?'#dcfce7':'#f1f5f9', color:b.status==='CONFIRMED'?'#15803d':'#64748b', padding:'2px 9px', borderRadius:8, ...P, fontWeight:700, fontSize:11 }}>{b.status}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ ...P, fontWeight:800, fontSize:18, color:'#0B3D91' }}>UGX {b.amount.toLocaleString()}</div>
                    <div style={{ fontSize:12, color:'#15803d', ...P, fontWeight:600, marginTop:2 }}>+{b.points} pts</div>
                  </div>
                </div>
                {b.status === 'CONFIRMED' && (
                  <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #E2E8F0', display:'flex', gap:8, flexWrap:'wrap' }}>
                    <button style={{ padding:'8px 16px', borderRadius:20, background:'#FFC72C', color:'#0B3D91', ...P, fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>View Ticket</button>
                    <button onClick={() => toast('Cancellation request sent', 'success')} style={{ padding:'8px 16px', borderRadius:20, background:'#fff', color:'#dc2626', ...P, fontWeight:700, fontSize:13, border:'1.5px solid #fca5a5', cursor:'pointer' }}>Cancel</button>
                    <button onClick={() => toast('Rescheduling options sent to your phone', 'success')} style={{ padding:'8px 16px', borderRadius:20, background:'#fff', color:'#0B3D91', ...P, fontWeight:700, fontSize:13, border:'1.5px solid #E2E8F0', cursor:'pointer' }}>Reschedule</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'Profile' && (
          <div style={{ maxWidth:500 }}>
            <h2 style={{ ...P, fontWeight:700, fontSize:20, marginBottom:20 }}>My Profile</h2>
            <div style={{ background:'#fff', borderRadius:18, padding:24, border:'1px solid #E2E8F0' }}>
              {[['name','Full Name','Your name'],['email','Email','your@email.com'],['city','Home City','']].map(([k,l,ph]) => (
                <div key={k} style={{ marginBottom:16 }}>
                  <label style={lS}>{l}</label>
                  {k === 'city' ? (
                    <select value={profile[k]} onChange={e => setProfile(p => ({...p,[k]:e.target.value}))} style={iS}>
                      {['Kampala','Mbale','Gulu','Arua','Mbarara','Jinja','Entebbe','Masaka'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input value={profile[k]} onChange={e => setProfile(p => ({...p,[k]:e.target.value}))} placeholder={ph} style={iS}/>
                  )}
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <label style={lS}>Phone (verified)</label>
                <input value={profile.phone} style={{ ...iS, background:'#F5F7FA', color:'#64748b' }} readOnly/>
              </div>
              <button onClick={() => toast('Profile saved', 'success')} style={{ width:'100%', padding:14, borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>
                Save Profile
              </button>
            </div>
          </div>
        )}

        {/* LOYALTY */}
        {tab === 'Loyalty Points' && (
          <div style={{ maxWidth:560 }}>
            <h2 style={{ ...P, fontWeight:700, fontSize:20, marginBottom:20 }}>Loyalty Points</h2>
            <div style={{ background:'#0B3D91', borderRadius:20, padding:28, marginBottom:16, color:'#fff' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontSize:12, opacity:.7, ...I, marginBottom:6 }}>Available Points</div>
                  <div style={{ ...P, fontWeight:900, fontSize:40, color:'#FFC72C', lineHeight:1 }}>{totalPoints.toLocaleString()}</div>
                  <div style={{ fontSize:13, opacity:.8, ...I, marginTop:6 }}>= approx. UGX {(totalPoints * 10).toLocaleString()} in discounts</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ ...P, fontWeight:800, fontSize:18, color:tierColor }}>{tier} Member</div>
                  <div style={{ fontSize:12, opacity:.7, ...I, marginTop:4 }}>
                    {tier === 'Bronze' ? `${2000 - totalPoints} pts to Silver` : tier === 'Silver' ? `${5000 - totalPoints} pts to Gold` : 'Top tier!'}
                  </div>
                </div>
              </div>
              <div style={{ marginTop:20, background:'rgba(255,255,255,.1)', borderRadius:10, height:8, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(100, (totalPoints / (tier==='Bronze'?2000:5000)) * 100)}%`, background:'#FFC72C', borderRadius:10, transition:'width .5s' }}/>
              </div>
            </div>
            <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0', marginBottom:16 }}>
              <h3 style={{ ...P, fontWeight:700, fontSize:15, marginBottom:14 }}>How to earn points</h3>
              {[['10 pts per UGX 1,000 spent','On every confirmed booking'],['50 bonus pts','For your first booking'],['100 pts','For referring a friend'],['200 pts','For a 5-star review']].map(([pts,desc]) => (
                <div key={pts} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <span style={{ ...P, fontWeight:600, fontSize:13, color:'#FFC72C' }}>{pts}</span>
                  <span style={{ fontSize:13, color:'#64748b', ...I }}>{desc}</span>
                </div>
              ))}
            </div>
            <button onClick={() => toast('Redemption feature launching soon!', 'success')} style={{ width:'100%', padding:14, borderRadius:12, background:'#FFC72C', color:'#0B3D91', ...P, fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>
              Redeem Points
            </button>
          </div>
        )}

        {/* PAYMENT METHODS */}
        {tab === 'Payment Methods' && (
          <div style={{ maxWidth:500 }}>
            <h2 style={{ ...P, fontWeight:700, fontSize:20, marginBottom:20 }}>Payment Methods</h2>
            <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0', marginBottom:12 }}>
              <h3 style={{ ...P, fontWeight:700, fontSize:14, marginBottom:14 }}>Saved methods</h3>
              {[
                { type:'MTN MoMo', number:'0771 xxx xxx', default:true, icon:'M' },
                { type:'Airtel Money', number:'0703 xxx xxx', default:false, icon:'A' },
              ].map(m => (
                <div key={m.type} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:m.type.includes('MTN')?'#fef9c3':'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:800, fontSize:14, color:m.type.includes('MTN')?'#92400e':'#dc2626', flexShrink:0 }}>{m.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...P, fontWeight:700, fontSize:13 }}>{m.type}</div>
                    <div style={{ fontSize:12, color:'#64748b', ...I }}>{m.number}</div>
                  </div>
                  {m.default && <span style={{ background:'#dcfce7', color:'#15803d', padding:'2px 9px', borderRadius:10, ...P, fontWeight:700, fontSize:11 }}>Default</span>}
                </div>
              ))}
            </div>
            <div style={{ background:'#fff', borderRadius:18, padding:20, border:'1px solid #E2E8F0', marginBottom:12 }}>
              <h3 style={{ ...P, fontWeight:700, fontSize:14, marginBottom:12 }}>Add card payment</h3>
              <div style={{ background:'#eff6ff', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
                <div style={{ ...P, fontWeight:600, fontSize:13, color:'#1d4ed8', marginBottom:4 }}>Visa / Mastercard via DPO Group</div>
                <p style={{ fontSize:12, color:'#1e3a8a', ...I, lineHeight:1.65 }}>Secure 3DS payment. Your card is never stored on Raylane servers. Processed by DPO Group, East Africa's leading payment gateway.</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                <div style={{ gridColumn:'1/-1' }}><label style={lS}>Card Number</label><input placeholder="1234 5678 9012 3456" style={iS}/></div>
                <div><label style={lS}>Expiry</label><input placeholder="MM / YY" style={iS}/></div>
                <div><label style={lS}>CVV</label><input placeholder="123" style={iS}/></div>
              </div>
              <button onClick={() => toast('Card saved securely via DPO Group', 'success')} style={{ width:'100%', padding:13, borderRadius:12, background:'#0B3D91', color:'#fff', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                Save Card
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}
