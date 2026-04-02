import Link from 'next/link';
import { Check, X } from 'lucide-react';

const features = [
  { name: 'Permit search & browse', free: true, pro: true },
  { name: 'Interactive maps', free: true, pro: true },
  { name: 'Planning case browser', free: true, pro: true },
  { name: 'Property reports', free: true, pro: true },
  { name: 'Basic filters (type, district)', free: true, pro: true },
  { name: 'Advanced filters (valuation, zone, date range)', free: false, pro: true },
  { name: 'CSV data export', free: false, pro: true },
  { name: 'API access', free: false, pro: true },
  { name: 'Custom alerts & notifications', free: false, pro: true },
  { name: 'Bulk property reports', free: false, pro: true },
  { name: 'Historical data (5+ years)', free: false, pro: true },
  { name: 'Priority support', free: false, pro: true },
];

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-navy text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-slate-300">
            Get started for free. Upgrade to Pro when you need advanced features and data exports.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900">Free</h2>
            <p className="mt-2 text-sm text-slate-500">
              Perfect for casual browsing and basic research.
            </p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500">/month</span>
            </div>
            <Link
              href="/permits"
              className="mt-6 block w-full text-center py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Get Started
            </Link>
            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f.name} className="flex items-center gap-3 text-sm">
                  {f.free ? (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={f.free ? 'text-slate-700' : 'text-slate-400'}>
                    {f.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl border-2 border-teal shadow-lg p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal text-white text-xs font-semibold rounded-full">
              Most Popular
            </div>
            <h2 className="text-xl font-bold text-slate-900">Pro</h2>
            <p className="mt-2 text-sm text-slate-500">
              For developers, investors, and professionals who need full access.
            </p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-slate-900">$99</span>
              <span className="text-slate-500">/month</span>
            </div>
            <Link
              href="/permits"
              className="mt-6 block w-full text-center py-3 px-4 rounded-lg bg-teal hover:bg-teal-dark text-white font-semibold transition-colors"
            >
              Start Pro Trial
            </Link>
            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f.name} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-slate-700">{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Feature Comparison</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Feature</th>
                <th className="text-center px-6 py-4 font-semibold text-slate-600">Free</th>
                <th className="text-center px-6 py-4 font-semibold text-teal">Pro</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={f.name} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-6 py-3 text-slate-700">{f.name}</td>
                  <td className="px-6 py-3 text-center">
                    {f.free ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Check className="w-4 h-4 text-green-500 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
