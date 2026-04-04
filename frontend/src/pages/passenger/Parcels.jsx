import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Btn } from '../../components/UI';

const CITIES = ['Kampala','Mbale','Gulu','Mbarara','Jinja','Masaka','Lira','Arua','Fort Portal','Kabale'];

export default function Parcels() {
  const nav = useNavigate();
  const [tab, setTab] = useState('book'); // book | track
  const [form, setForm] = useState({ senderName:'', senderPhone:'', recipientName:'', recipientPhone:'', destination:'Mbale', description:'', weight:1, insure:false });
  const [trackCode, setTrackCode] = useState('');
  const [result, setResult] = useState(null);
  const [tracked, setTracked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const book = async e => {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      const { data } = await api.post('/parcels', form);
      setResult(data);
    } catch(e) { setErr(e.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  const track = async e => {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      const { data } = await api.get(`/parcels/track/${trackCode}`);
      setTracked(data);
    } catch { setErr('Parcel not found'); }
    finally { setLoading(false); }
  };

  const fee = Math.max(5000, form.weight * 2000);
  const insurance = form.insure ? Math.round(fee * 0.03) : 0;

  const STATUS_STEPS = ['BOOKED','PICKED_UP','IN_TRANSIT','DELIVERED'];

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', paddingBottom:80 }}>
      <div style={{ background:'var(--navy)', padding:'20px 20px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => nav('/')} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:10, width:38, height:38, color:'white', fontSize:18, cursor:'pointer' }}>←</button>
          <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'white' }}>Parcel Delivery</div>
        </div>
        <div style={{ display:'flex', background:'rgba(255,255,255,0.1)', borderRadius:'var(--radius-md)', padding:4 }}>
          {['book','track'].map(t => (
            <button key={t} onClick={() => { setTab(t); setResult(null); setTracked(null); setErr(''); }}
              style={{ flex:1, padding:'10px', border:'none', borderRadius:'var(--radius-sm)', background: tab===t ? 'var(--gold)' : 'transparent', color: tab===t ? 'var(--navy)' : 'rgba(255,255,255,0.7)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)', transition:'all 0.2s', textTransform:'capitalize' }}>
              {t === 'book' ? '📦 Send Parcel' : '🔍 Track Parcel'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'20px 16px' }}>
        {result ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:56, marginBottom:12 }}>📦</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--navy)', marginBottom:8 }}>Parcel Booked!</h2>
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:24, boxShadow:'var(--shadow-md)', maxWidth:360, margin:'0 auto', textAlign:'left' }}>
              {[['Tracking Code', result.trackingCode],['Destination', result.destination],['Weight', `${result.weight}kg`],['Fee', `UGX ${result.fee?.toLocaleString()}`]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
                  <span style={{ fontSize:13, color:'var(--gray-400)' }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:700, color: k==='Tracking Code' ? 'var(--gold)' : 'var(--navy)', fontFamily: k==='Tracking Code' ? 'monospace' : 'inherit' }}>{v}</span>
                </div>
              ))}
              <div style={{ background:'var(--gold-light)', borderRadius:'var(--radius-md)', padding:12, marginTop:16, textAlign:'center' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Your Tracking Code</div>
                <div style={{ fontFamily:'monospace', fontSize:22, fontWeight:800, color:'var(--navy)', letterSpacing:2 }}>{result.trackingCode}</div>
              </div>
            </div>
            <Btn full variant='navy' onClick={() => { setResult(null); setForm({senderName:'',senderPhone:'',recipientName:'',recipientPhone:'',destination:'Mbale',description:'',weight:1,insure:false}); }} style={{ marginTop:16 }}>Send Another</Btn>
          </div>
        ) : tab === 'book' ? (
          <form onSubmit={book}>
            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, boxShadow:'var(--shadow-sm)', marginBottom:12 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:16 }}>Sender Details</h3>
              {[['senderName','Full Name','text'],['senderPhone','Phone Number','tel']].map(([k,l,t]) => (
                <div key={k} style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>{l}</label>
                  <input value={form[k]} onChange={set(k)} type={t} required style={{ width:'100%', height:44, padding:'0 14px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none' }} />
                </div>
              ))}
            </div>

            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, boxShadow:'var(--shadow-sm)', marginBottom:12 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:16 }}>Recipient Details</h3>
              {[['recipientName','Full Name','text'],['recipientPhone','Phone Number','tel']].map(([k,l,t]) => (
                <div key={k} style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>{l}</label>
                  <input value={form[k]} onChange={set(k)} type={t} required style={{ width:'100%', height:44, padding:'0 14px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none' }} />
                </div>
              ))}
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>Destination</label>
                <select value={form.destination} onChange={set('destination')} style={{ width:'100%', height:44, padding:'0 14px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none' }}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, boxShadow:'var(--shadow-sm)', marginBottom:12 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:16 }}>Parcel Info</h3>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>Description</label>
                <input value={form.description} onChange={set('description')} required placeholder='e.g. Electronics, clothes...' style={{ width:'100%', height:44, padding:'0 14px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none' }} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>Weight (kg)</label>
                <input value={form.weight} onChange={set('weight')} type='number' min='0.1' step='0.1' required style={{ width:'100%', height:44, padding:'0 14px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', outline:'none' }} />
              </div>

              {/* Insurance */}
              <div onClick={() => setForm(p=>({...p,insure:!p.insure}))} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--gray-50)', borderRadius:'var(--radius-md)', padding:14, cursor:'pointer' }}>
                <div>
                  <div style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>Add Insurance (3%)</div>
                  <div style={{ fontSize:12, color:'var(--gray-400)' }}>+UGX {insurance.toLocaleString()} · Protected delivery</div>
                </div>
                <div style={{ width:44, height:24, borderRadius:99, background: form.insure ? 'var(--green)' : 'var(--gray-200)', display:'flex', alignItems:'center', padding:2, transition:'background 0.2s' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'white', transform: form.insure ? 'translateX(20px)' : 'translateX(0)', transition:'transform 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>

              {/* Fee summary */}
              <div style={{ marginTop:16, background:'var(--navy)', borderRadius:'var(--radius-md)', padding:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>Delivery fee ({form.weight}kg)</span>
                  <span style={{ color:'white', fontSize:13 }}>UGX {fee.toLocaleString()}</span>
                </div>
                {insurance > 0 && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>Insurance</span>
                  <span style={{ color:'white', fontSize:13 }}>UGX {insurance.toLocaleString()}</span>
                </div>}
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', marginTop:8, paddingTop:8, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ color:'white', fontWeight:700 }}>Total</span>
                  <span style={{ color:'var(--gold)', fontWeight:800, fontSize:18, fontFamily:'var(--font-display)' }}>UGX {(fee+insurance).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {err && <div style={{ background:'#FEE2E2', color:'var(--red)', padding:'10px 14px', borderRadius:'var(--radius-md)', marginBottom:12, fontSize:13 }}>{err}</div>}
            <Btn type='submit' full disabled={loading} style={{ height:52 }}>{loading ? 'Booking...' : '📦 Book Parcel →'}</Btn>
          </form>
        ) : (
          <div>
            <form onSubmit={track} style={{ marginBottom:20 }}>
              <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, boxShadow:'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:16 }}>Track Your Parcel</h3>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>Tracking Code</label>
                  <input value={trackCode} onChange={e => setTrackCode(e.target.value)} placeholder='e.g. RYAB1234' style={{ width:'100%', height:48, padding:'0 16px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:16, fontFamily:'monospace', outline:'none', letterSpacing:1 }} />
                </div>
                {err && <div style={{ background:'#FEE2E2', color:'var(--red)', padding:'10px 14px', borderRadius:'var(--radius-md)', marginBottom:12, fontSize:13 }}>{err}</div>}
                <Btn type='submit' full disabled={loading}>{loading ? 'Searching...' : '🔍 Track Parcel'}</Btn>
              </div>
            </form>

            {tracked && (
              <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:20, boxShadow:'var(--shadow-md)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'var(--navy)' }}>{tracked.id}</div>
                    <div style={{ fontSize:13, color:'var(--gray-400)' }}>To {tracked.destination}</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:99, background: tracked.status==='DELIVERED'?'var(--green-light)':'var(--gold-light)', color: tracked.status==='DELIVERED'?'#00885A':'#C47D00', textTransform:'uppercase', letterSpacing:'0.05em' }}>{tracked.status}</span>
                </div>

                {/* Progress */}
                <div style={{ position:'relative', paddingLeft:24, marginBottom:20 }}>
                  <div style={{ position:'absolute', left:8, top:8, bottom:8, width:2, background:'var(--gray-200)' }} />
                  {STATUS_STEPS.map((s,i) => {
                    const done = STATUS_STEPS.indexOf(tracked.status) >= i;
                    return (
                      <div key={s} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:16, position:'relative' }}>
                        <div style={{ position:'absolute', left:-20, width:16, height:16, borderRadius:'50%', background: done ? 'var(--green)' : 'var(--gray-200)', border:`2px solid ${done?'var(--green)':'var(--gray-300)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'white' }}>{done ? '✓' : ''}</div>
                        <div style={{ fontSize:14, fontWeight: done?600:400, color: done?'var(--navy)':'var(--gray-400)' }}>{s.replace('_',' ')}</div>
                      </div>
                    );
                  })}
                </div>

                {[['Sender', tracked.senderName], ['Recipient', tracked.recipientName], ['Description', tracked.description], ['Weight', `${tracked.weight}kg`]].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:'1px solid var(--gray-100)' }}>
                    <span style={{ fontSize:13, color:'var(--gray-400)' }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:'var(--navy)' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'var(--white)', borderTop:'1px solid var(--gray-200)', display:'flex', padding:'10px 0 16px', zIndex:100 }}>
        {[['🏠','Home','/'],['🔍','Search','/search'],['📦','Parcels','/parcels'],['🎫','Tickets','/track']].map(([icon,label,path]) => (
          <div key={path} onClick={() => nav(path)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer' }}>
            <div style={{ fontSize:22 }}>{icon}</div>
            <div style={{ fontSize:10, fontWeight:500, color: window.location.pathname===path?'var(--gold)':'var(--gray-400)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
