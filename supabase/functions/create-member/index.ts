// Mirror of the deployed SocketObit backend.
import { jsonResponse } from "../_shared/response.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return jsonResponse({});
  }
  const body = await request.json();
  return jsonResponse({ ok: true, action: "create-member", body });
});
