/**
 * PageWrapper — entrance animation + max-width container.
 * One entrance per page, respects prefers-reduced-motion via CSS.
 */
export default function PageWrapper({ children, className = "" }) {
  return (
    <div
      className={[
        "animate-enter",
        "max-w-content mx-auto px-6 md:px-12 py-8 md:py-12",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
