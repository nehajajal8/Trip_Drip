import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, DollarSign, ShoppingBag } from "lucide-react";
import AppShell from "../components/layout/AppShell";

function PlaceholderPage({ icon:Icon, title, subtitle, badge, backTo }) {
  const { id } = useParams();
  return (
    <AppShell>
      <div className="bg-teal geo-border-top relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:"radial-gradient(circle at 50%,#E8D5A8 1px,transparent 1px)",backgroundSize:"24px 24px"}} />
        <div className="relative max-w-content mx-auto px-6 md:px-12 py-10 animate-enter">
          <Link to={`/trips/${id}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sand/50 hover:text-sand mb-8 transition-colors">
            <ArrowLeft size={13}/> Trip Dashboard
          </Link>
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/45 mb-2">Coming in Part 3</p>
          <h1 className="font-display font-bold text-sand leading-none" style={{fontSize:"clamp(3rem,7vw,6rem)"}}>
            {title}
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="w-16 h-16 bg-saffron/10 flex items-center justify-center mb-6">
          <Icon size={28} className="text-saffron" />
        </div>
        <div className="font-mono text-xs bg-saffron text-white px-3 py-1 mb-6">{badge}</div>
        <p className="font-display font-bold text-slate text-3xl mb-3">{subtitle}</p>
        <p className="font-sans text-sm text-slate/40 max-w-xs">This feature is being built in Part 3. The routes and data tables are already set up.</p>
      </div>
    </AppShell>
  );
}

export function Journal() {
  return <PlaceholderPage icon={BookOpen} title="Journal" subtitle="Capture your travel memories" badge="PART 3" />;
}
export function Expenses() {
  return <PlaceholderPage icon={DollarSign} title="Expenses" subtitle="Track spending in INR" badge="PART 3" />;
}