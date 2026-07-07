import { getSupabase } from "./supabaseClient.js";

export function toClientError(error, fallbackMessage = "Request failed") {
  const message = typeof error === "string" ? error : error?.message || fallbackMessage;
  const normalized = new Error(message);
  normalized.isClientError = true;
  normalized.details = error?.details || error?.hint || null;
  normalized.status = error?.status || error?.code || null;
  return normalized;
}

function getClient() {
  const client = getSupabase();
  if (!client) {
    throw toClientError("Configuration is missing");
  }
  return client;
}

async function bootstrapIfNeeded(email, orgName) {
  const client = getClient();
  const { data: memberships } = await client.from("my_memberships").select("org_id");
  if (!memberships || memberships.length === 0) {
    await client.rpc("bootstrap_organization", { p_name: orgName || email.split("@")[0] || "New Organization" });
  }
}

export async function signUp({ email, password, orgName }) {
  try {
    const client = getClient();
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    if (data.session) {
      await bootstrapIfNeeded(email, orgName);
    }
    return data;
  } catch (error) {
    throw toClientError(error, "Unable to sign up");
  }
}

export async function signIn({ email, password }) {
  try {
    const client = getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await bootstrapIfNeeded(email);
    return data;
  } catch (error) {
    throw toClientError(error, "Unable to sign in");
  }
}

export async function signOut() {
  try {
    const client = getClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    throw toClientError(error, "Unable to sign out");
  }
}

export async function getSession() {
  try {
    const client = getClient();
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    throw toClientError(error, "Unable to load session");
  }
}

export async function getCurrentOrgIds() {
  try {
    const client = getClient();
    const { data, error } = await client.rpc("current_org_ids");
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw toClientError(error, "Unable to load organizations");
  }
}
