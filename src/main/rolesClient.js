import { getSupabase } from "./supabaseClient.js";
import { toClientError } from "./authClient.js";

function client() {
  const supabase = getSupabase();
  if (!supabase) throw toClientError("Configuration is missing");
  return supabase;
}

export async function listRoles(orgId) {
  try {
    const supabase = client();
    const { data, error } = await supabase.from("roles").select("id,name,is_system,org_id,created_at").eq("org_id", orgId).order("created_at", { ascending: true });
    if (error) throw error;
    const items = await Promise.all((data || []).map(async (role) => {
      const permissions = await supabase.rpc("get_role_permissions", { p_role_id: role.id });
      return { ...role, permission_keys: permissions.data || [] };
    }));
    return items;
  } catch (error) {
    throw toClientError(error, "Unable to load roles");
  }
}

export async function createRole({ orgId, name, permissionKeys }) {
  try {
    const supabase = client();
    const { data, error } = await supabase.rpc("upsert_role", {
      p_org_id: orgId,
      p_name: name,
      p_permission_keys: permissionKeys,
      p_role_id: null,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw toClientError(error, "Unable to create role");
  }
}

export async function updateRole({ orgId, roleId, name, permissionKeys }) {
  try {
    const supabase = client();
    const { data, error } = await supabase.rpc("upsert_role", {
      p_org_id: orgId,
      p_name: name,
      p_permission_keys: permissionKeys,
      p_role_id: roleId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw toClientError(error, "Unable to update role");
  }
}

export async function deleteRole({ roleId }) {
  try {
    const supabase = client();
    const { error } = await supabase.rpc("delete_role", { p_role_id: roleId });
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    throw toClientError(error, "Unable to delete role");
  }
}
