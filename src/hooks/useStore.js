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
  const op = state.operators.find(o => o.id === operatorId)
  const trips = state.trips.filter(t => t.operator_id === operatorId)
  const bookings = state.bookings.filter(b => b.operator_id === operatorId)
  const notifications = (state.notifications.operator[operatorId] || [])
  const unreadCount = notifications.filter(n => !n.read).length
  return { state, store, op, trips, bookings, notifications, unreadCount }
}

export function useAdminStore() {
  const [state, setState] = useState(store.getState())
  useEffect(() => store.subscribe(setState), [])
  const unreadCount = state.notifications.admin.filter(n => !n.read).length
  const pendingTrips = state.trips.filter(t => t.status === 'PENDING_APPROVAL')
  const pendingApps = state.applications.filter(a => a.status === 'PENDING_REVIEW')
  return { state, store, unreadCount, pendingTrips, pendingApps }
}
