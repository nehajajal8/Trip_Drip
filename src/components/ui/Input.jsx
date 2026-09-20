import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-mono text-xs uppercase tracking-widest text-ink/60">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={[
          "w-full bg-white border border-mist px-4 py-3 font-sans text-sm text-ink",
          "placeholder:text-ink/30",
          "focus:outline-none focus:border-runway",
          "transition-colors duration-150",
          "disabled:opacity-40 disabled:bg-paper",
          error ? "border-stamp" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error && (
        <p className="font-sans text-xs text-stamp">{error}</p>
      )}
    </div>
  );
});

export default Input;
