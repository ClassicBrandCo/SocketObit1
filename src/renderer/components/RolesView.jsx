import { useState } from "react";
import AddRoleModal from "./AddRoleModal.jsx";

export default function RolesView({ orgId, roles = [], loading, error, onCreate, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h1>Roles</h1>
          <p className="muted">Permission tree and role assignments.</p>
        </div>
        <button className="btn primary" type="button" onClick={() => setEditing({ id: null, name: "", permission_keys: [] })}>Add role</button>
      </div>
      {error ? <div className="toast error">{error.message}</div> : null}
      {loading ? <div className="panel">Loading…</div> : (
        <div className="panel">
          {roles.map((role) => (
            <div key={role.id} className="role-list-item">
              <div>
                <strong>{role.name}</strong>
                <div className="muted">{(role.permission_keys || []).join(", ") || "No permissions"}</div>
              </div>
              <div className="table-actions">
                <button className="btn small" type="button" onClick={() => setEditing(role)}>Edit</button>
                {!role.is_system ? <button className="btn small danger" type="button" onClick={() => onDelete({ roleId: role.id })}>Delete</button> : null}
              </div>
            </div>
          ))}
        </div>
      )}
      {editing ? (
        <AddRoleModal
          role={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={async ({ name, permissionKeys, roleId }) => {
            if (roleId) {
              await onUpdate({ orgId, roleId, name, permissionKeys });
            } else {
              await onCreate({ orgId, name, permissionKeys });
            }
            setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}
