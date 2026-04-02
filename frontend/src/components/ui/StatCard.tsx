import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  variant?: 'navy' | 'white';
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  variant = 'white',
}: StatCardProps) {
  const isPositive = change >= 0;
  const isNavy = variant === 'navy';

  return (
    <div
      className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${
        isNavy
          ? 'border-slate-700 bg-navy text-white'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              isNavy ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold font-heading tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`shrink-0 rounded-lg p-2.5 ${
            isNavy ? 'bg-teal/15 text-teal-light' : 'bg-teal/10 text-teal'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-emerald-500' : 'text-red-500'
          }`}
        >
          {isPositive ? '+' : ''}
          {change.toFixed(1)}%
        </span>
        <span
          className={`text-xs ${isNavy ? 'text-slate-500' : 'text-slate-400'}`}
        >
          vs last month
        </span>
      </div>
    </div>
  );
}
