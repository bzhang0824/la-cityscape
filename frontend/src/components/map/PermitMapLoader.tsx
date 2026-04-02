"use client";

import dynamic from "next/dynamic";
import type { Permit } from "@/lib/mock-data";

const PermitMap = dynamic(() => import("@/components/map/PermitMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
      Loading map...
    </div>
  ),
});

export default function PermitMapLoader({
  permits,
}: {
  permits: Permit[];
}) {
  return <PermitMap permits={permits} />;
}
