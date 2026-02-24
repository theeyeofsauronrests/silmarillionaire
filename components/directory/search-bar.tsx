type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-parchment-green">Search</span>
      <input
        className="w-full rounded border border-parchment-border bg-white/75 px-3 py-2 text-sm"
        placeholder="Search projects, teams, or people"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
      />
    </label>
  );
}
