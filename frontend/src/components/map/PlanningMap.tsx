'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlanningCase } from '@/lib/mock-data';

const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

const LA_CENTER: [number, number] = [34.0522, -118.2437];
const DEFAULT_ZOOM = 11;

const CASE_TYPE_COLORS: Record<string, string> = {
  ENV: '#EF4444',
  CPC: '#0EA5E9',
  DIR: '#10B981',
  VTT: '#F59E0B',
  TT: '#8B5CF6',
  ZA: '#F97316',
  EAR: '#EC4899',
};

const DEFAULT_COLOR = '#6B7280';

function getCaseColor(caseType: string): string {
  return CASE_TYPE_COLORS[caseType] ?? DEFAULT_COLOR;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

interface PlanningMapProps {
  cases: PlanningCase[];
  className?: string;
}

export default function PlanningMap({ cases, className = '' }: PlanningMapProps) {
  return (
    <MapContainer
      center={LA_CENTER}
      zoom={DEFAULT_ZOOM}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

      {cases.map((planningCase) => {
        const color = getCaseColor(planningCase.case_type);

        return (
          <CircleMarker
            key={planningCase.id}
            center={[planningCase.lat, planningCase.lon]}
            radius={7}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm leading-relaxed">
                <p className="font-semibold text-slate-900">
                  {planningCase.case_number}
                </p>
                <p className="text-slate-600">{planningCase.address}</p>
                <p className="text-slate-600">
                  Type:{' '}
                  <span className="font-medium" style={{ color }}>
                    {planningCase.case_type}
                  </span>
                </p>
                <p className="text-slate-500 mt-1">
                  {truncate(planningCase.project_description, 100)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
