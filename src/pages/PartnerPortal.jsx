import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import store from '../store/appStore'
import { Card, Btn, Banner, StatCard, Pill } from '../components/ui/SharedComponents'
import Footer from '../components/layout/Footer'

const SERVICES = [
  { icon:'[BANK]', name:'Sacco Module',          price:'UGX 200,000/mo', desc:'Run a full savings & loan cooperative for your staff' },
  { icon:'[CARD]', name:'Bank Loan Monitor',      price:'UGX 150,000/mo', desc:'Track all bank loans, due dates, and repayments' },
  { icon:'[USERS]', name:'Staff / HR Management',  price:'UGX 100,000/mo', desc:'Payroll, leave management, and staff records' },
  { icon:'?', name:'Fleet Maintenance',      price:'UGX 120,000/mo', desc:'Service schedules, repair costs, roadworthiness alerts' },
  { icon:'?', name:'Fuel Management',         price:'UGX 80,000/mo',  desc:'Fuel consumption, driver efficiency, anomaly detection' },
  { icon:'[SHIELD]?', name:'Insurance Dashboard',    price:'UGX 80,000/mo',  desc:'Policy tracking, renewal reminders, claims management' },
  { icon:'[CHART]', name:'Advanced Analytics',     price:'UGX 100,000/mo', desc:'Route profitability, passenger trends, forecasting' },
  { icon:'?', name:'Supplier & Vendor Pay',  price:'UGX 60,000/mo',  desc:'Pay vendors via MoMo, track payables, manage invoices' },
]

const STEPS = [
  { n:1, icon:'[CALL]', title:'We Visit You', desc:'A Raylane representative visits your business to understand your operations, fleet size, and routes.' },
  { n:2, icon:'?', title:'Agreement Signed', desc:'We sign a partnership agreement. You agree to the 8% commission on bookings made through Raylane.' },
  { n:3, icon:'??', title:'Dashboard Setup', desc:'Your Operator Dashboard is created. Staff accounts configured. Routes verified by admin.' },
  { n:4, icon:'?', title:'Go Live!', desc:'Your trips appear on Raylane Express. Passengers can book your seats in real-time, 24/7.' },
]

const STATS = [
  { icon:'[BUS]', label:'Partner Operators',  value:'500+',  sub:'Verified', bg:'#dbeafe', color:'#1d4ed8' },
  { icon:'[USERS]', label:'Monthly Passengers', value:'2M+',   sub:'Active',   bg:'#dcfce7', color:'#15803d' },
  { icon:'[MONEY]', label:'Avg Revenue Growth', value:'40%',   sub:'Per Year', bg:'#fef9c3', color:'#92400e' },
  { icon:'?', label:'Operator Rating',    value:'4.7/5', sub:'Average',  bg:'#f3e8ff', color:'#7c3aed' },
]

const inputStyle = { width:'100%', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:"'Poppins',sans-serif", fontWeight:500, boxSizing:'border-box', WebkitAppearance:'none', outline:'none', transition:'border-color .2s' }
const labelStyle = { display:'block', fontSize:10, fontWeight:700, color:'#64748b', fontFamily:"'Poppins',sans-serif", textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }

