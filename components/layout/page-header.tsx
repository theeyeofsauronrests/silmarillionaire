type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6 border-b border-parchment-border/70 pb-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-parchment-green" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-parchment-gold" />
      </div>
      <h1 className="text-3xl font-semibold text-parchment-green">{title}</h1>
      {description ? <p className="mt-2 text-sm text-parchment-ink/80">{description}</p> : null}
    </header>
  );
}
