'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { DynamicPlanningMap } from '@/components/map/MapWrapper';
import { planningCases } from '@/lib/mock-data';

const CASE_TYPES = ['All', 'CPC', 'ENV', 'DIR', 'VTT', 'TT', 'ZA', 'EAR'];
const PAGE_SIZE = 10;

export default function PlanningPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState(0);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...planningCases];
    if (typeFilter !== 'All') {
      result = result.filter((c) => c.case_type === typeFilter);
    }
    if (districtFilter > 0) {
      result = result.filter((c) => c.council_district === districtFilter);
    }
    result.sort((a, b) => b.filing_date.localeCompare(a.filing_date));
    return result;
  }, [typeFilter, districtFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const districts = Array.from(new Set(planningCases.map((c) => c.council_district))).sort((a, b) => a - b);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Left Panel */}
      <div className="w-full lg:w-2/5 flex flex-col border-r border-slate-200 bg-white">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-purple-500" />
            Planning Cases
          </h1>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Case Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                {CASE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Council District</label>
              <select
                value={districtFilter}
                onChange={(e) => { setDistrictFilter(Number(e.target.value)); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value={0}>All</option>
                {districts.map((d) => (
                  <option key={d} value={d}>CD {d}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">{filtered.length} cases found</p>
        </div>

        {/* Cases List */}
        <div className="flex-1 overflow-auto">
          {paginated.map((c) => (
            <div
              key={c.case_number}
              className="p-4 border-b border-slate-100 hover:bg-purple-50/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-purple-600">{c.case_number}</span>
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">
                      {c.case_type}
                    </span>
                  </div>
                  <Link
                    href={`/property/${encodeURIComponent(c.address)}`}
                    className="text-sm font-medium text-teal hover:underline"
                  >
                    {c.address}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.project_description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                <span>Filed: {c.filing_date}</span>
                <span>CD {c.council_district}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  c.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  c.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 disabled:opacity-40"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Panel — Map */}
      <div className="flex-1 h-64 lg:h-auto">
        <DynamicPlanningMap cases={filtered} />
      </div>
    </div>
  );
}
