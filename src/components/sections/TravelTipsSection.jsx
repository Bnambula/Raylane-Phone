import React from 'react'
import { travelTips } from '../../data'

const categoryColors = { Safety:'#dcfce7', Savings:'#fef9c3', Routes:'#dbeafe' }
const categoryText   = { Safety:'#15803d', Savings:'#92400e', Routes:'#1d4ed8' }

export default function TravelTipsSection() {
  return (
    <section style={{ background:'var(--gray-light)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:16 }}>
          <div>
            <div className="section-label">Knowledge Hub</div>
            <h2 className="section-title">Travel Tips & <span>Insights</span></h2>
            <p style={{ color:'var(--gray-text)', fontSize:14 }}>Smart advice for smarter, safer, cheaper travel.</p>
          </div>
          <button style={{ padding:'9px 20px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:12, cursor:'pointer' }}>
            View All Articles →
          </button>
        </div>
        <div className='resp-grid' style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {travelTips.map(tip => (
            <article key={tip.id} style={{ background:'var(--white)', borderRadius:18, overflow:'hidden', boxShadow:'var(--shadow-sm)', cursor:'pointer', transition:'all .22s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='var(--shadow-xl)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow-sm)'}}>
              <div style={{ height:168, backgroundImage:`url(${tip.image})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.35),transparent)' }}/>
                <span style={{ position:'absolute', top:12, left:12, background:categoryColors[tip.category], color:categoryText[tip.category], padding:'3px 11px', borderRadius:20, fontSize:10, fontFamily:''Poppins',sans-serif', fontWeight:700 }}>{tip.category}</span>
              </div>
              <div style={{ padding:20 }}>
                <h3 style={{ fontFamily:''Poppins',sans-serif', fontWeight:800, fontSize:15, marginBottom:8, lineHeight:1.4 }}>{tip.title}</h3>
                <p style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.7, marginBottom:14 }}>{tip.excerpt}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:11, color:'var(--gray-text)' }}>⏱ {tip.readTime} read</span>
                  <span style={{ color:'var(--blue)', fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:12 }}>Read More →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:767px){.tips-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  )


/* no resp-grid */
}