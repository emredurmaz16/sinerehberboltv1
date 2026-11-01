import { AlertTriangle, Inbox } from 'lucide-react';

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
      <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
      <Inbox className="h-10 w-10 text-neutral-600" />
      <p className="text-sm text-neutral-400">{message}</p>
    </div>
  );
}

export function PosterSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse space-y-3">
          <div className="aspect-[2/3] rounded-xl bg-neutral-800/70" />
          <div className="h-3 w-3/4 rounded bg-neutral-800/70" />
          <div className="h-3 w-1/2 rounded bg-neutral-800/70" />
        </div>
      ))}
    </>
  );
}
