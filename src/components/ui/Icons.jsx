import React from 'react'

/* All icons as clean inline SVG - no emoji, no placeholders, works everywhere */
const I = ({ d, size=18, stroke='currentColor', fill='none', sw=2, vb='0 0 24 24' }) => (
  <svg width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round" viewBox={vb} style={{ flexShrink:0 }}>
    {Array.isArray(d) ? d.map((path,i) => <path key={i} d={path}/>) : <path d={d}/>}
  </svg>
)

export const IconSearch    = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
export const IconBus       = ({size=18,color='currentColor'}) => <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="3" width="22" height="16" rx="2"/><path d="M1 10h22M7 19v2M17 19v2M5 3v8M19 3v8"/><circle cx="7.5" cy="15.5" r="1.5"/><circle cx="16.5" cy="15.5" r="1.5"/></svg>
export const IconParcel    = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"]}/>
export const IconEnvelope  = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]}/>
export const IconChart     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M3 3v18h18M18 8l-5 5-4-4-3 3"/>
export const IconMoney     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M12 2a10 10 0 100 20 10 10 0 000-20z","M12 6v6l4 2"]} vb="0 0 24 24"/>
export const IconPhone     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.17 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/>
export const IconCheck     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M20 6L9 17l-5-5"/>
export const IconUser      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 3a4 4 0 110 8 4 4 0 010-8z"]}/>
export const IconUsers     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75","M9 7a4 4 0 100 8 4 4 0 000-8z"]}/>
export const IconAlert     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"]}/>
export const IconShield    = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
export const IconCar       = ({size=18,color='currentColor'}) => <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
export const IconPin       = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z","M12 7a3 3 0 100 6 3 3 0 000-6z"]}/>
export const IconLock      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"]}/>
export const IconStar      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} fill={color} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
export const IconGlobe     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M12 2a10 10 0 100 20A10 10 0 0012 2z","M2 12h20","M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"]}/>
export const IconInfo      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 16v-4","M12 8h.01"]}/>
export const IconWarn      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"]}/>
export const IconFlash     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
export const IconClock     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 6v6l4 2"]}/>
export const IconDoc       = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>
export const IconGift      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M20 12v10H4V12","M2 7h20v5H2z","M12 22V7","M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z","M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"]}/>
export const IconCargo     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z","M18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"]}/>
export const IconArrow     = ({size=18,color='currentColor',dir='right'}) => {
  const paths = { right:"M5 12h14M12 5l7 7-7 7", left:"M19 12H5M12 19l-7-7 7-7", up:"M12 19V5M5 12l7-7 7 7", down:"M12 5v14M19 12l-7 7-7-7" }
  return <I size={size} stroke={color} d={paths[dir]}/>
}
export const IconX         = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M18 6L6 18M6 6l12 12"/>
export const IconMenu      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M3 12h18M3 6h18M3 18h18"/>
export const IconGrid      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M3 3h7v7H3z","M14 3h7v7h-7z","M3 14h7v7H3z","M14 14h7v7h-7z"]}/>
export const IconSettings  = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"]}/>
export const IconReport    = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>
export const IconTicket    = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z","M13 5v2","M13 17v2","M13 11v2"]}/>
export const IconCash      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M12 2a10 10 0 100 20A10 10 0 0012 2z","M12 6v12","M15 9H9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 010 5H9"]}/>
export const IconTruck     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z","M18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"]}/>
export const IconSend      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
export const IconPay       = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z","M1 10h22"]}/>
export const IconFuel      = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M3 22V5a2 2 0 012-2h8a2 2 0 012 2v17","M3 11h12","M19 7l2 2-2 2","M19 22V9"]}/>
export const IconHR        = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 7a4 4 0 100 8 4 4 0 000-8z","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"]}/>
export const IconWrench    = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
export const IconAnalytics = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d="M3 3v18h18M18 8l-5 5-4-4-3 3"/>
export const IconSacco     = ({size=18,color='currentColor'}) => <I size={size} stroke={color} d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"]}/>

/* Parcel type icons with background circle */
export function ParcelIcon({ type, size=48 }) {
  const configs = {
    envelope: { icon:<IconEnvelope size={24} color="#0B3D91"/>, bg:'#dbeafe' },
    small:    { icon:<IconParcel   size={24} color="#15803d"/>, bg:'#dcfce7' },
    large:    { icon:<IconGift     size={24} color="#7c3aed"/>, bg:'#ede9fe' },
    cargo:    { icon:<IconCargo    size={24} color="#c2410c"/>, bg:'#ffedd5' },
  }
  const cfg = configs[type] || configs.small
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.25, background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {cfg.icon}
    </div>
  )
}
