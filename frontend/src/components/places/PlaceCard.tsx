import Link from 'next/link';
import { FileText } from 'lucide-react';
import type { Place } from '@/lib/mock-data';

interface PlaceCardProps {
  place: Place;
}

const typeColors: Record<string, string> = {
  council_district: 'bg-indigo-50 text-indigo-700',
  community_plan_area: 'bg-teal-50 text-teal-700',
};

function getTypeBadgeStyle(placeType: string): string {
  return typeColors[placeType.toLowerCase()] ?? 'bg-gray-100 text-gray-700';
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${place.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {place.name}
        </h3>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeStyle(place.type)}`}
        >
          {place.type}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <FileText className="h-3.5 w-3.5" />
        <span>
          {place.permit_count} {place.permit_count === 1 ? 'permit' : 'permits'}
        </span>
      </div>
    </Link>
  );
}
