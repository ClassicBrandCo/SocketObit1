import { useState } from "react";
import AddUserModal from "./AddUserModal.jsx";
import EditUserModal from "./EditUserModal.jsx";
import UserTable from "./UserTable.jsx";

export default function UsersView({ orgId, members = [], roles = [], groups = [], managers = [], loading, error, seatLimit, currentUserId, onCreate, onUpdate, onDelete }) {
  const [mode, setMode] = useState(null);
  const selectedMember = mode?.type === "edit" ? mode.member : null;

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h1>Users</h1>
          <p className="muted">Members in the selected organization.</p>
        </div>
        <button className="btn primary" type="button" onClick={() => setMode({ type: "add" })}>Add user</button>
      </div>
      <div className="panel">
        <div className="summary-row">
          <span className="badge badge-system">Seat limit: {seatLimit}</span>
          <span className="badge">Org: {orgId || "—"}</span>
        </div>
        {error ? <div className="toast error">{error.message}</div> : null}
        {loading ? <div className="skeleton-row" /> : <UserTable members={members} currentUserId={currentUserId} onEdit={(member) => setMode({ type: "edit", member })} onDelete={(member) => onDelete({ orgId, memberId: member.id, memberName: member.display_name, hardDelete: false })} />}
      </div>
      {mode?.type === "add" ? <AddUserModal roles={roles} managers={managers} groups={groups} onClose={() => setMode(null)} onSave={async (value) => { await onCreate({ orgId, ...value }); setMode(null); }} /> : null}
      {selectedMember ? <EditUserModal member={selectedMember} roles={roles} managers={managers} groups={groups} onClose={() => setMode(null)} onSave={async (value) => { await onUpdate({ orgId, memberId: selectedMember.id, ...value }); setMode(null); }} /> : null}
    </div>
  );
}
