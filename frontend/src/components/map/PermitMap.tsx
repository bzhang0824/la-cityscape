'use client';

import { useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import type { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Permit } from '@/lib/mock-data';

const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

const LA_CENTER: [number, number] = [34.0522, -118.2437];
const DEFAULT_ZOOM = 11;

const PERMIT_TYPE_COLORS: Record<string, string> = {
  Building: '#0EA5E9',
  Electrical: '#F59E0B',
  Mechanical: '#8B5CF6',
  Plumbing: '#10B981',
  Grading: '#F97316',
  Demolition: '#EF4444',
};

const DEFAULT_COLOR = '#6B7280';

function getPermitColor(type: string): string {
  return PERMIT_TYPE_COLORS[type] ?? DEFAULT_COLOR;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

interface BoundsListenerProps {
  onBoundsChange: (bounds: LatLngBounds) => void;
}

function BoundsListener({ onBoundsChange }: BoundsListenerProps) {
  useMapEvents({
    moveend(e) {
      onBoundsChange(e.target.getBounds());
    },
    zoomend(e) {
      onBoundsChange(e.target.getBounds());
    },
  });
  return null;
}

interface PermitMapProps {
  permits: Permit[];
  onBoundsChange?: (bounds: LatLngBounds) => void;
  selectedPermit?: number | null;
  className?: string;
}

export default function PermitMap({
  permits,
  onBoundsChange,
  selectedPermit,
  className = '',
}: PermitMapProps) {
  const handleBoundsChange = useCallback(
    (bounds: LatLngBounds) => {
      onBoundsChange?.(bounds);
    },
    [onBoundsChange],
  );

  return (
    <MapContainer
      center={LA_CENTER}
      zoom={DEFAULT_ZOOM}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

      {onBoundsChange && (
        <BoundsListener onBoundsChange={handleBoundsChange} />
      )}

      {permits.map((permit) => {
        const isSelected = selectedPermit === permit.id;
        const color = getPermitColor(permit.permit_type);

        return (
          <CircleMarker
            key={permit.id}
            center={[permit.lat, permit.lon]}
            radius={isSelected ? 10 : 6}
            pathOptions={{
              color: isSelected ? '#FFFFFF' : color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: isSelected ? 2 : 1,
            }}
          >
            <Popup>
              <div className="text-sm leading-relaxed">
                <p className="font-semibold text-slate-900">
                  {permit.primary_address}
                </p>
                <p className="text-slate-600">
                  Type:{' '}
                  <span
                    className="font-medium"
                    style={{ color }}
                  >
                    {permit.permit_type}
                  </span>
                </p>
                <p className="text-slate-600">
                  Valuation:{' '}
                  <span className="font-medium">
                    {formatCurrency(permit.valuation)}
                  </span>
                </p>
                <p className="text-slate-600">
                  Issued: {permit.issue_date}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
