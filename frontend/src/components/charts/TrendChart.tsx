import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendChartProps {
  data: {month: string;submitted: number;disbursed: number;}[];
  height?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function TrendChart({ data, height = 240, primaryLabel = 'Submitted', secondaryLabel = 'Disbursed (recorded)' }: TrendChartProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand" /> {primaryLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal" /> {secondaryLabel}
        </span>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#EDF1F6" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#65748B', fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#65748B', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              cursor={{ stroke: '#C9D4E3' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E4EAF2', fontSize: 12, boxShadow: '0 8px 24px -8px rgba(16,35,63,0.18)' }} />
            
            <Area type="monotone" dataKey="submitted" name={primaryLabel} stroke="#2457C5" strokeWidth={2} fill="#2457C5" fillOpacity={0.07} />
            <Area type="monotone" dataKey="disbursed" name={secondaryLabel} stroke="#18A999" strokeWidth={2} fill="#18A999" fillOpacity={0.08} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>);

}
