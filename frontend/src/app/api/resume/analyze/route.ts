import { NextResponse } from "next/server";
import { analyzeATS, saveATSResult, getResume } from "@portfolio/backend";

export async function POST(request: Request) {
  const { content, save = false } = await request.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const result = analyzeATS(content);

  if (save) {
    try {
      const resume = await getResume();
      if (resume) await saveATSResult(resume.id, result);
    } catch {}
  }

  return NextResponse.json(result);
}
