import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { Badge, Spinner, Empty, formatUGX, statusColor } from '../../components/UI';

export default function SearchResults() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/trips/search', { params: Object.fromEntries(params) });
        setTrips(data);
      } catch { setTrips([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [params.toString()]);

  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const date = params.get('date') || '';

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:'var(--navy)', padding:'20px 20px 24px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <button onClick={() => nav('/')} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:10, width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:18, cursor:'pointer' }}>←</button>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'white' }}>
              {from && to ? `${from} → ${to}` : from ? `From ${from}` : 'All Trips'}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{date} · {trips.length} trips found</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'16px 16px 0' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:48 }}><Spinner /></div>
        ) : trips.length === 0 ? (
          <Empty icon='🔍' text='No trips found. Try a different date or route.' />
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => nav(`/book/${trip.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, onClick }) {
  const avail = trip.availableSeats || 0;
  const pct = avail / trip.totalSeats;
  const urgency = pct < 0.2 ? 'red' : pct < 0.5 ? 'gold' : 'green';

  return (
    <div onClick={onClick} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', overflow:'hidden', cursor:'pointer', boxShadow:'var(--shadow-sm)', border:'1px solid var(--gray-200)', transition:'box-shadow 0.15s' }}>
      {/* Top accent bar */}
      <div style={{ height:4, background: urgency === 'green' ? 'var(--green)' : urgency === 'gold' ? 'var(--gold)' : 'var(--red)' }} />
      <div style={{ padding:16 }}>
        {/* Route + time */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800, color:'var(--navy)', letterSpacing:'-0.3px' }}>
              {trip.from} <span style={{ color:'var(--gold)' }}>→</span> {trip.to}
            </div>
            <div style={{ fontSize:13, color:'var(--gray-400)', marginTop:2 }}>
              {new Date(trip.departureTime).toLocaleTimeString('en-UG',{hour:'2-digit',minute:'2-digit'})} · {trip.duration}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'var(--gold)', letterSpacing:'-0.5px' }}>
              {(trip.price/1000).toFixed(0)}K
            </div>
            <div style={{ fontSize:11, color:'var(--gray-400)' }}>UGX per seat</div>
          </div>
        </div>

        {/* Operator + vehicle */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <div style={{ width:28, height:28, background:'var(--gold-light)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🚌</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>{trip.operatorName || 'Raylane Express'}</div>
              <div style={{ fontSize:11, color:'var(--gray-400)' }}>{trip.vehicle} · {trip.vehicleType?.replace('_',' ')}</div>
            </div>
          </div>
          <Badge variant={urgency}>{avail} seats left</Badge>
        </div>

        {/* Amenities */}
        {trip.amenities?.length > 0 && (
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
            {trip.amenities.map(a => (
              <span key={a} style={{ fontSize:11, background:'var(--gray-100)', color:'var(--gray-600)', padding:'3px 8px', borderRadius:99, fontWeight:500 }}>{a}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ background:'var(--navy)', borderRadius:'var(--radius-md)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <span style={{ fontSize:14, fontWeight:700, color:'var(--gold)', fontFamily:'var(--font-display)' }}>Select Seat & Book</span>
          <span style={{ color:'var(--gold)' }}>→</span>
        </div>
      </div>
    </div>
  );
}
