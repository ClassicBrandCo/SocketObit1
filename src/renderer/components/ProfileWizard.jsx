import { useState } from "react";

export default function ProfileWizard({ onSave, onClose }) {
  const [value, setValue] = useState({ name: "", remark: "", deviceProfileId: "win11-chrome" });
  return (
    <div className="panel">
      <h3>Profile wizard</h3>
      <label className="field"><span>Name</span><input value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /></label>
      <label className="field"><span>Remark</span><textarea value={value.remark} onChange={(event) => setValue({ ...value, remark: event.target.value })} /></label>
      <label className="field"><span>Device profile</span><select value={value.deviceProfileId} onChange={(event) => setValue({ ...value, deviceProfileId: event.target.value })}><option value="win11-chrome">Windows 11 / Chrome</option><option value="win10-edge">Windows 10 / Edge</option><option value="mac-safari">macOS / Safari</option></select></label>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button type="button" className="btn primary" onClick={() => onSave(value)}>Save</button>
      </div>
    </div>
  );
}
