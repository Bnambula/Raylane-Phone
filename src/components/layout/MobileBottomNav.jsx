import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ITEMS = [
  {
    label: 'Search', to: '/',
    icon: (active) => (
      <svg width="22" height="22" fill="none" stroke={active?'#0B3D91':'#94a3b8'} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    )
  },
  {
    label: 'Bookings', to: '/book',
    icon: (active) => (
      <svg width="22" height="22" fill="none" stroke={active?'#0B3D91':'#94a3b8'} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    )
  },
  {
    label: 'Parcels', to: '/parcels',
    icon: (active) => (
      <svg width="22" height="22" fill="none" stroke={active?'#0B3D91':'#94a3b8'} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      </svg>
    )
  },
  {
    label: 'Account', to: '/admin',
    icon: (active) => (
      <svg width="22" height="22" fill="none" stroke={active?'#0B3D91':'#94a3b8'} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
]

export default function MobileBottomNav() {
  const navigate   = useNavigate()
  const location   = useLocation()

  // Hide on dashboard pages -- they have their own nav
  if (['/admin', '/operator'].some(p => location.pathname.startsWith(p))) return null

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 900,
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      /* KEY FIX: force horizontal flex row */
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    }}>
      {ITEMS.map(item => {
        const active = location.pathname === item.to
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '8px 4px 6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#0B3D91' : '#94a3b8',
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: 1,
              WebkitTapHighlightColor: 'transparent',
              transition: 'color 0.15s',
              minWidth: 0,
              /* Prevent any column layout override */
              width: '25%',
            }}
          >
            {item.icon(active)}
            <span style={{ marginTop: 2 }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
