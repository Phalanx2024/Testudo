'use client';
import { useEffect, useState } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type ScraperRow = {
  scraper: string;
  total: number;
  last_7d: number;
  last_30d: number;
  latest_pub: string | null;
  latest_update: string | null;
  pending: number;
  processed: number;
  failed: number;
};

type Summary = {
  total_scrapers: number;
  active_7d: number;
  total_reports_7d: number;
  total_reports_30d: number;
  last_run: string | null;
};

function fmtDate(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3600000;
  if (diffH < 1) return `${Math.round(diffH * 60)}m ago`;
  if (diffH < 24) return `${Math.round(diffH)}h ago`;
  if (diffH < 48) return 'Yesterday';
  return fmtDate(s);
}

function StatusBadge({ row }: { row: ScraperRow }) {
  if (row.last_7d > 0)
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"><CheckCircleIcon className="w-3 h-3" />Active</span>;
  if (row.last_30d > 0)
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full"><ClockIcon className="w-3 h-3" />Idle</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full"><ExclamationCircleIcon className="w-3 h-3" />Stale</span>;
}

export default function ScrapersClient() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [scrapers, setScrapers] = useState<ScraperRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/scrapers/status');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSummary(data.summary);
      setScrapers(data.scrapers);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = scrapers.filter(r =>
    r.scraper.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scraper Status</h1>
          <p className="text-sm text-gray-500 mt-1">Live view of all short seller scrapers</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowPathIcon className={clsx('w-4 h-4', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
      )}

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total scrapers', value: summary.total_scrapers },
            { label: 'Active (7d)', value: summary.active_7d },
            { label: 'Reports (7d)', value: summary.total_reports_7d },
            { label: 'Reports (30d)', value: summary.total_reports_30d },
          ].map(c => (
            <div key={c.label} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{c.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Filter scrapers…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Scraper</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">7d</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">30d</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Latest pub</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Last update</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">Loading…</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">No scrapers found</td>
              </tr>
            )}
            {filtered.map(row => (
              <tr key={row.scraper} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{row.scraper}</td>
                <td className="px-4 py-3"><StatusBadge row={row} /></td>
                <td className="px-4 py-3 text-right text-gray-700">{row.total.toLocaleString()}</td>
                <td className={clsx('px-4 py-3 text-right font-medium', row.last_7d > 0 ? 'text-green-600' : 'text-gray-400')}>
                  {row.last_7d > 0 ? `+${row.last_7d}` : '—'}
                </td>
                <td className={clsx('px-4 py-3 text-right', row.last_30d > 0 ? 'text-gray-700' : 'text-gray-400')}>
                  {row.last_30d > 0 ? `+${row.last_30d}` : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">{fmtDate(row.latest_pub)}</td>
                <td className="px-4 py-3 text-gray-500">{fmtDateTime(row.latest_update)}</td>
                <td className={clsx('px-4 py-3 text-right', row.pending > 0 ? 'text-amber-600 font-medium' : 'text-gray-400')}>
                  {row.pending > 0 ? row.pending : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {summary?.last_run && (
        <p className="text-xs text-gray-400">Last DB activity: {fmtDateTime(summary.last_run)}</p>
      )}
    </div>
  );
}
