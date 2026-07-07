import { useState } from "react";
import MemberFormFields from "./MemberFormFields.jsx";

export default function EditUserModal({ member, roles = [], managers = [], groups = [], onSave, onClose }) {
  const [value, setValue] = useState({
    email: member.email || "",
    password: "",
    displayName: member.display_name || "",
    loginUsername: member.login_username || "",
    roleId: member.role_id || roles[0]?.id || "",
    dataRole: member.data_role || "member",
    managerId: member.manager_id || "",
    groupIds: member.group_ids || [],
    allocatedQuota: member.allocated_quota || 0,
  });

  return (
    <div className="modal-overlay">
      <div className="modal modal-wide">
        <h2>Edit member</h2>
        <MemberFormFields value={value} onChange={setValue} roles={roles} managers={managers} groups={groups} />
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="button" className="btn primary" onClick={() => onSave({ ...value, memberId: member.id })}>Update</button>
        </div>
      </div>
    </div>
  );
}
