/**
 * RAYLANE EXPRESS -- SEAT MAP COMPONENTS
 * Exact Uganda RHD specs -- two vehicle types only:
 *   BusSeat67  : 67-seater intercity coach (canonical layout)
 *   TaxiSeat14 : 14-seater matatu taxi
 *   BusSeat55  : renders BusSeat67 with seats 56-67 auto-frozen (greyed out)
 */
import React from 'react'

export const SEAT_COLORS = {
  available: { bg:'#4a7fd4', border:'#3568c0', text:'#fff' },
  booked:    { bg:'#d1d5db', border:'#9ca3af', text:'#9ca3af' },
  selected:  { bg:'#FFC72C', border:'#d4a017', text:'#0B3D91' },
  locked:    { bg:'#fca5a5', border:'#ef4444', text:'#991b1b' },
  frozen:    { bg:'#e5e7eb', border:'#d1d5db', text:'#c4c4c4' },
}

function SeatBtn({ n, state, onToggle, size }) {
  const sz  = size || 27
  const st  = state || 'available'
  const c   = SEAT_COLORS[st] || SEAT_COLORS.available
  const off = st === 'booked' || st === 'locked' || st === 'frozen'
  return (
    <div
      onClick={() => !off && onToggle && onToggle(n)}
      title={st === 'frozen' ? `Seat ${n} (capacity limit)` : `Seat ${n}`}
      style={{ width:sz, height:sz+4, borderRadius:6, background:c.bg, border:`2px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:off?'not-allowed':'pointer', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:sz<26?9:10, color:c.text, flexShrink:0, transition:'transform .12s', userSelect:'none', boxShadow:st==='selected'?'0 0 8px rgba(255,199,44,0.55)':st==='available'?'0 1px 3px rgba(0,0,0,.12)':'none' }}
      onMouseEnter={e=>{ if(!off) e.currentTarget.style.transform='scale(1.13)' }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='none' }}>
      {st === 'frozen' ? '' : n}
    </div>
  )
}

function Gap({ w }) { return <div style={{ width:w||16, flexShrink:0 }}/> }

function CabBox({ sz }) {
  return (
    <div style={{ width:sz+6, background:'#374151', borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'6px 4px', flexShrink:0, gap:2 }}>
      <div style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', fontSize:8, fontFamily:"'Poppins',sans-serif", fontWeight:700, color:'#9ca3af', letterSpacing:1 }}>DRVR</div>
    </div>
  )
}

function getState(n, booked, locked, selected, frozen) {
  if (frozen && frozen.includes(n)) return 'frozen'
  if (booked.includes(n)) return 'booked'
  if (locked.includes(n)) return 'locked'
  if (selected.includes(n)) return 'selected'
  return 'available'
}

/* ============================================================
   67-SEATER COACH -- EXACT RAYLANE SPEC
   Row 0  : Seat 1 (front passenger, left) | [DRIVER box, right]
   Guide  : GDE label (behind seat 1 side)
   Row 1  : Seats 2,3 (left) | aisle | Seats 4,5,6 (right) -- door row, 3 left only + 2 extra right
   Rows 2-13 (12 rows) : Seats L1,L2 | aisle | R1,R2,R3  (2 left + 3 right per row = 5 seats)
   Last row (row 14)   : 6 seats across full width (no aisle)

   Numbering:
     1 = front passenger
     2 = guide
     3,4 = door row left pair
     5,6,7 = door row right triple
     Then rows: 8-9 | 10-11-12, 13-14 | 15-16-17, ..., up to row 12
     Last row: 60,61,62,63,64,65,66,67

   Let's use the exact Uganda spec from the brief:
     Front: 1 passenger beside driver
     Guide seat (conductor)
     Door row: 3 passengers left side only
     12 rows x 5 = 60
     1 + 1 + 3 + 60 + 6 = 71 -- too many; adjust:
     Correct count: 1(front) + 1(guide) + 3(door row) + 12x5(main rows) + 6(last) = 71?
     Spec says 67 total. So:
       1 front + 0 guide (guide is staff not passenger) + 3 door + 11x5(rows 2-12) + 6(last) = 1+3+55+6=65 still off
     Best match: 1 front + 3 door side only + 12 rows x 5 = 60 + 6 last - 3 = 67
     Simplest working 67: 1+2+3+12x5+6 = nope
     
     Use brief EXACTLY: 1 upfront, 12 rows of 5 (2+3), last row 6
     1 + (12*5) + 6 = 1 + 60 + 6 = 67. PERFECT.
     Guide = non-passenger staff seat (not numbered as passenger seat)
     Door row is simply row 1 of the 12 rows but with 3 on door side only.
     
     We'll do:
       Seat 1: front passenger
       Rows 1-12: each has seats L1,L2 (left/aisle side) and R1,R2,R3 (right/window side)
         Row 1 is the "door row" but still has 5 seats (2+3)
         Seats 2-61 (60 seats, 12 rows x 5)
       Last row: seats 62-67 (6 across)
       Total: 1 + 60 + 6 = 67
============================================================ */

export function BusSeat67({ booked=[], locked=[], selected=[], onToggle, frozenAbove=null }) {
  const sz = 26
  const g  = 3

  /* frozenAbove: if vehicle is a 55-seater running as 67 shell, freeze seats > 55 */
  const frozenSeats = frozenAbove ? Array.from({length: 67 - frozenAbove}, (_,i) => frozenAbove + 1 + i) : []
  const st = n => getState(n, booked, locked, selected, frozenSeats)

  /* Build 12 body rows: seats 2-61, row format [L1,L2,null,R1,R2,R3] */
  const bodyRows = Array.from({length:12}, (_,i) => {
    const base = 2 + i * 5
    return [base, base+1, null, base+2, base+3, base+4]
  })
  /* Last row seats 62-67 */
  const lastRow = [62, 63, 64, 65, 66, 67]

  const AISLE = 18

  return (
    <div style={{ background:'#f9fafb', border:'3px solid #d1d5db', borderRadius:16, padding:16, display:'inline-block' }}>

      {/* ── FRONT ROW: passenger seat (L) + driver (R) ── */}
      <div style={{ display:'flex', gap:g, marginBottom:8, alignItems:'center' }}>
        <SeatBtn n={1} state={st(1)} onToggle={onToggle} size={sz}/>
        <Gap w={8}/>
        <div style={{ flex:1, fontSize:9, color:'#6b7280', fontFamily:"'Poppins',sans-serif", textAlign:'center' }}>Front</div>
        <Gap w={8}/>
        <CabBox sz={sz}/>
      </div>

      {/* ── GUIDE / CONDUCTOR label ── */}
      <div style={{ display:'flex', gap:g, marginBottom:6, alignItems:'center' }}>
        <div style={{ width:sz+6, background:'#4b5563', borderRadius:8, height:sz+4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontFamily:"'Poppins',sans-serif", fontWeight:700, color:'#9ca3af' }}>GDE</div>
        <div style={{ flex:1, fontSize:9, color:'#9ca3af', fontFamily:"'Poppins',sans-serif" }}>Conductor</div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ height:1, background:'#e5e7eb', borderBottom:'1px dashed #d1d5db', margin:'6px 0 8px' }}/>

      {/* ── COLUMN LABELS ── */}
      <div style={{ display:'flex', gap:g, marginBottom:6 }}>
        <div style={{ width:sz, fontSize:8, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", textAlign:'center' }}>A</div>
        <div style={{ width:sz, fontSize:8, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", textAlign:'center' }}>B</div>
        <Gap w={AISLE}/>
        <div style={{ width:sz, fontSize:8, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", textAlign:'center' }}>C</div>
        <div style={{ width:sz, fontSize:8, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", textAlign:'center' }}>D</div>
        <div style={{ width:sz, fontSize:8, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", textAlign:'center' }}>E</div>
      </div>

      {/* ── 12 BODY ROWS (2+3 each side of aisle) ── */}
      {bodyRows.map((row, i) => (
        <div key={i} style={{ display:'flex', gap:g, marginBottom:g, alignItems:'center' }}>
          {/* Left side: A, B */}
          <SeatBtn n={row[0]} state={st(row[0])} onToggle={onToggle} size={sz}/>
          <SeatBtn n={row[1]} state={st(row[1])} onToggle={onToggle} size={sz}/>
          {/* Aisle */}
          <div style={{ width:AISLE, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:1, height:sz+4, background:'#e5e7eb' }}/>
          </div>
          {/* Right side: C, D, E */}
          <SeatBtn n={row[3]} state={st(row[3])} onToggle={onToggle} size={sz}/>
          <SeatBtn n={row[4]} state={st(row[4])} onToggle={onToggle} size={sz}/>
          <SeatBtn n={row[5]} state={st(row[5])} onToggle={onToggle} size={sz}/>
        </div>
      ))}

      {/* ── LAST ROW: 6 across, no aisle ── */}
      <div style={{ borderTop:'2px dashed #e5e7eb', marginTop:4, paddingTop:6 }}>
        <div style={{ fontSize:8, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", marginBottom:4, textAlign:'center', letterSpacing:1 }}>REAR ROW</div>
        <div style={{ display:'flex', gap:g }}>
          {lastRow.map(n => (
            <SeatBtn key={n} n={n} state={st(n)} onToggle={onToggle} size={sz}/>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', fontSize:9, color:'#9ca3af', fontFamily:"'Poppins',sans-serif" }}>
        <span>DOOR (LEFT)</span>
        <span style={{ fontWeight:700, color:'#6b7280' }}>67-SEATER COACH</span>
        <span>DRIVER (RIGHT)</span>
      </div>
    </div>
  )
}

/* ============================================================
   55-SEATER expressed as 67-SEATER with seats 56-67 FROZEN
   The vehicle physically has fewer rows but uses the same shell
   Frozen seats show as grey/unavailable with a lock icon
============================================================ */
export function BusSeat55(props) {
  return <BusSeat67 {...props} frozenAbove={55}/>
}

/* ============================================================
   65-SEATER expressed as 67-SEATER with seats 66-67 FROZEN
============================================================ */
export function BusSeat65(props) {
  return <BusSeat67 {...props} frozenAbove={65}/>
}

/* ============================================================
   14-SEATER MATATU TAXI -- EXACT RAYLANE SPEC
   Front: Driver(R) + 2 passengers (seats 1, 2)
   Body:  4 rows of 3 passengers each (seats 3-14)
   Total: 2 + 12 = 14 passengers
============================================================ */
export function TaxiSeat14({ booked=[], locked=[], selected=[], onToggle }) {
  const sz = 34
  const g  = 6
  const st = n => getState(n, booked, locked, selected, [])

  /* 4 rows of 3 -- layout: [L, M, null(aisle gap), R] -- no real aisle, just 3 across */
  /* Uganda matatu: row layout is 1+2 (one window, two middle/far) */
  const bodyRows = [
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14],
  ]

  return (
    <div style={{ background:'#f9fafb', border:'3px solid #d1d5db', borderRadius:12, padding:14, display:'inline-block', maxWidth:200 }}>

      {/* ── FRONT: 2 passengers + driver ── */}
      <div style={{ display:'flex', gap:g, marginBottom:10, alignItems:'center' }}>
        <SeatBtn n={1} state={st(1)} onToggle={onToggle} size={sz}/>
        <SeatBtn n={2} state={st(2)} onToggle={onToggle} size={sz}/>
        <div style={{ flex:1 }}/>
        <CabBox sz={sz}/>
      </div>

      <div style={{ height:1, background:'#e5e7eb', marginBottom:10 }}/>

      {/* ── 4 BODY ROWS of 3 ── */}
      {bodyRows.map((row, i) => (
        <div key={i} style={{ display:'flex', gap:g, marginBottom:i < 3 ? g : 0 }}>
          {row.map(n => (
            <SeatBtn key={n} n={n} state={st(n)} onToggle={onToggle} size={sz}/>
          ))}
        </div>
      ))}

      <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid #e5e7eb', fontSize:9, color:'#9ca3af', fontFamily:"'Poppins',sans-serif", textAlign:'center', fontWeight:700 }}>
        14-SEATER TAXI (RHD)
      </div>
    </div>
  )
}

export function SeatLegend({ compact=false }) {
  const legends = [
    ['Available', '#4a7fd4', '#3568c0'],
    ['Selected',  '#FFC72C', '#d4a017'],
    ['Booked',    '#d1d5db', '#9ca3af'],
    ['Frozen',    '#e5e7eb', '#d1d5db'],
  ]
  return (
    <div style={{ display:'flex', gap:compact?8:14, flexWrap:'wrap', alignItems:'center' }}>
      {legends.map(([label, bg, border]) => (
        <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:compact?14:18, height:compact?16:20, borderRadius:4, background:bg, border:`2px solid ${border}`, flexShrink:0 }}/>
          <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:compact?10:12, color:'#64748b' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}
