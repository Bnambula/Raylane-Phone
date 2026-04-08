export const routes = [
  { id: 1, from: 'Kampala', to: 'Mbale', price: 25000, duration: '3h 30m', popular: true, demand: 'high', image: 'https://images.unsplash.com/photo-1624463029481-3b25f7831a87?w=400&q=80', distance: '240km' },
  { id: 2, from: 'Kampala', to: 'Gulu', price: 35000, duration: '4h 00m', popular: true, demand: 'high', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', distance: '340km' },
  { id: 3, from: 'Kampala', to: 'Mbarara', price: 30000, duration: '3h 00m', popular: true, demand: 'medium', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80', distance: '270km' },
  { id: 4, from: 'Kampala', to: 'Nairobi', price: 60000, duration: '8h 00m', popular: false, demand: 'high', image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&q=80', distance: '640km' },
  { id: 5, from: 'Kampala', to: 'Kigali', price: 55000, duration: '9h 00m', popular: false, demand: 'medium', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80', distance: '540km' },
  { id: 6, from: 'Kampala', to: 'Arua', price: 40000, duration: '6h 00m', popular: false, demand: 'low', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80', distance: '480km' },
  { id: 7, from: 'Kampala', to: 'Juba', price: 60000, duration: '12h 00m', popular: false, demand: 'medium', image: 'https://images.unsplash.com/photo-1624463029481-3b25f7831a87?w=400&q=80', distance: '820km' },
  { id: 8, from: 'Kampala', to: 'Mbarara', price: 30000, duration: '3h 30m', popular: false, demand: 'low', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', distance: '270km' },
];

export const operators = [
  {
    id: 1, name: 'Global Coaches', shortName: 'GC', plate: 'UBF 234K',
    type: '55 Seater Coach', seats: 55, price: 25000,
    rating: 4.8, reviews: 312, departureTime: '10:00 AM',
    amenities: ['wifi', 'ac', 'usb'], seatsLeft: 19, status: 'approved',
    color: '#0B3D91'
  },
  {
    id: 2, name: 'YY Coaches', shortName: 'YY', plate: 'UAR 512B',
    type: '67 Seater Coach', seats: 67, price: 26000,
    rating: 4.6, reviews: 208, departureTime: '11:00 AM',
    amenities: ['ac', 'usb'], seatsLeft: 24, status: 'approved',
    color: '#8B1A1A'
  },
  {
    id: 3, name: 'Link Bus', shortName: 'LB', plate: 'UAK 890C',
    type: '65 Seater Coach', seats: 65, price: 24000,
    rating: 4.5, reviews: 189, departureTime: '09:00 AM',
    amenities: ['ac'], seatsLeft: 0, status: 'approved',
    color: '#1a6b1a', full: true
  },
  {
    id: 4, name: 'City Taxi', shortName: 'CT', plate: 'UBJ 110X',
    type: '14 Seater Taxi', seats: 14, price: 20000,
    rating: 4.2, reviews: 94, departureTime: '12:00 PM',
    amenities: ['ac'], seatsLeft: 5, status: 'approved',
    color: '#7c3aed'
  },
];

export const bookedSeats = [3, 7, 8, 11, 14, 20, 21, 22, 23, 24, 25, 26, 27, 28];

export const testimonials = [
  { id:1, name:'Sarah Namukasa', role:'Frequent Traveler', city:'Kampala', rating:5, text:'Raylane Express completely changed how I travel. Booked my Kampala-Mbale ticket in 2 minutes and got a QR code. No more rushing to the park!', avatar:'SN' },
  { id:2, name:'David Otieno', role:'Business Traveler', city:'Gulu', rating:5, text:'The seat selection feature is brilliant. I always pick window seats, and knowing they are secured gives me peace of mind. Best app for Uganda travel.', avatar:'DO' },
  { id:3, name:'Grace Akello', role:'Student', city:'Mbale', rating:4, text:'Sent a parcel to my parents in Arua and could track it in real time. Arrived exactly as promised. The service is outstanding!', avatar:'GA' },
  { id:4, name:'Moses Byaruhanga', role:'Entrepreneur', city:'Mbarara', rating:5, text:'As an operator, Raylane increased our bookings by 40%. The dashboard is clean, approval is fast, and passenger management is now digital.', avatar:'MB' },
  { id:5, name:'Prossy Namiiro', role:'Teacher', city:'Fort Portal', rating:5, text:'Mobile money payment works perfectly. Got my ticket on MTN MoMo in seconds. No cash, no queues. Raylane is the future of travel in Uganda!', avatar:'PN' },
];

export const travelTips = [
  { id:1, category:'Safety', title:'Travel Smart: What to Carry', excerpt:'Always have your digital ticket, national ID, and emergency contacts saved offline. Raylane tickets work without internet.', readTime:'3 min', image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { id:2, category:'Savings', title:'Best Times to Book for Lower Fares', excerpt:'Tuesday and Wednesday mornings typically have 15–20% lower fares. Early bookings (7+ days ahead) save you even more.', readTime:'4 min', image:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80' },
  { id:3, category:'Routes', title:'Top 5 Uganda Road Trip Routes', excerpt:'From the misty hills of Kabale to the shores of Lake Victoria, these routes offer the best scenery Uganda has to offer.', readTime:'6 min', image:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80' },
];

export const parcels = [
  { id:1, name:'Envelope / Documents', icon:'📄', price:5000, maxWeight:'0.5kg', desc:'Letters, documents, certificates', color:'#dbeafe' },
  { id:2, name:'Small Parcel', icon:'📦', price:12000, maxWeight:'2kg', desc:'Clothes, books, small electronics', color:'#dcfce7' },
  { id:3, name:'Large Parcel', icon:'🎁', price:20000, maxWeight:'10kg', desc:'Household items, medium packages', color:'#fef9c3' },
  { id:4, name:'Heavy Cargo', icon:'🏗️', price:30000, maxWeight:'50kg+', desc:'Large goods, commercial cargo', color:'#fee2e2' },
];

export const ugandaCities = [
  { id:1, name:'Kampala', x:38, y:58, label:'Capital City', isCapital:true },
  { id:2, name:'Mbale', x:62, y:47, label:'Eastern Uganda' },
  { id:3, name:'Gulu', x:40, y:22, label:'Northern Uganda' },
  { id:4, name:'Arua', x:20, y:20, label:'West Nile' },
  { id:5, name:'Mbarara', x:30, y:72, label:'Western Uganda' },
  { id:6, name:'Fort Portal', x:22, y:52, label:'Rwenzori Region' },
  { id:7, name:'Kabale', x:28, y:82, label:'South Western' },
  { id:8, name:'Jinja', x:52, y:56, label:'Eastern Gateway' },
  { id:9, name:'Masaka', x:32, y:66, label:'Central Uganda' },
];

export const eastAfricaCities = [
  { id:10, name:'Nairobi', x:80, y:65, label:'Kenya', isEA:true },
  { id:11, name:'Kigali', x:20, y:75, label:'Rwanda', isEA:true },
  { id:12, name:'Juba', x:48, y:8, label:'South Sudan', isEA:true },
  { id:13, name:'Dar es Salaam', x:68, y:88, label:'Tanzania', isEA:true },
];

export const adminStats = {
  dailyBookings: 2487,
  revenueTodayUGX: 74610000,
  commission: 5968800,
  activeOperators: 156,
  pendingApprovals: [
    { name:'YY Coaches', route:'Kampala → Fort Portal', status:'pending' },
    { name:'Link Bus', route:'Gulu → Nairobi', status:'pending' },
    { name:'City Taxi', route:'Kampala → Entebbe', status:'pending' },
  ],
  recentPayments: [
    { method:'MTN MoMo', id:'RLX-548-L40', amount:50000 },
    { method:'Airtel Money', id:'RLX-468-00912', amount:25000 },
    { method:'MTN MoMo', id:'RLX-S88-00111', amount:70000 },
  ]
};

export const saccoData = {
  totalMembers: 120,
  totalSavings: 45600000,
  outstandingLoans: 12800000,
  members: [
    { name:'John Doe', loan:1000000, status:'pending' },
    { name:'Jane Smith', loan:500000, status:'approved' },
    { name:'Peter Okello', loan:2000000, status:'repaid' },
  ],
  savingsChart: [18,22,30,28,35,45],
};
