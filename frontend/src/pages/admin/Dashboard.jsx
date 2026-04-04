import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Btn, Badge, Stat, Empty, Spinner, formatUGX, statusColor } from '../../components/UI';

const TABS = ['Dashboard','Operators','Trips','Bookings','Payments','Parcels','Alerts'];
const ALL_MODULES = ['TRIPS','SEAT_MANAGEMENT','BOOKINGS','PARCELS','FINANCIAL','FUEL','LOANS','HR','ANALYTICS'];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('Dashboard');
  const [stats, setStats] = useState({});
  const [operators, setOperators] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [selectedOp, setSelectedOp] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [stR, opR, trR, bkR, pmR, parR, alR] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/operators'),
        api.get('/trips'),
        api.get('/bookings/all'),
        api.get('/payments'),
        api.get('/parcels'),
        api.get('/admin/alerts'),
      ]);
      setStats(stR.data); setOperators(opR.data); setTrips(trR.data);
      setBookings(bkR.data); setPayments(pmR.data); setParcels(parR.data);
      setAlerts(alR.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const approveTrip = async (id, status) => {
    await api.patch(`/trips/${id}/status`, { status });
    notify(`Trip ${status.toLowerCase()}`);
    loadAll();
  };

  const setOpStatus = async (id, status) => {
    await api.patch(`/operators/${id}/status`, { status });
    notify(`Operator ${status.toLowerCase()}`);
    loadAll();
  };

  const toggleModule = async (opId, mod, current) => {
    const op = operators.find(o => o.id === opId);
    const modules = current.includes(mod) ? current.filter(m => m!==mod) : [...current, mod];
    await api.patch(`/operators/${opId}/modules`, { modules });
    loadAll();
  };

  const releasePayout = async (tripId) => {
    try {
      await api.post(`/payments/payout/${tripId}`);
      notify('Payout released successfully');
      loadAll();
    } catch(e) { notify(e.response?.data?.error || 'Payout failed'); }
  };

  const markAlertRead = async (id) => {
    await api.patch(`/admin/alerts/${id}/read`);
    loadAll();
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><Spinner size={40} /></div>;

  const unread = alerts.filter(a => !a.read).length;

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:'var(--navy)', padding:'16px 20px', position:'sticky', top:0, zIndex:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ background:'var(--gold)', borderRadius:10, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⚙️</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'white', fontSize:16 }}>Raylane Admin</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>Master Control Center</div>
            </div>
          </div>
          <button onClick={() => { logout(); nav('/login'); }} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:8, padding:'6px 12px', color:'rgba(255,255,255,0.7)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)' }}>Sign out</button>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, overflowX:'auto', paddingBottom:2 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flexShrink:0, padding:'8px 14px', border:'none', borderRadius:'var(--radius-sm)', background: tab===t ? 'var(--gold)' : 'rgba(255,255,255,0.08)', color: tab===t ? 'var(--navy)' : 'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', whiteSpace:'nowrap', position:'relative' }}>
              {t}{t==='Alerts'&&unread>0 && <span style={{ position:'absolute', top:-4, right:-4, background:'var(--red)', color:'white', borderRadius:99, fontSize:9, minWidth:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800 }}>{unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {msg && <div style={{ background:'var(--green-light)', color:'#00885A', padding:'12px 20px', fontSize:14, fontWeight:600, display:'flex', justifyContent:'space-between' }}>
        <span>✓ {msg}</span><span onClick={() => setMsg('')} style={{ cursor:'pointer' }}>×</span>
      </div>}

      <div style={{ flex:1, padding:'20px 16px', maxWidth:900, width:'100%', margin:'0 auto' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'Dashboard' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              <Stat label='Total Revenue' value={formatUGX(stats.totalRevenue)} color='var(--gold)' icon='💰' />
              <Stat label='Commission' value={formatUGX(stats.totalCommission)} color='var(--green)' icon='📊' />
              <Stat label='Live Trips' value={stats.liveTrips} icon='🛣️' sub={`${stats.pendingTrips} pending approval`} />
              <Stat label='Operators' value={stats.activeOperators} icon='🏢' sub={`${stats.pendingOperators} pending`} />
              <Stat label='Bookings' value={stats.totalBookings} icon='🎫' />
              <Stat label='Held Balance' value={formatUGX(stats.heldBalance)} sub='Ready for payout' />
            </div>

            {/* Pending actions */}
            {trips.filter(t=>t.status==='PENDING').length > 0 && (
              <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:16, border:'2px solid var(--gold)' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:14 }}>⏳ Pending Trip Approvals ({trips.filter(t=>t.status==='PENDING').length})</div>
                {trips.filter(t=>t.status==='PENDING').map(t => (
                  <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--gray-100)' }}>
                    <div>
                      <div style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{t.from} → {t.to}</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)' }}>{t.operatorName} · {new Date(t.departureTime).toLocaleString('en-UG',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <Btn size='sm' variant='green' onClick={() => approveTrip(t.id,'LIVE')}>✓ Approve</Btn>
                      <Btn size='sm' variant='danger' onClick={() => approveTrip(t.id,'REJECTED')}>Reject</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {operators.filter(o=>o.status==='PENDING').length > 0 && (
              <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, border:'2px solid var(--navy)' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:14 }}>🏢 Pending Operator Applications</div>
                {operators.filter(o=>o.status==='PENDING').map(o => (
                  <div key={o.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--gray-100)' }}>
                    <div>
                      <div style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{o.name}</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)' }}>{o.email} · {o.phone}</div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <Btn size='sm' variant='green' onClick={() => setOpStatus(o.id,'ACTIVE')}>Approve</Btn>
                      <Btn size='sm' variant='danger' onClick={() => setOpStatus(o.id,'REJECTED')}>Reject</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── OPERATORS ── */}
        {tab === 'Operators' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>Operators</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {operators.map(o => (
                <div key={o.id} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', border:'1px solid var(--gray-200)', overflow:'hidden' }}>
                  <div style={{ padding:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)' }}>{o.name}</div>
                        <div style={{ fontSize:12, color:'var(--gray-400)' }}>{o.email} · {o.phone}</div>
                        <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>Merchant: {o.merchantCode || 'Not set'}</div>
                      </div>
                      <Badge variant={statusColor(o.status)}>{o.status}</Badge>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {o.status === 'ACTIVE' && <Btn size='sm' variant='danger' onClick={() => setOpStatus(o.id,'SUSPENDED')}>Suspend</Btn>}
                      {o.status === 'SUSPENDED' && <Btn size='sm' variant='green' onClick={() => setOpStatus(o.id,'ACTIVE')}>Activate</Btn>}
                      {o.status === 'PENDING' && <>
                        <Btn size='sm' variant='green' onClick={() => setOpStatus(o.id,'ACTIVE')}>✓ Approve</Btn>
                        <Btn size='sm' variant='danger' onClick={() => setOpStatus(o.id,'REJECTED')}>Reject</Btn>
                      </>}
                      <button onClick={() => setSelectedOp(selectedOp===o.id?null:o.id)}
                        style={{ fontSize:12, padding:'6px 12px', border:'1px solid var(--gray-200)', borderRadius:99, background:'transparent', cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600, color:'var(--navy)' }}>
                        {selectedOp===o.id ? '▲ Hide' : '▼ Modules'}
                      </button>
                    </div>
                  </div>

                  {/* Module management panel */}
                  {selectedOp === o.id && (
                    <div style={{ background:'var(--gray-50)', borderTop:'1px solid var(--gray-200)', padding:16 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', marginBottom:10 }}>Module Access Control</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                        {ALL_MODULES.map(m => {
                          const active = o.modules?.includes(m);
                          return (
                            <div key={m} onClick={() => toggleModule(o.id, m, o.modules||[])}
                              style={{ padding:'6px 14px', borderRadius:99, border:`1.5px solid ${active?'var(--green)':'var(--gray-200)'}`, background: active?'var(--green-light)':'transparent', color: active?'#00885A':'var(--gray-600)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                              {active ? '✓' : '+'} {m.replace('_',' ')}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRIPS ── */}
        {tab === 'Trips' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>All Trips</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {trips.map(t => (
                <div key={t.id} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:16, border:'1px solid var(--gray-200)', boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)' }}>{t.from} → {t.to}</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>
                        {t.operatorName || 'Raylane'} · {new Date(t.departureTime).toLocaleString('en-UG',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                      </div>
                      <div style={{ fontSize:12, color:'var(--gray-400)' }}>{t.bookedSeats}/{t.totalSeats} seats · {formatUGX(t.price)} · {t.vehicle}</div>
                    </div>
                    <Badge variant={statusColor(t.status)}>{t.status}</Badge>
                  </div>
                  {t.status === 'PENDING' && (
                    <div style={{ display:'flex', gap:8, marginTop:12 }}>
                      <Btn size='sm' variant='green' onClick={() => approveTrip(t.id,'LIVE')}>✓ Approve</Btn>
                      <Btn size='sm' variant='danger' onClick={() => approveTrip(t.id,'REJECTED')}>Reject</Btn>
                    </div>
                  )}
                  {t.status === 'LIVE' && (
                    <div style={{ display:'flex', gap:8, marginTop:12 }}>
                      <Btn size='sm' variant='ghost' onClick={() => approveTrip(t.id,'CANCELLED')}>Cancel Trip</Btn>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'Bookings' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>All Bookings</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {bookings.map(b => (
                <div key={b.id} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:14, border:'1px solid var(--gray-200)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{b.passengerName}</div>
                    <div style={{ fontSize:12, color:'var(--gray-400)' }}>{b.passengerPhone} · Seat #{b.seatNumber} · {b.paymentMethod?.replace('_',' ')}</div>
                    <div style={{ fontSize:11, fontFamily:'monospace', color:'var(--gray-400)' }}>{b.ticketCode}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:800, color:'var(--gold)', fontFamily:'var(--font-display)', fontSize:15 }}>{formatUGX(b.amount)}</div>
                    <Badge variant={statusColor(b.status)}>{b.status}</Badge>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <Empty icon='🎫' text='No bookings yet' />}
            </div>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === 'Payments' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>Payment Control</div>

            {/* Summary */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              <Stat label='Total Revenue' value={formatUGX(stats.totalRevenue)} color='var(--gold)' />
              <Stat label='Commission (8%)' value={formatUGX(stats.totalCommission)} color='var(--green)' />
              <Stat label='Held for Ops' value={formatUGX(stats.heldBalance)} />
              <Stat label='Paid Out' value={formatUGX((stats.totalRevenue||0)-(stats.totalCommission||0)-(stats.heldBalance||0))} color='var(--green)' />
            </div>

            {/* Payout by trip */}
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:16, border:'1px solid var(--gray-200)' }}>
              <div style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:14 }}>Release Payouts by Trip</div>
              {trips.filter(t => payments.some(p => p.tripId===t.id && p.status==='HELD')).map(t => {
                const tripPays = payments.filter(p => p.tripId===t.id && p.status==='HELD');
                const total = tripPays.reduce((s,p) => s+p.operatorNet, 0);
                const op = operators.find(o => o.id===t.operatorId);
                return (
                  <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--gray-100)' }}>
                    <div>
                      <div style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{t.from} → {t.to}</div>
                      <div style={{ fontSize:12, color:'var(--gray-400)' }}>{op?.name} · {tripPays.length} payments · Merchant: {op?.merchantCode||'—'}</div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <div style={{ fontWeight:800, color:'var(--gold)', fontFamily:'var(--font-display)' }}>{formatUGX(total)}</div>
                      <Btn size='sm' variant='green' onClick={() => releasePayout(t.id)}>Release →</Btn>
                    </div>
                  </div>
                );
              })}
              {trips.filter(t => payments.some(p => p.tripId===t.id && p.status==='HELD')).length === 0 && <Empty icon='💸' text='No pending payouts' />}
            </div>

            {/* All transactions */}
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, border:'1px solid var(--gray-200)' }}>
              <div style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:14 }}>All Transactions</div>
              {payments.map(p => (
                <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ fontWeight:600, color:'var(--navy)', fontSize:13 }}>{p.passengerName}</div>
                    <div style={{ fontSize:11, color:'var(--gray-400)' }}>{p.route} · {p.method?.replace('_',' ')}</div>
                    <div style={{ fontSize:11, color:'var(--gray-400)' }}>Commission: {formatUGX(p.commission)} · Net: {formatUGX(p.operatorNet)}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{formatUGX(p.amount)}</div>
                    <Badge variant={statusColor(p.status)}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PARCELS ── */}
        {tab === 'Parcels' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>Parcel Monitor</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {parcels.map(p => (
                <div key={p.id} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:14, border:'1px solid var(--gray-200)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:700, color:'var(--navy)', fontSize:13 }}>{p.id}</div>
                    <div style={{ fontSize:12, color:'var(--gray-400)' }}>{p.senderName} → {p.recipientName} ({p.destination})</div>
                    <div style={{ fontSize:11, fontFamily:'monospace', color:'var(--gold)' }}>{p.trackingCode}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <Badge variant={statusColor(p.status)}>{p.status}</Badge>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', marginTop:4 }}>{formatUGX(p.fee)}</div>
                  </div>
                </div>
              ))}
              {parcels.length === 0 && <Empty icon='📦' text='No parcels in system' />}
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {tab === 'Alerts' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--navy)', marginBottom:16 }}>System Alerts & Inbox</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {alerts.map(a => (
                <div key={a.id} style={{ background: a.read?'var(--white)':'var(--gold-light)', borderRadius:'var(--radius-lg)', padding:16, border:`1px solid ${a.read?'var(--gray-200)':'var(--gold)'}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ fontSize:24 }}>
                      {a.type==='APPROVAL'?'⏳':a.type==='FINANCIAL'?'💰':a.type==='OPERATOR'?'🏢':a.type==='BOOKING'?'🎫':'🔔'}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight: a.read?400:700, color:'var(--navy)' }}>{a.message}</div>
                      <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:3 }}>
                        {new Date(a.createdAt).toLocaleString('en-UG',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                  {!a.read && (
                    <button onClick={() => markAlertRead(a.id)}
                      style={{ fontSize:11, padding:'5px 10px', border:'1px solid var(--gray-300)', borderRadius:99, background:'white', cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600, color:'var(--gray-600)', flexShrink:0 }}>
                      Mark read
                    </button>
                  )}
                </div>
              ))}
              {alerts.length === 0 && <Empty icon='🔔' text='No alerts yet' />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
