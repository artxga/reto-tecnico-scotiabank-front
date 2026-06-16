import { NextResponse } from "next/server";
import { getMockRequests, addMockRequest, delay } from "@/lib/data";
import { RequestCreateInput, Request as RequestModel } from "@/lib/types";

export async function GET() {
  await delay(800);
  return NextResponse.json(getMockRequests());
}

export async function POST(request: Request) {
  await delay(800);
  try {
    const body: RequestCreateInput = await request.json();

    if (!body.title || !body.description || !body.category || !body.priority || !body.requester) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRequest: RequestModel = {
      id: Math.random().toString(36).substr(2, 9),
      title: body.title,
      description: body.description,
      status: "pending",
      priority: body.priority,
      category: body.category,
      requester: body.requester,
      creationDate: new Date().toISOString(),
      lastChangeDate: new Date().toISOString(),
    };

    addMockRequest(newRequest);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
