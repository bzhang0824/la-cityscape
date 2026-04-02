'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Building2, FileText, ArrowLeft } from 'lucide-react';
import { DynamicPermitMap } from '@/components/map/MapWrapper';
import { permits, planningCases } from '@/lib/mock-data';

interface Props {
  params: Promise<{ address: string }>;
}

export default function PropertyPage({ params }: Props) {
  const { address } = use(params);
  const decodedAddress = decodeURIComponent(address);

  const propertyPermits = useMemo(() =>
    permits.filter((p) => p.primary_address.toLowerCase() === decodedAddress.toLowerCase()),
    [decodedAddress]
  );

  const nearbyPermits = useMemo(() => {
    if (propertyPermits.length === 0) {
      const match = permits.find((p) =>
        p.primary_address.toLowerCase().includes(decodedAddress.toLowerCase().split(' ').slice(-2).join(' '))
      );
      return match ? permits.filter((p) =>
        Math.abs(p.lat - match.lat) < 0.01 && Math.abs(p.lon - match.lon) < 0.01
      ) : permits.slice(0, 5);
    }
    const ref = propertyPermits[0];
    return permits.filter((p) =>
      Math.abs(p.lat - ref.lat) < 0.01 && Math.abs(p.lon - ref.lon) < 0.01
    );
  }, [propertyPermits, decodedAddress]);

  const nearbyCases = useMemo(() => {
    const ref = propertyPermits[0] || nearbyPermits[0];
    if (!ref) return planningCases.slice(0, 3);
    return planningCases.filter((c) =>
      Math.abs(c.lat - ref.lat) < 0.015 && Math.abs(c.lon - ref.lon) < 0.015
    );
  }, [propertyPermits, nearbyPermits]);

  const property = propertyPermits[0] || nearbyPermits[0];
  const mapPermits = propertyPermits.length > 0 ? nearbyPermits : nearbyPermits;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/permits" className="text-sm text-teal hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Permits
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal" />
            {decodedAddress}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 h-80 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <DynamicPermitMap permits={mapPermits} />
          </div>

          {/* Property Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Property Info</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Address</dt>
                  <dd className="font-medium text-slate-900">{decodedAddress}</dd>
                </div>
                {property && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Zone</dt>
                      <dd className="font-medium text-slate-900">{property.zone}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Council District</dt>
                      <dd className="font-medium text-slate-900">CD {property.council_district}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Community Plan Area</dt>
                      <dd className="font-medium text-slate-900">{property.community_plan_area}</dd>
                    </div>
                  </>
                )}
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-sky-50 rounded-lg">
                  <p className="text-2xl font-bold text-teal">{propertyPermits.length}</p>
                  <p className="text-xs text-slate-500">Permits at Address</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{nearbyCases.length}</p>
                  <p className="text-xs text-slate-500">Nearby Planning Cases</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permit History */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-teal" />
            Permit History
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {propertyPermits.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No permits found at this exact address. Showing nearby activity below.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Permit #</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Sub Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Valuation</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyPermits.map((p) => (
                    <tr key={p.permit_nbr} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-teal">{p.permit_nbr}</td>
                      <td className="px-4 py-3">{p.permit_type}</td>
                      <td className="px-4 py-3 text-slate-500">{p.permit_sub_type}</td>
                      <td className="px-4 py-3 text-slate-500">{p.issue_date}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {p.valuation.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status_desc === 'Issued' ? 'bg-green-100 text-green-700' :
                          p.status_desc === 'Under Construction' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {p.status_desc}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Nearby Planning Cases */}
        {nearbyCases.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-purple-500" />
              Nearby Planning Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyCases.map((c) => (
                <div key={c.case_number} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-purple-600">{c.case_number}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">{c.case_type}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{c.address}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.project_description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    <span>Filed: {c.filing_date}</span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                      c.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      c.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
