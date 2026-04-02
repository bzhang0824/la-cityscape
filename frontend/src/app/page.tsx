import Link from "next/link";
import { Building2, FileText, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { mockPermits, mockPlanningCases, monthlyPermitTrend } from "@/lib/mock-data";
import MapPreviewLoader from "@/components/map/MapPreviewLoader";
import PermitTrendLoader from "@/components/charts/PermitTrendLoader";

function Header() {
  return (
    <header className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-[#0EA5E9]" />
          <span className="text-xl font-bold">
            LA <span className="text-[#0EA5E9]">Cityscape</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/permits" className="hover:text-[#0EA5E9] transition-colors">Permits</Link>
          <Link href="/planning" className="hover:text-[#0EA5E9] transition-colors">Planning</Link>
          <Link href="/places" className="hover:text-[#0EA5E9] transition-colors">Places</Link>
          <Link href="/pricing" className="hover:text-[#0EA5E9] transition-colors">Pricing</Link>
        </nav>
      </div>
    </header>
  );
}

function SearchHero() {
  return (
    <section className="bg-[#0F172A] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Los Angeles<br />
          <span className="text-[#0EA5E9]">Construction Intelligence</span>
        </h1>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          Track every building permit, planning case, and development project across
          Los Angeles. Real-time data from LADBS and LA City Planning.
        </p>
        <form action="/permits" className="max-w-xl mx-auto">
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg">
            <MapPin className="h-5 w-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              name="q"
              placeholder="Search any LA address, permit, or project..."
              className="flex-1 px-4 py-4 text-slate-900 text-lg outline-none"
            />
            <button
              type="submit"
              className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-6 py-4 font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
          <span>Try:</span>
          <Link href="/property/6255%20W%20SUNSET%20BLVD" className="text-[#38BDF8] hover:underline">6255 W Sunset Blvd</Link>
          <Link href="/property/700%20S%20FLOWER%20ST" className="text-[#38BDF8] hover:underline">700 S Flower St</Link>
          <Link href="/property/520%20MATEO%20ST" className="text-[#38BDF8] hover:underline">520 Mateo St</Link>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const totalPermits = mockPermits.length;
  const totalPlanning = mockPlanningCases.length;
  const newConstruction = mockPermits.filter(p => p.permit_sub_type === "New Construction").length;

  const stats = [
    { label: "Building Permits Tracked", value: "38,730", icon: FileText, sub: `${totalPermits} shown in demo` },
    { label: "Active Planning Cases", value: "1,240", icon: Building2, sub: `${totalPlanning} shown in demo` },
    { label: "Total Construction Value", value: "$18.4B", icon: TrendingUp, sub: "Year to date" },
    { label: "New Construction This Month", value: "342", icon: MapPin, sub: `${newConstruction} in demo data` },
  ];

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#0F172A] mt-1">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                </div>
                <stat.icon className="h-10 w-10 text-[#0EA5E9] opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentActivity() {
  const recentPermits = mockPermits.slice(0, 8);
  const recentCases = mockPlanningCases.slice(0, 5);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A]">Recent Permits</h2>
              <Link href="/permits" className="text-[#0EA5E9] text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentPermits.map((p) => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-[#0F172A] truncate">{p.primary_address}</p>
                      <p className="text-sm text-slate-500 mt-1">{p.permit_type} &middot; {p.permit_sub_type}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-semibold text-[#0F172A]">
                        {p.valuation >= 1000000
                          ? `$${(p.valuation / 1000000).toFixed(1)}M`
                          : `$${p.valuation.toLocaleString()}`}
                      </p>
                      <p className="text-xs text-slate-400">{new Date(p.issue_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A]">Proposed Projects</h2>
              <Link href="/planning" className="text-[#0EA5E9] text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentCases.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-[#0F172A]">{c.case_number}</p>
                      <p className="text-sm text-slate-600 truncate">{c.address}</p>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{c.project_description}</p>
                    </div>
                    <span className={`shrink-0 ml-4 px-2 py-0.5 text-xs font-medium rounded-full ${
                      c.completed ? "bg-green-100 text-green-700" :
                      c.on_hold ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {c.completed ? "Completed" : c.on_hold ? "On Hold" : c.case_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendSection() {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Permit Activity Trend</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <PermitTrendLoader data={monthlyPermitTrend} />
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">Live Permit Map</h2>
          <Link href="/permits" className="text-[#0EA5E9] text-sm font-medium flex items-center gap-1 hover:underline">
            Open full map <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 h-[500px]">
          <MapPreviewLoader />
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-4 bg-[#0F172A] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to track LA development?
        </h2>
        <p className="text-slate-300 mb-8 text-lg">
          Get unlimited access to property reports, permit alerts, and export tools.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/pricing"
            className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View Plans
          </Link>
          <Link
            href="/permits"
            className="border border-slate-500 hover:border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Explore Free
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#020617] text-slate-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-[#0EA5E9]" />
              <span className="text-white font-bold">LA Cityscape</span>
            </div>
            <p className="text-sm">
              Construction intelligence for Los Angeles. Track permits, planning cases, and development activity.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/permits" className="hover:text-white transition-colors">Permits</Link></li>
              <li><Link href="/planning" className="hover:text-white transition-colors">Planning Cases</Link></li>
              <li><Link href="/places" className="hover:text-white transition-colors">Places</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Data Sources</h3>
            <ul className="space-y-2 text-sm">
              <li>LADBS (Socrata API)</li>
              <li>LA City Planning</li>
              <li>LA GeoHub</li>
              <li>LA County Assessor</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
          &copy; 2025 LA Cityscape. All rights reserved. Data sourced from LADBS, LA City Planning, and LA GeoHub.
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SearchHero />
        <StatsSection />
        <RecentActivity />
        <TrendSection />
        <MapSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
