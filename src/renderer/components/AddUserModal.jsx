import { useMemo, useState } from "react";
import MemberFormFields from "./MemberFormFields.jsx";

const defaultForm = (roles, managers, groups) => ({
  email: "",
  password: "",
  displayName: "",
  loginUsername: "",
  roleId: roles[0]?.id || "",
  dataRole: "member",
  managerId: managers[0]?.id || "",
  groupIds: [],
  allocatedQuota: 0,
});

export default function AddUserModal({ roles = [], managers = [], groups = [], onSave, onClose }) {
  const initial = useMemo(() => defaultForm(roles, managers, groups), [roles, managers, groups]);
  const [value, setValue] = useState(initial);

  return (
    <div className="modal-overlay">
      <div className="modal modal-wide">
        <h2>Add member</h2>
        <MemberFormFields value={value} onChange={setValue} roles={roles} managers={managers} groups={groups} />
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="button" className="btn primary" onClick={() => onSave(value)}>Create</button>
        </div>
      </div>
    </div>
  );
}
