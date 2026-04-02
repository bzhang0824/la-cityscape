import Link from 'next/link';
import { MapPin, Building2 } from 'lucide-react';
import { places } from '@/lib/mock-data';

export default function PlacesPage() {
  const councilDistricts = places.filter((p) => p.type === 'council_district');
  const communityPlanAreas = places.filter((p) => p.type === 'community_plan_area');

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Browse Places</h1>
          <p className="mt-2 text-slate-500">
            Explore construction activity by council district or community plan area.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Council Districts */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-teal" />
            Council Districts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {councilDistricts.map((place) => (
              <Link
                key={place.slug}
                href={`/places/${place.slug}`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-sky-300 hover:shadow-md transition-all group"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal transition-colors">
                  {place.name}
                </h3>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                    {place.permit_count.toLocaleString()} permits
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {place.planning_case_count} cases
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Top type: {place.top_permit_type}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Community Plan Areas */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-purple-500" />
            Community Plan Areas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityPlanAreas.map((place) => (
              <Link
                key={place.slug}
                href={`/places/${place.slug}`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {place.name}
                </h3>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                    {place.permit_count.toLocaleString()} permits
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {place.planning_case_count} cases
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Top type: {place.top_permit_type}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
