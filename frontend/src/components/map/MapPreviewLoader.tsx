"use client";

import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("@/components/map/MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
      Loading map...
    </div>
  ),
});

export default function MapPreviewLoader() {
  return <MapPreview />;
}
