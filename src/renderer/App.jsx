import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import { useRoles } from "./hooks/useRoles.js";
import { useMembers } from "./hooks/useMembers.js";
import AuthView from "./views/AuthView.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProfilesView from "./components/ProfilesView.jsx";
import ProxiesView from "./components/ProxiesView.jsx";
import RolesView from "./components/RolesView.jsx";
import UsersView from "./components/UsersView.jsx";
import SettingsView from "./components/SettingsView.jsx";
import Toasts from "./components/Toasts.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const toastId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function App() {
  const auth = useAuth();
  const [activeView, setActiveView] = useState("profiles");
  const [toasts, setToasts] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const rolesState = useRoles(selectedOrgId);
  const membersState = useMembers(selectedOrgId);

  const currentMember = useMemo(() => membersState.members.find((member) => member.user_id === auth.session?.user?.id) || null, [membersState.members, auth.session]);
  const currentRole = useMemo(() => rolesState.roles.find((role) => role.id === currentMember?.role_id) || null, [rolesState.roles, currentMember]);
  const permissions = currentRole?.permission_keys || [];

  useEffect(() => {
    if (!selectedOrgId && auth.orgIds.length > 0) {
      setSelectedOrgId(auth.orgIds[0]);
    }
  }, [auth.orgIds, selectedOrgId]);

  const notify = (message, kind = "success") => setToasts((items) => [...items, { id: toastId(), message, kind }]);

  const handleAuth = async (payload) => {
    try {
      if (payload.mode === "signUp") {
        await auth.signUp(payload);
      } else {
        await auth.signIn(payload);
      }
      notify("Authenticated successfully");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setSelectedOrgId(null);
      setActiveView("profiles");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  if (!auth.session) {
    return <AuthView onAuthenticated={handleAuth} error={auth.error} clearError={() => {}} />;
  }

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <Sidebar active={activeView} onChange={setActiveView} permissions={permissions} onSignOut={handleSignOut} session={auth.session} />
        <main className="content">
          {activeView === "profiles" ? <ProfilesView /> : null}
          {activeView === "proxies" ? <ProxiesView /> : null}
          {activeView === "roles" ? <RolesView orgId={selectedOrgId} roles={rolesState.roles} loading={rolesState.loading} error={rolesState.error} onCreate={async (payload) => { await rolesState.createRole(payload); notify("Role created"); }} onUpdate={async (payload) => { await rolesState.updateRole(payload); notify("Role updated"); }} onDelete={async (payload) => { await rolesState.deleteRole(payload); notify("Role deleted"); }} /> : null}
          {activeView === "users" ? <UsersView orgId={selectedOrgId} members={membersState.members} roles={rolesState.roles} groups={membersState.groups} managers={membersState.managers} loading={membersState.loading} error={membersState.error} seatLimit={membersState.seatLimit} currentUserId={auth.session?.user?.id} onCreate={async (payload) => { await membersState.createMember(payload); notify("Member created"); }} onUpdate={async (payload) => { await membersState.updateMember(payload); notify("Member updated"); }} onDelete={async (payload) => { await membersState.deleteMember(payload); notify("Member deleted"); }} /> : null}
          {activeView === "settings" ? <SettingsView /> : null}
        </main>
        <Toasts items={toasts} onDismiss={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />
      </div>
    </ErrorBoundary>
  );
}
