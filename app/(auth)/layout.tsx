import { PageTurnTransition } from "@/components/layout/page-turn-transition";

export default function AuthLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
      <section className="w-full rounded-lg border border-parchment-border bg-parchment-base/90 p-6 shadow-parchment sm:p-8">
        <PageTurnTransition>{children}</PageTurnTransition>
      </section>
    </main>
  );
}
