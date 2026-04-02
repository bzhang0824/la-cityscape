import Link from "next/link";
import { Building2, Check, X } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic access to LA construction data",
    cta: "Get Started",
    ctaStyle: "border border-slate-300 text-navy hover:bg-slate-50",
    features: [
      { name: "Basic address search", included: true },
      { name: "View recent permits", included: true },
      { name: "Browse planning cases", included: true },
      { name: "Place-level reports", included: true },
      { name: "5 property reports/month", included: true },
      { name: "Unlimited property reports", included: false },
      { name: "CSV export", included: false },
      { name: "Permit alerts", included: false },
      { name: "Advanced filters", included: false },
      { name: "API access", included: false },
      { name: "Historical data (2012+)", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "Full platform access for professionals",
    cta: "Start Pro Trial",
    ctaStyle: "bg-teal text-white hover:bg-teal-dark",
    popular: true,
    features: [
      { name: "Basic address search", included: true },
      { name: "View recent permits", included: true },
      { name: "Browse planning cases", included: true },
      { name: "Place-level reports", included: true },
      { name: "5 property reports/month", included: true },
      { name: "Unlimited property reports", included: true },
      { name: "CSV export", included: true },
      { name: "Permit alerts", included: true },
      { name: "Advanced filters", included: true },
      { name: "API access", included: true },
      { name: "Historical data (2012+)", included: true },
    ],
  },
];

export default function PricingPage() {
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
          <Link href="/pricing" className="text-teal font-medium">Pricing</Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy mb-4 font-[family-name:var(--font-heading)]">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Get the construction intelligence you need. Start free, upgrade when you need full access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-8 shadow-sm border-2 ${
                plan.popular ? "border-teal shadow-lg relative" : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-teal text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold text-navy">{plan.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{plan.description}</p>

              <div className="mt-6 mb-8">
                <span className="text-5xl font-bold text-navy">{plan.price}</span>
                <span className="text-slate-500 ml-1">{plan.period}</span>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f.name} className="flex items-center gap-3">
                    {f.included ? (
                      <Check className="h-5 w-5 text-teal shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-slate-300 shrink-0" />
                    )}
                    <span className={`text-sm ${f.included ? "text-slate-700" : "text-slate-400"}`}>
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* One-time report */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-navy mb-2">Need just one report?</h3>
          <p className="text-slate-500 mb-4">
            Get a detailed property report for any LA address without a subscription.
          </p>
          <div className="text-3xl font-bold text-navy mb-4">$55 <span className="text-base font-normal text-slate-400">per report</span></div>
          <button className="bg-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors">
            Buy Single Report
          </button>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-navy mb-6 text-center font-[family-name:var(--font-heading)]">FAQs</h3>
          <div className="space-y-4">
            {[
              { q: "Where does the data come from?", a: "All data is sourced from official public agencies: LADBS building permits via the Socrata API, LA City Planning cases via the DCP API, and geographic boundaries from LA GeoHub." },
              { q: "How often is the data updated?", a: "Building permits and planning cases are synced daily from their respective APIs. Data is typically less than 24 hours old." },
              { q: "Can I cancel anytime?", a: "Yes, Pro subscriptions can be cancelled at any time. Your access continues until the end of your billing period." },
              { q: "Do you offer team plans?", a: "Contact us for team and enterprise pricing. We offer volume discounts and custom data solutions." },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h4 className="font-semibold text-navy text-sm">{q}</h4>
                <p className="text-sm text-slate-500 mt-2">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
