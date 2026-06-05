import { isAdminRequest } from "@/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/server/http";
import { analyzeATS, getResume, saveATSResult } from "@/server/services/resume";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  const { content, save = false } = await request.json();
  if (!content) return jsonError("Content required", 400);

  const result = await analyzeATS(content);

  if (save) {
    try {
      const resume = await getResume();
      if (resume) await saveATSResult(resume.id, result);
    } catch {}
  }

  return jsonOk(result);
}
