import { places } from '@/lib/mock-data';
import PlaceDetailClient from './PlaceDetailClient';

export function generateStaticParams() {
  return places.map((place) => ({ slug: place.slug }));
}

export default function PlaceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <PlaceDetailClient params={params} />;
}
