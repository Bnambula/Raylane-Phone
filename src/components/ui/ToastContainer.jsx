import React from 'react'

const ICONS = { success:'[OK]', warning:'[!]?', error:'?' }

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ flexShrink:0 }}>{ICONS[t.type] || '[BELL]'}</span>
          <span style={{ flex:1 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
