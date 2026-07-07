import { useEffect, useState, useCallback } from "react";

const api = window.socketobit;

export function useAuth() {
  const [session, setSession] = useState(null);
  const [orgIds, setOrgIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextSession = await api.auth.getSession();
      setSession(nextSession || null);
      const nextOrgIds = nextSession ? await api.auth.getOrgIds() : [];
      setOrgIds(nextOrgIds || []);
    } catch (err) {
      setError(err);
      setSession(null);
      setOrgIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    session,
    orgIds,
    loading,
    error,
    refresh,
    signIn: async (payload) => {
      const result = await api.auth.signIn(payload);
      await refresh();
      return result;
    },
    signUp: async (payload) => {
      const result = await api.auth.signUp(payload);
      await refresh();
      return result;
    },
    signOut: async () => {
      const result = await api.auth.signOut();
      await refresh();
      return result;
    },
  };
}
