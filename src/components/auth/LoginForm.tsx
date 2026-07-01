"use client";

type LoginFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
};

export function LoginForm({ action, error }: LoginFormProps) {
  return (
    <form action={action}>
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#3f4a3a" }}>Role</label>
        <select name="role" required defaultValue="student" style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "11px 14px", fontSize: 15, fontFamily: "inherit", background: "#fbf9f1", color: "#1e2b1f" }}>
          <option value="admin">Administrator</option>
          <option value="contributor">Contributor</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#3f4a3a" }}>Email</label>
        <input name="email" type="email" required placeholder="student@uniflora.edu" style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "11px 14px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#3f4a3a" }}>Password</label>
        <input name="password" type="password" required placeholder="••••••••" style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "11px 14px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      {error && (
        <div style={{ background: "#fce8e8", border: "1px solid #e8b4b4", color: "#8b2e2e", padding: "10px 14px", borderRadius: 10, fontSize: 14, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <button type="submit" className="uf-login" style={{ width: "100%", background: "#2e6b3a", color: "#fff", border: "none", padding: 13, borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        Sign In
      </button>
    </form>
  );
}
