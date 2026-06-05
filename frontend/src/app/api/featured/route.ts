import { NextResponse } from "next/server";
import { getFeaturedProjects, setFeaturedProjects } from "@portfolio/backend";

export async function GET() {
  try {
    return NextResponse.json(await getFeaturedProjects());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { ids } = await request.json();
  if (!Array.isArray(ids) || ids.length > 3)
    return NextResponse.json({ error: "Provide up to 3 IDs" }, { status: 400 });
  try {
    await setFeaturedProjects(ids);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
