import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CITY_CARDS = [
  { city:'Kampala', from:'Kampala', to:'Mbale',   price:25000, img:'https://images.unsplash.com/photo-1572799532398-7de2b5abad5a?w=400&q=80', popular:true },
  { city:'Mbale',   from:'Kampala', to:'Mbale',   price:25000, img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', popular:true },
  { city:'Gulu',    from:'Kampala', to:'Gulu',    price:35000, img:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80', popular:false },
  { city:'Nairobi', from:'Kampala', to:'Nairobi', price:60000, img:'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&q=80', popular:false },
  { city:'Kigali',  from:'Kampala', to:'Kigali',  price:55000, img:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80', popular:false },
  { city:'Arua',    from:'Kampala', to:'Arua',    price:40000, img:'https://images.unsplash.com/photo-1624463029481-3b25f7831a87?w=400&q=80', popular:false },
  { city:'Juba',    from:'Kampala', to:'Juba',    price:60000, img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', popular:false },
  { city:'Mbarara', from:'Kampala', to:'Mbarara', price:30000, img:'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80', popular:false },
]

const MAP_DOTS = [
  {name:'Kampala',x:42,y:62,isCapital:true},{name:'Mbale',x:67,y:52,price:25000},{name:'Gulu',x:43,y:20,price:35000},
  {name:'Arua',x:18,y:18,price:40000},{name:'Mbarara',x:32,y:75,price:30000},{name:'Jinja',x:57,y:60,price:15000},
]

export default function WhereWeGoSection() {
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()

  return (
    <section id="where-we-go" style={{ background:'linear-gradient(180deg,#0B3D91 0%,#082d6e 100%)', color:'#fff', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,199,44,.15)', padding:'5px 14px', borderRadius:20, marginBottom:14 }}>
            <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#FFC72C' }}>Coverage</span>
          </div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:'clamp(1.8rem,3vw,2.6rem)', marginBottom:10 }}>
            Where We <span style={{ color:'#FFC72C' }}>Go</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,.75)', fontSize:15, maxWidth:500, margin:'0 auto' }}>Connecting you to all major cities in Uganda &amp; East Africa</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:28, alignItems:'start' }}>
          {/* Map */}
          <div style={{ background:'rgba(255,255,255,.06)', borderRadius:20, padding:20, backdropFilter:'blur(8px)' }}>
            <div style={{ position:'relative', paddingBottom:'110%' }}>
              <svg viewBox="0 0 100 110" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                <path d="M28 10L45 8L60 12L72 22L78 35L75 50L72 65L68 78L55 88L42 90L30 85L22 75L18 62L15 48L16 32L22 18Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,199,44,.4)" strokeWidth=".8"/>
                {MAP_DOTS.filter(c=>!c.isCapital).map(c=><line key={c.name} x1="42" y1="62" x2={c.x} y2={c.y} stroke="rgba(255,199,44,.2)" strokeWidth=".6" strokeDasharray="2,2"/>)}
                {MAP_DOTS.map(c=>(
                  <g key={c.name} style={{cursor:'pointer'}} onMouseEnter={()=>setHovered(c.name)} onMouseLeave={()=>setHovered(null)}>
                    {c.isCapital&&<circle cx={c.x} cy={c.y} r="6" fill="rgba(255,199,44,.2)" stroke="rgba(255,199,44,.5)" strokeWidth=".5"/>}
                    <circle cx={c.x} cy={c.y} r={c.isCapital?3.5:2.5} fill={c.isCapital?'#FFC72C':hovered===c.name?'#FFC72C':'#fff'} stroke={c.isCapital?'#fff':'rgba(255,255,255,.5)'} strokeWidth=".8" style={{transition:'all .2s'}}/>
                    <text x={c.x+4} y={c.y-4} fill="white" fontSize="4" fontFamily="Poppins,sans-serif" fontWeight="bold">{c.name}</text>
                    {hovered===c.name&&c.price&&<text x={c.x+4} y={c.y+8} fill="#FFC72C" fontSize="3.5" fontFamily="Poppins,sans-serif" fontWeight="bold">UGX {(c.price/1000).toFixed(0)}k</text>}
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* City Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {CITY_CARDS.map(card => (
              <div key={card.city} onClick={() => navigate(`/book?from=${card.from}&to=${card.to}`)}
                style={{ background:'rgba(255,255,255,.07)', borderRadius:14, overflow:'hidden', cursor:'pointer', border:'1px solid rgba(255,255,255,.1)', transition:'all .25s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.14)';e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.transform='none'}}>
                <div style={{ height:72, backgroundImage:`url(${card.img})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, background:'rgba(11,61,145,.35)' }}/>
                  {card.popular&&<span style={{ position:'absolute', top:6, left:6, background:'#FFC72C', color:'#0B3D91', padding:'2px 7px', borderRadius:10, fontSize:9, fontFamily:"'Poppins',sans-serif", fontWeight:800 }}>Popular</span>}
                  <span style={{ position:'absolute', bottom:6, left:8, color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, textShadow:'0 1px 3px rgba(0,0,0,.5)' }}>{card.city}</span>
                </div>
                <div style={{ padding:'8px 10px' }}>
                  <div style={{ fontSize:11, opacity:.7, marginBottom:2, fontFamily:"'Inter',sans-serif" }}>{card.from} to {card.city}</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, color:'#FFC72C' }}>From UGX {card.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/book')} style={{ gridColumn:'1/-1', background:'#FFC72C', color:'#0B3D91', borderRadius:14, padding:14, display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:14, border:'none', transition:'all .2s' }}>
              View All Routes ->
            </button>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){#where-we-go .where-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
