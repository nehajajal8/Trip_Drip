/**
 * BoardingPassCard
 * A card styled like a boarding pass: left navy stripe,
 * main content area, optional stub (dashed right separator + stub content).
 */
export default function BoardingPassCard({ children, stub, className = "" }) {
  return (
    <div className={`boarding-pass flex ${className}`}>
      {/* Left stripe is via CSS ::before — nothing rendered here */}
      <div className="flex-1 pl-5 py-4 pr-4 min-w-0">{children}</div>
      {stub && (
        <div className="boarding-pass-stub pl-4 pr-4 py-4 w-32 flex-shrink-0 flex flex-col items-center justify-center">
          {stub}
        </div>
      )}
    </div>
  );
}
