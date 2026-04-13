import React from 'react'
const F=[
  {icon:'[FAST]',t:'Real-Time Booking',d:'Seat availability updates live. No lag, no overbooking, ever.',c:'#dbeafe'},
  {icon:'[LOCK]',t:'No Double Booking',d:'Our Seat Sync Engine locks your seat the instant payment confirms.',c:'#dcfce7'},
  {icon:'[PHONE]',t:'Mobile Money Pay',d:'MTN MoMo & Airtel Money. No bank card needed. Done in seconds.',c:'#fef9c3'},
  {icon:'[GLOBE]',t:'East Africa Coverage',d:'Kampala to Nairobi, Gulu to Kigali -- 1,000+ routes covered.',c:'#fce7f3'},
  {icon:'?',t:'Vetted Operators',d:'Every operator is verified and approved by Raylane admin.',c:'#ede9fe'},
  {icon:'[TKT]',t:'Instant QR Ticket',d:'Digital ticket via SMS and app. No printing. No queues.',c:'#ffedd5'},
]
export default function WhyChooseSection(){
  return(
    <section style={{background:'#fff',padding:'72px 0'}}>
      <div className="container">
        <div style={{textAlign:'center',marginBottom:44}}>
          <div className="section-label">Why Raylane</div>
          <h2 className="section-title">Travel Smarter with <span>Raylane Express</span></h2>
        </div>
        <div className="resp-grid">
          {F.map(f=>(
            <div key={f.t} style={{background:'#fff',borderRadius:18,padding:24,boxShadow:'0 2px 16px rgba(0,0,0,.07)',transition:'all .25s'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,.12)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 16px rgba(0,0,0,.07)'}}>
              <div style={{width:52,height:52,borderRadius:14,background:f.c,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:16}}>{f.icon}</div>
              <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:16,marginBottom:8}}>{f.t}</h3>
              <p style={{color:'#64748b',fontSize:14,lineHeight:1.7,fontFamily:"'Inter',sans-serif"}}>{f.d}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:48,background:'#0B3D91',borderRadius:20,padding:'28px 32px',display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:20}}>
          {[['500+','Verified Operators'],['2M+','Happy Passengers'],['1,000+','Routes Covered'],['99.9%','Uptime']].map(([n,l])=>(
            <div key={l} style={{textAlign:'center',color:'#fff'}}>
              <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:28,color:'#FFC72C'}}>{n}</div>
              <div style={{fontSize:13,opacity:.8,fontFamily:"'Inter',sans-serif"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
