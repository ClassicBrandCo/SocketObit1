import { useEffect, useState } from "react";

const api = window.socketobit;

export default function SettingsView() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.settings.get().then(setSettings);
  }, []);

  if (!settings) {
    return <div className="screen"><div className="panel">Loading settings…</div></div>;
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h1>Settings</h1>
          <p className="muted">Local app settings stored on this machine.</p>
        </div>
      </div>
      <div className="panel">
        {[
          ["defaultStartUrl", "Default start URL"],
          ["proxyTestUrl", "Proxy test URL"],
          ["proxyTestTimeoutMs", "Proxy test timeout (ms)"],
        ].map(([key, label]) => (
          <label key={key} className="field"><span>{label}</span><input value={settings[key]} onChange={(event) => setSettings({ ...settings, [key]: key === "proxyTestTimeoutMs" ? Number(event.target.value) : event.target.value })} /></label>
        ))}
        <button type="button" className="btn primary" onClick={() => api.settings.set(settings)}>Save</button>
      </div>
    </div>
  );
}
