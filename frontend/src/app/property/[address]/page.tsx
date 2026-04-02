import { permits } from '@/lib/mock-data';
import PropertyClient from './PropertyClient';

export function generateStaticParams() {
  const uniqueAddresses = [...new Set(permits.map((p) => p.primary_address))];
  return uniqueAddresses.map((address) => ({ address: encodeURIComponent(address) }));
}

export default function PropertyPage({ params }: { params: Promise<{ address: string }> }) {
  return <PropertyClient params={params} />;
}
