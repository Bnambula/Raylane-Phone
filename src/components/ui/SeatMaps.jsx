/**
 * RAYLANE EXPRESS — SEAT MAP COMPONENTS
 * Right-Hand Drive Uganda bus layouts
 * 67-seater: 1 front passenger beside driver (left), 
 *   rear: row 1 = 3 seats (door side), then 3+2 layout per row, last row = 6
 */
import React from 'react'

export const SEAT_COLORS = {
  available: { bg:'#4a7fd4', border:'#3568c0', text:'#fff' },
  booked:    { bg:'#d1d5db', border:'#9ca3af', text:'#9ca3af' },
  selected:  { bg:'#FFC72C', border:'#d4a017', text:'#0B3D91' },
  locked:    { bg:'#fca5a5', border:'#ef4444', text:'#991b1b' },
}

function SeatBtn({ n, state='available', onToggle, size=30 }) {
  if (!n) return <div style={{ width:size, height:size+4, flexShrink:0 }}/>
  const c = SEAT_COLORS[state]||SEAT_COLORS.available
  const disabled = state==='booked'||state==='locked'
  return (
    <div onClick={()=>!disabled&&onToggle&&onToggle(n)} title={`Seat ${n}`}
      className="seat-cell"
      style={{ width:size, height:size+4, borderRadius:6, background:c.bg, border:`2px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:disabled?'not-allowed':'pointer', fontFamily:''Poppins',sans-serif', fontWeight:700, fontSize:size<26?9:size<30?10:11, color:c.text, flexShrink:0, transition:'transform .12s', userSelect:'none', boxShadow:state==='selected'?'0 0 8px rgba(255,199,44,0.6)':state==='available'?'0 1px 2px rgba(0,0,0,0.12)':'none' }}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.transform='scale(1.14)'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='none'}}>
      {n}
    </div>
  )
}

function getState(n, booked=[], locked=[], selected=[]) {
  if(booked.includes(n)) return 'booked'
  if(locked.includes(n)) return 'locked'
  if(selected.includes(n)) return 'selected'
  return 'available'
}

function Row({ seats, booked, locked, selected, onToggle, size, gap=3 }) {
  return (
    <div style={{ display:'flex', gap, alignItems:'center' }}>
      {seats.map((n,i) => n===null
        ? <div key={`a${i}`} style={{ width:16, flexShrink:0 }}/>
        : <SeatBtn key={n||`b${i}`} n={n||0} state={n?getState(n,booked,locked,selected):'available'} onToggle={onToggle} size={size}/>
      )}
    </div>
  )
}

function CabBox({ lines=[], sz=28 }) {
  return (
    <div style={{ width:sz+6, background:'#374151', borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'6px 4px', flexShrink:0 }}>
      {lines.map((l,i)=><div key={i} style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', fontSize:8, fontFamily:''Poppins',sans-serif', fontWeight:700, color:'#9ca3af', letterSpacing:1, lineHeight:1 }}>{l}</div>)}
    </div>
  )
}

/* ═══════════════════════════════
   67-SEATER (RHD Uganda spec)
   Front: Driver (right) + 1 passenger (left front)
   Rows: 3 on door side only, then 3+2 per row, last row 6
═══════════════════════════════ */
export function BusSeat67({ booked=[], locked=[], selected=[], onToggle }) {
  const sz=26, g=3
  const p=(n)=>getState(n,booked,locked,selected)

  return (
    <div style={{ background:'#f9fafb', border:'3px solid #d1d5db', borderRadius:16, padding:14, display:'inline-block' }}>
      {/* Row 0: Driver (right/left in RHD) + front passenger */}
      <div style={{ display:'flex', gap:g, marginBottom:8, alignItems:'center' }}>
        {/* Front passenger seat - LEFT side */}
        <SeatBtn n={1} state={p(1)} onToggle={onToggle} size={sz}/>
        <div style={{ flex:1, textAlign:'center', fontSize:9, color:'#6b7280', fontFamily:''Poppins',sans-serif' }}>(front)</div>
        {/* Driver box - RIGHT side (RHD) */}
        <CabBox lines={['D','R','V','R']} sz={sz}/>
      </div>

      <div style={{ height:1, background:'#e5e7eb', margin:'6px 0 8px', borderRadius:1, borderBottom:'1px dashed #d1d5db' }}/>

      {/* GUIDE seat */}
      <div style={{ display:'flex', gap:g, marginBottom:6, alignItems:'center' }}>
        <div style={{ width:sz+6, background:'#4b5563', borderRadius:8, height:sz+4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontFamily:''Poppins',sans-serif', fontWeight:700, color:'#9ca3af' }}>GDE</div>
        <div style={{ flex:1 }}/>
      </div>

      {/* Door side first row: only 3 seats (seats 2,3,4) on LEFT of aisle */}
      <div style={{ display:'flex', gap:g, marginBottom:g, alignItems:'center' }}>
        <Row seats={[2,3,4]} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
        <div style={{ width:16 }}/>
        {/* right side empty for door row */}
        <div style={{ width:sz, height:sz+4 }}/>
        <div style={{ width:sz, height:sz+4 }}/>
      </div>

      {/* Main rows: 3 + 2 across aisle (seats 5 onwards) */}
      {[
        [5, 6, 7,  null, 8, 9],
        [10,11,12, null,13,14],
        [15,16,17, null,18,19],
        [20,21,22, null,23,24],
        [25,26,27, null,28,29],
        [30,31,32, null,33,34],
        [35,36,37, null,38,39],
        [40,41,42, null,43,44],
        [45,46,47, null,48,49],
        [50,51,52, null,53,54],
        [55,56,57, null,58,59],
      ].map((row,i) => (
        <div key={i} style={{ display:'flex', gap:g, marginBottom:g }}>
          <Row seats={row} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
        </div>
      ))}

      {/* Last row: 6 seats across full width */}
      <div style={{ display:'flex', gap:g, marginTop:2 }}>
        <Row seats={[60,61,62,63,64,65]} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
        <Row seats={[66,67]} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
      </div>

      {/* Bus outline decoration */}
      <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', fontSize:9, color:'#9ca3af', fontFamily:''Poppins',sans-serif' }}>
        <span>← DOOR (LEFT)</span><span>67-SEATER COACH</span><span>DRIVER (RIGHT) →</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════
   55-SEATER (RHD)
═══════════════════════════════ */
export function BusSeat55({ booked=[], locked=[], selected=[], onToggle }) {
  const sz=28, g=3
  const p=(n)=>getState(n,booked,locked,selected)
  return (
    <div style={{ background:'#f9fafb', border:'3px solid #d1d5db', borderRadius:16, padding:14, display:'inline-block' }}>
      {/* Driver + front passenger */}
      <div style={{ display:'flex', gap:g, marginBottom:8, alignItems:'center' }}>
        <SeatBtn n={1} state={p(1)} onToggle={onToggle} size={sz}/>
        <div style={{ flex:1 }}/>
        <CabBox lines={['D','R','V','R']} sz={sz}/>
      </div>
      <div style={{ height:1, background:'#e5e7eb', margin:'4px 0 6px', borderBottom:'1px dashed #d1d5db' }}/>
      <div style={{ display:'flex', gap:g, marginBottom:4 }}>
        <div style={{ width:sz+6, background:'#4b5563', borderRadius:8, height:sz+4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontFamily:''Poppins',sans-serif', fontWeight:700, color:'#9ca3af' }}>GDE</div>
      </div>
      {/* Rows 2+2 per side */}
      {[
        [2,3,null,4,5],[6,7,null,8,9],[10,11,null,12,13],
        [14,15,null,16,17],[18,19,null,20,21],[22,23,null,24,25],
        [26,27,null,28,29],[30,31,null,32,33],[34,35,null,36,37],
        [38,39,null,40,41],[42,43,null,44,45],[46,47,null,48,49],
      ].map((row,i)=>(
        <div key={i} style={{ display:'flex', gap:g, marginBottom:g }}>
          <Row seats={row} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
        </div>
      ))}
      {/* Last row 4 */}
      <div style={{ display:'flex', gap:g, marginTop:2 }}>
        <Row seats={[50,51,52,53,54,55]} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
      </div>
      <div style={{ marginTop:8, paddingTop:6, borderTop:'1px solid #e5e7eb', fontSize:9, color:'#9ca3af', fontFamily:''Poppins',sans-serif', textAlign:'center' }}>55-SEATER COACH</div>
    </div>
  )
}

/* ═══════════════════════════════
   65-SEATER (RHD)
═══════════════════════════════ */
export function BusSeat65({ booked=[], locked=[], selected=[], onToggle }) {
  const sz=26, g=3
  const p=(n)=>getState(n,booked,locked,selected)
  return (
    <div style={{ background:'#f9fafb', border:'3px solid #d1d5db', borderRadius:16, padding:14, display:'inline-block' }}>
      <div style={{ display:'flex', gap:g, marginBottom:8 }}>
        <SeatBtn n={1} state={p(1)} onToggle={onToggle} size={sz}/>
        <div style={{ flex:1 }}/>
        <CabBox lines={['D','R','V','R']} sz={sz}/>
      </div>
      <div style={{ height:1, background:'#e5e7eb', margin:'4px 0 6px', borderBottom:'1px dashed #d1d5db' }}/>
      <div style={{ display:'flex', gap:g, marginBottom:4 }}>
        <div style={{ width:sz+6, background:'#4b5563', borderRadius:8, height:sz+4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontFamily:''Poppins',sans-serif', fontWeight:700, color:'#9ca3af' }}>GDE</div>
      </div>
      {[
        [2,3,null,4,5],[6,7,null,8,9],[10,11,null,12,13],
        [14,15,null,16,17],[18,19,null,20,21],[22,23,null,24,25],
        [26,27,null,28,29],[30,31,null,32,33],[34,35,null,36,37],
        [38,39,null,40,41],[42,43,null,44,45],[46,47,null,48,49],
        [50,51,null,52,53],[54,55,null,56,57],[58,59,null,60,61],
      ].map((row,i)=>(
        <div key={i} style={{ display:'flex', gap:g, marginBottom:g }}>
          <Row seats={row} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
        </div>
      ))}
      <div style={{ display:'flex', gap:g, marginTop:2 }}>
        <Row seats={[62,63,64,65]} booked={booked} locked={locked} selected={selected} onToggle={onToggle} size={sz} gap={g}/>
        <div style={{ width:16 }}/>
      </div>
      <div style={{ marginTop:8, paddingTop:6, borderTop:'1px solid #e5e7eb', fontSize:9, color:'#9ca3af', fontFamily:''Poppins',sans-serif', textAlign:'center' }}>65-SEATER COACH</div>
    </div>
  )
}

/* ═══════════════════════════════
   14-SEATER TAXI (RHD)
═══════════════════════════════ */
export function TaxiSeat14({ booked=[], locked=[], selected=[], onToggle }) {
  const sz=34, g=5
  const p=(n)=>getState(n,booked,locked,selected)
  return (
    <div style={{ background:'#f9fafb', border:'3px solid #d1d5db', borderRadius:12, padding:14, display:'inline-block', maxWidth:220 }}>
      <div style={{ display:'flex', gap:g, marginBottom:10, alignItems:'center' }}>
        <SeatBtn n={1} state={p(1)} onToggle={onToggle} size={sz}/>
        <SeatBtn n={2} state={p(2)} onToggle={onToggle} size={sz}/>
        <div style={{ flex:1 }}/>
        <CabBox lines={['DRV']} sz={sz}/>
      </div>
      <div style={{ height:1, background:'#e5e7eb', marginBottom:8 }}/>
      {[[3,4,null,5],[6,7,null,8],[9,10,null,11],[12,13,null,14]].map((row,ri)=>(
        <div key={ri} style={{ display:'flex', gap:g, marginBottom:ri<3?g:0 }}>
          {row.map((n,ci)=>n===null?<div key={ci} style={{ width:14 }}/>:<SeatBtn key={n} n={n} state={p(n)} onToggle={onToggle} size={sz}/>)}
        </div>
      ))}
      <div style={{ marginTop:8, paddingTop:6, borderTop:'1px solid #e5e7eb', fontSize:9, color:'#9ca3af', fontFamily:''Poppins',sans-serif', textAlign:'center' }}>14-SEATER TAXI (RHD)</div>
    </div>
  )
}

export function SeatLegend({ compact=false }) {
  return (
    <div style={{ display:'flex', gap:compact?8:14, flexWrap:'wrap', alignItems:'center' }}>
      {[['available','Available','#4a7fd4','#3568c0'],['selected','Selected','#FFC72C','#d4a017'],['booked','Booked','#d1d5db','#9ca3af'],['locked','Locked','#fca5a5','#ef4444']].map(([k,l,bg,brd])=>(
        <div key={k} style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:compact?14:18, height:compact?16:20, borderRadius:4, background:bg, border:`2px solid ${brd}`, flexShrink:0 }}/>
          <span style={{ fontFamily:''Poppins',sans-serif', fontWeight:600, fontSize:compact?10:12, color:'var(--gray-text)' }}>{l}</span>
        </div>
      ))}
    </div>
  )
}
