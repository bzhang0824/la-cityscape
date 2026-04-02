'use client';

import Link from 'next/link';
import { Building2, FileText, MapPin, TrendingUp, ArrowRight, Shield, Zap, Database } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import StatCard from '@/components/ui/StatCard';
import PermitTrend from '@/components/charts/PermitTrend';
import { DynamicPermitMap } from '@/components/map/MapWrapper';
import { permits, permitTrendData } from '@/lib/mock-data';

export default function HomePage() {
  const recentPermits = permits.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Los Angeles{' '}
              <span className="text-teal">Construction Intelligence</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              Explore permits, planning cases, and property data across every neighborhood in LA.
              The most comprehensive construction activity platform for Los Angeles.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBar className="!bg-slate-800 !border-slate-600 [&_input]:!text-white [&_input]:!placeholder-slate-400" />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Try: 6255 W Sunset Blvd, 800 S Figueroa St, 1111 S Grand Ave
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="-mt-8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Permits"
              value="18,074"
              subtitle="Year to date"
              icon={<FileText className="w-5 h-5" />}
            />
            <StatCard
              title="Active Planning Cases"
              value="1,247"
              subtitle="Currently under review"
              icon={<MapPin className="w-5 h-5" />}
            />
            <StatCard
              title="New Construction"
              value="342"
              subtitle="This month"
              icon={<Building2 className="w-5 h-5" />}
            />
            <StatCard
              title="Avg Valuation"
              value="$2.4M"
              subtitle="Per building permit"
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
            <Link
              href="/permits"
              className="text-sm font-medium text-teal hover:text-teal-dark flex items-center gap-1 transition-colors"
            >
              View all permits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Mini Map */}
            <div className="lg:col-span-2 h-80 lg:h-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <DynamicPermitMap permits={recentPermits} />
            </div>
            {/* Recent Permits Table */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
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
                    {recentPermits.map((permit) => (
                      <tr
                        key={permit.permit_nbr}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/property/${encodeURIComponent(permit.primary_address)}`}
                            className="text-teal hover:underline font-medium"
                          >
                            {permit.primary_address}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{permit.permit_type}</td>
                        <td className="px-4 py-3 text-slate-500">{permit.issue_date}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700">
                          {permit.valuation.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Permit Trend Section */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Permit Trends</h2>
          <PermitTrend data={permitTrendData} title="Monthly Permit Activity — 2025" />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to track LA construction
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              From individual permits to city-wide trends, LA Cityscape gives you the data and tools
              to make informed decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-sky-50 text-teal mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Comprehensive Data</h3>
              <p className="mt-2 text-sm text-slate-500">
                Access over 18,000 permits and 1,200 planning cases updated daily from LADBS and City Planning.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-sky-50 text-teal mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Real-Time Maps</h3>
              <p className="mt-2 text-sm text-slate-500">
                Interactive maps with permit markers, planning overlays, and council district boundaries across LA.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-sky-50 text-teal mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Property Reports</h3>
              <p className="mt-2 text-sm text-slate-500">
                Deep-dive into any address with complete permit history, zoning info, and nearby development activity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to explore LA construction data?</h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            Get started for free with basic access, or upgrade to Pro for full data exports,
            API access, and advanced analytics.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/permits"
              className="px-6 py-3 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg transition-colors"
            >
              Explore Permits
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 border border-slate-600 hover:border-slate-400 text-white font-semibold rounded-lg transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
