export default function MemberFormFields({ value, onChange, roles = [], managers = [], groups = [] }) {
  const update = (key, nextValue) => onChange({ ...value, [key]: nextValue });
  const toggleGroup = (groupId) => {
    const next = value.groupIds.includes(groupId) ? value.groupIds.filter((id) => id !== groupId) : [...value.groupIds, groupId];
    update("groupIds", next);
  };

  return (
    <div className="member-form-grid">
      <label className="field"><span>Email</span><input value={value.email} onChange={(event) => update("email", event.target.value)} /></label>
      <label className="field"><span>Password</span><input type="password" value={value.password} onChange={(event) => update("password", event.target.value)} /></label>
      <label className="field"><span>Display name</span><input value={value.displayName} onChange={(event) => update("displayName", event.target.value)} /></label>
      <label className="field"><span>Login username</span><input value={value.loginUsername} onChange={(event) => update("loginUsername", event.target.value)} /></label>
      <label className="field"><span>Role</span><select value={value.roleId} onChange={(event) => update("roleId", event.target.value)}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
      <label className="field"><span>Data role</span><input value={value.dataRole} onChange={(event) => update("dataRole", event.target.value)} /></label>
      <label className="field"><span>Manager</span><select value={value.managerId} onChange={(event) => update("managerId", event.target.value)}><option value="">None</option>{managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.display_name}</option>)}</select></label>
      <label className="field"><span>Allocated quota</span><input type="number" value={value.allocatedQuota} onChange={(event) => update("allocatedQuota", Number(event.target.value))} /></label>
      <div className="field field-span-2"><span>Groups</span><div className="group-chip-grid">{groups.map((group) => <button key={group.id} type="button" className={`badge ${value.groupIds.includes(group.id) ? "badge-system" : ""}`} onClick={() => toggleGroup(group.id)}>{group.name}</button>)}</div></div>
    </div>
  );
}
