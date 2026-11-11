import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PartnerBarChartProps {
  data: {partner: string;submitted: number;approved: number;}[];
  height?: number;
}

export function PartnerBarChart({ data, height = 240 }: PartnerBarChartProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-brand-200" /> Submitted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-navy" /> Approved (recorded)
        </span>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }} barGap={2}>
            <CartesianGrid stroke="#EDF1F6" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#65748B', fontSize: 11 }} />
            <YAxis type="category" dataKey="partner" width={112} tickLine={false} axisLine={false} tick={{ fill: '#17253C', fontSize: 12 }} />
            <Tooltip cursor={{ fill: '#F4F7FB' }} contentStyle={{ borderRadius: 10, border: '1px solid #E4EAF2', fontSize: 12 }} />
            <Bar dataKey="submitted" name="Submitted" fill="#B9CCF3" radius={[0, 3, 3, 0]} barSize={8} />
            <Bar dataKey="approved" name="Approved" fill="#10233F" radius={[0, 3, 3, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>);

}