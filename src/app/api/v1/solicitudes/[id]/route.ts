import { NextResponse } from "next/server";
import { getMockRequests, updateMockRequest, delay } from "@/lib/data";
import { Priority, RequestUpdateInput } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(500);
  const { id } = await params;
  const request = getMockRequests().find((req) => req.id === id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json(request);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(800);
  const { id } = await params;
  const request = getMockRequests().find((req) => req.id === id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  try {
    const body: RequestUpdateInput = await req.json();
    updateMockRequest(id, body);

    const updated = getMockRequests().find((req) => req.id === id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(800);
  const { id } = await params;
  const request = getMockRequests().find((req) => req.id === id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  try {
    const body: { priority: string } = await req.json();

    updateMockRequest(id, { priority: body.priority as Priority });

    const updated = getMockRequests().find((req) => req.id === id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(800);
  const { id } = await params;
  const request = getMockRequests().find((req) => req.id === id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  updateMockRequest(id, { status: "closed" });

  return NextResponse.json({ message: "Request marked as closed successfully" });
}
