import React from 'react'
import { useNavigate } from 'react-router-dom'

const P = { fontFamily:"'Poppins',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const linkStyle = { fontSize:13, color:'rgba(255,255,255,.62)', ...I, cursor:'pointer', background:'none', border:'none', padding:0, textAlign:'left', lineHeight:1, display:'block', marginBottom:10 }
const hStyle    = { fontSize:11, ...P, fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'1.8px', marginBottom:14 }

export default function Footer() {
  const navigate = useNavigate()
  const go = path => { navigate(path); window.scrollTo({top:0,behavior:'smooth'}) }

  return (
    <footer style={{ background:'#0a0f1e', color:'#fff' }}>
      {/* Help banner */}
      <div style={{ background:'linear-gradient(135deg,#0B3D91,#0f4fa8)', padding:'22px 0' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ ...P, fontWeight:700, fontSize:16, color:'#fff', marginBottom:4 }}>Need help? We are here 24/7</div>
            <div style={{ fontSize:13, opacity:.85, ...I }}>
              Call: <strong>+256 700 000 000</strong>&nbsp;&nbsp;·&nbsp;&nbsp;WhatsApp: <strong>+256 752 000 000</strong>&nbsp;&nbsp;·&nbsp;&nbsp;Email: <strong>support@raylaneexpress.com</strong>
            </div>
          </div>
          <button onClick={()=>go('/book')} style={{ padding:'11px 24px', borderRadius:20, background:'#FFC72C', color:'#0B3D91', ...P, fontWeight:700, fontSize:14, border:'none', cursor:'pointer', flexShrink:0 }}>
            Book Now
          </button>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container" style={{ padding:'48px 20px 28px' }}>
        <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr 1fr 1fr 1fr', gap:32, marginBottom:40 }}>

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'#FFC72C', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="18" height="15" viewBox="0 0 20 16" fill="none"><path d="M1 13L7 3l5 6 4-6 3 10" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ ...P, fontWeight:800, fontSize:15, color:'#fff', lineHeight:1 }}>Raylane Express</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.45)', ...P }}>Uganda and East Africa</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.55)', ...I, lineHeight:1.75, marginBottom:20, maxWidth:240 }}>Uganda's first real-time bus and taxi booking platform. Safe, reliable intercity travel across East Africa.</p>

            {/* Socials */}
            <div style={{ display:'flex', gap:10 }}>
              {[
                { icon:<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, label:'Facebook', url:'#' },
                { icon:<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>, label:'Twitter / X', url:'#' },
                { icon:<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, label:'Instagram', url:'#' },
                { icon:<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>, label:'WhatsApp', url:'https://wa.me/256700000000' },
              ].map(({icon,label,url})=>(
                <a key={label} href={url} aria-label={label} target="_blank" rel="noreferrer" style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.65)', transition:'all .2s', textDecoration:'none' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,199,44,.2)';e.currentTarget.style.color='#FFC72C'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.color='rgba(255,255,255,.65)'}}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Travel */}
          <div>
            <div style={hStyle}>Travel</div>
            <button style={linkStyle} onClick={()=>go('/book')}>Book a Seat</button>
            <button style={linkStyle} onClick={()=>go('/book?advance=true')}>Advance Booking</button>
            <button style={linkStyle} onClick={()=>go('/book?type=hire')}>Private Hire</button>
            <button style={linkStyle} onClick={()=>go('/parcels')}>Send a Parcel</button>
            <button style={linkStyle} onClick={()=>go('/parcels?tab=track')}>Track a Parcel</button>
            <button style={linkStyle} onClick={()=>go('/#tourist-planner')}>Plan a Trip</button>
          </div>

          {/* Support */}
          <div>
            <div style={hStyle}>Support</div>
            <button style={linkStyle} onClick={()=>go('/faq')}>Help &amp; FAQ</button>
            <button style={linkStyle} onClick={()=>go('/contact')}>Contact Us</button>
            <button style={linkStyle} onClick={()=>go('/lost-found')}>Lost &amp; Found</button>
            <button style={linkStyle} onClick={()=>go('/refund')}>Refund Policy</button>
            <button style={linkStyle} onClick={()=>go('/parcels?tab=track')}>Track Order</button>
            <button style={linkStyle} onClick={()=>go('/safety')}>Safety Information</button>
          </div>

          {/* Company */}
          <div>
            <div style={hStyle}>Company</div>
            <button style={linkStyle} onClick={()=>go('/about')}>About Raylane</button>
            <button style={linkStyle} onClick={()=>go('/partner')}>Become an Operator</button>
            <button style={linkStyle} onClick={()=>go('/partner')}>Partner Programme</button>
            <button style={linkStyle} onClick={()=>go('/careers')}>Careers</button>
            <button style={linkStyle} onClick={()=>go('/press')}>Press &amp; Media</button>
            <button style={linkStyle} onClick={()=>go('/blog')}>Travel Blog</button>
          </div>

          {/* Legal */}
          <div>
            <div style={hStyle}>Legal</div>
            <button style={linkStyle} onClick={()=>go('/terms')}>Terms of Service</button>
            <button style={linkStyle} onClick={()=>go('/privacy')}>Privacy Policy</button>
            <button style={linkStyle} onClick={()=>go('/refund')}>Cancellation &amp; Refunds</button>
            <button style={linkStyle} onClick={()=>go('/cookies')}>Cookie Policy</button>
            <button style={linkStyle} onClick={()=>go('/partner')}>Operator Agreement</button>
            <button style={linkStyle} onClick={()=>go('/accessibility')}>Accessibility</button>
          </div>
        </div>

        {/* Payment badges */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:20, marginBottom:20 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', ...P, textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>We Accept</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            {['MTN MoMo','Airtel Money','Visa','Mastercard (soon)'].map(m=>(
              <span key={m} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'5px 12px', fontSize:12, ...P, fontWeight:600, color:'rgba(255,255,255,.65)' }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12, color:'rgba(255,255,255,.35)', ...I, margin:0 }}>
            &copy; {new Date().getFullYear()} Raylane Express Uganda Ltd. All rights reserved. Licensed operator under UNRA.
          </p>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {['Terms','Privacy','Refunds','Lost & Found','Accessibility'].map(l=>(
              <button key={l} style={{ ...linkStyle, fontSize:12, marginBottom:0, color:'rgba(255,255,255,.35)' }} onClick={()=>go(`/${l.toLowerCase().replace(/[& ]+/g,'-')}`)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:520px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  )
}
