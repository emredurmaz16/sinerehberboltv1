interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="space-y-3 animate-fade-up">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">{title}</h1>
      {description && <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">{description}</p>}
    </header>
  );
}
