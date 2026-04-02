import Link from "next/link";
import { Building2, MapPin, Users, Hash } from "lucide-react";
import { mockPlaces } from "@/lib/mock-data";

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  council_district: { label: "Council Districts", icon: <Users className="h-5 w-5" />, color: "bg-blue-100 text-blue-700" },
  community_plan_area: { label: "Community Plan Areas", icon: <MapPin className="h-5 w-5" />, color: "bg-teal/10 text-teal-dark" },
  neighborhood_council: { label: "Neighborhood Councils", icon: <Hash className="h-5 w-5" />, color: "bg-purple-100 text-purple-700" },
};

export default function PlacesPage() {
  const groups = mockPlaces.reduce<Record<string, typeof mockPlaces>>((acc, p) => {
    (acc[p.place_type] = acc[p.place_type] || []).push(p);
    return acc;
  }, {});

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
          <Link href="/pricing" className="hover:text-teal transition-colors">Pricing</Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-2 font-[family-name:var(--font-heading)]">Places</h1>
        <p className="text-slate-500 mb-10">Browse construction activity by area across Los Angeles</p>

        {Object.entries(groups).map(([type, places]) => {
          const config = typeConfig[type] || { label: type, icon: <MapPin className="h-5 w-5" />, color: "bg-slate-100 text-slate-700" };
          return (
            <section key={type} className="mb-12">
              <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                {config.icon} {config.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {places.map((place) => (
                  <Link
                    key={place.id}
                    href={`/places/${place.slug}`}
                    className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal/30 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-navy group-hover:text-teal transition-colors">{place.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
                          {config.label.replace(/s$/, "")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-navy">{place.permit_count.toLocaleString()}</span>
                      <span className="text-sm text-slate-400">permits</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
