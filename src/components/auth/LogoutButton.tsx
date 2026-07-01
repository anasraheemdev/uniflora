"use client";

type LogoutButtonProps = {
  action: () => void | Promise<void>;
};

export function LogoutButton({ action }: LogoutButtonProps) {
  return (
    <form action={action}>
      <button type="submit" className="uf-login" style={{ width: "100%", background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", padding: "10px 14px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        Sign Out
      </button>
    </form>
  );
}
