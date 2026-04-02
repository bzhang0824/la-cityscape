import Link from "next/link";
import { Building2, MapPin, FileText, Landmark, ArrowLeft } from "lucide-react";
import { mockPermits, mockPlanningCases } from "@/lib/mock-data";
import PermitMapLoader from "@/components/map/PermitMapLoader";

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toLocaleString()}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function PropertyPage(props: { params: Promise<{ address: string }> }) {
  const { address } = await props.params;
  const decodedAddress = decodeURIComponent(address).toUpperCase();

  const permits = mockPermits.filter(
    (p) => p.primary_address.toUpperCase() === decodedAddress
  );

  const firstPermit = permits[0] || mockPermits[0];
  const lat = firstPermit?.lat || 34.0522;
  const lon = firstPermit?.lon || -118.2437;

  const nearbyCases = mockPlanningCases.filter((c) => {
    if (!c.lat || !c.lon) return false;
    const dist = Math.sqrt(Math.pow(c.lat - lat, 2) + Math.pow(c.lon - lon, 2));
    return dist < 0.01;
  });

  const propertyInfo = firstPermit
    ? {
        zone: firstPermit.zone,
        council_district: firstPermit.council_district,
        community_plan_area: firstPermit.community_plan_area,
        neighborhood_council: firstPermit.neighborhood_council,
      }
    : null;

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
          <Link href="/places" className="hover:text-teal transition-colors">Places</Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/permits" className="inline-flex items-center gap-1 text-sm text-teal hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to permits
        </Link>

        <h1 className="text-3xl font-bold text-navy mb-2 font-[family-name:var(--font-heading)]">{decodedAddress}</h1>
        <p className="text-slate-500 mb-8">Property Report</p>

        {/* Map */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 h-[350px] mb-8">
          <PermitMapLoader permits={permits.length > 0 ? permits : [firstPermit]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <Landmark className="h-5 w-5 text-teal" /> Property Info
              </h2>
              {propertyInfo ? (
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Zoning</dt>
                    <dd className="text-navy font-medium">{propertyInfo.zone}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Council District</dt>
                    <dd className="text-navy font-medium">{propertyInfo.council_district}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Community Plan Area</dt>
                    <dd className="text-navy font-medium">{propertyInfo.community_plan_area}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Neighborhood Council</dt>
                    <dd className="text-navy font-medium">{propertyInfo.neighborhood_council}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Coordinates</dt>
                    <dd className="text-navy font-medium">{lat.toFixed(4)}, {lon.toFixed(4)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-slate-400 text-sm">No property data available</p>
              )}
            </div>
          </div>

          {/* Permits */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
              <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal" /> Permit History ({permits.length})
              </h2>
              {permits.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-slate-500 font-medium">Permit #</th>
                        <th className="text-left py-2 text-slate-500 font-medium">Type</th>
                        <th className="text-left py-2 text-slate-500 font-medium">Date</th>
                        <th className="text-left py-2 text-slate-500 font-medium">Value</th>
                        <th className="text-left py-2 text-slate-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permits.map((p) => (
                        <tr key={p.id} className="border-b border-slate-100">
                          <td className="py-2 font-medium text-teal">{p.permit_nbr}</td>
                          <td className="py-2 text-slate-600">{p.permit_type}</td>
                          <td className="py-2 text-slate-500">{formatDate(p.issue_date)}</td>
                          <td className="py-2 text-slate-700 font-medium">{formatCurrency(p.valuation)}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              p.status_desc === "Issued" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>{p.status_desc}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No permits found at this address. Showing nearest results.</p>
              )}
            </div>

            {/* Nearby Planning Cases */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal" /> Nearby Planning Cases ({nearbyCases.length})
              </h2>
              {nearbyCases.length > 0 ? (
                <div className="space-y-3">
                  {nearbyCases.map((c) => (
                    <div key={c.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <a href={c.pdis_url} target="_blank" rel="noopener noreferrer" className="text-teal font-medium hover:underline text-sm">
                            {c.case_number}
                          </a>
                          <p className="text-sm text-slate-600">{c.address}</p>
                          <p className="text-xs text-slate-400 mt-1">{c.project_description}</p>
                        </div>
                        <span className={`shrink-0 ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                          c.completed ? "bg-green-100 text-green-700" : c.on_hold ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {c.completed ? "Done" : c.on_hold ? "Hold" : c.case_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No planning cases found within 0.25 miles</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
