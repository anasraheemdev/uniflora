"use client";

import { color } from "@/lib/theme";

type LoginFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
};

const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: color.inkSoft };
const inputStyle: React.CSSProperties = { width: "100%", border: `1px solid ${color.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", color: color.ink };

export function LoginForm({ action, error }: LoginFormProps) {
  return (
    <form action={action}>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Role</label>
        <select name="role" required defaultValue="student" style={{ ...inputStyle, background: color.parchmentDeep }}>
          <option value="admin">Administrator</option>
          <option value="contributor">Contributor</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Email</label>
        <input name="email" type="email" required placeholder="student@uniflora.edu" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Password</label>
        <input name="password" type="password" required placeholder="••••••••" style={inputStyle} />
      </div>

      {error && (
        <div style={{ background: color.dangerBg, border: "1px solid #e8b4b4", color: color.danger, padding: "11px 14px", borderRadius: 10, fontSize: 14, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <button type="submit" className="uf-login uf-btn-primary" style={{ width: "100%", border: "none", padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        Sign In
      </button>
    </form>
  );
}
