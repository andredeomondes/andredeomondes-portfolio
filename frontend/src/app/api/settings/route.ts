import { isAdminRequest } from "@/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/server/http";
import { getSettings, upsertSettings } from "@/server/services/settings";

export async function GET() {
  try {
    return jsonOk(await getSettings());
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    await upsertSettings(body);
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}
