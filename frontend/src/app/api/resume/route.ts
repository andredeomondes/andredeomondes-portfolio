import { isAdminRequest } from "@/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/server/http";
import { getResume, getResumeForSite, publishResumeToSite, saveResume } from "@/server/services/resume";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");
    const data = mode === "site"
      ? await getResumeForSite()
      : await getResume();
    return jsonOk(data ?? { content: "", ats_score: null, ats_feedback: null });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  try {
    const { content, publish = false, atsFeedback = null } = await request.json();
    const data = await saveResume(content);
    if (publish) {
      await publishResumeToSite(content, atsFeedback);
    }
    return jsonOk(data);
  } catch (e) {
    return jsonError(e);
  }
}
