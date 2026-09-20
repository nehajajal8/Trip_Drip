import { useState, useEffect } from "react";
import { WifiOff, CloudOff, RefreshCw } from "lucide-react";
import { subscribeNetworkStatus, isOnlineNow } from "../../services/offlineStorage";

export default function OfflineBanner() {
  const [online, setOnline] = useState(() => isOnlineNow());
  const [showSyncNote, setShowSyncNote] = useState(false);

  useEffect(() => {
    const unsub = subscribeNetworkStatus((isOnline) => {
      setOnline(isOnline);
      if (isOnline) {
        setShowSyncNote(true);
        setTimeout(() => setShowSyncNote(false), 4000);
      }
    });
    return unsub;
  }, []);

  if (online && !showSyncNote) return null;

  if (showSyncNote) {
    return (
      <div className="bg-forest text-sand text-xs font-mono py-2 px-4 flex items-center justify-center gap-2 transition-all">
        <RefreshCw size={13} className="animate-spin" />
        <span>Connected — Your Yatra data is synced with the cloud.</span>
      </div>
    );
  }

  return (
    <div className="bg-saffron text-white text-xs font-mono py-2 px-4 flex items-center justify-between border-b border-sand/30 shadow-md">
      <div className="flex items-center gap-2">
        <WifiOff size={14} className="animate-pulse" />
        <span className="font-semibold uppercase tracking-wider">Offline Mode</span>
        <span className="hidden sm:inline text-white/80">— Viewing cached yatra itinerary, outfits & checklists from IndexedDB</span>
      </div>
      <span className="text-[0.65rem] bg-white/20 px-2 py-0.5 uppercase tracking-widest">
        Local Cache Active
      </span>
    </div>
  );
}
