import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold text-parchment-green">Silmarillion</h1>
      <p className="mb-6 mt-2 text-sm text-parchment-ink/80">Sign in to view projects, teams, and staffing alignment.</p>
      <LoginForm />
    </div>
  );
}
