import Link from 'next/link'
import { Building2 } from 'lucide-react'

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'API', href: '/api-docs' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Logo and tagline */}
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity w-fit"
            >
              <Building2 className="w-5 h-5 text-sky-400" aria-hidden="true" />
              <span className="text-white font-bold tracking-tight">
                LA <span className="text-sky-400">Cityscape</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500">
              Explore permits, planning, and property data across Los Angeles.
            </p>
          </div>

          {/* Navigation links */}
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm hover:text-sky-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          &copy; {year} LA Cityscape. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
