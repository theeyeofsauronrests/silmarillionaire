type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6 border-b border-parchment-border/70 pb-4">
      <h1 className="text-3xl font-semibold text-parchment-green">{title}</h1>
      {description ? <p className="mt-2 text-sm text-parchment-ink/80">{description}</p> : null}
    </header>
  );
}
