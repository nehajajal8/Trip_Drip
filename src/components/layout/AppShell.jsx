import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MapPin, Compass, Package, BookOpen, DollarSign, Settings, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const NAV = [
  { to:"/trips",    label:"My Trips",   icon:Compass },
  { to:"/trips/new",label:"Plan Trip",  icon:MapPin  },
  { to:"/outfits",  label:"Outfits & Style", icon:Sparkles },
];

function MandalaLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full border-2 border-sand flex items-center justify-center flex-shrink-0"
        style={{ background:"radial-gradient(circle,#E8D5A8 0%,#E8610A 60%,#006E6D 100%)" }}>
        <span className="text-white font-display font-bold text-xs leading-none">TD</span>
      </div>
      <span className="font-display font-bold text-sand leading-none text-xl">Trip Drip</span>
    </div>
  );
}

export default function AppShell({ children }) {
  const { user, signOut } = useAuth();
  const navigate          = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-teal text-sand ${mobile ? "p-6" : "px-6 py-8"}`}>
      {/* Geometric top border pattern */}
      <div className="h-1 mb-6 -mx-6 -mt-8 md:mt-0"
        style={{ background:"repeating-linear-gradient(90deg,#E8610A 0,#E8610A 20px,#E8D5A8 20px,#E8D5A8 40px,#B5281C 40px,#B5281C 60px)" }} />

      <Link to="/trips" onClick={() => setMobileOpen(false)}>
        <MandalaLogo />
      </Link>

      <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-sand/40 mt-6 mb-1">Explore India</p>

      <nav className="flex flex-col gap-1 mt-2 flex-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            className={({ isActive }) => [
              "flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors duration-150",
              isActive ? "bg-sand/10 text-sand border-l-2 border-saffron" : "text-sand/60 hover:text-sand hover:bg-sand/5",
            ].join(" ")}>
            <Icon size={15} />{label}
          </NavLink>
        ))}
      </nav>

      {/* Mandala divider */}
      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 border-t border-sand/20" />
        <span className="text-sand/30 text-sm">❁</span>
        <div className="flex-1 border-t border-sand/20" />
      </div>

      <div className="space-y-1">
        <Link to="/settings" onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2 text-sand/50 hover:text-sand font-sans text-sm transition-colors duration-150">
          <Settings size={14} />Settings
        </Link>
        <button onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 text-sand/50 hover:text-crimson font-sans text-sm transition-colors duration-150 w-full text-left">
          <LogOut size={14} />Sign out
        </button>
        <p className="font-mono text-[0.6rem] text-sand/25 px-3 mt-2 truncate">{user?.email}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-56 flex-shrink-0 flex-col relative" style={{ background:"#006E6D" }}>
        <Sidebar />
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-teal flex items-center justify-between px-4"
        style={{ borderBottom:"3px solid #E8610A" }}>
        <MandalaLogo />
        <button onClick={() => setMobileOpen(o => !o)} className="text-sand p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0 h-full" style={{ background:"#006E6D" }}>
            <div className="pt-14"><Sidebar mobile /></div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}