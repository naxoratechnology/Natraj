import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { statusHex } from '../../utils/status';

interface StatusDonutProps {
  data: {name: string;value: number;}[];
  centerLabel?: string;
  size?: number;
}

export function StatusDonut({ data, centerLabel = 'Total', size = 160 }: StatusDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const filtered = data.filter((d) => d.value > 0);
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={filtered} dataKey="value" nameKey="name" innerRadius="72%" outerRadius="100%" paddingAngle={1.5} stroke="none" isAnimationActive={false}>
              {filtered.map((d) =>
              <Cell key={d.name} fill={statusHex[d.name] ?? '#A5B1C2'} />
              )}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4EAF2', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="num font-display text-2xl font-bold text-ink">{total}</span>
          <span className="text-[11px] text-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full min-w-0 flex-1 space-y-2">
        {filtered.map((d) =>
        <li key={d.name} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2 text-ink">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: statusHex[d.name] ?? '#A5B1C2' }} />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="num shrink-0 text-muted">
              <span className="font-medium text-ink">{d.value}</span> · {total ? Math.round(d.value / total * 100) : 0}%
            </span>
          </li>
        )}
      </ul>
    </div>);

}