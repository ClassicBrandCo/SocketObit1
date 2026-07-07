import { useEffect, useState } from "react";
import ProfileWizard from "./ProfileWizard.jsx";

const api = window.socketobit;

export default function ProfilesView() {
  const [profiles, setProfiles] = useState([]);
  const [showWizard, setShowWizard] = useState(false);

  const refresh = async () => setProfiles(await api.profiles.list());

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h1>Profiles</h1>
          <p className="muted">Local profile manager while the backend catches up.</p>
        </div>
        <button className="btn primary" type="button" onClick={() => setShowWizard(true)}>New profile</button>
      </div>
      <div className="panel">
        {profiles.map((profile) => <div key={profile.id} className="role-list-item"><div><strong>{profile.name}</strong><div className="muted">{profile.remark}</div></div><span className="badge">{profile.status}</span></div>)}
      </div>
      {showWizard ? <div className="modal-overlay"><div className="modal modal-wide"><ProfileWizard onClose={() => setShowWizard(false)} onSave={async (value) => { await api.profiles.create(value); setShowWizard(false); refresh(); }} /></div></div> : null}
    </div>
  );
}
