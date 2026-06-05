import { isAdminRequest } from "@/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/server/http";
import { createProject, listProjects } from "@/server/services/projects";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  if (all && !(await isAdminRequest())) {
    return unauthorized();
  }

  try {
    return jsonOk(await listProjects(all));
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const data = await createProject(body);
    return jsonOk(data, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}
