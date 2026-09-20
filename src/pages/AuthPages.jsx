import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight } from "lucide-react";

function AuthField({ label, ...props }) {
  return (
    <div>
      <label className="block font-mono text-xs uppercase tracking-[0.2em] text-slate/40 mb-2">{label}</label>
      <input
        className="w-full bg-transparent border-b-2 border-mist hover:border-slate/30
                   focus:border-saffron outline-none font-sans text-base text-slate
                   placeholder:text-slate/20 pb-2.5 transition-colors duration-150"
        {...props}
      />
    </div>
  );
}

function AuthShell({ children, sideLabel, sideCode }) {
  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Left stripe — teal with geometric pattern */}
      <div className="hidden lg:flex w-72 bg-teal flex-col justify-between px-10 py-12 flex-shrink-0 geo-border-top relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{backgroundImage:"radial-gradient(circle at 50%,#E8D5A8 1px,transparent 1px)",backgroundSize:"24px 24px"}} />
        <div className="relative">
          <Link to="/" className="font-display font-bold text-sand hover:text-saffron transition-colors"
            style={{fontSize:"2.5rem",lineHeight:0.9}}>
            Trip<br/>Drip
          </Link>
          <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-sand/30 mt-4">India Edition</p>
        </div>
        <div className="relative">
          <div className="text-4xl text-sand/20 mb-3">❁</div>
          <p className="font-mono text-xs tracking-[0.22em] uppercase text-sand/30 mb-1">{sideLabel}</p>
          <p className="font-mono text-[0.6rem] text-sand/15">{sideCode}</p>
        </div>
      </div>
      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 animate-enter">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden font-display font-bold text-2xl text-slate block mb-10">Trip Drip</Link>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/trips";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try { await signIn(email, password); navigate(from,{replace:true}); }
    catch(err) { setError(err.message||"Sign in failed."); }
    finally { setLoading(false); }
  }
  return (
    <AuthShell sideLabel="Your Journey Awaits" sideCode="BHARAT · YATRA · BEGIN">
      <p className="font-mono text-xs tracking-[0.22em] uppercase text-slate/35 mb-3">Welcome back</p>
      <h2 className="font-display font-bold text-slate mb-10" style={{fontSize:"clamp(2.2rem,5vw,3rem)",lineHeight:1}}>
        Sign In
      </h2>
      <form onSubmit={handleSubmit} className="space-y-7">
        <AuthField label="Email"    type="email"    value={email}    onChange={e=>setEmail(e.target.value)}    placeholder="you@example.com"  required />
        <AuthField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"          required />
        {error && <div className="bg-crimson/8 border-l-2 border-crimson px-4 py-3 font-sans text-sm text-crimson">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-between px-6 py-4 bg-saffron text-white font-display font-bold text-xl
                     hover:bg-saffron/90 disabled:opacity-50 transition-colors">
          {loading ? <span className="font-sans text-base font-normal">Signing in…</span> : <span>Sign In</span>}
          <ArrowRight size={20}/>
        </button>
      </form>
      <p className="font-sans text-sm text-slate/40 mt-6 text-center">
        No account? <Link to="/signup" className="text-saffron underline underline-offset-2 hover:text-saffron/70">Sign up</Link>
      </p>
    </AuthShell>
  );
}

export function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault(); setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try { await signUp(email, password); navigate("/trips"); }
    catch(err) { setError(err.message||"Sign up failed."); }
    finally { setLoading(false); }
  }
  return (
    <AuthShell sideLabel="Begin Your Yatra" sideCode="BHARAT · YATRA · NEW">
      <p className="font-mono text-xs tracking-[0.22em] uppercase text-slate/35 mb-3">Create account</p>
      <h2 className="font-display font-bold text-slate mb-10" style={{fontSize:"clamp(2.2rem,5vw,3rem)",lineHeight:1}}>
        Start your<br/>yatra.
      </h2>
      <form onSubmit={handleSubmit} className="space-y-7">
        <AuthField label="Email"            type="email"    value={email}    onChange={e=>setEmail(e.target.value)}    placeholder="you@example.com" required />
        <AuthField label="Password"         type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 8 characters" required />
        <AuthField label="Confirm Password" type="password" value={confirm}  onChange={e=>setConfirm(e.target.value)}  placeholder="••••••••" required />
        {error && <div className="bg-crimson/8 border-l-2 border-crimson px-4 py-3 font-sans text-sm text-crimson">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-between px-6 py-4 bg-saffron text-white font-display font-bold text-xl
                     hover:bg-saffron/90 disabled:opacity-50 transition-colors">
          {loading ? <span className="font-sans text-base font-normal">Creating account…</span> : <span>Create Account</span>}
          <ArrowRight size={20}/>
        </button>
      </form>
      <p className="font-sans text-sm text-slate/40 mt-6 text-center">
        Have an account? <Link to="/login" className="text-saffron underline underline-offset-2 hover:text-saffron/70">Sign in</Link>
      </p>
    </AuthShell>
  );
}