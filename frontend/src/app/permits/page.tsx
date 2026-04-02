'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { DynamicPermitMap } from '@/components/map/MapWrapper';
import { permits } from '@/lib/mock-data';

const PERMIT_TYPES = ['All', 'Building', 'Electrical', 'Plumbing', 'Mechanical', 'Grading'];
const COUNCIL_DISTRICTS = [0, 1, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14];
const PAGE_SIZE = 12;

export default function PermitsPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState(0);
  const [minVal, setMinVal] = useState('');
  const [maxVal, setMaxVal] = useState('');
  const [sortField, setSortField] = useState<'issue_date' | 'valuation' | 'primary_address'>('issue_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...permits];
    if (typeFilter !== 'All') {
      result = result.filter((p) => p.permit_type === typeFilter);
    }
    if (districtFilter > 0) {
      result = result.filter((p) => p.council_district === districtFilter);
    }
    if (minVal) {
      result = result.filter((p) => p.valuation >= Number(minVal));
    }
    if (maxVal) {
      result = result.filter((p) => p.valuation <= Number(maxVal));
    }
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
    return result;
  }, [typeFilter, districtFilter, minVal, maxVal, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(1);
  }

  function exportCSV() {
    const header = 'Permit #,Address,Type,Sub Type,Issue Date,Valuation,Status,Zone,Council District,Community Plan Area,Contractor\n';
    const rows = filtered.map((p) =>
      `"${p.permit_nbr}","${p.primary_address}","${p.permit_type}","${p.permit_sub_type}","${p.issue_date}",${p.valuation},"${p.status_desc}","${p.zone}",${p.council_district},"${p.community_plan_area}","${p.contractor}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'la-permits-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const sortArrow = (field: typeof sortField) =>
    sortField === field ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : '';

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Left Panel */}
      <div className="w-full lg:w-2/5 flex flex-col border-r border-slate-200 bg-white">
        {/* Filter Panel */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal" />
              Permits Browser
            </h1>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Permit Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                {PERMIT_TYPES.map((t) => (
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
                {COUNCIL_DISTRICTS.filter((d) => d > 0).map((d) => (
                  <option key={d} value={d}>CD {d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Min Valuation</label>
              <input
                type="number"
                placeholder="$0"
                value={minVal}
                onChange={(e) => { setMinVal(e.target.value); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Max Valuation</label>
              <input
                type="number"
                placeholder="No max"
                value={maxVal}
                onChange={(e) => { setMaxVal(e.target.value); setPage(1); }}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">{filtered.length} permits found</p>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b border-slate-200">
              <tr>
                <th
                  className="text-left px-3 py-2 font-semibold text-slate-600 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('primary_address')}
                >
                  Address{sortArrow('primary_address')}
                </th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600">Type</th>
                <th
                  className="text-left px-3 py-2 font-semibold text-slate-600 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('issue_date')}
                >
                  Date{sortArrow('issue_date')}
                </th>
                <th
                  className="text-right px-3 py-2 font-semibold text-slate-600 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('valuation')}
                >
                  Valuation{sortArrow('valuation')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((permit) => (
                <tr key={permit.permit_nbr} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/property/${encodeURIComponent(permit.primary_address)}`}
                      className="text-teal hover:underline font-medium text-xs"
                    >
                      {permit.primary_address}
                    </Link>
                    <p className="text-[10px] text-slate-400 mt-0.5">{permit.permit_nbr}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {permit.permit_type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{permit.issue_date}</td>
                  <td className="px-3 py-2.5 text-right text-xs font-medium text-slate-700">
                    {permit.valuation.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </span>
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
        <DynamicPermitMap permits={filtered} />
      </div>
    </div>
  );
}
