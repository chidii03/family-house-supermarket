import { NextResponse } from "next/server";
import createClient from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-07-05",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      query?: unknown;
      params?: Record<string, unknown>;
    };

    if (typeof body.query !== "string" || body.query.trim().length === 0) {
      return NextResponse.json({ error: "Missing Sanity query" }, { status: 400 });
    }

    const data = await client.fetch(body.query, body.params || {});
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Unable to load Sanity content" },
      { status: 500 }
    );
  }
}
