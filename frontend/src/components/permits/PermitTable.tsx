'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Permit } from '@/lib/mock-data';

interface PermitTableProps {
  permits: Permit[];
}

type SortField = 'primary_address' | 'permit_type' | 'issue_date' | 'valuation' | 'zone' | 'status_desc';
type SortDirection = 'asc' | 'desc';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

const columns: { key: SortField; label: string }[] = [
  { key: 'primary_address', label: 'Address' },
  { key: 'permit_type', label: 'Type' },
  { key: 'issue_date', label: 'Issue Date' },
  { key: 'valuation', label: 'Valuation' },
  { key: 'zone', label: 'Zone' },
  { key: 'status_desc', label: 'Status' },
];

export default function PermitTable({ permits }: PermitTableProps) {
  const [sortField, setSortField] = useState<SortField>('issue_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const sorted = [...permits].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    let cmp: number;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal));
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

  if (permits.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-gray-500">
        No permits found
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
          {sorted.map((permit, idx) => (
            <tr
              key={permit.id}
              className={`border-b border-gray-100 transition-colors cursor-pointer ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              } ${highlightedRow === permit.id ? 'bg-blue-50' : ''} hover:bg-blue-50/60`}
              onClick={() =>
                setHighlightedRow((prev) => (prev === permit.id ? null : permit.id))
              }
            >
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {permit.primary_address}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {permit.permit_type}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {formatDate(permit.issue_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-right text-gray-700">
                {formatCurrency(permit.valuation)}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {permit.zone}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  {permit.status_desc}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
