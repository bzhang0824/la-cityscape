'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Permit {
  lat: number;
  lon: number;
  permit_nbr: string;
  primary_address: string;
  permit_type: string;
  valuation: number;
  status_desc: string;
}

interface PermitMapProps {
  permits: Permit[];
}

const PERMIT_TYPE_COLORS: Record<string, string> = {
  Building: '#3b82f6',    // blue
  Electrical: '#eab308',  // yellow
  Plumbing: '#22c55e',    // green
  Mechanical: '#f97316',  // orange
  Grading: '#ef4444',     // red
};

const DEFAULT_COLOR = '#a855f7'; // purple fallback

function getPermitColor(permitType: string): string {
  for (const [key, color] of Object.entries(PERMIT_TYPE_COLORS)) {
    if (permitType.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return DEFAULT_COLOR;
}

const LA_CENTER: [number, number] = [34.0522, -118.2437];

export default function PermitMap({ permits }: PermitMapProps) {
  return (
    <MapContainer
      center={LA_CENTER}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />
      {permits.map((permit) => (
        <CircleMarker
          key={permit.permit_nbr}
          center={[permit.lat, permit.lon]}
          radius={6}
          pathOptions={{
            color: getPermitColor(permit.permit_type),
            fillColor: getPermitColor(permit.permit_type),
            fillOpacity: 0.8,
            weight: 1,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{permit.primary_address}</p>
              <p>
                <span className="font-medium">Type:</span> {permit.permit_type}
              </p>
              <p>
                <span className="font-medium">Permit #:</span> {permit.permit_nbr}
              </p>
              <p>
                <span className="font-medium">Valuation:</span>{' '}
                {permit.valuation.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}
              </p>
              <p>
                <span className="font-medium">Status:</span> {permit.status_desc}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
