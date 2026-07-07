const MODULES = [
  { key: "browser_profiles", label: "Browser Profiles" },
  { key: "cloud_phone", label: "Cloud Phone" },
  { key: "rpa", label: "RPA" },
  { key: "groups", label: "Groups" },
  { key: "proxy_ip", label: "Proxies" },
  { key: "extensions", label: "Extensions" },
  { key: "users", label: "Users" },
  { key: "referral", label: "Referral" },
  { key: "settings", label: "Settings" },
  { key: "operation_logs", label: "Operation Logs" },
  { key: "help", label: "Help" },
  { key: "qna", label: "Q&A" },
  { key: "recycle_bin", label: "Recycle Bin" },
];

export default function PermissionTree({ value = [], onChange }) {
  const toggle = (key) => onChange(value.includes(key) ? value.filter((item) => item !== key) : [...value, key]);
  return (
    <div className="perm-tree">
      {MODULES.map((module) => (
        <label key={module.key} className="perm-node perm-checkbox-label">
          <input type="checkbox" checked={value.includes(module.key)} onChange={() => toggle(module.key)} />
          <span>{module.label}</span>
        </label>
      ))}
    </div>
  );
}
