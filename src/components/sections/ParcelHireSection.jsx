import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ParcelHireSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:"#F5F7FA", padding:"64px 0" }}>
      <div className="container">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

          {/* Parcel CTA */}
          <div style={{ borderRadius:20, overflow:"hidden", position:"relative", minHeight:220, background:"linear-gradient(135deg,#0B3D91 0%,#1a52b3 100%)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:32, cursor:"pointer" }}
            onClick={() => navigate('/parcels')}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}
            style2={{ transition:"transform .22s" }}>
            {/* bg decoration */}
            <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.05)" }}/>
            <div style={{ position:"absolute", top:20, right:40, width:80, height:80, borderRadius:"50%", background:"rgba(255,199,44,.1)" }}/>
            <div style={{ position:"absolute", top:24, right:48, fontSize:52, opacity:.9 }}>{">"}</div>
            {/* icon box */}
            <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, backdropFilter:"blur(8px)" }}>
              <svg width="26" height="26" fill="none" stroke="#FFC72C" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:22, color:"#fff", marginBottom:6 }}>Send a Parcel</div>
            <p style={{ color:"rgba(255,255,255,.8)", fontSize:14, fontFamily:"'Inter',sans-serif", lineHeight:1.6, marginBottom:18 }}>Envelopes, parcels, heavy cargo. GPS-tracked. Delivered same day. Insurance available.</p>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 24px", borderRadius:20, background:"#FFC72C", color:"#0B3D91", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, width:"fit-content" }}>
              Send Now
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          {/* Private Hire CTA */}
          <div style={{ borderRadius:20, overflow:"hidden", position:"relative", minHeight:220, background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:32, cursor:"pointer" }}
            onClick={() => navigate('/book?type=hire')}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}>
            <div style={{ position:"absolute", top:-20, right:-20, width:140, height:140, borderRadius:"50%", background:"rgba(255,199,44,.07)" }}/>
            <div style={{ position:"absolute", top:28, right:36, width:72, height:72, borderRadius:"50%", background:"rgba(255,199,44,.1)" }}/>
            {/* icon box */}
            <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
              <svg width="26" height="26" fill="none" stroke="#FFC72C" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:22, color:"#fff" }}>Private Hire</span>
              <span style={{ background:"#FFC72C", color:"#0B3D91", padding:"2px 9px", borderRadius:20, fontSize:10, fontFamily:"'Poppins',sans-serif", fontWeight:700 }}>EXCLUSIVE</span>
            </div>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:14, fontFamily:"'Inter',sans-serif", lineHeight:1.6, marginBottom:18 }}>Charter a full vehicle for your group, event, school trip, or corporate transfer. Custom routes, your schedule.</p>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 24px", borderRadius:20, border:"1.5px solid rgba(255,199,44,.6)", color:"#FFC72C", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, width:"fit-content" }}>
              Get a Quote
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
