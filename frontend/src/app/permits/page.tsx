"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Building2, Download, Filter, X, ChevronUp, ChevronDown } from "lucide-react";
import {
  mockPermits,
  PERMIT_TYPES,
  COUNCIL_DISTRICTS,
  COMMUNITY_PLAN_AREAS,
  type Permit,
} from "@/lib/mock-data";

const PermitMap = dynamic(() => import("@/components/map/PermitMap"), { ssr: false });

type SortKey = "primary_address" | "permit_type" | "issue_date" | "valuation" | "zone" | "status_desc";
type SortDir = "asc" | "desc";

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toLocaleString()}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PermitsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [permitType, setPermitType] = useState("");
  const [councilDistrict, setCouncilDistrict] = useState("");
  const [communityPlanArea, setCommunityPlanArea] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("issue_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedPermit, setSelectedPermit] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = [...mockPermits];
    if (permitType) result = result.filter((p) => p.permit_type === permitType);
    if (councilDistrict) result = result.filter((p) => p.council_district === councilDistrict);
    if (communityPlanArea) result = result.filter((p) => p.community_plan_area === communityPlanArea);
    if (dateFrom) result = result.filter((p) => p.issue_date >= dateFrom);
    if (dateTo) result = result.filter((p) => p.issue_date <= dateTo);
    if (minVal) result = result.filter((p) => p.valuation >= Number(minVal));
    if (maxVal) result = result.filter((p) => p.valuation <= Number(maxVal));

    result.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return result;
  }, [permitType, councilDistrict, communityPlanArea, dateFrom, dateTo, minVal, maxVal, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 text-slate-300" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-teal" /> : <ChevronDown className="h-3 w-3 text-teal" />;
  }

  function clearFilters() {
    setPermitType("");
    setCouncilDistrict("");
    setCommunityPlanArea("");
    setDateFrom("");
    setDateTo("");
    setMinVal("");
    setMaxVal("");
  }

  function exportCSV() {
    const headers = ["Address", "Type", "Sub Type", "Issue Date", "Valuation", "Zone", "Status", "Council District", "Community Plan Area"];
    const rows = filtered.map((p) => [p.primary_address, p.permit_type, p.permit_sub_type, p.issue_date, p.valuation, p.zone, p.status_desc, p.council_district, p.community_plan_area]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "la-permits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-navy text-white px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal" />
            <span className="font-bold">LA Cityscape</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm ml-4">
            <Link href="/permits" className="text-teal font-medium">Permits</Link>
            <Link href="/planning" className="hover:text-teal transition-colors">Planning</Link>
            <Link href="/places" className="hover:text-teal transition-colors">Places</Link>
            <Link href="/pricing" className="hover:text-teal transition-colors">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-300">{filtered.length} permits</span>
          <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-1.5 bg-navy-light rounded hover:bg-slate-700 transition-colors">
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-[45%] flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border-b border-slate-200 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <select value={permitType} onChange={(e) => setPermitType(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm">
                  <option value="">All Types</option>
                  {PERMIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={councilDistrict} onChange={(e) => setCouncilDistrict(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm">
                  <option value="">All Districts</option>
                  {COUNCIL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={communityPlanArea} onChange={(e) => setCommunityPlanArea(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm col-span-2">
                  <option value="">All Community Plan Areas</option>
                  {COMMUNITY_PLAN_AREAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From" className="border border-slate-300 rounded px-2 py-1.5 text-sm" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To" className="border border-slate-300 rounded px-2 py-1.5 text-sm" />
                <input type="number" value={minVal} onChange={(e) => setMinVal(e.target.value)} placeholder="Min valuation" className="border border-slate-300 rounded px-2 py-1.5 text-sm" />
                <input type="number" value={maxVal} onChange={(e) => setMaxVal(e.target.value)} placeholder="Max valuation" className="border border-slate-300 rounded px-2 py-1.5 text-sm" />
              </div>
              <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1">
                <X className="h-3 w-3" /> Clear filters
              </button>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  {([
                    ["primary_address", "Address"],
                    ["permit_type", "Type"],
                    ["issue_date", "Date"],
                    ["valuation", "Value"],
                    ["zone", "Zone"],
                    ["status_desc", "Status"],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="px-3 py-2 text-left font-medium text-slate-600 cursor-pointer hover:text-navy whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1">
                        {label} <SortIcon col={key} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${
                      selectedPermit === p.id ? "bg-teal/5" : i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } hover:bg-teal/10`}
                    onClick={() => setSelectedPermit(p.id)}
                  >
                    <td className="px-3 py-2 font-medium text-navy max-w-[180px] truncate">{p.primary_address}</td>
                    <td className="px-3 py-2 text-slate-600">{p.permit_type}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{formatDate(p.issue_date)}</td>
                    <td className="px-3 py-2 text-slate-700 font-medium">{formatCurrency(p.valuation)}</td>
                    <td className="px-3 py-2 text-slate-500">{p.zone}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status_desc === "Issued" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {p.status_desc}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-12 text-center text-slate-400">No permits match your filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="hidden lg:block flex-1">
          <PermitMap permits={filtered} selectedPermit={selectedPermit} />
        </div>
      </div>
    </div>
  );
}
