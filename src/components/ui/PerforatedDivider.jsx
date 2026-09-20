export default function PerforatedDivider({ label = "?" }) {
  return (
    <div className="perforated-divider">
      <span className="text-mist text-xs select-none font-mono">{label}</span>
    </div>
  );
}
