import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  { label, error, options = [], className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-mono text-xs uppercase tracking-widest text-ink/60">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={[
            "w-full appearance-none bg-white border border-mist px-4 py-3",
            "font-sans text-sm text-ink pr-10",
            "focus:outline-none focus:border-runway",
            "transition-colors duration-150",
            "disabled:opacity-40",
            error ? "border-stamp" : "",
            className,
          ].join(" ")}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
        />
      </div>
      {error && <p className="font-sans text-xs text-stamp">{error}</p>}
    </div>
  );
});

export default Select;
