"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { LOGO_IMAGE } from "@/lib/images";
import { color, font } from "@/lib/theme";

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

type HeaderProps = {
  active?: NavKey | null;
  sticky?: boolean;
  logoLink?: boolean;
};

/**
 * Which nav appears is decided in CSS, not JavaScript. Gating on a `matchMedia`
 * state meant the server always rendered the desktop nav and phones flashed it
 * before hydration swapped in the hamburger.
 */
export function Header({ active = null, sticky = true, logoLink = true }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const headerStyle: React.CSSProperties = {
    background: color.forest950,
    color: color.onDark,
    borderBottom: "1px solid rgba(255,255,255,.06)",
    ...(sticky ? { position: "sticky", top: 0, zIndex: 50 } : {}),
  };

  const LogoContent = (
    <>
      <div style={{ width: 42, height: 42, position: "relative", flex: "0 0 auto" }}>
        <Image src={LOGO_IMAGE} alt="UniFlora" fill sizes="42px" style={{ objectFit: "contain" }} priority />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: font.display, fontSize: 22, fontWeight: 600, color: "#ffffff", letterSpacing: 0.2 }}>
          UniFlora
        </div>
        <div
          className="uf-logo-tagline"
          style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 2.6, color: color.onDarkGold, marginTop: 4 }}
        >
          EXPLORE · LEARN · CONSERVE
        </div>
      </div>
    </>
  );

  return (
    <header style={headerStyle}>
      <div className="uf-header-bar">
        {logoLink ? (
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", minWidth: 0, flexShrink: 1 }}>
            {LogoContent}
          </Link>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flexShrink: 1 }}>{LogoContent}</div>
        )}

        <nav className="uf-nav uf-nav-desktop">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <Link
                key={item.key}
                className="uf-navlink"
                href={item.href}
                style={{
                  fontFamily: font.body,
                  color: isActive ? "#ffffff" : color.onDarkMuted,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  padding: "4px 0",
                  ...(isActive ? { borderBottom: `2px solid ${color.gold600}` } : {}),
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="uf-header-actions">
          <button
            type="button"
            className="uf-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
          </button>

          <button
            type="button"
            className="uf-header-icon"
            style={{ background: "none", border: "none", color: color.onDarkMuted, cursor: "pointer", padding: 6 }}
            aria-label="Search"
          >
            <SearchIcon size={21} strokeWidth={1.8} />
          </button>
          {active === "home" && (
            <button
              type="button"
              className="uf-header-icon"
              style={{ background: "none", border: "none", color: color.onDarkMuted, cursor: "pointer", padding: 6 }}
              aria-label="Upload"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M17 8l-5-5-5 5" />
                <path d="M12 3v12" />
              </svg>
            </button>
          )}

          <Link
            className="uf-login uf-btn-primary"
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "none",
              borderRadius: 9,
              fontFamily: font.body,
              fontSize: 14.5,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
            </svg>
            <span className="uf-login-label">Login</span>
          </Link>
        </div>
      </div>

      <div className={`uf-mobile-drawer${menuOpen ? " uf-open" : ""}`} aria-hidden={!menuOpen}>
        <button
          type="button"
          className="uf-mobile-backdrop"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          style={{ border: "none", cursor: "pointer", padding: 0 }}
        />
        <div className="uf-mobile-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <span style={{ fontFamily: font.display, fontWeight: 600, color: "#fff", fontSize: 18 }}>Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close"
              tabIndex={menuOpen ? 0 : -1}
              style={{ background: "none", border: "none", color: color.onDarkMuted, cursor: "pointer", padding: 8, display: "flex" }}
            >
              <CloseIcon size={22} />
            </button>
          </div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`uf-mobile-navlink${active === item.key ? " uf-active" : ""}`}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: font.body }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="uf-login uf-btn-primary"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "14px 20px",
              borderRadius: 10,
              fontFamily: font.body,
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
    </header>
  );
}
