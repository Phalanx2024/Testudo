'use client';
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// ─── Types ───────────────────────────────────────────────────────────────────

type SearchResult = {
  chunk_text: string;
  seller: string;
  ticker: string;
  pub_date: string;
  chunk_type: string;
  similarity: number;
};

type CompanyReport = {
  report_title: string;
  seller: string;
  pub_date: string;
  link: string;
  ticker: string;
  exchange_code: string | null;
  gics_sector: string | null;
  confidence_score: number | null;
};

type Seller = {
  seller: string;
  total_reports: number;
  latest_report: string | null;
  first_report: string | null;
};

type Tab = 'search' | 'pitch' | 'company' | 'similar' | 'sellers';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(s: string | null) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function chunkTypeBadge(type: string) {
  return clsx(
    'rounded px-2 py-0.5 text-xs font-medium',
    type === 'thesis'    ? 'bg-purple-50 text-purple-700' :
    type === 'evidence'  ? 'bg-red-50 text-red-700' :
    type === 'valuation' ? 'bg-green-50 text-green-700' :
    'bg-gray-50 text-gray-600'
  );
}

const TABS: [Tab, string, any][] = [
  ['search',  'Search Reports',   MagnifyingGlassIcon],
  ['pitch',   'Generate Pitch',   DocumentTextIcon],
  ['company', 'Company Reports',  BuildingOffice2Icon],
  ['similar', 'Similar Targets',  ArrowsRightLeftIcon],
  ['sellers', 'Short Sellers',    UserGroupIcon],
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResearchClient() {
  const [tab, setTab] = useState<Tab>('search');
  const [error, setError] = useState('');

  // Search
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchTicker, setSearchTicker] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching]       = useState(false);

  // Pitch
  const [pitchTicker, setPitchTicker]   = useState('');
  const [pitch, setPitch]               = useState('');
  const [pitchMeta, setPitchMeta]       = useState<{ reports: number; chunks: number } | null>(null);
  const [generating, setGenerating]     = useState(false);

  // Company reports
  const [companyTicker, setCompanyTicker]       = useState('');
  const [companyReports, setCompanyReports]     = useState<CompanyReport[]>([]);
  const [loadingCompany, setLoadingCompany]     = useState(false);

  // Similar targets
  const [simDesc, setSimDesc]           = useState('');
  const [simSector, setSimSector]       = useState('');
  const [simResults, setSimResults]     = useState<SearchResult[]>([]);
  const [loadingSim, setLoadingSim]     = useState(false);

  // Sellers
  const [sellers, setSellers]           = useState<Seller[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [sellerSearch, setSellerSearch] = useState('');

  function changeTab(t: Tab) { setTab(t); setError(''); }

  // ── Search ──────────────────────────────────────────────────────────────────

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true); setError(''); setSearchResults([]);
    try {
      const res = await fetch('/api/kb/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, ticker: searchTicker || undefined, limit: 10 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSearchResults(data.results);
    } catch (e: any) { setError(e.message); }
    finally { setSearching(false); }
  }

  // ── Pitch ───────────────────────────────────────────────────────────────────

  async function handlePitch(e: React.FormEvent) {
    e.preventDefault();
    if (!pitchTicker.trim()) return;
    setGenerating(true); setError(''); setPitch(''); setPitchMeta(null);
    try {
      const res = await fetch('/api/kb/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: pitchTicker.toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPitch(data.pitch);
      setPitchMeta(data.context_used);
    } catch (e: any) { setError(e.message); }
    finally { setGenerating(false); }
  }

  // ── Company Reports ─────────────────────────────────────────────────────────

  async function handleCompanyLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!companyTicker.trim()) return;
    setLoadingCompany(true); setError(''); setCompanyReports([]);
    try {
      const res = await fetch('/api/kb/company-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: companyTicker }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCompanyReports(data.reports);
    } catch (e: any) { setError(e.message); }
    finally { setLoadingCompany(false); }
  }

  // ── Similar Targets ─────────────────────────────────────────────────────────

  async function handleSimilar(e: React.FormEvent) {
    e.preventDefault();
    if (!simDesc.trim()) return;
    setLoadingSim(true); setError(''); setSimResults([]);
    try {
      const res = await fetch('/api/kb/similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: simDesc, sector: simSector || undefined, limit: 10 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSimResults(data.results);
    } catch (e: any) { setError(e.message); }
    finally { setLoadingSim(false); }
  }

  // ── Sellers ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (tab !== 'sellers' || sellers.length > 0) return;
    setLoadingSellers(true);
    fetch('/api/kb/sellers')
      .then(r => r.json())
      .then(d => { setSellers(d.sellers ?? []); })
      .catch(e => setError(e.message))
      .finally(() => setLoadingSellers(false));
  }, [tab]);

  const filteredSellers = sellers.filter(s =>
    s.seller.toLowerCase().includes(sellerSearch.toLowerCase())
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Research</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
        {TABS.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => changeTab(key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* ── Search Reports ── */}
      {tab === 'search' && (
        <div>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='e.g. "aggressive revenue recognition biotech"'
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={searchTicker}
              onChange={e => setSearchTicker(e.target.value.toUpperCase())}
              placeholder="Ticker (optional)"
              className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={searching || !searchQuery.trim()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {searching ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <MagnifyingGlassIcon className="w-4 h-4" />}
              Search
            </button>
          </form>
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{searchResults.length} results</p>
              {searchResults.map((r, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{r.seller}</span>
                      {r.ticker && <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{r.ticker}</span>}
                      <span className={chunkTypeBadge(r.chunk_type)}>{r.chunk_type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{r.pub_date}</span>
                      <span className="font-medium text-gray-700">{(r.similarity * 100).toFixed(0)}% match</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-5">{r.chunk_text}</p>
                </div>
              ))}
            </div>
          )}
          {!searching && searchResults.length === 0 && searchQuery && (
            <p className="text-sm text-gray-400 text-center py-12">No results. Try a different query.</p>
          )}
        </div>
      )}

      {/* ── Generate Pitch ── */}
      {tab === 'pitch' && (
        <div>
          <form onSubmit={handlePitch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={pitchTicker}
              onChange={e => setPitchTicker(e.target.value.toUpperCase())}
              placeholder="Enter ticker, e.g. SMCI"
              className="w-48 rounded-md border border-gray-300 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={generating || !pitchTicker.trim()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {generating
                ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Generating...</>
                : <><DocumentTextIcon className="w-4 h-4" /> Generate Short Pitch</>
              }
            </button>
          </form>
          {generating && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto mb-3 text-blue-500" />
              Retrieving research context and generating pitch...
            </div>
          )}
          {pitch && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              {pitchMeta && (
                <div className="border-b border-gray-100 px-5 py-3 flex gap-4 text-xs text-gray-500">
                  <span>Context: <strong>{pitchMeta.reports}</strong> prior reports on {pitchTicker}</span>
                  <span><strong>{pitchMeta.chunks}</strong> semantic matches</span>
                </div>
              )}
              <div className="p-5 prose prose-sm max-w-none">
                {pitch.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-base font-semibold mt-5 mb-2 text-gray-900">{line.slice(3)}</h2>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm text-gray-700">{line.slice(2)}</li>;
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Company Reports ── */}
      {tab === 'company' && (
        <div>
          <form onSubmit={handleCompanyLookup} className="flex gap-3 mb-6">
            <input
              type="text"
              value={companyTicker}
              onChange={e => setCompanyTicker(e.target.value.toUpperCase())}
              placeholder="Ticker, e.g. CVNA"
              className="w-48 rounded-md border border-gray-300 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loadingCompany || !companyTicker.trim()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingCompany
                ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Loading...</>
                : <><BuildingOffice2Icon className="w-4 h-4" /> Look Up</>
              }
            </button>
          </form>
          {companyReports.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">{companyReports.length} report{companyReports.length !== 1 ? 's' : ''} found for <strong>{companyTicker}</strong></p>
              {companyReports.map((r, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm leading-snug"
                      >
                        {r.report_title}
                      </a>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{r.seller}</span>
                        {r.exchange_code && (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{r.exchange_code}: {r.ticker}</span>
                        )}
                        {r.gics_sector && (
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{r.gics_sector}</span>
                        )}
                        {r.confidence_score != null && (
                          <span className="text-xs text-gray-400">confidence {(r.confidence_score * 100).toFixed(0)}%</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{fmtDate(r.pub_date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loadingCompany && companyReports.length === 0 && companyTicker && (
            <p className="text-sm text-gray-400 text-center py-12">No reports found for {companyTicker}.</p>
          )}
        </div>
      )}

      {/* ── Similar Targets ── */}
      {tab === 'similar' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Find companies historically shorted for similar reasons.</p>
          <form onSubmit={handleSimilar} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={simDesc}
              onChange={e => setSimDesc(e.target.value)}
              placeholder='e.g. "unprofitable SaaS with aggressive revenue recognition and insider selling"'
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={simSector}
              onChange={e => setSimSector(e.target.value)}
              placeholder="Sector (optional)"
              className="w-44 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loadingSim || !simDesc.trim()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingSim ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ArrowsRightLeftIcon className="w-4 h-4" />}
              Find Similar
            </button>
          </form>
          {simResults.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{simResults.length} similar targets</p>
              {simResults.map((r, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {r.ticker && <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-mono font-medium text-blue-700">{r.ticker}</span>}
                      <span className="text-sm font-medium text-gray-700">{r.seller}</span>
                      <span className={chunkTypeBadge(r.chunk_type)}>{r.chunk_type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{r.pub_date}</span>
                      <span className="font-medium text-gray-700">{(r.similarity * 100).toFixed(0)}% match</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{r.chunk_text}</p>
                </div>
              ))}
            </div>
          )}
          {!loadingSim && simResults.length === 0 && simDesc && (
            <p className="text-sm text-gray-400 text-center py-12">No results. Try a different description.</p>
          )}
        </div>
      )}

      {/* ── Short Sellers ── */}
      {tab === 'sellers' && (
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-sm text-gray-500">{sellers.length} short sellers tracked</p>
            <input
              type="text"
              value={sellerSearch}
              onChange={e => setSellerSearch(e.target.value)}
              placeholder="Filter sellers…"
              className="w-56 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          {loadingSellers ? (
            <div className="text-center py-12 text-sm text-gray-400">
              <ArrowPathIcon className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />
              Loading…
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Short Seller</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Reports</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">First Report</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Latest Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map(s => (
                    <tr key={s.seller} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <button
                          onClick={() => { setCompanyTicker(''); setTab('search'); setSearchQuery(s.seller); }}
                          className="hover:text-blue-600 transition-colors text-left"
                        >
                          {s.seller}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 font-medium">{s.total_reports.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(s.first_report)}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(s.latest_report)}</td>
                    </tr>
                  ))}
                  {filteredSellers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No sellers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
