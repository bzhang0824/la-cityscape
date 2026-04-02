'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, FileText } from 'lucide-react';
import { DynamicPermitMap } from '@/components/map/MapWrapper';
import StatCard from '@/components/ui/StatCard';
import { places, permits, planningCases } from '@/lib/mock-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PlaceDetailPage({ params }: Props) {
  const { slug } = use(params);
  const place = places.find((p) => p.slug === slug);

  const areaPermits = useMemo(() => {
    if (!place) return [];
    if (place.type === 'council_district') {
      const cdNum = parseInt(place.slug.replace('cd-', ''));
      return permits.filter((p) => p.council_district === cdNum);
    }
    return permits.filter((p) => p.community_plan_area === place.name);
  }, [place]);

  const areaCases = useMemo(() => {
    if (!place) return [];
    if (place.type === 'council_district') {
      const cdNum = parseInt(place.slug.replace('cd-', ''));
      return planningCases.filter((c) => c.council_district === cdNum);
    }
    return planningCases.filter((c) => c.community_plan_area === place.name);
  }, [place]);

  const totalValuation = areaPermits.reduce((sum, p) => sum + p.valuation, 0);

  if (!place) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Place not found</h1>
          <Link href="/places" className="text-teal hover:underline mt-4 block">
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/places" className="text-sm text-teal hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Places
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{place.name}</h1>
          <p className="text-sm text-slate-500 mt-1 capitalize">{place.type.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Permits"
            value={areaPermits.length > 0 ? areaPermits.length : place.permit_count}
            icon={<FileText className="w-5 h-5" />}
          />
          <StatCard
            title="Planning Cases"
            value={areaCases.length > 0 ? areaCases.length : place.planning_case_count}
            icon={<MapPin className="w-5 h-5" />}
          />
          <StatCard
            title="Total Valuation"
            value={totalValuation > 0 ? `$${(totalValuation / 1000000).toFixed(1)}M` : 'N/A'}
            subtitle="From matching permits"
          />
        </div>

        {/* Map */}
        <div className="h-80 rounded-xl overflow-hidden border border-slate-200 shadow-sm mb-8">
          <DynamicPermitMap permits={areaPermits.length > 0 ? areaPermits : []} />
        </div>

        {/* Recent Permits */}
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Permits</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Address</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Valuation</th>
              </tr>
            </thead>
            <tbody>
              {(areaPermits.length > 0 ? areaPermits : permits.slice(0, 5)).map((p) => (
                <tr key={p.permit_nbr} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/property/${encodeURIComponent(p.primary_address)}`}
                      className="text-teal hover:underline font-medium"
                    >
                      {p.primary_address}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.permit_type}</td>
                  <td className="px-4 py-3 text-slate-500">{p.issue_date}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {p.valuation.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Planning Cases */}
        {areaCases.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Planning Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {areaCases.map((c) => (
                <div key={c.case_number} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-purple-600">{c.case_number}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">{c.case_type}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{c.address}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.project_description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
