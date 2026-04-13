/**
 * RAYLANE EXPRESS -- SUPABASE CLIENT
 * Replace VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 *
 * .env.local:
 *   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
 *   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
 */

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://placeholder.supabase.co'
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

/* ??? tiny fetch wrapper (no SDK dep -- keeps bundle small) ??? */
export async function sbFetch(table, opts={}) {
  const { select='*', eq={}, order=null, limit=null, insert=null, update=null, id=null } = opts
  let url = `${SUPABASE_URL}/rest/v1/${table}`
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  }

  // Build query string
  const params = new URLSearchParams()
  if (select) params.set('select', select)
  if (id) params.set('id', `eq.${id}`)
  Object.entries(eq).forEach(([k,v]) => params.set(k, `eq.${v}`))
  if (order) params.set('order', order)
  if (limit) params.set('limit', limit)
  if (params.toString()) url += `?${params}`

  let method = 'GET', body = undefined
  if (insert)  { method = 'POST';  body = JSON.stringify(insert) }
  if (update)  { method = 'PATCH'; body = JSON.stringify(update) }

  const res = await fetch(url, { method, headers, body })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Supabase ${method} ${table} failed: ${res.status}`)
  }
  return res.json()
}

/* ??? REALTIME subscription helper ??? */
export function subscribeToTable(table, callback) {
  const ws = new WebSocket(
    `${SUPABASE_URL.replace('https','wss')}/realtime/v1/websocket?apikey=${SUPABASE_KEY}&vsn=1.0.0`
  )
  ws.onopen = () => {
    ws.send(JSON.stringify({
      topic: `realtime:public:${table}`,
      event: 'phx_join',
      payload: { config: { broadcast: { self: true }, presence: { key: '' }, postgres_changes: [{ event: '*', schema: 'public', table }] } },
      ref: '1'
    }))
  }
  ws.onmessage = e => {
    const msg = JSON.parse(e.data)
    if (msg.event === 'postgres_changes') callback(msg.payload)
  }
  ws.onerror = err => console.warn('Realtime WS error:', err)
  return () => ws.close()
}

/* ??? AUTH ??? */
export const auth = {
  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error_description || 'Sign in failed')
    localStorage.setItem('rlx_token', data.access_token)
    return data
  },
  signOut() { localStorage.removeItem('rlx_token') },
  getToken() { return localStorage.getItem('rlx_token') },
}

/* ??? TYPED HELPERS ??? */
export const db = {
  trips:       (opts) => sbFetch('trips',        opts),
  bookings:    (opts) => sbFetch('bookings',      opts),
  operators:   (opts) => sbFetch('operators',     opts),
  payouts:     (opts) => sbFetch('payouts',       opts),
  costs:       (opts) => sbFetch('cost_entries',  opts),
  vendors:     (opts) => sbFetch('vendors',       opts),
  loans:       (opts) => sbFetch('bank_loans',    opts),
  vehicles:    (opts) => sbFetch('vehicles',      opts),
  drivers:     (opts) => sbFetch('drivers',       opts),
  parcels:     (opts) => sbFetch('parcels',       opts),
  reviews:     (opts) => sbFetch('reviews',       opts),
  notifications:(opts)=> sbFetch('notifications', opts),
  audit:       (opts) => sbFetch('audit_log',     opts),
  modules:     (opts) => sbFetch('operator_modules', opts),
  invoices:    (opts) => sbFetch('saas_invoices', opts),
  applications:(opts) => sbFetch('applications',  opts),
  liveTrips: (from, to) => sbFetch('trips', {
    select: '*,operators(company_name,rating,review_count,merchant_code)',
    eq: { status: 'APPROVED', ...(from ? { from_city: from } : {}), ...(to ? { to_city: to } : {}) },
    order: 'departure_time.asc',
  }),
}
