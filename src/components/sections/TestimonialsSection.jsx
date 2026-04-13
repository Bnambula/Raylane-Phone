import React,{useState,useEffect} from 'react'
import {testimonials} from '../../data'
const C=['#0B3D91','#8B1A1A','#1a6b1a','#7c3aed','#c2410c']
export default function TestimonialsSection(){
  const[a,setA]=useState(0)
  useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%testimonials.length),5000);return()=>clearInterval(t)},[])
  return(
    <section style={{background:'#F5F7FA',padding:'72px 0'}}>
      <div className="container">
        <div style={{textAlign:'center',marginBottom:40}}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What Travelers <span>Say</span></h2>
        </div>
        <div style={{background:'#0B3D91',borderRadius:22,padding:'32px 36px',color:'#fff',marginBottom:28,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-16,right:-10,fontSize:100,opacity:.06,fontFamily:'Georgia',lineHeight:1}}>"</div>
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:20,alignItems:'center'}}>
            <div style={{width:64,height:64,borderRadius:18,background:'#FFC72C',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:20,color:'#0B3D91',flexShrink:0}}>{testimonials[a].avatar}</div>
            <div>
              <p style={{fontSize:'1rem',lineHeight:1.8,opacity:.95,marginBottom:14,fontStyle:'italic',fontFamily:"'Inter',sans-serif"}}>"{testimonials[a].text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
                <div>
                  <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:15}}>{testimonials[a].name}</div>
                  <div style={{opacity:.7,fontSize:13,fontFamily:"'Inter',sans-serif"}}>{testimonials[a].role} . {testimonials[a].city}</div>
                </div>
                <div style={{marginLeft:'auto',display:'flex',gap:2}}>{[...Array(testimonials[a].rating)].map((_,i)=><span key={i} style={{color:'#FFC72C',fontSize:15}}>*</span>)}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'center'}}>
          {testimonials.map((_,i)=>(
            <button key={i} onClick={()=>setA(i)} style={{width:i===a?26:8,height:8,borderRadius:4,background:i===a?'#0B3D91':'#E2E8F0',border:'none',cursor:'pointer',transition:'all .3s'}}/>
          ))}
        </div>
      </div>
    </section>
  )
}
