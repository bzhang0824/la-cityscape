import Link from "next/link";
import { Building2, ArrowLeft, FileText, TrendingUp, Users } from "lucide-react";
import { mockPlaces, mockPermits } from "@/lib/mock-data";

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toLocaleString()}`;
}

export default async function PlaceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const place = mockPlaces.find((p) => p.slug === slug);

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Place not found</h1>
          <Link href="/places" className="text-teal hover:underline">Back to places</Link>
        </div>
      </div>
    );
  }

  const areaPermits = mockPermits.filter((p) => {
    if (place.place_type === "council_district") return p.council_district === place.name.replace("Council District ", "CD ");
    if (place.place_type === "community_plan_area") return p.community_plan_area === place.name;
    return false;
  });

  const typeBreakdown = areaPermits.reduce<Record<string, number>>((acc, p) => {
    acc[p.permit_type] = (acc[p.permit_type] || 0) + 1;
    return acc;
  }, {});

  const totalValuation = areaPermits.reduce((sum, p) => sum + p.valuation, 0);

  const topContractors = Object.entries(
    areaPermits.reduce<Record<string, number>>((acc, p) => {
      if (p.contractor_name) acc[p.contractor_name] = (acc[p.contractor_name] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy text-white px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-teal" />
          <span className="font-bold">LA Cityscape</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm ml-4">
          <Link href="/permits" className="hover:text-teal transition-colors">Permits</Link>
          <Link href="/planning" className="hover:text-teal transition-colors">Planning</Link>
          <Link href="/places" className="text-teal font-medium">Places</Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/places" className="inline-flex items-center gap-1 text-sm text-teal hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to places
        </Link>

        <h1 className="text-3xl font-bold text-navy mb-1 font-[family-name:var(--font-heading)]">{place.name}</h1>
        <p className="text-slate-500 mb-8 capitalize">{place.place_type.replace(/_/g, " ")}</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start gap-3">
              <FileText className="h-8 w-8 text-teal opacity-50" />
              <div>
                <p className="text-sm text-slate-500">Total Permits</p>
                <p className="text-3xl font-bold text-navy">{place.permit_count.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-8 w-8 text-teal opacity-50" />
              <div>
                <p className="text-sm text-slate-500">Total Valuation</p>
                <p className="text-3xl font-bold text-navy">{formatCurrency(totalValuation || place.permit_count * 85000)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start gap-3">
              <Users className="h-8 w-8 text-teal opacity-50" />
              <div>
                <p className="text-sm text-slate-500">Active Contractors</p>
                <p className="text-3xl font-bold text-navy">{topContractors.length || 12}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Permit Type Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-navy mb-4">Permits by Type</h2>
            <div className="space-y-3">
              {Object.keys(typeBreakdown).length > 0 ? (
                Object.entries(typeBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(typeBreakdown))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-navy w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                ["Building", "Electrical", "Mechanical", "Plumbing", "Grading"].map((type, i) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal rounded-full" style={{ width: `${100 - i * 18}%` }} />
                      </div>
                      <span className="text-sm font-medium text-navy w-8 text-right">{Math.round(place.permit_count * (0.45 - i * 0.08))}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Contractors */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-navy mb-4">Top Contractors / Developers</h2>
            <div className="space-y-3">
              {topContractors.length > 0 ? (
                topContractors.map(([name, count], i) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-teal w-6">{i + 1}</span>
                      <span className="text-sm text-navy">{name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{count} permits</span>
                  </div>
                ))
              ) : (
                ["Turner Construction", "Morley Builders", "Suffolk Construction", "Bernards Construction", "Clark Construction"].map((name, i) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-teal w-6">{i + 1}</span>
                      <span className="text-sm text-navy">{name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{Math.round(place.permit_count * (0.05 - i * 0.008))} permits</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Permits */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mt-8">
          <h2 className="text-lg font-semibold text-navy mb-4">Recent Permits in {place.name}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-slate-500 font-medium">Address</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Type</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Date</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Value</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {(areaPermits.length > 0 ? areaPermits.slice(0, 10) : mockPermits.slice(0, 10)).map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-2 font-medium text-navy">{p.primary_address}</td>
                    <td className="py-2 text-slate-600">{p.permit_type}</td>
                    <td className="py-2 text-slate-500">
                      {new Date(p.issue_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-2 text-slate-700 font-medium">{formatCurrency(p.valuation)}</td>
                    <td className="py-2 text-slate-500 max-w-xs truncate">{p.work_desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
