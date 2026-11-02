export interface LogoTabOption<T extends string | number> {
  value: T;
  label: string;
  logo: string | null;
  fallbackDotClassName?: string;
}

interface LogoTabsProps<T extends string | number> {
  label: string;
  options: LogoTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function LogoTabs<T extends string | number>({ label, options, value, onChange }: LogoTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="scrollbar-hide flex gap-6 overflow-x-auto border-b border-white/10">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`relative flex shrink-0 items-center gap-2.5 pb-3 text-sm font-semibold transition ${
              active ? 'text-amber-300' : 'text-neutral-400 hover:text-neutral-100'
            }`}
          >
            {option.logo && <img src={option.logo} alt="" className="h-5 w-5 rounded object-contain" />}
            {!option.logo && option.fallbackDotClassName && (
              <span className={`h-2.5 w-2.5 rounded-full ${option.fallbackDotClassName}`} />
            )}
            {option.label}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-amber-400" />}
          </button>
        );
      })}
    </div>
  );
}
