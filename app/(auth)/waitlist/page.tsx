import { WaitlistForm } from "@/components/auth/waitlist-form";

export default function WaitlistPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold text-parchment-green">Request Access</h1>
      <p className="mb-6 mt-2 text-sm text-parchment-ink/80">
        Submit your details to join the Silmarillion waitlist.
      </p>
      <WaitlistForm />
    </div>
  );
}
