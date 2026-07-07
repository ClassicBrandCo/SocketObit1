import { useState } from "react";

export default function ProxyModal({ proxy, onSave, onClose }) {
  const [value, setValue] = useState(proxy || { host: "", port: "", protocol: "http", username: "", password_encrypted: "", provider_key: "" });

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{proxy ? "Edit proxy" : "Add proxy"}</h2>
        {[
          ["host", "Host"],
          ["port", "Port"],
          ["protocol", "Protocol"],
          ["username", "Username"],
          ["password_encrypted", "Password"],
          ["provider_key", "Provider key"],
        ].map(([key, label]) => (
          <label key={key} className="field"><span>{label}</span><input value={value[key] || ""} onChange={(event) => setValue({ ...value, [key]: event.target.value })} /></label>
        ))}
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="button" className="btn primary" onClick={() => onSave(value)}>Save</button>
        </div>
      </div>
    </div>
  );
}
