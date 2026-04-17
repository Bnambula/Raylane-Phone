export const operators = [
  { id:"op-001", company_name:"Global Coaches Ltd", shortName:"GCL", contact:"John Ssemakula", phone:"0771-234-567", email:"info@globalcoaches.ug", fleet_size:5, status:"ACTIVE", is_premium:true, operator_type:"EXTERNAL", managed_by_raylane:false, merchant_code:"GLOBAL_UG", commission_rate:0.08, rating:4.8, reviews:312, boarding_lat:0.3476, boarding_lng:32.5825, boarding_label:"Kampala Coach Park, Gate 3", color:"#0B3D91" },
  { id:"op-002", company_name:"YY Coaches",         shortName:"YY",  contact:"Yusuf Yasiin",   phone:"0700-345-678", email:"yy@yycoaches.ug",       fleet_size:3, status:"ACTIVE", is_premium:false, operator_type:"EXTERNAL", managed_by_raylane:false, merchant_code:"YY_COACHES",   commission_rate:0.08, rating:4.6, reviews:208, boarding_lat:0.3489, boarding_lng:32.5814, boarding_label:"New Taxi Park, Stand 7",     color:"#1a52b3" },
  { id:"op-003", company_name:"Link Bus",           shortName:"LB",  contact:"Peter Ochieng",  phone:"0752-456-789", email:"ops@linkbus.ug",         fleet_size:8, status:"ACTIVE", is_premium:true,  operator_type:"EXTERNAL", managed_by_raylane:false, merchant_code:"LINK_BUS_UG", commission_rate:0.08, rating:4.5, reviews:189, boarding_lat:0.3501, boarding_lng:32.5798, boarding_label:"Namirembe Road Bus Park",   color:"#15803d" },
  { id:"op-004", company_name:"Fast Coaches Ltd",   shortName:"FC",  contact:"Grace Auma",     phone:"0752-678-901", email:"grace@fastcoaches.ug",   fleet_size:4, status:"ACTIVE", is_premium:false, operator_type:"EXTERNAL", managed_by_raylane:false, merchant_code:"FAST_COACHES", commission_rate:0.08, rating:4.3, reviews:87,  boarding_lat:0.3492, boarding_lng:32.5801, boarding_label:"Nakivubo Terminal, Bay 5", color:"#7c3aed" },
  { id:"op-rlx", company_name:"Raylane Express Fleet", shortName:"RLX", contact:"Raylane Admin", phone:"0700-000-000", email:"fleet@raylaneexpress.com", fleet_size:3, status:"ACTIVE", is_premium:true, operator_type:"INTERNAL", managed_by_raylane:true, merchant_code:"RAYLANE_EXPRESS", commission_rate:0, rating:5.0, reviews:0, color:"#FFC72C" },
]

export const testimonials = [
  { id:1, name:"Sarah Nakawunde", role:"Student",          city:"Kampala", avatar:"SN", rating:5, text:"Raylane changed everything for me. I booked my Mbale ticket from my phone while waiting at the stage. Paid with MTN and got a QR code in seconds. The seat was held and no one else could take it. Incredible." },
  { id:2, name:"James Okello",    role:"Business Traveller", city:"Gulu",    avatar:"JO", rating:5, text:"I travel Kampala to Gulu every two weeks. Since joining Raylane, I book in advance, choose my window seat, and the bus is always on time. The driver tracking is the best feature." },
  { id:3, name:"Grace Auma",      role:"Operator (Fast Coaches)", city:"Kampala", avatar:"GA", rating:5, text:"As an operator, Raylane filled my buses. Before, I was lucky to get 40 percent capacity. Now I regularly run at 85-90 percent. The dashboard shows me everything: bookings, revenue, and route profitability." },
  { id:4, name:"David Kamya",     role:"Tourist",           city:"London",   avatar:"DK", rating:5, text:"Visiting Uganda from the UK. Raylane made it simple. Clean English interface and the parcel service even shipped my luggage ahead to Kabale. World class service." },
  { id:5, name:"Fatuma Hassan",   role:"Parent",            city:"Jinja",    avatar:"FH", rating:5, text:"I send parcels to my children in Kampala every week. The insurance option gave me peace of mind. My phone arrived safely and the recipient got an SMS. Zero stress." },
]

export const travelTips = [
  { id:1, title:"Carry your National ID everywhere", excerpt:"All intercity passengers must carry valid government ID. Police checkpoints on the Kampala-Gulu and Kampala-Nairobi routes are common. Keep it accessible.", category:"Safety",      readTime:"2 min", image:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80" },
  { id:2, title:"Book early morning buses out of Kampala", excerpt:"Morning departures (6-9 AM) avoid peak Kampala traffic. You gain 45-90 minutes on any route. Evening returns are equally smooth.", category:"Travel Hack", readTime:"2 min", image:"https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80" },
  { id:3, title:"The Kampala-Kabale road is breathtaking", excerpt:"The Western Circuit through Mbarara to Kabale offers the most scenic road journey in Uganda. Request a window seat in advance. Bring a camera.", category:"Routes",      readTime:"3 min", image:"https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80" },
]

export const parcels = [
  { id:"envelope", icon:"envelope", name:"Envelope",     price:5000,  maxWeight:"0.5 kg", desc:"Letters, IDs, certificates" },
  { id:"small",    icon:"small", name:"Small Parcel", price:12000, maxWeight:"2 kg",   desc:"Clothes, books, electronics" },
  { id:"large",    icon:"large", name:"Large Parcel", price:20000, maxWeight:"10 kg",  desc:"Household items, appliances"  },
  { id:"cargo",    icon:"cargo", name:"Heavy Cargo",  price:30000, maxWeight:"50 kg+", desc:"Commercial freight, machinery" },
]
