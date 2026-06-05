import { NextResponse } from "next/server";
import { isAdminRequest } from "@/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/server/http";
import { deleteProject, getProjectForRequest, updateProject } from "@/server/services/projects";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await getProjectForRequest(id, await isAdminRequest());
    if (!data) return jsonError("Not found", 404);
    return jsonOk(data);
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const data = await updateProject(id, body);
    return jsonOk(data);
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  const { id } = await params;
  try {
    await deleteProject(id);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return jsonError(e);
  }
}
