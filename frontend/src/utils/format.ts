import { differenceInCalendarDays, differenceInMinutes, format } from 'date-fns';

/** Fixed "now" for the prototype so ages and relative times stay stable. */
export const TODAY = new Date('2026-10-15T15:30:00+05:30');

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactINR(value: number): string {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)} L`;
  return formatINR(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatDate(iso: string): string {
  return format(new Date(iso), 'dd MMM yyyy');
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'dd MMM yyyy, h:mm a');
}

export function daysSince(iso: string): number {
  return differenceInCalendarDays(TODAY, new Date(iso));
}

export function ageLabel(iso: string): string {
  const d = daysSince(iso);
  if (d <= 0) return 'Today';
  if (d === 1) return '1 day';
  return `${d} days`;
}

export function relativeTime(iso: string): string {
  const mins = differenceInMinutes(TODAY, new Date(iso));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(iso);
}

export function initials(name: string): string {
  return name.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((p) => p[0]?.toUpperCase()).
  join('');
}

export function demoId(prefix: string): string {
  return `${prefix}-${String(Math.floor(10000 + Math.random() * 89999))}`;
}

export function downloadCsv(filename: string, rows: (string | number)[][]): void {
  const csv = rows.
  map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).
  join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}