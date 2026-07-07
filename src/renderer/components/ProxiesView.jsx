import { useEffect, useState } from "react";
import ProxyModal from "./ProxyModal.jsx";

const api = window.socketobit;

export default function ProxiesView() {
  const [proxies, setProxies] = useState([]);
  const [editing, setEditing] = useState(null);

  const refresh = async () => setProxies(await api.proxies.list());

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h1>Proxies</h1>
          <p className="muted">Local proxy presets and connection checks.</p>
        </div>
        <button className="btn primary" type="button" onClick={() => setEditing({})}>Add proxy</button>
      </div>
      <div className="panel">
        {proxies.map((proxy) => <div key={proxy.id} className="role-list-item"><div><strong>{proxy.host}:{proxy.port}</strong><div className="muted">{proxy.protocol}</div></div><div className="table-actions"><button className="btn small" type="button" onClick={() => setEditing(proxy)}>Edit</button><button className="btn small danger" type="button" onClick={async () => { await api.proxies.delete({ id: proxy.id }); refresh(); }}>Delete</button></div></div>)}
      </div>
      {editing ? <ProxyModal proxy={editing.id ? editing : null} onClose={() => setEditing(null)} onSave={async (value) => { if (editing.id) { await api.proxies.update({ id: editing.id, patch: value }); } else { await api.proxies.create(value); } setEditing(null); refresh(); }} /> : null}
    </div>
  );
}
