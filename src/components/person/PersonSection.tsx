import type { ReactNode } from 'react';

interface PersonSectionProps {
  title: string;
  children: ReactNode;
}

export default function PersonSection({ title, children }: PersonSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="flex items-center gap-3 text-xl font-bold text-neutral-50 sm:text-2xl">
        <span className="h-6 w-1 rounded-full bg-amber-400" />
        {title}
      </h2>
      {children}
    </section>
  );
}
