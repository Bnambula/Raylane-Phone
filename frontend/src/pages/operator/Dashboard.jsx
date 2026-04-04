import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Btn, Badge, Stat, Empty, Spinner, formatUGX, statusColor } from '../../components/UI';

const TABS = ['Overview','Trips','Bookings','Seats','Parcels','Finance'];
const UGANDAN_CITIES = ['Kampala','Mbale','Gulu','Mbarara','Jinja','Masaka','Lira','Arua','Fort Portal','Kabale','Tororo','Entebbe'];

export default function OperatorDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [operator, setOperator] = useState(null);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTrip, setShowNewTrip] = useState(false);
  const [tripForm, setTripForm] = useState({ from:'Kampala', to:'Mbale', departureTime:'', price:'', vehicle:'', totalSeats:49, vehicleType:'COACH', amenities:[] });
  const [msg, setMsg] = useState('');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [opR, tripsR, bksR, parR, payR] = await Promise.all([
        api.get('/operators/me'),
        api.get('/trips'),
        api.get('/bookings'),
        api.get('/parcels'),
        api.get('/payments/my'),
      ]);
      setOperator(opR.data);
      setTrips(tripsR.data);
      setBookings(bksR.data);
      setParcels(parR.data);
      setPayments(payR.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const createTrip = async e => {
    e.preventDefault();
    try {
      await api.post('/trips', { ...tripForm, price: Number(tripForm.price) });
      setShowNewTrip(false);
      setMsg('Trip submitted for admin approval');
      loadAll();
    } catch(e) { setMsg(e.response?.data?.error || 'Failed'); }
  };

  const confirmBoarding = async (id) => {
    await api.patch(`/bookings/${id}/board`);
    setMsg('Boarding confirmed');
    loadAll();
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><Spinner size={40} /></div>;

  const totalRevenue = payments.reduce((s,p) => s+p.amount, 0);
  const totalCommission = payments.reduce((s,p) => s+p.commission, 0);
  const heldBalance = payments.filter(p=>p.status==='HELD').reduce((s,p) => s+p.operatorNet, 0);
  const liveTrips = trips.filter(t=>t.status==='LIVE').length;
  const confirmedBookings = bookings.filter(b=>b.status==='CONFIRMED').length;

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:'var(--navy)', padding:'16px 20px', position:'sticky', top:0, zIndex:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, background:'var(--gold)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🚌</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'white', fontSize:16 }}>{operator?.name}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>Operator Dashboard</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Badge variant={operator?.status==='ACTIVE'?'green':'gold'}>{operator?.status}</Badge>
            <button onClick={() => { logout(); nav('/login'); }} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:8, padding:'6px 12px', color:'rgba(255,255,255,0.7)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)' }}>Sign out</button>
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display:'flex', gap:4, overflowX:'auto', paddingBottom:2 }}>
          {TABS.filter(t => {
            if (t === 'Finance') return operator?.modules?.includes('FINANCIAL');
            return true;
          }).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flexShrink:0, padding:'8px 14px', border:'none', borderRadius:'var(--radius-sm)', background: tab===t ? 'var(--gold)' : 'rgba(255,255,255,0.08)', color: tab===t ? 'var(--navy)' : 'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', whiteSpace:'nowrap' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {msg && <div style={{ background:'var(--green-light)', color:'#00885A', padding:'12px 20px', fontSize:14, fontWeight:600, display:'flex', justifyContent:'space-between' }}>
        <span>✓ {msg}</span><span style={{ cursor:'pointer' }} onClick={() => setMsg('')}>×</span>
      </div>}

      <div style={{ flex:1, padding:'20px 16px', maxWidth:800, width:'100%', margin:'0 auto' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              <Stat label='Live Trips' value={liveTrips} icon='🛣️' />
              <Stat label='Bookings' value={confirmedBookings} icon='🎫' />
              <Stat label='Revenue' value={`${(totalRevenue/1000).toFixed(0)}K`} color='var(--gold)' icon='💰' />
              <Stat label='Held Balance' value={`${(heldBalance/1000).toFixed(0)}K`} icon='🏦' />
            </div>

            {/* Active modules */}
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:16, border:'1px solid var(--gray-200)' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:14 }}>Active Modules</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {(operator?.modules || []).map(m => (
                  <span key={m} style={{ background:'var(--green-light)', color:'#00885A', fontSize:12, fontWeight:700, padding:'5px 12px', borderRadius:99, letterSpacing:'0.04em' }}>✓ {m.replace('_',' ')}</span>
                ))}
              </div>
            </div>

            {/* Recent bookings */}
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, border:'1px solid var(--gray-200)' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:14 }}>Recent Bookings</div>
              {bookings.slice(0,5).map(b => (
                <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{b.passengerName}</div>
                    <div style={{ fontSize:12, color:'var(--gray-400)' }}>Seat #{b.seatNumber} · {b.id}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <Badge variant={statusColor(b.status)}>{b.status}</Badge>
                    <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:4 }}>{formatUGX(b.amount)}</div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <Empty icon='🎫' text='No bookings yet' />}
            </div>
          </div>
        )}

        {/* ── TRIPS ── */}
        {tab === 'Trips' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)' }}>My Trips</div>
              <Btn size='sm' onClick={() => setShowNewTrip(true)}>+ New Trip</Btn>
            </div>

            {showNewTrip && (
              <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:16, border:'2px solid var(--gold)', boxShadow:'var(--shadow-md)' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:16 }}>Create New Trip</div>
                <form onSubmit={createTrip}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                    {[['from','From'],['to','To']].map(([k,l]) => (
                      <div key={k}>
                        <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>{l}</label>
                        <select value={tripForm[k]} onChange={e => setTripForm(p=>({...p,[k]:e.target.value}))} style={{ width:'100%', height:44, padding:'0 12px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:14, fontFamily:'var(--font-body)', outline:'none' }}>
                          {UGANDAN_CITIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                    {[['departureTime','Departure','datetime-local'],['price','Price (UGX)','number'],['vehicle','Vehicle Plate','text'],['totalSeats','Total Seats','number']].map(([k,l,t]) => (
                      <div key={k}>
                        <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>{l}</label>
                        <input value={tripForm[k]} onChange={e => setTripForm(p=>({...p,[k]:e.target.value}))} type={t} required
                          style={{ width:'100%', height:44, padding:'0 12px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:14, fontFamily:'var(--font-body)', outline:'none' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn type='submit' style={{ flex:2 }}>Submit for Approval</Btn>
                    <Btn variant='ghost' onClick={() => setShowNewTrip(false)} style={{ flex:1 }}>Cancel</Btn>
                  </div>
                </form>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {trips.map(t => (
                <div key={t.id} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:16, border:'1px solid var(--gray-200)', boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--navy)' }}>{t.from} → {t.to}</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:3 }}>
                        {new Date(t.departureTime).toLocaleString('en-UG',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})} · {t.vehicle}
                      </div>
                      <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>{t.bookedSeats}/{t.totalSeats} seats booked · {formatUGX(t.price)}</div>
                    </div>
                    <Badge variant={statusColor(t.status)}>{t.status}</Badge>
                  </div>
                  {/* Seat fill bar */}
                  <div style={{ marginTop:12, background:'var(--gray-100)', borderRadius:99, height:6, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:'var(--gold)', borderRadius:99, width:`${((t.bookedSeats||0)/t.totalSeats)*100}%`, transition:'width 0.5s' }} />
                  </div>
                </div>
              ))}
              {trips.length === 0 && <Empty icon='🚌' text='No trips yet. Create your first trip!' />}
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'Bookings' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>Passenger Bookings</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {bookings.map(b => (
                <div key={b.id} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:16, border:'1px solid var(--gray-200)', boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:'var(--navy)' }}>{b.passengerName}</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)' }}>{b.passengerPhone} · Seat #{b.seatNumber}</div>
                      <div style={{ fontSize:11, fontFamily:'monospace', color:'var(--gray-400)', marginTop:2 }}>{b.ticketCode}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <Badge variant={statusColor(b.status)}>{b.status}</Badge>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginTop:6 }}>{formatUGX(b.amount)}</div>
                    </div>
                  </div>
                  {b.status === 'CONFIRMED' && !b.boarded && (
                    <Btn size='sm' variant='green' onClick={() => confirmBoarding(b.id)}>✓ Confirm Boarding</Btn>
                  )}
                  {b.boarded && <span style={{ fontSize:12, color:'#00885A', fontWeight:600 }}>✓ Boarded</span>}
                </div>
              ))}
              {bookings.length === 0 && <Empty icon='🎫' text='No bookings yet' />}
            </div>
          </div>
        )}

        {/* ── SEATS ── */}
        {tab === 'Seats' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>Live Seat Management</div>
            {trips.filter(t=>t.status==='LIVE').map(trip => (
              <SeatManagement key={trip.id} trip={trip} onUpdate={loadAll} />
            ))}
            {trips.filter(t=>t.status==='LIVE').length === 0 && <Empty icon='💺' text='No live trips to manage seats for' />}
          </div>
        )}

        {/* ── PARCELS ── */}
        {tab === 'Parcels' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>Parcels</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {parcels.map(p => (
                <div key={p.id} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:16, border:'1px solid var(--gray-200)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{p.id}</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)' }}>{p.senderName} → {p.recipientName} ({p.destination})</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)' }}>{p.description} · {p.weight}kg</div>
                    </div>
                    <Badge variant={statusColor(p.status)}>{p.status}</Badge>
                  </div>
                  <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
                    {['PICKED_UP','IN_TRANSIT','DELIVERED'].map(s => (
                      <button key={s} onClick={async () => { await api.patch(`/parcels/${p.id}/status`, { status:s }); loadAll(); }}
                        style={{ fontSize:11, padding:'5px 10px', border:'1px solid var(--gray-200)', borderRadius:99, background: p.status===s ? 'var(--navy)' : 'transparent', color: p.status===s ? 'white' : 'var(--gray-600)', cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>
                        {s.replace('_',' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {parcels.length === 0 && <Empty icon='📦' text='No parcels yet' />}
            </div>
          </div>
        )}

        {/* ── FINANCE ── */}
        {tab === 'Finance' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>Financial Overview</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              <Stat label='Total Revenue' value={formatUGX(totalRevenue)} color='var(--gold)' />
              <Stat label='Commission Paid' value={formatUGX(totalCommission)} color='var(--red)' />
              <Stat label='Net Earned' value={formatUGX(totalRevenue - totalCommission)} color='var(--green)' />
              <Stat label='Pending Payout' value={formatUGX(heldBalance)} />
            </div>
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, border:'1px solid var(--gray-200)' }}>
              <div style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:14 }}>Transactions</div>
              {payments.map(p => (
                <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--navy)' }}>{p.method?.replace('_',' ')}</div>
                    <div style={{ fontSize:11, color:'var(--gray-400)' }}>{p.bookingId}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{formatUGX(p.operatorNet)}</div>
                    <Badge variant={statusColor(p.status)}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SeatManagement({ trip, onUpdate }) {
  const [seats, setSeats] = useState({});
  useEffect(() => {
    api.get(`/seats/${trip.id}`).then(r => setSeats(r.data)).catch(() => {});
  }, [trip.id]);

  const toggle = async (num) => {
    const current = seats[num]?.status;
    const next = current === 'AVAILABLE' ? 'BOOKED' : 'AVAILABLE';
    await api.patch(`/seats/${trip.id}/${num}`, { status: next });
    setSeats(p => ({ ...p, [num]: { ...p[num], status: next } }));
    onUpdate();
  };

  return (
    <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:16, border:'1px solid var(--gray-200)' }}>
      <div style={{ fontWeight:700, color:'var(--navy)', marginBottom:4 }}>{trip.from} → {trip.to}</div>
      <div style={{ fontSize:12, color:'var(--gray-400)', marginBottom:16 }}>{new Date(trip.departureTime).toLocaleString('en-UG',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
        {Object.entries(seats).map(([num, seat]) => (
          <div key={num} onClick={() => toggle(num)}
            style={{ aspectRatio:'1', borderRadius:8, background: seat.status==='BOOKED'?'var(--navy)':seat.status==='LOCKED'?'var(--gray-200)':'var(--green-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color: seat.status==='BOOKED'?'white':'var(--navy)', cursor: seat.status==='LOCKED'?'default':'pointer' }}>
            {num}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginTop:12 }}>
        {[['var(--green-light)','var(--navy)','Available'],['var(--navy)','white','Booked'],['var(--gray-200)','var(--gray-600)','Locked']].map(([bg,c,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:14, height:14, background:bg, borderRadius:4 }} />
            <span style={{ fontSize:10, color:'var(--gray-600)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
