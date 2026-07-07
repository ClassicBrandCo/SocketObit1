import { getSupabase, getConfig } from "./supabaseClient.js";
import { toClientError } from "./authClient.js";

function client() {
  const supabase = getSupabase();
  if (!supabase) throw toClientError("Configuration is missing");
  return supabase;
}

async function edgeFetch(slug, body) {
  const supabase = client();
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;
  const config = getConfig();
  const response = await fetch(`${config.SUPABASE_URL}/functions/v1/${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.SUPABASE_ANON_KEY,
      Authorization: session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${config.SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || text || `Edge function ${slug} failed`);
  }
  return payload;
}

export async function listMembers(orgId) {
  try {
    const supabase = client();
    const { data, error } = await supabase.rpc("list_org_members", { p_org_id: orgId });
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw toClientError(error, "Unable to load members");
  }
}

export async function listPotentialManagers(orgId) {
  try {
    const supabase = client();
    const { data, error } = await supabase.rpc("list_potential_managers", { p_org_id: orgId });
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw toClientError(error, "Unable to load potential managers");
  }
}

export async function listGroups(orgId) {
  try {
    const supabase = client();
    const { data, error } = await supabase.from("profile_groups").select("id,name,org_id,created_at").eq("org_id", orgId).order("name");
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw toClientError(error, "Unable to load groups");
  }
}

export async function getSeatLimit(orgId) {
  try {
    const supabase = client();
    const { data, error } = await supabase.from("organizations").select("seat_limit").eq("id", orgId).single();
    if (error) throw error;
    return data?.seat_limit ?? 0;
  } catch (error) {
    throw toClientError(error, "Unable to load seat limit");
  }
}

export async function createMember(payload) {
  try {
    return await edgeFetch("create-member", payload);
  } catch (error) {
    throw toClientError(error, "Unable to create member");
  }
}

export async function updateMember(payload) {
  try {
    return await edgeFetch("update-member", payload);
  } catch (error) {
    throw toClientError(error, "Unable to update member");
  }
}

export async function deleteMember(payload) {
  try {
    return await edgeFetch("delete-member", payload);
  } catch (error) {
    throw toClientError(error, "Unable to delete member");
  }
}
