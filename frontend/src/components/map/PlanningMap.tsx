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

interface PlanningCase {
  lat: number;
  lon: number;
  case_number: string;
  address: string;
  case_type: string;
  project_description: string;
}

interface PlanningMapProps {
  cases: PlanningCase[];
}

const PLANNING_COLOR = '#a855f7'; // purple

const LA_CENTER: [number, number] = [34.0522, -118.2437];

export default function PlanningMap({ cases }: PlanningMapProps) {
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
      {cases.map((planningCase) => (
        <CircleMarker
          key={planningCase.case_number}
          center={[planningCase.lat, planningCase.lon]}
          radius={6}
          pathOptions={{
            color: PLANNING_COLOR,
            fillColor: PLANNING_COLOR,
            fillOpacity: 0.8,
            weight: 1,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{planningCase.address}</p>
              <p>
                <span className="font-medium">Case #:</span>{' '}
                {planningCase.case_number}
              </p>
              <p>
                <span className="font-medium">Type:</span> {planningCase.case_type}
              </p>
              <p>
                <span className="font-medium">Description:</span>{' '}
                {planningCase.project_description}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
