import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Btn } from '../../components/UI';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');
  const { login, loading } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault(); setErr('');
    try {
      const u = await login(form.email, form.password);
      if (u.role === 'admin') nav('/admin');
      else if (u.role === 'operator') nav('/operator');
    } catch(e) { setErr(e.response?.data?.error || 'Invalid credentials'); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--navy)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>
      {/* Background circles */}
      {[0,1,2].map(i => (
        <div key={i} style={{ position:'absolute', width:300+i*100, height:300+i*100, borderRadius:'50%', border:`1px solid rgba(245,166,35,${0.06-i*0.015})`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
      ))}

      <div style={{ width:'100%', maxWidth:400, position:'relative', zIndex:2 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:60, height:60, background:'var(--gold)', borderRadius:18, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:28, marginBottom:12, boxShadow:'0 8px 24px rgba(245,166,35,0.4)' }}>🚌</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, color:'white', letterSpacing:'-1px' }}>Raylane</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:4 }}>Operator & Admin Portal</div>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'var(--radius-xl)', padding:32 }}>
          {/* Demo credentials */}
          <div style={{ background:'rgba(245,166,35,0.1)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:'var(--radius-md)', padding:12, marginBottom:24, fontSize:12, color:'rgba(255,255,255,0.7)' }}>
            <div style={{ fontWeight:700, color:'var(--gold)', marginBottom:4 }}>Demo Credentials</div>
            <div>Admin: admin@raylane.ug / admin123</div>
            <div>Operator: gaaga@buses.ug / operator123</div>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Email</label>
              <input value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} type='email' required placeholder='your@email.com'
                style={{ width:'100%', height:48, padding:'0 16px', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', background:'rgba(255,255,255,0.07)', color:'white', outline:'none' }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Password</label>
              <input value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} type='password' required placeholder='••••••••'
                style={{ width:'100%', height:48, padding:'0 16px', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:'var(--radius-md)', fontSize:15, fontFamily:'var(--font-body)', background:'rgba(255,255,255,0.07)', color:'white', outline:'none' }} />
            </div>
            {err && <div style={{ background:'rgba(239,68,68,0.15)', color:'#FCA5A5', padding:'10px 14px', borderRadius:'var(--radius-md)', marginBottom:16, fontSize:13 }}>{err}</div>}
            <Btn type='submit' full disabled={loading} style={{ height:52, fontSize:16 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </Btn>
          </form>
        </div>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Passenger? </span>
          <span onClick={() => nav('/')} style={{ fontSize:13, color:'var(--gold)', cursor:'pointer', fontWeight:600 }}>Book a seat →</span>
        </div>
      </div>
    </div>
  );
}
