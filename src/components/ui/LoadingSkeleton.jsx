/**
 * src/components/ui/LoadingSkeleton.jsx
 * Reusable loading skeletons styled with Bharat design tokens (sand/ivory/mist pulse).
 */

export function SkeletonCard({ className = "h-48" }) {
  return (
    <div className={`bg-white border border-mist p-5 flex flex-col justify-between animate-pulse ${className}`}>
      <div className="space-y-3">
        <div className="w-1/3 h-3 bg-mist/60" />
        <div className="w-3/4 h-5 bg-mist" />
        <div className="w-1/2 h-3 bg-mist/40" />
      </div>
      <div className="w-full h-8 bg-mist/50 mt-4" />
    </div>
  );
}

export function SkeletonGrid({ count = 4, className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonRow({ className = "h-14" }) {
  return (
    <div className={`flex items-center justify-between px-5 py-4 border-b border-mist/60 bg-white animate-pulse ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-sm bg-mist" />
        <div className="space-y-1.5">
          <div className="w-36 h-4 bg-mist" />
          <div className="w-24 h-3 bg-mist/50" />
        </div>
      </div>
      <div className="w-16 h-4 bg-mist" />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="bg-teal p-8 md:p-12 animate-pulse space-y-4">
      <div className="w-32 h-3 bg-sand/30" />
      <div className="w-72 h-10 bg-sand/40" />
      <div className="w-48 h-4 bg-sand/20" />
    </div>
  );
}
