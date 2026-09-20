/**
 * PassportStamp
 * Circular rotated badge shown on completed trips.
 */
export default function PassportStamp({ label = "Complete", size = "md" }) {
  const sizes = { sm: "w-16 h-16 text-xs", md: "w-24 h-24 text-sm", lg: "w-32 h-32 text-base" };
  return (
    <div
      className={`passport-stamp ${sizes[size]} p-2 text-center leading-tight`}
      style={{ transform: "rotate(-8deg)" }}
    >
      <div className="border-2 border-paper/60 rounded-full w-full h-full flex flex-col items-center justify-center gap-0.5">
        <span className="font-display font-bold uppercase">{label}</span>
        <span className="font-mono text-paper/70 text-xs tracking-wider">?</span>
      </div>
    </div>
  );
}
