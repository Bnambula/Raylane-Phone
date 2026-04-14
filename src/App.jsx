import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import Home from './pages/Home'
import BookingFlow from './pages/BookingFlow'
import ParcelPage from './pages/ParcelPage'
import OperatorDashboard from './pages/operator/OperatorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import PartnerPortal from './pages/PartnerPortal'
import ToastContainer from './components/ui/ToastContainer'
import AccountPage from './pages/AccountPage'
import { ToastContext } from './hooks/useToast'

const DASH_ROUTES = ['/admin', '/operator']

function AppInner() {
  const [toasts, setToasts] = useState([])
  const location = useLocation()

  const addToast = (msg, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800)
  }

  const isDash = DASH_ROUTES.some(r => location.pathname.startsWith(r))

  React.useEffect(() => {
    if (!location.hash) window.scrollTo({ top:0, behavior:'smooth' })
  }, [location.pathname])

  return (
    <ToastContext.Provider value={addToast}>
      {!isDash && <Navbar />}
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/book"     element={<BookingFlow />} />
        <Route path="/parcels"  element={<ParcelPage />} />
        <Route path="/partner"  element={<PartnerPortal />} />
        <Route path="/operator/*" element={<OperatorDashboard />} />
        <Route path="/admin/*"    element={<AdminDashboard />} />
        <Route path="/account"    element={<AccountPage />} />
        <Route path="*"         element={<Home />} />
      </Routes>
      {!isDash && <MobileBottomNav />}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

export default function App() {
  return <AppInner />
}
