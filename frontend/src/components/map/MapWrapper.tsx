import dynamic from 'next/dynamic';

export const DynamicPermitMap = dynamic(
  () => import('./PermitMap'),
  { ssr: false, loading: () => <div className="h-full w-full bg-slate-800 animate-pulse" /> }
);

export const DynamicPlanningMap = dynamic(
  () => import('./PlanningMap'),
  { ssr: false, loading: () => <div className="h-full w-full bg-slate-800 animate-pulse" /> }
);
