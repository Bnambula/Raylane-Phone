import { useState, useEffect } from 'react'
import store from '../store/appStore'

export function useStore() {
  const [state, setState] = useState(store.getState())
  useEffect(() => store.subscribe(setState), [])
  return [state, store]
}

export function useOperatorStore(operatorId) {
  const [state, setState] = useState(store.getState())
  useEffect(() => store.subscribe(setState), [])
  const op            = state.operators.find(o => o.id === operatorId)
  const trips         = state.trips.filter(t => t.operator_id === operatorId)
  const bookings      = state.bookings.filter(b => b.operator_id === operatorId)
  const costs         = state.cost_entries.filter(c => c.operator_id === operatorId)
  const vendors       = state.vendors.filter(v => v.operator_id === operatorId)
  const loans         = state.bank_loans.filter(l => l.operator_id === operatorId)
  const vehicles      = (state.vehicles||[]).filter(v => v.operator_id === operatorId)
  const notifications = (state.notifications.operator[operatorId] || [])
  const unreadCount   = notifications.filter(n => !n.read).length
  const invoices      = (state.invoices||[]).filter(i => i.operator_id === operatorId)
  const summary       = store.getFinancialSummary(operatorId)
  return { state, store, op, trips, bookings, costs, vendors, loans, vehicles, notifications, unreadCount, invoices, summary }
}

export function useAdminStore() {
  const [state, setState] = useState(store.getState())
  useEffect(() => store.subscribe(setState), [])
  const pendingTrips  = state.trips.filter(t => t.status === 'PENDING_APPROVAL')
  const pendingApps   = state.applications.filter(a => a.status === 'PENDING_REVIEW')
  const unreadCount   = state.notifications.admin.filter(n => !n.read).length
  const liveTrips     = state.trips.filter(t => t.status === 'APPROVED')
  const totalRevenue  = state.bookings.filter(b=>b.status==='CONFIRMED').reduce((s,b)=>s+(b.amount||0),0)
  const totalCommission = state.operators.reduce((sum,op)=>{
    const rev = state.bookings.filter(b=>b.operator_id===op.id&&b.status==='CONFIRMED').reduce((s,b)=>s+(b.amount||0),0)
    return sum + Math.round(rev * (op.commission_rate||0))
  },0)
  return { state, store, pendingTrips, pendingApps, unreadCount, liveTrips, totalRevenue, totalCommission }
}
