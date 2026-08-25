import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { color, font } from "@/lib/theme";
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
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100vh" }}>
      <Header active={null} sticky={false} />

      <div className="uf-page-pad uf-split-login" style={{ maxWidth: 1000, margin: "0 auto", paddingTop: 56, paddingBottom: 72 }}>
        <div className="uf-login-demo">
          <SectionKicker>Multi-role access</SectionKicker>
          <h1 style={{ fontFamily: font.display, fontWeight: 600, fontSize: "clamp(30px, 4vw, 38px)", margin: "12px 0 12px" }}>Sign in to UniFlora</h1>
          <p style={{ fontSize: 16, color: color.muted, lineHeight: 1.6, margin: "0 0 28px" }}>
            Administrators, contributors, and students each get a purpose-built dashboard. Use the demo credentials
            below for each role.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(["admin", "contributor", "student"] as UserRole[]).map((role) => {
              const account = DEMO_ACCOUNTS.find((a) => a.role === role)!;
              return (
                <div key={role} style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, color: color.forest600 }}>{ROLE_LABELS[role]}</div>
                  <div style={{ fontSize: 13, color: color.muted, marginTop: 5 }}>{ROLE_DESCRIPTIONS[role]}</div>
                  <div style={{ fontSize: 12.5, color: color.faint, marginTop: 9, fontFamily: "ui-monospace, monospace", background: color.parchmentDeep, borderRadius: 6, padding: "6px 10px", display: "inline-block" }}>
                    {account.email} / {account.password}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="uf-login-form-wrap" style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 18, padding: "clamp(26px, 5vw, 38px)", boxShadow: "0 1px 2px rgba(20,40,25,.05), 0 20px 44px rgba(20,50,28,.1)" }}>
          <LoginForm action={loginAction} error={error} />

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: color.faint }}>
            <Link href="/" className="uf-tap" style={{ color: color.forest600, fontWeight: 600, textDecoration: "none" }}>← Back to UniFlora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
