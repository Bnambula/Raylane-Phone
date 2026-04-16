import { useState, useEffect } from 'react'
import appStore from '../store/appStore'

export function useStore() {
  const [state, setState] = useState(appStore.getState())
  useEffect(() => appStore.subscribe(setState), [])
  return [state, appStore]
}

export function useOperatorStore(operatorId) {
  const [state, setState] = useState(appStore.getState())
  useEffect(() => appStore.subscribe(setState), [])

  const safe = {
    operators:     state.operators     || [],
    trips:         state.trips         || [],
    bookings:      state.bookings      || [],
    cost_entries:  state.cost_entries  || [],
    vendors:       state.vendors       || [],
    bank_loans:    state.bank_loans    || [],
    vehicles:      state.vehicles      || [],
    invoices:      state.invoices      || [],
    notifications: state.notifications || { admin:[], operator:{} },
  }

  const op            = safe.operators.find(o => o.id === operatorId) || null
  const trips         = safe.trips.filter(t => t.operator_id === operatorId)
  const bookings      = safe.bookings.filter(b => b.operator_id === operatorId)
  const costs         = safe.cost_entries.filter(c => c.operator_id === operatorId)
  const vendors       = safe.vendors.filter(v => v.operator_id === operatorId)
  const vehicles      = safe.vehicles.filter(v => v.operator_id === operatorId)
  const invoices      = safe.invoices.filter(i => i.operator_id === operatorId)
  const opNotifs      = safe.notifications.operator || {}
  const notifications = opNotifs[operatorId] || []
  const unreadCount   = notifications.filter(n => !n.read).length
  const summary       = appStore.getFinancialSummary(operatorId)

  return {
    state: { ...state, ...safe },
    st: appStore,
    op, trips, bookings, costs, vendors, vehicles, notifications, unreadCount, invoices, summary
  }
}

export function useAdminStore() {
  const [state, setState] = useState(appStore.getState())
  useEffect(() => appStore.subscribe(setState), [])

  const safe = {
    trips:         state.trips         || [],
    bookings:      state.bookings      || [],
    operators:     state.operators     || [],
    applications:  state.applications  || [],
    notifications: state.notifications || { admin:[], operator:{} },
    payouts:       state.payouts       || [],
    audit_log:     state.audit_log     || [],
    vehicles:      state.vehicles      || [],
    parcels:       state.parcels       || [],
  }

  const pendingTrips    = safe.trips.filter(t => t.status === 'PENDING_APPROVAL')
  const pendingApps     = safe.applications.filter(a => a.status === 'PENDING_REVIEW')
  const adminNotifs     = safe.notifications.admin || []
  const unreadCount     = adminNotifs.filter(n => !n.read).length
  const liveTrips       = safe.trips.filter(t => t.status === 'APPROVED')
  const totalRevenue    = safe.bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((s, b) => s + (b.amount || 0), 0)
  const totalCommission = safe.operators.reduce((sum, op) => {
    const rev = safe.bookings
      .filter(b => b.operator_id === op.id && b.status === 'CONFIRMED')
      .reduce((s, b) => s + (b.amount || 0), 0)
    return sum + Math.round(rev * (op.commission_rate || 0))
  }, 0)

  return {
    state: { ...state, ...safe },
    st: appStore,
    pendingTrips, pendingApps, unreadCount, liveTrips, totalRevenue, totalCommission,
    adminNotifs
  }
}
