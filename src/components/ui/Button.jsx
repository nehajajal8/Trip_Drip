import { forwardRef } from "react";

const variants = {
  primary:   "bg-runway text-paper hover:bg-runway/90 border-runway",
  secondary: "bg-paper text-ink border-ink hover:bg-ink hover:text-paper",
  ghost:     "bg-transparent text-ink border-transparent hover:border-mist",
  danger:    "bg-stamp text-paper hover:bg-stamp/90 border-stamp",
  gate:      "bg-gate text-ink border-gate hover:bg-gate/80",
};

const sizes = {
  sm:  "px-4 py-2 text-sm",
  md:  "px-6 py-3 text-base",
  lg:  "px-8 py-4 text-lg",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={[
        "inline-flex items-center justify-center gap-2 font-sans font-medium",
        "border transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
