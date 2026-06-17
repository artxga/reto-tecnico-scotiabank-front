import { NextResponse } from "next/server";
import { getMockRequest, updateMockRequest, deleteMockRequest, delay } from "@/lib/data";
import { Priority } from "@/lib/types";
import { requestSchema, updatePrioritySchema } from "@/lib/validations";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(500);
  const { id } = await params;
  const request = await getMockRequest(id);

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
  const request = await getMockRequest(id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    // Partial validate body
    const validation = requestSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    await updateMockRequest(id, validation.data);

    const updated = await getMockRequest(id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON data structure" }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(800);
  const { id } = await params;
  const request = await getMockRequest(id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    // Validate update priority schema
    const validation = updatePrioritySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    await updateMockRequest(id, { priority: validation.data.priority as Priority });

    const updated = await getMockRequest(id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON data structure" }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(800);
  const { id } = await params;
  const request = await getMockRequest(id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  await updateMockRequest(id, { status: "closed" });

  return NextResponse.json({ message: "Request marked as closed successfully" });
}
