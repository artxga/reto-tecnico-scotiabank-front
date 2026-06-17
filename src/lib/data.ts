import { Request } from "./types";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getMockRequests(): Promise<Request[]> {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("creationDate", { ascending: false });

  if (error) {
    console.error("Supabase Error during GET:", error);
    return [];
  }

  return data as Request[];
}

export async function getMockRequest(id: string | number): Promise<Request | undefined> {
  const { data, error } = await supabase.from("requests").select("*").eq("id", String(id)).single();

  if (error) {
    console.error("Supabase Error during GET by ID:", error);
    return undefined;
  }

  return data as Request;
}

export async function addMockRequest(request: Request) {
  const { error } = await supabase.from("requests").insert([request]);

  if (error) {
    console.error("Supabase Error during POST:", error);
  }
}

export async function updateMockRequest(id: string | number, updates: Partial<Request>) {
  const { error } = await supabase
    .from("requests")
    .update({ ...updates, lastChangeDate: new Date().toISOString() })
    .eq("id", String(id));

  if (error) {
    console.error("Supabase Error during PUT:", error);
  }
}

export async function deleteMockRequest(id: string | number) {
  const { error } = await supabase.from("requests").delete().eq("id", String(id));

  if (error) {
    console.error("Supabase Error during DELETE:", error);
  }
}

// export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
