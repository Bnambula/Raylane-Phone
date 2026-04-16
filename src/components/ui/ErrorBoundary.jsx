import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error:null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('Raylane dashboard error:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F5F7FA', padding:24, paddingTop:'var(--nav-h)' }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, maxWidth:480, width:'100%', textAlign:'center', boxShadow:'0 4px 24px rgba(0,0,0,.08)' }}>
            <div style={{ width:60, height:60, borderRadius:16, background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="28" height="28" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:20, marginBottom:8 }}>Something went wrong</h2>
            <p style={{ color:'#64748b', fontFamily:"'Inter',sans-serif", fontSize:14, marginBottom:6, lineHeight:1.7 }}>
              The dashboard encountered an error. This is usually caused by stale cached data.
            </p>
            <p style={{ background:'#fee2e2', borderRadius:10, padding:'8px 12px', fontSize:12, color:'#dc2626', fontFamily:"'Inter',sans-serif", marginBottom:20, textAlign:'left', wordBreak:'break-all' }}>
              {this.state.error.message || 'Unknown error'}
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => { sessionStorage.clear(); window.location.reload() }}
                style={{ padding:'12px 24px', borderRadius:12, background:'#0B3D91', color:'#fff', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                Clear Cache and Reload
              </button>
              <button onClick={() => window.location.href = '/'}
                style={{ padding:'12px 24px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748b', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
