'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PermitDataPoint {
  month: string;
  count: number;
  value: number;
}

interface PermitTrendProps {
  data: PermitDataPoint[];
}

export default function PermitTrend({ data }: PermitTrendProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-heading text-base font-semibold text-navy mb-4">
        Monthly Permit Trend
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '13px',
              }}
              itemStyle={{ color: '#38BDF8' }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
              formatter={(val, name) => {
                const v = Number(val);
                if (name === 'count') return [v.toLocaleString(), 'Permits'];
                if (name === 'value')
                  return [`$${v.toLocaleString()}`, 'Total Value'];
                return [v, String(name)];
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0EA5E9"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#0EA5E9', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#0EA5E9', strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#64748B"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
