import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const isHome    = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const goTo = (to) => {
    setMenuOpen(false)
    if (to.startsWith('/#')) {
      const id = to.slice(2)
      if (location.pathname !== '/') { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }), 350) }
      else document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })
    } else {
      navigate(to)
    }
  }

  const isTransparent = isHome && !scrolled
  const bg = isTransparent ? 'transparent' : 'var(--blue)'

  const links = [
    { label:'Home',        to:'/' },
    { label:'Where We Go', to:'/#where-we-go' },
    { label:'Book',        to:'/book' },
    { label:'Parcels',     to:'/parcels' },
    { label:'Help',        to:'/#help' },
  ]

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:800, background:bg, transition:'background .3s', boxShadow:isTransparent?'none':'0 2px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth:'var(--container)', margin:'0 auto', padding:'0 16px', display:'flex', alignItems:'center', height:'var(--nav-h)', gap:8 }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, flexShrink:0, textDecoration:'none' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path d="M1 13 L7 3 L12 9 L16 3 L19 13" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="3" cy="14" r="1.8" fill="#0B3D91"/>
                <circle cx="17" cy="14" r="1.8" fill="#0B3D91"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, color:'var(--white)', lineHeight:1, letterSpacing:0.5 }}>RAYLANE</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:9, color:'var(--gold)', letterSpacing:2, lineHeight:1 }}>EXPRESS</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:4, marginLeft:24, flex:1 }}>
            {links.map(l => (
              <button key={l.label} onClick={() => goTo(l.to)}
                style={{ padding:'7px 14px', borderRadius:20, color:'rgba(255,255,255,0.85)', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, border:'none', background:'none', cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--gold)'; e.currentTarget.style.background='rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.85)'; e.currentTarget.style.background='none' }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto', flexShrink:0 }}>

            {/* My Account - passenger dashboard */}
            <button onClick={() => goTo('/account')}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:20, border:'1px solid rgba(255,255,255,0.35)', color:'var(--white)', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:12, background:'none', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.color='var(--gold)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; e.currentTarget.style.color='var(--white)' }}>
              {/* User icon */}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              My Account
            </button>

            {/* Book Now - primary CTA */}
            <button onClick={() => goTo('/book')}
              style={{ padding:'9px 20px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, border:'none', cursor:'pointer', boxShadow:'0 2px 10px rgba(255,199,44,0.4)', transition:'all .2s', whiteSpace:'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              Book Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
            style={{ marginLeft:'auto', padding:8, color:'var(--white)', background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
            {menuOpen
              ? <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            }
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="show-mobile" style={{ background:'var(--blue)', borderTop:'1px solid rgba(255,255,255,0.1)', padding:'12px 16px 20px' }}>
            {links.map(l => (
              <button key={l.label} onClick={() => goTo(l.to)}
                style={{ display:'block', width:'100%', textAlign:'left', padding:'13px 0', color:'rgba(255,255,255,0.9)', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:15, borderBottom:'1px solid rgba(255,255,255,0.07)', background:'none', border:'none', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                {l.label}
              </button>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
              <button onClick={() => goTo('/account')}
                style={{ padding:'12px', borderRadius:20, border:'1.5px solid rgba(255,255,255,0.3)', color:'var(--white)', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, background:'none', cursor:'pointer' }}>
                My Account
              </button>
              <button onClick={() => goTo('/book')}
                style={{ padding:'12px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, border:'none', cursor:'pointer' }}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div style={{ height:'var(--nav-h)' }}/>
    </>
  )
}
