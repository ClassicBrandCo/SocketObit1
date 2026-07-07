import { useCallback, useEffect, useState } from "react";

const api = window.socketobit;

export function useRoles(orgId) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(Boolean(orgId));
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!orgId) {
      setRoles([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setRoles(await api.roles.list(orgId));
    } catch (err) {
      setError(err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    roles,
    loading,
    error,
    reload,
    createRole: async (payload) => {
      const result = await api.roles.create(payload);
      await reload();
      return result;
    },
    updateRole: async (payload) => {
      const result = await api.roles.update(payload);
      await reload();
      return result;
    },
    deleteRole: async (payload) => {
      const result = await api.roles.delete(payload);
      await reload();
      return result;
    },
  };
}
