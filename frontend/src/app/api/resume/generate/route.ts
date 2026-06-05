import { isAdminRequest } from "@/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/server/http";
import { generateResumeFromProjects } from "@/server/services/resume";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  try {
    const body = await request.json().catch(() => ({}));
    return jsonOk(await generateResumeFromProjects(body));
  } catch (error) {
    return jsonError(error);
  }
}
