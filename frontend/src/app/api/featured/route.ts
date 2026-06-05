import { isAdminRequest } from "@/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/server/http";
import { getFeaturedProjects, setFeaturedProjects } from "@/server/services/projects";

export async function GET() {
  try {
    return jsonOk(await getFeaturedProjects());
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  const { ids } = await request.json();
  if (!Array.isArray(ids) || ids.length > 3)
    return jsonError("Provide up to 3 IDs", 400);
  try {
    await setFeaturedProjects(ids);
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}