export default function PartnerPortal() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name:'', company:'', phone:'', email:'', routes:'', fleet:'', message:'', interest:[] })
  const [activeSection, setActiveSection] = useState('apply')
  const toast = useToast()
  const navigate = useNavigate()

  const toggleInterest = svc => {
    setForm(f => ({
      ...f,
      interest: f.interest.includes(svc) ? f.interest.filter(x=>x!==svc) : [...f.interest, svc]
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.company) { toast('Please fill required fields', 'warning'); return }
    store.submitApplication({
      contact_name: form.name, company_name: form.company, phone: form.phone,
      email: form.email, fleet_size: parseInt(form.fleet)||0, current_routes: form.routes,
      modules_requested: ['booking_basic','parcel_basic', ...form.interest.map(s=>s.toLowerCase().replace(/\//g,'_')+'_module')],
      terms_accepted: true, signature_name: form.name, message: form.message
    })
    setSubmitted(true)
    toast('? Application submitted! Raylane Admin will review and contact you within 24 hours.', 'success')
  }

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--white)', minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#0B3D91 0%,#082d6e 60%,#0f4fa8 100%)', padding:'52px 0 44px', color:'var(--white)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,199,44,0.07)' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }}/>
        <div className="container" style={{ position:'relative' }}>
          <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.65)', cursor:'pointer', fontSize:13, fontFamily:"'Poppins',sans-serif", marginBottom:16, display:'flex', alignItems:'center', gap:6 }}>
            <- Back to Home
          </button>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'center', flexWrap:'wrap' }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,199,44,0.15)', padding:'5px 14px', borderRadius:20, marginBottom:14 }}>
                <span style={{ fontSize:13 }}>?</span>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)' }}>Partner Program</span>
              </div>
              <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:'clamp(1.8rem,3.5vw,2.8rem)', marginBottom:12, lineHeight:1.1 }}>
                Grow Your Transport<br/>Business with <span style={{ color:'var(--gold)' }}>Raylane</span>
              </h1>
              <p style={{ opacity:.82, fontSize:15, lineHeight:1.8, maxWidth:500, marginBottom:28 }}>
                We visit your business, understand your operations, and connect your buses to thousands of passengers online. You run your fleet -- we handle digital bookings and ticketing for a small commission.
              </p>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                {[['Free','Onboarding & Setup'],['8%','Commission Only'],['24/7','Operator Support']].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:22, color:'var(--gold)' }}>{n}</div>
                    <div style={{ fontSize:12, opacity:.75 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating stat cards */}
            <div className="hide-mobile" style={{ display:'flex', flexDirection:'column', gap:10, minWidth:220 }}>
              {[['[BUS] 500+','Partner Operators'],['[MONEY] 40%','Avg Revenue Growth'],['[PHONE] 2M+','Monthly Passengers']].map(([v,l]) => (
                <div key={l} style={{ background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', borderRadius:12, padding:'12px 16px', border:'1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15, color:'var(--gold)' }}>{v}</div>
                  <div style={{ fontSize:12, opacity:.8 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{ borderBottom:'2px solid var(--gray-mid)', background:'var(--white)', position:'sticky', top:'var(--nav-h)', zIndex:100 }}>
        <div className="container" style={{ display:'flex', gap:0, overflowX:'auto' }}>
          {[['apply','Apply to Join'],['howit','How It Works'],['services','Premium Services'],['faq','FAQ']].map(([id,l]) => (
            <button key={id} onClick={() => setActiveSection(id)} style={{ padding:'14px 20px', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:activeSection===id?'var(--blue)':'var(--gray-text)', borderTop:'none', borderLeft:'none', borderRight:'none', borderBottom:`2px solid ${activeSection===id?'var(--blue)':'transparent'}`, whiteSpace:'nowrap', transition:'all .2s', background:'none', cursor:'pointer' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding:'36px 16px 80px' }}>

        {/* -- APPLY -- */}
        {activeSection === 'apply' && !submitted && (
          <div className='partner-apply-grid' style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:48, alignItems:'start' }}>
            <div>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:'clamp(1.4rem,2.5vw,2rem)', marginBottom:20 }}>
                Why Operators <span style={{ color:'var(--gold)' }}>Choose Raylane</span>
              </h2>
              {[
                ['[CHART]','Digital Operations','Replace paper manifests with a real-time digital dashboard. Manage routes, bookings, and passengers from your phone.'],
                ['[MONEY]','Fill More Seats','Our platform exposes your trips to thousands of passengers. Top operators report 40%+ revenue growth within 6 months.'],
                ['[PHONE]','Mobile Money Payouts','Receive your net earnings directly to your MTN or Airtel MoMo account after each trip loads.'],
                ['[OK]','Transparent Pricing','8% commission on platform bookings only. Zero setup fee, zero monthly fee. Pay only when you earn.'],
                ['?','Premium Add-ons','Access Sacco, HR, Fleet, Fuel, and Loan management tools as your business grows -- each at a small monthly fee.'],
              ].map(([ic,t,d]) => (
                <div key={t} style={{ display:'flex', gap:14, marginBottom:20, alignItems:'flex-start' }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'rgba(11,61,145,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{ic}</div>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15, marginBottom:5 }}>{t}</div>
                    <div style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.7 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Application form */}
            <Card style={{ boxShadow:'var(--shadow-xl)' }}>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:20, marginBottom:5 }}>Apply to Join</h3>
              <p style={{ color:'var(--gray-text)', fontSize:13, marginBottom:22 }}>Free application . Response within 24-48 hours</p>
              <form onSubmit={handleSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                  {[['Contact Name *','name','text','e.g. John Ssemakula'],['Phone Number *','phone','tel','0771 000 000']].map(([l,k,t,ph]) => (
                    <div key={k}>
                      <label style={labelStyle}>{l}</label>
                      <input type={t} placeholder={ph} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                        style={inputStyle} onFocus={e=>e.target.style.borderColor='var(--blue)'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
                    </div>
                  ))}
                </div>
                {[['Company / Sacco Name *','company','text','e.g. Global Coaches Ltd'],['Email Address','email','email','info@company.ug'],['Current Routes (if any)','routes','text','e.g. Kampala -> Mbale, Gulu'],['Fleet Size (no. of vehicles)','fleet','number','e.g. 5']].map(([l,k,t,ph]) => (
                  <div key={k} style={{ marginBottom:14 }}>
                    <label style={labelStyle}>{l}</label>
                    <input type={t} placeholder={ph} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                      style={inputStyle} onFocus={e=>e.target.style.borderColor='var(--blue)'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
                  </div>
                ))}

                {/* Premium services interest */}
                <div style={{ marginBottom:16 }}>
                  <label style={labelStyle}>Interested Premium Services (optional)</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:4 }}>
                    {['Sacco','HR/Staff','Fleet','Fuel','Bank Loans','Analytics'].map(s => (
                      <button type="button" key={s} onClick={() => toggleInterest(s)} style={{ padding:'5px 12px', borderRadius:20, border:`1.5px solid ${form.interest.includes(s)?'var(--blue)':'var(--gray-mid)'}`, background:form.interest.includes(s)?'var(--blue)':'transparent', color:form.interest.includes(s)?'var(--white)':'var(--gray-text)', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:12, cursor:'pointer', transition:'all .2s' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom:20 }}>
                  <label style={labelStyle}>Message (optional)</label>
                  <textarea rows={3} placeholder="Tell us about your operation, any questions, or special requirements..."
                    value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                    style={{ ...inputStyle, resize:'none', lineHeight:1.6 }}
                    onFocus={e=>e.target.style.borderColor='var(--blue)'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
                </div>

                <Btn variant="gold" full size="lg" icon="?">Submit Application</Btn>
                <p style={{ fontSize:11, color:'var(--gray-text)', textAlign:'center', marginTop:10 }}>By submitting, you agree to Raylane's Partner Terms of Service</p>
              </form>
            </Card>
          </div>
        )}

        {/* -- SUCCESS STATE -- */}
        {activeSection === 'apply' && submitted && (
          <div style={{ maxWidth:520, margin:'0 auto' }}>
            <Card style={{ textAlign:'center', padding:40 }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 18px' }}>[OK]</div>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:24, marginBottom:10 }}>Application Submitted!</h2>
              <p style={{ color:'var(--gray-text)', lineHeight:1.8, marginBottom:24 }}>
                Our team will review your application and call you within <strong>24-48 hours</strong> to schedule a visit or virtual onboarding session.
              </p>
              <div style={{ background:'var(--gray-light)', borderRadius:14, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, marginBottom:12 }}>What happens next?</div>
                {[['[CALL]','Raylane team calls you within 24 hrs'],['?','We visit your business (or video call)'],['?','Partnership agreement signed'],['??','Your dashboard is set up & tested'],['?','Your first trip goes live on Raylane']].map(([ic,s],i)=>(
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'center' }}>
                    <span style={{ fontSize:16 }}>{ic}</span>
                    <span style={{ fontSize:13, color:'var(--gray-text)' }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <Btn variant="ghost" full onClick={() => navigate('/')}><- Home</Btn>
                <Btn variant="blue" full onClick={() => navigate('/operator')}>View Dashboard</Btn>
              </div>
            </Card>
          </div>
        )}

        {/* -- HOW IT WORKS -- */}
        {activeSection === 'howit' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:44 }}>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:'clamp(1.5rem,3vw,2.2rem)', marginBottom:10 }}>Onboarding in <span style={{ color:'var(--gold)' }}>4 Simple Steps</span></h2>
              <p style={{ color:'var(--gray-text)', maxWidth:480, margin:'0 auto' }}>From first contact to your first live booking -- typically takes 3-5 business days.</p>
            </div>
            <div className='steps-grid' style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20, marginBottom:44 }}>
              {STEPS.map(s => (
                <Card key={s.n} hover style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0, boxShadow:'0 6px 18px rgba(11,61,145,0.2)', position:'relative' }}>
                    {s.icon}
                    <div style={{ position:'absolute', top:-8, left:-8, width:22, height:22, background:'var(--gold)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:11, color:'var(--blue)' }}>{s.n}</div>
                  </div>
                  <div>
                    <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:16, marginBottom:7 }}>{s.title}</h3>
                    <p style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.7 }}>{s.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
            {/* Commission breakdown */}
            <Card style={{ background:'linear-gradient(135deg,var(--blue),#1a52b3)', color:'var(--white)' }}>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18, marginBottom:16 }}>[MONEY] How Commission Works</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:16 }}>
                {[['Passenger pays','UGX 25,000','Full ticket price'],['Raylane commission (8%)','UGX 2,000','Platform fee'],['Operator receives','UGX 23,000','Net payout via MoMo']].map(([l,v,d])=>(
                  <div key={l} style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:16 }}>
                    <div style={{ fontSize:12, opacity:.75, marginBottom:6 }}>{l}</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:20, color:'var(--gold)', marginBottom:3 }}>{v}</div>
                    <div style={{ fontSize:11, opacity:.8 }}>{d}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:13, opacity:.8, lineHeight:1.7 }}>
                Commission is only charged on bookings made through Raylane. Your offline ticket sales are not tracked or charged. Payouts are released by the Raylane admin after each trip loads.
              </p>
            </Card>
          </div>
        )}

        {/* -- PREMIUM SERVICES -- */}
        {activeSection === 'services' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:'clamp(1.5rem,3vw,2.2rem)', marginBottom:10 }}>Premium <span style={{ color:'var(--gold)' }}>Add-On Services</span></h2>
              <p style={{ color:'var(--gray-text)', maxWidth:520, margin:'0 auto' }}>
                Raylane provides enterprise-grade tools for transport operators. Subscribe to any service individually -- pay only for what you use.
              </p>
            </div>
            <Banner type="info">
              All premium services are <strong>activated on request only</strong>, after payment is confirmed by Raylane. There is no auto-billing. You control what you pay for.
            </Banner>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
              {SERVICES.map(s => (
                <Card key={s.name} hover>
                  <div style={{ fontSize:32, marginBottom:12 }}>{s.icon}</div>
                  <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:16, marginBottom:5 }}>{s.name}</h3>
                  <p style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.7, marginBottom:14 }}>{s.desc}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--gray-mid)' }}>
                    <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:15, color:'var(--blue)' }}>{s.price}</span>
                    <Btn size="sm" variant="blue" onClick={() => setActiveSection('apply')}>Request</Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* -- FAQ -- */}
        {activeSection === 'faq' && (
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:'clamp(1.4rem,2.5vw,2rem)', marginBottom:28 }}>Frequently Asked <span style={{ color:'var(--gold)' }}>Questions</span></h2>
            {[
              ['Does Raylane control our offline sales?', 'No. Raylane only tracks bookings made through our platform. Your offline ticket sales remain entirely yours -- we do not monitor or charge commission on them.'],
              ['What if a passenger cancels?', 'Cancellations are managed per operator policy. Raylane facilitates refunds through the platform for online bookings. The operator sets their own cancellation window.'],
              ['How soon do I receive my payout?', 'Payouts are released by a Raylane admin once your trip loads. Funds arrive in your registered MoMo account within minutes of release.'],
              ['Can I have multiple vehicles on one account?', 'Yes. You can manage unlimited vehicles, routes, and trips from one Operator Dashboard. Each vehicle can have its own route and schedule.'],
              ['Who creates my staff accounts?', 'For security, only Raylane Admin can create staff accounts (Dispatcher, Accountant, Loading Clerk). This prevents unauthorized access to your operator data.'],
              ['What is the Sacco module?', 'The Sacco module is a digital platform for running an internal savings and loan cooperative. Raylane provides the software only -- your Sacco manages its own funds entirely.'],
              ['How does the 8% commission work?', 'Commission is deducted automatically when payouts are released. For a UGX 25,000 ticket, UGX 2,000 goes to Raylane and UGX 23,000 goes to you.'],
              ['Is there a monthly fee?', 'No base monthly fee. The 8% commission only applies to platform bookings. Premium services (Sacco, HR, etc.) carry their own optional monthly fees if you choose to use them.'],
            ].map(([q, a], i) => (
              <FAQItem key={i} q={q} a={a}/>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <style>{`@media(max-width:767px){.partner-apply-grid,.steps-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom:'1px solid var(--gray-mid)', marginBottom:0 }}>
      <button onClick={() => setOpen(!open)} style={{ width:'100%', textAlign:'left', padding:'18px 0', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, background:'none', border:'none', cursor:'pointer' }}>
        <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, color:'var(--dark)', flex:1 }}>{q}</span>
        <span style={{ fontSize:18, color:'var(--blue)', flexShrink:0, transition:'transform .25s', transform:open?'rotate(45deg)':'none', fontWeight:300 }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom:18, color:'var(--gray-text)', fontSize:14, lineHeight:1.8, animation:'fadeIn .2s ease' }}>
          {a}
        </div>
      )}
    </div>
  )
}
