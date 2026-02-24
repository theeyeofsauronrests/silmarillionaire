import { clsx } from "clsx";

export type DirectoryFilter = "projects" | "teams" | "people";

type FilterTabsProps = {
  active: DirectoryFilter;
  onChange: (filter: DirectoryFilter) => void;
};

const FILTER_LABELS: Array<{ key: DirectoryFilter; label: string }> = [
  { key: "projects", label: "Projects" },
  { key: "teams", label: "Teams" },
  { key: "people", label: "People" }
];

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_LABELS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onChange(filter.key)}
          className={clsx(
            "rounded border px-3 py-1.5 text-sm font-semibold transition",
            active === filter.key
              ? "border-parchment-green bg-parchment-green text-parchment-base"
              : "border-parchment-border bg-parchment-base text-parchment-ink hover:bg-parchment-border/15"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
