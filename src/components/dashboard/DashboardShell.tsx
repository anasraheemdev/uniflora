"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import {
  IconAnalytics,
  IconApprovals,
  IconContributions,
  IconIdentifications,
  IconLearning,
  IconMap,
  IconOverview,
  IconQrCode,
  IconReviewQueue,
  IconSpecies,
  IconSpecimens,
  IconSubmissions,
  IconUpload,
  IconUsers,
} from "@/components/dashboard/DashboardIcons";
import { RoleBadge } from "@/components/dashboard/DashboardUI";
import { MenuIcon } from "@/components/icons";
import { LOGO_IMAGE } from "@/lib/images";
import { color, font } from "@/lib/theme";
import type { SessionUser, UserRole } from "@/types/auth";
import { ROLE_LABELS } from "@/types/auth";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: <IconOverview /> },
    { label: "Species", href: "/dashboard/admin/species", icon: <IconSpecies /> },
    { label: "Users", href: "/dashboard/admin/users", icon: <IconUsers /> },
    { label: "Approvals", href: "/dashboard/admin/approvals", icon: <IconApprovals /> },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: <IconAnalytics /> },
    { label: "QR Codes", href: "/dashboard/admin/qr", icon: <IconQrCode /> },
  ],
  contributor: [
    { label: "Overview", href: "/dashboard/contributor", icon: <IconOverview /> },
    { label: "Review Queue", href: "/dashboard/contributor/reviews", icon: <IconReviewQueue /> },
    { label: "Specimens", href: "/dashboard/contributor/specimens", icon: <IconSpecimens /> },
    { label: "Identifications", href: "/dashboard/contributor/identify", icon: <IconIdentifications /> },
    { label: "My Contributions", href: "/dashboard/contributor/contributions", icon: <IconContributions /> },
  ],
  student: [
    { label: "Overview", href: "/dashboard/student", icon: <IconOverview /> },
    { label: "New Observation", href: "/dashboard/student/submit", icon: <IconUpload /> },
    { label: "My Submissions", href: "/dashboard/student/submissions", icon: <IconSubmissions /> },
    { label: "Learning", href: "/dashboard/student/learning", icon: <IconLearning /> },
    { label: "Campus Map", href: "/map", icon: <IconMap /> },
  ],
};

type DashboardShellProps = {
  user: SessionUser;
  title: string;
  subtitle?: string;
  activePath?: string;
  children: React.ReactNode;
};

export function DashboardShell({ user, title, subtitle, activePath, children }: DashboardShellProps) {
  const nav = NAV_BY_ROLE[user.role];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activePath]);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, position: "fixed", inset: 0, overflow: "hidden" }}>
      {isMobile && sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(8, 18, 12, 0.55)", border: "none", cursor: "pointer", zIndex: 15, padding: 0 }}
        />
      )}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 264,
          height: "100vh",
          background: color.forest950,
          color: color.onDark,
          display: "flex",
          flexDirection: "column",
          zIndex: 20,
          overflowY: "auto",
          transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.28s ease",
          boxShadow: isMobile && sidebarOpen ? "4px 0 24px rgba(0,0,0,.3)" : "none",
          borderRight: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div style={{ padding: "22px 20px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none", color: "inherit" }}>
            <div style={{ width: 40, height: 40, position: "relative", flex: "0 0 auto" }}>
              <Image src={LOGO_IMAGE} alt="UniFlora" fill sizes="40px" style={{ objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontFamily: font.display, fontSize: 18, fontWeight: 600, color: "#fff" }}>UniFlora</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.8, color: color.onDarkGold, marginTop: 3 }}>DASHBOARD</div>
            </div>
          </Link>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <RoleBadge role={user.role} />
          <div style={{ fontSize: 12, color: color.onDarkMuted, marginTop: 10 }}>{ROLE_LABELS[user.role]} Portal</div>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {nav.map((item) => {
            const isActive = activePath === item.href || (activePath === undefined && item.href === `/dashboard/${user.role}`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="uf-dashnav"
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 10,
                  marginBottom: 4,
                  textDecoration: "none",
                  fontSize: 14.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#fff" : color.onDarkMuted,
                  background: isActive ? "rgba(47,107,63,.5)" : "transparent",
                  borderLeft: isActive ? `3px solid ${color.gold600}` : "3px solid transparent",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, opacity: isActive ? 1 : 0.85 }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px 20px 24px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", minHeight: 40, fontSize: 13.5, color: color.onDarkMuted, textDecoration: "none", marginBottom: 6 }}
          >
            ← Back to public site
          </Link>
          <LogoutButton action={logoutAction} />
        </div>
      </aside>

      <div style={{ marginLeft: isMobile ? 0 : 264, height: "100vh", display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <header style={{ flexShrink: 0, background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`, color: "#fff", padding: isMobile ? "18px clamp(16px, 4vw, 24px)" : "22px 36px" }}>
          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: 20, width: "100%", flexWrap: isMobile ? "wrap" : "nowrap" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, minWidth: 0, flex: 1 }}>
              {isMobile && (
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setSidebarOpen(true)}
                  className="uf-btn-outline-dark"
                  style={{ padding: "8px 10px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <MenuIcon size={22} strokeWidth={2} />
                </button>
              )}
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontFamily: font.display, fontWeight: 600, fontSize: isMobile ? 22 : 28, margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
                {subtitle && <p style={{ margin: "6px 0 0", fontSize: 15, color: "rgba(255,255,255,.8)" }}>{subtitle}</p>}
              </div>
            </div>
            <div style={{ textAlign: isMobile ? "left" : "right", flexShrink: 0, ...(isMobile ? { width: "100%", paddingTop: 4, marginTop: 4, borderTop: "1px solid rgba(255,255,255,.12)" } : {}) }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
              <div style={{ fontSize: 13, color: color.onDarkMuted, marginTop: 2 }}>{user.email}</div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, minHeight: 0, padding: isMobile ? "20px clamp(16px, 4vw, 24px) 40px" : "28px 36px 48px", overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
