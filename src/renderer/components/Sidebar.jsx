const NAV = [
  { key: "profiles", label: "Profiles", permission: null },
  { key: "proxies", label: "Proxies", permission: null },
  { key: "users", label: "Users", permission: "users" },
  { key: "roles", label: "Roles", permission: "users" },
  { key: "settings", label: "Settings", permission: null },
];

export default function Sidebar({ active, onChange, permissions = [], onSignOut, session }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">S</div>
        <div>
          <div className="brand-title">SocketObit</div>
          <div className="brand-subtitle">{session?.user?.email || "Signed out"}</div>
        </div>
      </div>
      <nav className="nav-list">
        {NAV.filter((item) => !item.permission || permissions.includes(item.permission)).map((item) => (
          <button key={item.key} type="button" className={`nav-item ${active === item.key ? "active" : ""}`} onClick={() => onChange(item.key)}>
            {item.label}
          </button>
        ))}
      </nav>
      <button type="button" className="btn small" onClick={onSignOut}>Sign out</button>
    </aside>
  );
}
