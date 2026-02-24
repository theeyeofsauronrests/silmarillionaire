import { PageHeader } from "@/components/layout/page-header";

export default function HomePage() {
  return (
    <section>
      <PageHeader
        title="Directory"
        description="Milestone 1 scaffold is active. Directory search/cards arrive in Milestone 3."
      />
      <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm">
        Authenticated routing and Supabase-backed login are configured.
      </p>
    </section>
  );
}
