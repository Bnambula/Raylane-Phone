import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { Btn, Spinner, Badge, formatUGX } from '../../components/UI';
import { QRCodeSVG } from 'qrcode.react';

const SESSION_ID = `sess-${Math.random().toString(36).slice(2,10)}`;
const STEPS = ['Select Seat', 'Your Details', 'Payment', 'Ticket'];

export default function BookTrip() {
  const { tripId } = useParams();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [trip, setTrip] = useState(null);
  const [seats, setSeats] = useState({});
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(300);
  const [form, setForm] = useState({ name:'', phone:'', method:'MTN_MOMO', isAdvance:false });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    loadTrip();
    loadSeats();
    return () => clearInterval(timerRef.current);
  }, [tripId]);

  const loadTrip = async () => {
    const { data } = await api.get(`/trips/${tripId}`);
    setTrip(data);
  };

  const loadSeats = async () => {
    const { data } = await api.get(`/seats/${tripId}`);
    setSeats(data);
  };

  const selectSeat = async (num) => {
    const s = seats[num];
    if (!s || s.status !== 'AVAILABLE') return;
    setErr('');
    try {
      await api.post(`/seats/${tripId}/lock`, { seatNumber: num, sessionId: SESSION_ID });
      setSelected(num);
      setLocked(true);
      setLockTimer(300);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setLockTimer(t => {
          if (t <= 1) { clearInterval(timerRef.current); setLocked(false); setSelected(null); loadSeats(); return 0; }
          return t - 1;
        });
      }, 1000);
      setSeats(p => ({ ...p, [num]: { ...p[num], status:'LOCKED' } }));
    } catch(e) { setErr(e.response?.data?.error || 'Seat unavailable'); }
  };

  const confirmSeat = () => { if (selected) setStep(1); };

  const submitBooking = async () => {
    setLoading(true); setErr('');
    try {
      const { data } = await api.post('/bookings', {
        tripId, passengerName: form.name, passengerPhone: form.phone,
        seatNumber: selected, sessionId: SESSION_ID,
        paymentMethod: form.method, isAdvance: form.isAdvance
      });
      setBooking(data);
      // Poll for confirmation
      setTimeout(async () => {
        try {
          const { data: bk } = await api.get(`/bookings/track/${data.bookingId}`);
          setBooking(b => ({ ...b, ...bk }));
        } catch {}
      }, 2500);
      setStep(3);
    } catch(e) { setErr(e.response?.data?.error || 'Booking failed'); }
    finally { setLoading(false); }
  };

  if (!trip) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><Spinner /></div>;

  const totalSeats = trip.totalSeats || 49;
  const cols = 4;
  const rows = Math.ceil(totalSeats / cols);

  const seatColor = (num) => {
    const s = seats[num];
    if (!s) return 'var(--gray-100)';
    if (num === selected) return 'var(--gold)';
    if (s.status === 'BOOKED') return 'var(--navy)';
    if (s.status === 'LOCKED') return 'var(--gray-300)';
    return 'var(--green-light)';
  };
  const seatText = (num) => {
    const s = seats[num];
    if (!s) return '';
    if (num === selected) return '#ffffff';
    if (s.status === 'BOOKED') return 'rgba(255,255,255,0.7)';
    return 'var(--navy)';
  };

  const amount = form.isAdvance ? Math.round((trip.price||0)*0.2) : trip.price;

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', paddingBottom:100 }}>
      {/* Header */}
      <div style={{ background:'var(--navy)', padding:'20px 20px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => nav(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:10, width:38, height:38, color:'white', fontSize:18, cursor:'pointer' }}>←</button>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800, color:'white' }}>{trip.from} → {trip.to}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>
              {new Date(trip.departureTime).toLocaleString('en-UG',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
            </div>
          </div>
        </div>
        {/* Step indicator */}
        <div style={{ display:'flex', gap:6 }}>
          {STEPS.map((s,i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:99, background: i <= step ? 'var(--gold)' : 'rgba(255,255,255,0.15)', transition:'background 0.3s' }} />
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
          {STEPS.map((s,i) => <div key={i} style={{ fontSize:10, color: i===step ? 'var(--gold)' : 'rgba(255,255,255,0.4)', fontWeight: i===step?700:400 }}>{s}</div>)}
        </div>
      </div>

      <div style={{ padding:'20px 16px' }}>

        {/* STEP 0: SEAT MAP */}
        {step === 0 && (
          <div>
            {err && <div style={{ background:'#FEE2E2', color:'var(--red)', padding:'10px 14px', borderRadius:'var(--radius-md)', marginBottom:12, fontSize:13 }}>{err}</div>}

            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:12, boxShadow:'var(--shadow-sm)' }}>
              {/* Bus front */}
              <div style={{ background:'var(--gray-100)', borderRadius:'var(--radius-md)', padding:'8px 16px', textAlign:'center', marginBottom:16, fontSize:13, fontWeight:600, color:'var(--gray-600)' }}>
                🚌 FRONT — DRIVER
              </div>
              {/* Legend */}
              <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:20 }}>
                {[['var(--green-light)','var(--navy)','Available'],['var(--gold)','white','Selected'],['var(--navy)','white','Taken'],['var(--gray-300)','var(--gray-600)','Locked']].map(([bg,color,label]) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:16, height:16, background:bg, borderRadius:4 }} />
                    <span style={{ fontSize:10, color:'var(--gray-600)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Seat grid */}
              <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols+1},1fr)`, gap:6 }}>
                {Array.from({ length: rows }, (_, r) =>
                  Array.from({ length: cols }, (_, c) => {
                    const seatNum = r * cols + c + 1;
                    if (seatNum > totalSeats) return <div key={`empty-${r}-${c}`} />;
                    const aisle = c === 1; // aisle gap after col 2
                    return (
                      <React.Fragment key={seatNum}>
                        <div
                          onClick={() => selectSeat(seatNum)}
                          style={{
                            width:'100%', aspectRatio:'1', borderRadius:8,
                            background: seatColor(seatNum),
                            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                            cursor: seats[seatNum]?.status === 'AVAILABLE' ? 'pointer' : 'default',
                            fontSize:10, fontWeight:700, color: seatText(seatNum),
                            border: seatNum === selected ? '2px solid var(--gold)' : '1px solid transparent',
                            transition:'all 0.15s',
                            boxShadow: seatNum === selected ? '0 0 0 3px var(--gold-light)' : 'none',
                          }}>
                          <div style={{ fontSize:13 }}>💺</div>
                          <div>{seatNum}</div>
                        </div>
                        {c === 1 && <div key={`aisle-${r}`} />}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>

            {/* Lock timer */}
            {locked && selected && (
              <div style={{ background:'var(--gold-light)', border:'1px solid var(--gold)', borderRadius:'var(--radius-md)', padding:'12px 16px', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>Seat {selected} locked</div>
                  <div style={{ fontSize:12, color:'var(--gray-600)' }}>Held for {Math.floor(lockTimer/60)}:{String(lockTimer%60).padStart(2,'0')}</div>
                </div>
                <div style={{ fontSize:24, fontWeight:800, color:'var(--gold)', fontFamily:'var(--font-display)' }}>{Math.floor(lockTimer/60)}:{String(lockTimer%60).padStart(2,'0')}</div>
              </div>
            )}

            <Btn full onClick={confirmSeat} disabled={!selected} style={{ height:52 }}>
              Confirm Seat {selected ? `#${selected}` : ''} →
            </Btn>
          </div>
        )}

        {/* STEP 1: PASSENGER DETAILS */}
        {step === 1 && (
          <div>
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, boxShadow:'var(--shadow-sm)', marginBottom:12 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'var(--navy)', marginBottom:20 }}>Your Details</h3>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Full Name</label>
                <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder='e.g. Alice Nakato' style={{ width:'100%', height:48, padding:'0 16px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none' }} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Phone Number</label>
                <input value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} placeholder='+256 7XX XXX XXX' type='tel' style={{ width:'100%', height:48, padding:'0 16px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none' }} />
              </div>

              {/* Advance booking toggle */}
              <div style={{ background:'var(--gray-50)', borderRadius:'var(--radius-md)', padding:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>Advance Booking (20%)</div>
                  <div style={{ fontSize:12, color:'var(--gray-400)' }}>Pay UGX {((trip.price||0)*0.2/1000).toFixed(0)}K now, balance later</div>
                </div>
                <div onClick={() => setForm(p=>({...p,isAdvance:!p.isAdvance}))}
                  style={{ width:48, height:26, borderRadius:99, background: form.isAdvance ? 'var(--green)' : 'var(--gray-200)', display:'flex', alignItems:'center', padding:3, cursor:'pointer', transition:'background 0.2s' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'white', transform: form.isAdvance ? 'translateX(22px)' : 'translateX(0)', transition:'transform 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            </div>

            {/* Trip summary */}
            <div style={{ background:'var(--navy)', borderRadius:'var(--radius-lg)', padding:16, marginBottom:16 }}>
              {[['Route', `${trip.from} → ${trip.to}`], ['Seat', `#${selected}`], ['Date', new Date(trip.departureTime).toLocaleDateString('en-UG',{day:'numeric',month:'short'})], ['Amount', formatUGX(amount)]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:600, color: k==='Amount' ? 'var(--gold)' : 'white' }}>{v}</span>
                </div>
              ))}
            </div>

            {err && <div style={{ background:'#FEE2E2', color:'var(--red)', padding:'10px 14px', borderRadius:'var(--radius-md)', marginBottom:12, fontSize:13 }}>{err}</div>}
            <div style={{ display:'flex', gap:8 }}>
              <Btn variant='ghost' onClick={() => setStep(0)} style={{ flex:1 }}>← Back</Btn>
              <Btn onClick={() => { if (!form.name||!form.phone){setErr('Please fill all fields');return;} setStep(2); }} style={{ flex:2 }}>Continue →</Btn>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && (
          <div>
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, boxShadow:'var(--shadow-sm)', marginBottom:12 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'var(--navy)', marginBottom:20 }}>Payment Method</h3>
              {[['MTN_MOMO','MTN Mobile Money','🟡'],['AIRTEL_MOMO','Airtel Money','🔴']].map(([val,label,icon]) => (
                <div key={val} onClick={() => setForm(p=>({...p,method:val}))}
                  style={{ border:`2px solid ${form.method===val?'var(--gold)':'var(--gray-200)'}`, borderRadius:'var(--radius-md)', padding:16, marginBottom:10, cursor:'pointer', display:'flex', alignItems:'center', gap:14, background: form.method===val ? 'var(--gold-light)' : 'transparent', transition:'all 0.15s' }}>
                  <div style={{ fontSize:28 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight:700, color:'var(--navy)', fontSize:15 }}>{label}</div>
                    <div style={{ fontSize:12, color:'var(--gray-400)' }}>Dial *165# or *185# to confirm</div>
                  </div>
                  {form.method===val && <div style={{ marginLeft:'auto', color:'var(--gold)', fontSize:20 }}>✓</div>}
                </div>
              ))}

              <div style={{ background:'var(--navy)', borderRadius:'var(--radius-md)', padding:16, marginTop:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>Seat #{selected}</span>
                  <span style={{ color:'white', fontSize:13 }}>{formatUGX(trip.price)}</span>
                </div>
                {form.isAdvance && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>Advance (20%)</span>
                  <span style={{ color:'var(--gold)', fontSize:13 }}>- {formatUGX(trip.price - amount)}</span>
                </div>}
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', marginTop:8, paddingTop:8, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ color:'white', fontWeight:700 }}>Total due now</span>
                  <span style={{ color:'var(--gold)', fontWeight:800, fontSize:18, fontFamily:'var(--font-display)' }}>{formatUGX(amount)}</span>
                </div>
              </div>
            </div>

            {err && <div style={{ background:'#FEE2E2', color:'var(--red)', padding:'10px 14px', borderRadius:'var(--radius-md)', marginBottom:12, fontSize:13 }}>{err}</div>}
            <div style={{ display:'flex', gap:8 }}>
              <Btn variant='ghost' onClick={() => setStep(1)} style={{ flex:1 }}>← Back</Btn>
              <Btn onClick={submitBooking} disabled={loading} style={{ flex:2 }}>
                {loading ? 'Processing...' : `Pay ${formatUGX(amount)} →`}
              </Btn>
            </div>
          </div>
        )}

        {/* STEP 3: TICKET */}
        {step === 3 && booking && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64, marginBottom:8 }}>🎉</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--navy)', marginBottom:4 }}>Booking Confirmed!</h2>
            <p style={{ fontSize:14, color:'var(--gray-400)', marginBottom:24 }}>Show this QR code at boarding</p>

            {/* Ticket card */}
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-lg)', maxWidth:360, margin:'0 auto', textAlign:'left' }}>
              {/* Ticket header */}
              <div style={{ background:'var(--navy)', padding:'20px 24px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ background:'var(--gold)', borderRadius:8, padding:6, fontSize:18 }}>🚌</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'white', fontSize:16 }}>Raylane Express</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>Official E-Ticket</div>
                  </div>
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'white', letterSpacing:'-0.5px' }}>{trip.from} → {trip.to}</div>
                <div style={{ fontSize:12, color:'var(--gold)', marginTop:4 }}>
                  {new Date(trip.departureTime).toLocaleDateString('en-UG',{weekday:'short',day:'numeric',month:'long'})} · {new Date(trip.departureTime).toLocaleTimeString('en-UG',{hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>

              {/* Dashed divider */}
              <div style={{ borderTop:'2px dashed var(--gray-200)', margin:'0 16px' }} />

              {/* Ticket body */}
              <div style={{ padding:'20px 24px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                  {[['Passenger', form.name], ['Seat', `#${selected}`], ['Booking ID', booking.bookingId], ['Amount', formatUGX(booking.amount)]].map(([k,v]) => (
                    <div key={k}>
                      <div style={{ fontSize:10, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{k}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* QR code */}
                <div style={{ textAlign:'center', padding:'16px', background:'var(--gray-50)', borderRadius:'var(--radius-md)' }}>
                  <QRCodeSVG value={booking.ticketCode || booking.bookingId} size={140} fgColor='var(--navy)' />
                  <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:8, fontFamily:'monospace' }}>{booking.ticketCode}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop:20 }}>
              <Btn full variant='navy' onClick={() => nav('/')}>Back to Home</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
