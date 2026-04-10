import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const scrollTo = id => { const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}) }

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const go = (path, hash) => {
    if (hash) {
      if (location.pathname !== '/') { navigate('/'); setTimeout(() => scrollTo(hash), 350) }
      else scrollTo(hash)
    } else { navigate(path); window.scrollTo({top:0,behavior:'smooth'}) }
  }

  const COLS = [
    { title:'Company', links:[
      {l:'About Us',path:'/',hash:'how-it-works'},{l:'Careers',path:'/'},{l:'Blog',path:'/'},
      {l:'Press',path:'/'},{l:'Partner With Us',path:'/partner'},{l:'Admin Login',path:'/admin'},
    ]},
    { title:'Services', links:[
      {l:'Book Travel',path:'/book'},{l:'Send Parcel',path:'/parcels'},{l:'Charter Vehicle',path:'/book?charter=true'},
      {l:'Group Booking',path:'/book'},{l:'Tourist Planning',path:'/',hash:'tourist-planner'},{l:'Special Hire',path:'/book'},
    ]},
    { title:'Support', links:[
      {l:'Help Center',path:'/',hash:'help'},{l:'Contact Us',path:'/'},{l:'FAQs',path:'/'},
      {l:'Track Parcel',path:'/parcels?tab=track'},{l:'Payment Issues',path:'/'},{l:'Report Issue',path:'/'},
    ]},
    { title:'Legal', links:[
      {l:'Terms & Conditions',path:'/'},{l:'Privacy Policy',path:'/'},{l:'Refund Policy',path:'/'},
      {l:'Cookie Policy',path:'/'},{l:'Operator Agreement',path:'/partner'},{l:'Data Protection',path:'/'},
    ]},
  ]

  return (
    <footer id="help" style={{ background:'#0a0f1e', color:'rgba(255,255,255,.8)', padding:'60px 0 0' }}>
      <div className="container">
        {/* Help banner */}
        <div style={{ background:'linear-gradient(135deg,#0B3D91,#0f4fa8)', borderRadius:18, padding:'24px 28px', marginBottom:48, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:18, color:'#fff', marginBottom:4 }}>Need Help? We're available 24/7</div>
            <div style={{ fontSize:13, opacity:.8, fontFamily:"'Inter',sans-serif" }}>
              Call: <strong>+256 700 000 000</strong> · WhatsApp: <strong>+256 752 000 000</strong> · Email: <strong>support@raylaneexpress.com</strong>
            </div>
            <div style={{ fontSize:12, opacity:.65, marginTop:4, fontFamily:"'Inter',sans-serif" }}>
              Office: Plot 14, Kampala Coach Park, Kampala, Uganda
            </div>
          </div>
          <button onClick={() => navigate('/book')} style={{ padding:'12px 24px', borderRadius:20, background:'#FFC72C', color:'#0B3D91', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, border:'none', cursor:'pointer', flexShrink:0 }}>
            Book Now →
          </button>
        </div>

        {/* Main grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr repeat(4,1fr)', gap:28, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#FFC72C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M1 15L8 3l5 6 4-6 3 10" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3" cy="16" r="2" fill="#0B3D91"/><circle cx="19" cy="16" r="2" fill="#0B3D91"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:16, color:'#fff', lineHeight:1 }}>RAYLANE</div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:500, fontSize:9, color:'#FFC72C', letterSpacing:2.5, marginTop:1 }}>EXPRESS</div>
              </div>
            </div>
            <p style={{ fontSize:13, lineHeight:1.8, opacity:.6, marginBottom:18, fontFamily:"'Inter',sans-serif" }}>Uganda's first real-time bus &amp; taxi booking platform. Connecting cities, transforming travel.</p>
            <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
              {[['FB','#1877f2'],['TW','#1da1f2'],['IG','#e1306c'],['WA','#25d366'],['YT','#ff0000']].map(([s,c]) => (
                <a key={s} href="#" style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'center', color:c, fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:10, border:'1px solid rgba(255,255,255,.08)', transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background=c;e.currentTarget.style.color='#fff'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.color=c}}>{s}</a>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {[['Google Play','Coming Soon'],['App Store','Coming Soon']].map(([s,sub]) => (
                <button key={s} style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.75)', padding:'8px 12px', borderRadius:9, fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:11, display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
                  <span>{s}</span><span style={{ fontSize:9, opacity:.5 }}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, color:'#fff', marginBottom:16, textTransform:'uppercase', letterSpacing:1.5 }}>{col.title}</h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
                {col.links.map(({ l, path, hash }) => (
                  <li key={l}>
                    <button onClick={() => go(path, hash)} style={{ color:'rgba(255,255,255,.55)', fontSize:13, fontFamily:"'Inter',sans-serif", background:'none', border:'none', cursor:'pointer', padding:0, textAlign:'left', transition:'color .2s' }}
                      onMouseEnter={e=>e.target.style.color='#FFC72C'}
                      onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.55)'}>{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', padding:'20px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontSize:12, opacity:.4, fontFamily:"'Inter',sans-serif" }}>© {new Date().getFullYear()} Raylane Express Ltd. All rights reserved. Kampala, Uganda.</span>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            {[['MTN MoMo','#ffc300'],['Airtel Money','#e4002b']].map(([n,c])=>(
              <span key={n} style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:c, padding:'3px 10px', borderRadius:7, fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:10 }}>{n}</span>
            ))}
            <span style={{ fontSize:11, opacity:.35, fontFamily:"'Inter',sans-serif" }}>🔐 SSL · 🇺🇬 Made in Uganda</span>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){footer .footer-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:600px){footer .footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  )
}
