import { useCallback, useEffect, useState } from "react";

const api = window.socketobit;

export function useMembers(orgId) {
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [managers, setManagers] = useState([]);
  const [seatLimit, setSeatLimit] = useState(0);
  const [loading, setLoading] = useState(Boolean(orgId));
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!orgId) {
      setMembers([]);
      setGroups([]);
      setManagers([]);
      setSeatLimit(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [nextMembers, nextManagers, nextGroups, nextSeatLimit] = await Promise.all([
        api.members.list(orgId),
        api.members.listPotentialManagers(orgId),
        api.members.listGroups(orgId),
        api.members.getSeatLimit(orgId),
      ]);
      setMembers(nextMembers || []);
      setManagers(nextManagers || []);
      setGroups(nextGroups || []);
      setSeatLimit(nextSeatLimit || 0);
    } catch (err) {
      setError(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    members,
    groups,
    managers,
    seatLimit,
    loading,
    error,
    reload,
    createMember: async (payload) => {
      const result = await api.members.create(payload);
      await reload();
      return result;
    },
    updateMember: async (payload) => {
      const result = await api.members.update(payload);
      await reload();
      return result;
    },
    deleteMember: async (payload) => {
      const result = await api.members.delete(payload);
      await reload();
      return result;
    },
  };
}
