
import type { LinkInput, LinkItem } from "@/types";

const API_URL = "http://localhost:3000/api/links";

async function request<T>(
  path = "",
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Permintaan gagal");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function readLinks(): Promise<LinkItem[]> {
  return request<LinkItem[]>();
}

export function createLink(input: LinkInput): Promise<LinkItem> {
  return request<LinkItem>("", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteLink(id: string): Promise<void> {
  return request<void>(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}