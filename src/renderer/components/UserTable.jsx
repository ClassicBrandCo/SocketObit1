export default function UserTable({ members = [], onEdit, onDelete, currentUserId }) {
  return (
    <table className="users-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Quota</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.display_name}</td>
            <td>{member.email}</td>
            <td>{member.role_name}</td>
            <td>{member.status ? "Active" : "Inactive"}</td>
            <td>{member.allocated_quota ?? "--"}</td>
            <td className="table-actions">
              <button type="button" className="btn small" onClick={() => onEdit(member)}>Edit</button>
              {member.user_id !== currentUserId ? <button type="button" className="btn small danger" onClick={() => onDelete(member)}>Delete</button> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
