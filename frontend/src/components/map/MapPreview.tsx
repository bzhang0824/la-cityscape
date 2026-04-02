'use client';

import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockPermits } from '@/lib/mock-data';

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

const previewPermits = mockPermits.slice(0, 30);

interface MapPreviewProps {
  className?: string;
}

export default function MapPreview({ className = '' }: MapPreviewProps) {
  return (
    <MapContainer
      center={LA_CENTER}
      zoom={DEFAULT_ZOOM}
      className={className}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

      {previewPermits.map((permit) => {
        const color = PERMIT_TYPE_COLORS[permit.permit_type] ?? DEFAULT_COLOR;

        return (
          <CircleMarker
            key={permit.id}
            center={[permit.lat, permit.lon]}
            radius={5}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.75,
              weight: 1,
            }}
          />
        );
      })}
    </MapContainer>
  );
}
