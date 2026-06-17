import { NextResponse } from "next/server";
import { getMockRequests, addMockRequest, delay } from "@/lib/data";
import { Request as RequestModel } from "@/lib/types";
import { requestSchema } from "@/lib/validations";

export async function GET() {
  await delay(800);
  const requests = await getMockRequests();
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  await delay(800);
  try {
    const body = await request.json();

    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newRequest: RequestModel = {
      id: Math.random().toString(36).substring(2, 11),
      title: data.title,
      description: data.description,
      status: "pending",
      priority: data.priority,
      category: data.category,
      requester: data.requester,
      creationDate: new Date().toISOString(),
      lastChangeDate: new Date().toISOString(),
    };

    await addMockRequest(newRequest);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON data structure" }, { status: 400 });
  }
}
