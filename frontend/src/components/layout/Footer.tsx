import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/api', label: 'API' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between sm:items-start">
          {/* Branding */}
          <div className="text-center sm:text-left">
            <span className="font-heading text-lg font-bold text-white">
              LA&nbsp;<span className="text-teal">Cityscape</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              Los Angeles construction intelligence. Track permits, planning
              cases, and development activity across the city.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
          <p>
            Data sourced from LADBS, LA City Planning, LA GeoHub
          </p>
          <p className="mt-1">
            &copy; 2025 LA Cityscape. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
