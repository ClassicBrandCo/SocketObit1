import { useState } from "react";

export default function AuthView({ onAuthenticated, error, clearError }) {
  const [mode, setMode] = useState("signIn");
  const [form, setForm] = useState({ email: "", password: "", orgName: "" });

  const submit = async (event) => {
    event.preventDefault();
    await onAuthenticated(mode === "signUp" ? { ...form, mode } : { email: form.email, password: form.password, mode });
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>SocketObit</h1>
        <p className="muted">Sign in to your workspace.</p>
        <div className="segmented">
          <button type="button" className={`btn small ${mode === "signIn" ? "primary" : ""}`} onClick={() => setMode("signIn")}>Sign in</button>
          <button type="button" className={`btn small ${mode === "signUp" ? "primary" : ""}`} onClick={() => setMode("signUp")}>Sign up</button>
        </div>
        {error ? <div className="toast error" onClick={clearError}>{error.message}</div> : null}
        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field"><span>Email</span><input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label className="auth-field"><span>Password</span><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {mode === "signUp" ? <label className="auth-field"><span>Organization name</span><input value={form.orgName} onChange={(event) => setForm({ ...form, orgName: event.target.value })} /></label> : null}
          <button type="submit" className="btn primary">{mode === "signUp" ? "Create account" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
