"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Building2, ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { mockPlanningCases, CASE_TYPES, COUNCIL_DISTRICTS, type PlanningCase } from "@/lib/mock-data";

const PlanningMap = dynamic(() => import("@/components/map/PlanningMap"), { ssr: false });

type SortKey = "case_number" | "address" | "case_type" | "filing_date" | "project_description";
type SortDir = "asc" | "desc";

export default function PlanningPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [caseType, setCaseType] = useState("");
  const [councilDistrict, setCouncilDistrict] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("filing_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = [...mockPlanningCases];
    if (caseType) result = result.filter((c) => c.case_type === caseType);
    if (councilDistrict) result = result.filter((c) => c.council_district === councilDistrict);
    if (dateFrom) result = result.filter((c) => c.filing_date >= dateFrom);
    if (dateTo) result = result.filter((c) => c.filing_date <= dateTo);
    result.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return result;
  }, [caseType, councilDistrict, dateFrom, dateTo, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 text-slate-300" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-teal" /> : <ChevronDown className="h-3 w-3 text-teal" />;
  }

  function StatusBadge({ c }: { c: PlanningCase }) {
    if (c.completed) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>;
    if (c.on_hold) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">On Hold</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Active</span>;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-navy text-white px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal" />
            <span className="font-bold">LA Cityscape</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm ml-4">
            <Link href="/permits" className="hover:text-teal transition-colors">Permits</Link>
            <Link href="/planning" className="text-teal font-medium">Planning</Link>
            <Link href="/places" className="hover:text-teal transition-colors">Places</Link>
            <Link href="/pricing" className="hover:text-teal transition-colors">Pricing</Link>
          </nav>
        </div>
        <span className="text-slate-300 text-sm">{filtered.length} planning cases</span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full lg:w-[45%] flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border-b border-slate-200 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" /> Filters
            {showFilters ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
          </button>

          {showFilters && (
            <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <select value={caseType} onChange={(e) => setCaseType(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm">
                  <option value="">All Case Types</option>
                  {CASE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={councilDistrict} onChange={(e) => setCouncilDistrict(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm">
                  <option value="">All Districts</option>
                  {COUNCIL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm" />
              </div>
              <button onClick={() => { setCaseType(""); setCouncilDistrict(""); setDateFrom(""); setDateTo(""); }} className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1">
                <X className="h-3 w-3" /> Clear filters
              </button>
            </div>
          )}

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  {([
                    ["case_number", "Case #"],
                    ["address", "Address"],
                    ["case_type", "Type"],
                    ["filing_date", "Filed"],
                    ["project_description", "Description"],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="px-3 py-2 text-left font-medium text-slate-600 cursor-pointer hover:text-navy whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1">{label} <SortIcon col={key} /></span>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-teal/10`}>
                    <td className="px-3 py-2">
                      <a href={c.pdis_url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline font-medium">
                        {c.case_number}
                      </a>
                    </td>
                    <td className="px-3 py-2 text-navy max-w-[150px] truncate">{c.address}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-xs font-medium">{c.case_type}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">
                      {new Date(c.filing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-3 py-2 text-slate-500 max-w-[200px] truncate">{c.project_description}</td>
                    <td className="px-3 py-2"><StatusBadge c={c} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-12 text-center text-slate-400">No planning cases match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="hidden lg:block flex-1">
          <PlanningMap cases={filtered} />
        </div>
      </div>
    </div>
  );
}
