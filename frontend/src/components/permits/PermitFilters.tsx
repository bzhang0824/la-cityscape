'use client';

import { X } from 'lucide-react';
import { PERMIT_TYPES, COMMUNITY_PLAN_AREAS } from '@/lib/mock-data';

export interface PermitFilterValues {
  permitType: string;
  dateFrom: string;
  dateTo: string;
  councilDistrict: string;
  communityPlanArea: string;
  zone: string;
  minVal: string;
  maxVal: string;
}

interface PermitFiltersProps {
  filters: PermitFilterValues;
  onFilterChange: (filters: PermitFilterValues) => void;
}

const COUNCIL_DISTRICTS = Array.from({ length: 15 }, (_, i) => `CD ${i + 1}`);

const emptyFilters: PermitFilterValues = {
  permitType: '',
  dateFrom: '',
  dateTo: '',
  councilDistrict: '',
  communityPlanArea: '',
  zone: '',
  minVal: '',
  maxVal: '',
};

export default function PermitFilters({ filters, onFilterChange }: PermitFiltersProps) {
  function update(field: keyof PermitFilterValues, value: string) {
    onFilterChange({ ...filters, [field]: value });
  }

  function clearFilters() {
    onFilterChange(emptyFilters);
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-3 w-3" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Permit Type */}
      <div>
        <label htmlFor="filter-permit-type" className="block text-xs font-medium text-gray-600 mb-1">
          Permit Type
        </label>
        <select
          id="filter-permit-type"
          value={filters.permitType}
          onChange={(e) => update('permitType', e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {PERMIT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Council District */}
      <div>
        <label htmlFor="filter-council-district" className="block text-xs font-medium text-gray-600 mb-1">
          Council District
        </label>
        <select
          id="filter-council-district"
          value={filters.councilDistrict}
          onChange={(e) => update('councilDistrict', e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Districts</option>
          {COUNCIL_DISTRICTS.map((cd) => (
            <option key={cd} value={cd}>
              {cd}
            </option>
          ))}
        </select>
      </div>

      {/* Community Plan Area */}
      <div>
        <label htmlFor="filter-community-plan" className="block text-xs font-medium text-gray-600 mb-1">
          Community Plan Area
        </label>
        <select
          id="filter-community-plan"
          value={filters.communityPlanArea}
          onChange={(e) => update('communityPlanArea', e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Areas</option>
          {COMMUNITY_PLAN_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update('dateFrom', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Date from"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => update('dateTo', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Date to"
          />
        </div>
      </div>

      {/* Zone */}
      <div>
        <label htmlFor="filter-zone" className="block text-xs font-medium text-gray-600 mb-1">
          Zone
        </label>
        <input
          id="filter-zone"
          type="text"
          placeholder="e.g. C4-2D"
          value={filters.zone}
          onChange={(e) => update('zone', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Valuation Range */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Valuation Range</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minVal}
            onChange={(e) => update('minVal', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Minimum valuation"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxVal}
            onChange={(e) => update('maxVal', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Maximum valuation"
          />
        </div>
      </div>
    </div>
  );
}
