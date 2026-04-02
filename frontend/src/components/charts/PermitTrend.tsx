'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface PermitDataPoint {
  month: string
  count: number
}

interface PermitTrendProps {
  data: PermitDataPoint[]
  /** Optional chart title displayed above the chart */
  title?: string
}

export default function PermitTrend({ data, title = 'Permit Activity' }: PermitTrendProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      {title && (
        <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
            label={{
              value: 'Month',
              position: 'insideBottom',
              offset: -2,
              fontSize: 11,
              fill: '#94a3b8',
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={40}
            label={{
              value: 'Permits',
              angle: -90,
              position: 'insideLeft',
              offset: 8,
              fontSize: 11,
              fill: '#94a3b8',
            }}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#94a3b8', marginBottom: '2px' }}
            cursor={{ stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '4 2' }}
            formatter={(value) => [
              typeof value === 'number' ? value.toLocaleString() : String(value),
              'Permits',
            ]}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
