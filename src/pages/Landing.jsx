import { Link } from "react-router-dom";
import { MapPin, Train, Users, Star, ArrowRight, IndianRupee } from "lucide-react";

const FEATURED_DESTINATIONS = [
  { name:"Rajasthan",    tag:"Heritage",   desc:"Forts, palaces & desert safaris", color:"bg-saffron" },
  { name:"Kerala",       tag:"Backwaters", desc:"Houseboats, spice & hill tea",    color:"bg-teal" },
  { name:"Leh Ladakh",   tag:"Mountains",  desc:"Himalayan roads & ancient monasteries", color:"bg-slate" },
  { name:"Goa",          tag:"Beach",      desc:"Portuguese coastline & seafood",  color:"bg-forest" },
];

const FEATURES = [
  { icon:MapPin,       title:"Hyper-Local Itineraries", desc:"Not 'visit a beach' — Juhu Beach at 6am for a tapri chai. Real places, real times." },
  { icon:Train,        title:"Transport Comparison",    desc:"Train Sleeper vs 3AC vs Volvo Bus vs Flight — exact INR per person and total for your group." },
  { icon:Star,         title:"Hotel Star Tiers",        desc:"1★ to 5★ price ranges per destination. Metro vs hill station vs heritage town rates." },
  { icon:Users,        title:"Group Budget Planner",    desc:"Split costs for 4, 6, 10 people. Copy a WhatsApp-ready summary for your squad." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ivory" style={{fontFamily:"Poppins,sans-serif"}}>

      {/* ── Geometric top strip ─────────────────────────────── */}
      <div className="h-1.5" style={{background:"repeating-linear-gradient(90deg,#E8610A 0,#E8610A 20px,#006E6D 20px,#006E6D 40px,#E8D5A8 40px,#E8D5A8 60px)"}} />

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 bg-ivory">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{background:"radial-gradient(circle,#E8D5A8 0%,#E8610A 60%,#006E6D 100%)"}}>
            <span className="text-white font-bold text-xs">TD</span>
          </div>
          <span className="font-display font-bold text-slate text-2xl">Trip Drip</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login"  className="font-sans text-sm text-slate/60 hover:text-slate transition-colors">Sign In</Link>
          <Link to="/signup" className="bg-saffron text-white font-sans text-sm font-semibold px-5 py-2.5 hover:bg-saffron/90 transition-colors">
            Start Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-teal overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{backgroundImage:"radial-gradient(circle at 50% 50%,#E8D5A8 1px,transparent 1px)",backgroundSize:"28px 28px"}} />
        {/* Mandala corner decorations */}
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10"
          style={{backgroundImage:"radial-gradient(circle,transparent 30%,#E8D5A8 31%,#E8D5A8 33%,transparent 34%,transparent 50%,#E8D5A8 51%,#E8D5A8 53%,transparent 54%,transparent 70%,#E8D5A8 71%,#E8D5A8 73%,transparent 74%)",backgroundRepeat:"no-repeat",backgroundSize:"200px 200px",backgroundPosition:"center"}} />

        <div className="relative max-w-5xl mx-auto px-6 md:px-16 py-20 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-sand/50 mb-6">— Incredible India, One Yatra at a Time —</p>
          <h1 className="font-display font-bold text-sand leading-tight mb-6"
            style={{fontSize:"clamp(3rem,8vw,6.5rem)",lineHeight:0.95}}>
            Plan your<br />
            <span className="text-saffron">Indian journey</span><br />
            in minutes.
          </h1>
          <p className="font-sans text-sand/60 max-w-xl mx-auto mb-10 leading-relaxed text-lg">
            Hyper-local itineraries with real place names. Train vs bus vs flight comparison in ₹. Hotel tiers from 1★ to 5★. Group budget split — all free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup"
              className="flex items-center gap-2 bg-saffron text-white font-display font-bold px-8 py-4 hover:bg-saffron/90 transition-colors text-xl">
              Plan My Yatra <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 border border-sand/30 text-sand font-sans px-6 py-4 hover:border-sand transition-colors text-sm">
              I have an account
            </Link>
          </div>
          <p className="font-mono text-xs text-sand/25 mt-6 tracking-widest">No credit card · No API key needed · Works instantly</p>
        </div>
      </section>

      {/* ── Destination cards ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 md:px-16 py-16">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/30 mb-3 text-center">Popular Yatras</p>
        <h2 className="font-display font-bold text-slate text-center mb-10" style={{fontSize:"2.5rem"}}>
          Where will you go?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURED_DESTINATIONS.map(dest => (
            <Link key={dest.name} to="/signup"
              className={`${dest.color} p-6 flex flex-col justify-end min-h-40 group hover:opacity-90 transition-opacity`}>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-white/50 mb-1">{dest.tag}</span>
              <p className="font-display font-bold text-white text-xl mb-1">{dest.name}</p>
              <p className="font-sans text-xs text-white/60 leading-snug">{dest.desc}</p>
              <ArrowRight size={14} className="text-white/40 mt-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Mandala divider ──────────────────────────────────── */}
      <div className="flex items-center gap-4 px-16 max-w-5xl mx-auto">
        <div className="flex-1 border-t border-sand" />
        <span className="text-sand text-2xl">❁</span>
        <div className="flex-1 border-t border-sand" />
      </div>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-mist p-7 hover:border-saffron/30 transition-colors">
              <div className="w-10 h-10 bg-saffron/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-saffron" />
              </div>
              <h3 className="font-display font-bold text-slate text-xl mb-2">{title}</h3>
              <p className="font-sans text-sm text-slate/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────────────────── */}
      <section className="bg-saffron py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:"radial-gradient(circle at 50% 50%,white 1px,transparent 1px)",backgroundSize:"20px 20px"}} />
        <div className="relative">
          <h2 className="font-display font-bold text-white mb-4" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>
            Your next yatra awaits.
          </h2>
          <p className="font-sans text-white/70 mb-8 text-lg">Join thousands of Indian travellers planning smarter trips.</p>
          <Link to="/signup"
            className="inline-flex items-center gap-2 bg-white text-saffron font-display font-bold px-10 py-4 hover:bg-ivory text-xl transition-colors">
            Start Planning — It's Free
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-slate text-sand/40 text-center py-8 font-mono text-xs tracking-widest">
        <p>TRIP DRIP · INDIA EDITION · MADE WITH ❁ FOR BHARAT</p>
      </footer>
    </div>
  );
}