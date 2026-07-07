// src/lib/sanity.ts
import createClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-07-05";

const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

async function browserFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch("/api/sanity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, params }),
  });

  if (!response.ok) {
    throw new Error("Unable to load Sanity content");
  }

  const payload = (await response.json()) as { data: T };
  return payload.data;
}

export const client = {
  fetch<T = unknown>(query: string, params: Record<string, unknown> = {}) {
    if (typeof window !== "undefined") {
      return browserFetch<T>(query, params);
    }

    return serverClient.fetch<T>(query, params);
  },
};

// Strongly typed fetch helper
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return client.fetch<T>(query, params);
}

// Properly typed urlFor
const builder = imageUrlBuilder({ projectId, dataset });
export const urlFor = (source: SanityImageSource) =>
  builder.image(source);
