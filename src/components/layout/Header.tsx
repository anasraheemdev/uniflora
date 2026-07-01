"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LeafIcon } from "@/components/icons";

export type NavKey =
  | "home"
  | "explore"
  | "families"
  | "map"
  | "collections"
  | "learn"
  | "about"
  | "contact";

const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "explore", label: "Explore Plants", href: "/explore" },
  { key: "families", label: "Families", href: "/families" },
  { key: "map", label: "Map", href: "/map" },
  { key: "collections", label: "Collections", href: "/collections" },
  { key: "learn", label: "Learn", href: "/learn" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

const MOBILE_BP = 1024;

type HeaderProps = {
  active?: NavKey | null;
  sticky?: boolean;
  logoLink?: boolean;
};

export function Header({ active = null, sticky = true, logoLink = true }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const headerStyle: React.CSSProperties = {
    background: "#0e2a17",
    color: "#dfe9dc",
    ...(sticky ? { position: "sticky", top: 0, zIndex: 50 } : {}),
  };

  const LogoContent = (
    <>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "linear-gradient(160deg,#4f8f43,#2e6b3a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <LeafIcon />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: 23, fontWeight: 700, color: "#ffffff", letterSpacing: 0.2 }}>UniFlora</div>
        <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 2.4, color: "#8fb890", marginTop: 4 }}>EXPLORE · LEARN · CONSERVE</div>
      </div>
    </>
  );

  return (
    <header style={headerStyle}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "14px clamp(16px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {logoLink ? (
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", minWidth: 0, flexShrink: 1 }}>
            {LogoContent}
          </Link>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flexShrink: 1 }}>{LogoContent}</div>
        )}

        {!isMobile && (
          <nav className="uf-nav" style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 15, fontWeight: 500 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.key;
              return (
                <Link
                  key={item.key}
                  className="uf-navlink"
                  href={item.href}
                  style={{
                    color: isActive ? "#ffffff" : "#c3d4bf",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    ...(isActive ? { paddingBottom: 4, borderBottom: "2px solid #7dbf6b" } : {}),
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {isMobile && (
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              style={{ background: "none", border: "none", color: "#c3d4bf", cursor: "pointer", padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}

          {!isMobile && (
            <>
              <button
                type="button"
                style={{ background: "none", border: "none", color: "#c3d4bf", cursor: "pointer", padding: 6, display: "flex" }}
                aria-label="Search"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
              {active === "home" && (
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "#c3d4bf", cursor: "pointer", padding: 6, display: "flex" }}
                  aria-label="Upload"
                >
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="M17 8l-5-5-5 5" />
                    <path d="M12 3v12" />
                  </svg>
                </button>
              )}
            </>
          )}

          <Link
            className="uf-login"
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#2e6b3a",
              color: "#fff",
              border: "none",
              padding: isMobile ? "10px 14px" : "10px 20px",
              borderRadius: 9,
              fontSize: 14.5,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
            </svg>
            {!isMobile && <span>Login</span>}
          </Link>
        </div>
      </div>

      {isMobile && menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(9, 26, 15, 0.55)", border: "none", cursor: "pointer", padding: 0 }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "min(320px, 88vw)",
              height: "100%",
              background: "#0e2a17",
              borderLeft: "1px solid rgba(255,255,255,.1)",
              padding: "20px clamp(16px, 4vw, 24px) 32px",
              overflowY: "auto",
              boxShadow: "-8px 0 32px rgba(0,0,0,.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, color: "#fff", fontSize: 17 }}>Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: "#c3d4bf", cursor: "pointer", padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px 0",
                    color: isActive ? "#fff" : "#c3d4bf",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="uf-login"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#2e6b3a",
                color: "#fff",
                padding: "13px 20px",
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: "none",
                marginTop: 24,
                fontSize: 15,
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
