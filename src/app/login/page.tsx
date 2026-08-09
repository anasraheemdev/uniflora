import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { getSession } from "@/lib/auth";
import { DEMO_ACCOUNTS, ROLE_DESCRIPTIONS, ROLE_LABELS, roleDashboardPath } from "@/types/auth";
import type { UserRole } from "@/types/auth";
import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) redirect(roleDashboardPath(session.role));

  const { error } = await searchParams;

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100vh" }}>
      <Header active={null} sticky={false} />

      <div className="uf-page-pad uf-split-login" style={{ maxWidth: 960, margin: "0 auto", paddingTop: 48, paddingBottom: 64 }}>
        <div className="uf-login-demo">
          <h1 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 36, margin: "0 0 12px" }}>Sign in to UniFlora</h1>
          <p style={{ fontSize: 16, color: "#6b7360", lineHeight: 1.6, margin: "0 0 28px" }}>
            Multi-role access for administrators, contributors, and students. Use the demo credentials for each role.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(["admin", "contributor", "student"] as UserRole[]).map((role) => {
              const account = DEMO_ACCOUNTS.find((a) => a.role === role)!;
              return (
                <div key={role} style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#2e6b3a" }}>{ROLE_LABELS[role]}</div>
                  <div style={{ fontSize: 13, color: "#6b7360", marginTop: 4 }}>{ROLE_DESCRIPTIONS[role]}</div>
                  <div style={{ fontSize: 12.5, color: "#8a9682", marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
                    {account.email} / {account.password}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="uf-login-form-wrap" style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: "clamp(24px, 5vw, 36px)", boxShadow: "0 12px 32px rgba(20,50,28,.08)" }}>
          <LoginForm action={loginAction} error={error} />

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "#8a9682" }}>
            <Link href="/" className="uf-tap" style={{ color: "#2e6b3a", fontWeight: 600, textDecoration: "none" }}>← Back to UniFlora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
