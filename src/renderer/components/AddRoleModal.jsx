import { useState } from "react";
import PermissionTree from "./PermissionTree.jsx";

export default function AddRoleModal({ role, onSave, onClose }) {
  const [name, setName] = useState(role?.name || "");
  const [permissionKeys, setPermissionKeys] = useState(role?.permission_keys || []);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{role ? "Edit role" : "Add role"}</h2>
        <label className="auth-field"><span>Role name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <PermissionTree value={permissionKeys} onChange={setPermissionKeys} />
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="button" className="btn primary" onClick={() => onSave({ name, permissionKeys, roleId: role?.id || null })}>Save</button>
        </div>
      </div>
    </div>
  );
}
