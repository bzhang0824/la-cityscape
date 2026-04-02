'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import type { PlanningCase } from '@/lib/mock-data';

interface PlanningTableProps {
  cases: PlanningCase[];
}

type SortField = 'case_number' | 'address' | 'case_type' | 'filing_date' | 'project_description' | 'status';
type SortDirection = 'asc' | 'desc';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '...';
}

function getStatus(planningCase: PlanningCase): 'On Hold' | 'Completed' | 'Active' {
  if (planningCase.on_hold) return 'On Hold';
  if (planningCase.completed) return 'Completed';
  return 'Active';
}

function getStatusValue(planningCase: PlanningCase): number {
  if (planningCase.on_hold) return 1;
  if (planningCase.completed) return 2;
  return 0;
}

const statusStyles: Record<string, string> = {
  'On Hold': 'bg-yellow-50 text-yellow-700',
  'Completed': 'bg-green-50 text-green-700',
  'Active': 'bg-blue-50 text-blue-700',
};

const columns: { key: SortField; label: string }[] = [
  { key: 'case_number', label: 'Case Number' },
  { key: 'address', label: 'Address' },
  { key: 'case_type', label: 'Type' },
  { key: 'filing_date', label: 'Filing Date' },
  { key: 'project_description', label: 'Description' },
  { key: 'status', label: 'Status' },
];

export default function PlanningTable({ cases }: PlanningTableProps) {
  const [sortField, setSortField] = useState<SortField>('filing_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const sorted = [...cases].sort((a, b) => {
    let cmp: number;

    if (sortField === 'status') {
      cmp = getStatusValue(a) - getStatusValue(b);
    } else {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
    }

    return sortDirection === 'asc' ? cmp : -cmp;
  });

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ArrowUpDown className="inline-block ml-1 h-3.5 w-3.5 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="inline-block ml-1 h-3.5 w-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="inline-block ml-1 h-3.5 w-3.5 text-blue-600" />
    );
  }

  if (cases.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-gray-500">
        No planning cases found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                <SortIcon field={col.key} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((planningCase, idx) => {
            const status = getStatus(planningCase);
            return (
              <tr
                key={planningCase.id}
                className={`border-b border-gray-100 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } hover:bg-blue-50/60`}
              >
                <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href={planningCase.pdis_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {planningCase.case_number}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {planningCase.address}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {planningCase.case_type}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {formatDate(planningCase.filing_date)}
                </td>
                <td className="max-w-xs px-4 py-2 text-gray-700" title={planningCase.project_description}>
                  {truncate(planningCase.project_description, 80)}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
