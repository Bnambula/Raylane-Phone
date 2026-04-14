import React from 'react'
import { useStore } from '../../hooks/useStore'

export default function PartnersCarousel() {
  const [state] = useStore()
  const ops = state.operators.filter(o => o.status === 'ACTIVE')

  const logos = [...ops, ...ops] // duplicate for seamless loop

  return (
    <section style={{ background:'#F5F7FA', padding:'48px 0', overflow:'hidden' }}>
      <div className="container" style={{ marginBottom:24 }}>
        <div style={{ textAlign:'center' }}>
          <div className="section-label">Our Partners</div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:22, marginBottom:6 }}>Trusted by Uganda's Best Operators</h2>
        </div>
      </div>

      <div style={{ overflow:'hidden', width:'100%' }}>
        <div className="partner-track">
          {logos.map((op, i) => (
            <div key={`${op.id}-${i}`} style={{ display:'flex', alignItems:'center', justifyContent:'center', minWidth:180, height:64, background:'#fff', borderRadius:14, border:'1.5px solid #E2E8F0', padding:'0 24px', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'#0B3D91', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:12, flexShrink:0 }}>
                  {op.company_name.split(' ').slice(0,2).map(w=>w[0]).join('')}
                </div>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:'#0F1923', whiteSpace:'nowrap' }}>{op.company_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:'center', marginTop:20 }}>
        <span style={{ fontSize:12, color:'#64748b', fontFamily:"'Inter',sans-serif" }}>{ops.length} verified operators . Updated in real-time</span>
      </div>
    </section>
  )
}
