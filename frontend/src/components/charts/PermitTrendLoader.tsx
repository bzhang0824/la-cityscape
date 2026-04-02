"use client";

import dynamic from "next/dynamic";

const PermitTrend = dynamic(() => import("@/components/charts/PermitTrend"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-50 flex items-center justify-center text-slate-400">
      Loading chart...
    </div>
  ),
});

export default function PermitTrendLoader({
  data,
}: {
  data: { month: string; count: number; value: number }[];
}) {
  return <PermitTrend data={data} />;
}
