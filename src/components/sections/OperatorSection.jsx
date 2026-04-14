import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconChart, IconUsers, IconPhone, IconCheck, IconBus, IconCash } from '../ui/Icons'

const BENEFITS = [
  { Icon:IconChart, title:'Digital Operations',      desc:'Replace paper manifests with a real-time digital dashboard. Manage routes, bookings, and passengers from your phone.' },
  { Icon:IconUsers, title:'Fill More Seats',         desc:'Our platform exposes your trips to thousands of passengers. Top operators report 40% or more revenue growth within 6 months.' },
  { Icon:IconPhone, title:'Mobile Money Payouts',    desc:'Receive your net earnings directly to your MTN or Airtel MoMo account after each trip loads. No delays, no paperwork.' },
  { Icon:IconCheck, title:'Transparent Pricing',     desc:'8% commission on platform bookings only. Zero setup fee, zero monthly fee for the base tier. Pay only when you earn.' },
  { Icon:IconBus,   title:'Fleet Management',        desc:'Track vehicle fitness, insurance expiry, driver licences, and maintenance schedules. Get alerts before they expire.' },
  { Icon:IconCash,  title:'Financial Reporting',     desc:'Full P&L, cost center, vendor management, and CSV export for your accountant. Know exactly where every shilling goes.' },
]

export default function OperatorSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'#F5F7FA', padding:'72px 0' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div>
            <div className="section-label">For Operators</div>
            <h2 className="section-title">Why Operators <span>Choose Raylane</span></h2>
            <p className="section-sub" style={{ marginBottom:32 }}>Uganda's 800,000+ transport operators finally have the operating system they deserve.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {BENEFITS.map(({ Icon, title, desc }) => (
                <div key={title} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={20} color="#FFC72C"/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, marginBottom:4 }}>{title}</div>
                    <p style={{ color:'#64748b', fontSize:13, lineHeight:1.7, fontFamily:"'Inter',sans-serif" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/partner')} style={{ marginTop:28, padding:'14px 32px', borderRadius:20, background:'#0B3D91', color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, border:'none', cursor:'pointer', boxShadow:'0 4px 18px rgba(11,61,145,.3)' }}>
              Apply to Join Raylane
            </button>
          </div>
          <div style={{ background:'#0B3D91', borderRadius:24, padding:32, color:'#fff' }}>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:18, marginBottom:20, color:'#FFC72C' }}>Operator Snapshot</div>
            {[['Operators on platform','25+ active'],['Average seat fill rate','78% per trip'],['Revenue growth (6 months)','40%+'],['Payout speed','Same day, MoMo'],['Setup cost','Zero'],['Base commission','8% on bookings']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.1)', alignItems:'center' }}>
                <span style={{ fontSize:14, opacity:.8, fontFamily:"'Inter',sans-serif" }}>{k}</span>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:'#FFC72C' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
