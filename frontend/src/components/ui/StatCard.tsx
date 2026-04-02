import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
}

export default function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-start gap-4 overflow-hidden">
      {/* Teal accent left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl"
        aria-hidden="true"
      />

      {/* Icon */}
      {icon && (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-sky-50 text-sky-500">
          {icon}
        </div>
      )}

      {/* Text content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {value}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
