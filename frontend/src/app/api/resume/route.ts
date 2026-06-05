import { NextResponse } from "next/server";
import { getResume, saveResume } from "@portfolio/backend";

export async function GET() {
  try {
    const data = await getResume();
    return NextResponse.json(data ?? { content: "", ats_score: null, ats_feedback: null });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { content } = await request.json();
    const data = await saveResume(content);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
